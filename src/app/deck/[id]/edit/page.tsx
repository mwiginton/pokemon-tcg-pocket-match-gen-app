'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import styles from '@/styles/layout.module.css'
import buttonStyles from '@/styles/button.module.css'
import CardAutocompleteInput from '@/components/CardAutocompleteInput'

type CardEntry = {
  id: string
  name: string
  pack?: string
}

export default function EditDeckPage() {
  const router = useRouter()
  const params = useParams()
  const deckId = params?.id as string

  const [deckName, setDeckName] = useState('')
  const [cards, setCards] = useState<CardEntry[]>(Array(20).fill({ id: '', name: '' }))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [invalidDeckName, setInvalidDeckName] = useState(false)
  const deckNameRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const fetchDeck = async () => {
      setLoading(true)
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (!user) {
        router.push('/')
        return
      }

      const { data: deckData, error: deckError } = await supabase
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

      // ✅ Fetch card name and pack for display
      const { data: deckCards, error: cardsError } = await supabase
        .from('deck_cards')
        .select('card_id, cards(name, pack)')
        .eq('deck_id', deckId)
        .order('card_index', { ascending: true })

      if (cardsError) {
        setError(cardsError.message)
        setLoading(false)
        return
      }

      const formattedCards = deckCards.map((c: any) => ({
        id: c.card_id,
        name: c.cards?.name || '',
        pack: c.cards?.pack || '',
      }))

      // ensure array length = 20
      setCards([
        ...formattedCards,
        ...Array(Math.max(0, 20 - formattedCards.length)).fill({ id: '', name: '' }),
      ])
      setLoading(false)
    }

    fetchDeck()
  }, [deckId, router])

  const handleCardSlotChange = (index: number, newCard: CardEntry) => {
    const updatedCards = [...cards]
    updatedCards[index] = newCard
    setCards(updatedCards)
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
      return
    }

    setSaving(true)
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) {
      setError('Not authenticated.')
      setSaving(false)
      return
    }

    const { error: deckError } = await supabase
      .from('decks')
      .update({ deck_name: deckName })
      .eq('id', deckId)
      .eq('user_id', user.id)

    if (deckError) {
      setError(deckError.message)
      setSaving(false)
      return
    }

    // Replace deck_cards
    await supabase.from('deck_cards').delete().eq('deck_id', deckId)
    const deckCards = cards.map((card, index) => ({
      deck_id: deckId,
      card_id: card.id,
      card_index: index,
    }))
    const { error: insertError } = await supabase.from('deck_cards').insert(deckCards)
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

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.header}>Edit Deck</h1>
        {error && <p className={styles.errorText}>{error}</p>}

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
        <div className={styles.cardGroup}>
          {cards.map((card, index) => (
            <div key={index} className={styles.cardInputRow}>
              <label className={styles.label}>Card {index + 1}</label>
              <CardAutocompleteInput
                index={index}
                value={card}
                onChange={(newCard) => handleCardSlotChange(index, newCard)}
                disabled={saving}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Save / Cancel buttons */}
      <div className={styles.floatingButtonBar}>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          aria-disabled={saving}
          className={`${buttonStyles.button} ${buttonStyles.primary} ${saving ? buttonStyles.disabled : ''}`}
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
