import React, { useMemo, useState } from 'react'
import { Activity, AlertTriangle, CheckCircle2, Clock, LayoutGrid, Rows3, Trophy, Users, X } from 'lucide-react'
import { AlertRail } from './AlertRail'
import { CompactLegend, TableGrid } from './TableGrid'
import { RoundProgress } from './RoundProgress'
import { TournamentHeader } from './TournamentHeader'
import { useModalDismiss } from '../../hooks/useModalDismiss'
import { useMatchOverride } from '../../hooks/useMatchOverride'
import { useStandingsPagination } from '../../hooks/useStandingsPagination'
import {
  calculateStandings,
  canGenerateNextRound,
  deriveMatchStatus,
  generateNextSwissRound,
  getOverrideAuditLabel,
  getCurrentRoundMatches,
} from '../../utils/tournament'

export function OrganizerDashboard({
  tournament,
  onSetupSubmit,
  onClearAlert,
  onMarkInvestigating,
  onResetInvestigation,
  onForceOverride,
  onSwapTables,
  onGenerateRound,
  onOpenPlayers,
}) {
  const STANDINGS_PAGE_SIZE = 30
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [sortBy, setSortBy] = useState('table')
  const [viewMode, setViewMode] = useState('table')
  const [overrideMatch, setOverrideMatch] = useState(null)
  const [setup, setSetup] = useState({
    name: tournament.name,
    maxSetsPerMatch: tournament.maxSetsPerMatch,
    win: tournament.pointAllocation.win,
    draw: tournament.pointAllocation.draw,
    closeWin: tournament.pointAllocation.closeWin,
    loss: tournament.pointAllocation.loss,
  })

  const currentMatches = getCurrentRoundMatches(tournament)
  const sortedMatches = useMemo(
    () => [...currentMatches].sort((a, b) => compareMatches(a, b, sortBy, tournament.maxSetsPerMatch)),
    [currentMatches, sortBy, tournament.maxSetsPerMatch],
  )

  const standings = useMemo(() => calculateStandings(tournament), [tournament])
  const {
    pagedStandings,
    currentPage: standingsPage,
    totalPages: totalStandingsPages,
    nextPage,
    prevPage,
  } = useStandingsPagination(standings, STANDINGS_PAGE_SIZE)

  const alerts = currentMatches.filter((match) => deriveMatchStatus(match, tournament.maxSetsPerMatch) === 'disputed')
  const canGenerate = canGenerateNextRound(tournament)

  const settingsDismiss = useModalDismiss(isSettingsOpen, () => setIsSettingsOpen(false))

  function updateSetup(field, value) {
    setSetup((current) => ({ ...current, [field]: value }))
  }

  return (
    <main className="mx-auto grid max-w-[1700px] gap-5 px-4 py-6 lg:grid-cols-[1fr_340px]">
      <section className="min-w-0 space-y-5">
        <TournamentHeader
          tournament={tournament}
          matches={currentMatches}
          alerts={alerts}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenPlayers={onOpenPlayers}
        />

        <TableGrid
          tournament={tournament}
          matches={sortedMatches}
          viewMode={viewMode}
          canReassignTables={sortBy === 'table'}
          onClearAlert={onClearAlert}
          onMarkInvestigating={onMarkInvestigating}
          onResetInvestigation={onResetInvestigation}
          onOpenOverride={setOverrideMatch}
          onSwapTables={onSwapTables}
          titleActions={(
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Apple HIG Segmented Control: View Mode (Min 44px hit target) */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">Skats:</span>
                <div className="inline-flex rounded-xl border border-black/[0.04] bg-black/[0.06] p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`flex min-h-[44px] items-center gap-1.5 rounded-lg px-3.5 text-xs font-semibold transition-all ${
                      viewMode === 'table'
                        ? 'bg-white text-[#1C1C1E] shadow-apple-sm'
                        : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                    }`}
                  >
                    <Rows3 size={15} strokeWidth={2.2} />
                    <span>Tabula</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('compact')}
                    className={`flex min-h-[44px] items-center gap-1.5 rounded-lg px-3.5 text-xs font-semibold transition-all ${
                      viewMode === 'compact'
                        ? 'bg-white text-[#1C1C1E] shadow-apple-sm'
                        : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                    }`}
                  >
                    <LayoutGrid size={15} strokeWidth={2.2} />
                    <span>Kompakts</span>
                  </button>
                </div>
              </div>

              {/* Apple HIG Segmented Control: Sort By (Min 44px hit target) */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">Kārtot:</span>
                <div className="inline-flex rounded-xl border border-black/[0.04] bg-black/[0.06] p-1">
                  <button
                    type="button"
                    onClick={() => setSortBy('table')}
                    className={`min-h-[44px] rounded-lg px-3.5 text-xs font-semibold transition-all ${
                      sortBy === 'table'
                        ? 'bg-white text-[#1C1C1E] shadow-apple-sm'
                        : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                    }`}
                  >
                    Pēc galda
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('status')}
                    className={`min-h-[44px] rounded-lg px-3.5 text-xs font-semibold transition-all ${
                      sortBy === 'status'
                        ? 'bg-white text-[#1C1C1E] shadow-apple-sm'
                        : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                    }`}
                  >
                    Pēc statusa
                  </button>
                </div>
              </div>
            </div>
          )}
          headerContent={(
            <>
              <RoundProgress
                tournament={tournament}
                canGenerate={canGenerate}
                onGenerate={() => onGenerateRound(generateNextSwissRound(tournament))}
                embedded
              />
              <div className="border-t border-black/[0.06] px-5 py-3">
                <CompactLegend />
              </div>
            </>
          )}
        />
      </section>

      <aside className="space-y-5">
        <AlertRail tournament={tournament} alerts={alerts} onMarkInvestigating={onMarkInvestigating} />

        {/* Apple Inset Grouped Standings Panel */}
        <section className="rounded-2xl border border-black/[0.08] bg-white p-4 shadow-apple-card">
          <div className="mb-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1C1C1E]">
              <div className="flex size-7 items-center justify-center rounded-lg bg-apple-blue/10 text-apple-blue">
                <Activity size={16} strokeWidth={2.3} />
              </div>
              <span>Kopvērtējums</span>
            </div>
            <span className="text-[11px] font-semibold text-[#8E8E93] tabular-nums">
              Lapa {standingsPage} no {totalStandingsPages}
            </span>
          </div>

          <div className="divide-y divide-black/[0.04]">
            {pagedStandings.map((player, index) => {
              const rank = (standingsPage - 1) * STANDINGS_PAGE_SIZE + index + 1
              return (
                <div key={player.id} className="grid grid-cols-[24px_1fr_auto] items-center gap-2 py-2 text-xs transition-colors hover:bg-black/[0.03] rounded-lg px-1">
                  <span className={`font-mono text-xs font-semibold tabular-nums ${rank <= 3 ? 'text-apple-blue font-bold' : 'text-[#8E8E93]'}`}>
                    {rank}.
                  </span>
                  <div className="min-w-0 pr-1">
                    <p className="truncate font-semibold text-[#1C1C1E]">{player.name}</p>
                    <p className="truncate text-[10px] text-[#8E8E93] tabular-nums">Buholcs: {player.buchholz}</p>
                  </div>
                  <span className="font-mono text-xs font-bold tabular-nums text-apple-blue">
                    {player.points} p.
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-black/[0.06] pt-3">
            <button
              type="button"
              onClick={prevPage}
              disabled={standingsPage === 1}
              className="inline-flex min-h-[44px] items-center rounded-xl border border-black/[0.08] bg-black/[0.02] px-3.5 text-xs font-semibold text-[#1C1C1E] transition hover:bg-black/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Iepriekšējā
            </button>
            <span className="text-[10px] text-[#8E8E93] tabular-nums">
              {(standingsPage - 1) * STANDINGS_PAGE_SIZE + 1}–{Math.min(standingsPage * STANDINGS_PAGE_SIZE, standings.length)} no {standings.length}
            </span>
            <button
              type="button"
              onClick={nextPage}
              disabled={standingsPage === totalStandingsPages}
              className="inline-flex min-h-[44px] items-center rounded-xl border border-black/[0.08] bg-black/[0.02] px-3.5 text-xs font-semibold text-[#1C1C1E] transition hover:bg-black/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Nākamā
            </button>
          </div>
        </section>
      </aside>

      {/* Tournament Settings Modal - macOS Sheet Style with useModalDismiss */}
      {isSettingsOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-modal-title"
          onMouseDown={settingsDismiss.onBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 backdrop-blur-md px-4 py-6"
        >
          <div className="max-h-[calc(100vh-48px)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-black/[0.08] bg-white p-6 shadow-apple-modal">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-apple-blue/10 text-apple-blue">
                  <Trophy size={18} strokeWidth={2.3} />
                </div>
                <div>
                  <h3 id="settings-modal-title" className="text-lg font-bold tracking-tight text-[#1C1C1E]">Turnīra iestatījumi</h3>
                  <p className="text-xs text-[#8E8E93]">Konfigurējiet punktus un setu skaitu</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/[0.06] text-[#636366] transition hover:bg-black/[0.1] active:scale-95"
                aria-label="Aizvērt"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                onSetupSubmit(setup)
                setIsSettingsOpen(false)
              }}
            >
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#636366]">
                Turnīra nosaukums
                <input
                  className="mt-1.5 min-h-[46px] w-full rounded-xl border border-black/[0.1] bg-[#F2F2F7] px-3.5 text-sm font-medium text-[#1C1C1E] transition-all focus:bg-white focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/20"
                  value={setup.name}
                  onChange={(e) => updateSetup('name', e.target.value)}
                />
              </label>

              <div className="mt-4 grid grid-cols-2 gap-3.5">
                {[
                  ['maxSetsPerMatch', 'Maks. seti mačā'],
                  ['win', 'Punkti: Uzvara'],
                  ['draw', 'Punkti: Neizšķirts'],
                  ['closeWin', 'Punkti: Cieša uzvara'],
                  ['loss', 'Punkti: Zaudējums'],
                ].map(([field, label]) => (
                  <label key={field} className="block text-xs font-semibold uppercase tracking-wider text-[#636366]">
                    {label}
                    <input
                      type="number"
                      min="0"
                      className="mt-1.5 min-h-[46px] w-full rounded-xl border border-black/[0.1] bg-[#F2F2F7] px-3.5 font-mono text-sm font-semibold tabular-nums text-[#1C1C1E] transition-all focus:bg-white focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/20"
                      value={setup[field]}
                      onChange={(e) => updateSetup(field, e.target.value)}
                    />
                  </label>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-2.5 border-t border-black/[0.06] pt-4">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="min-h-[44px] rounded-xl border border-black/[0.08] bg-black/[0.03] px-4 text-xs font-semibold text-[#1C1C1E] transition hover:bg-black/[0.06] active:scale-[0.98]"
                >
                  Atcelt
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] rounded-xl bg-apple-blue px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-apple-blueHover active:scale-[0.98]"
                >
                  Saglabāt iestatījumus
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Single-Sheet Override Modal with Inlined Audit Reason & Notes */}
      {overrideMatch ? (
        <OverrideModal
          tournament={tournament}
          match={overrideMatch}
          onClose={() => setOverrideMatch(null)}
          onSubmit={(setResults, metadata) => {
            onForceOverride(overrideMatch.id, setResults, metadata)
            setOverrideMatch(null)
          }}
        />
      ) : null}
    </main>
  )
}

export function StatPill({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-black/[0.06] bg-[#F2F2F7]/50 px-3 py-2">
      <Icon size={16} className={color} strokeWidth={2.3} />
      <span className="text-xs text-[#8E8E93]">{label}</span>
      <span className="ml-auto font-bold tabular-nums text-[#1C1C1E]">{value}</span>
    </div>
  )
}

export const organizerIcons = { Users, Clock, AlertTriangle, CheckCircle2 }

const modalStatusClasses = {
  scheduled: 'text-[#8E8E93] border-black/[0.08] bg-black/[0.04]',
  in_progress: 'text-apple-blue border-apple-blue/20 bg-apple-blue/10',
  disputed: 'text-apple-red border-apple-red/25 bg-apple-red/10',
  investigating: 'text-apple-orange border-apple-orange/25 bg-apple-orange/10',
  awaiting_confirmation: 'text-apple-purple border-apple-purple/25 bg-apple-purple/10',
  completed: 'text-apple-green border-apple-green/20 bg-apple-green/10',
}

const modalStatusLabels = {
  scheduled: 'Ieplānots',
  in_progress: 'Notiek',
  disputed: 'Strīds',
  investigating: 'Izmeklē',
  awaiting_confirmation: 'Gaida apstiprinājumu',
  completed: 'Pabeigts',
}

function compareMatches(a, b, sortBy, maxSetsPerMatch) {
  if (sortBy === 'status') {
    const statusOrder = {
      disputed: 0,
      investigating: 1,
      in_progress: 2,
      awaiting_confirmation: 3,
      scheduled: 4,
      completed: 5,
    }

    const statusDiff = (statusOrder[deriveMatchStatus(a, maxSetsPerMatch)] ?? 99) - (statusOrder[deriveMatchStatus(b, maxSetsPerMatch)] ?? 99)
    if (statusDiff !== 0) return statusDiff
  }

  return a.table - b.table
}

/**
 * Single-Sheet Override Modal conforming to Apple HIG:
 * - Single surface dialog with backdrop blur
 * - Inlined "Audita pamatojums" section directly in the sheet (eliminating ReasonModal)
 * - Minimum 44px touch targets on buttons, selects, and controls
 * - Keyboard Escape dismissal and backdrop dismissal via useModalDismiss
 */
function OverrideModal({
  tournament,
  match,
  onClose,
  onSubmit,
}) {
  const modalDismiss = useModalDismiss(Boolean(match), onClose)
  const {
    setResults,
    reason,
    setReason,
    note,
    setNote,
    winnerOptions,
    currentScore,
    draftScore,
    canAddSet,
    isDraftValid,
    hasResultChanged,
    canSubmit,
    updateSetWinner,
    addSet,
    removeSet,
  } = useMatchOverride(match, tournament)

  const [auditPage, setAuditPage] = useState(1)
  const status = deriveMatchStatus(match, tournament.maxSetsPerMatch)
  const title = getOverrideTitle(status)
  const currentScoreLine = `${currentScore[0]?.wins ?? 0} : ${currentScore[1]?.wins ?? 0}`
  const draftScoreLine = `${draftScore[0]?.wins ?? 0} : ${draftScore[1]?.wins ?? 0}`

  const auditEntries = Array.isArray(match.overrideMeta?.editHistory)
    ? match.overrideMeta.editHistory
    : match.overrideMeta?.reason
      ? [match.overrideMeta]
      : []
  const auditPageSize = 10
  const auditPageCount = Math.max(1, Math.ceil(auditEntries.length / auditPageSize))
  const auditStart = (auditPage - 1) * auditPageSize
  const pagedAuditEntries = auditEntries.slice(auditStart, auditStart + auditPageSize)

  function handleSave() {
    if (!canSubmit) return
    onSubmit(setResults, {
      reason,
      note,
      editedBy: 'Organizators',
      editedAt: 'Tikko',
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="override-modal-title"
      onMouseDown={modalDismiss.onBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4 py-6"
    >
      <div className="flex max-h-[calc(100vh-48px)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-black/[0.08] bg-white shadow-apple-modal">
        {/* Modal Header */}
        <div className="border-b border-black/[0.06] px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-apple-blue">Rezultāta rediģēšana</span>
              <h3 id="override-modal-title" className="text-xl font-bold tracking-tight text-[#1C1C1E]">{title}</h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-apple-blue/10 px-2.5 py-0.5 text-xs font-bold text-apple-blue">Galds {match.table}</span>
                <StatusBadge status={status} />
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Aizvērt"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/[0.06] text-[#636366] transition hover:bg-black/[0.1] active:scale-95"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-5">
          {/* Current Score Summary */}
          <div className="rounded-2xl border border-black/[0.06] bg-[#F2F2F7]/50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8E93]">Pašreizējais rezultāts sistēmā</p>
            <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#1C1C1E]">{currentScore[0]?.name}</p>
                <p className="text-[11px] text-[#8E8E93]">{currentScore[0]?.confirmed ? 'Apstiprināts' : 'Nav apstiprināts'}</p>
              </div>
              <div className="font-mono text-3xl font-black tabular-nums text-[#1C1C1E]">
                {currentScoreLine}
              </div>
              <div className="min-w-0 text-right">
                <p className="truncate text-sm font-bold text-[#1C1C1E]">{currentScore[1]?.name}</p>
                <p className="text-[11px] text-[#8E8E93]">{currentScore[1]?.confirmed ? 'Apstiprināts' : 'Nav apstiprināts'}</p>
              </div>
            </div>
          </div>

          {/* New Result Editing Section */}
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-apple-card">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-black/[0.06]">
              <div>
                <p className="text-sm font-bold text-[#1C1C1E]">Jaunais labotais rezultāts</p>
                <p className="text-xs text-[#8E8E93]">Pievienojiet vai mainiet atsevišķu setu uzvarētājus</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-black tabular-nums text-apple-blue">{draftScoreLine}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isDraftValid ? 'bg-apple-green/10 text-apple-green' : 'bg-apple-blue/10 text-apple-blue'}`}>
                  {isDraftValid ? 'Gala rezultāts' : 'Daļējs rezultāts'}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {setResults.map((set, index) => (
                <div key={`${index}-${set.winnerId}`} className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-[#F2F2F7]/50 p-3">
                  <span className="w-16 font-mono text-xs font-bold text-[#8E8E93]">Sets {index + 1}</span>
                  <div className="flex-1">
                    <select
                      value={set.winnerId}
                      onChange={(event) => updateSetWinner(index, event.target.value)}
                      className="min-h-[44px] w-full rounded-xl border border-black/[0.1] bg-white px-3.5 text-sm font-medium text-[#1C1C1E] transition focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/20"
                    >
                      {winnerOptions.map((player) => (
                        <option key={player.id} value={player.id}>{player.name}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSet(index)}
                    className="min-h-[44px] rounded-xl border border-black/[0.08] bg-white px-3.5 text-xs font-semibold text-apple-red transition hover:bg-apple-red/10 active:scale-95"
                  >
                    Noņemt
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3">
              <span className="text-xs text-[#8E8E93] tabular-nums">
                {setResults.length} no {tournament.maxSetsPerMatch} maksimālajiem setiem
              </span>
              <button
                type="button"
                onClick={addSet}
                disabled={!canAddSet}
                className="inline-flex min-h-[44px] items-center rounded-xl bg-apple-blue px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-apple-blueHover active:scale-95 disabled:cursor-not-allowed disabled:bg-black/[0.06] disabled:text-apple-tertiary"
              >
                + Pievienot setu
              </button>
            </div>
          </div>

          {/* Inlined Audit Reason & Notes Section (Eliminating ReasonModal) */}
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-apple-card">
            <div className="pb-3 border-b border-black/[0.06]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-apple-blue">Audita fiksācija</span>
              <h4 className="mt-0.5 text-base font-bold text-[#1C1C1E]">Audita pamatojums</h4>
              <p className="text-xs text-[#8E8E93]">Norādiet labojuma iemeslu un piezīmi, lai izmaiņa tiktu reģistrēta žurnālā.</p>
            </div>

            <div className="mt-4 space-y-3.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#636366]">
                Iemesls <span className="text-apple-red">*</span>
                <select
                  required
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-black/[0.1] bg-[#F2F2F7] px-3.5 text-sm font-medium text-[#1C1C1E] transition focus:bg-white focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/20"
                >
                  <option value="">Izvēlieties iemeslu</option>
                  <option value="referee_decision">Tiesneša lēmums</option>
                  <option value="score_entry_error">Nepareizi ievadīts rezultāts</option>
                  <option value="other">Cits iemesls</option>
                </select>
              </label>

              <label className="block text-xs font-semibold uppercase tracking-wider text-[#636366]">
                Piezīme
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={2}
                  className="mt-1.5 w-full rounded-xl border border-black/[0.1] bg-[#F2F2F7] p-3 text-sm text-[#1C1C1E] transition focus:bg-white focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/20"
                  placeholder="Īss skaidrojums auditam..."
                />
              </label>
            </div>
          </div>

          {/* Audit History */}
          {auditEntries.length > 0 ? (
            <div className="rounded-2xl border border-black/[0.06] bg-[#F2F2F7]/40 p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#636366]">Labojumu audits</p>
                <span className="text-[11px] text-[#8E8E93] tabular-nums">{auditEntries.length} ieraksti</span>
              </div>
              <div className="divide-y divide-black/[0.04] rounded-xl border border-black/[0.06] bg-white px-3 py-1">
                {pagedAuditEntries.map((audit, index) => (
                  <div key={`${audit.editedAt}-${auditStart + index}`} className="grid gap-2 py-2 text-xs sm:grid-cols-[auto_auto_1fr_auto] sm:items-center">
                    <span className="font-mono text-[#8E8E93] tabular-nums">{auditStart + index + 1}.</span>
                    <span className="font-mono font-bold tabular-nums text-[#1C1C1E]">
                      {formatAuditScore(audit.previousScore, match)} → {formatAuditScore(audit.nextScore, match)}
                    </span>
                    <span className="truncate text-[#636366]" title={audit.note || ''}>
                      {getOverrideAuditLabel({ overrideMeta: audit })}{audit.note ? ` · ${audit.note}` : ''}
                    </span>
                    <span className="text-[11px] text-[#8E8E93]">{audit.editedBy || 'Organizators'} · {audit.editedAt || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer with Minimum 44px Touch Targets */}
        <div className="border-t border-black/[0.06] bg-white px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-[#8E8E93]">
              {!hasResultChanged
                ? 'Veiciet izmaiņas setu sarakstā, lai saglabātu.'
                : !reason
                  ? 'Lūdzu izvēlieties audita iemeslu, lai pabeigtu.'
                  : isDraftValid
                    ? 'Gala rezultāts ir pabeigts un gatavs apstiprināšanai.'
                    : 'Daļējo rezultātu var saglabāt spēles turpināšanai.'}
            </span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] rounded-xl border border-black/[0.08] bg-black/[0.03] px-4 text-xs font-semibold text-[#1C1C1E] transition hover:bg-black/[0.06] active:scale-[0.98]"
              >
                Atcelt
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleSave}
                className="min-h-[44px] rounded-xl bg-apple-blue px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-apple-blueHover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-black/[0.06] disabled:text-apple-tertiary disabled:shadow-none"
              >
                Apstiprināt un saglabāt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getOverrideTitle(status) {
  if (status === 'disputed') return 'Atrisināt strīdu'
  if (status === 'investigating') return 'Ievadīt tiesneša lēmumu'
  if (status === 'in_progress') return 'Ievadīt rezultātu manuāli'
  if (status === 'awaiting_confirmation') return 'Labot neapstiprinātu rezultātu'
  return 'Koriģēt gala rezultātu'
}

function formatAuditScore(score, match) {
  if (!score) return '—'
  return `${score[match.playerAId] ?? 0}:${score[match.playerBId] ?? 0}`
}

function StatusBadge({ status }) {
  const Icon = status === 'disputed' ? AlertTriangle : status === 'completed' ? CheckCircle2 : Clock
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${modalStatusClasses[status]}`}>
      <Icon size={12} strokeWidth={2.3} className={status === 'in_progress' ? 'animate-pulse text-apple-blue' : ''} />
      <span>{modalStatusLabels[status]}</span>
    </span>
  )
}
