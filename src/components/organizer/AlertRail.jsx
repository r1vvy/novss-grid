import React from 'react'
import { AlertTriangle, Search, CheckCircle2 } from 'lucide-react'
import { getMatchPlayers } from '../../utils/tournament'

export function AlertRail({ tournament, alerts, onMarkInvestigating }) {
  return (
    <section className="rounded-2xl border border-black/[0.08] bg-white p-4 shadow-apple-card">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1C1C1E]">
          <div className="flex size-7 items-center justify-center rounded-lg bg-apple-red/10 text-apple-red">
            <AlertTriangle size={16} strokeWidth={2.3} />
          </div>
          <span>Tiesneša izsaukumi</span>
        </div>
        {alerts.length > 0 ? (
          <span className="rounded-full bg-apple-red px-2 py-0.5 text-[11px] font-bold text-white tabular-nums">
            {alerts.length}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
            <CheckCircle2 size={12} />
            Mierīgs
          </span>
        )}
      </div>

      <div className="space-y-2.5">
        {alerts.map((match) => {
          const { playerA, playerB } = getMatchPlayers(match, tournament.players)
          return (
            <div
              key={match.id}
              className="rounded-xl border border-apple-red/25 bg-apple-red/[0.04] p-3.5 transition-all hover:bg-apple-red/[0.07]"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-apple-red/15 px-2 py-0.5 text-xs font-bold text-apple-red">
                  Galds {match.table}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-apple-red animate-pulse">
                  Nepieciešama palīdzība
                </span>
              </div>
              <p className="mt-2 text-xs font-semibold text-[#1C1C1E]">
                {playerA?.name} <span className="font-normal text-[#8E8E93]">pret</span> {playerB?.name}
              </p>
              <button
                type="button"
                onClick={() => onMarkInvestigating(match.id)}
                className="mt-3 inline-flex min-h-[36px] w-full items-center justify-center gap-1.5 rounded-lg bg-apple-orange px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-[0.98]"
              >
                <Search size={14} strokeWidth={2.2} />
                <span>Marķēt kā izmeklē</span>
              </button>
            </div>
          )
        })}

        {alerts.length === 0 && (
          <div className="rounded-xl border border-black/[0.05] bg-black/[0.02] p-4 text-center">
            <p className="text-xs text-[#8E8E93]">Nav aktīvu tiesneša izsaukumu.</p>
          </div>
        )}
      </div>
    </section>
  )
}
