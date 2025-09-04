'use client'

import { useEffect, useState, useRef } from 'react'
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
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (input.trim().length < 2) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      const res = await fetch(`/api/cardsuggestions?query=${input}`)
      const { data } = await res.json()
      setSuggestions(data || [])
    }

    fetchSuggestions()
  }, [input])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <input
        type="text"
        value={input}
        placeholder={`Card ${index + 1}`}
        onChange={e => {
          const val = e.target.value
          setInput(val)
          onChange({ id: '', name: val }) // clear selection on edit
          setShowSuggestions(true)
        }}
        onFocus={() => {
          setIsFocused(true)
          if (suggestions.length > 0) setShowSuggestions(true)
        }}
        onBlur={() => setIsFocused(false)} // optional — for cleaner interaction
        className={styles.input}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            zIndex: 999,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: 4,
            width: '100%',
            maxHeight: 200,
            overflowY: 'auto',
            listStyle: 'none',
            padding: 0,
            marginTop: 4,
          }}
        >
          {suggestions.map((card) => (
            <li
              key={card.id}
              onMouseDown={() => {
                onChange(card)
                setInput(card.name)
                setShowSuggestions(false)
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
              }}
            >
              {card.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
