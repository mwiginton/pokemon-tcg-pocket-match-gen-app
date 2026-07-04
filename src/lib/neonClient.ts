import { createClient, SupabaseAuthAdapter } from '@neondatabase/neon-js'

const neonAuthUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL!
const neonDataApiUrl = process.env.NEXT_PUBLIC_NEON_DATA_API_URL!

export const client = createClient({
  auth: {
    url: neonAuthUrl,
    adapter: SupabaseAuthAdapter(),
  },
  dataApi: {
    url: neonDataApiUrl,
  },
})
