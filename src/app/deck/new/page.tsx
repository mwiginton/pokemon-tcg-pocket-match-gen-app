'use client'

import { useState } from 'react'
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

  const handleCardSlotChange = (index: number, newCard: CardEntry) => {
    const newCards = [...cards]
    newCards[index] = newCard
    setCards(newCards)
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    if (!deckName.trim()) {
      setError('Deck name is required.')
      setLoading(false)
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

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.header}>Create New Deck</h1>
        {error && <p className={styles.errorText}>{error}</p>}

        <label className={styles.label} htmlFor="deckName">Deck Name</label>
        <input
          id="deckName"
          type="text"
          placeholder="Deck Name"
          value={deckName}
          onChange={e => setDeckName(e.target.value)}
          className={`${styles.input} ${styles.deckNameInput}`}
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
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`${buttonStyles.button} ${buttonStyles.primary}`}
        >
          {loading ? 'Saving...' : 'Save Deck'}
        </button>
      </div>
    </div>
  )
}
