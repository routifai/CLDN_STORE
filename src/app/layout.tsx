import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'CLDN Store',
  description: 'Headless Shopify storefront',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} font-mono antialiased bg-[#0a0a0a] text-[#00ff41]`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
