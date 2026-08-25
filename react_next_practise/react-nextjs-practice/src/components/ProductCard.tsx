// ==========================================
// PRODUCT CARD COMPONENT
// Shows: Props, next/image, reusable component pattern
// ==========================================

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-700 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative w-full h-48 mb-4">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        {/* Product Info */}
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 dark:text-white">
          {product.title}
        </h3>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">${product.price}</span>
          <span className="text-sm text-yellow-500">
            ★ {product.rating.rate} ({product.rating.count})
          </span>
        </div>

        <span className="mt-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full inline-block w-fit">
          {product.category}
        </span>
      </div>
    </Link>
  );
}
