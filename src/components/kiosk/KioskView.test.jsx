import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { KioskView } from './KioskView'

describe('KioskView 10-foot Hall TV Screen', () => {
  const mockTournament = {
    name: 'Latvijas Novusa Čempionāts',
    venue: 'Olimpiskais Centrs',
    currentRound: 1,
    totalRounds: 5,
    maxSetsPerMatch: 6,
    pointAllocation: { win: 1, draw: 0.5, closeWin: 1, loss: 0 },
    players: [
      { id: 'p1', name: 'Jānis Ozols', representation: 'Valmiera', points: 3, buchholz: 4 },
      { id: 'p2', name: 'Māris Liepiņš', representation: 'Liepāja', points: 2, buchholz: 3 },
    ],
    matches: [
      {
        id: 'r1-m1',
        round: 1,
        table: 1,
        playerAId: 'p1',
        playerBId: 'p2',
        status: 'in_progress',
        setResults: [{ winnerId: 'p1' }, { winnerId: 'p1' }],
        confirmations: {},
      },
    ],
  }

  it('renders Active Tables slide by default with high-visibility table number and player names', () => {
    const handleClose = vi.fn()

    render(<KioskView tournament={mockTournament} onClose={handleClose} />)

    // Header title and venue
    expect(screen.getByText('Latvijas Novusa Čempionāts')).toBeInTheDocument()
    expect(screen.getByText(/Olimpiskais Centrs/i)).toBeInTheDocument()

    // Table number 1
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Jānis Ozols')).toBeInTheDocument()
    expect(screen.getByText('Māris Liepiņš')).toBeInTheDocument()

    // Close button triggers onClose
    const closeBtn = screen.getByRole('button', { name: /Aizvērt kioska skatu/i })
    expect(closeBtn).toBeInTheDocument()
    fireEvent.click(closeBtn)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('allows manual slide switching to Standings and shows leaderboard rankings', () => {
    render(<KioskView tournament={mockTournament} />)

    // Switch to Standings slide
    const standingsTabBtn = screen.getByRole('button', { name: /Kopvērtējums/i })
    fireEvent.click(standingsTabBtn)

    expect(screen.getByText('Kopvērtējuma līderu saraksts')).toBeInTheDocument()
    expect(screen.getByText('Jānis Ozols')).toBeInTheDocument()
    expect(screen.getByText('Valmiera')).toBeInTheDocument()
  })

  it('toggles pause and play state on controls tap', () => {
    render(<KioskView tournament={mockTournament} />)

    const pauseBtn = screen.getByRole('button', { name: /Pauzēt rotāciju/i })
    expect(pauseBtn).toBeInTheDocument()

    fireEvent.click(pauseBtn)
    expect(screen.getByRole('button', { name: /Atsākt rotāciju/i })).toBeInTheDocument()
  })
})

