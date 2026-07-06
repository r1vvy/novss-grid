import React, { useMemo, useState } from 'react'
import { Activity, AlertTriangle, CheckCircle2, Clock, Trophy, Users } from 'lucide-react'
import { AlertRail } from './AlertRail'
import { TableGrid } from './TableGrid'
import { RoundProgress } from './RoundProgress'
import { TournamentHeader } from './TournamentHeader'
import {
  calculateStandings,
  canGenerateNextRound,
  deriveMatchStatus,
  generateNextSwissRound,
  getCurrentRoundMatches,
} from '../../utils/tournament'

export function OrganizerDashboard({ tournament, onSetupSubmit, onClearAlert, onGenerateRound }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [sortBy, setSortBy] = useState('table')
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

  return (
    <main className="mx-auto grid max-w-[1800px] gap-4 px-3 py-4 lg:grid-cols-[1fr_320px]">
      <section className="min-w-0 space-y-4">
        <TournamentHeader tournament={tournament} matches={currentMatches} alerts={alerts} onOpenSettings={() => setIsSettingsOpen(true)} />

        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
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
          <TableGrid
            tournament={tournament}
            matches={sortedMatches}
            onClearAlert={onClearAlert}
            headerContent={(
              <RoundProgress
                tournament={tournament}
                canGenerate={canGenerate}
                onGenerate={() => onGenerateRound(generateNextSwissRound(tournament))}
                embedded
              />
            )}
          />
        </div>
      </section>

      <aside className="space-y-4">
        <AlertRail tournament={tournament} alerts={alerts} onClearAlert={onClearAlert} />
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
                <span className="truncate text-xs text-nvssMuted">{player.club}</span>
                <span className="text-xs text-nvssMuted">Buholcs {player.buchholz}</span>
              </div>
            ))}
          </div>
        </section>
      </aside>
      {isSettingsOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-xl rounded-md border border-nvssBorder bg-nvssSurface p-4 shadow-2xl">
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
      in_progress: 1,
      awaiting_confirmation: 2,
      scheduled: 3,
      completed: 4,
      verified: 5,
    }

    const statusDiff = (statusOrder[deriveMatchStatus(a)] ?? 99) - (statusOrder[deriveMatchStatus(b)] ?? 99)
    if (statusDiff !== 0) return statusDiff
  }

  return a.table - b.table
}
