"use client";

import React from "react";
import Link from "next/link";
import { FaHeart } from "react-icons/fa6";

interface HeartElementProps {
  wishQuantity: number;
}

const HeartElement = ({ wishQuantity }: HeartElementProps) => {
  return (
    // 🚀 CRITICAL FIX: Direct the link exactly to your router folder location
    <Link href="/wishlist" className="relative p-2 text-gray-700 hover:text-blue-600 transition-all group" title="View Wishlist">
      <FaHeart className="w-6 h-6 text-gray-800 hover:text-red-500 transition-colors" />
      
      {/* Absolute floating counter badge overlay */}
      {wishQuantity > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-fade-in">
          {wishQuantity}
        </span>
      )}
    </Link>
  );
};

export default HeartElement;
