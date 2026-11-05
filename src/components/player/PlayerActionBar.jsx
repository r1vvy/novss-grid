import React from 'react'
import { BadgeCheck, Clock, MapPin, Play, ShieldAlert, Trophy } from 'lucide-react'
import { triggerHaptic } from '../../utils/haptics'
import { deriveMatchStatus } from '../../utils/tournament'

export function PlayerActionBar({
  tournament,
  match,
  player,
  onConfirmArrival,
  onReadyToPlay,
  onConfirm,
  onCancelReferee,
  className = '',
}) {
  if (!match || !player) return null

  const status = deriveMatchStatus(match, tournament?.maxSetsPerMatch)
  const playerArrived = Boolean(match.arrivals?.[player.id])
  const playerReady = Boolean(match.ready?.[player.id])
  const playerConfirmed = Boolean(match.confirmations?.[player.id])
  const isScoreKeeper = player.id === match.playerAId
  const playerRequestedReferee = match.refereeRequestedBy === player.id

  // 1. Scheduled: Arrival required
  if (status === 'scheduled' && !playerArrived) {
    return (
      <div className={`w-full ${className}`}>
        <button
          type="button"
          onClick={() => {
            triggerHaptic('medium')
            onConfirmArrival?.(match.id, player.id)
          }}
          className="flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-2xl bg-apple-blue px-5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(0,122,255,0.25)] transition-all duration-150 hover:bg-apple-blueHover active:scale-[0.98]"
        >
          <MapPin size={18} strokeWidth={2.4} />
          <span>Ierasties pie galda</span>
        </button>
      </div>
    )
  }

  // 2. Scheduled: Arrived, ready required
  if (status === 'scheduled' && playerArrived && !playerReady) {
    return (
      <div className={`w-full ${className}`}>
        <button
          type="button"
          onClick={() => {
            triggerHaptic('success')
            onReadyToPlay?.(match.id, player.id)
          }}
          className="flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-2xl bg-apple-green px-5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(52,199,89,0.25)] transition-all duration-150 hover:opacity-95 active:scale-[0.98]"
        >
          <Play size={18} fill="currentColor" strokeWidth={2.4} />
          <span>Gatavs sākt spēli</span>
        </button>
      </div>
    )
  }

  // 3. Scheduled: Arrived and ready, waiting for match start
  if (status === 'scheduled' && playerArrived && playerReady) {
    return (
      <div className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-apple-green/30 bg-apple-green/10 px-4 text-xs font-semibold text-apple-green ${className}`}>
        <Clock size={16} strokeWidth={2.3} />
        <span>Jūs esat gatavs · Gaida pretinieka gatavību</span>
      </div>
    )
  }

  // 4. Awaiting confirmation: Player has not confirmed
  if (status === 'awaiting_confirmation' && !playerConfirmed) {
    return (
      <div className={`w-full ${className}`}>
        <button
          type="button"
          onClick={() => {
            triggerHaptic('success')
            onConfirm?.(match.id, player.id)
          }}
          className="flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-2xl bg-apple-green px-5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(52,199,89,0.25)] transition-all duration-150 hover:opacity-95 active:scale-[0.98]"
        >
          <BadgeCheck size={20} strokeWidth={2.4} />
          <span>Apstiprināt gala rezultātu</span>
        </button>
      </div>
    )
  }

  // 5. Awaiting confirmation: Player already confirmed
  if (status === 'awaiting_confirmation' && playerConfirmed) {
    return (
      <div className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-apple-purple/20 bg-apple-purple/10 px-4 text-xs font-semibold text-apple-purple ${className}`}>
        <Clock size={16} strokeWidth={2.3} />
        <span>Jūs apstiprinājāt rezultātu · Gaida pretinieka apstiprinājumu</span>
      </div>
    )
  }

  // 6. Disputed match state
  if (status === 'disputed') {
    return (
      <div className={`flex min-h-[48px] w-full items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-900 ${className}`}>
        <div className="flex items-center gap-2 min-w-0">
          <ShieldAlert size={18} className="text-amber-600 shrink-0" strokeWidth={2.4} />
          <span className="truncate">Tiesnesis izsaukts pie galda</span>
        </div>
        {playerRequestedReferee && onCancelReferee && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection')
              onCancelReferee(match.id, player.id)
            }}
            className="shrink-0 rounded-xl border border-amber-600/30 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-2xs hover:bg-amber-50 active:scale-95 transition"
          >
            Atsaukt
          </button>
        )}
      </div>
    )
  }

  // 7. Completed match
  if (status === 'completed') {
    return (
      <div className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-apple-green/30 bg-apple-green/10 px-4 text-xs font-bold text-apple-green ${className}`}>
        <Trophy size={16} strokeWidth={2.4} />
        <span>Mačs noslēdzies ✓</span>
      </div>
    )
  }

  // 8. In Progress for non-scorekeeper
  if (status === 'in_progress' && !isScoreKeeper) {
    return (
      <div className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-black/[0.06] bg-black/[0.03] px-4 text-xs font-medium text-[#636366] ${className}`}>
        <Clock size={15} className="text-apple-secondary" />
        <span>Gaidu rezultātu · Rezultātu ievada pretinieks</span>
      </div>
    )
  }

  return null
}

