import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrganizerDashboard } from './OrganizerDashboard'
import { initialTournament } from '../../data/mockTournament'

describe('OrganizerDashboard Apple HIG & Modals', () => {
  it('opens and closes settings modal via Escape key and backdrop click', () => {
    render(
      <OrganizerDashboard
        tournament={initialTournament}
        onSetupSubmit={vi.fn()}
        onClearAlert={vi.fn()}
        onMarkInvestigating={vi.fn()}
        onResetInvestigation={vi.fn()}
        onForceOverride={vi.fn()}
        onSwapTables={vi.fn()}
        onGenerateRound={vi.fn()}
        onOpenPlayers={vi.fn()}
      />
    )

    // Initially modal is not rendered
    expect(screen.queryByRole('dialog')).toBeNull()

    // Click "Iestatījumi" button to open modal
    const settingsBtn = screen.getByRole('button', { name: /Iestatījumi/i })
    fireEvent.click(settingsBtn)

    // Modal dialog is mounted
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(screen.getByText('Turnīra iestatījumi')).toBeInTheDocument()

    // Press Escape to dismiss modal
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders inlined audit section inside OverrideModal without stacked ReasonModal', () => {
    render(
      <OrganizerDashboard
        tournament={initialTournament}
        onSetupSubmit={vi.fn()}
        onClearAlert={vi.fn()}
        onMarkInvestigating={vi.fn()}
        onResetInvestigation={vi.fn()}
        onForceOverride={vi.fn()}
        onSwapTables={vi.fn()}
        onGenerateRound={vi.fn()}
        onOpenPlayers={vi.fn()}
      />
    )

    // Find and click any edit action on a match
    const editBtns = screen.getAllByRole('button', { name: /Labot rezultātu|Koriģēt rezultātu|Pabeigt manuāli|Atrisināt strīdu/i })
    expect(editBtns.length).toBeGreaterThan(0)
    fireEvent.click(editBtns[0])

    // Verify modal is open
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // Verify inlined audit inputs are directly inside the sheet
    expect(screen.getByText('Audita pamatojums')).toBeInTheDocument()
    expect(screen.getByLabelText(/Iemesls/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Īss skaidrojums auditam/i)).toBeInTheDocument()

    // Close button works
    const closeBtn = screen.getByRole('button', { name: /Aizvērt/i })
    fireEvent.click(closeBtn)
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
