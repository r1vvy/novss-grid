import React from 'react'
import { CheckCircle2, Clock } from 'lucide-react'

export function RoundProgress({ tournament, canGenerate, onGenerate, embedded = false }) {
  const percent = tournament.totalRounds > 0 ? Math.min(100, (tournament.currentRound / tournament.totalRounds) * 100) : 0

  return (
    <section className={embedded ? 'px-5 py-4' : 'rounded-2xl border border-black/[0.08] bg-white p-5 shadow-apple-card'}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 text-xs text-[#636366]">
          <div className="flex size-7 items-center justify-center rounded-lg bg-apple-blue/10 text-apple-blue shrink-0">
            <Clock size={15} strokeWidth={2.3} />
          </div>
          <span>
            Nākamo Šveices kārtu var ģenerēt, kad visas aktīvās spēles ir apstiprinātas.
          </span>
        </div>

        <button
          type="button"
          disabled={!canGenerate}
          onClick={onGenerate}
          className="inline-flex min-h-[40px] shrink-0 items-center justify-center gap-2 rounded-xl bg-apple-blue px-4 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-apple-blueHover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-black/[0.06] disabled:text-slate-400 disabled:shadow-none"
        >
          <CheckCircle2 size={16} strokeWidth={2.2} />
          <span>Ģenerēt nākamo kārtu</span>
        </button>
      </div>

      <div className="mt-3.5 flex items-center gap-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-apple-blue to-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-[11px] font-semibold tabular-nums text-slate-500 shrink-0">
          {Math.round(percent)}%
        </span>
      </div>
    </section>
  )
}
