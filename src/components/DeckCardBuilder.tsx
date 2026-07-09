'use client'

import { useMemo, useState } from 'react'
import { CopyPlus, Upload } from 'lucide-react'
import CardAutocompleteInput from '@/components/CardAutocompleteInput'
import styles from '@/styles/layout.module.css'
import buttonStyles from '@/styles/button.module.css'

export type DeckCardEntry = {
  id: string
  name: string
  pack?: string
}

type LookupResult = {
  term: string
  card: DeckCardEntry | null
  matchedBy: 'id' | 'name' | 'partial' | null
}

type Props = {
  cards: DeckCardEntry[]
  onCardsChange: (cards: DeckCardEntry[]) => void
  disabled?: boolean
  duplicateErrors: Record<number, string>
}

const maxCards = 20

const emptyCard = (): DeckCardEntry => ({ id: '', name: '' })

const getCardKey = (card: DeckCardEntry) =>
  card.name.trim().toLowerCase() || card.id

const parseDeckList = (text: string) => {
  const entries: string[] = []

  for (const rawLine of text.split(/\r?\n|;/)) {
    let line = rawLine
      .trim()
      .replace(/^[-*]\s+/, '')
      .replace(/^\d+[.)]\s+/, '')

    if (!line) continue

    let count = 1
    const leadingCount = line.match(/^(\d+)\s*x?\s+(.+)$/i)
    const leadingXCount = line.match(/^(\d+)x\s+(.+)$/i)
    const trailingCount = line.match(/^(.+?)\s+x\s*(\d+)$/i)

    if (leadingXCount) {
      count = Number(leadingXCount[1])
      line = leadingXCount[2].trim()
    } else if (leadingCount) {
      count = Number(leadingCount[1])
      line = leadingCount[2].trim()
    } else if (trailingCount) {
      count = Number(trailingCount[2])
      line = trailingCount[1].trim()
    }

    if (!line) continue

    const safeCount = Number.isFinite(count)
      ? Math.min(Math.max(Math.floor(count), 1), maxCards)
      : 1

    for (let i = 0; i < safeCount; i++) {
      entries.push(line)
      if (entries.length >= maxCards) return entries
    }
  }

  return entries
}

export default function DeckCardBuilder({
  cards,
  onCardsChange,
  disabled,
  duplicateErrors,
}: Props) {
  const [importText, setImportText] = useState('')
  const [importing, setImporting] = useState(false)
  const [importMessage, setImportMessage] = useState('')
  const [importIssues, setImportIssues] = useState<string[]>([])

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
    if (emptyIndex === -1) {
      setImportMessage('No empty card slots are available.')
      return
    }

    const newCards = [...cards]
    newCards[emptyIndex] = card
    onCardsChange(newCards)
    setImportMessage(`Added a second copy of ${card.name}.`)
  }

  const resolveImport = async () => {
    const terms = parseDeckList(importText)
    if (terms.length === 0) {
      setImportMessage('Paste at least one card name or card id.')
      setImportIssues([])
      return []
    }

    setImporting(true)
    setImportMessage('')
    setImportIssues([])

    try {
      const response = await fetch('/api/cardlookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terms }),
      })

      if (!response.ok) {
        setImportMessage('Could not import cards right now.')
        return []
      }

      const { results } = (await response.json()) as { results?: LookupResult[] }
      return (results ?? []).map((result) => ({
        originalTerm: result.term,
        card: result.card ?? { id: '', name: result.term },
        matchedBy: result.matchedBy,
      }))
    } finally {
      setImporting(false)
    }
  }

  const importCards = async (mode: 'replace' | 'fill') => {
    const resolved = await resolveImport()
    if (resolved.length === 0) return

    const nextCards =
      mode === 'replace' ? Array.from({ length: maxCards }, emptyCard) : [...cards]

    let importedCount = 0
    for (const result of resolved) {
      const targetIndex = nextCards.findIndex((card) => !card.id && !card.name)
      if (targetIndex === -1) break
      nextCards[targetIndex] = result.card
      importedCount++
    }

    const unresolved = resolved
      .filter((result) => !result.card.id)
      .map((result) => result.originalTerm)

    const partialMatches = resolved
      .filter((result) => result.matchedBy === 'partial')
      .map((result) => result.originalTerm)

    onCardsChange(nextCards)
    setImportIssues([
      ...(unresolved.length ? [`Could not match: ${unresolved.join(', ')}`] : []),
      ...(partialMatches.length ? [`Partial matches used: ${partialMatches.join(', ')}`] : []),
    ])
    setImportMessage(
      mode === 'replace'
        ? `Imported ${importedCount} card slots.`
        : `Filled ${importedCount} empty card slots.`,
    )
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

      <div className={styles.importPanel}>
        <label className={styles.label} htmlFor="deck-import">
          Paste or import a deck list
        </label>
        <textarea
          id="deck-import"
          className={styles.importTextarea}
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
          disabled={disabled || importing}
          placeholder={'2 Pikachu\nPikachu ex x2\n[A1-001] Bulbasaur'}
          rows={5}
        />
        <div className={styles.importActions}>
          <button
            type="button"
            onClick={() => importCards('fill')}
            disabled={disabled || importing}
            className={`${buttonStyles.buttonCompact} ${buttonStyles.secondary}`}
          >
            <Upload size={15} />
            Fill Empty Slots
          </button>
          <button
            type="button"
            onClick={() => importCards('replace')}
            disabled={disabled || importing}
            className={`${buttonStyles.buttonCompact} ${buttonStyles.primary}`}
          >
            <Upload size={15} />
            Replace Cards
          </button>
        </div>
        {importMessage && <p className={styles.importMessage}>{importMessage}</p>}
        {importIssues.length > 0 && (
          <ul className={styles.importIssues}>
            {importIssues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        )}
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
