'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/cart';
import type { Product } from '@/lib/types';

export default function TestPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartLog, setCartLog] = useState<string[]>([]);

  const { cartId, itemCount, checkoutUrl, setCart } = useCartStore();

  useEffect(() => {
    console.log('[test] fetching /api/products');
    fetch('/api/products')
      .then((r) => {
        console.log('[test] status:', r.status);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Product[]>;
      })
      .then((data) => {
        console.log('[test] products:', data);
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
    setAddingToCart(true);
    const log: string[] = [];

    try {
      if (cartId) {
        log.push(`→ POST /api/cart/add  cartId=${cartId.slice(-8)}`);
        const res = await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartId,
            lines: [{ merchandiseId: firstVariant.id, quantity: 1 }],
          }),
        });
        const cart = await res.json() as { id: string; checkoutUrl: string; totalQuantity?: number; lines?: { edges: { node: { quantity: number } }[] } };
        log.push(`← status ${res.status}`);
        console.log('[test] addToCart response:', cart);
        if (cart?.id) {
          const count = cart.totalQuantity ?? cart.lines?.edges.reduce((s, e) => s + e.node.quantity, 0) ?? 0;
          setCart(cart.id, count, cart.checkoutUrl);
          log.push(`✓ cart updated — ${count} item(s)`);
        }
      } else {
        log.push(`→ POST /api/cart  variantId=${firstVariant.id.slice(-8)}`);
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ variantId: firstVariant.id, quantity: 1 }),
        });
        const data = await res.json() as { cartId?: string; id?: string; checkoutUrl: string; cart?: { id: string; totalQuantity: number; checkoutUrl: string }; totalQuantity?: number };
        log.push(`← status ${res.status}`);
        console.log('[test] createCart response:', data);

        // Handle both response shapes
        const cart = data.cart ?? data;
        const id = data.cartId ?? (cart as { id?: string }).id;
        if (id) {
          setCart(id, data.cart?.totalQuantity ?? data.totalQuantity ?? 1, data.cart?.checkoutUrl ?? data.checkoutUrl);
          log.push(`✓ cart created — id: ...${id.slice(-8)}`);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log.push(`✗ ERROR: ${msg}`);
      console.error('[test] add to cart failed:', err);
    } finally {
      setAddingToCart(false);
      setCartLog(log);
    }
  };

  return (
    <main style={{ background: '#0a0a0a', color: '#00ff41', minHeight: '100vh', fontFamily: 'monospace', padding: '2rem', fontSize: '13px' }}>
      <h1 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid #00ff41', paddingBottom: '0.5rem' }}>
        Shopify Integration Test — /test
      </h1>

      {/* ── Cart state ─────────────────────────────────────── */}
      <section style={{ border: '1px solid #00ff41', padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ color: '#aaa', marginBottom: '0.5rem', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>cart state (zustand)</div>
        <div>cartId: <span style={{ color: '#fff' }}>{cartId ?? 'null'}</span></div>
        <div>itemCount: <span style={{ color: '#fff' }}>{itemCount}</span></div>
        <div>checkoutUrl: <span style={{ color: '#fff' }}>{checkoutUrl ?? 'null'}</span></div>
        {cartLog.length > 0 && (
          <div style={{ marginTop: '0.75rem', borderTop: '1px solid #333', paddingTop: '0.5rem' }}>
            {cartLog.map((l, i) => <div key={i} style={{ color: l.startsWith('✓') ? '#00ff41' : l.startsWith('✗') ? '#ff4141' : '#888' }}>{l}</div>)}
          </div>
        )}
      </section>

      {/* ── Products ───────────────────────────────────────── */}
      <section>
        <div style={{ color: '#aaa', marginBottom: '0.75rem', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>products from /api/products</div>

        {loading && <div style={{ color: '#888' }}>fetching...</div>}

        {error && (
          <div style={{ color: '#ff4141', border: '1px solid #ff4141', padding: '0.75rem' }}>
            ERROR: {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div style={{ color: '#ffaa00', border: '1px solid #ffaa00', padding: '0.75rem' }}>
            0 products returned — store may be empty or token is invalid
          </div>
        )}

        <div style={{ display: 'grid', gap: '1rem' }}>
          {products.map((product, idx) => {
            const image = product.images.edges[0]?.node;
            const variant = product.variants.edges[0]?.node;

            return (
              <div key={product.id} style={{ border: '1px solid #333', padding: '1rem', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem' }}>
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image.url} alt={image.altText ?? ''} style={{ width: 80, height: 80, objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 80, height: 80, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#444' }}>NO IMG</div>
                )}

                <div>
                  <div style={{ fontWeight: 'bold' }}>{product.title}</div>
                  <div style={{ color: '#888', fontSize: '11px' }}>handle: {product.handle}</div>
                  <div style={{ marginTop: '0.25rem' }}>
                    {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                  </div>
                  <div style={{ color: '#555', fontSize: '11px', marginTop: '0.25rem' }}>
                    variants: {product.variants.edges.map((e) => `${e.node.title}${e.node.availableForSale ? '' : ' (sold out)'}`).join(', ')}
                  </div>

                  {idx === 0 && (
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart || !variant?.availableForSale}
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.3rem 0.75rem',
                        background: addingToCart ? 'transparent' : '#00ff41',
                        color: addingToCart ? '#00ff41' : '#0a0a0a',
                        border: '1px solid #00ff41',
                        cursor: 'pointer',
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        opacity: (!variant?.availableForSale) ? 0.4 : 1,
                      }}
                    >
                      {addingToCart ? 'adding...' : variant?.availableForSale ? '[ADD_TO_CART] — first product' : '[SOLD_OUT]'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
