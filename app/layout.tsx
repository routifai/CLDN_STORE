import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const jetbrains = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CLDN",
  description: "// coded layers, drop notation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrains.className} bg-[#0a0a0a] text-[#00ff41] min-h-screen flex flex-col antialiased selection:bg-[#00ff41] selection:text-[#0a0a0a]`}>
        <Header />
        <main className="flex-grow flex flex-col w-full relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
