import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`https://dummyjson.com/products/${id}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
        setSelectedImage(0);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
          Loading product...
        </div>
      </div>
    );
  }

  if (!product || product.message) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2 style={{ color: 'var(--color-text)', marginBottom: '1rem' }}>Product Not Found</h2>
          <Link to="/products" style={{ color: 'var(--color-primary)' }}>&larr; Back to Products</Link>
        </div>
      </div>
    );
  }

  const images = product.images || [product.thumbnail];

  return (
    <div className="page">
      <Link to="/products" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--color-primary)',
        fontWeight: 500,
        marginBottom: '1.5rem',
        fontSize: '0.95rem'
      }}>
        &larr; Back to Products
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        boxShadow: '0 4px 12px var(--color-shadow)',
      }}>
        <div>
          <div style={{
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            background: '#f3f4f6',
            marginBottom: '0.75rem',
          }}>
            <img
              src={images[selectedImage]}
              alt={product.title}
              style={{ width: '100%', height: '350px', objectFit: 'cover', display: 'block' }}
            />
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden',
                    border: selectedImage === i ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                    padding: 0,
                    cursor: 'pointer',
                    background: 'none',
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', margin: '0.5rem 0' }}>
            {product.title}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)' }}>
              ${product.price}
            </span>
            {product.discountPercentage > 0 && (
              <span style={{
                background: '#fee2e2',
                color: 'var(--color-danger)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius)',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}>
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ color: '#f59e0b', fontSize: '1.1rem' }}>
              {'★'.repeat(Math.min(Math.round(product.rating), 5))}{'☆'.repeat(Math.max(5 - Math.round(product.rating), 0))}
            </span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              ({product.rating})
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            padding: '1.25rem',
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius)',
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Brand</div>
              <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{product.brand || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Stock</div>
              <div style={{ fontWeight: 600, color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>SKU</div>
              <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{product.sku || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Weight</div>
              <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{product.weight ? `${product.weight}g` : 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .page > div:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
