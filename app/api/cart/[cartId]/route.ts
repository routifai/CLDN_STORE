import { NextResponse } from 'next/server';
import { fetchCart } from '@/lib/cart';

export async function GET(
  _req: Request,
  { params }: { params: { cartId: string } }
) {
  try {
    const cart = await fetchCart(decodeURIComponent(params.cartId));
    if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    return NextResponse.json(cart);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
