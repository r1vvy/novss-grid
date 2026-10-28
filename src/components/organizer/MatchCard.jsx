import React from 'react'
import { AlertTriangle, CheckCircle2, Clock, Pencil, Search } from 'lucide-react'
import { deriveMatchStatus, getMatchPlayers, getSetScore } from '../../utils/tournament'

const statusLabels = {
  scheduled: 'Ieplānots',
  in_progress: 'Notiek',
  disputed: 'Strīds',
  investigating: 'Izmeklē',
  awaiting_confirmation: 'Gaida apstiprinājumu',
  completed: 'Pabeigts',
}

export function MatchCard({ tournament, match, onClearAlert, onMarkInvestigating, onOpenOverride, dragProps = {} }) {
  const { playerA, playerB } = getMatchPlayers(match, tournament.players)
  const status = deriveMatchStatus(match, tournament.maxSetsPerMatch)
  const scoreA = getSetScore(match, match.playerAId)
  const scoreB = getSetScore(match, match.playerBId)
  const isDisputed = status === 'disputed'
  const isInvestigating = status === 'investigating'
  const canEditResult = status !== 'scheduled'
  const editLabel = getEditLabel(status)

  const cardBorder = isDisputed
    ? 'border-apple-red/40 ring-2 ring-apple-red/20'
    : isInvestigating
      ? 'border-apple-orange/40 ring-2 ring-apple-orange/20'
    : status === 'in_progress'
      ? 'border-apple-blue/30'
      : status === 'completed'
        ? 'border-apple-green/30'
      : 'border-black/[0.08]'

  return (
    <article className={`rounded-2xl border bg-white p-4 shadow-apple-card transition-all ${cardBorder}`} {...dragProps}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">Galds</span>
          <span className="font-mono text-3xl font-black tabular-nums leading-none text-[#1C1C1E]">{match.table}</span>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-[#F2F2F7]/50 p-2.5">
        <PlayerLine name={playerA?.name || 'TBD'} club={playerA?.representation} score={scoreA} />
        <div className="border-t border-black/[0.04]" />
        <PlayerLine name={playerB?.name || 'TBD'} club={playerB?.representation} score={scoreB} />
      </div>

      <div className="mt-3.5 grid gap-2 sm:grid-cols-2">
        {isDisputed ? (
          <button
            type="button"
            onClick={() => onMarkInvestigating(match.id)}
            className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-apple-orange/30 bg-apple-orange/10 px-3 text-xs font-semibold text-apple-orange transition hover:bg-apple-orange/20 active:scale-[0.98]"
          >
            <Search size={14} strokeWidth={2.3} />
            <span>Marķēt kā izmeklē</span>
          </button>
        ) : null}
        {canEditResult ? (
          <button
            type="button"
            onClick={() => onOpenOverride(match)}
            className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-apple-blue/20 bg-apple-blue/10 px-3 text-xs font-semibold text-apple-blue transition hover:bg-apple-blue/20 active:scale-[0.98]"
          >
            <Pencil size={14} strokeWidth={2.3} />
            <span>{editLabel}</span>
          </button>
        ) : null}
      </div>

      {isDisputed ? (
        <div className="mt-3 flex items-center justify-end border-t border-black/[0.06] pt-2.5">
          <button
            type="button"
            onClick={() => onClearAlert(match.id)}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-apple-red/30 px-3 py-1.5 text-xs font-semibold text-apple-red transition hover:bg-apple-red hover:text-white active:scale-95"
          >
            Noņemt brīdinājumu
          </button>
        </div>
      ) : null}
    </article>
  )
}

function getEditLabel(status) {
  if (status === 'disputed') return 'Atrisināt strīdu'
  if (status === 'investigating') return 'Ievadīt lēmumu'
  if (status === 'in_progress') return 'Pabeigt manuāli'
  if (status === 'awaiting_confirmation') return 'Labot rezultātu'
  return 'Koriģēt rezultātu'
}

function PlayerLine({ name, club, score }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-[#1C1C1E]">{name}</p>
        <p className="truncate text-[10px] text-[#8E8E93]">{club || 'Gaida spēlētāju'}</p>
      </div>
      <span className="font-mono text-lg font-bold tabular-nums text-[#1C1C1E]">{score}</span>
    </div>
  )
}

function StatusBadge({ status }) {
  const classes = {
    scheduled: 'text-[#8E8E93] border-black/[0.08] bg-black/[0.04]',
    in_progress: 'text-apple-blue border-apple-blue/20 bg-apple-blue/10',
    disputed: 'text-apple-red border-apple-red/25 bg-apple-red/10',
    investigating: 'text-apple-orange border-apple-orange/25 bg-apple-orange/10',
    awaiting_confirmation: 'text-apple-purple border-apple-purple/25 bg-apple-purple/10',
    completed: 'text-apple-green border-apple-green/20 bg-apple-green/10',
  }
  const Icon = status === 'disputed' ? AlertTriangle : status === 'investigating' ? Search : status === 'completed' ? CheckCircle2 : Clock
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${classes[status]}`}>
      <Icon size={12} strokeWidth={2.3} className={status === 'in_progress' ? 'animate-pulse text-apple-blue' : ''} />
      <span>{statusLabels[status]}</span>
    </span>
  )
}
