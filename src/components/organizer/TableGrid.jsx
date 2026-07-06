import React from 'react'
import { MatchCard } from './MatchCard'

export function TableGrid({ tournament, matches, onClearAlert }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {matches.map((match) => (
        <MatchCard key={match.id} tournament={tournament} match={match} onClearAlert={onClearAlert} />
      ))}
      {matches.length === 0 && (
        <div className="rounded-md border border-dashed border-nvssBorder bg-nvssSurface p-6 text-sm text-nvssMuted">
          No active round tables. Registration tournament initialized.
        </div>
      )}
    </section>
  )
}
