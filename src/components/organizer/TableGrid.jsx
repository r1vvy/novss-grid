import React from 'react'
import { AlertTriangle, CheckCircle2, Clock, Grip, Pencil, RotateCcw, Search, X } from 'lucide-react'
import { deriveMatchStatus, getMatchPlayers, getOverrideAuditLabel, getSetScore } from '../../utils/tournament'

const statusLabels = {
  scheduled: 'Ieplānots',
  in_progress: 'Notiek',
  disputed: 'Strīds',
  investigating: 'Izmeklē',
  completed: 'Pabeigts',
  awaiting_confirmation: 'Gaida apstiprinājumu',
  verified: 'Apstiprināts',
}

const compactStatusLabels = {
  scheduled: 'Iepl.',
  in_progress: 'Notiek',
  disputed: 'Strīds',
  investigating: 'Izmeklē',
  completed: 'Pab.',
  awaiting_confirmation: 'Gaida',
  verified: 'Apst.',
}

export function TableGrid({
  tournament,
  matches,
  viewMode,
  canReassignTables = true,
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
        <CompactTableMap
          tournament={tournament}
          matches={matches}
          canReassignTables={canReassignTables}
          onClearAlert={onClearAlert}
          onMarkInvestigating={onMarkInvestigating}
          onResetInvestigation={onResetInvestigation}
          onOpenOverride={onOpenOverride}
          onSwapTables={onSwapTables}
        />
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
                  dragProps={buildDragProps(match.id, onSwapTables, canReassignTables)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function CompactTableMap({ tournament, matches, canReassignTables, onClearAlert, onMarkInvestigating, onResetInvestigation, onOpenOverride, onSwapTables }) {
  return (
    <div className="p-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {matches.map((match) => {
          const status = deriveMatchStatus(match)
          const isDisputed = status === 'disputed'
          const isInvestigating = status === 'investigating'
          const canEditResult = status !== 'scheduled'
          const editLabel = getEditLabel(status)
          const overrideLabel = getOverrideAuditLabel(match)

          return (
            <div
              key={match.id}
              className={`group min-h-[7.5rem] overflow-hidden rounded-xl border p-3 text-left transition ${compactClasses[status]}`}
              title={canReassignTables ? `Table ${match.table}` : `Table ${match.table} - sort by table to reassign`}
              {...buildDragProps(match.id, onSwapTables, canReassignTables)}
            >
              <div className="flex h-full min-h-0 flex-col">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="shrink-0 text-[1.9rem] font-black leading-none text-white">{match.table}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">Galds</span>
                  </div>
                  <Grip size={12} className="shrink-0 opacity-35 group-hover:opacity-100" />
                </div>

                <div className="mt-3">
                  <span
                    title={statusLabels[status]}
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${compactBadgeClasses[status]}`}
                  >
                    <StatusIcon status={status} />
                    <span>{compactStatusLabels[status]}</span>
                  </span>
                </div>

                {overrideLabel ? (
                  <div className="mt-3 inline-flex items-center self-start rounded-full border border-nvssBlue/40 bg-nvssBlue/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-nvssBlue">
                    Labots
                  </div>
                ) : null}

                <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                  {canEditResult ? (
                    <CompactActionButton
                      title={editLabel}
                      className="border-nvssGreen bg-nvssGreen/10 text-nvssGreen hover:bg-nvssGreen/20"
                      onClick={() => onOpenOverride(match)}
                    >
                      <Pencil size={12} />
                    </CompactActionButton>
                  ) : null}
                  {isDisputed ? (
                    <CompactActionButton
                      title="Marķēt kā izmeklē"
                      className="border-amber-400/70 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20"
                      onClick={() => onMarkInvestigating(match.id)}
                    >
                      <Search size={12} />
                    </CompactActionButton>
                  ) : null}
                  {isInvestigating ? (
                    <CompactActionButton
                      title="Atsākt spēli"
                      className="border-nvssBlue bg-nvssBlue/10 text-nvssBlue hover:bg-nvssBlue/20"
                      onClick={() => onResetInvestigation(match.id)}
                    >
                      <RotateCcw size={12} />
                    </CompactActionButton>
                  ) : null}
                  {isDisputed ? (
                    <CompactActionButton
                      title="Noņemt brīdinājumu"
                      className="border-nvssAlert text-nvssAlert hover:bg-nvssAlert hover:text-white"
                      onClick={() => onClearAlert(match.id)}
                    >
                      <X size={12} />
                    </CompactActionButton>
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CompactActionButton({ title, className, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      onDragStart={(event) => {
        event.preventDefault()
        event.stopPropagation()
      }}
      className={`inline-flex size-6 items-center justify-center rounded border ${className}`}
    >
      {children}
    </button>
  )
}

function buildDragProps(matchId, onSwapTables, canReassignTables = true) {
  if (!canReassignTables) {
    return {}
  }

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
  scheduled: 'border-nvssBorder bg-nvssBg text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]',
  in_progress: 'border-nvssGreen/70 bg-gradient-to-b from-nvssGreen/18 to-nvssGreen/10 text-white',
  disputed: 'border-nvssAlert/80 bg-gradient-to-b from-nvssAlert/22 to-nvssAlert/12 text-white',
  investigating: 'border-amber-400/80 bg-gradient-to-b from-amber-400/22 to-amber-400/10 text-white',
  completed: 'border-nvssBorder bg-slate-500/10 text-slate-200',
  awaiting_confirmation: 'border-nvssBlue/75 bg-gradient-to-b from-nvssBlue/22 to-nvssBlue/12 text-white',
  verified: 'border-emerald-300/45 bg-gradient-to-b from-emerald-500/16 to-emerald-500/08 text-emerald-100',
}

const compactBadgeClasses = {
  scheduled: 'border-white/10 bg-white/5 text-white/70',
  in_progress: 'border-nvssGreen/40 bg-nvssGreen/10 text-emerald-100',
  disputed: 'border-nvssAlert/40 bg-nvssAlert/10 text-red-100',
  investigating: 'border-amber-300/40 bg-amber-300/10 text-amber-100',
  completed: 'border-white/10 bg-white/5 text-slate-200',
  awaiting_confirmation: 'border-nvssBlue/40 bg-nvssBlue/10 text-blue-100',
  verified: 'border-emerald-300/35 bg-emerald-400/10 text-emerald-100',
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
          <p className="text-xs uppercase tracking-[0.12em] text-nvssMuted">{match.table} Galds </p>
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
  const canEditResult = status !== 'scheduled'
  const editLabel = getEditLabel(status)
  const overrideLabel = getOverrideAuditLabel(match)
  const rowState = isDisputed
    ? 'bg-nvssAlert/10'
    : isInvestigating
      ? 'bg-amber-400/10'
      : 'hover:bg-nvssBg/60'

  return (
    <tr className={`border-t border-nvssBorder align-top ${rowState}`} {...dragProps}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Grip size={14} className={dragProps.draggable ? 'text-nvssMuted' : 'text-nvssMuted/40'} />
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
        {overrideLabel ? (
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-nvssBlue/10 px-2 py-1 text-[11px] font-semibold text-nvssBlue">
            Labots organizatora pusē
          </div>
        ) : null}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {canEditResult ? (
            <button
              type="button"
              onClick={() => onOpenOverride(match)}
              title={editLabel}
              aria-label={editLabel}
              className="inline-flex size-9 items-center justify-center rounded border border-nvssGreen bg-nvssGreen/10 text-nvssGreen hover:bg-nvssGreen/20"
            >
              <Pencil size={15} />
            </button>
          ) : null}
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

function getEditLabel(status) {
  if (status === 'disputed') return 'Atrisināt strīdu'
  if (status === 'investigating') return 'Ievadīt lēmumu'
  if (status === 'in_progress') return 'Pabeigt manuāli'
  if (status === 'awaiting_confirmation') return 'Labot rezultātu'
  return 'Koriģēt rezultātu'
}
