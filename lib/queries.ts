// ── Shared fragment strings (inlined per query for Storefront API compat) ──

const PRODUCT_FIELDS = `
  id
  title
  handle
  description
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  variants(first: 10) {
    edges {
      node {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
      }
    }
  }
`;

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  lines(first: 10) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            product {
              title
              handle
              featuredImage {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

// ── Queries ────────────────────────────────────────────────────────────────

export const GET_PRODUCTS = `
  query getProducts {
    products(first: 20) {
      edges {
        node {
          ${PRODUCT_FIELDS}
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = `
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ${PRODUCT_FIELDS}
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE = `
  query getCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      title
      description
      products(first: 20) {
        edges {
          node {
            ${PRODUCT_FIELDS}
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_CART = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ${CART_FIELDS}
    }
  }
`;

// ── Mutations ──────────────────────────────────────────────────────────────

export const CREATE_CART = `
  mutation createCart($variantId: ID!, $quantity: Int!) {
    cartCreate(input: {
      lines: [{ quantity: $quantity, merchandiseId: $variantId }]
    }) {
      cart {
        ${CART_FIELDS}
      }
    }
  }
`;

export const ADD_TO_CART = `
  mutation addToCart($cartId: ID!, $variantId: ID!, $quantity: Int!) {
    cartLinesAdd(
      cartId: $cartId
      lines: [{ quantity: $quantity, merchandiseId: $variantId }]
    ) {
      cart {
        ${CART_FIELDS}
      }
    }
  }
`;

export const REMOVE_FROM_CART = `
  mutation removeFromCart($cartId: ID!, $lineId: ID!) {
    cartLinesRemove(cartId: $cartId, lineIds: [$lineId]) {
      cart {
        ${CART_FIELDS}
      }
    }
  }
`;

export const UPDATE_CART = `
  mutation updateCart($cartId: ID!, $lineId: ID!, $quantity: Int!) {
    cartLinesUpdate(
      cartId: $cartId
      lines: [{ id: $lineId, quantity: $quantity }]
    ) {
      cart {
        ${CART_FIELDS}
      }
    }
  }
`;
