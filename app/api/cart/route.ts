import { NextResponse } from 'next/server';
import { createCart } from '@/lib/cart';

interface CreateCartBody {
  // Shape sent by test page
  variantId?: string;
  quantity?: number;
  // Shape sent by legacy AddToCart component
  lines?: { merchandiseId: string; quantity?: number }[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateCartBody;

    // Normalise to a single variantId + quantity
    let variantId: string | undefined;
    let quantity = 1;

    if (body.variantId) {
      variantId = body.variantId;
      quantity = body.quantity ?? 1;
    } else if (body.lines?.length) {
      variantId = body.lines[0].merchandiseId;
      quantity = body.lines[0].quantity ?? 1;
    }

    if (!variantId) {
      return NextResponse.json({ error: 'variantId or lines[0].merchandiseId required' }, { status: 400 });
    }

    console.log('[api/cart] POST createCart', { variantId, quantity });
    const cart = await createCart(variantId, quantity);
    return NextResponse.json({ cartId: cart.id, checkoutUrl: cart.checkoutUrl, cart });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[api/cart] error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
