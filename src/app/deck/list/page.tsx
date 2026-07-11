'use client'

import { useEffect, useState } from 'react'
import { client } from '@/lib/neonClient'
import { getAuthenticatedUser } from '@/lib/authUser'
import Link from 'next/link'
import styles from '@/styles/layout.module.css'
import buttonStyles from '@/styles/button.module.css'
import GameLogDialog, {
  GameLogDetails,
  GameResult,
  MatchType,
  PlayerOrder,
} from '@/components/GameLogDialog'
import {
  BookMarked,
  Home,
  Pencil,
  PlusCircle,
  RotateCcw,
  Trash2,
  Trophy,
  XCircle,
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

type DeckCardQueryRow = Omit<DeckCard, 'cards'> & {
  cards: DeckCard['cards'] | DeckCard['cards'][]
}

type DeckStats = {
  total_games: number
  wins: number
  solo_games: number
  solo_wins: number
  pvp_games: number
  pvp_wins: number
  first_games: number
  first_wins: number
  second_games: number
  second_wins: number
  top_opponent: string | null
}

type DeckGameRow = {
  deck_id: string
  result: GameResult
  match_type: MatchType | null
  opponent_archetype: string | null
  player_order: PlayerOrder | null
}

const maxDecks = 10

const createEmptyStats = (): DeckStats => ({
  total_games: 0,
  wins: 0,
  solo_games: 0,
  solo_wins: 0,
  pvp_games: 0,
  pvp_wins: 0,
  first_games: 0,
  first_wins: 0,
  second_games: 0,
  second_wins: 0,
  top_opponent: null,
})

const getTopEntry = (counts: Record<string, number>) =>
  Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

const getWinRate = (wins: number, totalGames: number) =>
  totalGames > 0 ? `${Math.round((wins / totalGames) * 100)}%` : 'No data'

export default function DeckListPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [deckStats, setDeckStats] = useState<Record<string, DeckStats>>({})
  const [expandedDecks, setExpandedDecks] = useState<Record<string, DeckCard[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmResetId, setConfirmResetId] = useState<string | null>(null)
  const [selectedCardImage, setSelectedCardImage] = useState<string | null>(null)
  const [gameLogTarget, setGameLogTarget] = useState<{
    deckId: string
    deckName: string
    result: GameResult
  } | null>(null)
  const [gameLogCardOptions, setGameLogCardOptions] = useState<string[]>([])
  const [isRecordingGame, setIsRecordingGame] = useState(false)

  useEffect(() => {
    const fetchDecksAndStats = async () => {
      setLoading(true)
      setError('')

      const { user, error: authError } = await getAuthenticatedUser()
      if (!user) {
        setError(authError || 'You must be signed in.')
        setLoading(false)
        return
      }

      const { data: decksData, error: decksError } = await client
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
      await refreshDeckStats(decksData.map((deck) => deck.id))
      setLoading(false)
    }

    fetchDecksAndStats()
  }, [])

  const refreshDeckStats = async (deckIds: string[]) => {
    if (deckIds.length === 0) {
      setDeckStats({})
      return
    }

    const { data: gamesData, error: gamesError } = await client
      .from('deck_games')
      .select('deck_id, result, match_type, opponent_archetype, player_order')
      .in('deck_id', deckIds)

    if (gamesError) {
      setError(gamesError.message)
    } else {
      const statsMap: Record<string, DeckStats> = {}
      const opponentCounts: Record<string, Record<string, number>> = {}

      deckIds.forEach((id) => {
        statsMap[id] = createEmptyStats()
        opponentCounts[id] = {}
      })

      ;((gamesData ?? []) as DeckGameRow[]).forEach((game) => {
        const stats = statsMap[game.deck_id]
        if (!stats) return

        stats.total_games++
        if (game.result === 'win') stats.wins++
        const matchType = game.match_type ?? 'pvp'
        if (matchType === 'solo') {
          stats.solo_games++
          if (game.result === 'win') stats.solo_wins++
        } else {
          stats.pvp_games++
          if (game.result === 'win') stats.pvp_wins++
        }

        if (game.player_order === 'first') {
          stats.first_games++
          if (game.result === 'win') stats.first_wins++
        }

        if (game.player_order === 'second') {
          stats.second_games++
          if (game.result === 'win') stats.second_wins++
        }

        if (game.opponent_archetype) {
          opponentCounts[game.deck_id][game.opponent_archetype] =
            (opponentCounts[game.deck_id][game.opponent_archetype] ?? 0) + 1
        }
      })

      deckIds.forEach((id) => {
        statsMap[id].top_opponent = getTopEntry(opponentCounts[id])
      })

      setDeckStats((prev) => ({ ...prev, ...statsMap }))
    }
  }

  const loadDeckCardNames = async (deckId: string) => {
    const { data, error } = await client
      .from('deck_cards')
      .select('cards(name)')
      .eq('deck_id', deckId)
      .order('card_index', { ascending: true })

    if (error) {
      setGameLogCardOptions([])
      return
    }

    const names = ((data || []) as { cards: { name?: string | null } | { name?: string | null }[] | null }[])
      .map((entry) => {
        const card = Array.isArray(entry.cards) ? entry.cards[0] : entry.cards
        return card?.name ?? ''
      })
      .filter(Boolean)

    setGameLogCardOptions(names)
  }

  const openGameLogger = async (deck: Deck, result: GameResult) => {
    setGameLogTarget({ deckId: deck.id, deckName: deck.deck_name, result })
    setGameLogCardOptions([])
    await loadDeckCardNames(deck.id)
  }

  const recordGame = async (details: GameLogDetails) => {
    if (!gameLogTarget) return
    const { user } = await getAuthenticatedUser()
    if (!user) {
      alert('You must be logged in.')
      return
    }

    setIsRecordingGame(true)
    const { error } = await client.from('deck_games').insert({
      deck_id: gameLogTarget.deckId,
      result: details.result,
      user_id: user.id,
      match_type: details.match_type,
      opponent_archetype: details.opponent_archetype,
      player_order: details.player_order,
      turns_played: details.turns_played,
      close_game: details.close_game,
      setup_status: details.setup_status,
      mvp_card: details.mvp_card,
      notes: details.notes,
    })
    setIsRecordingGame(false)

    if (error) {
      alert('Error recording game: ' + error.message)
    } else {
      await refreshDeckStats([gameLogTarget.deckId])
      setGameLogTarget(null)
    }
  }

  const resetGameStats = async (deckId: string) => {
    const { error } = await client.from('deck_games').delete().eq('deck_id', deckId)
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

    const { data, error } = await client
      .from('deck_cards')
      .select('id, deck_id, card_id, card_index, cards(name, image)')
      .eq('deck_id', deckId)
      .order('card_index', { ascending: true })

    if (error) {
      alert('Failed to load cards: ' + error.message)
      return
    }

    const deckCards = ((data || []) as DeckCardQueryRow[]).map((card) => ({
      ...card,
      cards: Array.isArray(card.cards) ? card.cards[0] ?? null : card.cards,
    }))

    setExpandedDecks((prev) => ({ ...prev, [deckId]: deckCards }))
  }

  const handleDeleteDeck = async (deckId: string) => {
    const { error: gamesError } = await client.from('deck_games').delete().eq('deck_id', deckId)
    if (gamesError) {
      alert('Failed to delete related games: ' + gamesError.message)
      return
    }

    const { error: deckError } = await client.from('decks').delete().eq('id', deckId)
    if (deckError) {
      alert('Failed to delete deck: ' + deckError.message)
      return
    }

    setDecks((prev) => prev.filter((deck) => deck.id !== deckId))
    setExpandedDecks((prev) => {
      const copy = { ...prev }
      delete copy[deckId]
      return copy
    })
    setConfirmDeleteId(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <Link href="/dashboard" className={styles.backLink}>
              <Home size={16} />
              Back to Dashboard
            </Link>
            <p className={styles.eyebrow}>Deck library</p>
            <h1 className={styles.pageTitle}>Your saved decks</h1>
            {!loading && (
              <p className={styles.pageIntro}>
                {decks.length} of {maxDecks} deck slots used.
              </p>
            )}
          </div>
          <Link
            href={decks.length >= maxDecks ? '/deck/list' : '/deck/new'}
            className={`${buttonStyles.button} ${decks.length >= maxDecks ? '' : buttonStyles.primary}`}
          >
            <PlusCircle size={18} />
            <span>{decks.length >= maxDecks ? 'Deck Limit Reached' : 'Create New Deck'}</span>
          </Link>
        </header>

        {error && <p className={styles.errorText}>{error}</p>}

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.headerWithIcon}>
              <BookMarked size={24} strokeWidth={2} />
              <h2 className={styles.headerText}>Deck overview</h2>
            </div>
          </div>

          {loading && <p className={styles.emptyText}>Loading decks...</p>}

          {decks.length === 0 && !loading && (
            <div className={styles.softPanel}>
              <p className={styles.emptyText}>No decks found.</p>
              <Link
                href="/deck/new"
                className={`${buttonStyles.button} ${buttonStyles.primary}`}
              >
                <PlusCircle size={18} />
                <span>Create New Deck</span>
              </Link>
            </div>
          )}
        </section>

        <section className={styles.deckList} aria-label="Saved decks">
          {decks.map((deck) => {
            const stats = deckStats[deck.id]
            const totalGames = stats?.total_games ?? 0
            const overallWinRate = getWinRate(stats?.wins ?? 0, totalGames)
            const soloWinRate = stats ? getWinRate(stats.solo_wins, stats.solo_games) : 'No data'
            const pvpWinRate = stats ? getWinRate(stats.pvp_wins, stats.pvp_games) : 'No data'
            const turnOrderLabel = stats
              ? [
                  stats.first_games > 0
                    ? `1st ${Math.round((stats.first_wins / stats.first_games) * 100)}%`
                    : null,
                  stats.second_games > 0
                    ? `2nd ${Math.round((stats.second_wins / stats.second_games) * 100)}%`
                    : null,
                ].filter(Boolean).join(' / ') || 'No data'
              : 'No data'

            return (
              <article key={deck.id} className={`${styles.card} ${styles.wideCard}`}>
                <div className={styles.deckCardHeader}>
                  <div>
                    <h2 className={styles.deckTitle}>{deck.deck_name}</h2>
                    <p className={styles.metaText}>
                      Created {new Date(deck.created_at).toLocaleDateString()}
                    </p>
                  </div>
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

                <div className={styles.statStrip}>
                  <div className={styles.statMini}>
                    <span className={styles.statMiniValue}>{totalGames}</span>
                    <span className={styles.statMiniLabel}>Games played</span>
                  </div>
                  <div className={styles.statMini}>
                    <span className={styles.statMiniValue}>{overallWinRate}</span>
                    <span className={styles.statMiniLabel}>Overall win rate</span>
                  </div>
                  <div className={styles.statMini}>
                    <span className={styles.statMiniValue}>{soloWinRate}</span>
                    <span className={styles.statMiniLabel}>Solo win rate</span>
                  </div>
                  <div className={styles.statMini}>
                    <span className={styles.statMiniValue}>{pvpWinRate}</span>
                    <span className={styles.statMiniLabel}>PvP win rate</span>
                  </div>
                </div>

                {totalGames > 0 && (
                  <div className={styles.insightGrid} aria-label={`${deck.deck_name} match details`}>
                    <div className={styles.insightMini}>
                      <span className={styles.insightMiniValue}>{turnOrderLabel}</span>
                      <span className={styles.insightMiniLabel}>First/second</span>
                    </div>
                    <div className={styles.insightMini}>
                      <span className={styles.insightMiniValue}>{stats?.top_opponent ?? 'No data'}</span>
                      <span className={styles.insightMiniLabel}>Common opponent</span>
                    </div>
                  </div>
                )}

                <div className={styles.cardActions}>
                  <button
                    onClick={() => openGameLogger(deck, 'win')}
                    className={`${styles.iconButton} ${styles.win}`}
                  >
                    <Trophy size={16} />
                    Record Win
                  </button>
                  <button
                    onClick={() => openGameLogger(deck, 'loss')}
                    className={`${styles.iconButton} ${styles.loss}`}
                  >
                    <XCircle size={16} />
                    Record Loss
                  </button>
                  <button
                    onClick={() => setConfirmResetId(deck.id)}
                    className={styles.backLink}
                  >
                    <RotateCcw size={16} />
                    Reset Stats
                  </button>
                  <button
                    onClick={() => toggleDeckCards(deck.id)}
                    className={styles.backLink}
                  >
                    {expandedDecks[deck.id] ? 'Hide Cards' : 'View Cards'}
                  </button>
                </div>

                {expandedDecks[deck.id] && (
                  <ol className={styles.cardList}>
                    {expandedDecks[deck.id].map((card) => (
                      <li key={card.id}>
                        <button
                          type="button"
                          onClick={() => card.cards?.image && setSelectedCardImage(card.cards.image)}
                          className={styles.inlineLink}
                          disabled={!card.cards?.image}
                        >
                          {card.cards?.name ?? '(Unknown Card)'}
                        </button>
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            )
          })}
        </section>

        {confirmDeleteId && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalDialog}>
              <h2 className={styles.headerText}>Delete this deck?</h2>
              <p className={styles.pageIntro}>This also removes the deck&apos;s recorded games.</p>
              <div className={styles.modalActions}>
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className={buttonStyles.button}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteDeck(confirmDeleteId)}
                  className={`${buttonStyles.button} ${buttonStyles.primary}`}
                >
                  Yes, delete
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmResetId && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalDialog}>
              <h2 className={styles.headerText}>Reset deck stats?</h2>
              <p className={styles.pageIntro}>All recorded games for this deck will be removed.</p>
              <div className={styles.modalActions}>
                <button
                  onClick={() => setConfirmResetId(null)}
                  className={buttonStyles.button}
                >
                  Cancel
                </button>
                <button
                  onClick={() => resetGameStats(confirmResetId)}
                  className={`${buttonStyles.button} ${buttonStyles.primary}`}
                >
                  Yes, reset
                </button>
              </div>
            </div>
          </div>
        )}

        {gameLogTarget && (
          <GameLogDialog
            deckName={gameLogTarget.deckName}
            result={gameLogTarget.result}
            defaultMatchType="pvp"
            cardOptions={gameLogCardOptions}
            isSaving={isRecordingGame}
            onClose={() => setGameLogTarget(null)}
            onSubmit={recordGame}
          />
        )}

        {selectedCardImage && (
          <div className={styles.modalOverlay} onClick={() => setSelectedCardImage(null)}>
            <div className={styles.modalContent} onClick={(event) => event.stopPropagation()}>
              <img src={selectedCardImage} alt="Card" style={{ maxWidth: '100%' }} />
              <button
                onClick={() => setSelectedCardImage(null)}
                className={buttonStyles.button}
                style={{ marginTop: '1rem', width: '100%' }}
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
