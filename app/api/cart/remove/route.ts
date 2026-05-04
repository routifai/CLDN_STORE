import { NextResponse } from 'next/server';
import { removeFromCart } from '@/lib/cart';

export async function POST(request: Request) {
  try {
    const { cartId, lineId } = (await request.json()) as {
      cartId: string;
      lineId: string;
    };
    if (!cartId || !lineId) {
      return NextResponse.json({ error: 'Missing cartId or lineId' }, { status: 400 });
    }
    const cart = await removeFromCart(cartId, lineId);
    return NextResponse.json(cart);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
