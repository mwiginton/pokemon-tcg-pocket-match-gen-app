'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import styles from '@/styles/layout.module.css'
import buttonStyles from '@/styles/button.module.css'
import CardAutocompleteInput from '@/components/CardAutocompleteInput'

type CardEntry = {
  id: string
  name: string
}

export default function NewDeckPage() {
  const router = useRouter()

  const [deckName, setDeckName] = useState('')
  const [cards, setCards] = useState<CardEntry[]>(Array(20).fill({ id: '', name: '' }))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [deckCount, setDeckCount] = useState<number | null>(null)
  const [invalidDeckName, setInvalidDeckName] = useState(false)
  const deckNameRef = useRef<HTMLInputElement | null>(null)
  const maxDecks = 10

  useEffect(() => {
    const fetchDeckCount = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (!user) return

      const { count, error } = await supabase
        .from('decks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (!error) setDeckCount(count ?? 0)
    }

    fetchDeckCount()
  }, [])

  const handleCardSlotChange = (index: number, newCard: CardEntry) => {
    const newCards = [...cards]
    newCards[index] = newCard
    setCards(newCards)
  }

  const scrollToError = () => {
    // Smoothly scroll to deck name field if visible error
    deckNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    deckNameRef.current?.focus()
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
      return
    }

    const { data: userData, error: userError } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user || userError) {
      setError('Not authenticated.')
      setLoading(false)
      return
    }

    const { data: deckData, error: deckError } = await supabase
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

    const { error: cardsError } = await supabase
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
    <div className={styles.page}>
      <div className={`${styles.card} ${hasReachedLimit ? styles.noPress : ''}`}>
        <h1 className={styles.header}>Create New Deck</h1>
        {error && <p className={styles.errorText}>{error}</p>}

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
        <div className={styles.cardGroup}>
          {cards.map((card, index) => (
            <div key={index} className={styles.cardInputRow}>
              <label className={styles.label} htmlFor={`card-${index}`}>
                Card {index + 1}
              </label>
              <CardAutocompleteInput
                index={index}
                value={card}
                onChange={(newCard) => handleCardSlotChange(index, newCard)}
                disabled={hasReachedLimit}
              />
            </div>
          ))}
        </div>
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
