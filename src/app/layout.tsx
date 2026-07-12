import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BuyMeCoffeeButton from "@/components/BuyMeCoffeeButton";
import styles from "@/styles/layout.module.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokémon TCG Pocket BattleLedger – Deck Tracker & Battle Logger",
  description:
    "Track your Pokémon TCG Pocket decks, generate random battle scenarios, and log wins, losses, and ties with detailed analytics. Built with Next.js and Neon.",
  keywords: [
    "Pokémon TCG Pocket",
    "deck tracker",
    "battle logger",
    "Pokémon deck builder",
    "Pokémon TCG app",
    "TCG Pocket analytics",
    "Next.js Neon app",
  ],
  authors: [{ name: "Michelle Wiginton" }],
  creator: "Michelle Wiginton",
  publisher: "BattleLedger",
  openGraph: {
    title: "Pokémon TCG Pocket BattleLedger",
    description:
      "A Next.js + Neon web app to track decks, battles, and win rates for Pokémon TCG Pocket.",
    url: "https://tcgpbattleledger.com/",
    siteName: "TCG Pocket BattleLedger",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Pokémon TCG Pocket BattleLedger deck tracking interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokémon TCG Pocket BattleLedger",
    description:
      "Track decks and battles for Pokémon TCG Pocket with BattleLedger.",
    images: ["/social-preview.png"],
    creator: "@mdwiginton",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://tcgpbattleledger.com/",
  },
  themeColor: "#ffffff",
  manifest: "/site.webmanifest",

  icons: {
    icon: [
      { url: "/logo_1.svg", type: "image/svg+xml" },
    ],
    shortcut: [{ url: "/logo_1.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo_1.svg", sizes: "180x180", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo_1.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Pokémon TCG Pocket BattleLedger",
              url: "https://tcgpbattleledger.com/",
              applicationCategory: [
                "GameUtility",
                "EntertainmentApplication",
                "Pokémon TCG Pocket Tool",
              ],
              operatingSystem: "Web",
              description:
                "A web app that helps Pokémon TCG Pocket players track decks, log battles, and analyze win rates.",
              author: {
                "@type": "Person",
                name: "Michelle Wiginton",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              publisher: {
                "@type": "Organization",
                name: "BattleLedger",
                url: "https://tcgpbattleledger.com/",
              },
            }),
          }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className={styles.pageWrapper}>
          <main className={styles.mainContent}>{children}</main>

          <footer className={styles.footer} role="contentinfo">
            <div className={styles.footerContainer}>
              <span className={styles.footerText}>
                This is an independent project and is not affiliated with,
                endorsed by, or supported by The Pokémon Company, DeNA Co.,
                Ltd., or Creatures, Inc. All Pokémon names, images, and related
                assets are © their respective owners.
              </span>

              <nav className={styles.footerLinks} aria-label="Footer">
                <a href="/support" className={styles.footerLink}>
                  Contact / Support
                </a>
                <a href="/privacy" className={styles.footerLink}>
                  Privacy Policy
                </a>
              </nav>
            </div>
          </footer>
        </div>

        <BuyMeCoffeeButton />
        <Analytics />
      </body>
    </html>
  );
}
