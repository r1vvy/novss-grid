import React from 'react'
import { CheckCircle2, Clock } from 'lucide-react'

export function RoundProgress({ tournament, canGenerate, onGenerate, embedded = false }) {
  const percent = tournament.totalRounds > 0 ? Math.min(100, (tournament.currentRound / tournament.totalRounds) * 100) : 0

  return (
    <section className={embedded ? 'px-4 py-3' : 'rounded-md border border-nvssBorder bg-nvssSurface p-4'}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm text-nvssMuted">
            <Clock size={18} className="text-nvssGreen" />
            Nākamo kārtu var ģenerēt tikai tad, kad visas pašreizējās kārtas spēles ir apstiprinātas.
          </p>
        </div>
        <button
          type="button"
          disabled={!canGenerate}
          onClick={onGenerate}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded bg-nvssGreenAction px-4 font-semibold text-nvssSurface disabled:cursor-not-allowed disabled:bg-nvssSlateAction disabled:text-nvssMuted"
        >
          <CheckCircle2 size={18} />
          Ģenerēt nākamo kārtu
        </button>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded bg-nvssBg">
        <div className="h-full bg-nvssGreen" style={{ width: `${percent}%` }} />
      </div>
    </section>
  )
}
