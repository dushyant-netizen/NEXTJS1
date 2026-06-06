import { ProductItem, SectionTitle } from "@/components";
import React from "react";
import { sanitize } from "@/lib/sanitize";
import { performSemanticSearch } from "@/app/actions/search";

interface Props {
  searchParams: Promise<{ search: string }>;
}

const SearchPage = async ({ searchParams }: Props) => {
  const sp = await searchParams;
  const query = sp?.search || "";
  let products = [];

  if (query) {
    products = await performSemanticSearch(query);
  }

  return (
    <div className="bg-white min-h-screen text-black">
      <SectionTitle title="Search Page" path="Home | Search" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {query && (
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-8 text-center sm:text-left">
            Showing results for <span className="text-blue-600">"{sanitize(query)}"</span>
          </h3>
        )}
        
        {products.length > 0 ? (
          /* Responsive grid alignment structure */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6 xl:gap-x-8">
            {products.map((product: any) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl bg-gray-50 max-w-xl mx-auto mt-6">
            <p className="text-gray-500 text-lg">No products found matching your search term.</p>
            <p className="text-gray-400 text-sm mt-1">Try checking for typos or use more general keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;