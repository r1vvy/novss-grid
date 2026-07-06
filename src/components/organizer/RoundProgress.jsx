import React from 'react'
import { CheckCircle2, Clock } from 'lucide-react'

export function RoundProgress({ tournament, canGenerate, onGenerate }) {
  const percent = tournament.totalRounds > 0 ? Math.min(100, (tournament.currentRound / tournament.totalRounds) * 100) : 0

  return (
    <section className="rounded-md border border-nvssBorder bg-nvssSurface p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Clock size={18} className="text-nvssGreen" />
            Swiss Round Lifecycle
          </div>
          <p className="mt-2 text-sm text-nvssMuted">Next round generation unlocks when every current-round match is verified.</p>
        </div>
        <button
          type="button"
          disabled={!canGenerate}
          onClick={onGenerate}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded bg-nvssGreenAction px-4 font-semibold text-white disabled:cursor-not-allowed disabled:bg-nvssSlateAction disabled:text-nvssMuted"
        >
          <CheckCircle2 size={18} />
          Generate Next Round
        </button>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded bg-nvssBg">
        <div className="h-full bg-nvssGreen" style={{ width: `${percent}%` }} />
      </div>
    </section>
  )
}
