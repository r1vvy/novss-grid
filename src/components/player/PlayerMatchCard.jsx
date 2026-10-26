import React from 'react'
import { BadgeCheck, AlertTriangle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react'
import { RefereeButton } from './RefereeButton'
import { ScoreStepper } from './ScoreStepper'
import { deriveMatchStatus, getMatchPlayers, getOpponentId, getSetScore } from '../../utils/tournament'

export function PlayerMatchCard({ tournament, match, player, onScoreAdd, onScoreRemove, onConfirm, onCallReferee, onCancelReferee }) {
  const opponentId = getOpponentId(match, player.id)
  const { playerA, playerB } = getMatchPlayers(match, tournament.players)
  const opponent = opponentId === match.playerAId ? playerA : playerB
  const playerScore = getSetScore(match, player.id)
  const opponentScore = getSetScore(match, opponentId)
  const playerAScore = getSetScore(match, match.playerAId)
  const playerBScore = getSetScore(match, match.playerBId)
  const status = deriveMatchStatus(match, tournament.maxSetsPerMatch)
  const isScoreKeeper = player.id === match.playerAId
  const scoreLocked = status === 'disputed'
  const targetReached = Boolean(status === 'awaiting_confirmation' || status === 'completed')
  const playerConfirmed = Boolean(match.confirmations?.[player.id])
  const playerRequestedReferee = match.refereeRequestedBy === player.id

  return (
    <section className="rounded-3xl border border-black/[0.08] bg-white p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
      {/* Table & Status Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex size-14 flex-col items-center justify-center rounded-2xl bg-apple-blue/10 text-apple-blue shadow-inner">
            <span className="text-[9px] font-bold uppercase tracking-wider">Galds</span>
            <span className="text-2xl font-black leading-none tabular-nums">{match.table}</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Mačs</span>
            <h3 className="text-base font-bold text-[#1C1C1E]">
              {tournament.maxSetsPerMatch} setu mačs
            </h3>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* Matchup Scoreboard */}
      <div className="mt-5 rounded-2xl border border-black/[0.06] bg-[#F2F2F7]/50 p-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="min-w-0">
            <span className="inline-block rounded-full bg-apple-blue/10 px-2 py-0.5 text-[10px] font-bold text-apple-blue">
              Tu
            </span>
            <p className="mt-1 truncate text-base font-bold text-[#1C1C1E]">{player.name}</p>
            {player.representation && (
              <p className="truncate text-xs text-[#8E8E93]">{player.representation}</p>
            )}
          </div>

          <div className="px-3 text-center">
            <div className="font-mono text-4xl sm:text-5xl font-black tabular-nums tracking-tight text-[#1C1C1E]">
              {playerScore} <span className="text-slate-300">:</span> {opponentScore}
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Rezultāts</span>
          </div>

          <div className="min-w-0 text-right">
            <span className="inline-block rounded-full bg-black/[0.05] px-2 py-0.5 text-[10px] font-bold text-slate-500">
              Pretinieks
            </span>
            <p className="mt-1 truncate text-base font-bold text-[#1C1C1E]">{opponent?.name || 'Pretinieks'}</p>
            {opponent?.representation && (
              <p className="truncate text-xs text-[#8E8E93]">{opponent.representation}</p>
            )}
            {opponent?.rating ? (
              <p className="truncate text-[11px] text-[#8E8E93]">R: {opponent.rating}</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Score Stepper */}
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
        <div className="mt-3.5 flex items-center gap-2.5 rounded-2xl border border-black/[0.06] bg-black/[0.03] p-3 text-xs font-medium text-slate-600">
          <Clock size={16} className="shrink-0 text-slate-400" />
          <span>Rezultātu ievada {playerA?.name || 'Spēlētājs A'}. Jūs varat apstiprināt rezultātu vai izsaukt tiesnesi.</span>
        </div>
      )}

      {status === 'awaiting_confirmation' && (
        <div className="mt-4">
          <button
            type="button"
            disabled={playerConfirmed}
            onClick={() => onConfirm(match.id, player.id)}
            className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-apple-green px-4 text-[16px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-emerald-600 active:scale-[0.98] disabled:bg-black/[0.1] disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            <BadgeCheck size={20} strokeWidth={2.2} />
            {playerConfirmed ? 'Gaida pretinieka apstiprinājumu...' : 'Apstiprināt gala rezultātu'}
          </button>
          {playerConfirmed && (
            <p className="mt-2 text-center text-xs text-[#8E8E93]">
              Jūs esat apstiprinājis rezultātu. Gaidām pretinieka apstiprinājumu.
            </p>
          )}
        </div>
      )}

      {status === 'completed' && (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-center text-sm font-semibold text-emerald-800">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>Spēle ir pabeigta un rezultāts apstiprināts</span>
        </div>
      )}

      {status === 'disputed' && (
        <div className="mt-4 rounded-2xl border border-red-500/25 bg-red-500/10 p-3.5 text-center text-xs font-medium text-apple-red">
          <div className="flex items-center justify-center gap-1.5 font-bold">
            <ShieldAlert size={16} />
            <span>Tiesneša izsaukums aktīvs</span>
          </div>
          <p className="mt-1">
            {playerRequestedReferee
              ? 'Jūs esat izsaucis tiesnesi. Ja jautājums atrisināts, varat atsaukt izsaukumu.'
              : 'Pretinieks ir izsaucis tiesnesi. Rezultātu ievade ir bloķēta līdz tiesneša lēmumam.'}
          </p>
        </div>
      )}

      <RefereeButton
        disabled={status === 'disputed' && !playerRequestedReferee}
        onClick={() => (playerRequestedReferee ? onCancelReferee(match.id, player.id) : onCallReferee(match.id, player.id))}
        label={playerRequestedReferee ? 'Atsaukt tiesneša izsaukumu' : 'Izsaukt tiesnesi'}
        requireConfirm={!playerRequestedReferee}
      />
    </section>
  )
}

function StatusBadge({ status }) {
  const configs = {
    scheduled: { label: 'Ieplānots', icon: Clock, badge: 'border-black/[0.08] bg-black/[0.04] text-slate-600' },
    in_progress: { label: 'Notiek', icon: Clock, badge: 'border-apple-blue/20 bg-apple-blue/10 text-apple-blue animate-pulse' },
    disputed: { label: 'Strīds', icon: AlertTriangle, badge: 'border-apple-red/25 bg-apple-red/10 text-apple-red' },
    investigating: { label: 'Izmeklē', icon: Clock, badge: 'border-apple-orange/25 bg-apple-orange/10 text-apple-orange' },
    awaiting_confirmation: { label: 'Gaida apstiprinājumu', icon: Clock, badge: 'border-apple-purple/25 bg-apple-purple/10 text-apple-purple' },
    completed: { label: 'Pabeigts', icon: CheckCircle2, badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700' },
  }

  const current = configs[status] || configs.scheduled
  const Icon = current.icon

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${current.badge}`}>
      <Icon size={13} strokeWidth={2.2} />
      <span>{current.label}</span>
    </span>
  )
}
