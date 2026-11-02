import React from 'react'
import { AlertTriangle, CheckCircle2, Search, ShieldCheck } from 'lucide-react'
import { getMatchPlayers } from '../../utils/tournament'

export function AlertRail({ tournament, alerts, onMarkInvestigating }) {
  const hasAlerts = alerts.length > 0

  return (
    <section className="rounded-2xl border border-black/[0.08] bg-white p-4 shadow-apple-card">
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`flex size-7 items-center justify-center rounded-lg ${hasAlerts ? 'bg-apple-red/10 text-apple-red' : 'bg-apple-green/10 text-apple-green'}`}>
            {hasAlerts ? <AlertTriangle size={15} strokeWidth={2.3} /> : <ShieldCheck size={15} strokeWidth={2.3} />}
          </div>
          <h3 className="text-sm font-bold tracking-tight text-[#1C1C1E]">Tiesneša izsaukumi</h3>
        </div>
        {hasAlerts ? (
          <span className="rounded-full bg-apple-red px-2.5 py-0.5 text-xs font-bold tabular-nums text-white shadow-2xs">
            {alerts.length}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-apple-green/20 bg-apple-green/10 px-2.5 py-0.5 text-[11px] font-semibold text-apple-green">
            <CheckCircle2 size={12} strokeWidth={2.3} />
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
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-lg border border-apple-red/20 bg-apple-red/15 px-2.5 py-0.5 font-mono text-xs font-bold text-apple-red">
                  Galds {match.table}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-apple-red">
                  <span className="size-1.5 rounded-full bg-apple-red animate-pulse" />
                  Nepieciešama palīdzība
                </span>
              </div>

              <div className="mt-2.5">
                <p className="text-xs font-bold text-[#1C1C1E]">
                  {playerA?.name || 'TBD'} <span className="font-normal text-[#8E8E93]">pret</span> {playerB?.name || 'TBD'}
                </p>
                {playerA?.representation || playerB?.representation ? (
                  <p className="mt-0.5 text-[10px] text-[#8E8E93] truncate">
                    {[playerA?.representation, playerB?.representation].filter(Boolean).join(' · ')}
                  </p>
                ) : null}
              </div>

              {match.contestMeta?.reason && (
                <div className="mt-2 rounded-lg border border-apple-red/20 bg-white/80 p-2 text-[11px] text-[#1C1C1E] shadow-2xs">
                  <span className="font-semibold text-apple-red">Strīda iemesls: </span>
                  <span className="font-medium text-[#1C1C1E]">{match.contestMeta.reason}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => onMarkInvestigating(match.id)}
                className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl bg-apple-orange px-3 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98]"
              >
                <Search size={14} strokeWidth={2.3} />
                <span>Marķēt kā izmeklē</span>
              </button>
            </div>
          )
        })}

        {!hasAlerts && (
          <div className="rounded-xl border border-dashed border-black/[0.08] bg-[#F2F2F7]/50 p-5 text-center">
            <div className="mx-auto flex size-9 items-center justify-center rounded-full bg-apple-green/10 text-apple-green mb-2">
              <CheckCircle2 size={18} strokeWidth={2.3} />
            </div>
            <p className="text-xs font-semibold text-[#1C1C1E]">Visi galdi mierīgi</p>
            <p className="mt-0.5 text-[11px] text-[#8E8E93]">Nav aktīvu tiesneša izsaukumu vai strīdu.</p>
          </div>
        )}
      </div>
    </section>
  )
}
