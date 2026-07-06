import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { getMatchPlayers } from '../../utils/tournament'

export function AlertRail({ tournament, alerts, onClearAlert }) {
  return (
    <section className="rounded-md border border-nvssBorder bg-nvssSurface p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <AlertTriangle size={18} className="text-nvssAlert" />
        Referee Alerts
      </div>
      <div className="space-y-3">
        {alerts.map((match) => {
          const { playerA, playerB } = getMatchPlayers(match, tournament.players)
          return (
            <div key={match.id} className="rounded border border-nvssAlert bg-nvssAlert/10 p-3">
              <p className="font-semibold text-nvssAlert">Table {match.table}</p>
              <p className="mt-1 text-sm">{playerA?.name} vs {playerB?.name}</p>
              <button type="button" onClick={() => onClearAlert(match.id)} className="mt-3 min-h-[40px] w-full rounded bg-nvssAlert px-3 text-sm font-semibold text-white">
                Resolve Dispute
              </button>
            </div>
          )
        })}
        {alerts.length === 0 && <p className="text-sm text-nvssMuted">No active referee calls.</p>}
      </div>
    </section>
  )
}
