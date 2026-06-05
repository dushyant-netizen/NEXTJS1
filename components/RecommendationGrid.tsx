import React from 'react';

interface RecommendationGridProps {
  currentProductId: string;
}

export default async function RecommendationGrid({ currentProductId }: RecommendationGridProps) {
  // If undefined runs down from layout, fallback to "1" to keep UI rendering
  const cleanId = currentProductId && currentProductId !== "undefined" ? currentProductId : "1";
  const url = `https://nextjs1-be-render.onrender.com/api/products/${cleanId}/recommendations`;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) {
      return <div className="text-center py-6 text-red-500">HTTP Network Error: {response.status}</div>;
    }

    const json = await response.json();
    const items = json.data || [];

    if (items.length === 0) {
      return (
        <div className="text-center py-6 text-gray-500 border border-dashed rounded my-4">
          No records matched on endpoint. ID evaluated: {cleanId}
        </div>
      );
    }

    return (
      <div className="mt-12 w-full">
        <h2 className="text-2xl font-bold mb-6 text-black">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((prod: any) => (
            <div key={prod.id} className="border p-4 rounded-lg flex flex-col bg-white shadow-sm hover:shadow transition-shadow">
              <div className="w-full h-40 relative mb-3 flex items-center justify-center bg-gray-50 rounded">
                <img 
                  src={prod.mainImage ? `/${prod.mainImage}` : "/product_placeholder.jpg"} 
                  alt={prod.title}
                  className="max-h-full max-w-full object-contain p-2"
                />
              </div>
              <h3 className="font-semibold text-black text-sm line-clamp-2 h-10">{prod.title}</h3>
              <p className="text-blue-600 font-bold mt-2">${prod.price}</p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (err: any) {
    return <div className="text-center py-6 text-red-500">Component Fetch Failed: {err.message}</div>;
  }
}