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
  }

  function closeOverride() {
    setOverrideMatch(null)
    setOverrideWinnerId('')
    setOverrideLoserSets(0)
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
          onClose={closeOverride}
          onSubmit={() => {
            onForceOverride(overrideMatch.id, overrideWinnerId, overrideLoserSets)
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
  onWinnerChange,
  onLoserSetsChange,
  onClose,
  onSubmit,
}) {
  const winnerOptions = tournament.players.filter((player) => [match.playerAId, match.playerBId].includes(player.id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-md rounded-md border border-nvssBorder bg-nvssSurface p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-nvssGreen">Rezultāta rediģēšana</p>
            <h3 className="mt-1 text-xl font-semibold">Rediģēt rezultātu</h3>
          </div>
          <button type="button" onClick={onClose} className="min-h-[36px] rounded border border-nvssBorder px-3 text-sm text-nvssMuted hover:text-white">
            Aizvērt
          </button>
        </div>
        <p className="mt-3 text-sm text-nvssMuted">Galds {match.table}. Organizators var pielāgot gala rezultātu un uzreiz noņemt strīda stāvokli.</p>
        <label className="mt-4 block text-sm font-medium text-nvssMuted">
          Uzvarētājs
          <select
            value={winnerId}
            onChange={(event) => onWinnerChange(event.target.value)}
            className="mt-1 min-h-[44px] w-full rounded border border-nvssBorder bg-nvssBg px-3 text-white"
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
            className="mt-1 min-h-[44px] w-full rounded border border-nvssBorder bg-nvssBg px-3 text-white"
          />
        </label>
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
