"use client";

// *********************
// Role of the component: Render an individual row inside the wishlist data table matrix
// Name of the component: WishItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <WishItem id={id} title={title} price={price} image={image} slug={slug} stockAvailabillity={stockAvailabillity} />
// Input parameters: WishItemProps interface
// Output: HTML Table row layout containing images, inventory indicators, and reactive management action controls
// *********************

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useProductStore } from "@/app/_zustand/store"; // Accesses your main active checkout cart store configuration
import { useSession } from "next-auth/react";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import { sanitize } from "@/lib/sanitize";

interface WishItemProps {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockAvailabillity: number;
}

const WishItem = ({
  id,
  title,
  price,
  image,
  slug,
  stockAvailabillity,
}: WishItemProps) => {
  const { data: session } = useSession();
  const { removeFromWishlist } = useWishlistStore();
  const { addToCart, calculateTotals } = useProductStore();

  const isItemInStock = stockAvailabillity > 0;

  // Handler for deleting a item away from database registry arrays
  const handleDeleteItem = async () => {
    if (!session?.user?.email) return;

    try {
      // 1. Optimistic local state extraction
      removeFromWishlist(id);

      // 2. Transmit background deletion sync packets
      await apiClient.delete(`/api/wishlist`, {
        body: JSON.stringify({ productId: id, email: session.user.email }),
      });
      toast.success("Item removed from your wishlist");
    } catch (error) {
      toast.error("Could not sync deletion actions with database");
    }
  };

  // Handler to move items instantly into active checkout queues
  const handleMoveToCart = () => {
    if (!isItemInStock) {
      toast.error("This product is currently out of stock");
      return;
    }

    // Structure properties to match your specified ProductInCart schema models exactly
    addToCart({
      id: id,
      title: title,
      price: price,
      image: image,
      amount: 1, // Defaulting single quantity addition on rapid matrix triggers
    });
    
    calculateTotals();
    toast.success("Successfully added to your shopping cart!");
  };

  return (
    <tr className="hover:bg-gray-50/80 transition-colors border-b border-gray-100">
      {/* Spacer Padding Node */}
      <td className="px-4 py-4"></td>

      {/* Product Image Window Container Cell */}
      <td className="px-6 py-4 flex justify-center">
        <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-lg relative flex items-center justify-center overflow-hidden p-1 shadow-sm">
          <Image
            src={image ? `/${image}` : "/product_placeholder.jpg"}
            alt={title}
            fill
            sizes="64px"
            className="object-contain mix-blend-multiply p-0.5"
          />
        </div>
      </td>

      {/* Product Name & Pricing Metrics Cell */}
      <td className="px-6 py-4 text-center font-medium text-gray-900">
        <Link href={`/product/${slug}`} className="hover:text-blue-600 font-semibold transition-colors uppercase block text-sm max-w-xs mx-auto truncate">
          {sanitize(title)}
        </Link>
        <span className="text-gray-500 text-xs font-bold block mt-0.5">${Number(price).toFixed(2)}</span>
      </td>

      {/* Live Inventory Stock Tracker Condition Icon Cell */}
      <td className="px-6 py-4 text-center">
        {isItemInStock ? (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            In Stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-xs px-2.5 py-1 rounded-full font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Out of Stock
          </span>
        )}
      </td>

      {/* Interaction Action Target Controls Cell */}
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-x-3">
          {/* Quick Add to Active Shopping Basket Trigger Button */}
          <button
            type="button"
            onClick={handleMoveToCart}
            disabled={!isItemInStock}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition-all border ${
              isItemInStock
                ? "bg-blue-600 hover:bg-blue-700 text-white border-transparent active:scale-95 cursor-pointer"
                : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
            }`}
            title={isItemInStock ? "Add to Cart" : "Item Unavailable"}
          >
            <FaShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add to Cart</span>
          </button>

          {/* Quick Item Truncation Delete Button */}
          <button
            type="button"
            onClick={handleDeleteItem}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all active:scale-95"
            title="Remove from favorites"
          >
            <FaTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default WishItem;
