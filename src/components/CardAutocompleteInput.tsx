'use client'

import { useEffect, useRef, useState } from 'react'
import styles from '@/styles/layout.module.css'

type Card = {
  id: string
  name: string
}

type Props = {
  value: Card
  onChange: (card: Card) => void
  index: number
}

export default function CardAutocompleteInput({ value, onChange, index }: Props) {
  const [input, setInput] = useState(value.name)
  const [suggestions, setSuggestions] = useState<Card[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const justSelectedRef = useRef(false)

  useEffect(() => {
    if (justSelectedRef.current) {
      justSelectedRef.current = false
      return
    }

    const fetchSuggestions = async () => {
        if (input.trim().length < 2) {
            setSuggestions([])
            setShowSuggestions(false)
            return
        }

        const { data, error } = await fetch(`/api/cardsuggestions?query=${input}`).then(res =>
            res.json()
        )

        if (!error && data) {
            setSuggestions(data)
            setShowSuggestions(true)
        }
    }

    const debounce = setTimeout(fetchSuggestions, 200)
    return () => clearTimeout(debounce)
  }, [input])

  const handleSelect = (card: Card) => {
    justSelectedRef.current = true
    onChange(card)
    setInput(card.name)
    setShowSuggestions(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={input}
        placeholder={`Card ${index + 1}`}
        onChange={e => {
          setInput(e.target.value)
          onChange({ id: '', name: e.target.value }) // reset selection
        }}
        className={styles.input}
        onFocus={() => setShowSuggestions(true)}
        onBlur={(e) => {
          const relatedTarget = e.relatedTarget as HTMLElement | null
          const isClickInsideList = relatedTarget?.dataset?.suggestion === 'true'
          if (!isClickInsideList) {
            setShowSuggestions(false)
          }
        }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            background: '#fff',
            zIndex: 10,
            border: '1px solid #ccc',
            width: '100%',
            maxHeight: 160,
            overflowY: 'auto',
          }}
        >
          {suggestions.map(card => (
            <li
              key={card.id}
              onMouseDown={() => handleSelect(card)}
              data-suggestion="true"
              tabIndex={-1}
              style={{ padding: 8, cursor: 'pointer' }}
            >
              {card.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
