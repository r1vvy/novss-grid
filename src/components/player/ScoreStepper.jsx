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
    <div className="mt-5 grid gap-3">
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
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded border border-nvssBorder bg-nvssSurface p-3">
      <div className="min-w-0">
        <p className="text-xs uppercase text-nvssMuted">{label}</p>
        <p className="truncate text-base font-black text-nvssText">{name}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Noņemt setu: ${name}`}
          disabled={disabled || score <= 0}
          onClick={onRemove}
          className="flex size-11 items-center justify-center rounded bg-nvssSlateAction text-nvssText disabled:cursor-not-allowed disabled:text-nvssMuted"
        >
          <Minus size={20} />
        </button>
        <span className="min-w-8 text-center text-2xl font-black text-nvssText">{score}</span>
        <button
          type="button"
          aria-label={`Pievienot setu: ${name}`}
          disabled={disabled || addDisabled}
          onClick={onAdd}
          className="flex size-11 items-center justify-center rounded bg-nvssGreenAction text-nvssSurface disabled:cursor-not-allowed disabled:bg-nvssSlateAction disabled:text-nvssMuted"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  )
}
