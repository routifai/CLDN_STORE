/**
 * Cleanup script — keeps only the Hackerman Hoodie, renames it to HOODIE_01,
 * and deletes all other products.
 */

const STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

if (!STORE || !CLIENT_ID || !CLIENT_SECRET) {
  console.error('ERROR: Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN, CLIENT_ID, and CLIENT_SECRET env vars.');
  process.exit(1);
}

const BASE = `https://${STORE}/admin/api/2024-01`;

// 1. Get fresh Admin token
console.log('Fetching Admin token...');
const tokenRes = await fetch(`https://${STORE}/admin/oauth/access_token`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'client_credentials',
  }),
});
const tokenData = await tokenRes.json();
const TOKEN = tokenData.access_token;
if (!TOKEN) {
  console.error('Failed to get token:', tokenData);
  process.exit(1);
}
console.log('Token acquired.\n');

const headers = { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN };

// 2. Fetch all products
const listRes = await fetch(`${BASE}/products.json?limit=50&fields=id,title,handle`, { headers });
const { products } = await listRes.json();
console.log(`Found ${products.length} products:`);
products.forEach(p => console.log(`  [${p.id}] ${p.title}`));
console.log('');

// 3. Identify the hoodie
const hoodie = products.find(p =>
  p.handle === 'hackerman-hoodie' || p.title.toLowerCase().includes('hackerman')
);
if (!hoodie) {
  console.error('Could not find Hackerman Hoodie. Aborting.');
  process.exit(1);
}
console.log(`Keeping: [${hoodie.id}] ${hoodie.title}`);

// 4. Delete everything else
const toDelete = products.filter(p => p.id !== hoodie.id);
for (const p of toDelete) {
  const r = await fetch(`${BASE}/products/${p.id}.json`, { method: 'DELETE', headers });
  console.log(`Deleted [${p.id}] ${p.title} → ${r.status}`);
  await new Promise(res => setTimeout(res, 300));
}

// 5. Rename hoodie to HOODIE_01
console.log('\nRenaming to HOODIE_01...');
const renameRes = await fetch(`${BASE}/products/${hoodie.id}.json`, {
  method: 'PUT',
  headers,
  body: JSON.stringify({ product: { id: hoodie.id, title: 'HOODIE_01' } }),
});
const renamed = await renameRes.json();
console.log(`Renamed to: ${renamed.product?.title} (handle: ${renamed.product?.handle})`);

// 6. Verify via Storefront API
console.log('\nVerifying Storefront API...');
const sfRes = await fetch(`https://${STORE}/api/2024-01/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
  },
  body: JSON.stringify({ query: '{ products(first: 10) { edges { node { title handle } } } }' }),
});
const sfData = await sfRes.json();
const visible = sfData.data?.products?.edges?.map(e => e.node.title);
console.log('Storefront now shows:', visible);
