import { NextResponse } from 'next/server';
import { addToCart, removeFromCart, updateCartItem, fetchCart } from '@/lib/cart';
import type { Cart } from '@/lib/types';

type Params = { params: { cartId: string } };

/** GET — fetch current cart state (used by CartContext rehydration) */
export async function GET(_req: Request, { params }: Params): Promise<NextResponse> {
  const { cartId } = params;
  console.log('[api/cart/cartId] GET', cartId);

  try {
    const cart: Cart | null = await fetchCart(cartId);
    if (!cart) {
      return NextResponse.json(null, { status: 404 });
    }
    return NextResponse.json(cart);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** POST — add a line item */
export async function POST(req: Request, { params }: Params): Promise<NextResponse> {
  const { cartId } = params;
  const { variantId, quantity = 1 } = (await req.json()) as {
    variantId: string;
    quantity?: number;
  };

  console.log('[api/cart/cartId] POST addToCart', { cartId, variantId, quantity });

  try {
    const cart = await addToCart(cartId, variantId, quantity);
    return NextResponse.json(cart);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** DELETE — remove a line item */
export async function DELETE(req: Request, { params }: Params): Promise<NextResponse> {
  const { cartId } = params;
  const { lineId } = (await req.json()) as { lineId: string };

  console.log('[api/cart/cartId] DELETE removeFromCart', { cartId, lineId });

  try {
    const cart = await removeFromCart(cartId, lineId);
    return NextResponse.json(cart);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** PATCH — update line item quantity */
export async function PATCH(req: Request, { params }: Params): Promise<NextResponse> {
  const { cartId } = params;
  const { lineId, quantity } = (await req.json()) as { lineId: string; quantity: number };

  console.log('[api/cart/cartId] PATCH updateCartItem', { cartId, lineId, quantity });

  try {
    const cart = await updateCartItem(cartId, lineId, quantity);
    return NextResponse.json(cart);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
