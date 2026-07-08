import React from 'react'
import { BadgeCheck } from 'lucide-react'
import { RefereeButton } from './RefereeButton'
import { ScoreStepper } from './ScoreStepper'
import { deriveMatchStatus, getMatchPlayers, getOpponentId, getSetScore } from '../../utils/tournament'

export function PlayerMatchCard({ tournament, match, player, onScoreAdd, onScoreRemove, onConfirm, onCallReferee }) {
  const opponentId = getOpponentId(match, player.id)
  const { playerA, playerB } = getMatchPlayers(match, tournament.players)
  const opponent = opponentId === match.playerAId ? playerA : playerB
  const playerScore = getSetScore(match, player.id)
  const opponentScore = getSetScore(match, opponentId)
  const playerAScore = getSetScore(match, match.playerAId)
  const playerBScore = getSetScore(match, match.playerBId)
  const status = deriveMatchStatus(match)
  const isScoreKeeper = player.id === match.playerAId
  const scoreLocked = status === 'disputed'
  const targetReached = Boolean(status === 'awaiting_confirmation' || status === 'completed')
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
        <PlayerName
          name={opponent?.name || 'Pretinieks'}
          label="Pretinieks"
          metadata={formatPlayerMeta(opponent)}
          alignRight
        />
      </div>

      <ScoreStepper
        disabled={scoreLocked || !isScoreKeeper}
        targetReached={targetReached}
        playerAName={playerA?.name || 'Spēlētājs A'}
        playerBName={playerB?.name || 'Spēlētājs B'}
        playerAScore={playerAScore}
        playerBScore={playerBScore}
        onPlayerAAdd={() => onScoreAdd(match.id, match.playerAId, player.id)}
        onPlayerBAdd={() => onScoreAdd(match.id, match.playerBId, player.id)}
        onPlayerARemove={() => onScoreRemove(match.id, match.playerAId, player.id)}
        onPlayerBRemove={() => onScoreRemove(match.id, match.playerBId, player.id)}
      />

      {!isScoreKeeper && (
        <div className="mt-3 rounded border border-nvssBorder bg-nvssSurface p-3 text-center text-sm font-semibold text-nvssMuted">
          Rezultātu ievada {playerA.name}. Tu vari apstiprināt rezultātu vai izsaukt tiesnesi.
        </div>
      )}

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

      {status === 'completed' && (
        <div className="mt-3 rounded border border-nvssGreen bg-nvssGreen/10 p-3 text-center font-semibold text-nvssGreen">
          Mačs pabeigts
        </div>
      )}

      {status === 'disputed' && (
        <div className="mt-3 rounded border border-nvssAlert bg-nvssAlert/10 p-3 text-center font-semibold text-nvssAlert">
          Izsaukts tiesnesis. Rezultāta ievade ir bloķēta.
        </div>
      )}

      <RefereeButton disabled={status === 'disputed'} onClick={() => onCallReferee(match.id)} />
    </section>
  )
}

function translateStatus(status) {
  const labels = {
    scheduled: 'Ieplānots',
    in_progress: 'Notiek',
    disputed: 'Strīds',
    awaiting_confirmation: 'Gaida apstiprinājumu',
    completed: 'Pabeigts',
  }

  return labels[status] || status
}

function PlayerName({ name, label, metadata, alignRight = false }) {
  return (
    <div className={alignRight ? 'min-w-0 text-right' : 'min-w-0'}>
      <p className="text-xs uppercase text-nvssMuted">{label}</p>
      <p className="truncate text-lg font-black text-white">{name}</p>
      {metadata ? <p className="truncate text-sm text-nvssMuted">{metadata}</p> : null}
    </div>
  )
}

function formatPlayerMeta(player) {
  if (!player) return null

  return [
    player.representation || null,
    player.rating ? `Reitings ${player.rating}` : null,
  ].filter(Boolean).join(' · ')
}
