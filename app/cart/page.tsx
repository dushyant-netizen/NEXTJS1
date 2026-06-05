import { SectionTitle } from "@/components";
import { Loader } from "@/components/Loader";
import { CartModule } from "@/components/modules/cart";
import { Suspense } from "react";

// FORCE NEXT.JS TO BYPASS ALL PRODUCTION CACHES INLINED
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const CartPage = () => {
  return (
    <div className="bg-white">
      <SectionTitle title="Cart Page" path="Home | Cart" />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>
          
          <Suspense fallback={<Loader />}>
            <CartModule />
          </Suspense>

          {/* 🚀 INLINED INDEPENDENT SUGGESTIONS GRID */}
          <Suspense fallback={<div className="text-black py-4">Loading Suggestions...</div>}>
            <InlineRecommendationRender />
          </Suspense>

        </div>
      </div>
    </div>
  );
};

// This component lives entirely inside this file so it cannot be lost by the bundler
async function InlineRecommendationRender() {
  const url = "https://nextjs1-be-render.onrender.com/api/products/1/recommendations";
  
  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();
    const items = json.data || [];

    return (
      <div className="mt-16 pt-8 border-t border-gray-200 block">
        <h2 className="text-2xl font-bold text-black mb-6">You Might Also Like (Inline Mode)</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((prod: any) => (
            <div key={prod.id} className="border p-4 rounded bg-gray-50 flex flex-col justify-between">
              <div className="w-full h-32 bg-white rounded flex items-center justify-center mb-2">
                <img 
                  src={prod.mainImage ? `/${prod.mainImage}` : "/product_placeholder.jpg"} 
                  alt={prod.title} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="font-bold text-sm text-black line-clamp-1">{prod.title}</p>
              <p className="text-blue-600 font-semibold text-xs mt-1">${prod.price}</p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="p-4 bg-red-50 text-red-600 font-mono text-xs my-4">
        Inline Engine Fetch Error: {err.message}
      </div>
    );
  }
}

export default CartPage;