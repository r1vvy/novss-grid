import { describe, it, expect, vi, beforeEach } from 'vitest'
import { triggerHaptic, playWoodClack } from './haptics'

describe('Haptics & Acoustic Feedback Utility', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('triggers navigator.vibrate with correct pattern when supported', () => {
    const vibrateMock = vi.fn().mockReturnValue(true)
    Object.defineProperty(navigator, 'vibrate', {
      value: vibrateMock,
      writable: true,
      configurable: true,
    })

    triggerHaptic('selection', { acoustic: false })
    expect(vibrateMock).toHaveBeenCalledWith([15])

    triggerHaptic('medium', { acoustic: false })
    expect(vibrateMock).toHaveBeenCalledWith([45])

    triggerHaptic('success', { acoustic: false })
    expect(vibrateMock).toHaveBeenCalledWith([20, 50, 25])
  })

  it('safely handles missing navigator.vibrate without throwing', () => {
    Object.defineProperty(navigator, 'vibrate', {
      value: undefined,
      writable: true,
      configurable: true,
    })

    expect(() => triggerHaptic('selection', { acoustic: false })).not.toThrow()
  })

  it('safely executes playWoodClack without throwing even in headless environment', () => {
    expect(() => playWoodClack()).not.toThrow()
    expect(() => triggerHaptic('selection', { acoustic: true })).not.toThrow()
  })
})

