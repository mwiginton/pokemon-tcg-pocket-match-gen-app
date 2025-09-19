'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import styles from './dashboard.module.css'
import Link from 'next/link'
import { PlusCircle, Library, LogOut, Dice3 } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/')
      } else {
        setUser(data.user)
      }
    }
    fetchUser()
  }, [router])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.header}>Welcome to your Dashboard</h1>

      <div className={styles.card}>
        {user && <p className={styles.userEmail}>Logged in as: {user.email}</p>}

        <div className={styles.actions}>
          <Link href="/deck/new">
            <button className={`${styles.button} ${styles.primary}`}>
              <PlusCircle size={18} />
              <span>Create New Deck</span>
            </button>
          </Link>

          <Link href="/deck/list">
            <button className={styles.button}>
              <Library size={18} />
              <span>View My Decks</span>
            </button>
          </Link>

          <Link href="/battle/random">
            <button className={styles.button}>
              <Dice3 size={18} />
              <span>Start Random Match</span>
            </button>
          </Link>

          <button onClick={signOut} className={`${styles.button} ${styles.signOut}`}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
