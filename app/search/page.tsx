import { ProductItem, SectionTitle } from "@/components";
import React from "react";
import { sanitize } from "@/lib/sanitize";
import { performSemanticSearch } from "@/app/actions/search";

interface Props {
  searchParams: Promise<{ search: string }>; // In Next.js 15+, searchParams is a Promise
}

const SearchPage = async ({ searchParams }: Props) => {
  const sp = await searchParams;
  const query = sp?.search || "";
  let products = [];

  if (query) {
    products = await performSemanticSearch(query);
  }

  return (
    <div>
      <SectionTitle title="Search Page" path="Home | Search" />
      <div className="max-w-screen-2xl mx-auto">
        {query && (
          <h3 className="text-4xl text-center py-10">
            Showing results for {sanitize(query)}
          </h3>
        )}
        <div className="grid grid-cols-4 gap-5">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductItem key={product.id} product={product} />
            ))
          ) : (
            <h3 className="text-center col-span-full">No products found.</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;