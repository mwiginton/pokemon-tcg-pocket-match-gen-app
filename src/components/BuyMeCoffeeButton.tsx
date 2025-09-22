'use client'

import { Coffee } from 'lucide-react'
import styles from './BuyMeCoffeeButton.module.css'

export default function BuyMeCoffeeButton() {
  return (
    <a
      href="https://buymeacoffee.com/michellewig"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.floatingButton}
      aria-label="Buy me a coffee"
    >
      <Coffee size={18} className={styles.icon} />
      <span className={styles.text}>Buy me a coffee</span>
    </a>
  )
}
