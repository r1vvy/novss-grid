import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ScoreStepper } from './ScoreStepper'

describe('ScoreStepper Apple HIG & Functionality', () => {
  it('renders buttons with minimum 44x44pt touch targets', () => {
    render(
      <ScoreStepper
        disabled={false}
        targetReached={false}
        playerAName="Jānis Bērziņš"
        playerBName="Pēteris Ozols"
        playerAScore={2}
        playerBScore={1}
        onPlayerAAdd={vi.fn()}
        onPlayerBAdd={vi.fn()}
        onPlayerARemove={vi.fn()}
        onPlayerBRemove={vi.fn()}
      />
    )

    const addButtons = screen.getAllByRole('button', { name: /Pievienot setu/i })
    const removeButtons = screen.getAllByRole('button', { name: /Noņemt setu/i })

    expect(addButtons).toHaveLength(2)
    expect(removeButtons).toHaveLength(2)

    addButtons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]')
      expect(btn.className).toContain('min-w-[44px]')
    })

    removeButtons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]')
      expect(btn.className).toContain('min-w-[44px]')
    })
  })

  it('triggers onPlayerAAdd callback on tap', () => {
    const onAdd = vi.fn()
    render(
      <ScoreStepper
        disabled={false}
        targetReached={false}
        playerAName="Jānis Bērziņš"
        playerBName="Pēteris Ozols"
        playerAScore={0}
        playerBScore={0}
        onPlayerAAdd={onAdd}
        onPlayerBAdd={vi.fn()}
        onPlayerARemove={vi.fn()}
        onPlayerBRemove={vi.fn()}
      />
    )

    const btn = screen.getByRole('button', { name: /Pievienot setu: Jānis Bērziņš/i })
    fireEvent.click(btn)
    expect(onAdd).toHaveBeenCalledTimes(1)
  })

  it('disables add buttons when targetReached is true', () => {
    render(
      <ScoreStepper
        disabled={false}
        targetReached={true}
        playerAName="Jānis Bērziņš"
        playerBName="Pēteris Ozols"
        playerAScore={4}
        playerBScore={0}
        onPlayerAAdd={vi.fn()}
        onPlayerBAdd={vi.fn()}
        onPlayerARemove={vi.fn()}
        onPlayerBRemove={vi.fn()}
      />
    )

    const addButtons = screen.getAllByRole('button', { name: /Pievienot setu/i })
    addButtons.forEach((btn) => {
      expect(btn).toBeDisabled()
    })
  })
})

