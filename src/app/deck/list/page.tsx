'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import styles from '@/styles/layout.module.css'
import { Pencil, Trash2 } from 'lucide-react'
import { BookMarked } from 'lucide-react'

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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const fetchDecksAndCards = async () => {
      setLoading(true)
      setError('')
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (!user) {
        setError('You must be signed in.')
        setLoading(false)
        return
      }

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

  const getCardsForDeck = (deckId: string) =>
    deckCards
      .filter(card => card.deck_id === deckId)
      .sort((a, b) => a.card_index - b.card_index)

  const handleDeleteDeck = async (deckId: string) => {
    const { error } = await supabase.from('decks').delete().eq('id', deckId)
    if (error) {
      alert('Failed to delete deck: ' + error.message)
      return
    }
    setDecks(prev => prev.filter(d => d.id !== deckId))
    setDeckCards(prev => prev.filter(c => c.deck_id !== deckId))
    setConfirmDeleteId(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.headerWithIcon}>
          <BookMarked size={28} strokeWidth={2} />
          <h1 className={styles.headerText}>Your Saved Decks</h1>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {decks.length === 0 && !loading && (
          <p>No decks found. <Link href="/deck/new">Create one?</Link></p>
        )}
      </div>

      {decks.map(deck => (
        <div key={deck.id} className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>{deck.deck_name}</h2>
            <div className={styles.buttonGroup}>
              <Link
                href={`/deck/${deck.id}/edit`}
                className={`${styles.iconButton} ${styles.iconButtonEdit}`}
              >
                <Pencil size={16} />
                <span>Edit</span>
              </Link>
              <button
                onClick={() => setConfirmDeleteId(deck.id)}
                className={`${styles.iconButton} ${styles.iconButtonDelete}`}
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
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

      {confirmDeleteId && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: '1rem 1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1000,
          minWidth: 300,
          color: '#000'
        }}>
          <p style={{ marginBottom: 12, fontWeight: 'bold', color: '#000' }}>
            Are you sure you want to delete this deck?
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              onClick={() => handleDeleteDeck(confirmDeleteId)}
              style={{
                background: 'red',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirmDeleteId(null)}
              style={{
                background: '#ccc',
                color: '#000',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
