import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BuyMeCoffeeButton from "@/components/BuyMeCoffeeButton";
import styles from "@/styles/layout.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TCG Pocket BattleLedger",
  description:
    "Track decks, generate battle scenarios, and log wins/losses for Pokémon TCG Pocket.",
  keywords: [
    "Pokémon TCG Pocket",
    "deck tracker",
    "battle simulator",
    "trading card game",
    "deck logging",
  ],
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className={styles.pageWrapper}>
          <main className={styles.mainContent}>{children}</main>

          {/* Global footer */}
          <footer className={styles.footer} role="contentinfo">
            <div className={styles.footerContainer}>
              <span className={styles.footerText}>
                © {new Date().getFullYear()} Pokémon TCG Pocket BattleLedger. All
                rights reserved.
              </span>

              <nav className={styles.footerLinks} aria-label="Footer">
                <a href="/support" className={styles.footerLink}>
                  Contact / Support
                </a>
              </nav>
            </div>
          </footer>
        </div>

        <BuyMeCoffeeButton />
      </body>
    </html>
  );
}
