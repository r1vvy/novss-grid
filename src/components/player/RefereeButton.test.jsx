import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RefereeButton } from './RefereeButton'

describe('RefereeButton 2-Step Arming Safety', () => {
  it('calls onClick immediately when requireConfirm is false', () => {
    const onClick = vi.fn()
    render(<RefereeButton disabled={false} onClick={onClick} requireConfirm={false} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('requires two clicks to fire when requireConfirm is true', () => {
    const onClick = vi.fn()
    render(<RefereeButton disabled={false} onClick={onClick} requireConfirm={true} />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Izsaukt tiesnesi')

    // First click arms the button
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
    expect(button).toHaveTextContent('Piespiediet vēlreiz, lai izsauktu tiesnesi')

    // Second click confirms and invokes callback
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('has min-h-[50px] touch target meeting Apple HIG >= 44pt rule', () => {
    render(<RefereeButton disabled={false} onClick={vi.fn()} />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('min-h-[50px]')
  })
})

