'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import styles from './dashboard.module.css'

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
        <button className={styles.signOutButton} onClick={signOut}>
          Sign Out
        </button>
      </div>
    </div>
  )
}
