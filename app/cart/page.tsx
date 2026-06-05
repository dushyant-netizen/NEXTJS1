import {
  SectionTitle,
  RecommendationGrid // Imported cleanly from index now!
} from "@/components";
import { Loader } from "@/components/Loader";
import { CartModule } from "@/components/modules/cart";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

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

          {/* 🌟 Renders the generalized store suggestions smoothly below the cart elements */}
          <Suspense fallback={<div className="py-10 text-center text-gray-400">Loading suggestions...</div>}>
            <RecommendationGrid />
          </Suspense>

        </div>
      </div>
    </div>
  );
};

export default CartPage;