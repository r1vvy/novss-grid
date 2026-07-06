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
  const [setup, setSetup] = useState({
    name: tournament.name,
    maxSetsPerMatch: tournament.maxSetsPerMatch,
    win: tournament.pointAllocation.win,
    draw: tournament.pointAllocation.draw,
    closeWin: tournament.pointAllocation.closeWin,
    loss: tournament.pointAllocation.loss,
  })
  const currentMatches = getCurrentRoundMatches(tournament)
  const standings = useMemo(() => calculateStandings(tournament), [tournament])
  const alerts = currentMatches.filter((match) => deriveMatchStatus(match) === 'disputed')
  const canGenerate = canGenerateNextRound(tournament)

  function updateSetup(field, value) {
    setSetup((current) => ({ ...current, [field]: value }))
  }

  return (
    <main className="mx-auto grid max-w-[1800px] gap-4 px-3 py-4 lg:grid-cols-[1fr_320px]">
      <section className="min-w-0 space-y-4">
        <TournamentHeader tournament={tournament} matches={currentMatches} alerts={alerts} />

        <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              onSetupSubmit(setup)
            }}
            className="rounded-md border border-nvssBorder bg-nvssSurface p-4"
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Trophy size={18} className="text-nvssGreen" />
              Turnīra iestatījumi
            </div>
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
            <button type="submit" className="mt-4 min-h-[48px] w-full rounded bg-nvssSlateAction px-4 font-semibold text-white hover:bg-slate-600">
              Izveidot reģistrācijas turnīru
            </button>
          </form>

          <RoundProgress
            tournament={tournament}
            canGenerate={canGenerate}
            onGenerate={() => onGenerateRound(generateNextSwissRound(tournament))}
          />
        </div>

        <TableGrid tournament={tournament} matches={currentMatches} onClearAlert={onClearAlert} />
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
