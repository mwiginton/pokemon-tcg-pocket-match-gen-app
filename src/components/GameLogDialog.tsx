'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from '@/styles/layout.module.css'
import buttonStyles from '@/styles/button.module.css'
import {
  CheckCircle2,
  Clock3,
  Flag,
  NotebookPen,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  X,
  XCircle,
} from 'lucide-react'

export type GameResult = 'win' | 'loss'
export type MatchType = 'solo' | 'pvp'
export type PlayerOrder = 'first' | 'second'
export type SetupStatus = 'turn_2' | 'turn_3' | 'missed' | 'unknown'

export type GameLogDetails = {
  result: GameResult
  match_type: MatchType
  opponent_archetype: string | null
  player_order: PlayerOrder | null
  turns_played: number | null
  close_game: boolean
  setup_status: SetupStatus | null
  mvp_card: string | null
  notes: string | null
}

type GameLogDialogProps = {
  deckName: string
  result: GameResult
  defaultMatchType?: MatchType
  defaultOpponent?: string
  cardOptions?: string[]
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

const setupOptions: { value: SetupStatus; label: string }[] = [
  { value: 'turn_2', label: 'Turn 2' },
  { value: 'turn_3', label: 'Turn 3' },
  { value: 'missed', label: 'Missed' },
  { value: 'unknown', label: 'Unsure' },
]

const cleanText = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export default function GameLogDialog({
  deckName,
  result,
  defaultMatchType,
  defaultOpponent = '',
  cardOptions = [],
  isSaving = false,
  onClose,
  onSubmit,
}: GameLogDialogProps) {
  const [matchType, setMatchType] = useState<MatchType | null>(defaultMatchType ?? null)
  const [opponentArchetype, setOpponentArchetype] = useState(defaultOpponent)
  const [playerOrder, setPlayerOrder] = useState<PlayerOrder | null>(null)
  const [turnsPlayed, setTurnsPlayed] = useState('')
  const [closeGame, setCloseGame] = useState(false)
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null)
  const [mvpCard, setMvpCard] = useState('')
  const [notes, setNotes] = useState('')

  const uniqueCardOptions = useMemo(
    () => Array.from(new Set(cardOptions.filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [cardOptions],
  )

  useEffect(() => {
    setOpponentArchetype(defaultOpponent)
  }, [defaultOpponent])

  useEffect(() => {
    setMatchType(defaultMatchType ?? null)
  }, [defaultMatchType])

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
        opponent_archetype: null,
        player_order: null,
        turns_played: null,
        close_game: false,
        setup_status: null,
        mvp_card: null,
        notes: null,
      }
    }

    const parsedTurns = Number.parseInt(turnsPlayed, 10)

    return {
      result,
      match_type: selectedMatchType,
      opponent_archetype: cleanText(opponentArchetype),
      player_order: playerOrder,
      turns_played: Number.isFinite(parsedTurns) && parsedTurns > 0 ? parsedTurns : null,
      close_game: closeGame,
      setup_status: setupStatus,
      mvp_card: cleanText(mvpCard),
      notes: cleanText(notes),
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
  const disableSubmit = isSaving || !matchType

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
          {result === 'win' ? <Trophy size={18} /> : <XCircle size={18} />}
          <span>{result === 'win' ? 'Win' : 'Loss'}</span>
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

        <div className={styles.formGrid}>
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

          <label className={styles.fieldBlock}>
            <span className={styles.labelWithIcon}>
              <Clock3 size={16} />
              Turns played
            </span>
            <input
              className={styles.input}
              value={turnsPlayed}
              onChange={(event) => setTurnsPlayed(event.target.value)}
              min="1"
              max="60"
              inputMode="numeric"
              type="number"
              placeholder="Optional"
            />
          </label>
        </div>

        <datalist id="opponent-archetypes">
          {commonArchetypes.map((archetype) => (
            <option key={archetype} value={archetype} />
          ))}
        </datalist>

        <datalist id="deck-card-options">
          {uniqueCardOptions.map((card) => (
            <option key={card} value={card} />
          ))}
        </datalist>

        <div className={styles.formGrid}>
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

          <div className={styles.fieldBlock}>
            <span className={styles.labelWithIcon}>
              <CheckCircle2 size={16} />
              Setup online
            </span>
            <div className={styles.segmentedControl}>
              {setupOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.choiceButton} ${setupStatus === option.value ? styles.choiceButtonActive : ''}`}
                  onClick={() => setSetupStatus(setupStatus === option.value ? null : option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.formGrid}>
          <label className={styles.fieldBlock}>
            <span className={styles.labelWithIcon}>
              <Sparkles size={16} />
              MVP card
            </span>
            <input
              className={styles.input}
              value={mvpCard}
              onChange={(event) => setMvpCard(event.target.value)}
              list="deck-card-options"
              placeholder="Optional"
              autoComplete="off"
            />
          </label>

          <label className={`${styles.checkPanel} ${closeGame ? styles.checkPanelActive : ''}`}>
            <input
              type="checkbox"
              checked={closeGame}
              onChange={(event) => setCloseGame(event.target.checked)}
            />
            <span>
              <strong>Close game</strong>
              <small>Mark if it came down to the final turn or one key draw.</small>
            </span>
          </label>
        </div>

        <label className={styles.fieldBlock}>
          <span className={styles.labelWithIcon}>
            <NotebookPen size={16} />
            Short note
          </span>
          <textarea
            className={styles.textarea}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Bricked early, perfect curve, bad matchup, misplay, etc."
            rows={3}
          />
        </label>

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
