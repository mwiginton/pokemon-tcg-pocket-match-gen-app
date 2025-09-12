import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query') || ''

  const { data, error } = await supabase
    .from('cards')
    .select('id, name, pack')
    .filter('name', 'ilike', `%${query}%`)
    .order('name', { ascending: true })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const uniqueCards = Array.from(
    new Map(data.map(card => [`${card.name}-${card.pack}`, card])).values()
  )

  return NextResponse.json({ data: uniqueCards })
}
