"use client"

import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import Image from "next/image"
import Link from "next/link";
import { FaCheck, FaCircleQuestion, FaClock, FaXmark } from "react-icons/fa6";
import QuantityInputCart from "@/components/QuantityInputCart";
import { sanitize } from "@/lib/sanitize";

export const CartModule = () => {
  const { 
    products, 
    savedItems, 
    removeFromCart, 
    saveForLater, 
    moveToCart, 
    calculateTotals, 
    total 
  } = useProductStore();

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    calculateTotals();
    toast.success("Product removed from the cart");
  };

  const handleSaveForLater = (id: string) => {
    saveForLater(id);
    calculateTotals();
    toast.success("Product saved for later");
  };

  const handleMoveToCart = (id: string) => {
    moveToCart(id);
    calculateTotals();
    toast.success("Product moved back to cart");
  };

  return (
    <div className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form className="mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>

          <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
            {products.length === 0 ? (
              <li className="py-12 text-center text-gray-500 text-sm font-medium">
                Your active shopping cart is empty.
              </li>
            ) : (
              products.map((product) => (
                <li key={product.id} className="flex py-6 sm:py-8 items-start">
                  {/* Image Container */}
                  <div className="flex-shrink-0 bg-gray-50 rounded-lg p-2 border border-gray-100 shadow-sm">
                    <Image
                      width={140}
                      height={140}
                      src={product?.image ? `/${product.image}` : "/product_placeholder.jpg"}
                      alt={product.title}
                      className="h-24 w-24 rounded-md object-contain object-center sm:h-32 sm:w-32"
                    />
                  </div>

                  {/* Product Info Block */}
                  <div className="ml-6 flex flex-1 flex-col justify-between h-full min-h-[110px] sm:min-h-[140px]">
                    <div className="flex justify-between items-start gap-x-4">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 leading-tight">
                          <Link href={`#`} className="hover:text-blue-600 transition-colors">
                            {sanitize(product.title)}
                          </Link>
                        </h3>
                        <p className="mt-1.5 text-lg font-bold text-gray-900">
                          ${product.price}
                        </p>
                        <p className="mt-2 flex items-center space-x-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 w-max px-2 py-0.5 rounded">
                          <FaCheck className="h-3 w-3 text-emerald-600" />
                          <span>In stock & ready to ship</span>
                        </p>
                      </div>

                      {/* Top Right Close Button */}
                      <button
                        onClick={() => handleRemoveItem(product.id)}
                        type="button"
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        title="Remove item"
                      >
                        <FaXmark className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Bottom Actions Row - Cleans up the stacked layout */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <QuantityInputCart product={product} />
                      </div>
                      
                      {/* Repositioned Action Button */}
                      <button
                        onClick={() => handleSaveForLater(product.id)}
                        type="button"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md transition-all shadow-sm"
                      >
                        Save for Later
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* Beautiful Order Summary Card */}
        <section className="mt-16 rounded-xl bg-gray-50 border border-gray-100 p-6 lg:col-span-5 lg:mt-0 lg:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4">Order summary</h2>
          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <dt className="text-gray-600">Subtotal</dt>
              <dd className="font-semibold text-gray-900">${total.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-sm">
              <dt className="flex items-center text-gray-600">
                <span>Shipping estimate</span>
                <FaCircleQuestion className="ml-1.5 h-4 w-4 text-gray-400 cursor-pointer" />
              </dt>
              <dd className="font-semibold text-gray-900">$5.00</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-sm">
              <dt className="flex items-center text-gray-600">
                <span>Tax estimate</span>
                <FaCircleQuestion className="ml-1.5 h-4 w-4 text-gray-400 cursor-pointer" />
              </dt>
              <dd className="font-semibold text-gray-900">${(total / 5).toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-base font-bold">
              <dt className="text-gray-900">Order total</dt>
              <dd className="text-gray-900 text-lg">
                ${total === 0 ? "0.00" : (total + total / 5 + 5).toFixed(2)}
              </dd>
            </div>
          </dl>
          {products.length > 0 && (
            <div className="mt-6">
              <Link
                href="/checkout"
                className="block text-center w-full uppercase bg-blue-600 hover:bg-blue-700 py-3.5 text-sm font-bold text-white rounded-lg shadow-md hover:shadow-lg transition-all tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </section>
      </form>

      {/* --- SAVED FOR LATER GRID SECTION --- */}
      <section className="border-t border-gray-200 pt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            Saved for Later <span className="ml-1 text-sm bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">{savedItems.length}</span>
          </h2>
        </div>
        
        {savedItems.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <p className="text-sm text-gray-400 font-medium">You have no items saved for later.</p>
          </div>
        ) : (
          <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedItems.map((product) => (
              <li key={product.id} className="flex flex-col rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-1 items-center p-5 space-x-4 bg-white">
                  <div className="h-20 w-20 flex-shrink-0 relative bg-gray-50 border border-gray-100 rounded-md p-1">
                    <Image
                      fill
                      src={product?.image ? `/${product.image}` : "/product_placeholder.jpg"}
                      alt={product.title}
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {sanitize(product.title)}
                    </h3>
                    <p className="mt-1 text-base font-bold text-gray-900">
                      ${product.price}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 border-t border-gray-100 grid grid-cols-2 divide-x divide-gray-200">
                  <button
                    onClick={() => handleMoveToCart(product.id)}
                    type="button"
                    className="py-3 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-gray-100/70 text-center transition-colors"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveItem(product.id)}
                    type="button"
                    className="py-3 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50/50 text-center transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
