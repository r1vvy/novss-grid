import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrganizerBentoGrid } from './OrganizerBentoGrid'

describe('OrganizerBentoGrid Architecture', () => {
  const mockMatches = [
    {
      id: 'm1',
      round: 2,
      table: 1,
      playerAId: 'p1',
      playerBId: 'p2',
      status: 'completed',
      setResults: [{ winnerId: 'p1', perfectPlays: { p1: 1 } }],
      confirmations: { p1: true, p2: true },
    },
  ]

  const mockTournament = {
    name: 'Rīgas Novusa Čempionāts',
    venue: 'Rīgas Sporta Pils',
    updatedAt: '12:00',
    status: 'Tiešraide',
    currentRound: 2,
    totalRounds: 5,
    maxSetsPerMatch: 6,
    players: [{ id: 'p1', name: 'Jānis' }, { id: 'p2', name: 'Anna' }],
    matches: mockMatches,
  }

  it('renders 3-tile bento structure with hero, swiss engine and pulse metrics', () => {
    const handleOpenKiosk = vi.fn()
    const handleOpenPlayers = vi.fn()
    const handleOpenSettings = vi.fn()
    const handleGenerateRound = vi.fn()

    render(
      <OrganizerBentoGrid
        tournament={mockTournament}
        matches={mockMatches}
        alerts={[]}
        canGenerate={true}
        onGenerateRound={handleGenerateRound}
        onOpenPlayers={handleOpenPlayers}
        onOpenSettings={handleOpenSettings}
        onOpenKiosk={handleOpenKiosk}
      />,
    )

    // Hero Tile
    expect(screen.getByText('Rīgas Novusa Čempionāts')).toBeInTheDocument()
    expect(screen.getByText('Rīgas Sporta Pils')).toBeInTheDocument()

    // Kiosk TV button
    const kioskBtn = screen.getByRole('button', { name: /Kioska TV skats/i })
    expect(kioskBtn).toBeInTheDocument()
    fireEvent.click(kioskBtn)
    expect(handleOpenKiosk).toHaveBeenCalledTimes(1)

    // Swiss Round Engine Tile
    expect(screen.getByText(/Šveices kārtas dzinējs/i)).toBeInTheDocument()
    const genBtn = screen.getByRole('button', { name: /Ģenerēt 3\. kārtu/i })
    expect(genBtn).toBeEnabled()
    fireEvent.click(genBtn)
    expect(handleGenerateRound).toHaveBeenCalledTimes(1)

    // Pulse Metrics Tile
    expect(screen.getByText(/Tiešraides pulss/i)).toBeInTheDocument()
    expect(screen.getByText('Galdi')).toBeInTheDocument()
    expect(screen.getByText('Pabeigti')).toBeInTheDocument()
  })

  it('disables round generation when canGenerate is false', () => {
    render(
      <OrganizerBentoGrid
        tournament={mockTournament}
        matches={mockMatches}
        alerts={[]}
        canGenerate={false}
        onGenerateRound={vi.fn()}
      />,
    )

    const genBtn = screen.getByRole('button', { name: /Gaida spēļu apstiprinājumu/i })
    expect(genBtn).toBeDisabled()
  })
})
