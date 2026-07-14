import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@repo/ui/globals.css";
import { Providers } from "./providers";
import { CanonicalHeader } from "../components/CanonicalHeader";

import { Poppins, Epilogue } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-epilogue",
  display: "swap",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://auction11.live"),
  title: {
    default: "Auction11 – Live Player Auction Platform for Tournaments",
    template: "%s | Auction 11",
  },
  description:
    "Auction11 helps sports organizers conduct live player auctions with real-time bidding, team creation, customizable themes, and live updates for cricket, football, kabaddi, and other sports.",
  keywords: ["cricket auction", "ipl auction software", "online cricket auction", "player auction platform", "real-time bidding", "Auction 11", "cricket team auction"],
  openGraph: {
    title: "Auction11 – Live Player Auction Platform for Tournaments",
    description:
      "Auction11 helps sports organizers conduct live player auctions with real-time bidding, team creation, customizable themes, and live updates for cricket, football, kabaddi, and other sports.",
    url: "https://auction11.live",
    siteName: "Auction11",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auction 11 — The Ultimate Cricket Auction Software",
    description: "Run professional, real-time cricket player auctions online.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { ReactLenis } from "lenis/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${epilogue.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Auction 11" />
      <link rel="icon" href="/favicon.ico" sizes="128x128" type="image/x-icon " />
      <GoogleAnalytics gaId="G-RCB2M0CT5W" />
      <body className="min-h-screen bg-background font-sans antialiased">
        <CanonicalHeader />
        <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}>
          <Providers>{children}</Providers>
        </ReactLenis>
      </body>
    </html>
  );
}
