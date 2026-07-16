'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { client } from '@/lib/neonClient'
import { getAuthenticatedUser } from '@/lib/authUser'
import {
  formatStatsMonthLabel,
  gameMatchesStatsPeriod,
  getAvailableMonths,
  getAvailableYears,
  getEffectiveStatsPeriod,
  getStatsPeriodLabel,
  type StatsPeriod,
} from '@/lib/statsPeriod'
import styles from './dashboard.module.css'
import buttonStyles from '@/styles/button.module.css'
import {
  Activity,
  BarChart3,
  Dice3,
  Library,
  LogOut,
  PlusCircle,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react'

type DashboardUser = {
  id: string
  email?: string | null
}

type Deck = {
  id: string
  deck_name: string
  created_at: string
}

type DeckGame = {
  deck_id: string
  result: 'win' | 'loss' | 'tie'
  created_at: string
  match_type: 'solo' | 'pvp' | null
  solo_difficulty: string | null
  opponent_archetype: string | null
  turns_played: number | null
  close_game: boolean | null
  mvp_card: string | null
  notes: string | null
}

type DeckPerformance = {
  deckId: string
  deckName: string
  totalGames: number
  wins: number
  losses: number
  ties: number
  winRate: number
}

type NextAction = {
  href: string
  label: string
  detail: string
  icon: 'plus' | 'dice' | 'library'
}

type DifficultyStats = {
  games: number
  wins: number
  ties: number
}

const maxDecks = 10
const difficultyOrder = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))

const getWinRate = (wins: number, totalGames: number) =>
  totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0

const getDifficultyBreakdown = (stats: Record<string, DifficultyStats>) =>
  Object.entries(stats).sort(([a], [b]) => {
    const aIndex = difficultyOrder.indexOf(a)
    const bIndex = difficultyOrder.indexOf(b)
    if (a === 'Untracked') return 1
    if (b === 'Untracked') return -1
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return a.localeCompare(b)
  })

