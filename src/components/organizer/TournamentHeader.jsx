import React from 'react'
import { AlertTriangle, CheckCircle2, Clock, Settings, SquarePen, Users } from 'lucide-react'
import { StatPill } from './OrganizerDashboard'
import { deriveMatchStatus } from '../../utils/tournament'

export function TournamentHeader({ tournament, matches, alerts, onOpenSettings, onOpenPlayers }) {
  const active = matches.filter((match) => ['in_progress', 'disputed'].includes(deriveMatchStatus(match))).length
  const completed = matches.filter((match) => deriveMatchStatus(match) === 'completed').length

  return (
    <header className="rounded-md border border-nvssBorder bg-nvssSurface p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm text-nvssMuted">{tournament.venue} · {tournament.updatedAt}</p>
          <h2 className="mt-1 text-2xl font-semibold">{tournament.name}</h2>
          <p className="mt-1 text-sm text-nvssMuted">Statuss: <span className="font-semibold text-white">{tournament.status}</span></p>
        </div>
        <div className="flex flex-col gap-3 xl:min-w-[620px]">
          <div className="flex flex-wrap justify-start gap-2 xl:justify-end">
            <button
              type="button"
              onClick={onOpenPlayers}
              className="flex min-h-[40px] items-center gap-2 rounded border border-nvssBorder bg-nvssBg px-3 text-sm font-semibold text-nvssMuted hover:text-white"
            >
              <SquarePen size={16} />
              Spēlētāji
            </button>
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex min-h-[40px] items-center gap-2 rounded border border-nvssBorder bg-nvssBg px-3 text-sm font-semibold text-nvssMuted hover:text-white"
            >
              <Settings size={16} />
              Iestatījumi
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          <StatPill icon={Clock} label="Kārta" value={`${tournament.currentRound}/${tournament.totalRounds}`} color={"text-nvssGreen"} />
          <StatPill icon={Users} label="Galdi" value={matches.length} color={"text-nvssGreen"} />
          <StatPill icon={CheckCircle2} label="Pabeigti" value={completed} color={"text-nvssGreen"} />
          </div>
        </div>
      </div>
    </header>
  )
}
