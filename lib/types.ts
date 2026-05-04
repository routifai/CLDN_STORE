export interface ProductImage {
  url: string;
  altText: string | null;
}

export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: MoneyV2;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: MoneyV2;
  };
  images: {
    edges: Array<{ node: ProductImage }>;
  };
  variants: {
    edges: Array<{ node: ProductVariant }>;
  };
}

export interface CartLineMerchandise {
  id: string;
  title: string;
  price: MoneyV2;
  product: {
    title: string;
    handle: string;
    featuredImage: {
      url: string;
      altText: string | null;
    } | null;
  };
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: CartLineMerchandise;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: Array<{ node: CartLine }>;
  };
}

// ── GraphQL response shapes ────────────────────────────────────────────────

export interface GetProductsData {
  products: {
    edges: Array<{ node: Product }>;
  };
}

export interface GetProductByHandleData {
  productByHandle: Product | null;
}

export interface GetCollectionByHandleData {
  collection: {
    title: string;
    description: string;
    products: {
      edges: Array<{ node: Product }>;
    };
  } | null;
}

export interface CreateCartData {
  cartCreate: { cart: Cart };
}

export interface AddToCartData {
  cartLinesAdd: { cart: Cart };
}

export interface RemoveFromCartData {
  cartLinesRemove: { cart: Cart };
}

export interface UpdateCartData {
  cartLinesUpdate: { cart: Cart };
}

export interface GetCartData {
  cart: Cart | null;
}
