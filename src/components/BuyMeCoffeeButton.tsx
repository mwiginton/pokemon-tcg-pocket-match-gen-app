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
      <Coffee size={20} />
    </a>
  )
}