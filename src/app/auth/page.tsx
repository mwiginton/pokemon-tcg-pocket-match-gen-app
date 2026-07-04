'use client'

import { useEffect, useState } from 'react'
import { client } from '@/lib/neonClient'
import styles from './page.module.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type AuthUser = {
  email?: string | null
} | null

export default function AuthPage() {
  const [user, setUser] = useState<AuthUser>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn')
  const [confirmationSent, setConfirmationSent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await client.auth.getUser()
      if (data.user) {
        setUser(data.user)
        router.replace('/dashboard')
      } else {
        setLoadingUser(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        router.replace('/dashboard')
      } else {
        setLoadingUser(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const signOut = async () => {
    await client.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAuthError('')
    const { error } = await client.auth.signInWithPassword({ email, password })
    if (error) {
      setAuthError(error.message)
    } else {
      router.replace('/dashboard')
    }
    setLoading(false)
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAuthError('')

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    })

    if (error) {
      setAuthError(error.message)
    } else if (!data.session) {
      // ✅ Show confirmation screen if no session (email verification required)
      setConfirmationSent(true)
    } else {
      router.replace('/dashboard')
    }

    setLoading(false)
  }

  // 🔄 Loading screen while checking session
  if (loadingUser) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.card}>
            <Image src="/logo.svg" alt="Logo" width={64} height={64} className={styles.logo} />
            <h1 className={styles.title}>Loading your session...</h1>
            <div className={styles.spinner}></div>
          </div>
        </main>
      </div>
    )
  }

  // ✉️ Confirmation screen after sign-up
  if (confirmationSent) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.card}>
            <Image src="/logo.svg" alt="Logo" width={64} height={64} className={styles.logo} />
            <h1 className={styles.title}>Check your email</h1>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#444' }}>
              A confirmation link has been sent to <strong>{email}</strong>.<br />
              Click the link in your inbox to verify your account before signing in.
            </p>
            <button
              onClick={() => {
                setConfirmationSent(false)
                setMode('signIn')
              }}
              style={{
                marginTop: '1.5rem',
                backgroundColor: '#0070f3',
                color: '#fff',
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Back to Sign In
            </button>
          </div>
        </main>
      </div>
    )
  }

  // 🧩 Regular sign-in / sign-up UI
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.card}>
          <Image src="/logo.svg" alt="Logo" width={64} height={64} className={styles.logo} />
          <h1 className={styles.title}>
            {user
              ? `Welcome, ${user.email}`
              : mode === 'signIn'
              ? 'Sign in to your account'
              : 'Create an account'}
          </h1>

          {user ? (
            <button className={styles.signOutButton} onClick={signOut}>
              Sign Out
            </button>
          ) : (
            <>
              <form
                onSubmit={mode === 'signIn' ? handleEmailLogin : handleEmailSignUp}
                className={styles.form}
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading
                    ? mode === 'signIn'
                      ? 'Signing in...'
                      : 'Creating account...'
                    : mode === 'signIn'
                    ? 'Sign in with Email'
                    : 'Sign up with Email'}
                </button>
              </form>

              <p style={{ fontSize: '14px', textAlign: 'center', color: '#555' }}>
                {mode === 'signIn' ? (
                  <>
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signUp')}
                      style={{
                        color: '#0070f3',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signIn')}
                      style={{
                        color: '#0070f3',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>

              {authError && <p className={styles.error}>{authError}</p>}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
