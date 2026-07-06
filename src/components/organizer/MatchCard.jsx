import React from 'react'
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { deriveMatchStatus, getMatchPlayers, getSetScore } from '../../utils/tournament'

const statusLabels = {
  scheduled: 'Scheduled',
  in_progress: 'In progress',
  disputed: 'Disputed',
  completed: 'Completed',
  awaiting_confirmation: 'Awaiting confirmation',
  verified: 'Verified',
}

export function MatchCard({ tournament, match, onClearAlert }) {
  const { playerA, playerB } = getMatchPlayers(match, tournament.players)
  const status = deriveMatchStatus(match)
  const scoreA = getSetScore(match, match.playerAId)
  const scoreB = getSetScore(match, match.playerBId)
  const isDisputed = status === 'disputed'
  const cardState = isDisputed
    ? 'border-nvssAlert ring-2 ring-nvssAlert/50'
    : status === 'in_progress'
      ? 'border-nvssGreen'
      : 'border-nvssBorder'

  return (
    <article className={`rounded-md border bg-nvssSurface p-3 ${cardState}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-nvssMuted">Table</p>
          <div className="text-3xl font-black leading-none">{match.table}</div>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        <PlayerLine name={playerA?.name || 'TBD'} club={playerA?.club} score={scoreA} />
        <PlayerLine name={playerB?.name || 'TBD'} club={playerB?.club} score={scoreB} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-nvssBorder pt-3 text-xs text-nvssMuted">
        <span className="truncate">Sets: {match.setResults.slice(-4).map((set) => set.score).join(' · ') || 'No sets logged'}</span>
        {isDisputed && (
          <button type="button" onClick={() => onClearAlert(match.id)} className="shrink-0 rounded border border-nvssAlert px-2 py-1 font-semibold text-nvssAlert hover:bg-nvssAlert hover:text-white">
            Clear alert
          </button>
        )}
      </div>
    </article>
  )
}

function PlayerLine({ name, club, score }) {
  return (
    <>
      <div className="min-w-0">
        <p className="truncate font-semibold">{name}</p>
        <p className="truncate text-xs text-nvssMuted">{club || 'Awaiting player'}</p>
      </div>
      <div className="text-2xl font-black">{score}</div>
    </>
  )
}

function StatusBadge({ status }) {
  const classes = {
    scheduled: 'text-nvssMuted border-nvssBorder',
    in_progress: 'text-nvssGreen border-nvssGreen',
    disputed: 'text-nvssAlert border-nvssAlert',
    completed: 'text-slate-300 border-nvssBorder',
    awaiting_confirmation: 'text-nvssBlue border-nvssBlue',
    verified: 'text-nvssGreen border-nvssBorder',
  }
  const Icon = status === 'disputed' ? AlertTriangle : status === 'verified' ? CheckCircle2 : Clock
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs font-semibold ${classes[status]}`}>
      <Icon size={14} className={status === 'in_progress' ? 'animate-pulse' : ''} />
      {statusLabels[status]}
    </span>
  )
}
