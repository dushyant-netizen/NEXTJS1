export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  Breadcrumb,
  Filters,
  Pagination,
  Products,
  SortBy,
} from "@/components";
import React from "react";
import { sanitize } from "@/lib/sanitize";
import CategoryRecommendations from "@/components/CategoryRecommendations";

// Improve readability of category text, e.g., "smart-watches" -> "smart watches"
const improveCategoryText = (text: string): string => {
  if (text.indexOf("-") !== -1) {
    return text.split("-").join(" ");
  }
  return text;
};

const ShopPage = async ({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug?: string[] }>; 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; 
}) => {
  // Await params and searchParams
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  
  const category = awaitedParams?.slug?.[0];

  return (
    <div className="text-black bg-white">
      <div className="max-w-screen-2xl mx-auto px-10 max-sm:px-5">
        <Breadcrumb />
        
        <div className="grid grid-cols-[200px_1fr] gap-x-10 max-md:grid-cols-1 max-md:gap-y-5">
          <Filters />
          
          <div>
            <div className="flex justify-between items-center max-lg:flex-col max-lg:gap-y-5">
              <h2 className="text-2xl font-bold max-sm:text-xl max-[400px]:text-lg uppercase">
                {category && category.length > 0
                  ? sanitize(improveCategoryText(category))
                  : "All products"}
              </h2>

              <SortBy />
            </div>
            
            <div className="divider"></div>
            
            {/* Main Product Grid */}
            <Products params={awaitedParams} searchParams={awaitedSearchParams} />
            
            <Pagination />

            {/* Recommendation Engine Component */}
            {/* This fetches products with high semantic similarity to the category context */}
            <CategoryRecommendations category={category} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;