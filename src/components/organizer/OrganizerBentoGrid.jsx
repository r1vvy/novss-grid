import React from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Monitor,
  Settings,
  Sparkles,
  Star,
  Trophy,
  Users,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { triggerHaptic } from '../../utils/haptics'
import {
  deriveMatchStatus,
  getMatchPerfectPlays,
  isTournamentComplete,
} from '../../utils/tournament'

export function OrganizerBentoGrid({
  tournament,
  matches = [],
  alerts = [],
  canGenerate = false,
  onGenerateRound,
  onOpenPlayers,
  onOpenSettings,
  onOpenKiosk,
  className = '',
}) {
  const isComplete = isTournamentComplete(tournament)
  const isFinalRound = tournament.totalRounds > 0 && tournament.currentRound >= tournament.totalRounds
  const percent = tournament.totalRounds > 0 ? Math.min(100, (tournament.currentRound / tournament.totalRounds) * 100) : 0

  const completedMatches = matches.filter(
    (m) => deriveMatchStatus(m, tournament.maxSetsPerMatch) === 'completed',
  ).length

  const totalPerfectPlays = matches.reduce((sum, m) => {
    return sum + getMatchPerfectPlays(m, m.playerAId) + getMatchPerfectPlays(m, m.playerBId)
  }, 0)

  return (
    <section className={`grid grid-cols-12 gap-4 ${className}`}>
      {/* ========================================================================= */}
      {/* BENTO TILE 1: TOURNAMENT HERO & QUICK ACTIONS (col-span-12 xl:col-span-5) */}
      {/* ========================================================================= */}
      <GlassCard
        elevation="elevated"
        className="col-span-12 xl:col-span-5 flex flex-col justify-between p-5 sm:p-6"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#8E8E93]">
            <span className="font-semibold text-[#1C1C1E]">{tournament.venue || 'Novusa zāle'}</span>
            <span>·</span>
            <span className="tabular-nums font-mono text-[11px]">{tournament.updatedAt || 'Tikko'}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-apple-blue/20 bg-apple-blue/10 px-2.5 py-0.5 text-xs font-semibold text-apple-blue">
              <span className="size-1.5 rounded-full bg-apple-blue animate-pulse" />
              {tournament.status || 'Aktīvs'}
            </span>
          </div>

          <h2 className="mt-2.5 text-2xl sm:text-3xl font-black tracking-tight text-[#1C1C1E]">
            {tournament.name}
          </h2>
          <p className="mt-1 text-xs text-[#8E8E93]">
            Šveices sistēma · {tournament.maxSetsPerMatch} seti mačā · Kārta {tournament.currentRound} no {tournament.totalRounds}
          </p>
        </div>

        {/* Quick Actions Row */}
        <div className="mt-5 flex flex-wrap items-center gap-2 pt-4 border-t border-black/[0.05]">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              onOpenPlayers?.()
            }}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white/80 px-3.5 text-xs font-semibold text-[#1C1C1E] shadow-apple-sm transition hover:bg-white active:scale-[0.98]"
          >
            <Users size={15} className="text-apple-secondary" strokeWidth={2.2} />
            <span>Spēlētāji (<span className="font-mono tabular-nums">{tournament.players?.length || 0}</span>)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              onOpenSettings?.()
            }}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white/80 px-3.5 text-xs font-semibold text-[#1C1C1E] shadow-apple-sm transition hover:bg-white active:scale-[0.98]"
          >
            <Settings size={15} className="text-apple-secondary" strokeWidth={2.2} />
            <span>Iestatījumi</span>
          </button>

          {onOpenKiosk && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium')
                onOpenKiosk()
              }}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 text-xs font-bold text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)] transition hover:opacity-95 active:scale-[0.98]"
              title="Atvērt liela ekrāna Kioska / TV skatu zāles projektoriem"
            >
              <Monitor size={15} strokeWidth={2.4} />
              <span>Kioska TV skats</span>
            </button>
          )}
        </div>
      </GlassCard>

      {/* ========================================================================= */}
      {/* BENTO TILE 2: SWISS ROUND ENGINE (col-span-12 xl:col-span-4)               */}
      {/* ========================================================================= */}
      <GlassCard
        elevation="elevated"
        className="col-span-12 xl:col-span-4 flex flex-col justify-between p-5 sm:p-6"
      >
        <div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600">
                <Sparkles size={16} strokeWidth={2.4} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">
                Šveices kārtas dzinējs
              </span>
            </div>

            <span className="font-mono text-xs font-bold tabular-nums text-apple-secondary">
              {tournament.currentRound} / {tournament.totalRounds} kārta
            </span>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-[#636366]">
            {isComplete
              ? 'Visi mači ir apstiprināti. Turnīrs ir noslēdzies un kopvērtējums ir oficiāls.'
              : isFinalRound
                ? 'Noslēdzošā kārta. Pēc spēļu apstiprināšanas rezultāti kļūs galīgi.'
                : 'Nākamo Šveices kārtu var ģenerēt, kad visas aktīvās spēles ir apstiprinātas.'}
          </p>

          {/* Round Progress Bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-[#8E8E93]">
              <span>Kopējais progress</span>
              <span className="font-mono tabular-nums">{Math.round(percent)}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isComplete ? 'bg-apple-green' : 'bg-apple-blue'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Primary Round Generator Action */}
        <div className="mt-5 pt-3 border-t border-black/[0.05]">
          <button
            type="button"
            disabled={!canGenerate || isComplete}
            onClick={() => {
              triggerHaptic('success')
              onGenerateRound?.()
            }}
            className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold shadow-sm transition-all duration-150 active:scale-[0.98] ${
              isComplete
                ? 'bg-apple-green text-white cursor-default shadow-none'
                : canGenerate
                  ? 'bg-apple-blue text-white hover:bg-apple-blueHover shadow-[0_4px_16px_rgba(0,122,255,0.25)]'
                  : 'bg-black/[0.06] text-apple-tertiary cursor-not-allowed shadow-none'
            }`}
          >
            {isComplete ? (
              <>
                <Trophy size={16} strokeWidth={2.4} />
                <span>Turnīrs noslēdzies</span>
              </>
            ) : canGenerate ? (
              <>
                <CheckCircle2 size={16} strokeWidth={2.4} />
                <span>Ģenerēt {tournament.currentRound + 1}. kārtu</span>
              </>
            ) : (
              <>
                <Clock size={16} strokeWidth={2.2} />
                <span>Gaida spēļu apstiprinājumu ({completedMatches}/{matches.length})</span>
              </>
            )}
          </button>
        </div>
      </GlassCard>

      {/* ========================================================================= */}
      {/* BENTO TILE 3: LIVE PULSE METRICS (col-span-12 xl:col-span-3)                */}
      {/* ========================================================================= */}
      <GlassCard
        elevation="elevated"
        className="col-span-12 xl:col-span-3 flex flex-col justify-between p-5 sm:p-6"
      >
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-black/[0.05]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
            Tiešraides pulss
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-apple-green">
            <span className="size-2 rounded-full bg-apple-green animate-pulse" />
            Live
          </span>
        </div>

        {/* 2x2 Metric Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-3">
          {/* Metric 1: Galdi */}
          <div className="rounded-xl border border-black/[0.06] bg-white/70 p-3 shadow-apple-sm">
            <div className="flex items-center gap-1.5 text-apple-secondary">
              <Layers size={14} />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Galdi</span>
            </div>
            <p className="mt-1 font-mono text-2xl font-black tabular-nums text-[#1C1C1E]">
              {matches.length}
            </p>
          </div>

          {/* Metric 2: Pabeigti */}
          <div className="rounded-xl border border-black/[0.06] bg-white/70 p-3 shadow-apple-sm">
            <div className="flex items-center gap-1.5 text-apple-green">
              <CheckCircle2 size={14} />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Pabeigti</span>
            </div>
            <p className="mt-1 font-mono text-2xl font-black tabular-nums text-[#1C1C1E]">
              {completedMatches}/{matches.length}
            </p>
          </div>

          {/* Metric 3: Strīdi */}
          <div
            className={`rounded-xl border p-3 shadow-apple-sm ${
              alerts.length > 0
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-900'
                : 'border-black/[0.06] bg-white/70 text-[#1C1C1E]'
            }`}
          >
            <div className="flex items-center gap-1.5 text-amber-600">
              <AlertTriangle size={14} />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Strīdi</span>
            </div>
            <p className="mt-1 font-mono text-2xl font-black tabular-nums">
              {alerts.length}
            </p>
          </div>

          {/* Metric 4: Ideālie sitieni */}
          <div className="rounded-xl border border-black/[0.06] bg-white/70 p-3 shadow-apple-sm">
            <div className="flex items-center gap-1.5 text-amber-600">
              <Star size={14} className="fill-amber-500" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Ideālie</span>
            </div>
            <p className="mt-1 font-mono text-2xl font-black tabular-nums text-[#1C1C1E]">
              {totalPerfectPlays}
            </p>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] font-medium text-[#8E8E93]">
          Dati atjaunojas automātiski reāllaikā
        </p>
      </GlassCard>
    </section>
  )
}

