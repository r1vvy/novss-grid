import React, { useMemo, useState } from 'react'
import { Activity, AlertTriangle, CheckCircle2, Clock, LayoutGrid, Rows3, Trophy, Users, X } from 'lucide-react'
import { AlertRail } from './AlertRail'
import { CompactLegend, TableGrid } from './TableGrid'
import { RoundProgress } from './RoundProgress'
import { TournamentHeader } from './TournamentHeader'
import {
  calculateStandings,
  canGenerateNextRound,
  deriveMatchStatus,
  generateNextSwissRound,
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [sortBy, setSortBy] = useState('table')
  const [viewMode, setViewMode] = useState('table')
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
    () => [...currentMatches].sort((a, b) => compareMatches(a, b, sortBy)),
    [currentMatches, sortBy],
  )
  const standings = useMemo(() => calculateStandings(tournament), [tournament])
  const alerts = currentMatches.filter((match) => deriveMatchStatus(match) === 'disputed')
  const canGenerate = canGenerateNextRound(tournament)

  function updateSetup(field, value) {
    setSetup((current) => ({ ...current, [field]: value }))
  }

  function openOverride(match) {
    setOverrideMatch(match)
    setOverrideSetResults(match.setResults.map((set) => ({ winnerId: set.winnerId })))
    setOverrideReason(match.overrideMeta?.reason || defaultReasonForStatus(deriveMatchStatus(match)))
    setOverrideNote(match.overrideMeta?.note || '')
  }

  function closeOverride() {
    setOverrideMatch(null)
    setOverrideSetResults([])
    setOverrideReason('referee_decision')
    setOverrideNote('')
  }

  return (
    <main className="mx-auto grid max-w-[1800px] gap-4 px-3 py-4 lg:grid-cols-[1fr_320px]">
      <section className="min-w-0 space-y-4">
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:mr-auto">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-nvssMuted">Skats</span>
                <div className="grid grid-cols-2 rounded-md border border-nvssBorder bg-nvssBg p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`flex min-h-[36px] items-center gap-2 rounded px-3 text-sm font-semibold ${viewMode === 'table' ? 'bg-nvssGreenAction text-white' : 'text-nvssMuted'}`}
                  >
                    <Rows3 size={15} />
                    Tabula
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('compact')}
                    className={`flex min-h-[36px] items-center gap-2 rounded px-3 text-sm font-semibold ${viewMode === 'compact' ? 'bg-nvssGreenAction text-white' : 'text-nvssMuted'}`}
                  >
                    <LayoutGrid size={15} />
                    Kompakts
                  </button>
                </div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-nvssMuted">Kārtot pēc</span>
              <div className="grid grid-cols-2 rounded-md border border-nvssBorder bg-nvssBg p-1">
                <button
                  type="button"
                  onClick={() => setSortBy('table')}
                  className={`min-h-[36px] rounded px-3 text-sm font-semibold ${sortBy === 'table' ? 'bg-nvssGreenAction text-white' : 'text-nvssMuted'}`}
                >
                  Galda
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('status')}
                  className={`min-h-[36px] rounded px-3 text-sm font-semibold ${sortBy === 'status' ? 'bg-nvssGreenAction text-white' : 'text-nvssMuted'}`}
                >
                  Statusa
                </button>
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
              <div className="border-t border-nvssBorder px-4 py-3">
                <CompactLegend />
              </div>
            </>
          )}
        />
      </section>

      <aside className="space-y-4">
        <AlertRail tournament={tournament} alerts={alerts} onMarkInvestigating={onMarkInvestigating} />
        <section className="rounded-md border border-nvssBorder bg-nvssSurface p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Activity size={18} className="text-nvssGreen" />
            Kopvērtējums
          </div>
          <div className="space-y-2">
            {standings.slice(0, 10).map((player, index) => (
              <div key={player.id} className="grid grid-cols-[28px_1fr_auto] items-center gap-2 text-sm">
                <span className="text-nvssMuted">{index + 1}</span>
                <span className="truncate font-medium">{player.name}</span>
                <span className="text-right text-nvssGreen">{player.points} p.</span>
                <span />
                <span className="text-xs text-nvssMuted">Buholcs {player.buchholz}</span>
              </div>
            ))}
          </div>
        </section>
      </aside>
      {isSettingsOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6">
          <div className="max-h-[calc(100vh-48px)] w-full max-w-3xl overflow-y-auto rounded-md border border-nvssBorder bg-nvssSurface p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Trophy size={18} className="text-nvssGreen" />
                Turnīra iestatījumi
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="min-h-[36px] rounded border border-nvssBorder px-3 text-sm text-nvssMuted hover:text-white"
              >
                Aizvērt
              </button>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                onSetupSubmit(setup)
                setIsSettingsOpen(false)
              }}
            >
              <label className="block text-xs font-semibold text-nvssMuted">
                Turnīra nosaukums
                <input className="mt-1 min-h-[44px] w-full rounded border border-nvssBorder bg-nvssBg px-3 text-white" value={setup.name} onChange={(e) => updateSetup('name', e.target.value)} />
              </label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  ['maxSetsPerMatch', 'Maks. seti'],
                  ['win', 'Uzvara'],
                  ['draw', 'Neizšķirts'],
                  ['closeWin', 'Cieša uzvara'],
                  ['loss', 'Zaudējums'],
                ].map(([field, label]) => (
                  <label key={field} className="block text-xs font-semibold text-nvssMuted">
                    {label}
                    <input type="number" min="0" className="mt-1 min-h-[44px] w-full rounded border border-nvssBorder bg-nvssBg px-3 text-white" value={setup[field]} onChange={(e) => updateSetup(field, e.target.value)} />
                  </label>
                ))}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="min-h-[44px] rounded border border-nvssBorder px-4 font-semibold text-nvssMuted hover:text-white"
                >
                  Atcelt
                </button>
                <button type="submit" className="min-h-[44px] rounded bg-nvssGreenAction px-4 font-semibold text-white">
                  Saglabāt iestatījumus
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
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
    <div className="flex items-center gap-2 rounded border border-nvssBorder bg-nvssBg px-3 py-2">
      <Icon size={17} className={color} />
      <span className="text-xs text-nvssMuted">{label}</span>
      <span className="ml-auto font-semibold">{value}</span>
    </div>
  )
}

