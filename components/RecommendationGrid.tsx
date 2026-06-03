import { ProductItem } from "@/components";
import { getPersonalizedRecommendations } from "@/app/actions/recommendations";

export default async function RecommendationGrid({ currentProductId }: { currentProductId: string }) {
  const recommendations = await getPersonalizedRecommendations(currentProductId);

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="text-2xl font-bold mb-6 text-black">Recommended For You</h2>
      <div className="grid grid-cols-4 justify-items-center gap-5">
        {recommendations.map((product: any) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}