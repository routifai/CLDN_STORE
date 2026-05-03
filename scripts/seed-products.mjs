/**
 * Shopify product seeder — uses the Admin REST API to create products.
 *
 * Usage:
 *   SHOPIFY_ADMIN_TOKEN=shpat_xxx node scripts/seed-products.mjs
 *
 * Or add SHOPIFY_ADMIN_TOKEN to .env then run:
 *   npm run seed
 *
 * How to get the token (takes ~2 min):
 *   1. Shopify admin → Settings → Apps and sales channels
 *   2. Click "Develop apps" → "Allow custom app development"
 *   3. Create app → give it any name (e.g. "CLDN Seeder")
 *   4. Click "Configure Admin API scopes"
 *   5. Enable: write_products, read_products
 *   6. Save → Install app → copy "Admin API access token" (shpat_...)
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DOMAIN = 'zhtjhz-9u.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

if (!TOKEN) {
  console.error('ERROR: Set SHOPIFY_ADMIN_TOKEN env var before running.');
  console.error('  SHOPIFY_ADMIN_TOKEN=shpat_xxx node scripts/seed-products.mjs');
  process.exit(1);
}

const BASE = `https://${DOMAIN}/admin/api/2024-01`;

// Read hoodie image and encode as base64 for Shopify attachment upload
const hoodieImageBase64 = readFileSync(
  resolve(__dirname, '../public/images/HOODIE01.jpeg')
).toString('base64');

const PRODUCTS = [
  {
    title: 'Hackerman Hoodie',
    body_html: 'A dark hoodie with a subtle matrix rain pattern lining. Perfect for late night coding sessions.\n\nMaterial: 100% Cotton | Fit: Oversized',
    vendor: 'CLDN',
    product_type: 'Hoodie',
    status: 'active',
    tags: 'drop_01, apparel',
    images: [{ attachment: hoodieImageBase64, filename: 'HOODIE01.jpeg', alt: 'Hackerman Hoodie' }],
    variants: [
      { option1: 'S',  price: '89.00', inventory_quantity: 5, inventory_management: 'shopify' },
      { option1: 'M',  price: '89.00', inventory_quantity: 8, inventory_management: 'shopify' },
      { option1: 'L',  price: '89.00', inventory_quantity: 6, inventory_management: 'shopify' },
      { option1: 'XL', price: '89.00', inventory_quantity: 3, inventory_management: 'shopify' },
    ],
    options: [{ name: 'Size', values: ['S', 'M', 'L', 'XL'] }],
  },
  {
    title: 'Zero-Day Tee',
    body_html: 'Heavyweight 100% cotton tee. Front print: "0day" in terminal green on black. Back: CLDN logo.',
    vendor: 'CLDN',
    product_type: 'T-Shirt',
    status: 'active',
    tags: 'drop_01, apparel',
    variants: [
      { option1: 'S',  price: '45.00', inventory_quantity: 10, inventory_management: 'shopify' },
      { option1: 'M',  price: '45.00', inventory_quantity: 12, inventory_management: 'shopify' },
      { option1: 'L',  price: '45.00', inventory_quantity: 10, inventory_management: 'shopify' },
      { option1: 'XL', price: '45.00', inventory_quantity: 6,  inventory_management: 'shopify' },
    ],
    options: [{ name: 'Size', values: ['S', 'M', 'L', 'XL'] }],
  },
  {
    title: 'Root Access Crewneck',
    body_html: 'Garment-dyed heavyweight crewneck. Embroidered "root@cldn:~#" on the chest. Washed black.',
    vendor: 'CLDN',
    product_type: 'Sweatshirt',
    status: 'active',
    tags: 'drop_01, apparel',
    variants: [
      { option1: 'S',  price: '110.00', inventory_quantity: 4, inventory_management: 'shopify' },
      { option1: 'M',  price: '110.00', inventory_quantity: 7, inventory_management: 'shopify' },
      { option1: 'L',  price: '110.00', inventory_quantity: 5, inventory_management: 'shopify' },
      { option1: 'XL', price: '110.00', inventory_quantity: 2, inventory_management: 'shopify' },
    ],
    options: [{ name: 'Size', values: ['S', 'M', 'L', 'XL'] }],
  },
  {
    title: 'CLDN Cap',
    body_html: '6-panel structured cap. Embroidered CLDN logo front. Adjustable snapback. One size.',
    vendor: 'CLDN',
    product_type: 'Accessory',
    status: 'active',
    tags: 'drop_01, accessories',
    variants: [
      { option1: 'One Size', price: '55.00', inventory_quantity: 15, inventory_management: 'shopify' },
    ],
    options: [{ name: 'Size', values: ['One Size'] }],
  },
  {
    title: 'Exploit Coffee Mug',
    body_html: 'Matte black ceramic 16oz mug. Heat-sensitive coating reveals green hex code when hot.',
    vendor: 'CLDN',
    product_type: 'Accessory',
    status: 'active',
    tags: 'drop_01, accessories',
    variants: [
      { option1: 'Default', price: '28.00', inventory_quantity: 20, inventory_management: 'shopify' },
    ],
    options: [{ name: 'Title', values: ['Default'] }],
  },
];

async function createProduct(product) {
  const res = await fetch(`${BASE}/products.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: JSON.stringify({ product }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(data.errors ?? data)}`);
  }

  return data.product;
}

async function main() {
  console.log(`\nConnecting to ${DOMAIN}...\n`);

  for (const product of PRODUCTS) {
    process.stdout.write(`  Creating "${product.title}"... `);
    try {
      const created = await createProduct(product);
      console.log(`✓  id=${created.id}  handle=${created.handle}  variants=${created.variants.length}`);
    } catch (err) {
      console.log(`✗  ${err.message}`);
    }
    // Stay well within the Admin API rate limit (2 req/s burst)
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log('\nDone. Refresh /test to see your products.\n');
}

main();
