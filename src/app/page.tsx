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
      <main className={styles.shell}>
        <div className={styles.panel}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={64}
            height={64}
            style={{ alignSelf: 'center' }}
          />
          <p className={styles.eyebrow} style={{ textAlign: 'center' }}>BattleLedger</p>
          <h1 className={styles.headerText} style={{ textAlign: 'center' }}>Loading your session...</h1>
          <div className={styles.loadingSpinner} />
        </div>
      </main>
    </div>
  )
}
