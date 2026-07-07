import React from 'react'
import { AlertTriangle, CheckCircle2, Clock, Grip, Pencil, RotateCcw, Search, X } from 'lucide-react'
import { deriveMatchStatus, getMatchPlayers, getSetScore } from '../../utils/tournament'

const statusLabels = {
  scheduled: 'Ieplānots',
  in_progress: 'Notiek',
  disputed: 'Strīds',
  investigating: 'Izmeklē',
  completed: 'Pabeigts',
  awaiting_confirmation: 'Gaida apstiprinājumu',
  verified: 'Apstiprināts',
}

export function TableGrid({
  tournament,
  matches,
  viewMode,
  onClearAlert,
  onMarkInvestigating,
  onResetInvestigation,
  onOpenOverride,
  onSwapTables,
  headerContent = null,
  titleActions = null,
}) {
  if (matches.length === 0) {
    return (
      <section className="rounded-md border border-dashed border-nvssBorder bg-nvssSurface p-6 text-sm text-nvssMuted">
        Nav aktīvu kārtas galdu. Reģistrācijas turnīrs ir izveidots.
      </section>
    )
  }

  return (
    <section className="w-full overflow-hidden rounded-md border border-nvssBorder bg-nvssSurface">
      <div className="border-b border-nvssBorder px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Aktīvā kārta</h3>
      </div>
      {headerContent || titleActions ? (
        <div className="border-b border-nvssBorder">
          {headerContent}
          {titleActions ? <div className="px-4 py-3">{titleActions}</div> : null}
        </div>
      ) : null}
      {viewMode === 'compact' ? (
        <CompactTableMap matches={matches} onSwapTables={onSwapTables} />
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1100px] table-fixed text-left text-sm">
            <colgroup>
              <col className="w-20" />
              <col className="w-[22%]" />
              <col className="w-[22%]" />
              <col className="w-24" />
              <col className="w-44" />
              <col className="w-[24%]" />
            </colgroup>
            <thead className="bg-nvssBg text-xs uppercase tracking-[0.12em] text-nvssMuted">
              <tr>
                <th className="px-4 py-3 font-semibold">Galds</th>
                <th className="px-4 py-3 font-semibold">Spēlētājs A</th>
                <th className="px-4 py-3 font-semibold">Spēlētājs B</th>
                <th className="px-4 py-3 font-semibold">Rezultāts</th>
                <th className="px-4 py-3 font-semibold">Statuss</th>
                <th className="px-4 py-3 font-semibold">Darbības</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <MatchRow
                  key={match.id}
                  tournament={tournament}
                  match={match}
                  onClearAlert={onClearAlert}
                  onMarkInvestigating={onMarkInvestigating}
                  onResetInvestigation={onResetInvestigation}
                  onOpenOverride={onOpenOverride}
                  dragProps={buildDragProps(match.id, onSwapTables)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function CompactTableMap({ matches, onSwapTables }) {
  return (
    <div className="p-3">
      <div className="mb-3 flex items-center justify-between gap-3 rounded-md border border-nvssBorder bg-nvssBg px-3 py-2 text-xs text-nvssMuted">
        <span>Compact/Grid-only skats</span>
        <span>Velc vienu kvadrātu virs otra, lai samainītu galdus.</span>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12">
        {matches.map((match) => {
          const status = deriveMatchStatus(match)
          return (
            <button
              key={match.id}
              type="button"
              className={`group aspect-square overflow-hidden rounded-md border p-2 text-left transition ${compactClasses[status]}`}
              title={`Table ${match.table}`}
              {...buildDragProps(match.id, onSwapTables)}
            >
              <div className="flex h-full min-h-0 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <span className="shrink-0 text-lg font-black leading-none">{match.table}</span>
                  <Grip size={12} className="shrink-0 opacity-50 group-hover:opacity-100" />
                </div>
                <div className="mt-2 min-h-0 overflow-hidden text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] break-words [overflow-wrap:anywhere]">
                  {statusLabels[status]}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function buildDragProps(matchId, onSwapTables) {
  return {
    draggable: true,
    onDragStart: (event) => {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', matchId)
    },
    onDragOver: (event) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    },
    onDrop: (event) => {
      event.preventDefault()
      const sourceMatchId = event.dataTransfer.getData('text/plain')
      if (sourceMatchId) onSwapTables(sourceMatchId, matchId)
    },
  }
}

const compactClasses = {
  scheduled: 'border-nvssBorder bg-nvssBg text-white',
  in_progress: 'border-nvssGreen bg-nvssGreen/15 text-white',
  disputed: 'border-nvssAlert bg-nvssAlert/20 text-white',
  investigating: 'border-amber-400 bg-amber-400/20 text-white',
  completed: 'border-nvssBorder bg-slate-500/10 text-slate-200',
  awaiting_confirmation: 'border-nvssBlue bg-nvssBlue/20 text-white',
  verified: 'border-emerald-300/40 bg-emerald-500/10 text-emerald-100',
}

export function CompactLegend() {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {Object.entries(statusLabels).map(([status, label]) => (
        <span key={status} className={`inline-flex items-center gap-1 rounded border px-2 py-1 ${badgeClasses[status]}`}>
          <StatusIcon status={status} />
          {label}
        </span>
      ))}
    </div>
  )
}

function StatusIcon({ status }) {
  const Icon = status === 'disputed' ? AlertTriangle : status === 'investigating' ? Search : status === 'verified' ? CheckCircle2 : Clock
  return <Icon size={12} className={status === 'in_progress' ? 'animate-pulse' : ''} />
}

const badgeClasses = {
  scheduled: 'text-nvssMuted border-nvssBorder',
  in_progress: 'text-nvssGreen border-nvssGreen',
  disputed: 'text-nvssAlert border-nvssAlert',
  investigating: 'text-amber-200 border-amber-400',
  completed: 'text-slate-300 border-nvssBorder',
  awaiting_confirmation: 'text-nvssBlue border-nvssBlue',
  verified: 'text-nvssGreen border-nvssBorder',
}

export function MatchSummaryRow({ tournament, match }) {
  const { playerA, playerB } = getMatchPlayers(match, tournament.players)
  const status = deriveMatchStatus(match)
  const scoreA = getSetScore(match, match.playerAId)
  const scoreB = getSetScore(match, match.playerBId)

  return (
    <div className="rounded-md border border-nvssBorder bg-nvssBg px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-nvssMuted">Galds {match.table}</p>
          <p className="text-sm font-semibold text-white">{playerA?.name || 'TBD'} pret {playerB?.name || 'TBD'}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-bold text-white">{scoreA} : {scoreB}</p>
          <span className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-[11px] font-semibold ${badgeClasses[status]}`}>
            <StatusIcon status={status} />
            {statusLabels[status]}
          </span>
        </div>
      </div>
    </div>
  )
}

function MatchRow({ tournament, match, onClearAlert, onMarkInvestigating, onResetInvestigation, onOpenOverride, dragProps }) {
  const { playerA, playerB } = getMatchPlayers(match, tournament.players)
  const status = deriveMatchStatus(match)
  const scoreA = getSetScore(match, match.playerAId)
  const scoreB = getSetScore(match, match.playerBId)
  const isDisputed = status === 'disputed'
  const isInvestigating = status === 'investigating'
  const rowState = isDisputed
    ? 'bg-nvssAlert/10'
    : isInvestigating
      ? 'bg-amber-400/10'
      : 'hover:bg-nvssBg/60'

  return (
    <tr className={`border-t border-nvssBorder align-top ${rowState}`} {...dragProps}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Grip size={14} className="text-nvssMuted" />
          <span className="text-lg font-black text-white">{match.table}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="truncate font-semibold text-white">{playerA?.name || 'TBD'}</p>
        <p className="truncate text-xs text-nvssMuted">{playerA?.representation || 'Gaida spēlētāju'}</p>
      </td>
      <td className="px-4 py-3">
        <p className="truncate font-semibold text-white">{playerB?.name || 'TBD'}</p>
        <p className="truncate text-xs text-nvssMuted">{playerB?.representation || 'Gaida spēlētāju'}</p>
      </td>
      <td className="px-4 py-3">
        <div className="font-mono text-base font-bold text-white">
          {scoreA} : {scoreB}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs font-semibold ${badgeClasses[status]}`}>
          <StatusIcon status={status} />
          {statusLabels[status]}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {isDisputed ? (
            <button
              type="button"
              onClick={() => onMarkInvestigating(match.id)}
              title="Marķēt kā izmeklē"
              aria-label="Marķēt kā izmeklē"
              className="inline-flex size-9 items-center justify-center rounded border border-amber-400/70 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20"
            >
              <Search size={15} />
            </button>
          ) : null}
          {isInvestigating ? (
            <button
              type="button"
              onClick={() => onResetInvestigation(match.id)}
              title="Atsākt spēli"
              aria-label="Atsākt spēli"
              className="inline-flex size-9 items-center justify-center rounded border border-nvssBlue bg-nvssBlue/10 text-nvssBlue hover:bg-nvssBlue/20"
            >
              <RotateCcw size={15} />
            </button>
          ) : null}
          {(isDisputed || isInvestigating) ? (
            <button
              type="button"
              onClick={() => onOpenOverride(match)}
              title="Rediģēt rezultātu"
              aria-label="Rediģēt rezultātu"
              className="inline-flex size-9 items-center justify-center rounded border border-nvssGreen bg-nvssGreen/10 text-nvssGreen hover:bg-nvssGreen/20"
            >
              <Pencil size={15} />
            </button>
          ) : null}
          {isDisputed ? (
            <button
              type="button"
              onClick={() => onClearAlert(match.id)}
              title="Noņemt brīdinājumu"
              aria-label="Noņemt brīdinājumu"
              className="inline-flex size-9 items-center justify-center rounded border border-nvssAlert text-nvssAlert hover:bg-nvssAlert hover:text-white"
            >
              <X size={15} />
            </button>
          ) : null}
        </div>
      </td>
    </tr>
  )
}
