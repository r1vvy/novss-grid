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

export function recordAuditEntry(match, entry) {
  const timestamp = entry.timestamp || new Date().toLocaleTimeString('lv-LV', { hour: '2-digit', minute: '2-digit' })
  const auditEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp,
    ...entry,
  }
  return [...(match.auditTrail || []), auditEntry]
}

export function getAuditActorName(actor, players = []) {
  if (!actor || actor === 'organizer' || actor === 'Organizators') return 'Organizators'
  const player = players.find((p) => p.id === actor)
  return player ? player.name : actor
}

export function getMatchPerfectPlays(match, playerId) {
  if (!match) return 0
  const completedCount = (match.setResults || []).reduce((sum, set) => {
    return sum + (Number(set?.perfectPlays?.[playerId]) || 0)
  }, 0)
  const currentCount = Number(match.currentSetPerfectPlays?.[playerId]) || 0
  return completedCount + currentCount
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
    player_warning: 'Brīdinājums spēlētājam',
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

    const currentPerfectPlays = match.currentSetPerfectPlays || {
      [match.playerAId]: 0,
      [match.playerBId]: 0,
    }

    const nextSetResults = [
      ...match.setResults,
      {
        winnerId,
        perfectPlays: {
          [match.playerAId]: Number(currentPerfectPlays[match.playerAId]) || 0,
          [match.playerBId]: Number(currentPerfectPlays[match.playerBId]) || 0,
        },
      },
    ]

    const nextMatch = {
      ...match,
      setResults: nextSetResults,
      currentSetPerfectPlays: {
        [match.playerAId]: 0,
        [match.playerBId]: 0,
      },
      status: 'in_progress',
    }

    const scoreA = getSetScore(nextMatch, match.playerAId)
    const scoreB = getSetScore(nextMatch, match.playerBId)
    const auditTrail = recordAuditEntry(match, {
      actor: actorPlayerId || match.playerAId,
      actorRole: 'player',
      type: 'set_added',
      message: `Reģistrēts uzvarēts sets (${scoreA} : ${scoreB})`,
      addedTo: [{ playerId: winnerId, count: 1 }],
      takenFrom: [],
      details: { winnerId, addedTo: winnerId, scoreA, scoreB },
    })

    const winnerReachedTarget = hasReachedTargetWins(nextMatch, winnerId, tournament.maxSetsPerMatch)
    const drawReachedLimit = isDrawMatch(nextMatch, tournament.maxSetsPerMatch)

    return {
      ...nextMatch,
      auditTrail,
      confirmations: resetConfirmations(match),
      status: winnerReachedTarget || drawReachedLimit ? 'awaiting_confirmation' : 'in_progress',
    }
  })
}

