import React, { useState } from 'react'
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Play,
  ShieldAlert,
  Star,
  XCircle,
} from 'lucide-react'
import { RefereeButton } from './RefereeButton'
import { ScoreStepper } from './ScoreStepper'
import { CalmDisputeBanner } from './CalmDisputeBanner'
import { PlayerActionBar } from './PlayerActionBar'
import { GlassCard } from '../ui/GlassCard'
import { SwissExplanationPill } from '../common/SwissExplanationPill'
import { triggerHaptic } from '../../utils/haptics'
import {
  deriveMatchStatus,
  getMatchPerfectPlays,
  getMatchPlayers,
  getMatchWarnings,
  getOpponentId,
  getSetScore,
} from '../../utils/tournament'

export function PlayerMatchCard({
  tournament,
  match,
  player,
  onScoreAdd,
  onScoreRemove,
  onPerfectPlayAdd,
  onPerfectPlayRemove,
  onConfirm,
  onContestScore,
  onConfirmArrival,
  onReadyToPlay,
  onCallReferee,
  onCancelReferee,
}) {
  const [contestReason, setContestReason] = useState('')
  const [showContestInput, setShowContestInput] = useState(false)

  const opponentId = getOpponentId(match, player.id)
  const { playerA, playerB } = getMatchPlayers(match, tournament.players)
  const opponent = opponentId === match.playerAId ? playerA : playerB

  const playerScore = getSetScore(match, player.id)
  const opponentScore = getSetScore(match, opponentId)
  const playerAScore = getSetScore(match, match.playerAId)
  const playerBScore = getSetScore(match, match.playerBId)

  const playerAPerfectPlays = getMatchPerfectPlays(match, match.playerAId)
  const playerBPerfectPlays = getMatchPerfectPlays(match, match.playerBId)
  const playerTotalPerfect = getMatchPerfectPlays(match, player.id)
  const opponentTotalPerfect = getMatchPerfectPlays(match, opponentId)

  const status = deriveMatchStatus(match, tournament.maxSetsPerMatch)
  const isScoreKeeper = player.id === match.playerAId
  const scoreLocked = status === 'disputed'
  const targetReached = Boolean(status === 'awaiting_confirmation' || status === 'completed')
  const playerConfirmed = Boolean(match.confirmations?.[player.id])
  const playerRequestedReferee = match.refereeRequestedBy === player.id

  const playerArrived = Boolean(match.arrivals?.[player.id])
  const opponentArrived = Boolean(match.arrivals?.[opponentId])
  const playerReady = Boolean(match.ready?.[player.id])
  const myWarnings = getMatchWarnings(match, player.id)

  return (
    <GlassCard as="section" elevation="elevated" className="p-5 sm:p-6">
      {/* Table & Status Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex size-14 flex-col items-center justify-center rounded-2xl bg-apple-blue/10 text-apple-blue shadow-inner">
            <span className="text-[9px] font-bold uppercase tracking-wider">Galds</span>
            <span className="text-2xl font-black leading-none tabular-nums">{match.table}</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-apple-secondary">Mačs</span>
            <h3 className="text-base font-bold text-[#1C1C1E]">
              {tournament.maxSetsPerMatch} setu mačs
            </h3>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* Algorithmic Swiss Pairing Transparency Pill */}
      <SwissExplanationPill match={match} tournament={tournament} className="mt-3.5" />

      {/* Contextual Intent Primary Action Bar (for completed / in-progress states) */}
      {(status === 'completed' || (status === 'in_progress' && !isScoreKeeper)) && (
        <PlayerActionBar
          tournament={tournament}
          match={match}
          player={player}
          onConfirmArrival={onConfirmArrival}
          onReadyToPlay={onReadyToPlay}
          onConfirm={onConfirm}
          onCancelReferee={onCancelReferee}
          className="mt-3.5"
        />
      )}

      {/* Player Warning Alert Banner */}
      {myWarnings.length > 0 && (
        <div className="mt-4 rounded-2xl border border-apple-orange/35 bg-apple-orange/10 p-4 text-apple-orange shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-apple-orange">
            <AlertTriangle size={16} strokeWidth={2.4} />
            <span>Tiesneša brīdinājums ({myWarnings.length})</span>
          </div>
          <div className="mt-2 space-y-1.5">
            {myWarnings.map((w) => (
              <div key={w.id} className="rounded-xl border border-apple-orange/20 bg-white/80 p-2.5 text-xs text-[#1C1C1E]">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-apple-orange">{w.reason}</span>
                  <span className="font-mono text-[10px] text-[#8E8E93]">{w.timestamp}</span>
                </div>
                {w.note ? <p className="mt-1 text-[11px] text-[#636366]">{w.note}</p> : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Arrival & Ready Banner for Scheduled Matches */}
      {status === 'scheduled' && (
        <div className="mt-4 rounded-2xl border border-black/[0.06] bg-[#F2F2F7]/70 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#1C1C1E] uppercase tracking-wide">
              Ierašanās pie galda
            </span>
            <span className="text-[11px] text-[#8E8E93]">
              {playerArrived && opponentArrived ? 'Abi spēlētāji ieradušies' : 'Gaida spēlētājus'}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className={`rounded-xl border p-2.5 ${playerArrived ? 'border-apple-green/30 bg-apple-green/10 text-apple-green' : 'border-black/[0.08] bg-white text-[#636366]'}`}>
              <p className="font-semibold">{player.name} (Tu)</p>
              <p className="text-[11px] font-medium">{playerArrived ? 'Ieradies pie galda ✓' : 'Nav reģistrēts'}</p>
            </div>
            <div className={`rounded-xl border p-2.5 ${opponentArrived ? 'border-apple-green/30 bg-apple-green/10 text-apple-green' : 'border-black/[0.08] bg-white text-[#636366]'}`}>
              <p className="font-semibold">{opponent?.name || 'Pretinieks'}</p>
              <p className="text-[11px] font-medium">{opponentArrived ? 'Ieradies pie galda ✓' : 'Nav ieradies'}</p>
            </div>
          </div>

          <div className="mt-3.5 flex flex-col sm:flex-row gap-2">
            {!playerArrived && onConfirmArrival && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('medium')
                  onConfirmArrival(match.id, player.id)
                }}
                className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-apple-blue px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-apple-blueHover active:scale-[0.98]"
              >
                <MapPin size={16} />
                <span>Ierasties pie galda</span>
              </button>
            )}

            {playerArrived && !playerReady && onReadyToPlay && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('success')
                  onReadyToPlay(match.id, player.id)
                }}
                className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-apple-green px-4 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98]"
              >
                <Play size={16} fill="currentColor" />
                <span>Gatavs sākt spēli</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Matchup Scoreboard */}
      <div className="mt-5 rounded-2xl border border-black/[0.06] bg-[#F2F2F7]/50 p-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-block rounded-full bg-apple-blue/10 px-2 py-0.5 text-[10px] font-bold text-apple-blue">
                Tu
              </span>
              {playerTotalPerfect > 0 && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                  <Star size={10} className="fill-amber-500" /> x{playerTotalPerfect}
                </span>
              )}
            </div>
            <p className="mt-1 truncate text-base font-bold text-[#1C1C1E]">{player.name}</p>
            {player.representation && (
              <p className="truncate text-xs text-[#8E8E93]">{player.representation}</p>
            )}
          </div>

          <div className="px-3 text-center">
            <div className="font-mono text-4xl sm:text-5xl font-black tabular-nums tracking-tight text-[#1C1C1E]">
              {playerScore} <span className="text-apple-tertiary">:</span> {opponentScore}
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-apple-secondary">Rezultāts</span>
          </div>

          <div className="min-w-0 text-right">
            <div className="flex items-center justify-end gap-1.5 flex-wrap">
              {opponentTotalPerfect > 0 && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                  <Star size={10} className="fill-amber-500" /> x{opponentTotalPerfect}
                </span>
              )}
              <span className="inline-block rounded-full bg-black/[0.05] px-2 py-0.5 text-[10px] font-bold text-[#8E8E93]">
                Pretinieks
              </span>
            </div>
            <p className="mt-1 truncate text-base font-bold text-[#1C1C1E]">{opponent?.name || 'Pretinieks'}</p>
            {opponent?.representation && (
              <p className="truncate text-xs text-[#8E8E93]">{opponent.representation}</p>
            )}
            {opponent?.rating ? (
              <p className="truncate text-[11px] text-[#8E8E93] tabular-nums">R: {opponent.rating}</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Set-by-Set Completed Logs Chips */}
      {match.setResults.length > 0 && (
        <div className="mt-4 rounded-xl border border-black/[0.05] bg-black/[0.02] p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] mb-2">
            Setu vēsture
          </p>
          <div className="flex flex-wrap gap-2">
            {match.setResults.map((set, idx) => {
              const winner = set.winnerId === player.id ? player : opponent
              const isPlayerWin = set.winnerId === player.id
              const setPerfectA = Number(set.perfectPlays?.[match.playerAId]) || 0
              const setPerfectB = Number(set.perfectPlays?.[match.playerBId]) || 0
              const hasSetPerfect = setPerfectA > 0 || setPerfectB > 0

              return (
                <div
                  key={`set-${idx}`}
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                    isPlayerWin
                      ? 'border-apple-blue/20 bg-apple-blue/10 text-apple-blue'
                      : 'border-black/[0.08] bg-white text-[#1C1C1E]'
                  }`}
                >
                  <span className="text-[10px] font-normal text-[#8E8E93]">#{idx + 1}</span>
                  <span>{winner?.name?.split(' ')?.[0] || 'Uzvarētājs'}</span>
                  {hasSetPerfect && (
                    <span className="inline-flex items-center text-amber-600">
                      <Star size={11} className="fill-amber-500" />
                      {setPerfectA + setPerfectB > 1 ? `x${setPerfectA + setPerfectB}` : ''}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Score Stepper */}
      <ScoreStepper
        disabled={scoreLocked || !isScoreKeeper}
        targetReached={targetReached}
        playerAName={playerA?.name || 'Spēlētājs A'}
        playerBName={playerB?.name || 'Spēlētājs B'}
        playerAScore={playerAScore}
        playerBScore={playerBScore}
        playerAPerfectPlays={playerAPerfectPlays}
        playerBPerfectPlays={playerBPerfectPlays}
        onPlayerAAdd={() => onScoreAdd(match.id, match.playerAId, player.id)}
        onPlayerBAdd={() => onScoreAdd(match.id, match.playerBId, player.id)}
        onPlayerARemove={() => onScoreRemove(match.id, match.playerAId, player.id)}
        onPlayerBRemove={() => onScoreRemove(match.id, match.playerBId, player.id)}
        onPlayerAPerfectPlayAdd={() => onPerfectPlayAdd && onPerfectPlayAdd(match.id, match.playerAId, player.id)}
        onPlayerBPerfectPlayAdd={() => onPerfectPlayAdd && onPerfectPlayAdd(match.id, match.playerBId, player.id)}
        onPlayerAPerfectPlayRemove={() => onPerfectPlayRemove && onPerfectPlayRemove(match.id, match.playerAId, player.id)}
        onPlayerBPerfectPlayRemove={() => onPerfectPlayRemove && onPerfectPlayRemove(match.id, match.playerBId, player.id)}
      />

      {!isScoreKeeper && status === 'in_progress' && (
        <div className="mt-3.5 flex items-center gap-2.5 rounded-2xl border border-black/[0.06] bg-black/[0.03] p-3 text-xs font-medium text-[#636366]">
          <Clock size={16} className="shrink-0 text-apple-secondary" />
          <span>Rezultātu ievada {playerA?.name || 'Spēlētājs A'}. Jūs varat apstiprināt rezultātu vai izsaukt tiesnesi.</span>
        </div>
      )}

      {/* Score Verification & Confirmation Dialog */}
      {status === 'awaiting_confirmation' && (
        <div className="mt-5 rounded-2xl border border-apple-purple/20 bg-apple-purple/[0.04] p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-apple-purple mb-3">
            <BadgeCheck size={18} />
            <span>Rezultātu pārbaude un verifikācija</span>
          </div>

          <div className="rounded-xl border border-black/[0.06] bg-white p-3 space-y-2 mb-4 text-xs">
            <div className="flex justify-between font-bold text-[#1C1C1E]">
              <span>Gala rezultāts:</span>
              <span className="font-mono text-sm">{playerAScore} : {playerBScore}</span>
            </div>
            <div className="border-t border-black/[0.04] pt-2 space-y-1">
              <div className="flex justify-between text-[#636366]">
                <span>{playerA?.name}:</span>
                <span>{playerAScore} seti · ★ {playerAPerfectPlays} ideālie gājieni</span>
              </div>
              <div className="flex justify-between text-[#636366]">
                <span>{playerB?.name}:</span>
                <span>{playerBScore} seti · ★ {playerBPerfectPlays} ideālie gājieni</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              disabled={playerConfirmed}
              onClick={() => {
                triggerHaptic('success')
                onConfirm(match.id, player.id)
              }}
              className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-apple-green px-4 text-[16px] font-semibold text-white shadow-sm transition-all duration-150 hover:opacity-90 active:scale-[0.98] disabled:bg-black/[0.1] disabled:text-apple-tertiary disabled:cursor-not-allowed"
            >
              <BadgeCheck size={20} strokeWidth={2.2} />
              {playerConfirmed ? 'Jūs esat apstiprinājis rezultātu' : 'Apstiprināt gala rezultātu'}
            </button>

            {!playerConfirmed && onContestScore && (
              <div>
                {!showContestInput ? (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection')
                      setShowContestInput(true)
                    }}
                    className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-apple-red/30 bg-apple-red/10 px-4 text-xs font-semibold text-apple-red transition hover:bg-apple-red/20 active:scale-[0.98]"
                  >
                    <XCircle size={16} />
                    <span>Apstrīdēt rezultātu & Izsaukt tiesnesi</span>
                  </button>
                ) : (
                  <div className="rounded-xl border border-apple-red/30 bg-white p-3 space-y-2">
                    <label className="block text-xs font-semibold text-apple-red">
                      Strīda iemesls:
                      <input
                        type="text"
                        value={contestReason}
                        onChange={(e) => setContestReason(e.target.value)}
                        placeholder="Piem. Nepareizs 3. seta uzvarētājs"
                        className="mt-1 w-full rounded-lg border border-black/[0.1] bg-[#F2F2F7] px-3 py-2 text-xs text-[#1C1C1E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-apple-red/20"
                      />
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowContestInput(false)}
                        className="min-h-[44px] flex-1 rounded-lg border border-black/[0.08] bg-black/[0.04] text-xs font-semibold text-[#636366]"
                      >
                        Atcelt
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('warning')
                          onContestScore(match.id, player.id, contestReason)
                          setShowContestInput(false)
                        }}
                        className="min-h-[44px] flex-1 rounded-lg bg-apple-red text-xs font-semibold text-white shadow-sm hover:opacity-90 active:scale-[0.98]"
                      >
                        Iesniegt strīdu
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {playerConfirmed && (
              <p className="mt-2 text-center text-xs text-[#8E8E93]">
                Gaidām pretinieka apstiprinājumu.
              </p>
            )}
          </div>
        </div>
      )}

      {status === 'completed' && (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-apple-green/20 bg-apple-green/10 p-3.5 text-center text-sm font-semibold text-apple-green">
          <CheckCircle2 size={18} className="text-apple-green" />
          <span>Spēle ir pabeigta un rezultāts apstiprināts</span>
        </div>
      )}

      {/* Calm De-escalating Dispute Banner */}
      {status === 'disputed' && (
        <CalmDisputeBanner
          match={match}
          playerId={player.id}
          onCancelDispute={onCancelReferee}
          className="mt-4"
        />
      )}

      <div className="mt-4">
        <RefereeButton
          disabled={status === 'disputed' && !playerRequestedReferee}
          onClick={() => (playerRequestedReferee ? onCancelReferee(match.id, player.id) : onCallReferee(match.id, player.id))}
          label={playerRequestedReferee ? 'Atsaukt tiesneša izsaukumu' : 'Izsaukt tiesnesi'}
          requireConfirm={!playerRequestedReferee}
        />
      </div>
    </GlassCard>
  )
}

function StatusBadge({ status }) {
  const configs = {
    scheduled: { label: 'Ieplānots', icon: Clock, badge: 'border-black/[0.08] bg-black/[0.04] text-[#8E8E93]' },
    in_progress: { label: 'Notiek', icon: Clock, badge: 'border-apple-blue/20 bg-apple-blue/10 text-apple-blue animate-pulse' },
    disputed: { label: 'Strīds', icon: AlertTriangle, badge: 'border-amber-500/30 bg-amber-500/10 text-amber-700' },
    investigating: { label: 'Izmeklē', icon: Clock, badge: 'border-apple-orange/25 bg-apple-orange/10 text-apple-orange' },
    awaiting_confirmation: { label: 'Gaida apstiprinājumu', icon: Clock, badge: 'border-apple-purple/25 bg-apple-purple/10 text-apple-purple' },
    completed: { label: 'Pabeigts', icon: CheckCircle2, badge: 'border-apple-green/20 bg-apple-green/10 text-apple-green' },
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
