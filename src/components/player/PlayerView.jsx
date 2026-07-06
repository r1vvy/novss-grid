import React, { useMemo, useState } from 'react'
import { BadgeCheck, ChevronLeft, MapPin, User } from 'lucide-react'
import { PlayerMatchCard } from './PlayerMatchCard'
import { getCurrentRoundMatches } from '../../utils/tournament'

export function PlayerView({ tournament, player, onCheckIn, onScoreSet, onConfirm, onCallReferee, onSignOut }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const currentMatch = useMemo(() => {
    if (!player) return null
    return getCurrentRoundMatches(tournament).find(
      (match) => match.playerAId === player.id || match.playerBId === player.id,
    )
  }, [player, tournament])

  if (!player) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-90px)] max-w-md items-center px-4 py-6">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const ok = onCheckIn(code)
            setError(ok ? '' : 'Reģistrācijas kods netika atrasts.')
          }}
          className="w-full rounded-md border border-nvssBorder bg-black p-5"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded bg-nvssGreenAction">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black">Spēlētāja reģistrācija</h2>
              <p className="text-sm text-nvssMuted">Ievadiet savu 6 rakstzīmju kodu.</p>
            </div>
          </div>
          <input
            value={code}
            maxLength={6}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            className="min-h-[60px] w-full rounded border border-white/30 bg-white px-4 text-center text-2xl font-black uppercase tracking-[0.2em] text-black"
            placeholder="ANNA42"
            aria-label="Reģistrācijas kods"
          />
          {error && <p className="mt-3 text-sm font-semibold text-nvssAlert">{error}</p>}
          <button type="submit" className="mt-4 flex min-h-[56px] w-full items-center justify-center gap-2 rounded bg-nvssGreenAction px-4 text-lg font-black text-white">
            <BadgeCheck size={22} />
            Reģistrēties
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-90px)] max-w-md px-4 py-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button type="button" onClick={onSignOut} className="flex min-h-[44px] items-center gap-1 rounded border border-nvssBorder px-3 text-sm text-nvssMuted">
          <ChevronLeft size={18} />
          Mainīt
        </button>
        <div className="min-w-0 text-right">
          <p className="truncate font-semibold">{player.name}</p>
          <p className="truncate text-sm text-nvssMuted">{player.club}</p>
        </div>
      </div>
      <div className="mb-4 rounded-md border border-nvssBorder bg-nvssSurface p-3">
        <div className="flex items-center gap-2 text-sm text-nvssMuted">
          <MapPin size={17} className="text-nvssGreen" />
          {tournament.name} · Kārta {tournament.currentRound}
        </div>
      </div>
      {currentMatch ? (
        <PlayerMatchCard
          tournament={tournament}
          match={currentMatch}
          player={player}
          onScoreSet={onScoreSet}
          onConfirm={onConfirm}
          onCallReferee={onCallReferee}
        />
      ) : (
        <section className="rounded-md border border-nvssBorder bg-black p-5 text-center">
          <p className="text-2xl font-black">Nav aktīva galda piešķīruma</p>
          <p className="mt-2 text-sm text-nvssMuted">Jūsu reģistrācija ir derīga, bet šajā kārtā jums nav piešķirts galds.</p>
        </section>
      )}
    </main>
  )
}
