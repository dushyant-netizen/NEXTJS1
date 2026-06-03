// components/CategoryRecommendations.tsx
import { ProductItem } from "@/components";
import { getCategoryRecommendations } from "@/app/actions/shop-recommendations";

export default async function CategoryRecommendations({ category }: { category?: string }) {
  if (!category) return null;
  const recommendations = await getCategoryRecommendations(category);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-10 pt-10 border-t">
      <h3 className="text-xl font-bold mb-6">Top Picks in {category.replace("-", " ")}</h3>
      <div className="grid grid-cols-4 gap-5">
        {recommendations.map((p: any) => <ProductItem key={p.id} product={p} />)}
      </div>
    </div>
  );
}