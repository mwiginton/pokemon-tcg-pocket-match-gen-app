'use client'

import styles from '@/styles/layout.module.css'

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.header}>Privacy Policy</h1>
        <p><strong>Last updated:</strong> October 6, 2025</p>

        <p>
          <strong>Pokémon TCG Pocket BattleLedger</strong> (“we”, “our”, or “us”) respects your privacy.
          This Privacy Policy explains how we collect, use, and protect your information
          when you use our application at{' '}
          <a
            href="https://www.tcgpbattleledger.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2563eb', textDecoration: 'underline' }}
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
            style={{ color: '#2563eb', textDecoration: 'underline' }}
          >
            neon.com/privacy-policy
          </a>.
        </p>

        <h2>Your Rights</h2>
        <p>
          You can request deletion of your account or data by contacting us at{' '}
          <a
            href="mailto:michelle.wiginton00@gmail.com"
            style={{ color: '#2563eb', textDecoration: 'underline' }}
          >
            michelle.wiginton00@gmail.com
          </a>.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at{' '}
          <a
            href="mailto:michelle.wiginton00@gmail.com"
            style={{ color: '#2563eb', textDecoration: 'underline' }}
          >
            michelle.wiginton00@gmail.com
          </a>.
        </p>
      </div>
    </div>
  )
}