export const organizerIcons = { Users, Clock, AlertTriangle, CheckCircle2 }
const modalStatusClasses = {
  scheduled: 'text-nvssMuted border-nvssBorder',
  in_progress: 'text-nvssGreen border-nvssGreen',
  disputed: 'text-nvssAlert border-nvssAlert',
  investigating: 'text-amber-200 border-amber-400',
  completed: 'text-slate-300 border-nvssBorder',
  awaiting_confirmation: 'text-nvssBlue border-nvssBlue',
  verified: 'text-nvssGreen border-nvssBorder',
}
const modalStatusLabels = {
  scheduled: 'Ieplānots',
  in_progress: 'Notiek',
  disputed: 'Strīds',
  investigating: 'Izmeklē',
  completed: 'Pabeigts',
  awaiting_confirmation: 'Gaida apstiprinājumu',
  verified: 'Apstiprināts',
}

function compareMatches(a, b, sortBy) {
  if (sortBy === 'status') {
    const statusOrder = {
      disputed: 0,
      investigating: 1,
      in_progress: 2,
      awaiting_confirmation: 3,
      scheduled: 4,
      completed: 5,
      verified: 6,
    }

    const statusDiff = (statusOrder[deriveMatchStatus(a)] ?? 99) - (statusOrder[deriveMatchStatus(b)] ?? 99)
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
  const winnerOptions = tournament.players.filter((player) => [match.playerAId, match.playerBId].includes(player.id))
  const status = deriveMatchStatus(match)
  const currentScore = winnerOptions.map((player) => ({
    ...player,
    wins: match.setResults.filter((set) => set.winnerId === player.id).length,
    confirmed: Boolean(match.confirmations?.[player.id]),
  }))
  const draftScore = winnerOptions.map((player) => ({
    ...player,
    wins: setResults.filter((set) => set.winnerId === player.id).length,
  }))
  const draftWinner = draftScore.find((player) => player.wins >= match.targetWins)
  const canAddSet = setResults.length < tournament.maxSetsPerMatch
  const isDrawDraft = setResults.length === tournament.maxSetsPerMatch
    && !draftWinner
    && draftScore[0]?.wins === draftScore[1]?.wins
  const isDraftValid = isDrawDraft || (Boolean(draftWinner) && draftScore.filter((player) => player.wins >= match.targetWins).length === 1)
  const title = getOverrideTitle(status)
  const playerA = winnerOptions[0]
  const playerB = winnerOptions[1]
  const currentScoreLine = `${currentScore[0]?.wins ?? 0}:${currentScore[1]?.wins ?? 0}`
  const draftScoreLine = `${draftScore[0]?.wins ?? 0}:${draftScore[1]?.wins ?? 0}`

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="flex max-h-[calc(100vh-48px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-nvssBorder bg-nvssSurface shadow-2xl">
        <div className="border-b border-nvssBorder px-5 py-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px_40px] lg:items-start">
            <div className="min-w-0">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-nvssGreen">Rezultāta rediģēšana</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">{title}</h3>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-nvssMuted">
                  <span className="rounded-full bg-nvssBg px-3 py-1 font-semibold text-white">Galds {match.table}</span>
                  <StatusBadge status={status} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-nvssBorder bg-nvssBg px-4 py-3">
              <p className="text-xs uppercase tracking-[0.12em] text-nvssMuted">Pašreizējais rezultāts</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{currentScore[0]?.name}</p>
                  <p className="truncate text-xs text-nvssMuted">{currentScore[0]?.confirmed ? 'Apstiprināja' : 'Nav apstiprināts'}</p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-3xl font-black text-white">{currentScoreLine}</p>
                </div>
                <div className="min-w-0 sm:text-right">
                  <p className="truncate text-sm font-semibold text-white">{currentScore[1]?.name}</p>
                  <p className="truncate text-xs text-nvssMuted">{currentScore[1]?.confirmed ? 'Apstiprināja' : 'Nav apstiprināts'}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Aizvērt"
              className="inline-flex size-10 self-start items-center justify-center rounded-lg border border-nvssBorder text-nvssMuted hover:text-white lg:justify-self-end"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          <div className="space-y-4">
            <section className="space-y-4">
              <div className="rounded-xl border border-nvssBorder bg-nvssBg p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Jaunais rezultāts</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isDraftValid ? 'bg-emerald-500/15 text-emerald-200' : 'bg-amber-500/15 text-amber-200'}`}>
                    {isDraftValid ? 'Var saglabāt' : 'Nepilnīgs melnraksts'}
                  </span>
                </div>

                <div className="mt-4 rounded-xl border border-nvssBorder bg-nvssSurface px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-nvssMuted">Rezultāts pēc saglabāšanas</span>
                    <span className="font-mono text-2xl font-black text-white">{draftScoreLine}</span>
                  </div>
                  <p className="mt-2 text-sm text-nvssMuted">
                    {isDrawDraft
                      ? 'Abi spēlētāji pabeidz maču neizšķirti.'
                      : draftWinner
                        ? `${draftWinner.name} sasniedz nepieciešamo setu skaitu un rezultātu var saglabāt.`
                        : 'Lai saglabātu, vienam spēlētājam jāsasniedz nepieciešamais uzvarēto setu skaits vai jāaizpilda visi seti līdz neizšķirtam.'}
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  {setResults.map((set, index) => (
                    <div key={`${index}-${set.winnerId}`} className="grid gap-3 rounded-xl border border-nvssBorder bg-nvssSurface p-3 md:grid-cols-[96px_minmax(0,1fr)_120px]">
                      <div className="flex items-center text-sm font-semibold text-white">
                        Sets {index + 1}
                      </div>
                      <label className="block text-sm font-medium text-nvssMuted">
                        Uzvarētājs
                        <select
                          value={set.winnerId}
                          onChange={(event) => updateSetWinner(index, event.target.value)}
                          className="mt-1 min-h-[44px] w-full rounded-lg border border-nvssBorder bg-nvssBg px-3 text-white"
                        >
                          {winnerOptions.map((player) => (
                            <option key={player.id} value={player.id}>{player.name}</option>
                          ))}
                        </select>
                      </label>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeSet(index)}
                          className="min-h-[44px] w-full rounded-lg border border-nvssBorder px-3 text-sm font-semibold text-nvssMuted hover:text-white"
                        >
                          Noņemt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-col items-center gap-3 text-center">
                  <button
                    type="button"
                    onClick={addSet}
                    disabled={!canAddSet}
                    className={`min-h-[44px] rounded-lg px-4 text-sm font-semibold ${canAddSet ? 'bg-nvssGreenAction text-white' : 'cursor-not-allowed border border-nvssBorder text-nvssMuted'}`}
                  >
                    Pievienot setu
                  </button>
                  <span className="text-sm text-nvssMuted">
                    {setResults.length} / {tournament.maxSetsPerMatch} seti
                  </span>
                </div>

                <div className="mt-4 rounded-xl border border-dashed border-nvssBorder bg-nvssSurface px-4 py-3">
                  <p className={`text-sm font-medium ${isDraftValid ? 'text-emerald-200' : 'text-amber-200'}`}>
                    {isDraftValid
                      ? 'Melnraksts ir korekts un saglabājot spēle tiks apstiprināta.'
                      : `Pašlaik nevar saglabāt. Lūdzu pārbaudiet ievadītos datus.`}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-nvssBorder bg-nvssBg p-4">
                <p className="text-sm font-semibold text-white">Kāpēc rezultāts tiek labots?</p>
                <div className="mt-4 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                  <label className="block text-sm font-medium text-nvssMuted">
                    Iemesls
                    <select
                      value={reason}
                      onChange={(event) => onReasonChange(event.target.value)}
                      className="mt-1 min-h-[44px] w-full rounded-lg border border-nvssBorder bg-nvssSurface px-3 text-white"
                    >
                      <option value="referee_decision">Tiesneša lēmums</option>
                      <option value="score_entry_error">Nepareizi ievadīts rezultāts</option>
                      <option value="other">Cits iemesls</option>
                    </select>
                  </label>
                  <label className="block text-sm font-medium text-nvssMuted">
                    Piezīme
                    <textarea
                      value={note}
                      onChange={(event) => onNoteChange(event.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-nvssBorder bg-nvssSurface px-3 py-2 text-white"
                      placeholder="Īss skaidrojums auditam"
                    />
                  </label>
                </div>
                {match.overrideMeta?.reason ? (
                  <div className="mt-4 rounded-xl border border-nvssBorder bg-nvssSurface px-4 py-3 text-sm">
                    <p className="font-medium text-white">Iepriekšējais organizatora labojums</p>
                    <p className="mt-1 text-nvssMuted">{match.overrideMeta.note || 'Nav iepriekšējās piezīmes'}</p>
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </div>
        <div className="border-t border-nvssBorder bg-nvssSurface/95 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-nvssMuted">
              {isDraftValid
                ? 'Rezultāts ir gatavs saglabāšanai.'
                : 'Saglabāšana bloķēta, kamēr nav veikta pareiza ievade.'}
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="min-h-[44px] rounded-lg border border-nvssBorder px-4 font-semibold text-nvssMuted hover:text-white">
                Atcelt
              </button>
              <button type="button" disabled={!isDraftValid} onClick={onSubmit} className="min-h-[44px] rounded-lg bg-nvssGreenAction px-5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                Saglabāt rezultātu
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

function defaultReasonForStatus(status) {
  if (status === 'disputed' || status === 'investigating') return 'referee_decision'
  if (status === 'in_progress') return 'manual_finish'
  return 'score_entry_error'
}

function StatusBadge({ status }) {
  const Icon = status === 'disputed' ? AlertTriangle : status === 'verified' ? CheckCircle2 : Clock
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs font-semibold ${modalStatusClasses[status]}`}>
      <Icon size={14} className={status === 'in_progress' ? 'animate-pulse' : ''} />
      {modalStatusLabels[status]}
    </span>
  )
}
