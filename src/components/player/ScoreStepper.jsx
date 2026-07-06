import React from 'react'
import { Plus } from 'lucide-react'

export function ScoreStepper({ disabled, onPlayerWon, onOpponentWon }) {
  return (
    <div className="mt-5 grid gap-3">
      <button
        type="button"
        disabled={disabled}
        onClick={onPlayerWon}
        className="flex min-h-[64px] items-center justify-center gap-2 rounded bg-nvssGreenAction px-4 text-xl font-black text-white disabled:cursor-not-allowed disabled:bg-nvssSlateAction disabled:text-nvssMuted"
      >
        <Plus size={24} />
        I won the set
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onOpponentWon}
        className="min-h-[58px] rounded bg-nvssSlateAction px-4 text-lg font-black text-white disabled:cursor-not-allowed disabled:text-nvssMuted"
      >
        Opponent won
      </button>
    </div>
  )
}
