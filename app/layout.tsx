import type { Metadata } from "next";
import "./styles/globals.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Simple Weather",
  description: "Get real-time weather updates and forecasts. Designed by Alvaro Rios.",
  keywords: ["weather", "forecast", "real-time weather", "Alvaro Rios"],
  authors: [{ name: "Alvaro Rios", url: "https://yourwebsite.com" }],
  openGraph: {
    title: "Simple Weather",
    description: "Get real-time weather updates and forecasts. Designed by Alvaro Rios.",
    url: "https://yourwebsite.com",
    siteName: "Simple Weather",
    images: [
      {
        url: "#", // Replace with your OpenGraph image URL
        width: 1200,
        height: 630,
        alt: "Simple Weather - Real-time Weather Updates",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.png", // Default favicon
    apple: "/icons/apple-touch-icon.png", // Apple Touch Icon
    shortcut: "/icons/favicon-32x32.png", // Shortcut icon
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/icons/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/icons/favicon-32x32.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/icons/apple-touch-icon.png",
      },
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#5bbad5", // Safari pinned tab color
      },
    ],
  },
  manifest: "/manifest.json", // PWA manifest
  themeColor: "#ffffff", // Theme color for PWA
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Adsense */}
        <meta name="google-adsense-account" content="ca-pub-3721512724303658" />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3721512724303658"
          crossOrigin="anonymous"
        />

        {/* Viewport for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />

        {/* Safari Pinned Tab Icon */}
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />

        {/* Microsoft Tile Color */}
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}