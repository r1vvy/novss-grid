import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { HomeScreen } from './HomeScreen'
import { initialTournament } from '../data/mockTournament'

describe('HomeScreen', () => {
  it('renders tournament information and metrics properly', () => {
    const handleOrganizer = vi.fn()
    const handlePlayer = vi.fn()

    render(
      <HomeScreen
        tournament={initialTournament}
        hasPlayerSession={false}
        selectedPlayer={null}
        onOrganizer={handleOrganizer}
        onPlayer={handlePlayer}
      />
    )

    // Heading and tournament title
    expect(screen.getByText(/Novusa turnīru/i)).toBeInTheDocument()
    expect(screen.getByText(initialTournament.name)).toBeInTheDocument()
    expect(screen.getByText(initialTournament.venue)).toBeInTheDocument()

    // Metrics
    expect(screen.getByText('Kārta')).toBeInTheDocument()
    expect(screen.getByText('Dalībnieki')).toBeInTheDocument()
    expect(screen.getByText('Galdi')).toBeInTheDocument()

    // Novuss illustration
    expect(screen.getByRole('img', { name: /Novusa galda vizualizācija/i })).toBeInTheDocument()
  })

  it('triggers onOrganizer when clicking organizer CTA', () => {
    const handleOrganizer = vi.fn()
    const handlePlayer = vi.fn()

    render(
      <HomeScreen
        tournament={initialTournament}
        hasPlayerSession={false}
        selectedPlayer={null}
        onOrganizer={handleOrganizer}
        onPlayer={handlePlayer}
      />
    )

    const organizerButton = screen.getByRole('button', { name: /Atvērt organizatora paneli/i })
    fireEvent.click(organizerButton)

    expect(handleOrganizer).toHaveBeenCalledTimes(1)
  })

  it('triggers onPlayer when clicking player CTA', () => {
    const handleOrganizer = vi.fn()
    const handlePlayer = vi.fn()

    render(
      <HomeScreen
        tournament={initialTournament}
        hasPlayerSession={false}
        selectedPlayer={null}
        onOrganizer={handleOrganizer}
        onPlayer={handlePlayer}
      />
    )

    const playerButton = screen.getByRole('button', { name: /Ievadīt spēlētāja kodu/i })
    fireEvent.click(playerButton)

    expect(handlePlayer).toHaveBeenCalledTimes(1)
  })

  it('displays personalized active session information when player is logged in', () => {
    const activePlayer = {
      id: 'p1',
      name: 'Anna Kalnina',
      representation: 'Riga',
    }

    render(
      <HomeScreen
        tournament={initialTournament}
        hasPlayerSession={true}
        selectedPlayer={activePlayer}
        onOrganizer={vi.fn()}
        onPlayer={vi.fn()}
      />
    )

    expect(screen.getByText(/Aktīva sesija/i)).toBeInTheDocument()
    expect(screen.getByText(/Anna Kalnina/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Turpināt manu spēli/i })).toBeInTheDocument()
  })
})
