import React from 'react';

interface RecommendationGridProps {
  currentProductId: string;
}

export default async function RecommendationGrid({ currentProductId }: RecommendationGridProps) {
  // Fallback to "1" if your dynamic route parameter isn't reading the ID correctly
  const idToUse = currentProductId && currentProductId !== "undefined" ? currentProductId : "1";
  const url = `https://nextjs1-be-render.onrender.com/api/products/${idToUse}/recommendations`;

  try {
    const response = await fetch(url, { 
      cache: 'no-store', // Force Next.js to pull live data every refresh
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    if (!response.ok) {
      return (
        <div className="p-4 border border-red-500 bg-red-50 text-red-700 font-mono my-6">
          Backend returned HTTP Error status: {response.status}
        </div>
      );
    }

    const json = await response.json();
    const items = json.data || [];

    return (
      <div className="mt-12 w-full border-t border-gray-200 pt-8 text-black block">
        {/* DIAGNOSTIC BANNER - If you don't see this box, the component isn't mounting at all */}
        <div className="bg-yellow-50 border-2 border-dashed border-yellow-400 p-4 rounded mb-6 font-mono text-xs">
          <p className="font-bold text-yellow-800">🛠️ Recommendation Grid Debug Engine</p>
          <p>Called Endpoint: <a href={url} target="_blank" rel="noreferrer" className="underline text-blue-600">{url}</a></p>
          <p>Items Unpacked: {items.length}</p>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-black">You might also like</h2>
        
        {items.length === 0 ? (
          <p className="text-gray-500 italic">Connected to API, but database has zero alternative cross-reference items.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {items.map((prod: any) => (
              <div key={prod.id} className="border border-gray-200 p-4 rounded-lg bg-white flex flex-col justify-between">
                <div>
                  <div className="w-full h-40 bg-gray-50 rounded flex items-center justify-center p-2 mb-3">
                    {/* Using raw HTML img instead of next/image to prevent path optimization crashes */}
                    <img 
                      src={prod.mainImage ? (prod.mainImage.startsWith('http') ? prod.mainImage : `/${prod.mainImage}`) : "/product_placeholder.jpg"} 
                      alt={prod.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-sm text-black line-clamp-2 h-10">{prod.title}</h3>
                </div>
                <p className="text-blue-600 font-bold mt-2">${prod.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (err: any) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700 font-mono my-6">
        🔥 Critical Runtime Fetch Failure: {err?.message || "Unknown client error"}
      </div>
    );
  }
}