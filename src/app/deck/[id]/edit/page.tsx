'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { client } from '@/lib/neonClient'
import { getAuthenticatedUser } from '@/lib/authUser'
import styles from '@/styles/layout.module.css'
import buttonStyles from '@/styles/button.module.css'
import DeckCardBuilder, { DeckCardEntry } from '@/components/DeckCardBuilder'

type DeckCardQueryRow = {
  card_id: string
  cards:
    | { name?: string | null; pack?: string | null }
    | { name?: string | null; pack?: string | null }[]
    | null
}

export default function EditDeckPage() {
  const router = useRouter()
  const params = useParams()
  const deckId = params?.id as string

  const [deckName, setDeckName] = useState('')
  const [cards, setCards] = useState<DeckCardEntry[]>(Array(20).fill({ id: '', name: '' }))
  const [error, setError] = useState('')
  const [duplicateErrors, setDuplicateErrors] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [invalidDeckName, setInvalidDeckName] = useState(false)
  const deckNameRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const fetchDeck = async () => {
      setLoading(true)
      const { user } = await getAuthenticatedUser()
      if (!user) {
        router.push('/')
        return
      }

      const { data: deckData, error: deckError } = await client
        .from('decks')
        .select('*')
        .eq('id', deckId)
        .eq('user_id', user.id)
        .single()

      if (deckError || !deckData) {
        setError(deckError?.message || 'Deck not found.')
        setLoading(false)
        return
      }

      setDeckName(deckData.deck_name)

      const { data: deckCards, error: cardsError } = await client
        .from('deck_cards')
        .select('card_id, cards(name, pack)')
        .eq('deck_id', deckId)
        .order('card_index', { ascending: true })

      if (cardsError) {
        setError(cardsError.message)
        setLoading(false)
        return
      }

      const formattedCards = ((deckCards ?? []) as DeckCardQueryRow[]).map((c) => {
        const card = Array.isArray(c.cards) ? c.cards[0] : c.cards

        return {
          id: c.card_id,
          name: card?.name || '',
          pack: card?.pack || '',
        }
      })

      setCards([
        ...formattedCards,
        ...Array(Math.max(0, 20 - formattedCards.length)).fill({ id: '', name: '' }),
      ])
      setLoading(false)
    }

    fetchDeck()
  }, [deckId, router])

  // --- duplicate validation (per-slot) ---
  const validateDuplicateCards = (cardsToCheck: DeckCardEntry[]): Record<number, string> => {
    const nameCounts: Record<string, number> = {}
    const violations: Record<number, string> = {}

    for (const card of cardsToCheck) {
      if (!card.name.trim()) continue
      const name = card.name.trim()
      nameCounts[name] = (nameCounts[name] || 0) + 1
    }

    for (let i = 0; i < cardsToCheck.length; i++) {
      const card = cardsToCheck[i]
      if (!card.name.trim()) continue
      if (nameCounts[card.name.trim()] > 2) {
        violations[i] = `You can only include up to 2 copies of "${card.name.trim()}".`
      }
    }

    return violations
  }

  const handleCardsChange = (updatedCards: DeckCardEntry[]) => {
    setCards(updatedCards)
    const validation = validateDuplicateCards(updatedCards)
    setDuplicateErrors(validation)
  }

  const scrollToError = () => {
    deckNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    deckNameRef.current?.focus()
  }

  const handleSave = async () => {
    setError('')
    setInvalidDeckName(false)

    if (!deckName.trim()) {
      setError('Deck name is required.')
      setInvalidDeckName(true)
      scrollToError()
      return
    }

    if (cards.some(c => !c.id)) {
      setError('All 20 card slots must be filled with valid card selections.')
      scrollToError()
      return
    }

    const validation = validateDuplicateCards(cards)
    setDuplicateErrors(validation)
    if (Object.keys(validation).length > 0) {
      setError('Some cards exceed the 2-copy limit. Please review highlighted slots.')
      return
    }

    setSaving(true)
    const { user, error: authError } = await getAuthenticatedUser()
    if (!user) {
      setError(authError || 'Not authenticated.')
      setSaving(false)
      return
    }

    const { error: deckError } = await client
      .from('decks')
      .update({ deck_name: deckName })
      .eq('id', deckId)
      .eq('user_id', user.id)

    if (deckError) {
      setError(deckError.message)
      setSaving(false)
      return
    }

    await client.from('deck_cards').delete().eq('deck_id', deckId)
    const deckCards = cards.map((card, index) => ({
      deck_id: deckId,
      card_id: card.id,
      card_index: index,
    }))
    const { error: insertError } = await client.from('deck_cards').insert(deckCards)
    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    router.push('/deck/list')
  }

  const handleCancel = () => router.push('/deck/list')

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <p>Loading deck...</p>
        </div>
      </div>
    )
  }

  const disableSave = saving || Object.keys(duplicateErrors).length > 0

  return (
    <div className={`${styles.page} ${styles.deckBuilderPage}`}>
      <div className={styles.card}>
        <h1 className={styles.header}>Edit Deck</h1>

        <label htmlFor="deckName" className={styles.label}>Deck Name</label>
        <input
          id="deckName"
          ref={deckNameRef}
          type="text"
          value={deckName}
          onChange={e => {
            setDeckName(e.target.value)
            if (invalidDeckName && e.target.value.trim()) setInvalidDeckName(false)
          }}
          placeholder="Deck Name"
          className={`${styles.input} ${styles.deckNameInput} ${invalidDeckName ? styles.inputInvalid : ''}`}
          autoComplete="off"
          disabled={saving}
        />
        <p className={styles.helperText}>Update your deck’s name or card list below.</p>

        <h2 className={styles.subheader}>Update Cards</h2>
        {error && <p className={styles.errorText}>{error}</p>}

        <DeckCardBuilder
          cards={cards}
          onCardsChange={handleCardsChange}
          disabled={saving}
          duplicateErrors={duplicateErrors}
        />
      </div>

      {/* Floating Save / Cancel buttons */}
      <div className={styles.floatingButtonBar}>
        <button
          type="button"
          onClick={handleSave}
          disabled={disableSave}
          aria-disabled={disableSave}
          className={`${buttonStyles.button} ${buttonStyles.primary} ${disableSave ? buttonStyles.disabled : ''}`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={saving}
          aria-disabled={saving}
          className={`${buttonStyles.button} ${buttonStyles.secondary} ${saving ? buttonStyles.disabled : ''}`}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
