import React, { useMemo, useState } from 'react'
import { BadgeCheck, LogOut, MapPin, User } from 'lucide-react'
import { PlayerMatchCard } from './PlayerMatchCard'
import { getCurrentRoundMatches } from '../../utils/tournament'

export function PlayerView({
  tournament,
  player,
  onCheckIn,
  onScoreAdd,
  onScoreRemove,
  onConfirm,
  onCallReferee,
  onCancelReferee,
  onSignOut,
}) {
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
      <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center px-4 py-8">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const ok = onCheckIn(code)
            setError(ok ? '' : 'Reģistrācijas kods netika atrasts. Lūdzu pārbaudiet kodu.')
          }}
          className="w-full rounded-3xl border border-black/[0.08] bg-white p-7 shadow-apple-modal"
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-apple-blue text-white shadow-sm">
              <User size={26} strokeWidth={2.2} />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-apple-blue">Dalībnieks</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#1C1C1E]">Spēlētāja reģistrācija</h2>
              <p className="text-xs text-[#8E8E93]">Ievadiet savu 6 rakstzīmju kodu</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <input
                value={code}
                maxLength={6}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                className="h-16 w-full rounded-2xl border border-black/[0.1] bg-[#F2F2F7] px-4 text-center font-mono text-3xl font-bold uppercase tracking-[0.25em] text-[#1C1C1E] transition-all placeholder:font-sans placeholder:text-base placeholder:tracking-normal placeholder:text-apple-secondary focus:border-apple-blue focus:bg-white focus:ring-4 focus:ring-apple-blue/20"
                placeholder="PIEM. ANNA42"
                aria-label="Reģistrācijas kods"
                autoFocus
              />
            </div>

            {error && (
              <div className="rounded-xl border border-apple-red/20 bg-apple-red/10 px-3.5 py-2.5 text-center text-xs font-semibold text-apple-red">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-apple-blue px-4 text-[16px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-apple-blueHover active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-apple-blue/30"
            >
              <BadgeCheck size={20} strokeWidth={2.2} />
              Pieslēgties turnīram
            </button>
          </div>
        </form>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-80px)] max-w-lg px-4 py-6">
      {/* iOS style Top Bar Card */}
      <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-white p-3.5 shadow-sm">
        <button
          type="button"
          onClick={onSignOut}
          className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-black/[0.08] bg-black/[0.03] px-3.5 text-xs font-medium text-[#1C1C1E] transition hover:bg-black/[0.06] active:bg-black/[0.1]"
        >
          <LogOut size={14} className="text-apple-secondary" />
          Iziet
        </button>

        <div className="flex items-center gap-3 min-w-0 text-right">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#1C1C1E]">{player.name}</p>
            <p className="truncate text-[11px] text-[#8E8E93]">
              {[player.representation, player.rating ? `Reitings ${player.rating}` : null, formatGender(player.gender)].filter(Boolean).join(' · ')}
            </p>
          </div>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-apple-blue/10 text-xs font-bold text-apple-blue">
            {player.name.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Tournament location pill */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-black/[0.06] bg-white/70 px-4 py-2.5 text-xs text-[#636366] backdrop-blur shadow-sm">
        <div className="flex items-center gap-2 truncate">
          <MapPin size={15} className="shrink-0 text-apple-blue" />
          <span className="truncate font-medium">{tournament.name}</span>
        </div>
        <span className="shrink-0 rounded-full bg-black/[0.05] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#1C1C1E]">
          Kārta {tournament.currentRound} no {tournament.totalRounds}
        </span>
      </div>

      {currentMatch ? (
        <PlayerMatchCard
          tournament={tournament}
          match={currentMatch}
          player={player}
          onScoreAdd={onScoreAdd}
          onScoreRemove={onScoreRemove}
          onConfirm={onConfirm}
          onCallReferee={onCallReferee}
          onCancelReferee={onCancelReferee}
        />
      ) : (
        <section className="rounded-2xl border border-black/[0.06] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-black/[0.04] text-apple-secondary">
            <User size={28} />
          </div>
          <h3 className="mt-4 text-xl font-bold tracking-tight text-[#1C1C1E]">Nav aktīva galda</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[#8E8E93]">
            Jūsu reģistrācija ir aktīva, taču šajā kārtā jums nav nozīmēta spēle (brīvā kārta) vai arī kārta vēl nav palaista.
          </p>
        </section>
      )}
    </main>
  )
}

function formatGender(gender) {
  if (gender === 'female') return 'Sieviete'
  if (gender === 'male') return 'Vīrietis'
  return null
}
