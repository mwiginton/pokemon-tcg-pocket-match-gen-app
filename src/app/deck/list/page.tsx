'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import styles from '@/styles/layout.module.css'
import {
  Pencil,
  Trash2,
  BookMarked,
  Trophy,
  XCircle,
  RotateCcw,
} from 'lucide-react'

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
    image: string
  } | null
}

type DeckStats = {
  total_games: number
  wins: number
}

export default function DeckListPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [deckCards, setDeckCards] = useState<DeckCard[]>([])
  const [deckStats, setDeckStats] = useState<Record<string, DeckStats>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [selectedCardImage, setSelectedCardImage] = useState<string | null>(null)

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
      const deckIds = decksData.map((d) => d.id)

      const { data: cardsData, error: cardsError } = await supabase
        .from('deck_cards')
        .select('id, deck_id, card_id, card_index, cards(name, image)')
        .in('deck_id', deckIds)

      if (cardsError) {
        setError(cardsError.message)
      } else {
        setDeckCards(cardsData || [])
      }

      await refreshDeckStats(deckIds)

      setLoading(false)
    }

    fetchDecksAndCards()
  }, [])

  const refreshDeckStats = async (deckIds: string[]) => {
    const { data: gamesData, error: gamesError } = await supabase
      .from('deck_games')
      .select('deck_id, result')
      .in('deck_id', deckIds)

    if (gamesError) {
      setError(gamesError.message)
    } else {
      const statsMap: Record<string, DeckStats> = {}
      gamesData?.forEach(({ deck_id, result }) => {
        if (!statsMap[deck_id]) {
          statsMap[deck_id] = { total_games: 0, wins: 0 }
        }
        statsMap[deck_id].total_games++
        if (result === 'win') statsMap[deck_id].wins++
      })
      setDeckStats(statsMap)
    }
  }

  const recordGame = async (deckId: string, result: 'win' | 'loss') => {
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) {
      alert('You must be logged in.')
      return
    }

    const { error } = await supabase.from('deck_games').insert({
      deck_id: deckId,
      result,
      user_id: user.id,
    })

    if (error) {
      alert('Error recording game: ' + error.message)
    } else {
      await refreshDeckStats([deckId])
    }
  }

  const resetGameStats = async (deckId: string) => {
    const confirmReset = confirm('Are you sure you want to reset all recorded games for this deck?')
    if (!confirmReset) return

    const { error } = await supabase
      .from('deck_games')
      .delete()
      .eq('deck_id', deckId)

    if (error) {
      alert('Failed to reset stats: ' + error.message)
    } else {
      await refreshDeckStats([deckId])
    }
  }

  const getCardsForDeck = (deckId: string) =>
    deckCards
      .filter((card) => card.deck_id === deckId)
      .sort((a, b) => a.card_index - b.card_index)

  const handleDeleteDeck = async (deckId: string) => {
    const { error } = await supabase.from('decks').delete().eq('id', deckId)
    if (error) {
      alert('Failed to delete deck: ' + error.message)
      return
    }

    setDecks((prev) => prev.filter((d) => d.id !== deckId))
    setDeckCards((prev) => prev.filter((c) => c.deck_id !== deckId))
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
          <p>
            No decks found. <Link href="/deck/new">Create one?</Link>
          </p>
        )}
      </div>

      {decks.map((deck) => {
        const stats = deckStats[deck.id]
        const winRate =
          stats && stats.total_games > 0
            ? Math.round((stats.wins / stats.total_games) * 100)
            : null

        return (
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

            {stats && (
              <p style={{ fontSize: '0.85rem', color: '#444' }}>
                Games Played: {stats.total_games}, Wins: {stats.wins}, Win Rate: {winRate ?? 0}%
              </p>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => recordGame(deck.id, 'win')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  background: '#e6f9ec',
                  color: '#1a7f37',
                  border: '1px solid #b2e0c0',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                <Trophy size={16} />
                Record Win
              </button>

              <button
                onClick={() => recordGame(deck.id, 'loss')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  background: '#ffecec',
                  color: '#c52d2d',
                  border: '1px solid #f5baba',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                <XCircle size={16} />
                Record Loss
              </button>

              <button
                onClick={() => resetGameStats(deck.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  background: '#eef3fb',
                  color: '#205493',
                  border: '1px solid #bfd7f2',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                <RotateCcw size={16} />
                Reset Stats
              </button>
            </div>

            <ol style={{ columns: 2, paddingLeft: 20, marginTop: '1rem' }}>
              {getCardsForDeck(deck.id).map((card) => (
                <li
                  key={card.id}
                  onClick={() =>
                    card.cards?.image && setSelectedCardImage(card.cards.image)
                  }
                  style={{
                    cursor: card.cards?.image ? 'pointer' : 'default',
                    textDecoration: card.cards?.image ? 'underline' : 'none',
                    marginBottom: '0.5rem',
                  }}
                >
                  {card.cards?.name ?? '(Unknown Card)'}
                </li>
              ))}
            </ol>
          </div>
        )
      })}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div
          style={{
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
          }}
        >
          <p style={{ marginBottom: 12, fontWeight: 'bold' }}>
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
                cursor: 'pointer',
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
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Card Image Modal */}
      {selectedCardImage && (
        <div
          onClick={() => setSelectedCardImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              padding: '1rem',
              borderRadius: 8,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <img
              src={selectedCardImage}
              alt="Card"
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 8,
                display: 'block',
                margin: '0 auto',
              }}
            />
            <button
              onClick={() => setSelectedCardImage(null)}
              style={{
                display: 'block',
                margin: '1rem auto 0',
                padding: '6px 12px',
                borderRadius: 4,
                background: '#333',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
