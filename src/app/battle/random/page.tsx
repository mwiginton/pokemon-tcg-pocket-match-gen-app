'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import styles from '@/styles/layout.module.css'
import buttonStyles from '@/styles/button.module.css'
import { Dice3, Loader2 } from 'lucide-react'

type Deck = {
  id: string
  deck_name: string
}

type CardEntry = {
  id: string
  name: string
  pack: string
}

type MatchResult = {
  player_deck: Deck
  solo_battle: {
    difficulty: string
    expansion: string
    deck: string
  }
}

type BattlesGrouped = Record<string, Record<string, string[]>>

export default function RandomBattlePage() {
  const [match, setMatch] = useState<MatchResult | null>(null)
  const [error, setError] = useState('')
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [deckStats, setDeckStats] = useState<Record<string, { total_games: number; wins: number }>>({})
  const [deckCards, setDeckCards] = useState<CardEntry[]>([])
  const [showDeckModal, setShowDeckModal] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [soloBattles, setSoloBattles] = useState<BattlesGrouped>({})

  // 🔹 Load solo battles from Supabase on mount
  useEffect(() => {
    const loadBattles = async () => {
      const { data, error } = await supabase
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
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty]
    )
  }

  const refreshDeckStats = async (deckId: string) => {
    const { data, error } = await supabase
      .from('deck_games')
      .select('deck_id, result')
      .eq('deck_id', deckId)

    if (error) {
      setError('Error fetching stats: ' + error.message)
      return
    }

    const stats = { total_games: 0, wins: 0 }
    data.forEach(({ result }) => {
      stats.total_games++
      if (result === 'win') stats.wins++
    })

    setDeckStats((prev) => ({
      ...prev,
      [deckId]: stats,
    }))
  }

  const loadDeckCards = async (deckId: string) => {
    const { data, error } = await supabase
      .from('deck_cards')
      .select('card_id, card_index, cards(name, pack)')
      .eq('deck_id', deckId)
      .order('card_index', { ascending: true })

    if (error || !data) {
      setError('Failed to load deck cards.')
      return
    }

    const formatted: CardEntry[] = Array(20).fill({ id: '', name: '', pack: '' })
    data.forEach((dc: any) => {
      if (dc.card_index < 20) {
        formatted[dc.card_index] = {
          id: dc.card_id,
          name: dc.cards?.name || '',
          pack: dc.cards?.pack || '',
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
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (!user) {
        setError('You must be logged in.')
        return
      }

      const { error } = await supabase.from('deck_games').insert({
        deck_id: match.player_deck.id,
        result,
        user_id: user.id,
      })

      if (error) {
        setError('Error recording game: ' + error.message)
      } else {
        await refreshDeckStats(match.player_deck.id)
      }
    } finally {
      setIsRecording(false)
    }
  }

  const generateMatch = async () => {
    setError('')
    setMatch(null)

    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user

    if (!user) {
      setError('You must be logged in.')
      return
    }

    const { data: decks, error } = await supabase
      .from('decks')
      .select('id, deck_name')
      .eq('user_id', user.id)

    if (error || !decks || decks.length === 0) {
      setError('No decks found for this user.')
      return
    }

    const allowedDifficulties =
      selectedDifficulties.length > 0
        ? selectedDifficulties
        : Object.keys(soloBattles)

    if (allowedDifficulties.length === 0) {
      setError('No solo battles available.')
      return
    }

    const difficulty =
      allowedDifficulties[Math.floor(Math.random() * allowedDifficulties.length)]
    const expansions = Object.keys(soloBattles[difficulty] || {})
    if (expansions.length === 0) {
      setError('No expansions available for this difficulty.')
      return
    }

    const expansion = expansions[Math.floor(Math.random() * expansions.length)]
    const options = soloBattles[difficulty][expansion]
    const enemy_deck = options[Math.floor(Math.random() * options.length)]
    const player_deck = decks[Math.floor(Math.random() * decks.length)]

    setMatch({
      player_deck,
      solo_battle: {
        difficulty,
        expansion,
        deck: enemy_deck,
      },
    })

    await refreshDeckStats(player_deck.id)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <Dice3 size={18} style={{ marginRight: 8 }} />
          Generate a Random Match
        </h1>

        {/* Difficulty selectors */}
        <div style={{ marginBottom: '1rem' }}>
          <strong>
            Select Difficulties:
            <span
              style={{
                fontWeight: 'normal',
                color: '#666',
                fontSize: '0.85rem',
                marginLeft: 8,
              }}
            >
              (optional)
            </span>
          </strong>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 8 }}>
            {Object.keys(soloBattles).map((difficulty) => {
              const selected = selectedDifficulties.includes(difficulty)
              return (
                <button
                  key={difficulty}
                  onClick={() => toggleDifficulty(difficulty)}
                  className={`${buttonStyles.buttonCompact} ${
                    selected ? buttonStyles.primary : ''
                  }`}
                  type="button"
                >
                  {difficulty}
                </button>
              )
            })}
          </div>
        </div>

        {/* Generate match */}
        <button
          onClick={generateMatch}
          className={`${buttonStyles.buttonCompact} ${buttonStyles.primary}`}
        >
          Generate Match
        </button>

        {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}

        {/* Match results */}
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
              <h2
                style={{
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '4px',
                }}
              >
                Your Deck
              </h2>
              <p
                style={{
                  fontWeight: '500',
                  fontSize: '1rem',
                  color: '#0070f3',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={() => loadDeckCards(match.player_deck.id)}
              >
                {match.player_deck.deck_name}
              </p>
            </div>

            <div>
              <h2
                style={{
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '4px',
                }}
              >
                Solo Battle
              </h2>
              <div style={{ lineHeight: '1.8', fontSize: '0.95rem' }}>
                <p>
                  <strong>Difficulty:</strong> {match.solo_battle.difficulty}
                </p>
                <p>
                  <strong>Expansion:</strong> {match.solo_battle.expansion}
                </p>
                <p>
                  <strong>Opponent:</strong> {match.solo_battle.deck}
                </p>
              </div>
            </div>

            {/* Record Results */}
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                Track Results
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => recordGame('win')}
                  disabled={isRecording}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    background: '#e6f9ec',
                    color: '#1a7f37',
                    border: '1px solid #b2e0c0',
                    borderRadius: 6,
                    cursor: isRecording ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    opacity: isRecording ? 0.7 : 1,
                  }}
                >
                  {isRecording ? <Loader2 className="spin" size={16} /> : null}
                  {isRecording ? 'Recording...' : 'Record Win'}
                </button>

                <button
                  onClick={() => recordGame('loss')}
                  disabled={isRecording}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    background: '#ffecec',
                    color: '#c52d2d',
                    border: '1px solid #f5baba',
                    borderRadius: 6,
                    cursor: isRecording ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    opacity: isRecording ? 0.7 : 1,
                  }}
                >
                  {isRecording ? <Loader2 className="spin" size={16} /> : null}
                  {isRecording ? 'Recording...' : 'Record Loss'}
                </button>
              </div>

              {deckStats[match.player_deck.id] && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#444' }}>
                  Games Played: {deckStats[match.player_deck.id].total_games}, Wins:{' '}
                  {deckStats[match.player_deck.id].wins}, Win Rate:{' '}
                  {deckStats[match.player_deck.id].total_games > 0
                    ? `${Math.round(
                        (deckStats[match.player_deck.id].wins /
                          deckStats[match.player_deck.id].total_games) *
                          100
                      )}%`
                    : '0%'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Deck Modal */}
        {showDeckModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setShowDeckModal(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  marginBottom: '1.2rem',
                  borderBottom: '1px solid #eee',
                  paddingBottom: 8,
                }}
              >
                Deck Contents
              </h2>
              <div style={{ display: 'grid', rowGap: '0.75rem' }}>
                {deckCards.map((card, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.6rem 0.8rem',
                      backgroundColor: '#f7f9fb',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      fontSize: '0.95rem',
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>
                      {String(idx + 1).padStart(2, '0')}. {card.name}
                    </div>
                    <div
                      style={{
                        color: '#666',
                        fontSize: '0.85rem',
                        marginTop: 2,
                      }}
                    >
                      {card.pack}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowDeckModal(false)}
                style={{
                  marginTop: '1.8rem',
                  padding: '10px 18px',
                  backgroundColor: '#0070f3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'block',
                  marginLeft: 'auto',
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
