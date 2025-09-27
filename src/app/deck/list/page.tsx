'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import styles from '@/styles/layout.module.css'
import buttonStyles from '@/styles/button.module.css'
import {
  Pencil,
  Trash2,
  BookMarked,
  Trophy,
  XCircle,
  RotateCcw,
  Home,
  PlusCircle
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
  const [deckStats, setDeckStats] = useState<Record<string, DeckStats>>({})
  const [expandedDecks, setExpandedDecks] = useState<Record<string, DeckCard[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmResetId, setConfirmResetId] = useState<string | null>(null)
  const [selectedCardImage, setSelectedCardImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchDecksAndStats = async () => {
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
      await refreshDeckStats(decksData.map(d => d.id))
      setLoading(false)
    }

    fetchDecksAndStats()
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
      deckIds.forEach(id => (statsMap[id] = { total_games: 0, wins: 0 }))
      gamesData?.forEach(({ deck_id, result }) => {
        statsMap[deck_id].total_games++
        if (result === 'win') statsMap[deck_id].wins++
      })
      setDeckStats(prev => ({ ...prev, ...statsMap }))
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
    const { error } = await supabase.from('deck_games').delete().eq('deck_id', deckId)
    if (error) {
      alert('Failed to reset stats: ' + error.message)
    } else {
      await refreshDeckStats([deckId])
    }
    setConfirmResetId(null)
  }

  const toggleDeckCards = async (deckId: string) => {
    if (expandedDecks[deckId]) {
      const updated = { ...expandedDecks }
      delete updated[deckId]
      setExpandedDecks(updated)
      return
    }

    const { data, error } = await supabase
      .from('deck_cards')
      .select('id, deck_id, card_id, card_index, cards(name, image)')
      .eq('deck_id', deckId)
      .order('card_index', { ascending: true })

    if (error) {
      alert('Failed to load cards: ' + error.message)
      return
    }

    setExpandedDecks(prev => ({ ...prev, [deckId]: data || [] }))
  }

  const handleDeleteDeck = async (deckId: string) => {
    const { error: gamesError } = await supabase.from('deck_games').delete().eq('deck_id', deckId)
    if (gamesError) {
      alert('Failed to delete related games: ' + gamesError.message)
      return
    }

    const { error: deckError } = await supabase.from('decks').delete().eq('id', deckId)
    if (deckError) {
      alert('Failed to delete deck: ' + deckError.message)
      return
    }

    setDecks(prev => prev.filter(d => d.id !== deckId))
    setExpandedDecks(prev => {
      const copy = { ...prev }
      delete copy[deckId]
      return copy
    })
    setConfirmDeleteId(null)
  }

  return (
    <div className={styles.page}>
      <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
        <Link
          href="/dashboard"
          className={styles.iconButton}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 6,
            background: '#eef3fb',
            border: '1px solid #a5c5f5',
            color: '#205493',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          <Home size={16} />
          Back to Dashboard
        </Link>
      </div>

      <div className={styles.card}>
        <div className={styles.headerWithIcon}>
          <BookMarked size={28} strokeWidth={2} />
          <h1 className={styles.headerText}>Your Saved Decks</h1>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {decks.length === 0 && !loading && (
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <p style={{ fontSize: '1rem', color: '#333', marginBottom: '1rem' }}>
              No decks found.
            </p>
            <Link href="/deck/new">
              <button
                className={`${buttonStyles.button} ${buttonStyles.primary}`}
                style={{ marginTop: '0.5rem' }}
              >
                <PlusCircle size={18} />
                <span>Create New Deck</span>
              </button>
            </Link>
          </div>
        )}
      </div>

      {decks.map((deck) => {
        const stats = deckStats[deck.id]
        const winRate =
          stats && stats.total_games > 0
            ? Math.round((stats.wins / stats.total_games) * 100)
            : 0

        return (
          <div key={deck.id} className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>{deck.deck_name}</h2>
              <div className={styles.buttonGroup}>
                <Link href={`/deck/${deck.id}/edit`} className={`${styles.iconButton} ${styles.iconButtonEdit}`}>
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
              Created: {new Date(deck.created_at).toLocaleDateString()}
            </p>

            {stats && (
              <p style={{ fontSize: '0.85rem', color: '#444' }}>
                Games Played: {stats.total_games}, Wins: {stats.wins}, Win Rate: {winRate}%
              </p>
            )}

            <div className={styles.cardActions}>
              <button onClick={() => recordGame(deck.id, 'win')} style={recordBtnStyle('#e6f9ec', '#1a7f37', '#b2e0c0')}>
                <Trophy size={16} /> Record Win
              </button>
              <button onClick={() => recordGame(deck.id, 'loss')} style={recordBtnStyle('#ffecec', '#c52d2d', '#f5baba')}>
                <XCircle size={16} /> Record Loss
              </button>
              <button onClick={() => setConfirmResetId(deck.id)} style={recordBtnStyle('#eef3fb', '#205493', '#bfd7f2')}>
                <RotateCcw size={16} /> Reset Stats
              </button>
            </div>

            <button
              onClick={() => toggleDeckCards(deck.id)}
              style={{
                marginTop: '1rem',
                padding: '6px 12px',
                background: '#eaf2ff',
                color: '#205493',
                border: '1px solid #a5c5f5',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            >
              {expandedDecks[deck.id] ? 'Hide Cards' : 'View Cards'}
            </button>

            {expandedDecks[deck.id] && (
              <ol style={{ columns: 2, paddingLeft: 20, marginTop: '1rem' }}>
                {expandedDecks[deck.id].map((card) => (
                  <li
                    key={card.id}
                    onClick={() => card.cards?.image && setSelectedCardImage(card.cards.image)}
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
            )}
          </div>
        )
      })}

      {/* Modals (same as before) */}
      {confirmDeleteId && (
        <div style={modalStyle}>
          <p style={{ marginBottom: 12, fontWeight: 'bold', fontSize: '1rem', color: '#222' }}>
            Are you sure you want to delete this deck?
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              onClick={() => handleDeleteDeck(confirmDeleteId)}
              style={{ ...confirmBtnStyle, background: 'red', color: 'white' }}
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirmDeleteId(null)}
              style={{ ...confirmBtnStyle, background: '#ccc', color: '#000' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {confirmResetId && (
        <div style={modalStyle}>
          <p style={{ marginBottom: 12, fontWeight: 'bold', fontSize: '1rem', color: '#222' }}>
            Reset all recorded games for this deck?
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              onClick={() => resetGameStats(confirmResetId)}
              style={{ ...confirmBtnStyle, background: '#205493', color: 'white' }}
            >
              Yes, reset
            </button>
            <button
              onClick={() => setConfirmResetId(null)}
              style={{ ...confirmBtnStyle, background: '#ccc', color: '#000' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <img src={selectedCardImage} alt="Card" style={{ maxWidth: '100%' }} />
            <button
              onClick={() => setSelectedCardImage(null)}
              style={{
                display: 'block',
                margin: '1rem auto 0',
                padding: '6px 12px',
                background: '#333',
                color: '#fff',
                borderRadius: 4,
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

const recordBtnStyle = (bg: string, color: string, border: string) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 10px',
  background: bg,
  color: color,
  border: `1px solid ${border}`,
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: '0.9rem',
})

const modalStyle = {
  position: 'fixed' as const,
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
}

const confirmBtnStyle = {
  border: 'none',
  padding: '6px 12px',
  borderRadius: 4,
  cursor: 'pointer',
}
