import { NextResponse } from 'next/server';
import { addToCart } from '@/lib/cart';

export async function POST(request: Request) {
  try {
    const { cartId, lines } = (await request.json()) as {
      cartId: string;
      lines: { merchandiseId: string; quantity?: number }[];
    };

    if (!cartId || !lines?.length) {
      return NextResponse.json({ error: 'Missing cartId or lines' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
      return NextResponse.json({
        id: cartId,
        checkoutUrl: 'https://example.com/checkout',
        totalQuantity: 1,
        lines: { edges: [{ node: { quantity: 1 } }] },
      });
    }

    const first = lines[0];
    const cart = await addToCart(cartId, first.merchandiseId, first.quantity ?? 1);
    return NextResponse.json(cart);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
