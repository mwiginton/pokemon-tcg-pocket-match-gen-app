'use client'

import styles from './landing.module.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Library, Dice3, BarChart3, ShieldCheck } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image src="/logo.svg" alt="Logo" width={72} height={72} className={styles.logo} />
        <h1 className={styles.title}>Pokémon TCG Pocket Companion</h1>
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

        <footer className={styles.footer}>
          © {new Date().getFullYear()} Pokémon TCG Pocket Companion. All rights reserved.
        </footer>
      </main>
    </div>
  )
}
