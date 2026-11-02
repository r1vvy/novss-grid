import React from 'react'
import { CheckCircle2, Clock, Trophy } from 'lucide-react'
import { isTournamentComplete } from '../../utils/tournament'

export function RoundProgress({ tournament, canGenerate, onGenerate, embedded = false }) {
  const isComplete = isTournamentComplete(tournament)
  const isFinalRound = tournament.totalRounds > 0 && tournament.currentRound >= tournament.totalRounds
  const percent = tournament.totalRounds > 0 ? Math.min(100, (tournament.currentRound / tournament.totalRounds) * 100) : 0

  return (
    <section className={embedded ? 'px-5 py-4' : 'rounded-2xl border border-black/[0.08] bg-white p-5 shadow-apple-card'}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 text-xs text-[#636366]">
          <div className={`flex size-7 items-center justify-center rounded-lg shrink-0 ${isComplete ? 'bg-apple-green/15 text-apple-green' : 'bg-apple-blue/10 text-apple-blue'}`}>
            {isComplete ? <Trophy size={16} strokeWidth={2.3} /> : <Clock size={15} strokeWidth={2.3} />}
          </div>
          <span>
            {isComplete
              ? 'Visi mači ir apstiprināti. Turnīrs ir noslēdzies un kopvērtējums ir oficiāls.'
              : isFinalRound
                ? 'Noslēdzošā kārta. Pēc spēļu pabeigšanas rezultāti kļūs galīgi.'
                : 'Nākamo Šveices kārtu var ģenerēt, kad visas aktīvās spēles ir apstiprinātas.'}
          </span>
        </div>

        <button
          type="button"
          disabled={!canGenerate || isComplete}
          onClick={onGenerate}
          className={`inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold shadow-sm transition-all duration-150 active:scale-[0.98] ${
            isComplete
              ? 'bg-apple-green text-white cursor-default shadow-none'
              : 'bg-apple-blue text-white hover:bg-apple-blueHover disabled:cursor-not-allowed disabled:bg-black/[0.06] disabled:text-apple-tertiary disabled:shadow-none'
          }`}
        >
          {isComplete ? (
            <>
              <Trophy size={16} strokeWidth={2.2} />
              <span>Turnīrs noslēdzies</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={16} strokeWidth={2.2} />
              <span>Ģenerēt nākamo kārtu</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-3.5 flex items-center gap-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${isComplete ? 'bg-apple-green' : 'bg-apple-blue'}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-[11px] font-semibold tabular-nums text-[#8E8E93] shrink-0">
          {Math.round(percent)}%
        </span>
      </div>
    </section>
  )
}
