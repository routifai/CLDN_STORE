import { shopifyFetch } from './shopify';
import {
  CREATE_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART,
  GET_CART,
} from './queries';
import type {
  Cart,
  CreateCartData,
  AddToCartData,
  RemoveFromCartData,
  UpdateCartData,
  GetCartData,
} from './types';

export async function createCart(variantId: string, quantity: number): Promise<Cart> {
  console.log('[cart] createCart', { variantId, quantity });
  const data = await shopifyFetch<CreateCartData, { variantId: string; quantity: number }>({
    query: CREATE_CART,
    variables: { variantId, quantity },
  });
  return data.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<Cart> {
  console.log('[cart] addToCart', { cartId, variantId, quantity });
  const data = await shopifyFetch<
    AddToCartData,
    { cartId: string; variantId: string; quantity: number }
  >({
    query: ADD_TO_CART,
    variables: { cartId, variantId, quantity },
  });
  return data.cartLinesAdd.cart;
}

export async function removeFromCart(cartId: string, lineId: string): Promise<Cart> {
  console.log('[cart] removeFromCart', { cartId, lineId });
  const data = await shopifyFetch<RemoveFromCartData, { cartId: string; lineId: string }>({
    query: REMOVE_FROM_CART,
    variables: { cartId, lineId },
  });
  return data.cartLinesRemove.cart;
}

export async function updateCartItem(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart> {
  console.log('[cart] updateCartItem', { cartId, lineId, quantity });
  const data = await shopifyFetch<
    UpdateCartData,
    { cartId: string; lineId: string; quantity: number }
  >({
    query: UPDATE_CART,
    variables: { cartId, lineId, quantity },
  });
  return data.cartLinesUpdate.cart;
}

export async function fetchCart(cartId: string): Promise<Cart | null> {
  console.log('[cart] fetchCart', { cartId });
  const data = await shopifyFetch<GetCartData, { cartId: string }>({
    query: GET_CART,
    variables: { cartId },
  });
  return data.cart;
}

/** Formats a Shopify money value: "89.00" + "CAD" → "$ 89.00 CAD" */
export function formatPrice(amount: string, currencyCode: string): string {
  const numeric = parseFloat(amount);
  return `$ ${numeric.toFixed(2)} ${currencyCode}`;
}
