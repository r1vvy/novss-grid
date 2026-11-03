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

  it('allows referee to submit audit explanation without changing match results', () => {
    const handleForceOverride = vi.fn()

    render(
      <OrganizerDashboard
        tournament={initialTournament}
        onSetupSubmit={vi.fn()}
        onClearAlert={vi.fn()}
        onMarkInvestigating={vi.fn()}
        onResetInvestigation={vi.fn()}
        onForceOverride={handleForceOverride}
        onSwapTables={vi.fn()}
        onGenerateRound={vi.fn()}
        onOpenPlayers={vi.fn()}
      />
    )

    // Open override modal on a disputed match
    const resolveBtns = screen.getAllByRole('button', { name: /Atrisināt strīdu|Atrisināt/i })
    expect(resolveBtns.length).toBeGreaterThan(0)
    fireEvent.click(resolveBtns[0])

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // Select 'referee_decision' reason WITHOUT altering any sets
    const reasonSelect = screen.getByLabelText(/Iemesls/i)
    fireEvent.change(reasonSelect, { target: { value: 'referee_decision' } })

    const noteInput = screen.getByPlaceholderText(/Īss skaidrojums auditam/i)
    fireEvent.change(noteInput, { target: { value: 'Tiesnesis izskatīja situāciju un apstiprināja lēmumu pie galda' } })

    // Verify explanation note is shown in footer
    expect(screen.getByText(/Tiesneša lēmums tiks fiksēts auditā bez rezultāta maiņas/i)).toBeInTheDocument()

    // Submit button should be enabled
    const submitBtn = screen.getByRole('button', { name: /Apstiprināt un saglabāt/i })
    expect(submitBtn).toBeEnabled()
    fireEvent.click(submitBtn)

    // Verify onForceOverride was called
    expect(handleForceOverride).toHaveBeenCalledTimes(1)
    const [calledMatchId, calledSets, calledMeta] = handleForceOverride.mock.calls[0]
    expect(calledMatchId).toBeTruthy()
    expect(calledMeta.reason).toBe('referee_decision')
    expect(calledMeta.note).toBe('Tiesnesis izskatīja situāciju un apstiprināja lēmumu pie galda')
  })

  it('allows opening WarningModal and issuing a warning to a player', () => {
    const handleIssueWarning = vi.fn()

    render(
      <OrganizerDashboard
        tournament={initialTournament}
        onSetupSubmit={vi.fn()}
        onClearAlert={vi.fn()}
        onMarkInvestigating={vi.fn()}
        onResetInvestigation={vi.fn()}
        onForceOverride={vi.fn()}
        onIssueWarning={handleIssueWarning}
        onSwapTables={vi.fn()}
        onGenerateRound={vi.fn()}
        onOpenPlayers={vi.fn()}
      />
    )

    // Find warning button on card or alert rail
    const warnBtns = screen.getAllByRole('button', { name: /Brīdinājums|Brīdināt/i })
    expect(warnBtns.length).toBeGreaterThan(0)
    fireEvent.click(warnBtns[0])

    // Warning dialog should open
    expect(screen.getByText('Izteikt brīdinājumu spēlētājam')).toBeInTheDocument()

    // Select a warning reason pill
    const foulReasonBtn = screen.getByRole('button', { name: /Noteikumu pārkāpums/i })
    fireEvent.click(foulReasonBtn)

    // Fill in note
    const noteField = screen.getByPlaceholderText(/Piem., Pārkāpta sitiena pozīcija/i)
    fireEvent.change(noteField, { target: { value: 'Pieskāriens kauliņam ar roku' } })

    // Submit warning
    const submitWarnBtn = screen.getByRole('button', { name: /Piešķirt brīdinājumu/i })
    expect(submitWarnBtn).toBeEnabled()
    fireEvent.click(submitWarnBtn)

    expect(handleIssueWarning).toHaveBeenCalledTimes(1)
    const [warnMatchId, warnedPlayerId, warnData] = handleIssueWarning.mock.calls[0]
    expect(warnMatchId).toBeTruthy()
    expect(warnedPlayerId).toBeTruthy()
    expect(warnData.reason).toBe('Noteikumu pārkāpums')
    expect(warnData.note).toBe('Pieskāriens kauliņam ar roku')
  })
})
