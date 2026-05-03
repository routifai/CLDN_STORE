import Image from 'next/image';
import { Product, GetProductsData } from '@/lib/types';
import Link from 'next/link';
import AddToCart from '@/components/AddToCart';
import DropTeaser from '@/components/DropTeaser';
import { shopifyFetch } from '@/lib/shopify';
import { GET_PRODUCTS } from '@/lib/queries';

async function getProducts(): Promise<Product[]> {
  try {
    const data = await shopifyFetch<GetProductsData>({ query: GET_PRODUCTS });
    return data.products.edges.map((e) => e.node);
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      {/* SECTION 1: HERO */}
      <section className="relative w-full h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 65, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Corner decoration squares */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-[#00ff41] opacity-30"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-[#00ff41] opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#00ff41] opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#00ff41] opacity-30"></div>

        {/* Top left corner */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 flex flex-col gap-1">
          <div className="text-[#00ff41] opacity-30 text-[11px] tracking-widest">{'>'} initializing cldn_store...</div>
          <div className="text-[#00ff41] opacity-60 text-[11px] tracking-widest flex items-center">
            {'>'} loading drop_01...
            <span className="inline-block w-[6px] h-[12px] bg-[#00ff41] animate-[blink_1s_step-end_infinite] ml-1"></span>
          </div>
        </div>

        {/* Center content */}
        <div className="flex flex-col items-center z-10 text-center uppercase tracking-widest">
          <h1 className="text-[#00ff41] font-bold leading-none tracking-[0.1em]" style={{ fontSize: 'clamp(80px, 15vw, 160px)' }}>CLDN</h1>
          <p className="text-[#00ff41]/50 text-[14px] tracking-[0.3em] mt-4 mb-8">{"//"} coded layers, drop notation</p>
          <div className="w-[280px] h-[1px] bg-[#00ff41]/15 mb-8"></div>
          
          <div className="flex items-center gap-4">
            <Link href="#shop" className="border border-[#00ff41] bg-transparent text-[#00ff41] px-6 py-3 text-[12px] hover:bg-[#00ff41] hover:text-[#0a0a0a] transition-all duration-200">
              [enter_shop]
            </Link>
            <Link href="#drops" className="border border-[#00ff41]/40 text-[#00ff41]/40 px-6 py-3 text-[12px] hover:text-[#00ff41] hover:border-[#00ff41] transition-all duration-200">
              [view_drops]
            </Link>
          </div>
        </div>

        {/* Bottom left */}
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-[#00ff41]/20 text-[10px] tracking-widest uppercase">
          v1.0.0 — drop_01 live
        </div>

        {/* Bottom right */}
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex flex-col text-[#00ff41]/20 text-[10px] tracking-widest uppercase text-right">
          <span>system: online</span>
          <span>inventory: loaded</span>
          <span>status: accepting_orders</span>
        </div>
      </section>

      {/* SECTION 2: PRODUCTS GRID */}
      <section id="shop" className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 uppercase tracking-widest flex flex-col">
        <div className="flex justify-between items-end border-b border-[#00ff41]/15 pb-4 mb-8">
          <div className="text-[#00ff41]/40 text-[12px] tracking-[0.2em]">{'>'} ls ./shop</div>
          <div className="text-[#00ff41]/25 text-[11px]">showing 00-{products.length.toString().padStart(2, '0')} items</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const price = product.variants.edges[0]?.node.price;
            const image = product.images.edges[0]?.node;

            return (
              <div key={product.id} className="bg-[#0d0d0d] flex flex-col group border border-[#00ff41]/15 hover:border-[#00ff41]/40 transition-colors duration-400 z-10 relative">
                <Link href={`/products/${product.handle}`} className="relative w-full aspect-square overflow-hidden bg-[#0a0a0a]">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.altText || product.title}
                      fill
                      className="object-cover transition-all duration-400"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20 text-[#00ff41] text-[10px]">
                      [IMG_MISSING]
                    </div>
                  )}
                </Link>
                
                <div className="p-4 flex flex-col flex-grow border-t border-[#00ff41]/10 justify-between min-h-[120px]">
                  <div className="mb-4">
                    <h2 className="text-[#00ff41] text-[13px] font-medium tracking-[0.1em] truncate mb-2">{product.title}</h2>
                    <div className="text-[#00ff41]/50 text-[12px]">
                      {price ? `$ ${price.amount}` : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="mt-auto w-full">
                    {product.variants.edges[0]?.node.availableForSale ? (
                      <AddToCart variantId={product.variants.edges[0]?.node.id} />
                    ) : (
                      <button disabled className="w-full border border-[#00ff41]/20 text-[#00ff41]/30 px-6 py-3 text-[11px] text-center cursor-not-allowed">
                        [out_of_stock]
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: DROP TEASER */}
      <section id="drops" className="w-full bg-[#050505] py-20 md:py-32 uppercase tracking-widest">
        <DropTeaser />
      </section>
    </>
  );
}
