import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { SWAP_CART_LINE } from "@/lib/queries";
import type { UpdateCartData } from "@/lib/types";

export async function POST(req: Request) {
  const { cartId, lineId, variantId, quantity } = await req.json();
  const data = await shopifyFetch<UpdateCartData>({
    query: SWAP_CART_LINE,
    variables: { cartId, lineId, variantId, quantity },
  });
  return NextResponse.json(data.cartLinesUpdate.cart);
}
