import React from 'react'
import { CheckCircle2, Clock, Settings, SquarePen, Users } from 'lucide-react'
import { deriveMatchStatus } from '../../utils/tournament'

export function TournamentHeader({ tournament, matches, alerts, onOpenSettings, onOpenPlayers }) {
  const active = matches.filter((match) => ['in_progress', 'disputed'].includes(deriveMatchStatus(match, tournament.maxSetsPerMatch))).length
  const completed = matches.filter((match) => deriveMatchStatus(match, tournament.maxSetsPerMatch) === 'completed').length

  return (
    <header className="rounded-2xl border border-white/80 bg-white/60 p-5 sm:p-6 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.95),0_12px_36px_rgba(0,0,0,0.04)] backdrop-blur-2xl">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#8E8E93]">
            <span>{tournament.venue}</span>
            <span>·</span>
            <span>{tournament.updatedAt}</span>
            <span className="inline-flex items-center rounded-full border border-apple-blue/20 bg-apple-blue/10 px-2.5 py-0.5 text-xs font-semibold text-apple-blue">
              {tournament.status}
            </span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1C1E]">
            {tournament.name}
          </h2>
        </div>

        <div className="flex flex-col gap-3.5 xl:min-w-[560px]">
          <div className="flex flex-wrap justify-start gap-2.5 xl:justify-end">
            <button
              type="button"
              onClick={onOpenPlayers}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/80 bg-white/70 backdrop-blur-md px-4 text-xs font-semibold text-[#1C1C1E] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)] transition-all hover:bg-white/90 active:scale-[0.98]"
            >
              <SquarePen size={15} className="text-apple-secondary" strokeWidth={2.2} />
              <span>Spēlētāji (<span className="tabular-nums font-mono">{tournament.players.length}</span>)</span>
            </button>
            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/80 bg-white/70 backdrop-blur-md px-4 text-xs font-semibold text-[#1C1C1E] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)] transition-all hover:bg-white/90 active:scale-[0.98]"
            >
              <Settings size={15} className="text-apple-secondary" strokeWidth={2.2} />
              <span>Iestatījumi</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <AppleStatCard
              icon={Clock}
              iconColor="text-apple-blue"
              iconBg="bg-apple-blue/10"
              label="Kārta"
              value={`${tournament.currentRound} / ${tournament.totalRounds}`}
            />
            <AppleStatCard
              icon={Users}
              iconColor="text-apple-purple"
              iconBg="bg-apple-purple/10"
              label="Aktīvie galdi"
              value={matches.length}
            />
            <AppleStatCard
              icon={CheckCircle2}
              iconColor="text-apple-green"
              iconBg="bg-apple-green/10"
              label="Pabeigti"
              value={`${completed} / ${matches.length}`}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

function AppleStatCard({ icon: Icon, iconColor, iconBg, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/50 px-3.5 py-3 backdrop-blur-md shadow-xs transition hover:bg-white/70">
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
        <Icon size={17} strokeWidth={2.3} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8E93] truncate">{label}</p>
        <p className="text-base sm:text-lg font-bold tabular-nums text-[#1C1C1E] leading-tight mt-0.5 truncate">{value}</p>
      </div>
    </div>
  )
}
