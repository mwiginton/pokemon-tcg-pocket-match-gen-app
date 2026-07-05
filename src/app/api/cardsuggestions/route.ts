import { client } from '@/lib/neonClient'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')?.trim() || ''

  if (!query) {
    return NextResponse.json({ data: [] })
  }

  const { data, error } = await client
    .from('cards')
    .select('id, name, pack')
    .filter('name', 'ilike', `%${query}%`)
    .order('name', { ascending: true })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
