'use client'

import styles from '@/styles/layout.module.css'

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>BattleLedger</p>
            <h1 className={styles.pageTitle}>Privacy Policy</h1>
            <p className={styles.pageIntro}>Last updated: October 6, 2025</p>
          </div>
        </header>

        <article className={styles.panel}>
          <p>
            <strong>Pokemon TCG Pocket BattleLedger</strong> respects your privacy.
            This Privacy Policy explains how we collect, use, and protect your information
            when you use our application at{' '}
            <a
              href="https://www.tcgpbattleledger.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.inlineLink}
            >
              tcgpbattleledger.com
            </a>.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We collect only the data necessary to provide and improve our services, such as
            your email address for authentication, and deck or battle records you create.
          </p>

          <h2>How We Use Your Data</h2>
          <p>
            Data is used solely to enable account login, store your deck and match information,
            and provide analytics within your personal dashboard.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We use Neon for authentication and data storage. Neon may process data in
            accordance with its own privacy policy at{' '}
            <a
              href="https://neon.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.inlineLink}
            >
              neon.com/privacy-policy
            </a>.
          </p>

          <h2>Your Rights</h2>
          <p>
            You can request deletion of your account or data by contacting us at{' '}
            <a
              href="mailto:michelle.wiginton00@gmail.com"
              className={styles.inlineLink}
            >
              michelle.wiginton00@gmail.com
            </a>.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a
              href="mailto:michelle.wiginton00@gmail.com"
              className={styles.inlineLink}
            >
              michelle.wiginton00@gmail.com
            </a>.
          </p>
        </article>
      </div>
    </div>
  )
}
