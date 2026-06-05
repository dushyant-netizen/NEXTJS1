// components/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    title: string; // Ensure this matches your API return field (title vs name)
    price: number;
    mainImage?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group block border p-4 rounded-lg hover:shadow-lg transition">
      <div className="relative aspect-square mb-4 overflow-hidden rounded-md">
        <Image
          src={product?.mainImage ? `/${product.mainImage}` : "/product_placeholder.jpg"}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
        />
      </div>
      <h3 className="text-lg font-medium text-gray-900 truncate">{product.title}</h3>
      <p className="text-sm text-gray-500 mt-1">${product.price}</p>
    </Link>
  );
}