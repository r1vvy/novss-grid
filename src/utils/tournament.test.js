import { describe, it, expect } from 'vitest'
import {
  getPlayerById,
  getSetScore,
  getRequiredWins,
  hasReachedTargetWins,
  getMatchWinnerId,
  deriveMatchStatus,
  calculateStandings,
  forceOverrideResult,
  getMatchPerfectPlays,
  adjustCurrentSetPerfectPlays,
  appendSetResult,
  contestFinalScore,
  confirmPlayerArrival,
  startMatchReady,
  isTournamentComplete,
  requestReferee,
  removeSetResult,
} from './tournament'
import { initialTournament } from '../data/mockTournament'

describe('Tournament Domain Logic', () => {
  it('correctly calculates required wins for given maxSetsPerMatch', () => {
    expect(getRequiredWins(6)).toBe(4)
    expect(getRequiredWins(4)).toBe(3)
    expect(getRequiredWins(7)).toBe(4)
  })

  it('determines match winner and target wins', () => {
    const match = {
      playerAId: 'p1',
      playerBId: 'p2',
      setResults: [{ winnerId: 'p1' }, { winnerId: 'p1' }, { winnerId: 'p1' }, { winnerId: 'p1' }],
    }
    expect(getSetScore(match, 'p1')).toBe(4)
    expect(getSetScore(match, 'p2')).toBe(0)
    expect(hasReachedTargetWins(match, 'p1', 6)).toBe(true)
    expect(hasReachedTargetWins(match, 'p2', 6)).toBe(false)
    expect(getMatchWinnerId(match, 6)).toBe('p1')
  })

  it('derives correct match status transitions', () => {
    const matchDisputed = {
      refereeRequested: true,
      setResults: [],
      confirmations: {},
    }
    expect(deriveMatchStatus(matchDisputed, 6)).toBe('disputed')

    const matchInvestigating = {
      status: 'investigating',
      setResults: [],
      confirmations: {},
    }
    expect(deriveMatchStatus(matchInvestigating, 6)).toBe('investigating')

    const matchCompleted = {
      playerAId: 'p1',
      playerBId: 'p2',
      setResults: [{ winnerId: 'p1' }, { winnerId: 'p1' }, { winnerId: 'p1' }, { winnerId: 'p1' }],
      confirmations: { p1: true, p2: true },
    }
    expect(deriveMatchStatus(matchCompleted, 6)).toBe('completed')
  })

  it('calculates standings with Buchholz points', () => {
    const standings = calculateStandings(initialTournament)
    expect(standings.length).toBeGreaterThan(0)
    expect(standings[0]).toHaveProperty('points')
    expect(standings[0]).toHaveProperty('buchholz')
    expect(standings[0].points).toBeGreaterThanOrEqual(standings[standings.length - 1].points)
  })

  it('applies forceOverrideResult with audit metadata', () => {
    const matchId = initialTournament.matches[0].id
    const newSets = [{ winnerId: 'p1' }, { winnerId: 'p1' }, { winnerId: 'p1' }, { winnerId: 'p1' }]
    const updated = forceOverrideResult(initialTournament, matchId, newSets, {
      reason: 'score_entry_error',
      note: 'Labots rezultāts pēc video apskata',
      editedBy: 'Organizators',
    })

    const match = updated.matches.find((m) => m.id === matchId)
    expect(match.setResults).toHaveLength(4)
    expect(match.overrideMeta.reason).toBe('score_entry_error')
    expect(match.overrideMeta.note).toBe('Labots rezultāts pēc video apskata')
  })

  it('tracks and tallies perfect plays across completed and current sets', () => {
    const match = {
      playerAId: 'p1',
      playerBId: 'p2',
      setResults: [
        { winnerId: 'p1', perfectPlays: { p1: 1, p2: 0 } },
        { winnerId: 'p1', perfectPlays: { p1: 2, p2: 1 } },
      ],
      currentSetPerfectPlays: { p1: 1, p2: 0 },
    }

    expect(getMatchPerfectPlays(match, 'p1')).toBe(4)
    expect(getMatchPerfectPlays(match, 'p2')).toBe(1)
  })

  it('adjusts current set perfect plays and appends them with the next set result', () => {
    const tournament = {
      ...initialTournament,
      matches: [
        {
          id: 'test-m1',
          round: 4,
          playerAId: 'p1',
          playerBId: 'p2',
          setResults: [],
          status: 'in_progress',
          confirmations: { p1: false, p2: false },
        },
      ],
    }

    // Increment perfect play for p1
    let state = adjustCurrentSetPerfectPlays(tournament, 'test-m1', 'p1', 1, 'p1')
    expect(state.matches[0].currentSetPerfectPlays.p1).toBe(1)

    // Increment again
    state = adjustCurrentSetPerfectPlays(state, 'test-m1', 'p1', 1, 'p1')
    expect(state.matches[0].currentSetPerfectPlays.p1).toBe(2)

    // Append set won by p1
    state = appendSetResult(state, 'test-m1', 'p1', 'p1')
    expect(state.matches[0].setResults).toHaveLength(1)
    expect(state.matches[0].setResults[0].perfectPlays.p1).toBe(2)
    expect(state.matches[0].currentSetPerfectPlays.p1).toBe(0)
  })

  it('removes perfect play from completed sets when current set has zero perfect plays', () => {
    const tournament = {
      ...initialTournament,
      matches: [
        {
          id: 'test-m1',
          round: 4,
          playerAId: 'p1',
          playerBId: 'p2',
          setResults: [
            { winnerId: 'p1', perfectPlays: { p1: 1, p2: 0 } },
            { winnerId: 'p1', perfectPlays: { p1: 2, p2: 0 } },
          ],
          currentSetPerfectPlays: { p1: 0, p2: 0 },
          status: 'in_progress',
          confirmations: { p1: false, p2: false },
        },
      ],
    }

    expect(getMatchPerfectPlays(tournament.matches[0], 'p1')).toBe(3)

    // Decrement as p1 (Anna)
    let state = adjustCurrentSetPerfectPlays(tournament, 'test-m1', 'p1', -1, 'p1')
    expect(getMatchPerfectPlays(state.matches[0], 'p1')).toBe(2)
    expect(state.matches[0].setResults[1].perfectPlays.p1).toBe(1)

    // Decrement again
    state = adjustCurrentSetPerfectPlays(state, 'test-m1', 'p1', -1, 'p1')
    expect(getMatchPerfectPlays(state.matches[0], 'p1')).toBe(1)
    expect(state.matches[0].setResults[1].perfectPlays.p1).toBe(0)

    // Decrement again (reaches setResults[0])
    state = adjustCurrentSetPerfectPlays(state, 'test-m1', 'p1', -1, 'p1')
    expect(getMatchPerfectPlays(state.matches[0], 'p1')).toBe(0)
    expect(state.matches[0].setResults[0].perfectPlays.p1).toBe(0)

    // Decrement when 0: stays 0
    state = adjustCurrentSetPerfectPlays(state, 'test-m1', 'p1', -1, 'p1')
    expect(getMatchPerfectPlays(state.matches[0], 'p1')).toBe(0)
  })

  it('handles score contesting by triggering automatic referee call and dispute', () => {
    const tournament = {
      ...initialTournament,
      matches: [
        {
          id: 'test-m2',
          round: 4,
          playerAId: 'p1',
          playerBId: 'p2',
          setResults: [{ winnerId: 'p1' }, { winnerId: 'p1' }, { winnerId: 'p1' }, { winnerId: 'p1' }],
          status: 'awaiting_confirmation',
          confirmations: { p1: true, p2: false },
        },
      ],
    }

    const state = contestFinalScore(tournament, 'test-m2', 'p2', 'Nepareizs 4. seta uzvarētājs')
    const match = state.matches[0]

    expect(match.status).toBe('disputed')
    expect(match.refereeRequested).toBe(true)
    expect(match.refereeRequestedBy).toBe('p2')
    expect(match.contestMeta.reason).toBe('Nepareizs 4. seta uzvarētājs')
    expect(match.confirmations.p1).toBe(false)
  })

  it('handles player arrival and ready transitions', () => {
    const tournament = {
      ...initialTournament,
      matches: [
        {
          id: 'test-m3',
          round: 4,
          playerAId: 'p1',
          playerBId: 'p2',
          setResults: [],
          status: 'scheduled',
          arrivals: { p1: false, p2: false },
        },
      ],
    }

    let state = confirmPlayerArrival(tournament, 'test-m3', 'p1')
    expect(state.matches[0].arrivals.p1).toBe(true)
    expect(state.matches[0].arrivals.p2).toBe(false)

    state = startMatchReady(state, 'test-m3', 'p1')
    expect(state.matches[0].status).toBe('in_progress')
  })

  it('evaluates tournament completion lifecycle correctly', () => {
    const completedTourney = {
      ...initialTournament,
      currentRound: 4,
      totalRounds: 4,
      matches: initialTournament.matches.map((m) => ({
        ...m,
        status: 'completed',
        refereeRequested: false,
        refereeRequestedBy: null,
        confirmations: { [m.playerAId]: true, [m.playerBId]: true },
      })),
    }

    expect(isTournamentComplete(completedTourney)).toBe(true)
  })

  it('audits all player-made calls, score entries, and edits into match auditTrail', () => {
    let tournament = {
      ...initialTournament,
      matches: [
        {
          id: 'audit-test-m1',
          round: 4,
          table: 5,
          playerAId: 'p1',
          playerBId: 'p2',
          setResults: [],
          status: 'scheduled',
          arrivals: { p1: false, p2: false },
          confirmations: { p1: false, p2: false },
          auditTrail: [],
        },
      ],
    }

    // 1. Player arrival call
    tournament = confirmPlayerArrival(tournament, 'audit-test-m1', 'p1')
    expect(tournament.matches[0].auditTrail).toHaveLength(1)
    expect(tournament.matches[0].auditTrail[0].type).toBe('player_arrival')
    expect(tournament.matches[0].auditTrail[0].actor).toBe('p1')

    // 2. Score entry by scorekeeper
    tournament = appendSetResult(tournament, 'audit-test-m1', 'p1', 'p1')
    expect(tournament.matches[0].auditTrail).toHaveLength(2)
    expect(tournament.matches[0].auditTrail[1].type).toBe('set_added')
    expect(tournament.matches[0].auditTrail[1].message).toContain('1 : 0')
    expect(tournament.matches[0].auditTrail[1].addedTo).toEqual([{ playerId: 'p1', count: 1 }])
    expect(tournament.matches[0].auditTrail[1].takenFrom).toEqual([])

    // 3. Remove set result (taken from p1)
    tournament = removeSetResult(tournament, 'audit-test-m1', 'p1', 'p1')
    expect(tournament.matches[0].auditTrail).toHaveLength(3)
    expect(tournament.matches[0].auditTrail[2].type).toBe('set_removed')
    expect(tournament.matches[0].auditTrail[2].takenFrom).toEqual([{ playerId: 'p1', count: 1 }])
    expect(tournament.matches[0].auditTrail[2].addedTo).toEqual([])

    // 4. Player requests referee
    tournament = requestReferee(tournament, 'audit-test-m1', 'p2')
    expect(tournament.matches[0].auditTrail).toHaveLength(4)
    expect(tournament.matches[0].auditTrail[3].type).toBe('referee_requested')
    expect(tournament.matches[0].auditTrail[3].actor).toBe('p2')

    // 5. Opponent contests score
    tournament = contestFinalScore(tournament, 'audit-test-m1', 'p2', 'Kļūdains sets')
    expect(tournament.matches[0].auditTrail).toHaveLength(5)
    expect(tournament.matches[0].auditTrail[4].type).toBe('score_contested')
    expect(tournament.matches[0].auditTrail[4].message).toContain('Kļūdains sets')

    // 6. Force override changing result from 0:0 to 1:0 for p2
    tournament = forceOverrideResult(tournament, 'audit-test-m1', [{ winnerId: 'p2' }], {
      reason: 'referee_decision',
      editedBy: 'Galvenais tiesnesis',
    })
    const lastAudit = tournament.matches[0].auditTrail[tournament.matches[0].auditTrail.length - 1]
    expect(lastAudit.type).toBe('organizer_override')
    expect(lastAudit.addedTo).toEqual([{ playerId: 'p2', count: 1 }])
  })
})
