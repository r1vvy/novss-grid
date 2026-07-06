import React from 'react'
import { BadgeCheck } from 'lucide-react'
import { RefereeButton } from './RefereeButton'
import { ScoreStepper } from './ScoreStepper'
import { deriveMatchStatus, getMatchPlayers, getOpponentId, getSetScore } from '../../utils/tournament'

export function PlayerMatchCard({ tournament, match, player, onScoreSet, onConfirm, onCallReferee }) {
  const opponentId = getOpponentId(match, player.id)
  const { playerA, playerB } = getMatchPlayers(match, tournament.players)
  const opponent = opponentId === match.playerAId ? playerA : playerB
  const playerScore = getSetScore(match, player.id)
  const opponentScore = getSetScore(match, opponentId)
  const status = deriveMatchStatus(match)
  const locked = ['disputed', 'awaiting_confirmation', 'verified'].includes(status)
  const playerConfirmed = Boolean(match.confirmations?.[player.id])

  return (
    <section className="rounded-md border border-white/15 bg-black p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase text-nvssMuted">Galds</p>
          <p className="text-6xl font-black leading-none text-white">{match.table}</p>
        </div>
        <div className="rounded border border-white/20 px-3 py-2 text-right">
          <p className="text-xs text-nvssMuted">Statuss</p>
          <p className="font-bold text-white">{translateStatus(status)}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <PlayerName name={player.name} label="Tu" />
        <div className="text-center text-5xl font-black text-white">{playerScore} : {opponentScore}</div>
        <PlayerName name={opponent?.name || 'Pretinieks'} label="Pretinieks" alignRight />
      </div>

      <div className="mt-5 rounded border border-white/15 p-3">
        <p className="mb-2 text-sm font-semibold text-nvssMuted">Setu vēsture</p>
        <div className="flex flex-wrap gap-2">
          {match.setResults.map((set, index) => (
            <span key={`${set.winnerId}-${index}`} className={`rounded px-2 py-1 text-sm font-semibold ${set.winnerId === player.id ? 'bg-nvssGreenAction text-white' : 'bg-nvssSlateAction text-white'}`}>
              {index + 1}: {set.winnerId === player.id ? 'Tu' : 'Pret.'} {set.score}
            </span>
          ))}
          {match.setResults.length === 0 && <span className="text-sm text-nvssMuted">Seti vēl nav ievadīti.</span>}
        </div>
      </div>

      <ScoreStepper
        disabled={locked}
        onPlayerWon={() => onScoreSet(match.id, player.id)}
        onOpponentWon={() => onScoreSet(match.id, opponentId)}
      />

      {status === 'awaiting_confirmation' && (
        <button
          type="button"
          disabled={playerConfirmed}
          onClick={() => onConfirm(match.id, player.id)}
          className="mt-3 flex min-h-[56px] w-full items-center justify-center gap-2 rounded bg-nvssBlue px-4 text-lg font-black text-white disabled:bg-nvssSlateAction disabled:text-nvssMuted"
        >
          <BadgeCheck size={22} />
          {playerConfirmed ? 'Gaida pretinieka apstiprinājumu' : 'Apstiprināt gala rezultātu'}
        </button>
      )}

      {status === 'verified' && (
        <div className="mt-3 rounded border border-nvssGreen bg-nvssGreen/10 p-3 text-center font-semibold text-nvssGreen">
          Gala rezultāts apstiprināts
        </div>
      )}

      {status === 'disputed' && (
        <div className="mt-3 rounded border border-nvssAlert bg-nvssAlert/10 p-3 text-center font-semibold text-nvssAlert">
          Izsaukts tiesnesis. Rezultāta ievade ir bloķēta.
        </div>
      )}

      <RefereeButton disabled={status === 'disputed' || status === 'verified'} onClick={() => onCallReferee(match.id)} />
    </section>
  )
}

function translateStatus(status) {
  const labels = {
    scheduled: 'Ieplānots',
    in_progress: 'Notiek',
    disputed: 'Strīds',
    completed: 'Pabeigts',
    awaiting_confirmation: 'Gaida apstiprinājumu',
    verified: 'Apstiprināts',
  }

  return labels[status] || status
}

function PlayerName({ name, label, alignRight = false }) {
  return (
    <div className={alignRight ? 'min-w-0 text-right' : 'min-w-0'}>
      <p className="text-xs uppercase text-nvssMuted">{label}</p>
      <p className="truncate text-lg font-black text-white">{name}</p>
    </div>
  )
}
