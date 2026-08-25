// ==========================================
// PRODUCTS PAGE (Client Component)
// Shows: API fetching, useState, useEffect, useCallback,
//        search, category filter, loading state, error handling
// ==========================================

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // useCallback - memoize search handler (prevents SearchBar re-renders)
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // useMemo - derive categories from products (computed only when products change)
  const categories = useMemo(() => {
    const cats = products.map((p) => p.category);
    return ["all", ...new Set(cats)];
  }, [products]);

  // useMemo - filter products (only recomputes when dependencies change)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Products</h1>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} placeholder="Search products..." />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
