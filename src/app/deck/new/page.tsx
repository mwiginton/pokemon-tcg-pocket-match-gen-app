'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import styles from '@/styles/layout.module.css'

export default function NewDeckPage() {
  const router = useRouter()

  const [deckName, setDeckName] = useState('')
  const [cards, setCards] = useState(Array(20).fill(''))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCardChange = (index: number, value: string) => {
    const newCards = [...cards]
    newCards[index] = value
    setCards(newCards)
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    // Validation
    if (!deckName.trim()) {
      setError('Deck name is required.')
      setLoading(false)
      return
    }
    if (cards.some(card => !card.trim())) {
      setError('All 20 card slots must be filled.')
      setLoading(false)
      return
    }

    // Get user
    const { data: userData, error: userError } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user || userError) {
      setError('Not authenticated.')
      setLoading(false)
      return
    }

    // Insert into decks
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

    // Prepare deck_cards rows
    const deckCards = cards.map((name, index) => ({
      deck_id: deckData.id,
      card_name: name.trim(),
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

    // Success: Redirect to dashboard or deck list
    router.push('/dashboard')
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.header}>Create New Deck</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <input
          type="text"
          placeholder="Deck Name"
          value={deckName}
          onChange={e => setDeckName(e.target.value)}
          className={styles.input}
        />

        {cards.map((card, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Card ${index + 1}`}
            value={card}
            onChange={e => handleCardChange(index, e.target.value)}
            className={styles.input}
          />
        ))}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={styles.button}
        >
          {loading ? 'Saving...' : 'Save Deck'}
        </button>
      </div>
    </div>
  )
}
