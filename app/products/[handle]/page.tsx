import { Product, GetProductByHandleData } from '@/lib/types';
import Link from 'next/link';
import TiltImage from '@/components/TiltImage';
import VariantSelector from '@/components/VariantSelector';
import { shopifyFetch } from '@/lib/shopify';
import { GET_PRODUCT_BY_HANDLE } from '@/lib/queries';

async function getProduct(handle: string): Promise<Product | null> {
  try {
    const data = await shopifyFetch<GetProductByHandleData, { handle: string }>({
      query: GET_PRODUCT_BY_HANDLE,
      variables: { handle },
    });
    return data.productByHandle;
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-red-500">ERROR: 404_NOT_FOUND</h1>
        <Link href="/" className="hover:underline opacity-80">{'<'} RETURN_TO_ROOT</Link>
      </div>
    );
  }

  const image = product.images.edges[0]?.node;
  const variants = product.variants.edges.map((e) => e.node);
  
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
      <div className="border-b border-[#00ff41]/30 pb-2 flex justify-between items-end">
        <h1 className="text-2xl font-bold uppercase">
          {'>'} {product.title}<span className="animate-blink">_</span>
        </h1>
        <Link href="/#shop" className="text-sm hover:underline opacity-80 hidden md:block">
          {'<'} cd ..
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-[#00ff41]/30 p-2 relative aspect-square bg-[#0a0a0a]">
          {image ? (
            <TiltImage src={image.url} alt={image.altText || product.title} />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-30">
              [IMG_MISSING]
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="border border-[#00ff41]/30 p-4 font-mono text-sm leading-relaxed">
            <div className="border-b border-[#00ff41]/30 pb-2 mb-4 font-bold tracking-widest text-[#00ff41]">
              --- FILE_INFO ---
            </div>

            {/* metadata grid */}
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 mb-4 text-[11px] uppercase tracking-widest">
              <span className="text-[#00ff41]/40">TYPE</span>
              <span className="text-[#00ff41]/80">Oversized Hoodie</span>

              <span className="text-[#00ff41]/40">SKU</span>
              <span className="text-[#00ff41]/80">CLDN-HD01-BLK</span>

              <span className="text-[#00ff41]/40">MATERIAL</span>
              <span className="text-[#00ff41]/80">100% Heavyweight Cotton — 450gsm</span>

              <span className="text-[#00ff41]/40">FIT</span>
              <span className="text-[#00ff41]/80">Unisex / Oversized</span>

              <span className="text-[#00ff41]/40">GRAPHIC</span>
              <span className="text-[#00ff41]/80">Circuit-brain — thinking loop visualized</span>

              <span className="text-[#00ff41]/40">RELEASE</span>
              <span className="text-[#00ff41]/80">DROP_01 — 2026.05</span>

              <span className="text-[#00ff41]/40">VERSION</span>
              <span className="text-[#00ff41]/80">v1.0.0</span>
            </div>

            {/* divider */}
            <div className="border-t border-[#00ff41]/10 pt-3 mt-2">
              <div className="text-[#00ff41]/30 text-[10px] tracking-widest mb-1">{">"} cat description.txt</div>
              <p className="text-[#00ff41]/70 text-[12px] leading-[1.9] normal-case">
                {product.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 border border-[#00ff41]/30 p-4">
            <div className="border-b border-[#00ff41]/30 pb-2 font-bold">
              --- EXECUTE_TRANSACTION ---
            </div>
            <VariantSelector variants={variants} />
          </div>
        </div>
      </div>
      
      <div className="md:hidden">
        <Link href="/#shop" className="text-sm hover:underline opacity-80">
          {'<'} cd ..
        </Link>
      </div>
    </div>
  );
}
