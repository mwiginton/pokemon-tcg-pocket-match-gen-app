'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from '@/styles/layout.module.css'
import buttonStyles from '@/styles/button.module.css'
import {
  CircleEqual,
  Flag,
  Gauge,
  Shield,
  Swords,
  Trophy,
  X,
  XCircle,
} from 'lucide-react'

export type GameResult = 'win' | 'loss' | 'tie'
export type MatchType = 'solo' | 'pvp'
export type PlayerOrder = 'first' | 'second'

export type GameLogDetails = {
  result: GameResult
  match_type: MatchType
  solo_difficulty: string | null
  opponent_archetype: string | null
  player_order: PlayerOrder | null
}

type GameLogDialogProps = {
  deckName: string
  result: GameResult
  defaultMatchType?: MatchType
  defaultSoloDifficulty?: string
  defaultOpponent?: string
  soloDifficultyOptions?: string[]
  isSaving?: boolean
  onClose: () => void
  onSubmit: (details: GameLogDetails) => Promise<void> | void
}

const commonArchetypes = [
  'Pikachu ex',
  'Mewtwo ex',
  'Charizard ex',
  'Starmie ex',
  'Articuno ex',
  'Marowak ex',
  'Dragonite',
  'Blaine',
  'Koga',
  'Aggro',
  'Control',
  'Energy ramp',
]

const defaultDifficultyOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

const sortDifficultyLabel = (a: string, b: string) => {
  const aIndex = defaultDifficultyOptions.indexOf(a)
  const bIndex = defaultDifficultyOptions.indexOf(b)
  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
  if (aIndex !== -1) return -1
  if (bIndex !== -1) return 1
  return a.localeCompare(b)
}

const cleanText = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const resultMeta = {
  win: { label: 'Win', icon: Trophy },
  loss: { label: 'Loss', icon: XCircle },
  tie: { label: 'Tie', icon: CircleEqual },
} satisfies Record<GameResult, { label: string; icon: typeof Trophy }>

