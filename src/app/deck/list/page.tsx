'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import styles from '@/styles/layout.module.css'

type Deck = {
  id: string
  deck_name: string
  created_at: string
}

type DeckCard = {
  id: string
  deck_id: string
  card_id: string
  card_index: number
  cards: {
    name: string
  } | null
}

export default function DeckListPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [deckCards, setDeckCards] = useState<DeckCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDecksAndCards = async () => {
      setLoading(true)
      setError('')

      // Get user
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (!user) {
        setError('You must be signed in.')
        setLoading(false)
        return
      }

      // Fetch decks
      const { data: decksData, error: decksError } = await supabase
        .from('decks')
        .select('id, deck_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (decksError || !decksData) {
        setError(decksError?.message || 'Failed to load decks.')
        setLoading(false)
        return
      }

      setDecks(decksData)

      if (decksData.length === 0) {
        setLoading(false)
        return
      }

      const deckIds = decksData.map(d => d.id)

      // Fetch deck_cards with card name via foreign key
      const { data: cardsData, error: cardsError } = await supabase
        .from('deck_cards')
        .select('id, deck_id, card_id, card_index, cards(name)')
        .in('deck_id', deckIds)

      if (cardsError) {
        setError(cardsError.message)
      } else {
        setDeckCards(cardsData || [])
      }

      setLoading(false)
    }

    fetchDecksAndCards()
  }, [])

  const getCardsForDeck = (deckId: string) => {
    return deckCards
      .filter(card => card.deck_id === deckId)
      .sort((a, b) => a.card_index - b.card_index)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.header}>📚 Your Saved Decks</h1>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {decks.length === 0 && !loading && (
          <p>No decks found. <Link href="/deck/new">Create one?</Link></p>
        )}
      </div>

      {decks.map(deck => (
        <div key={deck.id} className={styles.card}>
          <h2>{deck.deck_name}</h2>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Created: {new Date(deck.created_at).toLocaleString()}
          </p>
          <ol style={{ columns: 2, paddingLeft: 20 }}>
            {getCardsForDeck(deck.id).map(card => (
              <li key={card.id}>{card.cards?.name ?? '(Unknown Card)'}</li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}
