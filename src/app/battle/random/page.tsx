'use client'

import { useEffect, useState } from 'react'
import { client } from '@/lib/neonClient'
import { getAuthenticatedUser } from '@/lib/authUser'
import styles from '@/styles/layout.module.css'
import buttonStyles from '@/styles/button.module.css'
import { Dice3, Loader2, Home, Trophy, XCircle } from 'lucide-react'
import Link from 'next/link'

type Deck = { id: string; deck_name: string }
type CardEntry = { id: string; name: string; pack: string }
type DeckCardQueryRow = {
  card_id: string
  card_index: number
  cards:
    | { name?: string | null; pack?: string | null }
    | { name?: string | null; pack?: string | null }[]
    | null
}
type MatchResult = {
  player_deck: Deck
  solo_battle: { difficulty: string; expansion: string; deck: string }
}
type BattlesGrouped = Record<string, Record<string, string[]>>

const recordBtnStyle = (bg: string, color: string, border: string) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 10px',
  background: bg,
  color,
  border: `1px solid ${border}`,
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: '0.9rem',
} as const)

export default function RandomBattlePage() {
  const [match, setMatch] = useState<MatchResult | null>(null)
  const [error, setError] = useState('')
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [deckStats, setDeckStats] = useState<Record<string, { total_games: number; wins: number }>>({})
  const [deckCards, setDeckCards] = useState<CardEntry[]>([])
  const [showDeckModal, setShowDeckModal] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [soloBattles, setSoloBattles] = useState<BattlesGrouped>({})

  const closeDeckModal = () => setShowDeckModal(false)

  // Allow ESC to close modal
  useEffect(() => {
    if (!showDeckModal) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDeckModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showDeckModal])

  useEffect(() => {
    const loadBattles = async () => {
      const { data, error } = await client
        .from('solo_battles')
        .select('difficulty, expansion, deck_name')

      if (error) {
        setError('Failed to load solo battles: ' + error.message)
        return
      }

      const grouped: BattlesGrouped = {}
      data?.forEach((row) => {
        if (!grouped[row.difficulty]) grouped[row.difficulty] = {}
        if (!grouped[row.difficulty][row.expansion]) grouped[row.difficulty][row.expansion] = []
        grouped[row.difficulty][row.expansion].push(row.deck_name)
      })
      setSoloBattles(grouped)
    }
    loadBattles()
  }, [])

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty) ? prev.filter((d) => d !== difficulty) : [...prev, difficulty]
    )
  }

  const refreshDeckStats = async (deckId: string) => {
    const { data, error } = await client
      .from('deck_games')
      .select('deck_id, result')
      .eq('deck_id', deckId)

    if (error) {
      setError('Error fetching stats: ' + error.message)
      return
    }

    const stats = { total_games: 0, wins: 0 }
    data.forEach(({ result }) => {
      stats.total_games++; if (result === 'win') stats.wins++
    })

    setDeckStats((prev) => ({ ...prev, [deckId]: stats }))
  }

  const loadDeckCards = async (deckId: string) => {
    const { data, error } = await client
      .from('deck_cards')
      .select('card_id, card_index, cards(name, pack)')
      .eq('deck_id', deckId)
      .order('card_index', { ascending: true })

    if (error || !data) {
      setError('Failed to load deck cards.')
      return
    }

    const formatted: CardEntry[] = Array(20).fill({ id: '', name: '', pack: '' })
    const deckCards = data as DeckCardQueryRow[]

    deckCards.forEach((dc) => {
      const card = Array.isArray(dc.cards) ? dc.cards[0] : dc.cards

      if (dc.card_index < 20) {
        formatted[dc.card_index] = {
          id: dc.card_id,
          name: card?.name || '',
          pack: card?.pack || '',
        }
      }
    })

    setDeckCards(formatted)
    setShowDeckModal(true)
  }

  const recordGame = async (result: 'win' | 'loss') => {
    if (!match) return
    setIsRecording(true)
    try {
      const { user } = await getAuthenticatedUser()
      if (!user) { setError('You must be logged in.'); return }

      const { error } = await client.from('deck_games').insert({
        deck_id: match.player_deck.id, result, user_id: user.id,
      })

      if (error) setError('Error recording game: ' + error.message)
      else await refreshDeckStats(match.player_deck.id)
    } finally {
      setIsRecording(false)
    }
  }

  const generateMatch = async () => {
    setError(''); setMatch(null)
    const { user } = await getAuthenticatedUser()
    if (!user) { setError('You must be logged in.'); return }

    const { data: decks, error } = await client
      .from('decks').select('id, deck_name').eq('user_id', user.id)

    if (error || !decks || decks.length === 0) { setError('No decks found for this user.'); return }

    const allowedDifficulties = selectedDifficulties.length > 0 ? selectedDifficulties : Object.keys(soloBattles)
    if (allowedDifficulties.length === 0) { setError('No solo battles available.'); return }

    const difficulty = allowedDifficulties[Math.floor(Math.random() * allowedDifficulties.length)]
    const expansions = Object.keys(soloBattles[difficulty] || {})
    if (expansions.length === 0) { setError('No expansions available for this difficulty.'); return }

    const expansion = expansions[Math.floor(Math.random() * expansions.length)]
    const options = soloBattles[difficulty][expansion]
    const enemy_deck = options[Math.floor(Math.random() * options.length)]
    const player_deck = decks[Math.floor(Math.random() * decks.length)]

    setMatch({ player_deck, solo_battle: { difficulty, expansion, deck: enemy_deck } })
    await refreshDeckStats(player_deck.id)
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
        {/* Header */}
        <div className="headerWithDice">
          <Dice3 size={22} className="diceIcon" />
          <h1 className="headerText">Generate a Random Match</h1>
        </div>

        {/* Difficulty selection */}
        <div style={{ marginBottom: '1rem' }}>
          <strong>
            Select Difficulties:
            <span style={{ fontWeight: 'normal', color: '#666', fontSize: '0.85rem', marginLeft: 8 }}>
              (optional)
            </span>
          </strong>

          <div className="difficultyRow">
            {Object.keys(soloBattles).map((difficulty) => {
              const selected = selectedDifficulties.includes(difficulty)
              return (
                <button
                  key={difficulty}
                  onClick={() => toggleDifficulty(difficulty)}
                  className={`${buttonStyles.buttonCompact} ${selected ? buttonStyles.primary : ''}`}
                  type="button"
                >
                  {difficulty}
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={generateMatch}
          className={`${buttonStyles.buttonCompact} ${buttonStyles.primary}`}
          type="button"
        >
          Generate Match
        </button>

        {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}

        {match && (
          <div
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
                Your Deck
              </h2>
              <p
                style={{ fontWeight: 500, fontSize: '1rem', color: '#0070f3', textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => loadDeckCards(match.player_deck.id)}
              >
                {match.player_deck.deck_name}
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
                Solo Battle
              </h2>
              <div style={{ lineHeight: 1.8, fontSize: '0.95rem' }}>
                <p><strong>Difficulty:</strong> {match.solo_battle.difficulty}</p>
                <p><strong>Expansion:</strong> {match.solo_battle.expansion}</p>
                <p><strong>Opponent:</strong> {match.solo_battle.deck}</p>
              </div>
            </div>

            {/* Record buttons */}
            <div className={styles.cardActions}>
              <button
                onClick={() => recordGame('win')}
                disabled={isRecording}
                type="button"
                style={recordBtnStyle('#e6f9ec', '#1a7f37', '#b2e0c0')}
              >
                {isRecording ? <Loader2 className="spin" size={16} /> : <Trophy size={16} />}
                Record Win
              </button>

              <button
                onClick={() => recordGame('loss')}
                disabled={isRecording}
                type="button"
                style={recordBtnStyle('#ffecec', '#c52d2d', '#f5baba')}
              >
                {isRecording ? <Loader2 className="spin" size={16} /> : <XCircle size={16} />}
                Record Loss
              </button>
            </div>

            {deckStats[match.player_deck.id] && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#444' }}>
                Games Played: {deckStats[match.player_deck.id].total_games}, Wins {deckStats[match.player_deck.id].wins}, Win Rate{' '}
                {deckStats[match.player_deck.id].total_games > 0
                  ? `${Math.round((deckStats[match.player_deck.id].wins / deckStats[match.player_deck.id].total_games) * 100)}%`
                  : '0%'}
              </p>
            )}
          </div>
        )}

        {/* ✅ Deck Modal (Restored) */}
        {showDeckModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={closeDeckModal}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Deck Cards</h2>
              {deckCards.map((card, i) => (
                <div key={i} style={{ marginBottom: '0.5rem' }}>
                  {card.name ? (
                    <div className={styles.suggestionRow}>
                      <span className={styles.cardName}>{card.name}</span>
                      {card.pack && <span className={styles.cardPack}>({card.pack})</span>}
                    </div>
                  ) : (
                    <span style={{ color: '#aaa' }}>Empty Slot</span>
                  )}
                </div>
              ))}
              <button
                onClick={closeDeckModal}
                className={`${buttonStyles.buttonCompact} ${buttonStyles.secondary}`}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Scoped styles */}
        <style jsx>{`
          .headerWithDice {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
            margin-bottom: 1.25rem;
            text-align: center;
            flex-wrap: wrap;
          }
          .diceIcon { color: #205493; }
          .headerText { font-size: 1.6rem; font-weight: 600; color: #1f2937; }

          .difficultyRow {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.4rem;
            margin-top: 8px;
            flex-wrap: nowrap;
          }
          .difficultyRow button {
            flex: 1;
            min-width: 0;
            font-size: 0.8rem;
            padding: 0.4rem 0.3rem;
            white-space: nowrap;
          }
          @media (max-width: 480px) {
            .headerText { font-size: 1.25rem; }
            .difficultyRow { gap: 0.3rem; }
            .difficultyRow button { flex: 1; font-size: 0.7rem; padding: 0.35rem 0.25rem; }
          }
        `}</style>
      </div>
    </div>
  )
}