export function adjustCurrentSetPerfectPlays(tournament, matchId, playerId, delta, actorPlayerId) {
  return updateMatch(tournament, matchId, (match) => {
    if (actorPlayerId && actorPlayerId !== match.playerAId) return match
    const status = deriveMatchStatus(match, tournament.maxSetsPerMatch)
    if (status === 'disputed' || status === 'completed') return match

    const current = match.currentSetPerfectPlays || {
      [match.playerAId]: 0,
      [match.playerBId]: 0,
    }
    const currentVal = Number(current[playerId]) || 0

    if (delta < 0) {
      let remaining = Math.abs(delta)
      let nextCurrent = { ...current }
      let nextSetResults = [...(match.setResults || [])]
      let changed = false

      if (currentVal > 0) {
        const dec = Math.min(currentVal, remaining)
        nextCurrent[playerId] = currentVal - dec
        remaining -= dec
        changed = true
      }

      if (remaining > 0) {
        for (let i = nextSetResults.length - 1; i >= 0 && remaining > 0; i--) {
          const setPerfect = Number(nextSetResults[i]?.perfectPlays?.[playerId]) || 0
          if (setPerfect > 0) {
            const dec = Math.min(setPerfect, remaining)
            nextSetResults[i] = {
              ...nextSetResults[i],
              perfectPlays: {
                ...nextSetResults[i].perfectPlays,
                [playerId]: setPerfect - dec,
              },
            }
            remaining -= dec
            changed = true
          }
        }
      }

      if (!changed) return match

      const nextMatch = {
        ...match,
        currentSetPerfectPlays: nextCurrent,
        setResults: nextSetResults,
      }

      const auditTrail = recordAuditEntry(match, {
        actor: actorPlayerId || playerId,
        actorRole: 'player',
        type: 'perfect_play_removed',
        message: 'Noņemts ideālais gājiens',
        details: { targetPlayerId: playerId, count: getMatchPerfectPlays(nextMatch, playerId) },
      })

      return {
        ...nextMatch,
        auditTrail,
      }
    }

    const nextVal = currentVal + delta
    const nextCurrent = {
      ...current,
      [playerId]: nextVal,
    }
    const nextMatch = {
      ...match,
      currentSetPerfectPlays: nextCurrent,
    }

    const auditTrail = recordAuditEntry(match, {
      actor: actorPlayerId || playerId,
      actorRole: 'player',
      type: 'perfect_play_added',
      message: 'Pievienots ideālais gājiens (★)',
      details: { targetPlayerId: playerId, count: getMatchPerfectPlays(nextMatch, playerId) },
    })

    return {
      ...nextMatch,
      auditTrail,
    }
  })
}

export function confirmPlayerArrival(tournament, matchId, playerId) {
  return updateMatch(tournament, matchId, (match) => {
    const arrivals = {
      ...(match.arrivals || { [match.playerAId]: false, [match.playerBId]: false }),
      [playerId]: true,
    }
    const auditTrail = recordAuditEntry(match, {
      actor: playerId,
      actorRole: 'player',
      type: 'player_arrival',
      message: 'Reģistrēta ierašanās pie galda',
      details: { playerId },
    })
    return {
      ...match,
      arrivals,
      auditTrail,
    }
  })
}

export function startMatchReady(tournament, matchId, playerId) {
  return updateMatch(tournament, matchId, (match) => {
    const ready = {
      ...(match.ready || { [match.playerAId]: false, [match.playerBId]: false }),
      [playerId]: true,
    }
    const auditTrail = recordAuditEntry(match, {
      actor: playerId,
      actorRole: 'player',
      type: 'player_ready',
      message: 'Spēlētājs gatavs spēlei',
      details: { playerId },
    })
    return {
      ...match,
      ready,
      status: 'in_progress',
      auditTrail,
    }
  })
}

