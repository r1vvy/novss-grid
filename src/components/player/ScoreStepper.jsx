import React from 'react'
import { Minus, Plus } from 'lucide-react'

export function ScoreStepper({
  disabled,
  targetReached,
  playerAName,
  playerBName,
  playerAScore,
  playerBScore,
  onPlayerAAdd,
  onPlayerBAdd,
  onPlayerARemove,
  onPlayerBRemove,
}) {
  return (
    <div className="mt-5 space-y-2.5">
      <ScoreRow
        name={playerAName}
        label="Spēlētājs A"
        score={playerAScore}
        disabled={disabled}
        addDisabled={targetReached}
        onAdd={onPlayerAAdd}
        onRemove={onPlayerARemove}
      />
      <ScoreRow
        name={playerBName}
        label="Spēlētājs B"
        score={playerBScore}
        disabled={disabled}
        addDisabled={targetReached}
        onAdd={onPlayerBAdd}
        onRemove={onPlayerBRemove}
      />
    </div>
  )
}

function ScoreRow({ name, label, score, disabled, addDisabled, onAdd, onRemove }) {
  const isRemoveDisabled = disabled || score <= 0
  const isAddDisabled = disabled || addDisabled

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-[#F2F2F7]/60 p-3.5 transition-all">
      <div className="min-w-0 pr-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8E93]">{label}</span>
        <p className="truncate text-[15px] font-bold text-[#1C1C1E]">{name}</p>
      </div>

      {/* Apple HIG Segmented Stepper with min-h-[44px] min-w-[44px] touch envelope */}
      <div className="flex items-center rounded-2xl border border-black/[0.06] bg-black/[0.04] p-1 shadow-inner">
        <button
          type="button"
          aria-label={`Noņemt setu: ${name}`}
          disabled={isRemoveDisabled}
          onClick={onRemove}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-white text-[#1C1C1E] shadow-apple-sm transition-all hover:bg-black/[0.04] active:scale-95 disabled:bg-transparent disabled:text-apple-tertiary disabled:shadow-none disabled:cursor-not-allowed"
        >
          <Minus size={18} strokeWidth={2.5} />
        </button>

        <span className="w-11 text-center font-mono text-xl font-bold tabular-nums text-[#1C1C1E]">
          {score}
        </span>

        <button
          type="button"
          aria-label={`Pievienot setu: ${name}`}
          disabled={isAddDisabled}
          onClick={onAdd}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-apple-blue text-white shadow-apple-sm transition-all hover:bg-apple-blueHover active:scale-95 disabled:bg-transparent disabled:text-apple-tertiary disabled:shadow-none disabled:cursor-not-allowed"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
