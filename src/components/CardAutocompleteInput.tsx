'use client'

import { useState, useEffect } from 'react'
import styles from '@/styles/layout.module.css'

type CardEntry = {
  id: string
  name: string
  pack?: string
}

type Props = {
  index: number
  value: CardEntry
  onChange: (newCard: CardEntry) => void
  disabled?: boolean
}

export default function CardAutocompleteInput({ index, value, onChange, disabled }: Props) {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<CardEntry[]>([])
  const [isValid, setIsValid] = useState(false)
  const [showError, setShowError] = useState(false)

  // keep input in sync with external value
  useEffect(() => {
    if (value?.id) {
      setInputValue(formatCardLabel(value))
      setIsValid(true)
    } else {
      setInputValue(value?.name || '')
      setIsValid(false)
    }
    setShowError(false)
  }, [value])

  const formatCardLabel = (card: CardEntry) => {
    return card.pack ? `${card.name} (${card.pack})` : card.name
  }

  const fetchSuggestions = async (query: string) => {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setSuggestions([])
      return
    }

    try {
      const response = await fetch(
        `/api/cardsuggestions?query=${encodeURIComponent(trimmedQuery)}`,
      )

      if (!response.ok) {
        setSuggestions([])
        return
      }

      const { data } = (await response.json()) as { data?: CardEntry[] }
      setSuggestions(data ?? [])
    } catch {
      setSuggestions([])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    setIsValid(false)
    setShowError(false)
    fetchSuggestions(val)
    onChange({ id: '', name: val }) // mark invalid until suggestion chosen
  }

  const handleSelect = (card: CardEntry) => {
    setInputValue(formatCardLabel(card)) // only show name + pack in input
    setSuggestions([])
    setIsValid(true)
    setShowError(false)
    onChange(card)
  }

  const handleBlur = () => {
    if (!isValid && inputValue.trim() !== '') {
      setShowError(true)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        id={`card-${index}`}
        type="text"
        value={inputValue}
        disabled={disabled}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className={`${styles.input} ${showError ? styles.inputInvalid : ''}`}
        placeholder="Search cards..."
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      {showError && (
        <p className={styles.errorText}>Please select a valid suggestion</p>
      )}
      {suggestions.length > 0 && (
        <ul className={styles.suggestionList}>
          {suggestions.map((card) => (
            <li
              key={card.id}
              className={styles.suggestion}
              onMouseDown={() => handleSelect(card)}
            >
              <div className={styles.suggestionRow}>
                <span className={styles.cardId}>[{card.id}]</span>
                <span className={styles.cardName}>{card.name}</span>
                {card.pack && (
                  <span className={styles.cardPack}>({card.pack})</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
