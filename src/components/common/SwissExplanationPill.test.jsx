import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SwissExplanationPill } from './SwissExplanationPill'

describe('SwissExplanationPill MX Transparency Pill', () => {
  it('renders Round 1 seeding explanation and expands on tap', () => {
    const tournament = {
      currentRound: 1,
      players: [
        { id: 'p1', name: 'Jānis' },
        { id: 'p2', name: 'Pēteris' },
      ],
      matches: [],
    }
    const match = { round: 1, playerAId: 'p1', playerBId: 'p2' }

    render(<SwissExplanationPill match={match} tournament={tournament} />)

    expect(screen.getByText(/1\. kārta: Izloze pēc reitinga un reģistrācijas secības/i)).toBeInTheDocument()

    // Initially details are collapsed
    expect(screen.queryByText(/Pirmajā kārtā dalībnieki tiek sapāroti/i)).toBeNull()

    // Expand
    const btn = screen.getByRole('button', { name: /Šveices sistēmas pāra skaidrojums/i })
    fireEvent.click(btn)

    // Expanded details visible
    expect(screen.getByText(/Pirmajā kārtā dalībnieki tiek sapāroti/i)).toBeInTheDocument()
  })

  it('renders Round 2+ equal-points pairing explanation', () => {
    const tournament = {
      currentRound: 2,
      maxSetsPerMatch: 6,
      pointAllocation: { win: 1, draw: 0.5, closeWin: 1, loss: 0 },
      players: [
        { id: 'p1', name: 'Jānis' },
        { id: 'p2', name: 'Pēteris' },
      ],
      matches: [
        {
          id: 'r1-m1',
          round: 1,
          playerAId: 'p1',
          playerBId: 'other1',
          status: 'completed',
          setResults: [{ winnerId: 'p1' }, { winnerId: 'p1' }, { winnerId: 'p1' }, { winnerId: 'p1' }],
          confirmations: { p1: true, other1: true },
        },
        {
          id: 'r1-m2',
          round: 1,
          playerAId: 'p2',
          playerBId: 'other2',
          status: 'completed',
          setResults: [{ winnerId: 'p2' }, { winnerId: 'p2' }, { winnerId: 'p2' }, { winnerId: 'p2' }],
          confirmations: { p2: true, other2: true },
        },
      ],
    }
    const match = { round: 2, playerAId: 'p1', playerBId: 'p2' }

    render(<SwissExplanationPill match={match} tournament={tournament} />)

    expect(screen.getByText(/2\. kārta: Abi dalībnieki ar 1 punktiem/i)).toBeInTheDocument()
    expect(screen.getByText(/Nav tikušies iepriekšējās kārtās/i)).toBeInTheDocument()
  })
})

