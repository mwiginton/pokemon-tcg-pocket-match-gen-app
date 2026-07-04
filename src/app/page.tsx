'use client'

import { useEffect } from 'react'
import { client } from '@/lib/neonClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from '@/styles/layout.module.css'

export default function IndexRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await client.auth.getSession()
      const session = data?.session

      if (session?.user) {
        router.replace('/dashboard')
      } else {
        router.replace('/landing')
      }
    }

    checkSession()
  }, [router])

  return (
    <div className={styles.page}>
      <main className={styles.mainContent}>
        <div className={styles.card}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={64}
            height={64}
            style={{ alignSelf: 'center' }}
          />
          <h1 style={{ textAlign: 'center', marginTop: '1rem' }}>
            Loading your session...
          </h1>
          <div
            style={{
              width: '32px',
              height: '32px',
              border: '4px solid #ccc',
              borderTop: '4px solid #0070f3',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '16px auto 0',
            }}
          />
        </div>
      </main>
    </div>
  )
}
