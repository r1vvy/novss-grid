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
})
