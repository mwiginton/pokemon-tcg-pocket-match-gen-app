'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import styles from './dashboard.module.css'
import Link from 'next/link'
import { PlusCircle, Library, LogOut } from 'lucide-react'

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <Link href="/deck/new">
            <button className={styles.signOutButton}>
              <PlusCircle size={18} style={{ marginRight: 8 }} />
              Create New Deck
            </button>
          </Link>

          <Link href="/deck/list">
            <button className={styles.signOutButton}>
              <Library size={18} style={{ marginRight: 8 }} />
              View My Decks
            </button>
          </Link>

          <button onClick={signOut} className={styles.signOutButton}>
            <LogOut size={18} style={{ marginRight: 8 }} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
