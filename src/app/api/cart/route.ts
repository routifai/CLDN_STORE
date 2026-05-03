import { NextResponse } from 'next/server';
import { createCart } from '@/lib/cart';

interface CreateCartBody {
  variantId: string;
  quantity: number;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as CreateCartBody;
    const { variantId, quantity = 1 } = body;

    if (!variantId) {
      return NextResponse.json({ error: 'variantId is required' }, { status: 400 });
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
