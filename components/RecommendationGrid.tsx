// components/RecommendationGrid.tsx
import React from 'react';
import ProductCard from './ProductCard';

export default async function RecommendationGrid({ currentProductId }) {
  const url =  `${process.env.NEXT_PUBLIC_API_URL}/api/products/${currentProductId}/recommendations`;

  console.log("Recommendations URL:", url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }
    });

    console.log("Recommendations status:", response.status);

    if (!response.ok) {
      return (
        <div className="text-red-500">
          Recommendation API failed: {response.status}
        </div>
      );
    }

    const recommendations = await response.json();

    console.log("Recommendations:", recommendations);

    if (!recommendations?.length) {
      return (
        <div className="text-yellow-500">
          No recommendations found
        </div>
      );
    }
    console.log("currentProductId", currentProductId);

    return (
      <div>
        <h2>You might also like</h2>
        {/* cards */}
      </div>
    );
  } catch (error) {
    console.error(error);

    return (
      <div className="text-red-500">
        Recommendation fetch crashed
      </div>
    );
  }
}