export function contestFinalScore(tournament, matchId, playerId, reason = 'Rezultāts apstrīdēts') {
  return updateMatch(tournament, matchId, (match) => {
    const auditTrail = recordAuditEntry(match, {
      actor: playerId,
      actorRole: 'player',
      type: 'score_contested',
      message: `Rezultāts apstrīdēts: ${reason || 'Nav norādīts'}`,
      details: { playerId, reason },
    })
    return {
      ...match,
      refereeRequested: true,
      refereeRequestedBy: playerId,
      status: 'disputed',
      contestMeta: {
        contestedBy: playerId,
        reason,
        contestedAt: new Date().toLocaleTimeString('lv-LV', { hour: '2-digit', minute: '2-digit' }),
      },
      confirmations: resetConfirmations(match),
      auditTrail,
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

    const scoreA = getSetScore(nextMatch, match.playerAId)
    const scoreB = getSetScore(nextMatch, match.playerBId)
    const auditTrail = recordAuditEntry(match, {
      actor: actorPlayerId || match.playerAId,
      actorRole: 'player',
      type: 'set_removed',
      message: `Noņemts uzvarēts sets (${scoreA} : ${scoreB})`,
      addedTo: [],
      takenFrom: [{ playerId: winnerId, count: 1 }],
      details: { winnerId, takenFrom: winnerId, scoreA, scoreB },
    })

    return {
      ...nextMatch,
      auditTrail,
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

    const auditTrail = recordAuditEntry(match, {
      actor: playerId,
      actorRole: 'player',
      type: 'score_confirmed',
      message: fullyConfirmed ? 'Rezultāts pilnībā apstiprināts no abiem spēlētājiem' : 'Spēlētājs apstiprināja gala rezultātu',
      details: { playerId, fullyConfirmed },
    })

    return {
      ...match,
      confirmations,
      status: fullyConfirmed ? 'completed' : 'awaiting_confirmation',
      auditTrail,
    }
  })
}

export function requestReferee(tournament, matchId, playerId) {
  return updateMatch(tournament, matchId, (match) => {
    if (deriveMatchStatus(match, tournament.maxSetsPerMatch) === 'disputed') return match

    const auditTrail = recordAuditEntry(match, {
      actor: playerId || 'player',
      actorRole: 'player',
      type: 'referee_requested',
      message: 'Izsaukts tiesnesis pie galda',
      details: { playerId },
    })

    return {
      ...match,
      refereeRequested: true,
      refereeRequestedBy: playerId || null,
      status: 'disputed',
      auditTrail,
    }
  })
}

export function clearRefereeRequest(tournament, matchId, playerId) {
  return updateMatch(tournament, matchId, (match) => {
    if (playerId && match.refereeRequestedBy && match.refereeRequestedBy !== playerId) return match

    const restored = {
      ...match,
      refereeRequested: false,
      refereeRequestedBy: null,
      status: match.setResults.length > 0 ? 'in_progress' : 'scheduled',
    }

    const auditTrail = recordAuditEntry(match, {
      actor: playerId || 'organizer',
      actorRole: playerId ? 'player' : 'organizer',
      type: 'referee_cleared',
      message: playerId ? 'Spēlētājs atsauca tiesneša izsaukumu' : 'Organizators noņēma tiesneša brīdinājumu',
      details: { playerId },
    })

    return {
      ...restored,
      status: deriveMatchStatus(restored, tournament.maxSetsPerMatch),
      auditTrail,
    }
  })
}

export function markMatchInvestigating(tournament, matchId) {
  return updateMatch(tournament, matchId, (match) => {
    const auditTrail = recordAuditEntry(match, {
      actor: 'organizer',
      actorRole: 'organizer',
      type: 'investigation_started',
      message: 'Organizators uzsāka izmeklēšanu pie galda',
    })
    return {
      ...match,
      refereeRequested: false,
      refereeRequestedBy: null,
      status: 'investigating',
      auditTrail,
    }
  })
}

export function resetMatchInvestigation(tournament, matchId) {
  return updateMatch(tournament, matchId, (match) => {
    const restored = {
      ...match,
      refereeRequested: false,
      refereeRequestedBy: null,
      status: match.setResults.length > 0 ? 'in_progress' : 'scheduled',
    }
    const auditTrail = recordAuditEntry(match, {
      actor: 'organizer',
      actorRole: 'organizer',
      type: 'investigation_reset',
      message: 'Organizators atiestatīja izmeklēšanu',
    })

    return {
      ...restored,
      status: deriveMatchStatus(restored, tournament.maxSetsPerMatch),
      auditTrail,
    }
  })
}

export function issuePlayerWarning(tournament, matchId, playerId, { reason = 'Noteikumu pārkāpums', note = '', issuedBy = 'Tiesnesis' } = {}) {
  const match = tournament.matches.find((m) => m.id === matchId)
  if (!match) return tournament

  const player = tournament.players.find((p) => p.id === playerId)
  const playerName = player?.name || playerId
  const timestamp = new Date().toLocaleTimeString('lv-LV', { hour: '2-digit', minute: '2-digit' })

  const warningEntry = {
    id: `warn-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    playerId,
    playerName,
    reason,
    note: typeof note === 'string' ? note.trim() : '',
    timestamp,
    issuedBy,
  }

  const auditEntry = {
    actor: issuedBy,
    actorRole: 'referee',
    type: 'player_warning',
    message: `Brīdinājums spēlētājam ${playerName}: ${reason}${warningEntry.note ? ` ("${warningEntry.note}")` : ''}`,
    details: warningEntry,
    timestamp,
  }

  return {
    ...tournament,
    players: tournament.players.map((p) => {
      if (p.id !== playerId) return p
      return {
        ...p,
        warnings: (p.warnings || 0) + 1,
        warningHistory: [...(p.warningHistory || []), { ...warningEntry, matchId, table: match.table }],
      }
    }),
    matches: tournament.matches.map((m) => {
      if (m.id !== matchId) return m
      return {
        ...m,
        warnings: [...(m.warnings || []), warningEntry],
        auditTrail: recordAuditEntry(m, auditEntry),
      }
    }),
  }
}

export function getMatchWarnings(match, playerId = null) {
  if (!match || !Array.isArray(match.warnings)) return []
  if (!playerId) return match.warnings
  return match.warnings.filter((w) => w.playerId === playerId)
}

export function getPlayerWarnings(tournament, playerId) {
  const player = tournament.players?.find((p) => p.id === playerId)
  return player?.warnings || 0
}

export function forceOverrideResult(tournament, matchId, setResults, metadata = {}) {
  let updatedTournament = updateMatch(tournament, matchId, (match) => {
    const allowedWinnerIds = new Set([match.playerAId, match.playerBId])
    const submittedSetResults = Array.isArray(setResults)
      ? setResults
        .filter((set) => allowedWinnerIds.has(set?.winnerId))
        .slice(0, tournament.maxSetsPerMatch)
        .map((set) => ({ winnerId: set.winnerId }))
      : []
    const nextSetResults = []

    for (const set of submittedSetResults) {
      nextSetResults.push(set)
      if (getMatchWinnerId({ ...match, setResults: nextSetResults }, tournament.maxSetsPerMatch)) break
    }

    return buildOverriddenMatch(match, nextSetResults, metadata, tournament.maxSetsPerMatch)
  })

  if (metadata.warning && metadata.warning.playerId) {
    updatedTournament = issuePlayerWarning(
      updatedTournament,
      matchId,
      metadata.warning.playerId,
      {
        reason: metadata.warning.reason || 'Noteikumu pārkāpums',
        note: metadata.warning.note || metadata.note || '',
        issuedBy: metadata.editedBy || 'Tiesnesis',
      }
    )
  }

  return updatedTournament
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
      if (match.id === sourceMatchId) {
        return {
          ...match,
          table: targetMatch.table,
          auditTrail: recordAuditEntry(match, {
            actor: 'organizer',
            actorRole: 'organizer',
            type: 'table_swap',
            message: `Galds mainīts no ${sourceMatch.table} uz ${targetMatch.table}`,
          }),
        }
      }
      if (match.id === targetMatchId) {
        return {
          ...match,
          table: sourceMatch.table,
          auditTrail: recordAuditEntry(match, {
            actor: 'organizer',
            actorRole: 'organizer',
            type: 'table_swap',
            message: `Galds mainīts no ${targetMatch.table} uz ${sourceMatch.table}`,
          }),
        }
      }
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

export function isTournamentComplete(tournament) {
  if (!tournament || !tournament.totalRounds) return false
  const matches = getCurrentRoundMatches(tournament)
  return (
    tournament.currentRound >= tournament.totalRounds
    && matches.length > 0
    && matches.every((match) => deriveMatchStatus(match, tournament.maxSetsPerMatch) === 'completed')
  )
}

export function canGenerateNextRound(tournament) {
  if (tournament.totalRounds > 0 && tournament.currentRound >= tournament.totalRounds) {
    return false
  }
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
    refereeRequestedBy: null,
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
  const format = config.format || (Number(config.draw) > 0 ? 'fixed_sets' : 'target_wins')
  return {
    id: `novuss-${Date.now()}`,
    name: config.name,
    venue: 'Setup desk',
    status: 'registration',
    format,
    currentRound: 0,
    totalRounds: Number(config.totalRounds) || 7,
    maxSetsPerMatch: Number(config.maxSetsPerMatch) || 6,
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
  const nextMatch = { ...match, setResults }
  const isFinalResult = Boolean(getMatchWinnerId(nextMatch, maxSetsPerMatch))
    || isDrawMatch(nextMatch, maxSetsPerMatch)
  const previousScore = {
    [match.playerAId]: getSetScore(match, match.playerAId),
    [match.playerBId]: getSetScore(match, match.playerBId),
  }
  const nextScore = {
    [match.playerAId]: getSetScore(nextMatch, match.playerAId),
    [match.playerBId]: getSetScore(nextMatch, match.playerBId),
  }
  const previousAudit = match.overrideMeta?.reason
    ? {
        ...match.overrideMeta,
        nextScore: match.overrideMeta.nextScore || previousScore,
      }
    : null
  const editHistory = Array.isArray(match.overrideMeta?.editHistory)
    ? match.overrideMeta.editHistory
    : previousAudit
      ? [previousAudit]
      : []
  const deltaA = nextScore[match.playerAId] - previousScore[match.playerAId]
  const deltaB = nextScore[match.playerBId] - previousScore[match.playerBId]

  const addedTo = []
  const takenFrom = []

  if (deltaA > 0) addedTo.push({ playerId: match.playerAId, count: deltaA })
  if (deltaA < 0) takenFrom.push({ playerId: match.playerAId, count: Math.abs(deltaA) })
  if (deltaB > 0) addedTo.push({ playerId: match.playerBId, count: deltaB })
  if (deltaB < 0) takenFrom.push({ playerId: match.playerBId, count: Math.abs(deltaB) })

  const auditEntry = {
    editedBy: metadata.editedBy || 'Organizators',
    reason: metadata.reason || 'other',
    note: metadata.note?.trim() || '',
    previousWinnerId,
    previousStatus,
    previousScore,
    nextScore,
    addedTo,
    takenFrom,
    editedAt: metadata.editedAt || 'Tikko',
  }

  const isScoreUnchanged = deltaA === 0 && deltaB === 0
  const isReferee = metadata.reason === 'referee_decision' || metadata.actorRole === 'referee'

  const message = isScoreUnchanged
    ? isReferee
      ? `Tiesneša lēmums: ${metadata.note ? `"${metadata.note}"` : 'Rezultāts atstāts nemainīts'}`
      : `${getOverrideAuditLabel({ overrideMeta: metadata })}: ${metadata.note ? `"${metadata.note}"` : 'Rezultāts nemainīts'}`
    : `Organizatora labojums: ${getOverrideAuditLabel({ overrideMeta: metadata })}${metadata.note ? ` ("${metadata.note}")` : ''}`

  const overrideAudit = {
    actor: metadata.editedBy || (isReferee ? 'Tiesnesis' : 'Organizators'),
    actorRole: metadata.actorRole || (isReferee ? 'referee' : 'organizer'),
    type: metadata.type || 'organizer_override',
    message,
    addedTo,
    takenFrom,
    details: auditEntry,
    timestamp: metadata.editedAt || new Date().toLocaleTimeString('lv-LV', { hour: '2-digit', minute: '2-digit' }),
  }
  const auditTrail = recordAuditEntry(match, overrideAudit)

  return {
    ...match,
    setResults,
    confirmations: isFinalResult
      ? {
          [match.playerAId]: true,
          [match.playerBId]: true,
        }
      : resetConfirmations(match),
    refereeRequested: false,
    refereeRequestedBy: null,
    contestMeta: null,
    status: isFinalResult ? 'completed' : setResults.length > 0 ? 'in_progress' : 'scheduled',
    auditTrail,
    overrideMeta: {
      ...auditEntry,
      editHistory: [...editHistory, auditEntry],
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
