// components/RecommendationGrid.tsx
import React from 'react';

interface RecommendationGridProps {
  currentProductId: string;
}

export default async function RecommendationGrid({ currentProductId }: RecommendationGridProps) {
  // Use the actual ID passed from the product page, or fallback to "1" (Smart phone) which we know exists!
  const verifiedId = currentProductId && currentProductId !== "undefined" ? currentProductId : "1";
  const url = `https://nextjs1-be-render.onrender.com/api/products/${verifiedId}/recommendations`;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    const json = await response.json();
    const items = json.data || [];

    return (
      <div className="mt-12 w-full border-t pt-8 text-black">
        <h2 className="text-2xl font-bold mb-4">You might also like</h2>
        
        {/* DEBUGGING PANEL: This will print directly on your website page */}
        <div className="bg-gray-100 p-4 rounded font-mono text-xs mb-4 text-red-600">
          <p>Target URL: {url}</p>
          <p>Items Found from Backend: {items.length}</p>
          <p>Raw JSON Payload: {JSON.stringify(json)}</p>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500">The API connected successfully, but the database returned 0 products for this ID.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((prod: any) => (
              <div key={prod.id} className="border p-3 rounded bg-white shadow-sm">
                <p className="font-bold text-sm">{prod.title}</p>
                <p className="text-blue-600">${prod.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (err: any) {
    return <div className="p-4 text-red-500 bg-red-50 border">Frontend Fetch Error: {err.message}</div>;
  }
}