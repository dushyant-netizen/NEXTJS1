// *********************
// Role of the component: Header component
// Name of the component: Header.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.2 (Fixed Dynamic Navbar Avatar Sync & Sizing)
// Component call: <Header />
// Input parameters: no input parameters
// Output: Header component
// *********************

"use client";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import SearchInput from "./SearchInput";
import Link from "next/link";
import { MdDashboard } from "react-icons/md"; 

import CartElement from "./CartElement";
import NotificationBell from "./NotificationBell";
import HeartElement from "./HeartElement";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import apiClient from "@/lib/api";

const Header = () => {
  // 🚀 FIX 1: Destructured 'update' to watch session changes in real-time
  const { data: session, update } = useSession();
  const pathname = usePathname();
  const { wishlist, setWishlist, wishQuantity } = useWishlistStore();

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  };

  // getting all wishlist items by user id
  const getWishlistByUserId = async (id: string) => {
    await apiClient.get(`/api/wishlist/${id}`, {
      cache: "no-store",
    });
    return; // temporary disable wishlist fetching while the issue is being resolved
  };

  // getting user by email so I can get his user id
  const getUserByEmail = async () => {
    if (session?.user?.email) {
      apiClient
        .get(`/api/users/email/${session?.user?.email}`, {
          cache: "no-store",
        })
        .then((response) => response.json())
        .then((data) => {
          getWishlistByUserId(data?.id);
        });
    }
  };

// 📁 Inside components/Header.tsx

useEffect(() => {
  getUserByEmail();
  
  // 🚀 ADD THIS CONDITION HERE: Force header session data validation when changes happen
  if (session?.user?.image) {
    // This forces the React engine context to register the change
    console.log("Navbar syncing updated DP path:", session.user.image);
  }
}, [session?.user?.email, session?.user?.image, wishlist.length]); // 👈 Added session?.user?.image here


  return (
    <header className="bg-white">
      <HeaderTop />
      {pathname.startsWith("/admin") === false && (
        <div className="h-32 bg-white flex items-center justify-between px-16 max-[1320px]:px-16 max-md:px-6 max-lg:flex-col max-lg:gap-y-7 max-lg:justify-center max-lg:h-60 max-w-screen-2xl mx-auto">
          <Link href="/">
            <img
              src="/logo.svg"
              width={300}
              height={300}
              alt="singitronic logo"
              className="relative right-5 max-[1023px]:w-56"
            />
          </Link>
          <SearchInput />
          <div className="flex gap-x-10 items-center">
            {/* 👑 ADMIN-ONLY DASHBOARD SHORTCUT LINK */}
            {session?.user?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md transition duration-200 shadow-sm"
              >
                <MdDashboard className="text-base" />
                <span>Dashboard</span>
              </Link>
            )}

            <NotificationBell />
            <HeartElement wishQuantity={wishQuantity} />
            <CartElement />
          </div>
        </div>
      )}
      {pathname.startsWith("/admin") === true && (
        <div className="flex justify-between h-32 bg-white items-center px-16 max-[1320px]:px-10  max-w-screen-2xl mx-auto max-[400px]:px-5">
          <Link href="/">
            <Image
              src="/logo.svg"
              width={130}
              height={130}
              alt="singitronic logo"
              className="w-56 h-auto"
            />
          </Link>
          <div className="flex gap-x-5 items-center">
            <NotificationBell />
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="w-10 h-10 block">
                {/* 🚀 FIX 2: Fixed sizing classes so your image container expands properly */}
                <Image
                  src={session?.user?.image || "/randomuser.jpg"}
                  alt="profile photo"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                  priority
                />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link href="/admin">Dashboard</Link>
                </li>
                <li>
                  <Link href="/admin/profile">Profile</Link>
                </li>
                <li onClick={handleLogout}>
                  <a href="#">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
