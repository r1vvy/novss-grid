import React, { useMemo, useState } from 'react'
import { Activity, AlertTriangle, CheckCircle2, Clock, LayoutGrid, Rows3, Trophy, Users } from 'lucide-react'
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
  const [overrideWinnerId, setOverrideWinnerId] = useState('')
  const [overrideLoserSets, setOverrideLoserSets] = useState(0)
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
    setOverrideWinnerId(match.playerAId)
    setOverrideLoserSets(Math.max(0, Math.min(match.targetWins - 1, 0)))
    setOverrideReason(match.overrideMeta?.reason || defaultReasonForStatus(deriveMatchStatus(match)))
    setOverrideNote(match.overrideMeta?.note || '')
  }

  function closeOverride() {
    setOverrideMatch(null)
    setOverrideWinnerId('')
    setOverrideLoserSets(0)
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
                    Table
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('compact')}
                    className={`flex min-h-[36px] items-center gap-2 rounded px-3 text-sm font-semibold ${viewMode === 'compact' ? 'bg-nvssGreenAction text-white' : 'text-nvssMuted'}`}
                  >
                    <LayoutGrid size={15} />
                    Compact
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
          winnerId={overrideWinnerId}
          loserSets={overrideLoserSets}
          onWinnerChange={setOverrideWinnerId}
          onLoserSetsChange={setOverrideLoserSets}
          reason={overrideReason}
          note={overrideNote}
          onReasonChange={setOverrideReason}
          onNoteChange={setOverrideNote}
          onClose={closeOverride}
          onSubmit={() => {
            onForceOverride(overrideMatch.id, overrideWinnerId, overrideLoserSets, {
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

export function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded border border-nvssBorder bg-nvssBg px-3 py-2">
      <Icon size={17} className="text-nvssGreen" />
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
  winnerId,
  loserSets,
  reason,
  note,
  onWinnerChange,
  onLoserSetsChange,
  onReasonChange,
  onNoteChange,
  onClose,
  onSubmit,
}) {
  const winnerOptions = tournament.players.filter((player) => [match.playerAId, match.playerBId].includes(player.id))
  const selectedWinner = winnerOptions.find((player) => player.id === winnerId)
  const selectedLoser = winnerOptions.find((player) => player.id !== winnerId)
  const currentWinner = winnerOptions.find((player) => match.setResults.filter((set) => set.winnerId === player.id).length >= match.targetWins)
  const status = deriveMatchStatus(match)
  const currentScore = winnerOptions.map((player) => ({
    ...player,
    wins: match.setResults.filter((set) => set.winnerId === player.id).length,
    confirmed: Boolean(match.confirmations?.[player.id]),
  }))
  const targetWinnerSets = match.targetWins
  const nextWinnerSets = winnerId ? targetWinnerSets : 0
  const nextLoserSets = Math.max(0, Math.min(Number(loserSets) || 0, targetWinnerSets - 1))
  const title = getOverrideTitle(status)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-2xl rounded-md border border-nvssBorder bg-nvssSurface p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-nvssGreen">Rezultāta rediģēšana</p>
            <h3 className="mt-1 text-xl font-semibold">{title}</h3>
          </div>
          <button type="button" onClick={onClose} className="min-h-[36px] rounded border border-nvssBorder px-3 text-sm text-nvssMuted hover:text-white">
            Aizvērt
          </button>
        </div>
        <p className="mt-3 text-sm text-nvssMuted">
          Galds {match.table}. Pirms saglabāšanas organizators redz pašreizējo rezultāta stāvokli, apstiprinājumus un paredzamo gala iznākumu.
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-md border border-nvssBorder bg-nvssBg p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-nvssMuted">Spēle</p>
                <p className="mt-1 text-base font-semibold text-white">
                  {winnerOptions[0]?.name} pret {winnerOptions[1]?.name}
                </p>
              </div>
              <StatusBadge status={status} />
            </div>

            <div className="mt-4 space-y-3">
              {currentScore.map((player) => (
                <div key={player.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-md border border-nvssBorder bg-nvssSurface px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{player.name}</p>
                    <p className="truncate text-xs text-nvssMuted">{player.representation || 'Bez kluba'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-lg font-bold text-white">{player.wins}</p>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-nvssMuted">seti</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${player.confirmed ? 'bg-emerald-500/15 text-emerald-200' : 'bg-slate-500/15 text-slate-300'}`}>
                    {player.confirmed ? 'Apstiprināja' : 'Nav apstiprināts'}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-md border border-nvssBorder bg-nvssSurface p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-nvssMuted">Setu gaita</p>
              {match.setResults.length > 0 ? (
                <ol className="mt-3 space-y-2">
                  {match.setResults.map((set, index) => {
                    const setWinner = winnerOptions.find((player) => player.id === set.winnerId)
                    return (
                      <li key={`${set.winnerId}-${index}`} className="flex items-center justify-between gap-3 rounded border border-nvssBorder bg-nvssBg px-3 py-2 text-sm">
                        <span className="text-nvssMuted">Sets {index + 1}</span>
                        <span className="truncate font-medium text-white">{setWinner?.name || 'Nezināms spēlētājs'}</span>
                        <span className="font-mono text-white">{set.score}</span>
                      </li>
                    )
                  })}
                </ol>
              ) : (
                <p className="mt-3 text-sm text-nvssMuted">Seti vēl nav ievadīti.</p>
              )}
            </div>
          </section>

          <section className="rounded-md border border-nvssBorder bg-nvssBg p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-nvssMuted">Lēmuma ievade</p>
            <label className="mt-4 block text-sm font-medium text-nvssMuted">
              Uzvarētājs
              <select
                value={winnerId}
                onChange={(event) => onWinnerChange(event.target.value)}
                className="mt-1 min-h-[44px] w-full rounded border border-nvssBorder bg-nvssSurface px-3 text-white"
              >
                {winnerOptions.map((player) => (
                  <option key={player.id} value={player.id}>{player.name}</option>
                ))}
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium text-nvssMuted">
              Zaudētāja seti
              <input
                type="number"
                min="0"
                max={Math.max(0, match.targetWins - 1)}
                value={loserSets}
                onChange={(event) => onLoserSetsChange(Number(event.target.value))}
                className="mt-1 min-h-[44px] w-full rounded border border-nvssBorder bg-nvssSurface px-3 text-white"
              />
            </label>
            <label className="mt-4 block text-sm font-medium text-nvssMuted">
              Labojuma iemesls
              <select
                value={reason}
                onChange={(event) => onReasonChange(event.target.value)}
                className="mt-1 min-h-[44px] w-full rounded border border-nvssBorder bg-nvssSurface px-3 text-white"
              >
                <option value="referee_decision">Tiesneša lēmums</option>
                <option value="score_entry_error">Nepareizi ievadīts sets</option>
                <option value="accidental_tap">Nejaušs pieskāriens</option>
                <option value="duplicate_entry">Dubulta ievade</option>
                <option value="manual_finish">Organizators pabeidz spēli</option>
                <option value="other">Cits iemesls</option>
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium text-nvssMuted">
              Piezīme
              <textarea
                value={note}
                onChange={(event) => onNoteChange(event.target.value)}
                rows={3}
                className="mt-1 w-full rounded border border-nvssBorder bg-nvssSurface px-3 py-2 text-white"
                placeholder="Piem., spēlētāji vienojās par nepareizi ievadītu 5. setu"
              />
            </label>

            <div className="mt-4 rounded-md border border-dashed border-nvssGreen/60 bg-nvssSurface p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-nvssGreen">Pirms / pēc</p>
              <div className="mt-3 space-y-3 text-sm">
                <div className="rounded border border-nvssBorder bg-nvssBg px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-nvssMuted">Tagad</p>
                  <p className="mt-1 text-white">
                    {currentWinner
                      ? `${currentWinner.name} vada ar ${currentScore.find((player) => player.id === currentWinner.id)?.wins}:${currentScore.find((player) => player.id !== currentWinner.id)?.wins}`
                      : 'Uzvarētājs vēl nav noteikts'}
                  </p>
                  {match.overrideMeta?.reason ? (
                    <p className="mt-1 text-xs text-nvssMuted">Iepriekšējais organizatora iemesls: {match.overrideMeta.note || match.overrideMeta.reason}</p>
                  ) : null}
                </div>
                <div className="rounded border border-nvssBorder bg-nvssBg px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-nvssMuted">Pēc saglabāšanas</p>
                  <p className="mt-1 text-white">
                    {selectedWinner && selectedLoser
                      ? `${selectedWinner.name} uzvarēs ar ${nextWinnerSets}:${nextLoserSets}`
                      : 'Izvēlies uzvarētāju'}
                  </p>
                  <p className="mt-1 text-xs text-nvssMuted">Strīda statuss tiks noņemts un spēle tiks atzīmēta kā apstiprināta.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="min-h-[44px] rounded border border-nvssBorder px-4 font-semibold text-nvssMuted hover:text-white">
            Atcelt
          </button>
          <button type="button" onClick={onSubmit} className="min-h-[44px] rounded bg-nvssGreenAction px-4 font-semibold text-white">
            Saglabāt rezultātu
          </button>
        </div>
      </div>
    </div>
  )
}

function getOverrideTitle(status) {
  if (status === 'disputed') return 'Atrisināt strīdu'
  if (status === 'investigating') return 'Ievadīt tiesneša lēmumu'
  if (status === 'in_progress') return 'Pabeigt rezultātu manuāli'
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
