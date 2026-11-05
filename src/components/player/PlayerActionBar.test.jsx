import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PlayerActionBar } from './PlayerActionBar'

describe('PlayerActionBar Contextual Intent Bar', () => {
  const baseTournament = { maxSetsPerMatch: 6 }
  const player = { id: 'p1', name: 'Kaspars' }

  it('renders "Ierasties pie galda" when match is scheduled and player has not arrived', () => {
    const handleArrival = vi.fn()
    const match = {
      id: 'm1',
      status: 'scheduled',
      arrivals: { p1: false },
      ready: {},
      setResults: [],
    }

    render(
      <PlayerActionBar
        tournament={baseTournament}
        match={match}
        player={player}
        onConfirmArrival={handleArrival}
      />,
    )

    const btn = screen.getByRole('button', { name: /Ierasties pie galda/i })
    expect(btn).toBeInTheDocument()
    expect(btn.className).toContain('min-h-[50px]')

    fireEvent.click(btn)
    expect(handleArrival).toHaveBeenCalledWith('m1', 'p1')
  })

  it('renders "Gatavs sākt spēli" when player arrived but is not ready', () => {
    const handleReady = vi.fn()
    const match = {
      id: 'm1',
      status: 'scheduled',
      arrivals: { p1: true },
      ready: { p1: false },
      setResults: [],
    }

    render(
      <PlayerActionBar
        tournament={baseTournament}
        match={match}
        player={player}
        onReadyToPlay={handleReady}
      />,
    )

    const btn = screen.getByRole('button', { name: /Gatavs sākt spēli/i })
    expect(btn).toBeInTheDocument()

    fireEvent.click(btn)
    expect(handleReady).toHaveBeenCalledWith('m1', 'p1')
  })

  it('renders "Apstiprināt gala rezultātu" when awaiting confirmation', () => {
    const handleConfirm = vi.fn()
    const match = {
      id: 'm1',
      playerAId: 'p1',
      playerBId: 'p2',
      status: 'awaiting_confirmation',
      arrivals: { p1: true, p2: true },
      setResults: [{ winnerId: 'p1' }, { winnerId: 'p1' }, { winnerId: 'p1' }, { winnerId: 'p1' }],
      confirmations: { p1: false, p2: true },
    }

    render(
      <PlayerActionBar
        tournament={baseTournament}
        match={match}
        player={player}
        onConfirm={handleConfirm}
      />,
    )

    const btn = screen.getByRole('button', { name: /Apstiprināt gala rezultātu/i })
    expect(btn).toBeInTheDocument()

    fireEvent.click(btn)
    expect(handleConfirm).toHaveBeenCalledWith('m1', 'p1')
  })

  it('renders "Tiesnesis izsaukts pie galda" with cancel option when disputed', () => {
    const handleCancel = vi.fn()
    const match = {
      id: 'm1',
      status: 'disputed',
      refereeRequested: true,
      refereeRequestedBy: 'p1',
      setResults: [],
    }

    render(
      <PlayerActionBar
        tournament={baseTournament}
        match={match}
        player={player}
        onCancelReferee={handleCancel}
      />,
    )

    expect(screen.getByText(/Tiesnesis izsaukts pie galda/i)).toBeInTheDocument()
    const cancelBtn = screen.getByRole('button', { name: /Atsaukt/i })
    expect(cancelBtn).toBeInTheDocument()

    fireEvent.click(cancelBtn)
    expect(handleCancel).toHaveBeenCalledWith('m1', 'p1')
  })

  it('renders "Mačs noslēdzies ✓" when completed', () => {
    const match = {
      id: 'm1',
      status: 'completed',
      setResults: [],
      confirmations: { p1: true, p2: true },
    }

    render(
      <PlayerActionBar
        tournament={baseTournament}
        match={match}
        player={player}
      />,
    )

    expect(screen.getByText(/Mačs noslēdzies ✓/i)).toBeInTheDocument()
  })
})

