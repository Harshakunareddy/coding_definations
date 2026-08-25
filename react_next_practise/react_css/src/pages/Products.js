import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const controller = new AbortController();
    fetch('https://dummyjson.com/products?limit=100', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return ['all', ...cats.sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchCategory = category === 'all' || p.category === category;
      return matchSearch && matchCategory;
    });
  }, [products, debouncedSearch, category]);

  if (loading) {
    return (
      <div className="page">
        <h1 className="page-title">Products</h1>
        <p className="page-subtitle">Loading products...</p>
        <div className="products-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="product-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-line skeleton-line--title"></div>
              <div className="skeleton-line skeleton-line--text"></div>
              <div className="skeleton-line skeleton-line--short"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Products</h1>
      <p className="page-subtitle">Fetch products with search & category filter</p>

      <div className="products-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="products-search"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="products-select"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="products-count">
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
      </div>

      {filteredProducts.length === 0 ? (
        <div className="products-empty">No products found matching your criteria.</div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`} className="product-card">
              <div className="product-image-wrapper">
                <img src={product.thumbnail} alt={product.title} className="product-image" />
                {product.discountPercentage > 10 && (
                  <span className="product-badge">-{Math.round(product.discountPercentage)}%</span>
                )}
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-title">{product.title}</h3>
                <div className="product-price-row">
                  <span className="product-price">${product.price}</span>
                  <span className="product-rating">
                    {'★'.repeat(Math.min(Math.round(product.rating), 5))}
                    {'☆'.repeat(Math.max(5 - Math.round(product.rating), 0))}
                    <span className="product-rating-num">{product.rating}</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
