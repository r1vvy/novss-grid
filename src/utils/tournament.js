export function getPlayerById(players, id) {
  return players.find((player) => player.id === id)
}

export function getMatchPlayers(match, players) {
  return {
    playerA: getPlayerById(players, match.playerAId),
    playerB: getPlayerById(players, match.playerBId),
  }
}

export function getSetScore(match, playerId) {
  return match.setResults.filter((set) => set.winnerId === playerId).length
}

export function getOpponentId(match, playerId) {
  return match.playerAId === playerId ? match.playerBId : match.playerAId
}

export function getRequiredWins(maxSetsPerMatch) {
  return Math.floor(maxSetsPerMatch / 2) + 1
}

export function hasReachedTargetWins(match, playerId, maxSetsPerMatch = match.maxSetsPerMatch) {
  if (!Number.isFinite(maxSetsPerMatch)) return false

  return getSetScore(match, playerId) >= getRequiredWins(maxSetsPerMatch)
}

export function getMatchWinnerId(match, maxSetsPerMatch = match.maxSetsPerMatch) {
  if (hasReachedTargetWins(match, match.playerAId, maxSetsPerMatch)) return match.playerAId
  if (hasReachedTargetWins(match, match.playerBId, maxSetsPerMatch)) return match.playerBId
  return null
}

export function getOverrideAuditLabel(match) {
  if (!match.overrideMeta?.reason) return ''

  const labels = {
    referee_decision: 'Tiesneša lēmums',
    score_entry_error: 'Nepareizi ievadīts rezultāts',
    accidental_tap: 'Nejaušs pieskāriens',
    duplicate_entry: 'Dubulta ievade',
    manual_finish: 'Organizatora pabeigts',
    other: 'Cits iemesls',
  }

  return labels[match.overrideMeta.reason] || 'Organizatora labojums'
}

export function deriveMatchStatus(match, maxSetsPerMatch = match.maxSetsPerMatch) {
  if (match.refereeRequested || match.status === 'disputed') return 'disputed'
  if (match.status === 'investigating') return 'investigating'
  if (match.status === 'verified' || match.status === 'completed') return 'completed'
  if (getMatchWinnerId(match, maxSetsPerMatch) || isDrawMatch(match, maxSetsPerMatch)) {
    const confirmed = Object.values(match.confirmations || {}).filter(Boolean).length
    return confirmed >= 2 ? 'completed' : 'awaiting_confirmation'
  }
  if (match.setResults.length > 0) return 'in_progress'
  return match.status || 'scheduled'
}

export function appendSetResult(tournament, matchId, winnerId, actorPlayerId) {
  return updateMatch(tournament, matchId, (match) => {
    if (actorPlayerId && actorPlayerId !== match.playerAId) return match
    if (
      deriveMatchStatus(match, tournament.maxSetsPerMatch) === 'disputed'
      || getMatchWinnerId(match, tournament.maxSetsPerMatch)
      || isMatchAtSetLimit(match, tournament.maxSetsPerMatch)
    ) return match

    const nextSetResults = [
      ...match.setResults,
      { winnerId },
    ]
    const nextMatch = { ...match, setResults: nextSetResults, status: 'in_progress' }
    const winnerReachedTarget = hasReachedTargetWins(nextMatch, winnerId, tournament.maxSetsPerMatch)
    const drawReachedLimit = isDrawMatch(nextMatch, tournament.maxSetsPerMatch)

    return {
      ...nextMatch,
      confirmations: resetConfirmations(match),
      status: winnerReachedTarget || drawReachedLimit ? 'awaiting_confirmation' : 'in_progress',
    }
  })
}

export function removeSetResult(tournament, matchId, winnerId, actorPlayerId) {
  return updateMatch(tournament, matchId, (match) => {
    if (actorPlayerId && actorPlayerId !== match.playerAId) return match
    if (deriveMatchStatus(match, tournament.maxSetsPerMatch) === 'disputed') return match

    const resultIndex = match.setResults.map((set) => set.winnerId).lastIndexOf(winnerId)
    if (resultIndex === -1) return match

    const nextSetResults = match.setResults.filter((_, index) => index !== resultIndex)
    const nextMatch = {
      ...match,
      setResults: nextSetResults,
      confirmations: resetConfirmations(match),
      status: nextSetResults.length > 0 ? 'in_progress' : 'scheduled',
    }

    return {
      ...nextMatch,
      status: deriveMatchStatus(nextMatch, tournament.maxSetsPerMatch),
    }
  })
}

export function confirmFinalScore(tournament, matchId, playerId) {
  return updateMatch(tournament, matchId, (match) => {
    if (
      (!getMatchWinnerId(match, tournament.maxSetsPerMatch) && !isDrawMatch(match, tournament.maxSetsPerMatch))
      || deriveMatchStatus(match, tournament.maxSetsPerMatch) === 'disputed'
    ) return match

    const confirmations = { ...match.confirmations, [playerId]: true }
    const fullyConfirmed = match.playerAId in confirmations
      && match.playerBId in confirmations
      && confirmations[match.playerAId]
      && confirmations[match.playerBId]

    return {
      ...match,
      confirmations,
      status: fullyConfirmed ? 'completed' : 'awaiting_confirmation',
    }
  })
}

