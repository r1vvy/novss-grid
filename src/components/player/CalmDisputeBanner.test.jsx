import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CalmDisputeBanner } from './CalmDisputeBanner'

describe('CalmDisputeBanner De-escalating UX', () => {
  it('renders reassuring non-alarmist instructions and puck-freeze physical rule guidance', () => {
    const match = {
      id: 'm1',
      refereeRequestedBy: 'p1',
      contestMeta: { reason: 'Puck crossed line improperly' },
    }

    render(<CalmDisputeBanner match={match} playerId="p2" />)

    expect(screen.getByText('Tiesnesis ir informēts un dodas uz jūsu galdu')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Lūgums neaiztikt kauliņus un saglabāt galda stāvokli nemainīgu līdz tiesneša klātbūtnei.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText(/Puck crossed line improperly/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Atsaukt tiesneša izsaukumu/i })).toBeNull()
  })

  it('renders cancel dispute CTA if current player is the caller and triggers callback', () => {
    const handleCancel = vi.fn()
    const match = {
      id: 'm1',
      refereeRequestedBy: 'p1',
    }

    render(
      <CalmDisputeBanner
        match={match}
        playerId="p1"
        onCancelDispute={handleCancel}
      />,
    )

    const cancelBtn = screen.getByRole('button', { name: /Atsaukt tiesneša izsaukumu/i })
    expect(cancelBtn).toBeInTheDocument()

    fireEvent.click(cancelBtn)
    expect(handleCancel).toHaveBeenCalledWith('m1', 'p1')
  })
})

