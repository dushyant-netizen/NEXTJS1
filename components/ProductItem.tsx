"use client";

// *********************
// Role of the component: Product item component with interactive global wishlist toggles
// Name of the component: ProductItem.tsx
// Developer: Aleksandar Kuzmanovic (Updated)
// Version: 1.1
// Component call: <ProductItem product={product} color={color} />
// Input parameters: { product: Product; color: string; }
// Output: Elegant grid item container with floating dynamic favorite interaction layers
// *********************

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useSession } from "next-auth/react";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import { sanitize } from "@/lib/sanitize";

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  const { data: session } = useSession();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();

  // Validate if current product item is bookmarked in store
  const isFavorited = wishlist.some((item) => item.id === product.id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user?.email) {
      toast.error("Please log in to save favorites");
      return;
    }

    const wishItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.mainImage || "product_placeholder.jpg",
      slug: product.slug || "",
      stockAvailabillity: product.inStock ?? 1,
    };

    try {
      if (isFavorited) {
        // 1. Client Optimistic UI update
        removeFromWishlist(product.id);
        
        // 2. Server Background Execution
        await apiClient.delete(`/api/wishlist`, {
          body: JSON.stringify({ productId: product.id, email: session.user.email })
        });
        toast.success("Removed from wishlist");
      } else {
        // 1. Client Optimistic UI update
        addToWishlist(wishItem);
        
        // 2. Server Background Execution
        await apiClient.post(`/api/wishlist`, {
          body: JSON.stringify({ product: wishItem, email: session.user.email })
        });
        toast.success("Added to wishlist");
      }
    } catch (error) {
      // Revert Client State on Server Dropouts
      if (isFavorited) {
        addToWishlist(wishItem);
      } else {
        removeFromWishlist(product.id);
      }
      toast.error("Sync failed. Reverting action.");
    }
  };

  const isBlackTheme = color === "black";

  return (
    <div className="group relative flex flex-col justify-between w-full max-w-[360px] bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 overflow-hidden">
      
      {/* Product Image Stage Window */}
      <div className="w-full aspect-square bg-gray-50 rounded-xl mb-3 relative flex items-center justify-center p-4 border border-gray-50 overflow-hidden">
        <Link href={`/product/${product.slug}`} className="relative w-full h-[240px] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <Image
            src={product.mainImage ? `/${product.mainImage}` : "/product_placeholder.jpg"}
            width={0}
            height={0}
            sizes="100vw"
            className="w-auto h-full max-h-[220px] object-contain mix-blend-multiply"
            alt={sanitize(product?.title) || "Product image"}
          />
        </Link>

        {/* --- FLOATING ACCENT HEART TOGGLE --- */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2.5 bg-white hover:bg-gray-50 rounded-full shadow-sm border border-gray-100 transition-all z-20 text-gray-400 hover:text-red-500 active:scale-95"
          title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isFavorited ? (
            <FaHeart className="w-4 h-4 text-red-500 scale-110 transition-transform" />
          ) : (
            <FaRegHeart className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Title Routing Block */}
      <div className="flex flex-col flex-1 px-1 text-left items-start w-full">
        <Link
          href={`/product/${product.slug}`}
          className={`text-sm font-bold truncate w-full group-hover:text-blue-600 transition-colors uppercase ${
            isBlackTheme ? "text-gray-900" : "text-white"
          }`}
        >
          {sanitize(product.title)}
        </Link>

        {/* Price Output Row */}
        <p className="text-base font-extrabold mt-1 mb-4 text-gray-900 drop-shadow-sm">
  ${Number(product.price).toFixed(2)}
</p>

        {/* Action Bottom Redirect Control */}
        <Link
          href={`/product/${product?.slug}`}
          className="mt-auto block flex justify-center items-center w-full uppercase bg-white border border-gray-200 hover:border-gray-400 text-xs font-bold text-blue-600 py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-all text-center tracking-wider"
        >
          View Product
        </Link>
      </div>
    </div>
  );
};

export default ProductItem;