export function requestReferee(tournament, matchId) {
  return updateMatch(tournament, matchId, (match) => ({
    ...match,
    refereeRequested: true,
    status: 'disputed',
  }))
}

export function clearRefereeRequest(tournament, matchId) {
  return updateMatch(tournament, matchId, (match) => {
    const restored = {
      ...match,
      refereeRequested: false,
      status: match.setResults.length > 0 ? 'in_progress' : 'scheduled',
    }
    return {
      ...restored,
      status: deriveMatchStatus(restored, tournament.maxSetsPerMatch),
    }
  })
}

export function markMatchInvestigating(tournament, matchId) {
  return updateMatch(tournament, matchId, (match) => ({
    ...match,
    refereeRequested: false,
    status: 'investigating',
  }))
}

export function resetMatchInvestigation(tournament, matchId) {
  return updateMatch(tournament, matchId, (match) => {
    const restored = {
      ...match,
      refereeRequested: false,
      status: match.setResults.length > 0 ? 'in_progress' : 'scheduled',
    }

    return {
      ...restored,
      status: deriveMatchStatus(restored, tournament.maxSetsPerMatch),
    }
  })
}

export function forceOverrideResult(tournament, matchId, setResults, metadata = {}) {
  return updateMatch(tournament, matchId, (match) => {
    const allowedWinnerIds = new Set([match.playerAId, match.playerBId])
    const nextSetResults = Array.isArray(setResults)
      ? setResults
        .filter((set) => allowedWinnerIds.has(set?.winnerId))
        .slice(0, tournament.maxSetsPerMatch)
        .map((set) => ({ winnerId: set.winnerId }))
      : []

    const draftMatch = { ...match, setResults: nextSetResults }
    const winnerId = getMatchWinnerId(draftMatch, tournament.maxSetsPerMatch)
    const isDraw = nextSetResults.length === tournament.maxSetsPerMatch
      && !winnerId
      && getSetScore(draftMatch, match.playerAId) === getSetScore(draftMatch, match.playerBId)
    if (!winnerId && !isDraw) return match

    return buildOverriddenMatch(match, nextSetResults, metadata, tournament.maxSetsPerMatch)
  })
}

export function swapMatchTables(tournament, sourceMatchId, targetMatchId) {
  if (sourceMatchId === targetMatchId) return tournament

  const sourceMatch = tournament.matches.find((match) => match.id === sourceMatchId)
  const targetMatch = tournament.matches.find((match) => match.id === targetMatchId)

  if (!sourceMatch || !targetMatch) return tournament
  if (sourceMatch.round !== tournament.currentRound || targetMatch.round !== tournament.currentRound) return tournament

  return {
    ...tournament,
    matches: tournament.matches.map((match) => {
      if (match.id === sourceMatchId) return { ...match, table: targetMatch.table }
      if (match.id === targetMatchId) return { ...match, table: sourceMatch.table }
      return match
    }),
  }
}

export function checkInPlayerByCode(tournament, registrationCode) {
  const normalizedCode = registrationCode.trim().toUpperCase()
  let checkedInPlayer = null

  const players = tournament.players.map((player) => {
    if (player.registrationCode.toUpperCase() !== normalizedCode) return player
    checkedInPlayer = { ...player, status: 'checked_in' }
    return checkedInPlayer
  })

  if (!checkedInPlayer) {
    return { tournament, player: null }
  }

  return {
    tournament: { ...tournament, players },
    player: checkedInPlayer,
  }
}

export function updatePlayer(tournament, playerId, updates) {
  return {
    ...tournament,
    players: tournament.players.map((player) => {
      if (player.id !== playerId) return player

      return {
        ...player,
        ...updates,
        rating: updates.rating === '' || updates.rating == null ? null : Number(updates.rating),
        gender: updates.gender || '',
        registrationCode: updates.registrationCode ? updates.registrationCode.trim().toUpperCase() : player.registrationCode,
      }
    }),
  }
}

export function calculateStandings(tournament) {
  return tournament.players
    .map((player) => {
      const completedMatches = tournament.matches.filter(
        (match) =>
          deriveMatchStatus(match) === 'completed'
          && (match.playerAId === player.id || match.playerBId === player.id),
      )
      const points = completedMatches.reduce((total, match) => {
        const score = getSetScore(match, player.id)
        const opponentScore = getSetScore(match, getOpponentId(match, player.id))
        if (score === opponentScore) return total + tournament.pointAllocation.draw
        const won = score > opponentScore
        const closeWin = won && Math.abs(score - opponentScore) === 1
        if (won) return total + (closeWin ? tournament.pointAllocation.closeWin : tournament.pointAllocation.win)
        return total + tournament.pointAllocation.loss
      }, 0)

      return {
        ...player,
        played: completedMatches.length,
        points,
        buchholz: calculateBuchholz(player.id, tournament),
      }
    })
    .sort(sortByStanding)
}

