import { useState, useEffect, useMemo, useCallback } from 'react'
import { getRequiredWins } from '../utils/tournament'

/**
 * Custom hook to manage dispute override state, set winner changes,
 * audit reasons, and validation rules according to Apple HIG sheet patterns.
 *
 * @param {Object|null} match - The match currently being overridden
 * @param {Object} tournament - Tournament context with rules and player list
 */
export function useMatchOverride(match, tournament) {
  const [setResults, setSetResults] = useState([])
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')

  const maxSets = tournament?.maxSetsPerMatch ?? 9
  const players = tournament?.players ?? []

  const winnerOptions = useMemo(() => {
    if (!match) return []
    return players.filter((player) => [match.playerAId, match.playerBId].includes(player.id))
  }, [match, players])

  const reset = useCallback(() => {
    if (!match) {
      setSetResults([])
      setReason('')
      setNote('')
      return
    }
    setSetResults(match.setResults ? match.setResults.map((set) => ({ winnerId: set.winnerId })) : [])
    setReason(match.overrideMeta?.reason || '')
    setNote(match.overrideMeta?.note || '')
  }, [match])

  useEffect(() => {
    reset()
  }, [reset])

  const currentScore = useMemo(() => {
    if (!match) return []
    return winnerOptions.map((player) => ({
      ...player,
      wins: (match.setResults || []).filter((set) => set.winnerId === player.id).length,
      confirmed: Boolean(match.confirmations?.[player.id]),
    }))
  }, [match, winnerOptions])

  const draftScore = useMemo(() => {
    return winnerOptions.map((player) => ({
      ...player,
      wins: setResults.filter((set) => set.winnerId === player.id).length,
    }))
  }, [winnerOptions, setResults])

  const requiredWins = useMemo(() => getRequiredWins(maxSets), [maxSets])
  const draftWinner = useMemo(() => draftScore.find((player) => player.wins >= requiredWins), [draftScore, requiredWins])
  const canAddSet = setResults.length < maxSets && !draftWinner

  const isDrawDraft = useMemo(() => {
    return (
      setResults.length === maxSets &&
      !draftWinner &&
      draftScore[0]?.wins === draftScore[1]?.wins
    )
  }, [setResults.length, maxSets, draftWinner, draftScore])

  const isDraftValid = useMemo(() => {
    return (
      isDrawDraft ||
      (Boolean(draftWinner) &&
        draftScore.filter((player) => player.wins >= requiredWins).length === 1)
    )
  }, [isDrawDraft, draftWinner, draftScore, requiredWins])

  const hasResultChanged = useMemo(() => {
    if (!match) return false
    const matchSets = match.setResults || []
    if (setResults.length !== matchSets.length) return true
    return setResults.some((set, index) => set.winnerId !== matchSets[index]?.winnerId)
  }, [match, setResults])

  const canSubmit = hasResultChanged && Boolean(reason)

  const updateSetWinner = useCallback((index, winnerId) => {
    setSetResults((prev) =>
      prev.map((set, setIndex) => (setIndex === index ? { winnerId } : set)),
    )
  }, [])

  const addSet = useCallback(() => {
    if (!canAddSet) return
    const defaultWinner = winnerOptions[0]?.id || ''
    setSetResults((prev) => [...prev, { winnerId: defaultWinner }])
  }, [canAddSet, winnerOptions])

  const removeSet = useCallback((index) => {
    setSetResults((prev) => prev.filter((_, setIndex) => setIndex !== index))
  }, [])

  return {
    setResults,
    setSetResults,
    reason,
    setReason,
    note,
    setNote,
    winnerOptions,
    currentScore,
    draftScore,
    draftWinner,
    canAddSet,
    isDrawDraft,
    isDraftValid,
    hasResultChanged,
    canSubmit,
    updateSetWinner,
    addSet,
    removeSet,
    reset,
  }
}
