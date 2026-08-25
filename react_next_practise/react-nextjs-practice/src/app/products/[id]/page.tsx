// ==========================================
// DYNAMIC PRODUCT PAGE (Server Component)
// Shows: Dynamic routes [id], server-side data fetching,
//        generateMetadata, params handling
// ==========================================

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

// Dynamic metadata for SEO (server-side)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const product: Product = await res.json();
  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Server-side fetch (no useEffect needed in Server Components!)
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const product: Product = await res.json();

  return (
    <div>
      {/* Back button */}
      <Link
        href="/products"
        className="text-blue-600 hover:underline mb-6 inline-block dark:text-blue-400"
      >
        &larr; Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
        {/* Product Image */}
        <div className="relative w-full h-96">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full w-fit mb-4">
            {product.category}
          </span>

          <h1 className="text-2xl font-bold mb-4 dark:text-white">{product.title}</h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-green-600">${product.price}</span>
            <span className="text-yellow-500">
              ★ {product.rating.rate} ({product.rating.count} reviews)
            </span>
          </div>

          <button className="mt-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
