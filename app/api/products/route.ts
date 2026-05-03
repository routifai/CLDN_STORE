import { NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { GET_PRODUCTS } from '@/lib/queries';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import type { GetProductsData, Product } from '@/lib/types';

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
    return NextResponse.json(MOCK_PRODUCTS);
  }

  try {
    const data = await shopifyFetch<GetProductsData>({ query: GET_PRODUCTS });
    const products: Product[] = data.products.edges.map((e) => e.node);
    return NextResponse.json(products);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
