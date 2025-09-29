'use client'

import styles from './landing.module.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Library, Dice3, BarChart3, ShieldCheck } from 'lucide-react'
import layoutStyles from "@/styles/layout.module.css";

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image src="/logo.svg" alt="Logo" width={72} height={72} className={styles.logo} />
        <h1 className={styles.title}>Pokémon TCG Pocket BattleLedger</h1>
        <p className={styles.subtitle}>
          Track your decks. Generate random battle scenarios. Record wins and losses. All in one place.
        </p>

        <div className={styles.actions}>
          <button className={styles.primary} onClick={() => router.push('/auth')}>
            Get Started
          </button>
        </div>

        <section className={styles.features}>
          <h2>What You Can Do</h2>
          <ul>
            <li>
              <Library size={18} className={styles.icon} />
              Log all your custom decks from Pokémon TCG Pocket
            </li>
            <li>
              <Dice3 size={18} className={styles.icon} />
              Generate random solo battle scenarios
            </li>
            <li>
              <BarChart3 size={18} className={styles.icon} />
              Record match outcomes and track win rates
            </li>
            <li>
              <ShieldCheck size={18} className={styles.icon} />
              Secure login with Google or Email
            </li>
          </ul>
        </section>

        <footer className={layoutStyles.footer} role="contentinfo">
            <div className={layoutStyles.footerContainer}>
              <span className={layoutStyles.footerText}>
                This is an independent project and is not affiliated with, endorsed by, or supported by The Pokémon
                Company, DeNA Co., Ltd., or Creatures, Inc.  
                All Pokémon names, images, and related assets are © their
                respective owners.
              </span>

              <nav className={layoutStyles.footerLinks} aria-label="Footer">
                <a href="/support" className={layoutStyles.footerLink}>
                  Contact / Support
                </a>
              </nav>
            </div>
          </footer>
      </main>
    </div>
  )
}
