'use client'

import styles from '@/styles/layout.module.css'
import buttonStyles from '@/styles/button.module.css'
import Link from 'next/link'

export default function SupportPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>BattleLedger</p>
            <h1 className={styles.pageTitle}>Support & Contact</h1>
            <p className={styles.pageIntro}>
              Help, feedback, and project contact details in one place.
            </p>
          </div>
        </header>

        <article className={styles.panel}>
          <p>
            Thanks for using <strong>Pokemon TCG Pocket BattleLedger</strong>!
            This project is built by a solo developer in my spare time. If you
            have run into an issue, have a feature suggestion, or just want to
            say hi, here is how you can reach me.
          </p>

          <div className={styles.matchGrid}>
            <section className={styles.matchSection}>
              <h2>Questions or Issues</h2>
              <p className={styles.metaText}>
                Send an email to{' '}
                <a href="mailto:michelle.wiginton00@gmail.com" className={styles.inlineLink}>
                  michelle.wiginton00@gmail.com
                </a>.
              </p>
            </section>
            <section className={styles.matchSection}>
              <h2>Feedback & Suggestions</h2>
              <p className={styles.metaText}>
                Share ideas or support the project through{' '}
                <a
                  href="https://buymeacoffee.com/michellewig"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.inlineLink}
                >
                  Buy Me a Coffee
                </a>.
              </p>
            </section>
          </div>

          <div className={styles.buttonRow}>
            <Link href="/dashboard" className={`${buttonStyles.button} ${buttonStyles.primary}`}>
              Back to Dashboard
            </Link>
            <a
              href="https://buymeacoffee.com/michellewig"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles.button}
            >
              Buy Me a Coffee
            </a>
          </div>
        </article>
      </div>
    </div>
  )
}
