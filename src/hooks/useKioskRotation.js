import { useEffect, useState, useCallback, useRef } from 'react'

export function useKioskRotation({
  slides = ['tables', 'standings'],
  intervalSeconds = 15,
  defaultPlaying = true,
} = {}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(defaultPlaying)
  const [progress, setProgress] = useState(0)
  const [secondsRemaining, setSecondsRemaining] = useState(intervalSeconds)

  const startTimeRef = useRef(Date.now())
  const totalDurationMs = intervalSeconds * 1000

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length)
    startTimeRef.current = Date.now()
    setProgress(0)
    setSecondsRemaining(intervalSeconds)
  }, [slides.length, intervalSeconds])

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)
    startTimeRef.current = Date.now()
    setProgress(0)
    setSecondsRemaining(intervalSeconds)
  }, [slides.length, intervalSeconds])

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev)
    startTimeRef.current = Date.now()
  }, [])

  const setSlide = useCallback(
    (slide) => {
      const idx = typeof slide === 'number' ? slide : slides.indexOf(slide)
      if (idx >= 0 && idx < slides.length) {
        setCurrentSlideIndex(idx)
        startTimeRef.current = Date.now()
        setProgress(0)
        setSecondsRemaining(intervalSeconds)
      }
    },
    [slides, intervalSeconds],
  )

  // Timer loop for auto-rotation and progress updates
  useEffect(() => {
    if (!isPlaying) return

    startTimeRef.current = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const currentProgress = Math.min(100, (elapsed / totalDurationMs) * 100)
      const remaining = Math.max(0, Math.ceil((totalDurationMs - elapsed) / 1000))

      setProgress(currentProgress)
      setSecondsRemaining(remaining)

      if (elapsed >= totalDurationMs) {
        nextSlide()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, totalDurationMs, nextSlide])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if (e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        nextSlide()
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, nextSlide, prevSlide])

  return {
    currentSlide: slides[currentSlideIndex],
    currentSlideIndex,
    isPlaying,
    progress,
    secondsRemaining,
    nextSlide,
    prevSlide,
    togglePlay,
    setSlide,
  }
}

