const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? '';
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? '';

interface ShopifyFetchOptions<V> {
  query: string;
  variables?: V;
  cache?: RequestCache;
}

interface ShopifyGraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
}

interface ShopifyResponse<T> {
  data: T;
  errors?: ShopifyGraphQLError[];
}

export async function shopifyFetch<TData, TVariables = Record<string, unknown>>(
  options: ShopifyFetchOptions<TVariables>
): Promise<TData> {
  const { query, variables, cache = 'no-store' } = options;

  if (!domain || !storefrontAccessToken) {
    throw new Error(
      'Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN'
    );
  }

  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  console.log('[shopify] fetching:', query.trim().split('\n')[0].trim());

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache,
  });

  if (!res.ok) {
    throw new Error(`Shopify API HTTP error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as ShopifyResponse<TData>;

  if (json.errors && json.errors.length > 0) {
    const messages = json.errors.map((e) => e.message).join(', ');
    console.error('[shopify] GraphQL errors:', json.errors);
    throw new Error(`Shopify GraphQL error: ${messages}`);
  }

  console.log('[shopify] response received');
  return json.data;
}
