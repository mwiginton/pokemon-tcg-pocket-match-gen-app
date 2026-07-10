'use client'

import { useEffect, useState } from 'react'
import { client } from '@/lib/neonClient'
import { getAuthenticatedUser } from '@/lib/authUser'
import styles from '@/styles/layout.module.css'
import buttonStyles from '@/styles/button.module.css'
import GameLogDialog, { GameLogDetails, GameResult } from '@/components/GameLogDialog'
import { Dice3, Home, Loader2, Trophy, XCircle } from 'lucide-react'
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

export default function RandomBattlePage() {
  const [match, setMatch] = useState<MatchResult | null>(null)
  const [error, setError] = useState('')
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [deckStats, setDeckStats] = useState<Record<string, { total_games: number; wins: number }>>({})
  const [deckCards, setDeckCards] = useState<CardEntry[]>([])
  const [showDeckModal, setShowDeckModal] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [soloBattles, setSoloBattles] = useState<BattlesGrouped>({})
  const [gameLogResult, setGameLogResult] = useState<GameResult | null>(null)

  const closeDeckModal = () => setShowDeckModal(false)

  useEffect(() => {
    if (!showDeckModal) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDeckModal()
    }
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
      prev.includes(difficulty)
        ? prev.filter((selected) => selected !== difficulty)
        : [...prev, difficulty],
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
      stats.total_games++
      if (result === 'win') stats.wins++
    })

    setDeckStats((prev) => ({ ...prev, [deckId]: stats }))
  }

  const loadDeckCards = async (deckId: string, openModal = true) => {
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

    deckCards.forEach((deckCard) => {
      const card = Array.isArray(deckCard.cards) ? deckCard.cards[0] : deckCard.cards

      if (deckCard.card_index < 20) {
        formatted[deckCard.card_index] = {
          id: deckCard.card_id,
          name: card?.name || '',
          pack: card?.pack || '',
        }
      }
    })

    setDeckCards(formatted)
    if (openModal) setShowDeckModal(true)
    return formatted
  }

  const openGameLogger = async (result: GameResult) => {
    if (!match) return
    setGameLogResult(result)
    await loadDeckCards(match.player_deck.id, false)
  }

  const recordGame = async (details: GameLogDetails) => {
    if (!match) return
    setIsRecording(true)
    try {
      const { user } = await getAuthenticatedUser()
      if (!user) {
        setError('You must be logged in.')
        return
      }

      const { error } = await client.from('deck_games').insert({
        deck_id: match.player_deck.id,
        result: details.result,
        user_id: user.id,
        opponent_archetype: details.opponent_archetype,
        player_order: details.player_order,
        turns_played: details.turns_played,
        close_game: details.close_game,
        setup_status: details.setup_status,
        mvp_card: details.mvp_card,
        notes: details.notes,
      })

      if (error) {
        setError('Error recording game: ' + error.message)
      } else {
        await refreshDeckStats(match.player_deck.id)
        setGameLogResult(null)
      }
    } finally {
      setIsRecording(false)
    }
  }

  const generateMatch = async () => {
    setError('')
    setMatch(null)
    const { user } = await getAuthenticatedUser()
    if (!user) {
      setError('You must be logged in.')
      return
    }

    const { data: decks, error } = await client
      .from('decks')
      .select('id, deck_name')
      .eq('user_id', user.id)

    if (error || !decks || decks.length === 0) {
      setError('No decks found for this user.')
      return
    }

    const allowedDifficulties = selectedDifficulties.length > 0
      ? selectedDifficulties
      : Object.keys(soloBattles)
    if (allowedDifficulties.length === 0) {
      setError('No solo battles available.')
      return
    }

    const difficulty = allowedDifficulties[Math.floor(Math.random() * allowedDifficulties.length)]
    const expansions = Object.keys(soloBattles[difficulty] || {})
    if (expansions.length === 0) {
      setError('No expansions available for this difficulty.')
      return
    }

    const expansion = expansions[Math.floor(Math.random() * expansions.length)]
    const options = soloBattles[difficulty][expansion]
    const enemyDeck = options[Math.floor(Math.random() * options.length)]
    const playerDeck = decks[Math.floor(Math.random() * decks.length)]

    setMatch({ player_deck: playerDeck, solo_battle: { difficulty, expansion, deck: enemyDeck } })
    await refreshDeckStats(playerDeck.id)
  }

  const currentStats = match ? deckStats[match.player_deck.id] : null
  const winRate = currentStats && currentStats.total_games > 0
    ? Math.round((currentStats.wins / currentStats.total_games) * 100)
    : 0

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <Link href="/dashboard" className={styles.backLink}>
              <Home size={16} />
              Back to Dashboard
            </Link>
            <p className={styles.eyebrow}>Random battle</p>
            <h1 className={styles.pageTitle}>Generate a random match</h1>
            <p className={styles.pageIntro}>
              Pick optional difficulties, roll a matchup, then log the result.
            </p>
          </div>
        </header>

        <section className={styles.panel}>
          <div className={styles.headerWithIcon}>
            <Dice3 size={24} />
            <h2 className={styles.headerText}>Match settings</h2>
          </div>

          <div>
            <p className={styles.label}>Select difficulties</p>
            <p className={styles.helperText}>Leave all unchecked to include every loaded solo battle.</p>
            <div className={styles.chipRow}>
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
            className={`${buttonStyles.button} ${buttonStyles.primary}`}
            type="button"
          >
            <Dice3 size={18} />
            Generate Match
          </button>

          {error && <p className={styles.errorText}>{error}</p>}

          {match && (
            <div className={styles.highlightPanel}>
              <p className={styles.panelKicker}>Generated matchup</p>
              <div className={styles.matchGrid}>
                <div className={styles.matchSection}>
                  <h2>Your Deck</h2>
                  <button
                    className={styles.inlineLink}
                    onClick={() => loadDeckCards(match.player_deck.id)}
                    type="button"
                  >
                    {match.player_deck.deck_name}
                  </button>
                </div>

                <div className={styles.matchSection}>
                  <h2>Solo Battle</h2>
                  <p className={styles.metaText}><strong>Difficulty:</strong> {match.solo_battle.difficulty}</p>
                  <p className={styles.metaText}><strong>Expansion:</strong> {match.solo_battle.expansion}</p>
                  <p className={styles.metaText}><strong>Opponent:</strong> {match.solo_battle.deck}</p>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button
                  onClick={() => openGameLogger('win')}
                  disabled={isRecording}
                  type="button"
                  className={`${styles.iconButton} ${styles.win}`}
                >
                  {isRecording ? <Loader2 className={styles.spin} size={16} /> : <Trophy size={16} />}
                  Record Win
                </button>

                <button
                  onClick={() => openGameLogger('loss')}
                  disabled={isRecording}
                  type="button"
                  className={`${styles.iconButton} ${styles.loss}`}
                >
                  {isRecording ? <Loader2 className={styles.spin} size={16} /> : <XCircle size={16} />}
                  Record Loss
                </button>
              </div>

              {currentStats && (
                <div className={styles.statStrip}>
                  <div className={styles.statMini}>
                    <span className={styles.statMiniValue}>{currentStats.total_games}</span>
                    <span className={styles.statMiniLabel}>Games played</span>
                  </div>
                  <div className={styles.statMini}>
                    <span className={styles.statMiniValue}>{currentStats.wins}</span>
                    <span className={styles.statMiniLabel}>Wins</span>
                  </div>
                  <div className={styles.statMini}>
                    <span className={styles.statMiniValue}>{winRate}%</span>
                    <span className={styles.statMiniLabel}>Win rate</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {showDeckModal && (
          <div className={styles.modalOverlay} onClick={closeDeckModal}>
            <div className={styles.modalContent} onClick={(event) => event.stopPropagation()}>
              <h2 className={styles.headerText}>Deck cards</h2>
              <ol className={styles.cardList}>
                {deckCards.map((card, index) => (
                  <li key={`${card.id}-${index}`}>
                    {card.name ? (
                      <span className={styles.suggestionRow}>
                        <span className={styles.cardName}>{card.name}</span>
                        {card.pack && <span className={styles.cardPack}>({card.pack})</span>}
                      </span>
                    ) : (
                      <span className={styles.metaText}>Empty Slot</span>
                    )}
                  </li>
                ))}
              </ol>
              <button
                onClick={closeDeckModal}
                className={buttonStyles.button}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {match && gameLogResult && (
          <GameLogDialog
            deckName={match.player_deck.deck_name}
            result={gameLogResult}
            defaultOpponent={match.solo_battle.deck}
            cardOptions={deckCards.map((card) => card.name).filter(Boolean)}
            isSaving={isRecording}
            onClose={() => setGameLogResult(null)}
            onSubmit={recordGame}
          />
        )}
      </div>
    </div>
  )
}
