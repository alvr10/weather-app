import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Simple weather",
  description: "Designed By Alvaro Rios",
  icons: {
    icon: "/favicon.png"
  }
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        
        <meta name="google-adsense-account" content="ca-pub-3721512724303658" />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3721512724303658"
          crossOrigin="anonymous"
        />
      </Head>

      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
