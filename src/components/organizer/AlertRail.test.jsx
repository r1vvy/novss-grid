import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AlertRail } from './AlertRail'

const mockTournament = {
  maxSetsPerMatch: 6,
  currentRound: 1,
  players: [
    { id: 'p1', name: 'Anna Kalnina', representation: 'Riga' },
    { id: 'p2', name: 'Janis Berzins', representation: 'Cesis' },
    { id: 'p3', name: 'Marta Ozola', representation: 'Valmiera' },
    { id: 'p4', name: 'Rihards Liepa', representation: 'Riga' },
  ],
  matches: [],
}

const mockDisputedMatch = {
  id: 'm-disputed-1',
  table: 2,
  round: 1,
  status: 'disputed',
  playerAId: 'p1',
  playerBId: 'p2',
  setResults: [{ winnerId: 'p1' }, { winnerId: 'p2' }],
  refereeRequested: true,
  contestMeta: { reason: 'Nesaskaņa par kiju līniju' },
}

const mockInvestigatingMatch = {
  id: 'm-investigating-1',
  table: 4,
  round: 1,
  status: 'investigating',
  playerAId: 'p3',
  playerBId: 'p4',
  setResults: [{ winnerId: 'p3' }],
  refereeRequested: false,
  contestMeta: { reason: 'Pārbauda kaula stāvokli' },
  auditTrail: [
    {
      id: 'audit-1',
      actor: 'organizer',
      type: 'investigation_started',
      timestamp: '14:30',
      message: 'Organizators uzsāka izmeklēšanu pie galda',
    },
  ],
}

describe('AlertRail Component', () => {
  it('renders calm state when no alerts and no investigations exist', () => {
    render(
      <AlertRail
        tournament={mockTournament}
        alerts={[]}
        investigations={[]}
        onMarkInvestigating={vi.fn()}
      />
    )

    expect(screen.getByText('Tiesneša izsaukumi')).toBeInTheDocument()
    expect(screen.getByText('Mierīgs')).toBeInTheDocument()
    expect(screen.getByText('Visi galdi mierīgi')).toBeInTheDocument()
    expect(screen.getByText('Nav aktīvu tiesneša izsaukumu vai strīdu.')).toBeInTheDocument()
  })

  it('renders disputed match and handles onMarkInvestigating', () => {
    const handleMarkInvestigating = vi.fn()
    render(
      <AlertRail
        tournament={mockTournament}
        alerts={[mockDisputedMatch]}
        investigations={[]}
        onMarkInvestigating={handleMarkInvestigating}
      />
    )

    expect(screen.getByText('Galds 2')).toBeInTheDocument()
    expect(screen.getByText('Nepieciešama palīdzība')).toBeInTheDocument()
    expect(screen.getByText(/Anna Kalnina/)).toBeInTheDocument()
    expect(screen.getByText(/Janis Berzins/)).toBeInTheDocument()
    expect(screen.getByText('Nesaskaņa par kiju līniju')).toBeInTheDocument()

    const markBtn = screen.getByRole('button', { name: /Marķēt kā izmeklē/i })
    expect(markBtn).toBeInTheDocument()
    fireEvent.click(markBtn)
    expect(handleMarkInvestigating).toHaveBeenCalledWith('m-disputed-1')
  })

  it('renders active investigation with status badge, score, and actions', () => {
    const handleOpenOverride = vi.fn()
    const handleResetInvestigation = vi.fn()

    render(
      <AlertRail
        tournament={mockTournament}
        alerts={[]}
        investigations={[mockInvestigatingMatch]}
        onOpenOverride={handleOpenOverride}
        onResetInvestigation={handleResetInvestigation}
      />
    )

    expect(screen.getByText('Galds 4')).toBeInTheDocument()
    expect(screen.getByText('Tiek izmeklēts')).toBeInTheDocument()
    expect(screen.getByText(/Marta Ozola/)).toBeInTheDocument()
    expect(screen.getByText(/Rihards Liepa/)).toBeInTheDocument()
    expect(screen.getByText('Pārbauda kaula stāvokli')).toBeInTheDocument()
    expect(screen.getByText(/Izmeklēšana uzsākta plkst\. 14:30/)).toBeInTheDocument()

    // Decision action button
    const decisionBtn = screen.getByRole('button', { name: /Ievadīt lēmumu/i })
    expect(decisionBtn).toBeInTheDocument()
    fireEvent.click(decisionBtn)
    expect(handleOpenOverride).toHaveBeenCalledWith(mockInvestigatingMatch)

    // Reset investigation action button
    const resetBtn = screen.getByRole('button', { name: /Atsākt/i })
    expect(resetBtn).toBeInTheDocument()
    fireEvent.click(resetBtn)
    expect(handleResetInvestigation).toHaveBeenCalledWith('m-investigating-1')
  })

  it('renders both disputed and investigating matches with section groupings and badges', () => {
    render(
      <AlertRail
        tournament={mockTournament}
        alerts={[mockDisputedMatch]}
        investigations={[mockInvestigatingMatch]}
        onMarkInvestigating={vi.fn()}
        onOpenOverride={vi.fn()}
        onResetInvestigation={vi.fn()}
      />
    )

    // Header badges
    expect(screen.getByTitle('Jauni tiesneša izsaukumi')).toHaveTextContent('1')
    expect(screen.getByTitle('Aktīvas izmeklēšanas')).toHaveTextContent('1 izmeklē')

    // Section groupings
    expect(screen.getByText(/Jauni izsaukumi \(1\)/)).toBeInTheDocument()
    expect(screen.getByText(/Aktīva izmeklēšana \(1\)/)).toBeInTheDocument()

    // Both tables visible
    expect(screen.getByText('Galds 2')).toBeInTheDocument()
    expect(screen.getByText('Galds 4')).toBeInTheDocument()
  })

  it('auto-derives investigations from tournament when investigations prop is omitted', () => {
    const tournamentWithInvestigating = {
      ...mockTournament,
      matches: [mockInvestigatingMatch],
    }

    render(
      <AlertRail
        tournament={tournamentWithInvestigating}
        alerts={[]}
      />
    )

    expect(screen.getByText('Galds 4')).toBeInTheDocument()
    expect(screen.getByText('Tiek izmeklēts')).toBeInTheDocument()
  })
})

