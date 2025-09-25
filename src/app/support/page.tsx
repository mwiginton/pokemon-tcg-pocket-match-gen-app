'use client'

import styles from '@/styles/layout.module.css'
import buttonStyles from '@/styles/button.module.css'
import Link from 'next/link'

export default function SupportPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.header}>Support & Contact</h1>
        <p>
          Thanks for using <strong>Pokémon TCG Pocket BattleLedger</strong>!  
          This project is built by a solo developer in my spare time.  
          If you’ve run into an issue, have a feature suggestion, or just want
          to say hi, here’s how you can reach me:
        </p>

        <ul style={{ textAlign: 'left', marginTop: '1rem', paddingLeft: '1.2rem' }}>
          <li style={{ marginBottom: '1rem' }}>
            <strong>Questions or Issues:</strong>  
            Send me an email {' '}
            <a href="mailto:michelle.wiginton00@gmail.com" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 500 }}>
                here
            </a>
          </li>
          <li style={{ marginBottom: '1rem' }}>
            <strong>Feedback & Suggestions:</strong>  
            Share your ideas or just say thanks through{' '}
            <a
              href="https://buymeacoffee.com/michellewig"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy Me a Coffee
            </a>
            .
          </li>
          <li style={{ marginBottom: '1rem' }}>
            <strong>Updates:</strong>  
            Follow along with new features and announcements right here in the app.
          </li>
        </ul>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <Link href="/dashboard" className={`${buttonStyles.button} ${buttonStyles.primary}`}>
            Back to Dashboard
          </Link>
          <a
            href="https://buymeacoffee.com/michellewig"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles.button}
          >
            Buy Me a Coffee ☕
          </a>
        </div>
      </div>
    </div>
  )
}
