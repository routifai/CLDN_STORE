import { NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { GET_PRODUCTS } from '@/lib/queries';
import type { GetProductsData, Product } from '@/lib/types';

export async function GET(): Promise<NextResponse> {
  try {
    console.log('[api/products] GET');
    const data = await shopifyFetch<GetProductsData>({ query: GET_PRODUCTS });
    const products: Product[] = data.products.edges.map((e) => e.node);
    console.log('[api/products] returning', products.length, 'products');
    return NextResponse.json(products);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[api/products] error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
