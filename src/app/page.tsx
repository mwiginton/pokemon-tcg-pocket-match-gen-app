'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import styles from './page.module.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn')
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUser(data.user)
        router.push('/dashboard') // ✅ redirect if already signed in
      }
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        router.push('/dashboard') // ✅ redirect when auth state changes
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`, // ✅ after Google OAuth
      },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/') // ✅ back to home after sign-out
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAuthError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setAuthError(error.message)
    } else {
      router.push('/dashboard') // ✅ redirect on successful login
    }
    setLoading(false)
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAuthError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setAuthError(error.message)
    } else {
      router.push('/dashboard') // ✅ redirect on successful signup
    }
    setLoading(false)
  }

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
                    Don't have an account?{' '}
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

              <div className={styles.divider}>or</div>

              <button className={styles.googleButton} onClick={signInWithGoogle}>
                <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
                Continue with Google
              </button>

              {authError && <p className={styles.error}>{authError}</p>}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
