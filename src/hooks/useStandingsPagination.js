import { useEffect, useMemo, useState, useCallback } from 'react'

/**
 * Custom hook to manage standings pagination and clamping.
 *
 * @param {Array} standings - The list of player standings
 * @param {number} pageSize - Number of rows to display per page (default: 30)
 * @returns {{
 *   pagedStandings: Array,
 *   currentPage: number,
 *   totalPages: number,
 *   nextPage: () => void,
 *   prevPage: () => void,
 *   setPage: (page: number) => void
 * }}
 */
export function useStandingsPagination(standings = [], pageSize = 30) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(standings.length / pageSize))

  useEffect(() => {
    setCurrentPage((current) => Math.min(Math.max(1, current), totalPages))
  }, [totalPages])

  const pagedStandings = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return standings.slice(start, start + pageSize)
  }, [standings, currentPage, pageSize])

  const nextPage = useCallback(() => {
    setCurrentPage((current) => Math.min(totalPages, current + 1))
  }, [totalPages])

  const prevPage = useCallback(() => {
    setCurrentPage((current) => Math.max(1, current - 1))
  }, [])

  const setPage = useCallback(
    (page) => {
      const pageNum = Number(page) || 1
      setCurrentPage(Math.min(totalPages, Math.max(1, pageNum)))
    },
    [totalPages],
  )

  return {
    pagedStandings,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    setPage,
  }
}
