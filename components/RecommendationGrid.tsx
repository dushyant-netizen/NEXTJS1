// components/RecommendationGrid.tsx
import React from 'react';

interface RecommendationGridProps {
  currentProductId?: string;
}

export default async function RecommendationGrid({ currentProductId }: RecommendationGridProps) {
  // Fallback to "1" if no product ID is passed or available yet
  const idToUse = currentProductId && currentProductId !== "undefined" ? currentProductId : "1";
  const url = `https://nextjs1-be-render.onrender.com/api/products/${idToUse}/recommendations`;

  try {
    const response = await fetch(url, { 
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    if (!response.ok) return null; // Hide quietly if network drops

    const json = await response.json();
    const items = json.data || [];

    if (items.length === 0) return null;

    return (
      <div className="mt-16 w-full border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">You might also like</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((prod: any) => (
            <a 
              href={`/products/${prod.slug}`} 
              key={prod.id} 
              className="group border border-gray-100 p-4 rounded-xl bg-white flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="w-full h-44 bg-gray-50 rounded-lg flex items-center justify-center p-4 mb-4 group-hover:bg-gray-100 transition-colors">
                  <img 
                    src={prod.mainImage ? `/${prod.mainImage}` : "/product_placeholder.jpg"} 
                    alt={prod.title}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </div>
                <h3 className="font-medium text-sm text-gray-800 line-clamp-2 h-10 group-hover:text-blue-600 transition-colors">
                  {prod.title}
                </h3>
              </div>
              <p className="text-blue-600 font-bold mt-3 text-base">${prod.price}</p>
            </a>
          ))}
        </div>
      </div>
    );
  } catch (err) {
    console.error("Recommendations failed to render:", err);
    return null;
  }
}