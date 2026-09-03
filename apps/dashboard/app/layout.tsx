import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";

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
    metadataBase: new URL("https://app.auctionxi.com"),
    title: {
        default: "Dashboard — Auction 11",
        template: "%s | Auction 11 Dashboard",
    },
    description:
        "Manage and run live auctions in real-time with Auction 11 Dashboard.",
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
        },
    },
};

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
                <Script id="microsoft-clarity" strategy="afterInteractive">
                    {`
                        (function(c,l,a,r,i,t,y){
                            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                        })(window, document, "clarity", "script", "xkqy02196p");
                    `}
                </Script>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
