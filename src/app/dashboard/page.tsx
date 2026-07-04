'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { client } from '@/lib/neonClient'
import styles from './dashboard.module.css'
import buttonStyles from '@/styles/button.module.css'
import Link from 'next/link'
import { PlusCircle, Library, LogOut, Dice3 } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [deckCount, setDeckCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndDecks = async () => {
      const { data } = await client.auth.getUser()
      if (!data.user) {
        router.push('/')
        return
      }
      setUser(data.user)

      const { count, error } = await client
        .from('decks')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', data.user.id)

      if (!error && typeof count === 'number') {
        setDeckCount(count)
      }
      setLoading(false)
    }

    fetchUserAndDecks()
  }, [router])

  const signOut = async () => {
    await client.auth.signOut()
    router.push('/')
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.header}>BattleLedger Dashboard</h1>

      <div className={styles.card}>
        {user && <p className={styles.userEmail}>Logged in as: {user.email}</p>}

        <div className={styles.actions}>
          {/* Create Deck Button */}
          <Link href={deckCount >= 10 ? '#' : '/deck/new'}>
            <button
              disabled={deckCount >= 10}
              className={`${buttonStyles.button} ${buttonStyles.primary}`}
            >
              <PlusCircle size={18} />
              <span>Create New Deck</span>
            </button>
          </Link>

          {deckCount >= 10 && (
            <p style={{ color: '#205493', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              You’ve reached the maximum of 10 decks. The ability to add more decks is coming soon!
            </p>
          )}

          <Link href="/deck/list">
            <button className={buttonStyles.button}>
              <Library size={18} />
              <span>View My Decks</span>
            </button>
          </Link>

          <Link href="/battle/random">
            <button className={buttonStyles.button}>
              <Dice3 size={18} />
              <span>Start Random Match</span>
            </button>
          </Link>

          <button
            onClick={signOut}
            className={`${buttonStyles.button} ${buttonStyles.signOut}`}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
