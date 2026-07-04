'use client'

import styles from '@/styles/layout.module.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Library, Dice3, BarChart3, ShieldCheck } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className={styles.page}>
      <main className={styles.landingmain}>
        <Image
          src="/logo.png"
          alt="Logo"
          width={72}
          height={72}
          className={styles.landinglogo}
        />
        <h1 className={styles.landingtitle}>Pokémon TCG Pocket BattleLedger</h1>
        <p className={styles.landingsubtitle}>
          Track your decks. Generate random battle scenarios. Record wins and
          losses. All in one place.
        </p>

        <div className={styles.landingactions}>
          <button
            className={styles.landingprimary}
            onClick={() => router.push('/auth')}
          >
            Get Started
          </button>
        </div>

        <section className={styles.landingfeatures}>
          <h2>What You Can Do</h2>
          <ul>
            <li>
              <Library size={18} className={styles.landingicon} />
              Log all your custom decks from Pokémon TCG Pocket
            </li>
            <li>
              <Dice3 size={18} className={styles.landingicon} />
              Generate random solo battle scenarios
            </li>
            <li>
              <BarChart3 size={18} className={styles.landingicon} />
              Record match outcomes and track win rates
            </li>
            <li>
              <ShieldCheck size={18} className={styles.landingicon} />
              Secure email and password login
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}
