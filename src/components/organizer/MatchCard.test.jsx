import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MatchCard } from './MatchCard'

const mockTournament = {
  maxSetsPerMatch: 6,
  players: [
    { id: 'p1', name: 'Anna Kalniņa', representation: 'Rīga' },
    { id: 'p2', name: 'Jānis Bērziņš', representation: 'Cēsis' },
  ],
}

describe('MatchCard Organizer Audit Trail', () => {
  it('displays audit trail toggle and expands to show player-made calls and edits', () => {
    const match = {
      id: 'm1',
      table: 2,
      round: 1,
      playerAId: 'p1',
      playerBId: 'p2',
      status: 'in_progress',
      setResults: [{ winnerId: 'p1' }],
      confirmations: {},
      auditTrail: [
        {
          id: 'aud-1',
          timestamp: '14:20',
          actor: 'p1',
          actorRole: 'player',
          type: 'player_arrival',
          message: 'Reģistrēta ierašanās pie galda',
        },
        {
          id: 'aud-2',
          timestamp: '14:25',
          actor: 'p1',
          actorRole: 'player',
          type: 'set_added',
          message: 'Reģistrēts uzvarēts sets (1 : 0)',
          addedTo: [{ playerId: 'p1', count: 1 }],
          takenFrom: [],
        },
        {
          id: 'aud-3',
          timestamp: '14:30',
          actor: 'p2',
          actorRole: 'player',
          type: 'referee_requested',
          message: 'Izsaukts tiesnesis pie galda',
        },
        {
          id: 'aud-4',
          timestamp: '14:32',
          actor: 'p1',
          actorRole: 'player',
          type: 'set_removed',
          message: 'Noņemts uzvarēts sets (0 : 0)',
          addedTo: [],
          takenFrom: [{ playerId: 'p1', count: 1 }],
        },
      ],
    }

    render(
      <MatchCard
        tournament={mockTournament}
        match={match}
        onClearAlert={vi.fn()}
        onMarkInvestigating={vi.fn()}
        onOpenOverride={vi.fn()}
      />
    )

    // Audit toggle button is present with badge '4'
    const auditBtn = screen.getByRole('button', { name: /Pārslēgt audita žurnālu/i })
    expect(auditBtn).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()

    // Initially collapsed
    expect(screen.queryByText(/Reģistrēta ierašanās pie galda/i)).toBeNull()

    // Click to expand
    fireEvent.click(auditBtn)

    // Audit entries are visible with actor names, messages, addedTo, and takenFrom
    expect(screen.getByText(/Izsaukts tiesnesis pie galda/i)).toBeInTheDocument()
    expect(screen.getByText(/Reģistrēts uzvarēts sets \(1 : 0\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Noņemts uzvarēts sets \(0 : 0\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Reģistrēta ierašanās pie galda/i)).toBeInTheDocument()
    expect(screen.getByText('Pievienots:')).toBeInTheDocument()
    expect(screen.getByText('Noņemts no:')).toBeInTheDocument()
    expect(screen.getAllByText('Anna Kalniņa').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Jānis Bērziņš').length).toBeGreaterThan(0)
  })
})

