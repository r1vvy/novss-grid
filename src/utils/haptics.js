/**
 * Haptic and Acoustic Feedback Utility for Novuss-Grid
 * Provides Apple HIG-inspired tactile vibration and procedural
 * wood-on-wood Novuss puck acoustic feedback via Web Audio API.
 */

let sharedAudioContext = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null

  if (!sharedAudioContext) {
    try {
      sharedAudioContext = new AudioCtx()
    } catch {
      return null
    }
  }

  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {
      // AudioContext resume blocked until user interaction
    })
  }

  return sharedAudioContext
}

/**
 * Procedural Novuss birch wood-on-wood "clack" impulse.
 * Emulates the acoustic transient of a Novuss carom puck collision (~820Hz damped wave).
 */
export function playWoodClack({ frequency = 820, duration = 0.045, gain = 0.22 } = {}) {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    // Triangle wave gives wooden harmonic overtone warmth
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(frequency, now)
    // Subtle initial pitch drop emulates puck physical impact elasticity
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.65, now + duration)

    // Bandpass filter to shape the Novuss table acoustic resonance
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(frequency, now)
    filter.Q.setValueAtTime(3.5, now)

    // Rapid exponential decay envelope (wood impact)
    gainNode.gain.setValueAtTime(gain, now)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    osc.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + duration)
  } catch {
    // Ignore audio playback failure (e.g., autoplay restrictions)
  }
}

const HAPTIC_PATTERNS = {
  selection: [15],
  light: [25],
  medium: [45],
  success: [20, 50, 25],
  warning: [40, 60, 40],
  error: [60, 40, 60, 40, 80],
}

/**
 * Trigger tactile haptic feedback with navigator.vibrate fallback and
 * procedural wood clack acoustic cues.
 *
 * @param {'selection' | 'light' | 'medium' | 'success' | 'warning' | 'error'} type
 * @param {object} [options]
 * @param {boolean} [options.acoustic=true] Whether to play the Novuss wood clack
 */
export function triggerHaptic(type = 'selection', { acoustic = true } = {}) {
  // 1. Tactile Vibration
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      const pattern = HAPTIC_PATTERNS[type] || HAPTIC_PATTERNS.selection
      navigator.vibrate(pattern)
    } catch {
      // Ignore vibration error
    }
  }

  // 2. Tactile Wood Clack Acoustic Feedback
  if (acoustic) {
    if (type === 'selection' || type === 'light') {
      playWoodClack({ frequency: 820, duration: 0.038, gain: 0.18 })
    } else if (type === 'medium') {
      playWoodClack({ frequency: 780, duration: 0.05, gain: 0.25 })
    } else if (type === 'success') {
      playWoodClack({ frequency: 880, duration: 0.06, gain: 0.28 })
    } else if (type === 'warning') {
      playWoodClack({ frequency: 620, duration: 0.07, gain: 0.3 })
    } else if (type === 'error') {
      playWoodClack({ frequency: 450, duration: 0.09, gain: 0.35 })
    }
  }
}

