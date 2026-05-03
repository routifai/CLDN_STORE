import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "gid://shopify/Product/1",
    title: "Hackerman Hoodie",
    handle: "hackerman-hoodie",
    description: "A dark hoodie with a subtle matrix rain pattern lining. Perfect for late night coding sessions.\n\nMaterial: 100% Cotton\nFit: Oversized\nCare: Machine wash cold, do not tumble dry.",
    priceRange: { minVariantPrice: { amount: "65.00", currencyCode: "USD" } },
    images: {
      edges: [
        {
          node: {
            url: "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png",
            altText: "Hackerman Hoodie"
          }
        }
      ]
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/1",
            title: "Large",
            availableForSale: true,
            price: { amount: "65.00", currencyCode: "USD" }
          }
        }
      ]
    }
  },
  {
    id: "gid://shopify/Product/2",
    title: "Mechanical Switch Tester",
    handle: "switch-tester",
    description: "Test 9 different tactile and linear switches before committing to your next custom build. Includes cherry, gateron, and kailh varieties.",
    priceRange: { minVariantPrice: { amount: "15.00", currencyCode: "USD" } },
    images: {
      edges: [
        {
          node: {
            url: "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-lifestyle-1_large.png",
            altText: "Switch Tester"
          }
        }
      ]
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/2",
            title: "Default",
            availableForSale: true,
            price: { amount: "15.00", currencyCode: "USD" }
          }
        }
      ]
    }
  },
  {
    id: "gid://shopify/Product/3",
    title: "Zero-Day Exploit Coffee Mug",
    handle: "zero-day-mug",
    description: "Matte black ceramic mug. Holds 16oz of your preferred caffeinated beverage. Heat sensitive coating reveals green hex code when hot.",
    priceRange: { minVariantPrice: { amount: "20.00", currencyCode: "USD" } },
    images: {
      edges: [] // Intentional missing image to test fallback UI
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/3",
            title: "Default",
            availableForSale: false, // Intentional out of stock item
            price: { amount: "20.00", currencyCode: "USD" }
          }
        }
      ]
    }
  }
];
