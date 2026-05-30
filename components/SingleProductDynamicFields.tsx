"use client";

// *********************
// Role of the component: Helper component for separating dynamic client component from server component on the single product page with the intention to preserve SEO benefits of Next.js
// Name of the component: SingleProductDynamicFields.tsx
// Developer: Aleksandar Kuzmanovic (Updated)
// Version: 1.1
// Component call: <SingleProductDynamicFields product={product} />
// Input parameters: { product: Product }
// Output: Quantity, add to cart, buy now and global wishlist database synchronization component on the single product page
// *********************

import React, { useState } from "react";
import QuantityInput from "./QuantityInput";
import AddToCartSingleProductBtn from "./AddToCartSingleProductBtn";
import BuyNowSingleProductBtn from "./BuyNowSingleProductBtn";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useSession } from "next-auth/react";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";

const SingleProductDynamicFields = ({ product }: { product: Product }) => {
  const [quantityCount, setQuantityCount] = useState<number>(1);
  const { data: session } = useSession();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();

  // Validate if this specific product is already sitting inside the user's global wishlist array
  const isFavorited = wishlist.some((item) => item.id === product.id);

  const handleWishlistToggle = async () => {
    if (!session?.user?.email) {
      toast.error("Please log in to save favorites");
      return;
    }

    // Explicitly mapping attributes to fit your strict Zustand ProductInWishlist entity structure
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
        
        // 2. Server Background API Sync
        await apiClient.delete(`/api/wishlist`, {
          body: JSON.stringify({ productId: product.id, email: session.user.email })
        });
        toast.success("Removed from wishlist");
      } else {
        // 1. Client Optimistic UI update
        addToWishlist(wishItem);
        
        // 2. Server Background API Sync
        await apiClient.post(`/api/wishlist`, {
          body: JSON.stringify({ product: wishItem, email: session.user.email })
        });
        toast.success("Added to wishlist");
      }
    } catch (error) {
      // Automatic state rollback handler to ensure client-server consistency
      if (isFavorited) {
        addToWishlist(wishItem);
      } else {
        removeFromWishlist(product.id);
      }
      toast.error("Failed to update wishlist. Reverting changes.");
    }
  };

  return (
    <>
      <QuantityInput
        quantityCount={quantityCount}
        setQuantityCount={setQuantityCount}
      />
      {Boolean(product.inStock) && (
        <div className="flex items-center gap-x-5 max-[500px]:flex-col max-[500px]:items-center max-[500px]:gap-y-3 mt-4">
          <div className="flex gap-x-5 flex-1 max-[500px]:w-full max-[500px]:flex-col max-[500px]:gap-y-1">
            <AddToCartSingleProductBtn
              quantityCount={quantityCount}
              product={product}
            />
            <BuyNowSingleProductBtn
              quantityCount={quantityCount}
              product={product}
            />
          </div>

          {/* --- DYNAMIC FULL-STACK WISHLIST ACTION BUTTON --- */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`p-3 rounded-xl border flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm max-[500px]:w-full ${
              isFavorited
                ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                : "bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isFavorited ? (
              <FaHeart className="w-5 h-5 text-red-500 scale-105 transition-transform" />
            ) : (
              <FaRegHeart className="w-5 h-5" />
            )}
            <span className="hidden max-[500px]:inline ml-2 text-sm font-semibold">
              {isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default SingleProductDynamicFields;
