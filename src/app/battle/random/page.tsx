'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import styles from '@/styles/layout.module.css'
import buttonStyles from '@/styles/button.module.css'
import { Dice3, Loader2, Home } from 'lucide-react'
import Link from 'next/link'

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

  const closeDeckModal = () => setShowDeckModal(false)

  useEffect(() => {
    if (!showDeckModal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDeckModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showDeckModal])

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
        {/* 🎲 Simple Dice icon + text header */}
        <div className="headerWithDice">
          <Dice3 size={22} className="diceIcon" />
          <h1 className="headerText">Generate a Random Match</h1>
        </div>

        {/* Difficulty selection */}
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
          <div className="matchCard">
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 className="sectionTitle">Your Deck</h2>
              <p
                className="deckNameClickable"
                onClick={() => loadDeckCards(match.player_deck.id)}
              >
                {match.player_deck.deck_name}
              </p>
            </div>

            <div>
              <h2 className="sectionTitle">Solo Battle</h2>
              <div className="battleInfo">
                <p><strong>Difficulty:</strong> {match.solo_battle.difficulty}</p>
                <p><strong>Expansion:</strong> {match.solo_battle.expansion}</p>
                <p><strong>Opponent:</strong> {match.solo_battle.deck}</p>
              </div>
            </div>

            <div className="cardActions">
              <button
                onClick={() => recordGame('win')}
                disabled={isRecording}
                type="button"
                className="winBtn"
              >
                {isRecording ? <Loader2 className="spin" size={16} /> : 'Record Win'}
              </button>
              <button
                onClick={() => recordGame('loss')}
                disabled={isRecording}
                type="button"
                className="lossBtn"
              >
                {isRecording ? <Loader2 className="spin" size={16} /> : 'Record Loss'}
              </button>
            </div>

            {deckStats[match.player_deck.id] && (
              <p className="statsText">
                Games Played: {deckStats[match.player_deck.id].total_games}, Wins {deckStats[match.player_deck.id].wins}, Win Rate{' '}
                {deckStats[match.player_deck.id].total_games > 0
                  ? `${Math.round((deckStats[match.player_deck.id].wins / deckStats[match.player_deck.id].total_games) * 100)}%`
                  : '0%'}
              </p>
            )}
          </div>
        )}

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

          .diceIcon {
            color: #205493;
          }

          .headerText {
            font-size: 1.6rem;
            font-weight: 600;
            color: #1f2937;
          }

          @media (max-width: 480px) {
            .headerText {
              font-size: 1.25rem;
            }
          }

          .matchCard {
            margin-top: 2rem;
            padding: 1.5rem;
            border-radius: 8px;
            background-color: #f9f9f9;
            box-shadow: 0 2px 4px rgba(0,0,0,0.08);
          }

          .sectionTitle {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            border-bottom: 1px solid #ddd;
            padding-bottom: 4px;
          }

          .deckNameClickable {
            font-weight: 500;
            font-size: 1rem;
            color: #0070f3;
            text-decoration: underline;
            cursor: pointer;
          }

          .battleInfo {
            line-height: 1.8;
            font-size: 0.95rem;
          }

          .statsText {
            margin-top: 0.5rem;
            font-size: 0.9rem;
            color: #444;
          }
        `}</style>
      </div>
    </div>
  )
}
