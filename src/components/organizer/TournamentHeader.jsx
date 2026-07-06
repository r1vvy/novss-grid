import React from 'react'
import { AlertTriangle, CheckCircle2, Clock, Users } from 'lucide-react'
import { StatPill } from './OrganizerDashboard'
import { deriveMatchStatus } from '../../utils/tournament'

export function TournamentHeader({ tournament, matches, alerts }) {
  const active = matches.filter((match) => ['in_progress', 'disputed'].includes(deriveMatchStatus(match))).length
  const verified = matches.filter((match) => deriveMatchStatus(match) === 'verified').length

  return (
    <header className="rounded-md border border-nvssBorder bg-nvssSurface p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm text-nvssMuted">{tournament.venue} · {tournament.updatedAt}</p>
          <h2 className="mt-1 text-2xl font-semibold">{tournament.name}</h2>
          <p className="mt-1 text-sm text-nvssMuted">Status: <span className="font-semibold text-white">{tournament.status}</span></p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:min-w-[620px] xl:grid-cols-4">
          <StatPill icon={Clock} label="Round" value={`${tournament.currentRound}/${tournament.totalRounds}`} />
          <StatPill icon={Users} label="Tables" value={matches.length} />
          <StatPill icon={CheckCircle2} label="Verified" value={verified} />
          <StatPill icon={AlertTriangle} label="Alerts" value={alerts.length} />
        </div>
      </div>
    </header>
  )
}
