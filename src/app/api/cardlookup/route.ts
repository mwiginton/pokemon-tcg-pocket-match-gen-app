import { client } from '@/lib/neonClient'
import { NextResponse } from 'next/server'

type CardMatch = {
  id: string
  name: string
  pack?: string
}

type LookupResult = {
  term: string
  card: CardMatch | null
  matchedBy: 'id' | 'name' | 'partial' | null
}

const cardIdPattern = /[A-Z0-9]+-\d{3}/i

const cleanTerm = (term: string) =>
  term
    .replace(cardIdPattern, '')
    .replace(/[\[\](){}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const lookupCard = async (term: string): Promise<LookupResult> => {
  const normalizedTerm = term.trim()
  const idMatch = normalizedTerm.match(cardIdPattern)

  if (idMatch) {
    const { data } = await client
      .from('cards')
      .select('id, name, pack')
      .eq('id', idMatch[0].toUpperCase())
      .limit(1)

    if (data?.[0]) {
      return { term, card: data[0] as CardMatch, matchedBy: 'id' }
    }
  }

  const nameTerm = cleanTerm(normalizedTerm) || normalizedTerm

  const { data: exactMatches } = await client
    .from('cards')
    .select('id, name, pack')
    .filter('name', 'ilike', nameTerm)
    .order('id', { ascending: true })
    .limit(1)

  if (exactMatches?.[0]) {
    return { term, card: exactMatches[0] as CardMatch, matchedBy: 'name' }
  }

  const { data: partialMatches } = await client
    .from('cards')
    .select('id, name, pack')
    .filter('name', 'ilike', `%${nameTerm}%`)
    .order('name', { ascending: true })
    .limit(1)

  if (partialMatches?.[0]) {
    return { term, card: partialMatches[0] as CardMatch, matchedBy: 'partial' }
  }

  return { term, card: null, matchedBy: null }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { terms?: unknown } | null
  const rawTerms = Array.isArray(body?.terms) ? body.terms : []
  const terms = rawTerms
    .map((term) => (typeof term === 'string' ? term.trim() : ''))
    .filter(Boolean)
    .slice(0, 20)

  if (terms.length === 0) {
    return NextResponse.json({ results: [] })
  }

  const results = await Promise.all(terms.map(lookupCard))
  return NextResponse.json({ results })
}
