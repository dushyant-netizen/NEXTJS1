import React from 'react';
import ProductCard from './ProductCard'; // Adjust path if necessary

interface RecommendationGridProps {
  currentProductId: string;
}

export default async function RecommendationGrid({ currentProductId }: RecommendationGridProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://nextjs1-be-render.onrender.com';
  const url = `$https://nextjs1-be-render.onrender.com/api/products/${currentProductId}/recommendations`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      cache: 'no-store',
      headers: {
     'Cache-Control': 'no-cache'
  }
    });

    if (!response.ok) {
      return (
        <div className="text-red-500 py-10 text-center">
          Failed to load recommendations.
        </div>
      );
    }

    const json = await response.json();
    const recommendations = json.data; // Extract the data array!

    if (!recommendations || recommendations.length === 0) {
      return (
        <div className="text-gray-500 py-10 text-center">
          No recommendations found at this time.
        </div>
      );
    }

    return (
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8 max-[500px]:text-center">
          You might also like
        </h2>
        {/* Responsive Grid layout for cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendations.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Recommendation API Error:", error);
    return (
      <div className="text-red-500 py-10 text-center">
        Error loading recommendations.
      </div>
    );
  }
}