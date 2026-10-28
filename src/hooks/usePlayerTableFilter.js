import { useState, useMemo, useCallback } from 'react'

const emptyDraft = {
  name: '',
  representation: '',
  rating: '',
  gender: '',
  registrationCode: '',
  status: 'checked_in',
}

/**
 * Custom hook to manage player table search filtering, code mask visibility,
 * and inline editing drafts.
 *
 * @param {Array} players - List of players in the tournament
 */
export function usePlayerTableFilter(players = []) {
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [visibleCodes, setVisibleCodes] = useState({})
  const [draft, setDraft] = useState(emptyDraft)

  const filteredPlayers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return players
    return players.filter((player) =>
      player.name.toLowerCase().includes(q) ||
      (player.representation && player.representation.toLowerCase().includes(q))
    )
  }, [players, searchQuery])

  const toggleCode = useCallback((playerId) => {
    setVisibleCodes((current) => ({ ...current, [playerId]: !current[playerId] }))
  }, [])

  const startEditing = useCallback((player) => {
    setEditingId(player.id)
    setDraft({
      name: player.name,
      representation: player.representation || '',
      rating: player.rating ?? '',
      gender: player.gender || '',
      registrationCode: player.registrationCode,
      status: player.status,
    })
  }, [])

  const cancelEditing = useCallback(() => {
    setEditingId(null)
    setDraft(emptyDraft)
  }, [])

  const updateDraft = useCallback((field, value) => {
    setDraft((current) => ({ ...current, [field]: value }))
  }, [])

  return {
    searchQuery,
    setSearchQuery,
    filteredPlayers,
    visibleCodes,
    toggleCode,
    editingId,
    draft,
    startEditing,
    cancelEditing,
    updateDraft,
  }
}
