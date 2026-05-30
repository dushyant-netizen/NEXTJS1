import { WishlistModule } from "@/components/modules/wishlist"; // 🚀 FIX: Path matches your modules folder structure

export const metadata = {
  title: "My Wishlist | NextMerce",
  description: "View, update, and manage your bookmarked favorites from your authenticated shop profile.",
};

export default function WishlistPage() {
  return (
    <main className="w-full min-h-[70vh] bg-white py-12 px-6 sm:px-12 lg:px-16 max-w-screen-2xl mx-auto">
      {/* Head section layout titles */}
      <div className="border-b border-gray-200 pb-5 mb-10 flex flex-col gap-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase">
          My Saved Wishlist
        </h1>
        <p className="text-sm text-gray-500">
          Review your favorite items, monitor current inventory levels, and transfer choices directly into your shopping cart.
        </p>
      </div>

      {/* Renders your existing layout modules dynamically */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <WishlistModule />
      </div>
    </main>
  );
}
