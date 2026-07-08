import React from 'react'
import { AlertTriangle, CheckCircle2, Clock, Pencil, Search } from 'lucide-react'
import { deriveMatchStatus, getMatchPlayers, getOverrideAuditLabel, getSetScore } from '../../utils/tournament'

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
  const overrideLabel = getOverrideAuditLabel(match)
  const cardState = isDisputed
    ? 'border-nvssAlert ring-2 ring-nvssAlert/50'
    : isInvestigating
      ? 'border-amber-400 ring-2 ring-amber-300/40'
    : status === 'in_progress'
      ? 'border-nvssGreen'
      : 'border-nvssBorder'

  return (
    <article className={`rounded-md border bg-nvssSurface p-3 ${cardState}`} {...dragProps}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-nvssMuted">Galds</p>
          <div className="text-3xl font-black leading-none">{match.table}</div>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        <PlayerLine name={playerA?.name || 'TBD'} club={playerA?.representation} score={scoreA} />
        <PlayerLine name={playerB?.name || 'TBD'} club={playerB?.representation} score={scoreB} />
      </div>
      {overrideLabel ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-nvssBlue/15 px-2 py-1 text-[11px] font-semibold text-nvssBlue">Labots organizatora pusē</span>
          <span className="text-xs text-nvssMuted">{overrideLabel}</span>
        </div>
      ) : null}
      <div className="mt-3 grid gap-2 border-t border-nvssBorder pt-3 sm:grid-cols-2">
        {isDisputed ? (
          <button
            type="button"
            onClick={() => onMarkInvestigating(match.id)}
            className="flex min-h-[40px] items-center justify-center gap-2 rounded border border-amber-400/70 bg-amber-400/10 px-3 text-sm font-semibold text-amber-200 hover:bg-amber-400/20"
          >
            <Search size={15} />
            Marķēt kā izmeklē
          </button>
        ) : null}
        {canEditResult ? (
          <button
            type="button"
            onClick={() => onOpenOverride(match)}
            className="flex min-h-[40px] items-center justify-center gap-2 rounded border border-nvssGreen bg-nvssGreen/10 px-3 text-sm font-semibold text-nvssGreen hover:bg-nvssGreen/20"
          >
            <Pencil size={15} />
            {editLabel}
          </button>
        ) : null}
      </div>
      {isDisputed ? (
        <div className="mt-3 flex items-center justify-end border-t border-nvssBorder pt-3 text-xs text-nvssMuted">
          <button type="button" onClick={() => onClearAlert(match.id)} className="shrink-0 rounded border border-nvssAlert px-2 py-1 font-semibold text-nvssAlert hover:bg-nvssAlert hover:text-white">
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

function PlayerLine({ name, club: represents, score }) {
  return (
    <>
      <div className="min-w-0">
        <p className="truncate font-semibold">{name}</p>
        <p className="truncate text-xs text-nvssMuted">{represents || 'Gaida spēlētāju'}</p>
      </div>
      <div className="text-2xl font-black">{score}</div>
    </>
  )
}

function StatusBadge({ status }) {
  const classes = {
    scheduled: 'text-nvssMuted border-nvssBorder',
    in_progress: 'text-nvssGreen border-nvssGreen',
    disputed: 'text-nvssAlert border-nvssAlert',
    investigating: 'text-amber-200 border-amber-400',
    awaiting_confirmation: 'text-nvssBlue border-nvssBlue',
    completed: 'text-nvssGreen border-nvssBorder',
  }
  const Icon = status === 'disputed' ? AlertTriangle : status === 'investigating' ? Search : status === 'completed' ? CheckCircle2 : Clock
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs font-semibold ${classes[status]}`}>
      <Icon size={14} className={status === 'in_progress' ? 'animate-pulse' : ''} />
      {statusLabels[status]}
    </span>
  )
}
