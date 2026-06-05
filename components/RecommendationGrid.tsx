// components/RecommendationGrid.tsx
import React from 'react';
import ProductCard from '../components/ProductCard'; // Assuming you have this

export default async function RecommendationGrid({ currentProductId }: { currentProductId: string }) {
  try {
    // Replace with your actual deployed Render backend URL or environment variable
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recommendations/${currentProductId}`, {
      next: { revalidate: 3600 } // Cache for 1 hour to save on API/DB costs
    });

    if (!response.ok) return null;
    const recommendations = await response.json();

    if (recommendations.length === 0) return null;

    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendations.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to load recommendations:", error);
    return null; // Graceful degradation
  }
}