export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import {
  StockAvailabillity,
  ProductTabs,
  SingleProductDynamicFields,
} from "@/components";
import apiClient from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { FaSquareFacebook, FaSquareXTwitter, FaSquarePinterest } from "react-icons/fa6";
import { sanitize } from "@/lib/sanitize";
import RecommendationGrid from "@/components/RecommendationGrid";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface SingleProductPageProps {
  params: Promise<{ productSlug: string }>;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const paramsAwaited = await params;

  // 1. Fetch Product Data by Slug
  const res = await apiClient.get(`/api/slugs/${paramsAwaited?.productSlug}`);
  const json = await res.json();

  // FIX: Unbox backend wrapper if it uses a "data" property nesting
  const product = json.data ? json.data : json;

  if (!product || product.error || !product.id) {
    notFound();
  }

  // 2. Fetch Additional Images safely using the newly found product.id
  let images: ImageItem[] = [];
  try {
    const imagesData = await apiClient.get(`/api/images/${product.id}`);
    images = await imagesData.json();
  } catch (err) {
    console.error("Images fetch omitted:", err);
  }

  return (
    <div className="bg-white">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-center gap-x-16 pt-10 max-lg:flex-col items-center gap-y-5 px-5">
          {/* Product Image Section */}
          <div>
            <Image
              src={product?.mainImage ? `/${product?.mainImage}` : "/product_placeholder.jpg"}
              width={500}
              height={500}
              alt="main image"
              className="w-auto h-auto rounded-md"
            />
            <div className="flex justify-around mt-5 flex-wrap gap-y-1 max-[500px]:justify-center">
              {Array.isArray(images) && images.map((imageItem: ImageItem, key: number) => (
                <Image
                  key={imageItem.imageID + key}
                  src={`/${imageItem.image}`}
                  width={100}
                  height={100}
                  alt="product detail image"
                  className="w-auto h-auto border rounded"
                />
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col gap-y-7 text-black max-[500px]:text-center">
            <h1 className="text-3xl font-bold">{sanitize(product?.title)}</h1>
            <p className="text-xl font-semibold">${product?.price}</p>
            <StockAvailabillity stock={94} inStock={product?.inStock} />
            <SingleProductDynamicFields product={product} />
            
            <div className="flex flex-col gap-y-2 max-[500px]:items-center">
              <p className="text-lg">SKU: <span className="ml-1 font-mono text-sm">{product.id.substring(0, 8)}</span></p>
              <div className="text-lg flex gap-x-2">
                <span>Share:</span>
                <div className="flex items-center gap-x-1 text-2xl">
                  <FaSquareFacebook />
                  <FaSquareXTwitter />
                  <FaSquarePinterest />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tabs & Recommendations */}
        <div className="py-16 px-5">
          <ProductTabs product={product} />
          
          {/* CRITICAL: Passing down a confirmed valid product ID string */}
          <RecommendationGrid currentProductId={product.id} />
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;