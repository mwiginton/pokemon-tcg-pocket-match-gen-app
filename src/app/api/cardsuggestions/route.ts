import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query') || ''

  const { data, error } = await supabase
    .from('unique_cards_per_pack')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(10)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