export default function Dashboard() {
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [decks, setDecks] = useState<Deck[]>([])
  const [games, setGames] = useState<DeckGame[]>([])
  const [statsPeriod, setStatsPeriod] = useState<StatsPeriod>({
    mode: 'all',
    year: '',
    month: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchDashboard = async () => {
      const { user: authenticatedUser } = await getAuthenticatedUser()
      if (!authenticatedUser) {
        router.push('/')
        return
      }

      const currentUser = {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
      }

      setUser(currentUser)
      setLoading(true)
      setError('')

      const { data: decksData, error: decksError } = await client
        .from('decks')
        .select('id, deck_name, created_at')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })

      if (decksError || !decksData) {
        setError(decksError?.message || 'Failed to load dashboard.')
        setLoading(false)
        return
      }

      const { data: gamesData, error: gamesError } = await client
        .from('deck_games')
        .select('deck_id, result, created_at, match_type, solo_difficulty, opponent_archetype, turns_played, close_game, mvp_card, notes')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })

      if (gamesError || !gamesData) {
        setError(gamesError?.message || 'Failed to load recent matches.')
        setDecks(decksData as Deck[])
        setLoading(false)
        return
      }

      setDecks(decksData as Deck[])
      setGames(gamesData as DeckGame[])
      setLoading(false)
    }

    fetchDashboard()
  }, [router])

  const signOut = async () => {
    await client.auth.signOut()
    router.push('/')
  }

  const availableYears = useMemo(() => getAvailableYears(games), [games])
  const selectedYear = statsPeriod.year || availableYears[0] || ''
  const availableMonths = useMemo(
    () => getAvailableMonths(games, statsPeriod.mode === 'month' ? selectedYear : undefined),
    [games, selectedYear, statsPeriod.mode],
  )
  const effectiveStatsPeriod = useMemo(
    () => getEffectiveStatsPeriod(statsPeriod, availableYears, availableMonths),
    [availableMonths, availableYears, statsPeriod],
  )
  const statsPeriodLabel = getStatsPeriodLabel(effectiveStatsPeriod)
  const scopedGames = useMemo(
    () => games.filter((game) => gameMatchesStatsPeriod(game.created_at, effectiveStatsPeriod)),
    [effectiveStatsPeriod, games],
  )
  const setStatsPeriodMode = (mode: StatsPeriod['mode']) => {
    setStatsPeriod((prev) => ({
      mode,
      year: prev.year || availableYears[0] || '',
      month: prev.month || availableMonths[0] || '',
    }))
  }

  const deckCount = decks.length
  const deckNames = new Map(decks.map((deck) => [deck.id, deck.deck_name]))
  const totalGames = scopedGames.length
  const totalWins = scopedGames.filter((game) => game.result === 'win').length
  const totalTies = scopedGames.filter((game) => game.result === 'tie').length
  const totalLosses = totalGames - totalWins - totalTies
  const overallWinRate = getWinRate(totalWins, totalGames)
  const soloGames = scopedGames.filter((game) => game.match_type === 'solo')
  const soloWins = soloGames.filter((game) => game.result === 'win').length
  const soloWinRate = getWinRate(soloWins, soloGames.length)
  const pvpGames = scopedGames.filter((game) => (game.match_type ?? 'pvp') === 'pvp')
  const pvpWins = pvpGames.filter((game) => game.result === 'win').length
  const pvpWinRate = getWinRate(pvpWins, pvpGames.length)
  const soloDifficultyStats = soloGames.reduce<Record<string, DifficultyStats>>((stats, game) => {
    const difficulty = game.solo_difficulty ?? 'Untracked'
    if (!stats[difficulty]) stats[difficulty] = { games: 0, wins: 0, ties: 0 }
    stats[difficulty].games++
    if (game.result === 'win') stats[difficulty].wins++
    if (game.result === 'tie') stats[difficulty].ties++
    return stats
  }, {})
  const soloDifficultyBreakdown = getDifficultyBreakdown(soloDifficultyStats)
  const allTimeGames = games.length

  const performanceByDeck = decks
    .map<DeckPerformance>((deck) => {
      const deckGames = scopedGames.filter((game) => game.deck_id === deck.id)
      const wins = deckGames.filter((game) => game.result === 'win').length
      const ties = deckGames.filter((game) => game.result === 'tie').length
      const total = deckGames.length

      return {
        deckId: deck.id,
        deckName: deck.deck_name,
        totalGames: total,
        wins,
        losses: total - wins - ties,
        ties,
        winRate: getWinRate(wins, total),
      }
    })
    .filter((deck) => deck.totalGames > 0)

  const bestDeck = performanceByDeck.reduce<DeckPerformance | null>(
    (best, deck) => (!best || deck.winRate > best.winRate ? deck : best),
    null,
  )

  const worstDeck = performanceByDeck.reduce<DeckPerformance | null>(
    (worst, deck) => (!worst || deck.winRate < worst.winRate ? deck : worst),
    null,
  )

  const nextAction: NextAction =
    deckCount === 0
      ? {
          href: '/deck/new',
          label: 'Create your first deck',
          detail: 'Add 20 cards so BattleLedger can start tracking results.',
          icon: 'plus',
        }
      : allTimeGames === 0
      ? {
          href: '/battle/random',
          label: 'Start your first match',
          detail: 'Generate a matchup and record your first win, loss, or tie.',
          icon: 'dice',
        }
      : {
          href: '/battle/random',
          label: 'Start another random match',
          detail: 'Keep your stats fresh with one more logged result.',
          icon: 'dice',
        }

  const nextActionIcon =
    nextAction.icon === 'plus' ? (
      <PlusCircle size={20} />
    ) : nextAction.icon === 'library' ? (
      <Library size={20} />
    ) : (
      <Dice3 size={20} />
    )

  return (
    <div className={styles.page}>
      <div className={styles.dashboardShell}>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>BattleLedger Dashboard</p>
            <h1 className={styles.header}>Your battle overview</h1>
            {user && <p className={styles.userEmail}>Logged in as {user.email}</p>}
          </div>
          <button
            onClick={signOut}
            className={`${buttonStyles.button} ${buttonStyles.signOut} ${styles.signOutButton}`}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </header>

        {error && <p className={styles.errorText}>{error}</p>}

        {loading ? (
          <div className={styles.panel}>
            <p className={styles.emptyText}>Loading your dashboard...</p>
          </div>
        ) : (
          <>
            <nav className={styles.mobileQuickActions} aria-label="Dashboard shortcuts">
              <Link
                href={deckCount >= maxDecks ? '/deck/list' : '/deck/new'}
                className={`${buttonStyles.buttonCompact} ${deckCount >= maxDecks ? '' : buttonStyles.primary}`}
              >
                <PlusCircle size={16} />
                <span>{deckCount >= maxDecks ? 'Decks' : 'New Deck'}</span>
              </Link>
              <Link href="/deck/list" className={buttonStyles.buttonCompact}>
                <Library size={16} />
                <span>My Decks</span>
              </Link>
              <Link href="/battle/random" className={buttonStyles.buttonCompact}>
                <Dice3 size={16} />
                <span>Match</span>
              </Link>
            </nav>

            {games.length > 0 && (
              <section className={styles.periodPanel} aria-label="Win rate period">
                <div className={styles.periodHeader}>
                  <div>
                    <p className={styles.panelKicker}>Win rate period</p>
                    <h2>Showing {statsPeriodLabel}</h2>
                  </div>
                  <div className={styles.segmentedControl}>
                    <button
                      type="button"
                      className={`${styles.choiceButton} ${
                        effectiveStatsPeriod.mode === 'all' ? styles.choiceButtonActive : ''
                      }`}
                      onClick={() => setStatsPeriodMode('all')}
                      aria-pressed={effectiveStatsPeriod.mode === 'all'}
                    >
                      All time
                    </button>
                    <button
                      type="button"
                      className={`${styles.choiceButton} ${
                        effectiveStatsPeriod.mode === 'year' ? styles.choiceButtonActive : ''
                      }`}
                      onClick={() => setStatsPeriodMode('year')}
                      aria-pressed={effectiveStatsPeriod.mode === 'year'}
                    >
                      Year
                    </button>
                    <button
                      type="button"
                      className={`${styles.choiceButton} ${
                        effectiveStatsPeriod.mode === 'month' ? styles.choiceButtonActive : ''
                      }`}
                      onClick={() => setStatsPeriodMode('month')}
                      aria-pressed={effectiveStatsPeriod.mode === 'month'}
                    >
                      Month
                    </button>
                  </div>
                </div>

                {effectiveStatsPeriod.mode !== 'all' && (
                  <div className={styles.periodSelectGroup}>
                    <label className={styles.periodSelectLabel}>
                      <span>Year</span>
                      <select
                        className={styles.periodSelect}
                        value={effectiveStatsPeriod.year}
                        onChange={(event) =>
                          setStatsPeriod((prev) => ({
                            ...prev,
                            year: event.target.value,
                            month: '',
                          }))
                        }
                      >
                        {availableYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </label>

                    {effectiveStatsPeriod.mode === 'month' && (
                      <label className={styles.periodSelectLabel}>
                        <span>Month</span>
                        <select
                          className={styles.periodSelect}
                          value={effectiveStatsPeriod.month}
                          onChange={(event) =>
                            setStatsPeriod((prev) => ({ ...prev, month: event.target.value }))
                          }
                        >
                          {availableMonths.map((month) => (
                            <option key={month} value={month}>
                              {formatStatsMonthLabel(month).replace(/ \d{4}$/, '')}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </div>
                )}
              </section>
            )}

            <section className={styles.statsGrid} aria-label="Account overview">
              <div className={styles.statTile}>
                <Library size={20} className={styles.statIcon} />
                <span className={styles.statValue}>{deckCount}</span>
                <span className={styles.statLabel}>Decks saved</span>
                <span className={styles.statMeta}>{maxDecks - deckCount} slots open</span>
              </div>
              <div className={styles.statTile}>
                <Activity size={20} className={styles.statIcon} />
                <span className={styles.statValue}>{totalGames}</span>
                <span className={styles.statLabel}>Matches logged</span>
                <span className={styles.statMeta}>{totalWins} wins, {totalLosses} losses, {totalTies} ties</span>
              </div>
              <div className={styles.statTile}>
                <BarChart3 size={20} className={styles.statIcon} />
                <span className={styles.statValue}>{overallWinRate}%</span>
                <span className={styles.statLabel}>Overall win rate</span>
                <span className={styles.statMeta}>{totalGames > 0 ? `Across ${statsPeriodLabel}` : 'No games in period'}</span>
              </div>
              <div className={styles.statTile}>
                <BarChart3 size={20} className={styles.statIcon} />
                <span className={styles.statValue}>{soloWinRate}%</span>
                <span className={styles.statLabel}>Solo win rate</span>
                <span className={styles.statMeta}>{soloGames.length} solo {soloGames.length === 1 ? 'match' : 'matches'}</span>
              </div>
              <div className={styles.statTile}>
                <BarChart3 size={20} className={styles.statIcon} />
                <span className={styles.statValue}>{pvpWinRate}%</span>
                <span className={styles.statLabel}>PvP win rate</span>
                <span className={styles.statMeta}>{pvpGames.length} PvP {pvpGames.length === 1 ? 'match' : 'matches'}</span>
              </div>
            </section>

            {soloDifficultyBreakdown.length > 0 && (
              <section className={styles.difficultyPanel} aria-label="Solo win rates by difficulty">
                <div className={styles.panelHeader}>
                  <div>
                    <p className={styles.panelKicker}>Solo difficulty</p>
                    <h2>Win rates by difficulty</h2>
                  </div>
                  <span className={styles.statMeta}>{statsPeriodLabel}</span>
                </div>
                <div className={styles.difficultyGrid}>
                  {soloDifficultyBreakdown.map(([difficulty, difficultyStats]) => {
                    const losses = difficultyStats.games - difficultyStats.wins - difficultyStats.ties
                    return (
                      <div key={difficulty} className={styles.difficultyTile}>
                        <span className={styles.difficultyName}>{difficulty}</span>
                        <span className={styles.difficultyRate}>
                          {getWinRate(difficultyStats.wins, difficultyStats.games)}%
                        </span>
                        <span className={styles.difficultyMeta}>
                          {difficultyStats.games} {difficultyStats.games === 1 ? 'match' : 'matches'} ·{' '}
                          {difficultyStats.wins}W / {losses}L / {difficultyStats.ties}T
                        </span>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            <section className={styles.nextActionPanel}>
              <div className={styles.nextActionCopy}>
                <Sparkles size={20} className={styles.nextActionIcon} />
                <div>
                  <p className={styles.panelKicker}>Next best action</p>
                  <h2>{nextAction.label}</h2>
                  <p>{nextAction.detail}</p>
                </div>
              </div>
              <Link href={nextAction.href} className={`${buttonStyles.button} ${buttonStyles.primary}`}>
                {nextActionIcon}
                <span>{nextAction.label}</span>
              </Link>
            </section>

            <section className={styles.twoColumnGrid}>
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Deck performance</h2>
                  <Link href="/deck/list">View decks</Link>
                </div>

                {performanceByDeck.length === 0 ? (
                  <p className={styles.emptyText}>Record a match to see best and worst deck trends.</p>
                ) : (
                  <div className={styles.performanceGrid}>
                    <PerformanceCard
                      label="Best deck"
                      deck={bestDeck}
                      icon={<Trophy size={18} />}
                      tone="best"
                    />
                    <PerformanceCard
                      label="Needs attention"
                      deck={worstDeck}
                      icon={<XCircle size={18} />}
                      tone="worst"
                    />
                  </div>
                )}
              </div>

              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Recent matches</h2>
                  <Link href="/battle/random">Log match</Link>
                </div>

                {scopedGames.length === 0 ? (
                  <p className={styles.emptyText}>No matches in this period.</p>
                ) : (
                  <ul className={styles.recentList}>
                    {scopedGames.slice(0, 5).map((game, index) => (
                      <li key={`${game.deck_id}-${game.created_at}-${index}`} className={styles.recentItem}>
                        <span
                          className={`${styles.resultPill} ${
                            game.result === 'win'
                              ? styles.win
                              : game.result === 'loss'
                              ? styles.loss
                              : styles.tie
                          }`}
                        >
                          {game.result}
                        </span>
                        <span className={styles.recentDeck}>
                          {deckNames.get(game.deck_id) ?? 'Unknown deck'}
                          <span className={styles.recentType}>
                            {(game.match_type ?? 'pvp') === 'solo'
                              ? `Solo${game.solo_difficulty ? ` · ${game.solo_difficulty}` : ''}`
                              : 'PvP'}
                          </span>
                          {game.opponent_archetype && (
                            <span className={styles.recentDetail}> vs {game.opponent_archetype}</span>
                          )}
                          {(game.turns_played || game.mvp_card || game.close_game) && (
                            <span className={styles.recentSubdetail}>
                              {game.turns_played ? `${game.turns_played} turns` : ''}
                              {game.turns_played && (game.mvp_card || game.close_game) ? ' | ' : ''}
                              {game.mvp_card ? `MVP: ${game.mvp_card}` : ''}
                              {game.mvp_card && game.close_game ? ' | ' : ''}
                              {game.close_game ? 'close' : ''}
                            </span>
                          )}
                        </span>
                        <span className={styles.recentDate}>{formatDate(game.created_at)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section className={styles.quickActions} aria-label="Quick actions">
              <Link
                href={deckCount >= maxDecks ? '/deck/list' : '/deck/new'}
                className={`${buttonStyles.button} ${deckCount >= maxDecks ? '' : buttonStyles.primary}`}
              >
                <PlusCircle size={18} />
                <span>{deckCount >= maxDecks ? 'Manage Decks' : 'Create New Deck'}</span>
              </Link>
              <Link href="/deck/list" className={buttonStyles.button}>
                <Library size={18} />
                <span>View My Decks</span>
              </Link>
              <Link href="/battle/random" className={buttonStyles.button}>
                <Dice3 size={18} />
                <span>Start Random Match</span>
              </Link>
            </section>

            {deckCount >= maxDecks && (
              <p className={styles.limitNote}>
                You have reached the maximum of {maxDecks} decks. Delete one to add a new deck.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function PerformanceCard({
  label,
  deck,
  icon,
  tone,
}: {
  label: string
  deck: DeckPerformance | null
  icon: ReactNode
  tone: 'best' | 'worst'
}) {
  if (!deck) {
    return null
  }

  return (
    <div className={styles.performanceCard}>
      <div className={`${styles.performanceIcon} ${styles[tone]}`}>{icon}</div>
      <div>
        <p className={styles.panelKicker}>{label}</p>
        <h3>{deck.deckName}</h3>
        <p>
          {deck.winRate}% win rate across {deck.totalGames} {deck.totalGames === 1 ? 'match' : 'matches'}
          {' '}
          ({deck.wins}W / {deck.losses}L / {deck.ties}T)
        </p>
      </div>
    </div>
  )
}
