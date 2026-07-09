'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { client } from '@/lib/neonClient'
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
  result: 'win' | 'loss'
  created_at: string
}

type DeckPerformance = {
  deckId: string
  deckName: string
  totalGames: number
  wins: number
  losses: number
  winRate: number
}

type NextAction = {
  href: string
  label: string
  detail: string
  icon: 'plus' | 'dice' | 'library'
}

const maxDecks = 10

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))

const getWinRate = (wins: number, totalGames: number) =>
  totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0

export default function Dashboard() {
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [decks, setDecks] = useState<Deck[]>([])
  const [games, setGames] = useState<DeckGame[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchDashboard = async () => {
      const { data } = await client.auth.getUser()
      if (!data.user) {
        router.push('/')
        return
      }

      const currentUser = {
        id: data.user.id,
        email: data.user.email,
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
        .select('deck_id, result, created_at')
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

  const deckCount = decks.length
  const deckNames = new Map(decks.map((deck) => [deck.id, deck.deck_name]))
  const totalGames = games.length
  const totalWins = games.filter((game) => game.result === 'win').length
  const totalLosses = totalGames - totalWins
  const overallWinRate = getWinRate(totalWins, totalGames)

  const performanceByDeck = decks
    .map<DeckPerformance>((deck) => {
      const deckGames = games.filter((game) => game.deck_id === deck.id)
      const wins = deckGames.filter((game) => game.result === 'win').length
      const total = deckGames.length

      return {
        deckId: deck.id,
        deckName: deck.deck_name,
        totalGames: total,
        wins,
        losses: total - wins,
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
      : totalGames === 0
      ? {
          href: '/battle/random',
          label: 'Start your first match',
          detail: 'Generate a matchup and record your first win or loss.',
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
                <span className={styles.statMeta}>{totalWins} wins, {totalLosses} losses</span>
              </div>
              <div className={styles.statTile}>
                <BarChart3 size={20} className={styles.statIcon} />
                <span className={styles.statValue}>{overallWinRate}%</span>
                <span className={styles.statLabel}>Overall win rate</span>
                <span className={styles.statMeta}>{totalGames > 0 ? 'Across all decks' : 'No games yet'}</span>
              </div>
            </section>

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

                {games.length === 0 ? (
                  <p className={styles.emptyText}>No matches logged yet.</p>
                ) : (
                  <ul className={styles.recentList}>
                    {games.slice(0, 5).map((game, index) => (
                      <li key={`${game.deck_id}-${game.created_at}-${index}`} className={styles.recentItem}>
                        <span className={`${styles.resultPill} ${game.result === 'win' ? styles.win : styles.loss}`}>
                          {game.result}
                        </span>
                        <span className={styles.recentDeck}>{deckNames.get(game.deck_id) ?? 'Unknown deck'}</span>
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
        </p>
      </div>
    </div>
  )
}
