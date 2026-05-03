import { NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { GET_PRODUCT_BY_HANDLE } from '@/lib/queries';
import type { GetProductByHandleData } from '@/lib/types';

export async function GET(
  _req: Request,
  { params }: { params: { handle: string } }
): Promise<NextResponse> {
  const { handle } = params;
  console.log('[api/products/handle] GET', handle);

  try {
    const data = await shopifyFetch<GetProductByHandleData, { handle: string }>({
      query: GET_PRODUCT_BY_HANDLE,
      variables: { handle },
    });

    if (!data.productByHandle) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(data.productByHandle);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[api/products/handle] error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
