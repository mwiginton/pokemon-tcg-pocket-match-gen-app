'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import styles from '@/styles/layout.module.css'
import CardAutocompleteInput from '@/components/CardAutocompleteInput'

type CardEntry = {
  id: string
  name: string
}

export default function EditDeckPage() {
  const router = useRouter()
  const params = useParams()
  const deckId = params.id as string

  const [deckName, setDeckName] = useState('')
  const [cards, setCards] = useState<CardEntry[]>(Array(20).fill({ id: '', name: '' }))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDeck = async () => {
      setError('')
      setLoading(true)

      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (!user) {
        setError('Not authenticated.')
        router.push('/')
        return
      }

      // Get deck name
      const { data: deck, error: deckError } = await supabase
        .from('decks')
        .select('deck_name')
        .eq('id', deckId)
        .eq('user_id', user.id)
        .single()

      if (deckError || !deck) {
        setError(deckError?.message || 'Deck not found.')
        setLoading(false)
        return
      }

      setDeckName(deck.deck_name)

      // Get card entries
      const { data: deckCards, error: cardError } = await supabase
        .from('deck_cards')
        .select('card_id, card_index, cards(name)')
        .eq('deck_id', deckId)
        .order('card_index', { ascending: true })

      if (cardError || !deckCards) {
        setError(cardError?.message || 'Failed to load deck cards.')
        setLoading(false)
        return
      }

      const formatted = Array(20).fill({ id: '', name: '' })
      deckCards.forEach((dc: any) => {
        if (dc.card_index < 20) {
          formatted[dc.card_index] = {
            id: dc.card_id,
            name: dc.cards?.name || '',
          }
        }
      })

      setCards(formatted)
      setLoading(false)
    }

    loadDeck()
  }, [deckId, router])

  const handleCardSlotChange = (index: number, newCard: CardEntry) => {
    const updated = [...cards]
    updated[index] = newCard
    setCards(updated)
  }

  const handleUpdate = async () => {
    setError('')
    setLoading(true)

    if (!deckName.trim()) {
      setError('Deck name is required.')
      setLoading(false)
      return
    }

    if (cards.some(card => !card.id)) {
      setError('All 20 card slots must be filled.')
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase
      .from('decks')
      .update({ deck_name: deckName })
      .eq('id', deckId)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    const { error: deleteError } = await supabase
      .from('deck_cards')
      .delete()
      .eq('deck_id', deckId)

    if (deleteError) {
      setError(deleteError.message)
      setLoading(false)
      return
    }

    const newDeckCards = cards.map((card, index) => ({
      deck_id: deckId,
      card_id: card.id,
      card_index: index,
    }))

    const { error: insertError } = await supabase
      .from('deck_cards')
      .insert(newDeckCards)

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.header}>✏️ Edit Deck</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading && <p>Loading...</p>}

        {!loading && (
          <>
            <input
              type="text"
              placeholder="Deck Name"
              value={deckName}
              onChange={e => setDeckName(e.target.value)}
              className={styles.input}
            />

            {cards.map((card, index) => (
              <CardAutocompleteInput
                key={index}
                index={index}
                value={card}
                onChange={(newCard) => handleCardSlotChange(index, newCard)}
              />
            ))}

            <button
              onClick={handleUpdate}
              disabled={loading}
              className={styles.button}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