export default function GameLogDialog({
  deckName,
  result,
  defaultMatchType,
  defaultSoloDifficulty = '',
  defaultOpponent = '',
  soloDifficultyOptions = defaultDifficultyOptions,
  isSaving = false,
  onClose,
  onSubmit,
}: GameLogDialogProps) {
  const ResultIcon = resultMeta[result].icon
  const [matchType, setMatchType] = useState<MatchType | null>(defaultMatchType ?? null)
  const [soloDifficulty, setSoloDifficulty] = useState(defaultSoloDifficulty)
  const [opponentArchetype, setOpponentArchetype] = useState(defaultOpponent)
  const [playerOrder, setPlayerOrder] = useState<PlayerOrder | null>(null)

  const uniqueDifficultyOptions = useMemo(
    () =>
      Array.from(new Set([...soloDifficultyOptions, defaultSoloDifficulty].filter(Boolean))).sort(
        sortDifficultyLabel,
      ),
    [defaultSoloDifficulty, soloDifficultyOptions],
  )

  useEffect(() => {
    setOpponentArchetype(defaultOpponent)
  }, [defaultOpponent])

  useEffect(() => {
    setMatchType(defaultMatchType ?? null)
  }, [defaultMatchType])

  useEffect(() => {
    setSoloDifficulty(defaultSoloDifficulty)
  }, [defaultSoloDifficulty])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const buildPayload = (includeDetails: boolean, selectedMatchType: MatchType): GameLogDetails => {
    if (!includeDetails) {
      return {
        result,
        match_type: selectedMatchType,
        solo_difficulty: selectedMatchType === 'solo' ? cleanText(soloDifficulty) : null,
        opponent_archetype: null,
        player_order: null,
      }
    }

    return {
      result,
      match_type: selectedMatchType,
      solo_difficulty: selectedMatchType === 'solo' ? cleanText(soloDifficulty) : null,
      opponent_archetype: cleanText(opponentArchetype),
      player_order: playerOrder,
    }
  }

  const submitDetails = () => {
    if (!matchType) return
    onSubmit(buildPayload(true, matchType))
  }
  const submitBasicResult = () => {
    if (!matchType) return
    onSubmit(buildPayload(false, matchType))
  }
  const disableSubmit = isSaving || !matchType || (matchType === 'solo' && !cleanText(soloDifficulty))

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalDialog} ${styles.modalDialogWide}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.panelKicker}>Log match</p>
            <h2 className={styles.headerText}>{deckName}</h2>
          </div>
          <button
            type="button"
            className={styles.iconOnlyButton}
            onClick={onClose}
            aria-label="Close match logger"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.resultSummary}>
          <ResultIcon size={18} />
          <span>{resultMeta[result].label}</span>
        </div>

        <div className={styles.fieldBlock}>
          <span className={styles.labelWithIcon}>
            <Shield size={16} />
            Match type
            <span className={styles.requiredText}>Required</span>
          </span>
          <div className={styles.segmentedControl} role="radiogroup" aria-label="Match type">
            <button
              type="button"
              role="radio"
              aria-checked={matchType === 'solo'}
              className={`${styles.choiceButton} ${matchType === 'solo' ? styles.choiceButtonActive : ''}`}
              onClick={() => setMatchType('solo')}
            >
              Solo
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={matchType === 'pvp'}
              className={`${styles.choiceButton} ${matchType === 'pvp' ? styles.choiceButtonActive : ''}`}
              onClick={() => setMatchType('pvp')}
            >
              PvP
            </button>
          </div>
        </div>

        {matchType === 'solo' && (
          <div className={styles.fieldBlock}>
            <span className={styles.labelWithIcon}>
              <Gauge size={16} />
              Difficulty
              <span className={styles.requiredText}>Required for solo</span>
            </span>
            <div className={styles.segmentedControl} role="radiogroup" aria-label="Solo difficulty">
              {uniqueDifficultyOptions.map((difficulty) => (
                <button
                  key={difficulty}
                  type="button"
                  role="radio"
                  aria-checked={soloDifficulty === difficulty}
                  className={`${styles.choiceButton} ${
                    soloDifficulty === difficulty ? styles.choiceButtonActive : ''
                  }`}
                  onClick={() => setSoloDifficulty(difficulty)}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        )}

        <label className={styles.fieldBlock}>
          <span className={styles.labelWithIcon}>
            <Swords size={16} />
            Opponent archetype
          </span>
          <input
            className={styles.input}
            value={opponentArchetype}
            onChange={(event) => setOpponentArchetype(event.target.value)}
            list="opponent-archetypes"
            placeholder="e.g. Mewtwo ex, Blaine, aggro"
            autoComplete="off"
          />
        </label>

        <datalist id="opponent-archetypes">
          {commonArchetypes.map((archetype) => (
            <option key={archetype} value={archetype} />
          ))}
        </datalist>

        <div className={styles.fieldBlock}>
          <span className={styles.labelWithIcon}>
            <Flag size={16} />
            Went
          </span>
          <div className={styles.segmentedControl}>
            <button
              type="button"
              className={`${styles.choiceButton} ${playerOrder === 'first' ? styles.choiceButtonActive : ''}`}
              onClick={() => setPlayerOrder(playerOrder === 'first' ? null : 'first')}
            >
              First
            </button>
            <button
              type="button"
              className={`${styles.choiceButton} ${playerOrder === 'second' ? styles.choiceButtonActive : ''}`}
              onClick={() => setPlayerOrder(playerOrder === 'second' ? null : 'second')}
            >
              Second
            </button>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={submitBasicResult}
            className={buttonStyles.button}
            disabled={disableSubmit}
          >
            Save result only
          </button>
          <button
            type="button"
            onClick={submitDetails}
            className={`${buttonStyles.button} ${buttonStyles.primary}`}
            disabled={disableSubmit}
          >
            {isSaving ? 'Saving...' : 'Save match'}
          </button>
        </div>
      </div>
    </div>
  )
}
