'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function IndexRedirectPage() {
  const [checkedAuth, setCheckedAuth] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      const session = data?.session

      if (session?.user) {
        router.replace('/dashboard')
      } else {
        router.replace('/landing')
      }

      setCheckedAuth(true)
    }

    checkSession()
  }, [router])

  return null
}
