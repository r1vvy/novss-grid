import React from 'react'
import { AlertTriangle, CheckCircle2, Clock, Grip, Pencil, RotateCcw, Search, X } from 'lucide-react'
import { deriveMatchStatus, getMatchPlayers, getSetScore } from '../../utils/tournament'

const statusLabels = {
  scheduled: 'Ieplānots',
  in_progress: 'Notiek',
  disputed: 'Strīds',
  investigating: 'Izmeklē',
  awaiting_confirmation: 'Gaida apstiprinājumu',
  completed: 'Pabeigts',
}

const compactStatusLabels = {
  scheduled: 'Iepl.',
  in_progress: 'Notiek',
  disputed: 'Strīds',
  investigating: 'Izmeklē',
  awaiting_confirmation: 'Gaida',
  completed: 'Pab.',
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
      <section className="rounded-2xl border border-dashed border-black/[0.1] bg-white p-8 text-center text-sm text-[#8E8E93] shadow-sm">
        Nav aktīvu kārtas galdu. Reģistrācijas turnīrs ir sagatavots.
      </section>
    )
  }

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-apple-card">
      <div className="flex flex-col gap-3 border-b border-black/[0.06] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-apple-blue" />
          <h3 className="text-base font-bold tracking-tight text-[#1C1C1E]">Aktīvā kārta</h3>
        </div>
      </div>

      {headerContent || titleActions ? (
        <div className="border-b border-black/[0.06] bg-[#F2F2F7]/30">
          {headerContent}
          {titleActions ? <div className="px-5 py-3">{titleActions}</div> : null}
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
          <table className="w-full min-w-[960px] table-fixed text-left text-sm">
            <colgroup>
              <col className="w-20" />
              <col className="w-[23%]" />
              <col className="w-[23%]" />
              <col className="w-24" />
              <col className="w-44" />
              <col className="w-[22%]" />
            </colgroup>
            <thead className="border-b border-black/[0.06] bg-[#F2F2F7]/70 text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">
              <tr>
                <th className="px-4 py-3">Galds</th>
                <th className="px-4 py-3">Spēlētājs A</th>
                <th className="px-4 py-3">Spēlētājs B</th>
                <th className="px-4 py-3">Rezultāts</th>
                <th className="px-4 py-3">Statuss</th>
                <th className="px-4 py-3">Darbības</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05]">
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
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {matches.map((match) => {
          const status = deriveMatchStatus(match, tournament.maxSetsPerMatch)
          const isDisputed = status === 'disputed'
          const isInvestigating = status === 'investigating'
          const canEditResult = status !== 'scheduled'
          const editLabel = getEditLabel(status)

          return (
            <div
              key={match.id}
              className={`group min-h-[8rem] overflow-hidden rounded-2xl border p-3.5 text-left transition-all duration-150 hover:shadow-apple-card ${compactClasses[status]}`}
              title={canReassignTables ? `Galds ${match.table}` : `Galds ${match.table} - kārtot pēc galda, lai pārvietotu`}
              {...buildDragProps(match.id, onSwapTables, canReassignTables)}
            >
              <div className="flex h-full min-h-0 flex-col">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="shrink-0 font-mono text-2xl font-black leading-none tabular-nums text-[#1C1C1E]">{match.table}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">Galds</span>
                  </div>
                  <Grip size={13} className="shrink-0 text-apple-secondary opacity-40 transition-opacity group-hover:opacity-100" />
                </div>

                <div className="mt-3">
                  <span
                    title={statusLabels[status]}
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${compactBadgeClasses[status]}`}
                  >
                    <StatusIcon status={status} />
                    <span>{compactStatusLabels[status]}</span>
                  </span>
                </div>

                <div className="mt-auto flex flex-wrap gap-1 pt-3">
                  {canEditResult ? (
                    <CompactActionButton
                      title={editLabel}
                      className="border-apple-blue/20 bg-apple-blue/10 text-apple-blue hover:bg-apple-blue/20"
                      onClick={() => onOpenOverride(match)}
                    >
                      <Pencil size={12} strokeWidth={2.3} />
                    </CompactActionButton>
                  ) : null}
                  {isDisputed ? (
                    <CompactActionButton
                      title="Marķēt kā izmeklē"
                      className="border-apple-orange/30 bg-apple-orange/10 text-apple-orange hover:bg-apple-orange/20"
                      onClick={() => onMarkInvestigating(match.id)}
                    >
                      <Search size={12} strokeWidth={2.3} />
                    </CompactActionButton>
                  ) : null}
                  {isInvestigating ? (
                    <CompactActionButton
                      title="Atsākt spēli"
                      className="border-apple-blue/30 bg-apple-blue/10 text-apple-blue hover:bg-apple-blue/20"
                      onClick={() => onResetInvestigation(match.id)}
                    >
                      <RotateCcw size={12} strokeWidth={2.3} />
                    </CompactActionButton>
                  ) : null}
                  {isDisputed ? (
                    <CompactActionButton
                      title="Noņemt brīdinājumu"
                      className="border-apple-red/30 bg-apple-red/10 text-apple-red hover:bg-apple-red hover:text-white"
                      onClick={() => onClearAlert(match.id)}
                    >
                      <X size={12} strokeWidth={2.3} />
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

/**
 * CompactActionButton conforms to Apple HIG minimum 44x44pt touch target envelope
 * using an outer 44px container around the compact visual button.
 */
function CompactActionButton({ title, className, onClick, children }) {
  return (
    <div className="relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
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
        className={`inline-flex size-7 items-center justify-center rounded-lg border transition-all active:scale-90 ${className}`}
      >
        {children}
      </button>
    </div>
  )
}

export function buildDragProps(matchId, onSwapTables, canReassignTables = true) {
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
  scheduled: 'border-black/[0.08] bg-white text-[#1C1C1E]',
  in_progress: 'border-apple-blue/30 bg-apple-blue/[0.03] text-[#1C1C1E]',
  disputed: 'border-apple-red/40 bg-apple-red/[0.04] text-[#1C1C1E]',
  investigating: 'border-apple-orange/40 bg-apple-orange/[0.04] text-[#1C1C1E]',
  awaiting_confirmation: 'border-apple-purple/30 bg-apple-purple/[0.03] text-[#1C1C1E]',
  completed: 'border-apple-green/30 bg-apple-green/[0.04] text-[#1C1C1E]',
}

const compactBadgeClasses = {
  scheduled: 'border-black/[0.08] bg-black/[0.04] text-[#8E8E93]',
  in_progress: 'border-apple-blue/25 bg-apple-blue/10 text-apple-blue',
  disputed: 'border-apple-red/25 bg-apple-red/10 text-apple-red',
  investigating: 'border-apple-orange/25 bg-apple-orange/10 text-apple-orange',
  awaiting_confirmation: 'border-apple-purple/25 bg-apple-purple/10 text-apple-purple',
  completed: 'border-apple-green/25 bg-apple-green/10 text-apple-green',
}

export function CompactLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="text-[11px] font-semibold text-[#8E8E93] mr-1">Statusi:</span>
      {Object.entries(statusLabels).map(([status, label]) => (
        <span key={status} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badgeClasses[status]}`}>
          <StatusIcon status={status} />
          {label}
        </span>
      ))}
    </div>
  )
}

