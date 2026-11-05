import React from 'react'
import { Minus, Plus, Star } from 'lucide-react'
import { triggerHaptic } from '../../utils/haptics'


export function ScoreStepper({
  disabled,
  targetReached,
  playerAName,
  playerBName,
  playerAScore,
  playerBScore,
  playerAPerfectPlays = 0,
  playerBPerfectPlays = 0,
  onPlayerAAdd,
  onPlayerBAdd,
  onPlayerARemove,
  onPlayerBRemove,
  onPlayerAPerfectPlayAdd,
  onPlayerBPerfectPlayAdd,
  onPlayerAPerfectPlayRemove,
  onPlayerBPerfectPlayRemove,
}) {
  return (
    <div className="mt-5 space-y-3">
      <ScoreRow
        name={playerAName}
        label="Spēlētājs A"
        score={playerAScore}
        perfectPlays={playerAPerfectPlays}
        disabled={disabled}
        addDisabled={targetReached}
        onAdd={onPlayerAAdd}
        onRemove={onPlayerARemove}
        onPerfectPlayAdd={onPlayerAPerfectPlayAdd}
        onPerfectPlayRemove={onPlayerAPerfectPlayRemove}
      />
      <ScoreRow
        name={playerBName}
        label="Spēlētājs B"
        score={playerBScore}
        perfectPlays={playerBPerfectPlays}
        disabled={disabled}
        addDisabled={targetReached}
        onAdd={onPlayerBAdd}
        onRemove={onPlayerBRemove}
        onPerfectPlayAdd={onPlayerBPerfectPlayAdd}
        onPerfectPlayRemove={onPlayerBPerfectPlayRemove}
      />
    </div>
  )
}

function ScoreRow({
  name,
  label,
  score,
  perfectPlays = 0,
  disabled,
  addDisabled,
  onAdd,
  onRemove,
  onPerfectPlayAdd,
  onPerfectPlayRemove,
}) {
  const isRemoveDisabled = disabled || score <= 0
  const isAddDisabled = disabled || addDisabled

  function handleRemove() {
    triggerHaptic('selection')
    onRemove?.()
  }

  function handleAdd() {
    triggerHaptic('selection')
    onAdd?.()
  }

  function handlePerfectPlayRemove() {
    triggerHaptic('selection')
    onPerfectPlayRemove?.()
  }

  function handlePerfectPlayAdd() {
    triggerHaptic('selection')
    onPerfectPlayAdd?.()
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-[#F2F2F7]/60 p-3.5 transition-all">
      <div className="flex items-center justify-between gap-3">
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
            onClick={handleRemove}
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
            onClick={handleAdd}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-apple-blue text-white shadow-apple-sm transition-all hover:bg-apple-blueHover active:scale-95 disabled:bg-transparent disabled:text-apple-tertiary disabled:shadow-none disabled:cursor-not-allowed"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Perfect Play Statistical Stepper */}
      {onPerfectPlayAdd && (
        <div className="mt-3 flex items-center justify-between border-t border-black/[0.04] pt-2.5">
          <div className="flex items-center gap-1.5">
            <span className="flex size-5 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
              <Star size={11} className="fill-amber-500 text-amber-500" />
            </span>
            <span className="text-xs font-semibold text-[#636366]">Ideālais gājiens:</span>
            {perfectPlays > 0 && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-700 tabular-nums">
                ★ x{perfectPlays}
              </span>
            )}
          </div>

          <div className="flex items-center rounded-xl border border-black/[0.04] bg-white p-0.5 shadow-apple-sm">
            <button
              type="button"
              aria-label={`Noņemt ideālo gājienu: ${name}`}
              disabled={disabled || perfectPlays <= 0}
              onClick={handlePerfectPlayRemove}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[#636366] transition hover:bg-black/[0.05] active:scale-95 disabled:text-apple-tertiary disabled:cursor-not-allowed"
            >
              <Minus size={14} strokeWidth={2.5} />
            </button>
            <span className="w-8 text-center font-mono text-sm font-bold tabular-nums text-[#1C1C1E]">
              {perfectPlays}
            </span>
            <button
              type="button"
              aria-label={`Pievienot ideālo gājienu: ${name}`}
              disabled={isAddDisabled}
              onClick={handlePerfectPlayAdd}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-amber-600 transition hover:bg-amber-500/10 active:scale-95 disabled:text-apple-tertiary disabled:cursor-not-allowed"
            >
              <Plus size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
