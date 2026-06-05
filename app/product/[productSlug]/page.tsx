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
  params: Promise<{ productSlug: string; id: string }>;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const paramsAwaited = await params;

// 1. Fetch Product Data
const responseData = await apiClient.get(`/api/slugs/${paramsAwaited?.productSlug}`);
const jsonResult = await responseData.json();

// Safely extract the inner product whether it is wrapped in .data or returned directly
const product = jsonResult.data ? jsonResult.data : jsonResult;

if (!product || product.error || !product.id) {
  notFound();
}

  // 2. Fetch Additional Images (Handled safely if API fails)
  let images = [];
  try {
    const imagesData = await apiClient.get(`/api/images/${product.id}`);
    images = await imagesData.json();
  } catch (e) {
    console.log("No extra images found");
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
              className="w-auto h-auto rounded-lg shadow-sm"
            />
            <div className="flex justify-around mt-5 flex-wrap gap-y-1 max-[500px]:justify-center">
              {images?.map((imageItem: ImageItem, key: number) => (
                <Image
                  key={imageItem.imageID + key}
                  src={`/${imageItem.image}`}
                  width={100}
                  height={100}
                  alt="product detail image"
                  className="w-auto h-auto rounded-md border border-gray-200"
                />
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col gap-y-7 text-black max-[500px]:text-center">
            <h1 className="text-3xl font-bold">{sanitize(product?.title)}</h1>
            <p className="text-2xl font-semibold text-blue-600">${product?.price}</p>
            <StockAvailabillity stock={94} inStock={product?.inStock} />
            <SingleProductDynamicFields product={product} />
            
            <div className="flex flex-col gap-y-4 max-[500px]:items-center mt-4">
              <p className="text-gray-600">SKU: <span className="ml-1 font-mono text-black">{product.id.substring(0,8)}</span></p>
              
              <div className="flex gap-x-3 items-center">
                <span className="text-gray-600">Share:</span>
                <div className="flex items-center gap-x-2 text-2xl text-gray-500">
                  <FaSquareFacebook className="hover:text-blue-600 cursor-pointer transition-colors" />
                  <FaSquareXTwitter className="hover:text-black cursor-pointer transition-colors" />
                  <FaSquarePinterest className="hover:text-red-600 cursor-pointer transition-colors" />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="flex gap-x-2 mt-2">
                {['visa', 'mastercard', 'ae', 'paypal', 'dinersclub', 'discover'].map((icon) => (
                  <Image key={icon} src={`/${icon}.svg`} width={40} height={25} alt={`${icon} icon`} className="w-auto h-auto" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs & Recommendations */}
        <div className="py-16 px-5">
          <ProductTabs product={product} />
          
          {/* THE RECOMMENDATION GRID GOES HERE */}
          <RecommendationGrid currentProductId={product.id} />
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;