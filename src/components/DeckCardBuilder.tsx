'use client'

import { useMemo } from 'react'
import { CopyPlus } from 'lucide-react'
import CardAutocompleteInput from '@/components/CardAutocompleteInput'
import styles from '@/styles/layout.module.css'

export type DeckCardEntry = {
  id: string
  name: string
  pack?: string
}

type Props = {
  cards: DeckCardEntry[]
  onCardsChange: (cards: DeckCardEntry[]) => void
  disabled?: boolean
  duplicateErrors: Record<number, string>
}

const maxCards = 20

const getCardKey = (card: DeckCardEntry) =>
  card.name.trim().toLowerCase() || card.id

export default function DeckCardBuilder({
  cards,
  onCardsChange,
  disabled,
  duplicateErrors,
}: Props) {
  const filledCount = cards.filter((card) => card.id).length
  const emptySlots = maxCards - filledCount
  const blankSlots = cards.filter((card) => !card.id && !card.name.trim()).length

  const copyCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const card of cards) {
      const key = getCardKey(card)
      if (!key) continue
      counts[key] = (counts[key] || 0) + 1
    }
    return counts
  }, [cards])

  const handleCardSlotChange = (index: number, newCard: DeckCardEntry) => {
    const newCards = [...cards]
    newCards[index] = newCard
    onCardsChange(newCards)
  }

  const addSecondCopy = (index: number) => {
    const card = cards[index]
    const key = getCardKey(card)
    if (!key || disabled || copyCounts[key] >= 2) return

    const emptyIndex = cards.findIndex((slot) => !slot.id && !slot.name.trim())
    if (emptyIndex === -1) return

    const newCards = [...cards]
    newCards[emptyIndex] = card
    onCardsChange(newCards)
  }

  return (
    <>
      <div className={styles.deckProgressPanel}>
        <div className={styles.deckProgressHeader}>
          <span className={styles.deckProgressTitle}>Deck progress</span>
          <span className={styles.deckProgressCount}>{filledCount} / {maxCards} cards</span>
        </div>
        <div className={styles.deckProgressTrack} aria-hidden="true">
          <div
            className={styles.deckProgressFill}
            style={{ width: `${(filledCount / maxCards) * 100}%` }}
          />
        </div>
        <p className={styles.helperText}>
          {emptySlots === 0 ? 'All card slots are filled.' : `${emptySlots} card slots remaining.`}
        </p>
      </div>

      <div className={styles.cardGroup}>
        {cards.map((card, index) => {
          const key = getCardKey(card)
          const copyCount = key ? copyCounts[key] ?? 0 : 0
          const canAddCopy = Boolean(card.id && copyCount === 1 && blankSlots > 0 && !disabled)

          return (
            <div key={index} className={styles.cardInputRow}>
              <div className={styles.cardSlotHeader}>
                <label className={styles.label} htmlFor={`card-${index}`}>
                  Card {index + 1}
                </label>
                {key && (
                  <span
                    className={`${styles.copyBadge} ${copyCount > 2 ? styles.copyBadgeInvalid : ''}`}
                    aria-label={`${copyCount} copies selected`}
                  >
                    x{copyCount}
                  </span>
                )}
              </div>
              <div className={styles.cardSlotControls}>
                <CardAutocompleteInput
                  index={index}
                  value={card}
                  onChange={(newCard) => handleCardSlotChange(index, newCard)}
                  disabled={disabled}
                />
                {canAddCopy && (
                  <button
                    type="button"
                    onClick={() => addSecondCopy(index)}
                    className={styles.quickCopyButton}
                    aria-label={`Add second copy of ${card.name}`}
                  >
                    <CopyPlus size={15} />
                    Add Copy
                  </button>
                )}
              </div>
              {duplicateErrors[index] && (
                <p className={styles.errorText} style={{ marginTop: '4px' }}>
                  {duplicateErrors[index]}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
