import { useEffect, useState, useCallback } from 'react'

const ANNOUNCEMENT_EVENT = 'nvss:live_announcement'

/**
 * Dispatch a live announcement event that is captured by useLiveAnnouncements
 * and rendered via LiveAnnouncer (with aria-live="polite").
 *
 * @param {string} message Announcement message for VoiceOver and visual banner
 * @param {'info' | 'success' | 'warning' | 'error'} [type='info']
 */
export function announceLive(message, type = 'info') {
  if (typeof window === 'undefined') return
  const event = new CustomEvent(ANNOUNCEMENT_EVENT, {
    detail: {
      id: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      message,
      type,
      timestamp: Date.now(),
    },
  })
  window.dispatchEvent(event)
}

/**
 * Custom hook to manage live announcements for WCAG 2.2 AA accessibility
 * and visual notifications.
 */
export function useLiveAnnouncements({ autoDismissTimeout = 4000 } = {}) {
  const [announcements, setAnnouncements] = useState([])
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null)

  const dismiss = useCallback((id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))
    setCurrentAnnouncement((prev) => (prev?.id === id ? null : prev))
  }, [])

  const announce = useCallback((message, type = 'info') => {
    announceLive(message, type)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    function handleEvent(event) {
      const announcement = event.detail
      if (!announcement || !announcement.message) return

      setCurrentAnnouncement(announcement)
      setAnnouncements((prev) => [announcement, ...prev.slice(0, 9)])

      if (autoDismissTimeout > 0) {
        setTimeout(() => {
          dismiss(announcement.id)
        }, autoDismissTimeout)
      }
    }

    window.addEventListener(ANNOUNCEMENT_EVENT, handleEvent)
    return () => {
      window.removeEventListener(ANNOUNCEMENT_EVENT, handleEvent)
    }
  }, [autoDismissTimeout, dismiss])

  return {
    announcements,
    currentAnnouncement,
    announce,
    dismiss,
  }
}

