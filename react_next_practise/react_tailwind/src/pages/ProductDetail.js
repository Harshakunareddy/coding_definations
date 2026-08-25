import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function ProductDetail() {
  const { theme } = useTheme();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`https://dummyjson.com/products/${id}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className={`mt-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Loading product...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">Error: {error || "Product not found"}</p>
        <Link
          to="/products"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const images = product.images || [product.thumbnail];

  return (
    <div>
      {/* Back button */}
      <Link
        to="/products"
        className="text-blue-600 hover:underline mb-6 inline-block dark:text-blue-400"
      >
        &larr; Back to Products
      </Link>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-8 rounded-lg p-6 border ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        {/* Product Image */}
        <div>
          <div className="w-full h-96 flex items-center justify-center mb-4">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 justify-center">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 border-2 rounded-lg overflow-hidden ${
                    selectedImage === index
                      ? "border-blue-600"
                      : theme === "dark"
                      ? "border-gray-600"
                      : "border-gray-200"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <span
            className={`text-sm px-3 py-1 rounded-full w-fit mb-4 ${
              theme === "dark"
                ? "bg-blue-900 text-blue-200"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {product.category}
          </span>

          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            Brand: {product.brand || "N/A"}
          </p>

          <p className={`mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold text-green-600">${product.price}</span>
            {product.discountPercentage > 0 && (
              <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                -{product.discountPercentage.toFixed(0)}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-yellow-500">
              ★ {product.rating} / 5
            </span>
            <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Stock: {product.stock}
            </span>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-2 py-1 rounded-full ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <button className="mt-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
