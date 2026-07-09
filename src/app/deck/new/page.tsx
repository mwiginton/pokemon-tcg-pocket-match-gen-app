'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { client } from '@/lib/neonClient'
import { getAuthenticatedUser } from '@/lib/authUser'
import styles from '@/styles/layout.module.css'
import buttonStyles from '@/styles/button.module.css'
import DeckCardBuilder, { DeckCardEntry } from '@/components/DeckCardBuilder'

export default function NewDeckPage() {
  const router = useRouter()

  const [deckName, setDeckName] = useState('')
  const [cards, setCards] = useState<DeckCardEntry[]>(Array(20).fill({ id: '', name: '' }))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [deckCount, setDeckCount] = useState<number | null>(null)
  const [invalidDeckName, setInvalidDeckName] = useState(false)
  const [duplicateErrors, setDuplicateErrors] = useState<Record<number, string>>({})
  const deckNameRef = useRef<HTMLInputElement | null>(null)
  const maxDecks = 10

  useEffect(() => {
    const fetchDeckCount = async () => {
      const { user } = await getAuthenticatedUser()
      if (!user) return

      const { count, error } = await client
        .from('decks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (!error) setDeckCount(count ?? 0)
    }

    fetchDeckCount()
  }, [])

  const scrollToError = () => {
    deckNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    deckNameRef.current?.focus()
  }

  // Find cards appearing more than twice and mark their positions
  const validateDuplicateCards = (cardsToCheck: DeckCardEntry[]): Record<number, string> => {
    const nameCounts: Record<string, number> = {}
    const violations: Record<number, string> = {}

    // Count each card name
    for (const card of cardsToCheck) {
      if (!card.name.trim()) continue
      const name = card.name.trim()
      nameCounts[name] = (nameCounts[name] || 0) + 1
    }

    // Mark indices that violate
    for (let i = 0; i < cardsToCheck.length; i++) {
      const card = cardsToCheck[i]
      if (!card.name.trim()) continue
      if (nameCounts[card.name.trim()] > 2) {
        violations[i] = `You can only include up to 2 copies of "${card.name.trim()}".`
      }
    }

    return violations
  }

  const handleCardsChange = (newCards: DeckCardEntry[]) => {
    setCards(newCards)
    const validation = validateDuplicateCards(newCards)
    setDuplicateErrors(validation)
  }

  const handleSubmit = async () => {
    if (hasReachedLimit) return
    setError('')
    setInvalidDeckName(false)
    setLoading(true)

    if (!deckName.trim()) {
      setError('Deck name is required.')
      setInvalidDeckName(true)
      setLoading(false)
      scrollToError()
      return
    }

    if (cards.some(card => !card.id)) {
      setError('All 20 card slots must be filled with valid card selections.')
      setLoading(false)
      scrollToError()
      return
    }

    const validation = validateDuplicateCards(cards)
    setDuplicateErrors(validation)

    if (Object.keys(validation).length > 0) {
      setError('Some cards exceed the 2-copy limit. Please review highlighted slots.')
      setLoading(false)
      return
    }

    const { user, error: authError } = await getAuthenticatedUser()
    if (!user) {
      setError(authError || 'Not authenticated.')
      setLoading(false)
      return
    }

    const { data: deckData, error: deckError } = await client
      .from('decks')
      .insert({
        user_id: user.id,
        deck_name: deckName,
      })
      .select()
      .single()

    if (deckError || !deckData) {
      setError(deckError?.message || 'Failed to create deck.')
      setLoading(false)
      return
    }

    const deckCards = cards.map((card, index) => ({
      deck_id: deckData.id,
      card_id: card.id,
      card_index: index,
    }))

    const { error: cardsError } = await client
      .from('deck_cards')
      .insert(deckCards)

    if (cardsError) {
      setError(cardsError.message)
      setLoading(false)
      return
    }

    router.push('/deck/list')
  }

  const handleCancel = () => {
    router.push('/dashboard')
  }

  const hasReachedLimit = deckCount !== null && deckCount >= maxDecks
  const disableAll = loading || hasReachedLimit

  return (
    <div className={`${styles.page} ${styles.deckBuilderPage}`}>
      <div className={`${styles.card} ${hasReachedLimit ? styles.noPress : ''}`}>
        <h1 className={styles.header}>Create New Deck</h1>

        {hasReachedLimit && (
          <p className={styles.errorText}>
            You’ve reached the maximum of {maxDecks} decks. Delete one to add a new deck.
          </p>
        )}

        <label className={styles.label} htmlFor="deckName">Deck Name</label>
        <input
          id="deckName"
          type="text"
          ref={deckNameRef}
          placeholder="Deck Name"
          value={deckName}
          onChange={e => {
            setDeckName(e.target.value)
            if (invalidDeckName && e.target.value.trim()) setInvalidDeckName(false)
          }}
          className={`${styles.input} ${styles.deckNameInput} ${invalidDeckName ? styles.inputInvalid : ''}`}
          disabled={hasReachedLimit}
          autoComplete="off"
        />
        <p className={styles.helperText}>Give your deck a unique and descriptive name.</p>

        <h2 className={styles.subheader}>Add 20 Cards</h2>
        {error && <p className={styles.errorText}>{error}</p>}

        <DeckCardBuilder
          cards={cards}
          onCardsChange={handleCardsChange}
          disabled={hasReachedLimit}
          duplicateErrors={duplicateErrors}
        />
      </div>

      {/* Floating action bar */}
      <div className={styles.floatingButtonBar}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disableAll}
          aria-disabled={disableAll}
          className={`${buttonStyles.button} ${buttonStyles.primary} ${disableAll ? buttonStyles.disabled : ''}`}
        >
          {loading ? 'Saving...' : 'Save Deck'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          aria-disabled={loading}
          className={`${buttonStyles.button} ${buttonStyles.secondary} ${loading ? buttonStyles.disabled : ''}`}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
