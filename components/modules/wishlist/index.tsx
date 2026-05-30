"use client"

import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import WishItem from "@/components/WishItem";
import apiClient from "@/lib/api";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const WishlistModule = () => {
  const { data: session } = useSession();
  const { wishlist, setWishlist } = useWishlistStore();

  const getWishlistByUserId = async (id: string) => {
    try {
      const response = await apiClient.get(`/api/wishlist/${id}`, {
        cache: "no-store",
      });
      const data = await response.json();

      const productArray = data.map((item: any) => ({
        id: item?.product?.id,
        title: item?.product?.title,
        price: item?.product?.price,
        image: item?.product?.mainImage,
        slug: item?.product?.slug,
        stockAvailabillity: item?.product?.inStock
      }));

      setWishlist(productArray);
    } catch (error) {
      console.error("Error setting wishlist details:", error);
    }
  };

  const getUserByEmail = async () => {
    if (session?.user?.email) {
      try {
        const response = await apiClient.get(`/api/users/email/${session?.user?.email}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (data?.id) {
          getWishlistByUserId(data.id);
        }
      } catch (error) {
        console.error("Error gathering user reference information:", error);
      }
    }
  };

  // 🚀 CRITICAL FIX: Removed 'wishlist.length' to prevent infinite fetching loops
  useEffect(() => {
    if (session?.user?.email) {
      getUserByEmail();
    }
  }, [session?.user?.email]); 

  return (
    <div className="w-full">
      {wishlist && wishlist.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 px-4">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight max-sm:text-xl">
            Your Wishlist is Empty
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
            Explore our collection and add your favorite items to save them for later!
          </p>
        </div>
      ) : (
        <div className="max-w-screen-2xl mx-auto overflow-hidden border border-gray-100 rounded-xl shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50/70 border-b border-gray-100 text-center font-bold tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Item Details</th>
                  <th scope="col" className="px-6 py-4">Name</th>
                  <th scope="col" className="px-6 py-4">Stock Status</th>
                  <th scope="col" className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-center">
                {wishlist?.map((item) => (
                  <WishItem
                    id={item?.id}
                    title={item?.title}
                    price={item?.price}
                    image={item?.image}
                    slug={item?.slug}
                    stockAvailabillity={item?.stockAvailabillity}
                    key={nanoid()}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
