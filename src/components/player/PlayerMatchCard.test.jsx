import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PlayerMatchCard } from './PlayerMatchCard'

const mockTournament = {
  maxSetsPerMatch: 6,
  players: [
    { id: 'p1', name: 'Anna Kalniņa', representation: 'Rīga' },
    { id: 'p2', name: 'Jānis Bērziņš', representation: 'Cēsis' },
  ],
}

describe('PlayerMatchCard Integration & Workflows', () => {
  it('renders arrival banner when match is scheduled and triggers arrival callback', () => {
    const onArrival = vi.fn()
    const match = {
      id: 'm1',
      table: 3,
      round: 1,
      playerAId: 'p1',
      playerBId: 'p2',
      status: 'scheduled',
      setResults: [],
      arrivals: { p1: false, p2: false },
      confirmations: {},
    }

    render(
      <PlayerMatchCard
        tournament={mockTournament}
        match={match}
        player={{ id: 'p1', name: 'Anna Kalniņa' }}
        onScoreAdd={vi.fn()}
        onScoreRemove={vi.fn()}
        onConfirmArrival={onArrival}
        onReadyToPlay={vi.fn()}
        onConfirm={vi.fn()}
        onCallReferee={vi.fn()}
        onCancelReferee={vi.fn()}
      />
    )

    expect(screen.getByText(/Ierašanās pie galda/i)).toBeInTheDocument()
    const arrivalBtn = screen.getByRole('button', { name: /Ierasties pie galda/i })
    expect(arrivalBtn).toBeInTheDocument()

    fireEvent.click(arrivalBtn)
    expect(onArrival).toHaveBeenCalledWith('m1', 'p1')
  })

  it('renders score verification dialog and allows opponent to contest the result', () => {
    const onContest = vi.fn()
    const onConfirm = vi.fn()

    const match = {
      id: 'm2',
      table: 1,
      round: 1,
      playerAId: 'p1',
      playerBId: 'p2',
      status: 'awaiting_confirmation',
      setResults: [
        { winnerId: 'p1', perfectPlays: { p1: 1, p2: 0 } },
        { winnerId: 'p1', perfectPlays: { p1: 0, p2: 0 } },
        { winnerId: 'p1', perfectPlays: { p1: 0, p2: 0 } },
        { winnerId: 'p1', perfectPlays: { p1: 1, p2: 0 } },
      ],
      confirmations: { p1: true, p2: false },
    }

    render(
      <PlayerMatchCard
        tournament={mockTournament}
        match={match}
        player={{ id: 'p2', name: 'Jānis Bērziņš' }}
        onScoreAdd={vi.fn()}
        onScoreRemove={vi.fn()}
        onConfirm={onConfirm}
        onContestScore={onContest}
        onCallReferee={vi.fn()}
        onCancelReferee={vi.fn()}
      />
    )

    expect(screen.getByText(/Rezultātu pārbaude un verifikācija/i)).toBeInTheDocument()
    expect(screen.getByText(/★ 2 ideālie gājieni/i)).toBeInTheDocument()

    const contestBtn = screen.getByRole('button', { name: /Apstrīdēt rezultātu & Izsaukt tiesnesi/i })
    fireEvent.click(contestBtn)

    const submitDisputeBtn = screen.getByRole('button', { name: /Iesniegt strīdu/i })
    fireEvent.click(submitDisputeBtn)

    expect(onContest).toHaveBeenCalledWith('m2', 'p2', '')
  })

  it('renders prominent warning banner when player has received a referee warning', () => {
    const match = {
      id: 'm-warn-test',
      table: 2,
      round: 2,
      playerAId: 'p1',
      playerBId: 'p2',
      status: 'in_progress',
      setResults: [{ winnerId: 'p1' }],
      warnings: [
        {
          id: 'w10',
          playerId: 'p1',
          reason: 'Aizkavēta spēle',
          note: 'Pārsniegts 30 sekunžu sitiena sagatavošanās laiks',
          timestamp: '15:10',
        },
      ],
      arrivals: { p1: true, p2: true },
      ready: { p1: true, p2: true },
    }

    render(
      <PlayerMatchCard
        tournament={mockTournament}
        match={match}
        player={{ id: 'p1', name: 'Anna Kalniņa' }}
        onScoreAdd={vi.fn()}
        onScoreRemove={vi.fn()}
        onCallReferee={vi.fn()}
        onCancelReferee={vi.fn()}
      />
    )

    // Player sees their warning banner
    expect(screen.getByText('Tiesneša brīdinājums (1)')).toBeInTheDocument()
    expect(screen.getByText('Aizkavēta spēle')).toBeInTheDocument()
    expect(screen.getByText('Pārsniegts 30 sekunžu sitiena sagatavošanās laiks')).toBeInTheDocument()
    expect(screen.getByText('15:10')).toBeInTheDocument()
  })
})

