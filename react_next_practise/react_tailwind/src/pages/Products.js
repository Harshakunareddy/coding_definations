import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { useTheme } from "../context/ThemeContext";

export default function Products() {
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch products from API
  useEffect(() => {
    const controller = new AbortController();
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("https://dummyjson.com/products?limit=50", { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
    return () => controller.abort();
  }, []);

  // Derive categories from products
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return ["all", ...cats];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, debouncedSearch, selectedCategory]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className={`mt-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Loading products...
        </p>
      </div>
    );
  }

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
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === "dark" ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"
            }`}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={`px-4 py-2 border rounded-lg ${
            theme === "dark" ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"
          }`}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p className={`text-center py-10 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`}>
              <div
                className={`border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col ${
                  theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                {/* Product Image */}
                <div className="w-full h-48 mb-4 flex items-center justify-center">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Product Info */}
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h3>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">${product.price}</span>
                  <span className="text-sm text-yellow-500">
                    ★ {product.rating}
                  </span>
                </div>

                <span
                  className={`mt-2 text-xs px-2 py-1 rounded-full inline-block w-fit ${
                    theme === "dark"
                      ? "bg-blue-900 text-blue-200"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {product.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
