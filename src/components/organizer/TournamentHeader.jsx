import React from 'react'
import { CheckCircle2, Clock, Settings, SquarePen, Users } from 'lucide-react'
import { deriveMatchStatus } from '../../utils/tournament'

export function TournamentHeader({ tournament, matches, alerts, onOpenSettings, onOpenPlayers }) {
  const active = matches.filter((match) => ['in_progress', 'disputed'].includes(deriveMatchStatus(match, tournament.maxSetsPerMatch))).length
  const completed = matches.filter((match) => deriveMatchStatus(match, tournament.maxSetsPerMatch) === 'completed').length

  return (
    <header className="rounded-2xl border border-black/[0.08] bg-white p-5 sm:p-6 shadow-apple-card">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#8E8E93]">
            <span>{tournament.venue}</span>
            <span>·</span>
            <span>{tournament.updatedAt}</span>
            <span className="inline-flex items-center rounded-full bg-apple-blue/10 px-2 py-0.5 text-[10px] font-semibold text-apple-blue">
              {tournament.status}
            </span>
          </div>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1C1E]">
            {tournament.name}
          </h2>
        </div>

        <div className="flex flex-col gap-3.5 xl:min-w-[560px]">
          <div className="flex flex-wrap justify-start gap-2 xl:justify-end">
            <button
              type="button"
              onClick={onOpenPlayers}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-black/[0.08] bg-black/[0.03] px-3.5 text-xs font-semibold text-slate-700 shadow-apple-subtle transition-all hover:bg-black/[0.06] active:scale-[0.98] active:bg-black/[0.1]"
            >
              <SquarePen size={15} className="text-slate-500" strokeWidth={2.2} />
              Spēlētāji ({tournament.players.length})
            </button>
            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-black/[0.08] bg-black/[0.03] px-3.5 text-xs font-semibold text-slate-700 shadow-apple-subtle transition-all hover:bg-black/[0.06] active:scale-[0.98] active:bg-black/[0.1]"
            >
              <Settings size={15} className="text-slate-500" strokeWidth={2.2} />
              Iestatījumi
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
    <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-[#F2F2F7]/60 px-3.5 py-2.5">
      <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
        <Icon size={16} strokeWidth={2.3} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8E93] truncate">{label}</p>
        <p className="text-base font-bold tabular-nums text-[#1C1C1E] leading-none mt-0.5 truncate">{value}</p>
      </div>
    </div>
  )
}
