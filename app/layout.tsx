import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth/next";
import SessionProvider from "@/utils/SessionProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/Providers";
import SessionTimeoutWrapper from "@/components/SessionTimeoutWrapper";
// 1. REMOVE the import 'svgmap/dist/svgMap.min.css'; line

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextMerce - Electronics Store",
  description: "Modern Electronics E-commerce Shop with Admin Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en" data-theme="light">
      {/* 2. Add the CSS here in the head */}
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/svgmap@2.20.0/dist/svgMap.min.css" 
        />
      </head>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <SessionTimeoutWrapper />
          <Header />
          <Providers>
            {children}
          </Providers>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}