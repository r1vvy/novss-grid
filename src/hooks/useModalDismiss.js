import { useCallback, useEffect } from 'react'

/**
 * Custom hook to manage modal dismissal lifecycle conforming to Apple HIG.
 * Handles:
 * 1. Escape keydown listener with safe cleanup.
 * 2. Body scroll-lock (overflow: hidden) during modal presentation.
 * 3. Safe backdrop click handler preventing clicks on modal children from dismissing.
 *
 * @param {boolean} isOpen - Whether the modal/sheet is currently visible
 * @param {Function} onClose - Callback invoked to dismiss the modal
 * @returns {{ onBackdropClick: (event: React.SyntheticEvent) => void }}
 */
export function useModalDismiss(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose?.()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const onBackdropClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) {
        onClose?.()
      }
    },
    [onClose],
  )

  return { onBackdropClick }
}
