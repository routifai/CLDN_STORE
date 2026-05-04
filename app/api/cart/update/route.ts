import { NextResponse } from 'next/server';
import { updateCartItem } from '@/lib/cart';

export async function POST(request: Request) {
  try {
    const { cartId, lineId, quantity } = (await request.json()) as {
      cartId: string;
      lineId: string;
      quantity: number;
    };
    if (!cartId || !lineId || quantity == null) {
      return NextResponse.json({ error: 'Missing cartId, lineId, or quantity' }, { status: 400 });
    }
    const cart = await updateCartItem(cartId, lineId, quantity);
    return NextResponse.json(cart);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
