import React, { useEffect, useMemo, useState } from 'react'
import { Activity, AlertTriangle, CheckCircle2, Clock, LayoutGrid, Rows3, Trophy, Users, X, ChevronRight } from 'lucide-react'
import { AlertRail } from './AlertRail'
import { CompactLegend, TableGrid } from './TableGrid'
import { RoundProgress } from './RoundProgress'
import { TournamentHeader } from './TournamentHeader'
import {
  calculateStandings,
  canGenerateNextRound,
  deriveMatchStatus,
  generateNextSwissRound,
  getOverrideAuditLabel,
  getRequiredWins,
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
  const [standingsPage, setStandingsPage] = useState(1)
  const [overrideMatch, setOverrideMatch] = useState(null)
  const [overrideSetResults, setOverrideSetResults] = useState([])
  const [overrideReason, setOverrideReason] = useState('referee_decision')
  const [overrideNote, setOverrideNote] = useState('')
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
  const totalStandingsPages = Math.max(1, Math.ceil(standings.length / STANDINGS_PAGE_SIZE))
  const pagedStandings = useMemo(() => {
    const start = (standingsPage - 1) * STANDINGS_PAGE_SIZE
    return standings.slice(start, start + STANDINGS_PAGE_SIZE)
  }, [standings, standingsPage])
  const alerts = currentMatches.filter((match) => deriveMatchStatus(match, tournament.maxSetsPerMatch) === 'disputed')
  const canGenerate = canGenerateNextRound(tournament)

  useEffect(() => {
    setStandingsPage((current) => Math.min(current, totalStandingsPages))
  }, [totalStandingsPages])

  function updateSetup(field, value) {
    setSetup((current) => ({ ...current, [field]: value }))
  }

  function openOverride(match) {
    setOverrideMatch(match)
    setOverrideSetResults(match.setResults.map((set) => ({ winnerId: set.winnerId })))
    setOverrideReason(match.overrideMeta?.reason || '')
    setOverrideNote(match.overrideMeta?.note || '')
  }

  function closeOverride() {
    setOverrideMatch(null)
    setOverrideSetResults([])
    setOverrideReason('')
    setOverrideNote('')
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
          onOpenOverride={openOverride}
          onSwapTables={onSwapTables}
          titleActions={(
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Apple HIG Segmented Control: View Mode */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">Skats:</span>
                <div className="inline-flex rounded-xl border border-black/[0.04] bg-black/[0.06] p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`flex min-h-[30px] items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all ${
                      viewMode === 'table'
                        ? 'bg-white text-slate-900 shadow-apple-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Rows3 size={14} strokeWidth={2.2} />
                    <span>Tabula</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('compact')}
                    className={`flex min-h-[30px] items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all ${
                      viewMode === 'compact'
                        ? 'bg-white text-slate-900 shadow-apple-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <LayoutGrid size={14} strokeWidth={2.2} />
                    <span>Kompakts</span>
                  </button>
                </div>
              </div>

              {/* Apple HIG Segmented Control: Sort By */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">Kārtot:</span>
                <div className="inline-flex rounded-xl border border-black/[0.04] bg-black/[0.06] p-0.5">
                  <button
                    type="button"
                    onClick={() => setSortBy('table')}
                    className={`min-h-[30px] rounded-lg px-3 text-xs font-semibold transition-all ${
                      sortBy === 'table'
                        ? 'bg-white text-slate-900 shadow-apple-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Pēc galda
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('status')}
                    className={`min-h-[30px] rounded-lg px-3 text-xs font-semibold transition-all ${
                      sortBy === 'status'
                        ? 'bg-white text-slate-900 shadow-apple-sm'
                        : 'text-slate-500 hover:text-slate-800'
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
            <span className="text-[11px] font-semibold text-[#8E8E93]">
              Lapa {standingsPage} no {totalStandingsPages}
            </span>
          </div>

          <div className="divide-y divide-black/[0.04]">
            {pagedStandings.map((player, index) => {
              const rank = (standingsPage - 1) * STANDINGS_PAGE_SIZE + index + 1
              return (
                <div key={player.id} className="grid grid-cols-[24px_1fr_auto] items-center gap-2 py-2 text-xs transition-colors hover:bg-slate-500/[0.03] rounded-lg px-1">
                  <span className={`font-mono text-xs font-semibold tabular-nums ${rank <= 3 ? 'text-apple-blue font-bold' : 'text-[#8E8E93]'}`}>
                    {rank}.
                  </span>
                  <div className="min-w-0 pr-1">
                    <p className="truncate font-semibold text-[#1C1C1E]">{player.name}</p>
                    <p className="truncate text-[10px] text-[#8E8E93]">Buholcs: {player.buchholz}</p>
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
              onClick={() => setStandingsPage((current) => Math.max(1, current - 1))}
              disabled={standingsPage === 1}
              className="inline-flex min-h-[32px] items-center rounded-lg border border-black/[0.08] bg-black/[0.02] px-3 text-xs font-semibold text-slate-700 transition hover:bg-black/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Iepriekšējā
            </button>
            <span className="text-[10px] text-[#8E8E93] tabular-nums">
              {(standingsPage - 1) * STANDINGS_PAGE_SIZE + 1}–{Math.min(standingsPage * STANDINGS_PAGE_SIZE, standings.length)} no {standings.length}
            </span>
            <button
              type="button"
              onClick={() => setStandingsPage((current) => Math.min(totalStandingsPages, current + 1))}
              disabled={standingsPage === totalStandingsPages}
              className="inline-flex min-h-[32px] items-center rounded-lg border border-black/[0.08] bg-black/[0.02] px-3 text-xs font-semibold text-slate-700 transition hover:bg-black/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Nākamā
            </button>
          </div>
        </section>
      </aside>

      {/* Tournament Settings Modal - macOS Sheet Style */}
      {isSettingsOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 backdrop-blur-md px-4 py-6">
          <div className="max-h-[calc(100vh-48px)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-black/[0.08] bg-white p-6 shadow-apple-modal">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-apple-blue/10 text-apple-blue">
                  <Trophy size={18} strokeWidth={2.3} />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-[#1C1C1E]">Turnīra iestatījumi</h3>
                  <p className="text-xs text-[#8E8E93]">Konfigurējiet punktus un setu skaitu</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="flex size-8 items-center justify-center rounded-full bg-black/[0.06] text-slate-600 transition hover:bg-black/[0.1] active:scale-95"
                aria-label="Aizvērt"
              >
                <X size={16} />
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
                  className="min-h-[42px] rounded-xl border border-black/[0.08] bg-black/[0.03] px-4 text-xs font-semibold text-slate-700 transition hover:bg-black/[0.06] active:scale-[0.98]"
                >
                  Atcelt
                </button>
                <button
                  type="submit"
                  className="min-h-[42px] rounded-xl bg-apple-blue px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-apple-blueHover active:scale-[0.98]"
                >
                  Saglabāt iestatījumus
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Override Modal */}
      {overrideMatch ? (
        <OverrideModal
          tournament={tournament}
          match={overrideMatch}
          setResults={overrideSetResults}
          onSetResultsChange={setOverrideSetResults}
          reason={overrideReason}
          note={overrideNote}
          onReasonChange={setOverrideReason}
          onNoteChange={setOverrideNote}
          onClose={closeOverride}
          onSubmit={() => {
            onForceOverride(overrideMatch.id, overrideSetResults, {
              reason: overrideReason,
              note: overrideNote,
              editedBy: 'Organizators',
              editedAt: 'Tikko',
            })
            closeOverride()
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
  investigating: 'text-amber-800 border-apple-orange/25 bg-apple-orange/10',
  awaiting_confirmation: 'text-apple-purple border-apple-purple/25 bg-apple-purple/10',
  completed: 'text-emerald-700 border-emerald-500/20 bg-emerald-500/10',
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

function OverrideModal({
  tournament,
  match,
  setResults,
  onSetResultsChange,
  reason,
  note,
  onReasonChange,
  onNoteChange,
  onClose,
  onSubmit,
}) {
  const [isReasonFormVisible, setIsReasonFormVisible] = useState(false)
  const [auditPage, setAuditPage] = useState(1)

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const winnerOptions = tournament.players.filter((player) => [match.playerAId, match.playerBId].includes(player.id))
  const status = deriveMatchStatus(match, tournament.maxSetsPerMatch)
  const currentScore = winnerOptions.map((player) => ({
    ...player,
    wins: match.setResults.filter((set) => set.winnerId === player.id).length,
    confirmed: Boolean(match.confirmations?.[player.id]),
  }))
  const draftScore = winnerOptions.map((player) => ({
    ...player,
    wins: setResults.filter((set) => set.winnerId === player.id).length,
  }))
  const requiredWins = getRequiredWins(tournament.maxSetsPerMatch)
  const draftWinner = draftScore.find((player) => player.wins >= requiredWins)
  const canAddSet = setResults.length < tournament.maxSetsPerMatch && !draftWinner
  const isDrawDraft = setResults.length === tournament.maxSetsPerMatch
    && !draftWinner
    && draftScore[0]?.wins === draftScore[1]?.wins
  const isDraftValid = isDrawDraft || (Boolean(draftWinner) && draftScore.filter((player) => player.wins >= requiredWins).length === 1)
  const hasResultChanged = setResults.length !== match.setResults.length
    || setResults.some((set, index) => set.winnerId !== match.setResults[index]?.winnerId)
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

  function updateSetWinner(index, winnerId) {
    onSetResultsChange(setResults.map((set, setIndex) => (
      setIndex === index
        ? { winnerId }
        : set
    )))
  }

  function addSet() {
    if (!canAddSet) return
    onSetResultsChange([...setResults, { winnerId: winnerOptions[0]?.id || '' }])
  }

  function removeSet(index) {
    onSetResultsChange(setResults.filter((_, setIndex) => setIndex !== index))
  }

  return (
    <>
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="override-modal-title"
        className="flex max-h-[calc(100vh-48px)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-black/[0.08] bg-white shadow-apple-modal"
      >
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
              className="flex size-8 items-center justify-center rounded-full bg-black/[0.06] text-slate-600 transition hover:bg-black/[0.1] active:scale-95"
            >
              <X size={16} />
            </button>
          </div>
        </div>

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
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isDraftValid ? 'bg-emerald-500/10 text-emerald-700' : 'bg-apple-blue/10 text-apple-blue'}`}>
                  {isDraftValid ? 'Gala rezultāts' : 'Daļējs rezultāts'}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {setResults.map((set, index) => (
                <div key={`${index}-${set.winnerId}`} className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-[#F2F2F7]/50 p-3">
                  <span className="w-16 font-mono text-xs font-bold text-slate-500">Sets {index + 1}</span>
                  <div className="flex-1">
                    <select
                      value={set.winnerId}
                      onChange={(event) => updateSetWinner(index, event.target.value)}
                      className="min-h-[40px] w-full rounded-lg border border-black/[0.1] bg-white px-3 text-sm font-medium text-[#1C1C1E] transition focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20"
                    >
                      {winnerOptions.map((player) => (
                        <option key={player.id} value={player.id}>{player.name}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSet(index)}
                    className="min-h-[40px] rounded-lg border border-black/[0.08] bg-white px-3 text-xs font-semibold text-apple-red transition hover:bg-apple-red/10 active:scale-95"
                  >
                    Noņemt
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3">
              <span className="text-xs text-[#8E8E93]">
                {setResults.length} no {tournament.maxSetsPerMatch} maksimālajiem setiem
              </span>
              <button
                type="button"
                onClick={addSet}
                disabled={!canAddSet}
                className="inline-flex min-h-[36px] items-center rounded-xl bg-apple-blue px-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-apple-blueHover active:scale-95 disabled:cursor-not-allowed disabled:bg-black/[0.06] disabled:text-slate-400"
              >
                + Pievienot setu
              </button>
            </div>
          </div>

          {/* Audit History */}
          {auditEntries.length > 0 ? (
            <div className="rounded-2xl border border-black/[0.06] bg-[#F2F2F7]/40 p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Labojumu audits</p>
                <span className="text-[11px] text-[#8E8E93]">{auditEntries.length} ieraksti</span>
              </div>
              <div className="divide-y divide-black/[0.04] rounded-xl border border-black/[0.06] bg-white px-3 py-1">
                {pagedAuditEntries.map((audit, index) => (
                  <div key={`${audit.editedAt}-${auditStart + index}`} className="grid gap-2 py-2 text-xs sm:grid-cols-[auto_auto_1fr_auto] sm:items-center">
                    <span className="font-mono text-[#8E8E93]">{auditStart + index + 1}.</span>
                    <span className="font-mono font-bold text-[#1C1C1E]">{formatAuditScore(audit.previousScore, match)} → {formatAuditScore(audit.nextScore, match)}</span>
                    <span className="truncate text-slate-600" title={audit.note || ''}>
                      {getOverrideAuditLabel({ overrideMeta: audit })}{audit.note ? ` · ${audit.note}` : ''}
                    </span>
                    <span className="text-[11px] text-[#8E8E93]">{audit.editedBy || 'Organizators'} · {audit.editedAt || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-black/[0.06] bg-white px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-[#8E8E93]">
              {!hasResultChanged
                ? 'Veiciet izmaiņas setu sarakstā, lai saglabātu.'
                : isDraftValid
                  ? 'Gala rezultāts ir pabeigts un gatavs apstiprināšanai.'
                  : 'Daļējo rezultātu var saglabāt spēles turpināšanai.'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[40px] rounded-xl border border-black/[0.08] bg-black/[0.03] px-4 text-xs font-semibold text-slate-700 transition hover:bg-black/[0.06] active:scale-[0.98]"
              >
                Atcelt
              </button>
              <button
                type="button"
                disabled={!hasResultChanged}
                onClick={() => {
                  if (hasResultChanged) setIsReasonFormVisible(true)
                }}
                className="min-h-[40px] rounded-xl bg-apple-blue px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-apple-blueHover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-black/[0.06] disabled:text-slate-400 disabled:shadow-none"
              >
                Saglabāt rezultātu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {isReasonFormVisible ? (
      <ReasonModal
        reason={reason}
        note={note}
        onReasonChange={onReasonChange}
        onNoteChange={onNoteChange}
        onBack={() => setIsReasonFormVisible(false)}
        onSubmit={onSubmit}
      />
    ) : null}
    </>
  )
}

function ReasonModal({ reason, note, onReasonChange, onNoteChange, onBack, onSubmit }) {
  const canSubmit = Boolean(reason)

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-md px-4 py-6">
      <div role="dialog" aria-modal="true" aria-labelledby="reason-modal-title" className="w-full max-w-lg rounded-3xl border border-black/[0.08] bg-white p-6 shadow-apple-modal">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-apple-blue">Audita fiksācija</span>
        <h3 id="reason-modal-title" className="mt-1 text-xl font-bold tracking-tight text-[#1C1C1E]">Kāpēc rezultāts tiek labots?</h3>
        <p className="mt-1 text-xs text-[#8E8E93]">Norādiet labojuma iemeslu, lai informācija tiktu saglabāta žurnālā.</p>

        <div className="mt-5 space-y-3.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#636366]">
            Iemesls <span className="text-apple-red">*</span>
            <select
              required
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
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
              onChange={(event) => onNoteChange(event.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-black/[0.1] bg-[#F2F2F7] p-3 text-sm text-[#1C1C1E] transition focus:bg-white focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/20"
              placeholder="Īss skaidrojums auditam..."
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[40px] rounded-xl border border-black/[0.08] bg-black/[0.03] px-4 text-xs font-semibold text-slate-700 transition hover:bg-black/[0.06] active:scale-[0.98]"
          >
            Atpakaļ
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={onSubmit}
            className="min-h-[40px] rounded-xl bg-apple-blue px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-apple-blueHover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-black/[0.06] disabled:text-slate-400"
          >
            Apstiprināt un saglabāt
          </button>
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
