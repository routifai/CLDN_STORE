import { NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { GET_PRODUCT_BY_HANDLE } from '@/lib/queries';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import type { GetProductByHandleData } from '@/lib/types';

export async function GET(
  _request: Request,
  { params }: { params: { handle: string } }
) {
  const { handle } = params;

  if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
    const product = MOCK_PRODUCTS.find((p) => p.handle === handle);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  }

  try {
    const data = await shopifyFetch<GetProductByHandleData, { handle: string }>({
      query: GET_PRODUCT_BY_HANDLE,
      variables: { handle },
    });

    if (!data.productByHandle) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(data.productByHandle);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
