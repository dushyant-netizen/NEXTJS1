import {
  SectionTitle
} from "@/components";
import { Loader } from "@/components/Loader";
import { CartModule } from "@/components/modules/cart";
import { Suspense } from "react";
// Import your recommendation component
import RecommendationGrid from "@/components/RecommendationGrid";

// Force fresh dynamic rendering to bypass any stale Next.js cache blocks
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

          {/* 🚀 THE RECOMMENDATION COMPONENT SPLIT */}
          {/* Wrapped in Suspense so if the API delays, the cart layout still shows instantly */}
          <Suspense fallback={<div className="py-10 text-center text-gray-400">Loading suggestions...</div>}>
            <RecommendationGrid />
          </Suspense>

        </div>
      </div>
    </div>
  );
};

export default CartPage;