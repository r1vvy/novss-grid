import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { HomeScreen } from './HomeScreen'
import { initialTournament } from '../data/mockTournament'

describe('HomeScreen', () => {
  it('renders all-in-one hero viewport with active tourneys displayed on the table and removed old metric cards', () => {
    render(
      <HomeScreen
        tournament={initialTournament}
        hasPlayerSession={false}
        selectedPlayer={null}
        onOrganizer={vi.fn()}
        onPlayer={vi.fn()}
      />
    )

    // Requested exact titles and descriptions
    expect(
      screen.getByRole('heading', { level: 1, name: /Novuss — Latvijas Nacionālais Sports/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /Kopš 1927. gada — dinamiska divcīņa uz 100 × 100 cm finiera galda ar 8 sarkaniem un 8 melniem kauliņiem/i
      )
    ).toBeInTheDocument()

    // Novuss illustration
    expect(screen.getByRole('img', { name: /Novusa galda vizualizācija/i })).toBeInTheDocument()

    // Currently active tourneys display on the table
    expect(screen.getByText('Aktīvie turnīri')).toBeInTheDocument()
    expect(screen.getAllByText(initialTournament.name).length).toBeGreaterThan(0)
    expect(screen.getByText('Kurzemes Pavasara Kauss')).toBeInTheDocument()

    // Verify removed old metric cards
    expect(screen.queryByText('Dalībnieki')).not.toBeInTheDocument()
    expect(screen.queryByText('Galdi')).not.toBeInTheDocument()

    // Redundant 8 red and 8 black element removed
    expect(screen.queryByText('8 Sarkani')).not.toBeInTheDocument()
    expect(screen.queryByText('8 Melni')).not.toBeInTheDocument()

    // Verify table dimension standards are REMOVED from the screen
    expect(screen.queryByText('Galds: 1000 × 1000 mm')).not.toBeInTheDocument()
    expect(screen.queryByText('Caurumi: Ø 100 mm')).not.toBeInTheDocument()
    expect(screen.queryByText('Vidus aplis: Ø 250 mm')).not.toBeInTheDocument()
    expect(screen.queryByText('Ø 30 mm kauliņi')).not.toBeInTheDocument()
    expect(screen.queryByText('Ø 44.5 mm ripa')).not.toBeInTheDocument()
    expect(screen.queryByText('1000 × 1000 mm standarts')).not.toBeInTheDocument()

    // Role options present right in the hero viewport
    expect(screen.getByRole('heading', { level: 2, name: /Organizators/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /Spēlētāja portāls/i })).toBeInTheDocument()
  })

  it('flips organizer card to login form and submits login credentials', () => {
    const handleOrganizerLogin = vi.fn()

    render(
      <HomeScreen
        tournament={initialTournament}
        hasPlayerSession={false}
        selectedPlayer={null}
        organizerAuthenticated={false}
        onOrganizerLogin={handleOrganizerLogin}
        onOrganizer={vi.fn()}
        onPlayer={vi.fn()}
      />
    )

    // Initially front button is visible
    const flipButton = screen.getByRole('button', { name: /Pieslēgties panelim/i })
    expect(flipButton).toBeInTheDocument()

    // Click to flip
    fireEvent.click(flipButton)

    // Back face form is visible
    expect(screen.getByText('Organizatora ieeja')).toBeInTheDocument()
    const submitBtn = screen.getByRole('button', { name: /Ieiet vadības panelī/i })
    fireEvent.click(submitBtn)

    expect(handleOrganizerLogin).toHaveBeenCalledWith({
      email: 'organizer@nvssgrid.local',
      password: 'parole123',
    })

    // Click back to flip back
    const flipBackBtn = screen.getAllByRole('button', { name: /Atpakaļ/i })[0]
    fireEvent.click(flipBackBtn)
  })

  it('flips player card to code input and validates check-in', () => {
    const handlePlayerCheckIn = vi.fn().mockReturnValue(true)

    render(
      <HomeScreen
        tournament={initialTournament}
        hasPlayerSession={false}
        selectedPlayer={null}
        onOrganizer={vi.fn()}
        onPlayer={vi.fn()}
        onPlayerCheckIn={handlePlayerCheckIn}
      />
    )

    // Flip to code input
    const flipPlayerBtn = screen.getByRole('button', { name: /Ievadīt spēlētāja kodu/i })
    fireEvent.click(flipPlayerBtn)

    expect(screen.getByText('Ievadiet dalībnieka kodu')).toBeInTheDocument()

    const codeInput = screen.getByPlaceholderText('ANNA42')
    fireEvent.change(codeInput, { target: { value: 'janis7' } })

    const connectBtn = screen.getByRole('button', { name: /Pieslēgties galdam/i })
    fireEvent.click(connectBtn)

    expect(handlePlayerCheckIn).toHaveBeenCalledWith('JANIS7')

    // Click back to flip back
    const flipBackBtn = screen.getAllByRole('button', { name: /Atpakaļ/i })[1]
    fireEvent.click(flipBackBtn)
  })

  it('displays personalized active session information when player is logged in', () => {
    const activePlayer = {
      id: 'p1',
      name: 'Anna Kalnina',
      representation: 'Riga',
    }
    const handlePlayer = vi.fn()

    render(
      <HomeScreen
        tournament={initialTournament}
        hasPlayerSession={true}
        selectedPlayer={activePlayer}
        onOrganizer={vi.fn()}
        onPlayer={handlePlayer}
      />
    )

    expect(screen.getByText(/Aktīva sesija/i)).toBeInTheDocument()
    expect(screen.getByText(/Anna Kalnina/i)).toBeInTheDocument()
    const continueBtn = screen.getByRole('button', { name: /Turpināt manu spēli/i })
    expect(continueBtn).toBeInTheDocument()

    fireEvent.click(continueBtn)
    expect(handlePlayer).toHaveBeenCalledTimes(1)
  })
})
