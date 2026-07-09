import { client } from '@/lib/neonClient'

export type AuthenticatedUser = {
  id: string
  email?: string | null
}

export async function getAuthenticatedUser(): Promise<{
  user: AuthenticatedUser | null
  error: string | null
}> {
  const { data: userData, error: userError } = await client.auth.getUser()
  const user = userData?.user

  if (!user || userError) {
    return {
      user: null,
      error: userError?.message || 'Not authenticated.',
    }
  }

  const { data: claimsData, error: claimsError } = await client.auth.getClaims()
  const claimsUserId = claimsData?.claims?.sub

  if (typeof claimsUserId !== 'string' || !claimsUserId) {
    return {
      user: null,
      error: claimsError?.message || 'Unable to read authenticated user id.',
    }
  }

  return {
    user: {
      id: claimsUserId,
      email: user.email,
    },
    error: null,
  }
}
