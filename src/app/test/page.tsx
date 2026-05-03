'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/cart';
import type { Product } from '@/lib/types';

export default function TestPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const { cart, cartId, itemCount, addItem } = useCart();

  useEffect(() => {
    console.log('[test] fetching /api/products');
    fetch('/api/products')
      .then((r) => {
        console.log('[test] response status:', r.status);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: Product[]) => {
        console.log('[test] products received:', data);
        setProducts(data);
      })
      .catch((err: Error) => {
        console.error('[test] error:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const firstProduct = products[0];
  const firstVariant = firstProduct?.variants.edges[0]?.node;

  const handleAddToCart = async () => {
    if (!firstVariant) return;
    console.log('[test] adding to cart:', firstVariant.id);
    setAddingToCart(true);
    try {
      await addItem(firstVariant.id, 1);
      console.log('[test] added to cart successfully');
    } catch (err) {
      console.error('[test] add to cart failed:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <main
      style={{
        background: '#0a0a0a',
        color: '#00ff41',
        minHeight: '100vh',
        fontFamily: 'monospace',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Shopify Integration Test
      </h1>

      {/* ── Cart state ──────────────────────────────────────── */}
      <section
        style={{
          border: '1px solid #00ff41',
          padding: '1rem',
          marginBottom: '2rem',
          fontSize: '0.875rem',
        }}
      >
        <h2 style={{ marginBottom: '0.5rem' }}>Cart State</h2>
        <div>cartId: {cartId ?? 'null'}</div>
        <div>itemCount: {itemCount}</div>
        <div>checkoutUrl: {cart?.checkoutUrl ?? 'null'}</div>
        <div>
          lines:{' '}
          {cart?.lines.edges.length
            ? cart.lines.edges.map((e) => (
                <div key={e.node.id} style={{ paddingLeft: '1rem' }}>
                  {e.node.merchandise.product.title} — {e.node.merchandise.title} ×{' '}
                  {e.node.quantity} (
                  {formatPrice(
                    e.node.merchandise.price.amount,
                    e.node.merchandise.price.currencyCode
                  )}
                  )
                </div>
              ))
            : 'empty'}
        </div>
      </section>

      {/* ── Product list ─────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Products</h2>

        {loading && <div>Loading products...</div>}
        {error && (
          <div style={{ color: '#ff4141' }}>
            ERROR: {error} — check console for details
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div style={{ color: '#ffaa00' }}>
            No products returned. The store may be empty or the token may be wrong.
          </div>
        )}

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {products.map((product, idx) => {
            const image = product.images.edges[0]?.node;
            const variant = product.variants.edges[0]?.node;

            return (
              <div
                key={product.id}
                style={{ border: '1px solid #333', padding: '1rem' }}
              >
                {image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image.url}
                    alt={image.altText ?? product.title}
                    style={{ width: 120, height: 120, objectFit: 'cover', marginBottom: '0.5rem' }}
                  />
                )}
                <div>
                  <strong>{product.title}</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                  handle: {product.handle}
                </div>
                <div>
                  {formatPrice(
                    product.priceRange.minVariantPrice.amount,
                    product.priceRange.minVariantPrice.currencyCode
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                  variants:{' '}
                  {product.variants.edges
                    .map((e) => `${e.node.title}${e.node.availableForSale ? '' : ' (sold out)'}`)
                    .join(', ')}
                </div>

                {idx === 0 && (
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart || !variant?.availableForSale}
                    style={{
                      marginTop: '0.75rem',
                      padding: '0.4rem 1rem',
                      background: '#00ff41',
                      color: '#0a0a0a',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      opacity: addingToCart ? 0.5 : 1,
                    }}
                  >
                    {addingToCart
                      ? 'Adding...'
                      : variant?.availableForSale
                      ? 'Add to Cart (first product)'
                      : 'Sold Out'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