function StatusIcon({ status }) {
  const Icon = status === 'disputed' ? AlertTriangle : status === 'investigating' ? Search : status === 'completed' ? CheckCircle2 : Clock
  return <Icon size={12} strokeWidth={2.3} className={status === 'in_progress' ? 'animate-pulse text-apple-blue' : ''} />
}

const badgeClasses = {
  scheduled: 'text-[#8E8E93] border-black/[0.08] bg-black/[0.04]',
  in_progress: 'text-apple-blue border-apple-blue/20 bg-apple-blue/10',
  disputed: 'text-apple-red border-apple-red/25 bg-apple-red/10',
  investigating: 'text-apple-orange border-apple-orange/25 bg-apple-orange/10',
  awaiting_confirmation: 'text-apple-purple border-apple-purple/25 bg-apple-purple/10',
  completed: 'text-apple-green border-apple-green/20 bg-apple-green/10',
}

export function MatchSummaryRow({ tournament, match }) {
  const { playerA, playerB } = getMatchPlayers(match, tournament.players)
  const status = deriveMatchStatus(match, tournament.maxSetsPerMatch)
  const scoreA = getSetScore(match, match.playerAId)
  const scoreB = getSetScore(match, match.playerBId)

  return (
    <div className="rounded-xl border border-black/[0.06] bg-[#F2F2F7]/50 px-3.5 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8E93]">Galds {match.table}</p>
          <p className="text-sm font-semibold text-[#1C1C1E]">{playerA?.name || 'TBD'} pret {playerB?.name || 'TBD'}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-bold tabular-nums text-[#1C1C1E]">{scoreA} : {scoreB}</p>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${badgeClasses[status]}`}>
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
  const status = deriveMatchStatus(match, tournament.maxSetsPerMatch)
  const scoreA = getSetScore(match, match.playerAId)
  const scoreB = getSetScore(match, match.playerBId)
  const isDisputed = status === 'disputed'
  const isInvestigating = status === 'investigating'
  const canEditResult = status !== 'scheduled'
  const editLabel = getEditLabel(status)

  const rowState = isDisputed
    ? 'bg-apple-red/[0.04]'
    : isInvestigating
      ? 'bg-apple-orange/[0.04]'
      : status === 'completed'
        ? 'bg-apple-green/[0.02]'
      : 'hover:bg-black/[0.02]'

  return (
    <tr className={`transition-colors align-middle ${rowState}`} {...dragProps}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Grip size={14} className={dragProps.draggable ? 'text-apple-secondary cursor-grab active:cursor-grabbing' : 'text-apple-tertiary'} />
          <span className="font-mono text-base font-bold tabular-nums text-[#1C1C1E]">{match.table}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="truncate font-semibold text-[#1C1C1E]">{playerA?.name || 'TBD'}</p>
        <p className="truncate text-xs text-[#8E8E93]">{playerA?.representation || 'Gaida spēlētāju'}</p>
      </td>
      <td className="px-4 py-3">
        <p className="truncate font-semibold text-[#1C1C1E]">{playerB?.name || 'TBD'}</p>
        <p className="truncate text-xs text-[#8E8E93]">{playerB?.representation || 'Gaida spēlētāju'}</p>
      </td>
      <td className="px-4 py-3">
        <div className="font-mono text-base font-bold tabular-nums text-[#1C1C1E]">
          {scoreA} : {scoreB}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeClasses[status]}`}>
          <StatusIcon status={status} />
          {statusLabels[status]}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-1">
          <TableActionButton
            title={editLabel}
            enabled={canEditResult}
            onClick={() => onOpenOverride(match)}
            activeClassName="border-apple-blue/20 bg-apple-blue/10 text-apple-blue hover:bg-apple-blue/20"
          >
            <Pencil size={14} strokeWidth={2.3} />
          </TableActionButton>
          <TableActionButton
            title="Marķēt kā izmeklē"
            enabled={isDisputed}
            onClick={() => onMarkInvestigating(match.id)}
            activeClassName="border-apple-orange/30 bg-apple-orange/10 text-apple-orange hover:bg-apple-orange/20"
          >
            <Search size={14} strokeWidth={2.3} />
          </TableActionButton>
          <TableActionButton
            title="Atsākt spēli"
            enabled={isInvestigating}
            onClick={() => onResetInvestigation(match.id)}
            activeClassName="border-apple-blue/30 bg-apple-blue/10 text-apple-blue hover:bg-apple-blue/20"
          >
            <RotateCcw size={14} strokeWidth={2.3} />
          </TableActionButton>
          <TableActionButton
            title="Noņemt brīdinājumu"
            enabled={isDisputed}
            onClick={() => onClearAlert(match.id)}
            activeClassName="border-apple-red/30 bg-apple-red/10 text-apple-red hover:bg-apple-red hover:text-white"
          >
            <X size={14} strokeWidth={2.3} />
          </TableActionButton>
        </div>
      </td>
    </tr>
  )
}

/**
 * TableActionButton conforms to Apple HIG minimum 44x44pt touch target envelope
 * using an outer 44px container around the 32px visual button.
 */
function TableActionButton({ title, enabled, onClick, activeClassName, children }) {
  return (
    <div className="relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
      <button
        type="button"
        onClick={enabled ? onClick : undefined}
        title={title}
        aria-label={title}
        disabled={!enabled}
        className={`inline-flex size-8 items-center justify-center rounded-lg border transition-all active:scale-95 ${
          enabled
            ? activeClassName
            : 'cursor-not-allowed border-black/[0.06] bg-black/[0.02] text-apple-tertiary'
        }`}
      >
        {children}
      </button>
    </div>
  )
}

function getEditLabel(status) {
  if (status === 'disputed') return 'Atrisināt strīdu'
  if (status === 'investigating') return 'Ievadīt lēmumu'
  if (status === 'in_progress') return 'Pabeigt manuāli'
  if (status === 'awaiting_confirmation') return 'Labot rezultātu'
  return 'Koriģēt rezultātu'
}