export function calculateBuchholz(playerId, tournament) {
  const opponents = tournament.matches
    .filter(
      (match) =>
        deriveMatchStatus(match) === 'completed'
        && (match.playerAId === playerId || match.playerBId === playerId),
    )
    .map((match) => getOpponentId(match, playerId))

  return opponents.reduce((sum, opponentId) => {
    const opponentMatches = tournament.matches.filter(
      (match) =>
        deriveMatchStatus(match) === 'completed'
        && (match.playerAId === opponentId || match.playerBId === opponentId),
    )
    return sum + opponentMatches.length
  }, 0)
}

export function canGenerateNextRound(tournament) {
  const currentMatches = getCurrentRoundMatches(tournament)
  return currentMatches.length > 0 && currentMatches.every((match) => deriveMatchStatus(match) === 'completed')
}

export function generateNextSwissRound(tournament) {
  if (!canGenerateNextRound(tournament)) return tournament

  const standings = calculateStandings(tournament)
  const pairedIds = new Set()
  const newRound = tournament.currentRound + 1
  const pairings = []

  standings.forEach((player) => {
    if (pairedIds.has(player.id)) return
    const opponent = standings.find(
      (candidate) =>
        candidate.id !== player.id
        && !pairedIds.has(candidate.id)
        && !havePlayed(player.id, candidate.id, tournament),
    ) || standings.find((candidate) => candidate.id !== player.id && !pairedIds.has(candidate.id))

    if (!opponent) return
    pairedIds.add(player.id)
    pairedIds.add(opponent.id)
    pairings.push([player.id, opponent.id])
  })

  const matches = pairings.map(([playerAId, playerBId], index) => ({
    id: `r${newRound}-m${index + 1}`,
    table: index + 1,
    round: newRound,
    status: 'scheduled',
    playerAId,
    playerBId,
    setResults: [],
    confirmations: {
      [playerAId]: false,
      [playerBId]: false,
    },
    refereeRequested: false,
  }))

  return {
    ...tournament,
    currentRound: newRound,
    matches: [...tournament.matches, ...matches],
  }
}

export function getCurrentRoundMatches(tournament) {
  return tournament.matches.filter((match) => match.round === tournament.currentRound)
}

export function createRegistrationTournament(config) {
  return {
    id: `novuss-${Date.now()}`,
    name: config.name,
    venue: 'Setup desk',
    status: 'registration',
    currentRound: 0,
    totalRounds: 7,
    maxSetsPerMatch: Number(config.maxSetsPerMatch),
    pointAllocation: {
      win: Number(config.win),
      draw: Number(config.draw),
      closeWin: Number(config.closeWin),
      loss: Number(config.loss),
    },
    updatedAt: 'Configured locally',
    players: [],
    matches: [],
  }
}

function updateMatch(tournament, matchId, updater) {
  return {
    ...tournament,
    matches: tournament.matches.map((match) => (match.id === matchId ? updater(match) : match)),
  }
}

function resetConfirmations(match) {
  return {
    [match.playerAId]: false,
    [match.playerBId]: false,
  }
}

function isMatchAtSetLimit(match, maxSetsPerMatch) {
  return match.setResults.length >= maxSetsPerMatch
}

function isDrawMatch(match, maxSetsPerMatch = match.maxSetsPerMatch) {
  if (!Number.isFinite(maxSetsPerMatch)) return false

  return isMatchAtSetLimit(match, maxSetsPerMatch)
    && getSetScore(match, match.playerAId) === getSetScore(match, match.playerBId)
}

function buildOverriddenMatch(match, setResults, metadata, maxSetsPerMatch = match.maxSetsPerMatch) {
  const previousWinnerId = getMatchWinnerId(match, maxSetsPerMatch)
  const previousStatus = deriveMatchStatus(match, maxSetsPerMatch)

  return {
    ...match,
    setResults,
    confirmations: {
      [match.playerAId]: true,
      [match.playerBId]: true,
    },
    refereeRequested: false,
    status: 'completed',
    overrideMeta: {
      editedBy: metadata.editedBy || 'Organizators',
      reason: metadata.reason || 'other',
      note: metadata.note?.trim() || '',
      previousWinnerId,
      previousStatus,
      previousScore: {
        [match.playerAId]: getSetScore(match, match.playerAId),
        [match.playerBId]: getSetScore(match, match.playerBId),
      },
      editedAt: metadata.editedAt || 'Tikko',
    },
  }
}

function havePlayed(playerAId, playerBId, tournament) {
  return tournament.matches.some(
    (match) =>
      (match.playerAId === playerAId && match.playerBId === playerBId)
      || (match.playerAId === playerBId && match.playerBId === playerAId),
  )
}

function sortByStanding(a, b) {
  if (b.points !== a.points) return b.points - a.points
  if (b.buchholz !== a.buchholz) return b.buchholz - a.buchholz
  return a.name.localeCompare(b.name)
}
