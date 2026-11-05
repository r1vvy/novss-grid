import React, { useState, useEffect } from 'react'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Star,
  Trophy,
  X,
} from 'lucide-react'
import { useKioskRotation } from '../../hooks/useKioskRotation'
import { triggerHaptic } from '../../utils/haptics'
import {
  calculateStandings,
  deriveMatchStatus,
  getCurrentRoundMatches,
  getMatchPerfectPlays,
  getMatchPlayers,
  getSetScore,
} from '../../utils/tournament'

export function KioskView({ tournament, onClose }) {
  const {
    currentSlide,
    currentSlideIndex,
    isPlaying,
    progress,
    secondsRemaining,
    nextSlide,
    prevSlide,
    togglePlay,
    setSlide,
  } = useKioskRotation({ intervalSeconds: 15 })

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    function updateClock() {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('lv-LV', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      )
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  function handleToggleFullscreen() {
    triggerHaptic('light')
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {})
      } else {
        document.exitFullscreen?.().catch(() => {})
      }
    } catch {
      // Ignore fullscreen API restrictions
    }
  }

  const matches = getCurrentRoundMatches(tournament)
  const standings = calculateStandings(tournament)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0B0E14] text-white overflow-hidden select-none">
      {/* ========================================================================= */}
      {/* 10-FOOT TV HEADER & CONTROLS BAR                                          */}
      {/* ========================================================================= */}
      <header className="flex items-center justify-between gap-4 px-6 py-3.5 bg-black/50 border-b border-white/10 backdrop-blur-2xl shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="flex size-3 rounded-full bg-rose-500 ring-4 ring-rose-500/20" />
            <span className="font-mono text-xs font-black tracking-widest text-white/70 uppercase">
              NVSSGRID TV
            </span>
          </div>

          <div className="hidden sm:block h-5 w-px bg-white/15" />

          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">
              {tournament.name}
            </h1>
            <p className="text-[11px] text-white/50 truncate">
              {tournament.venue} · Kārta {tournament.currentRound} no {tournament.totalRounds}
            </p>
          </div>
        </div>

        {/* Carousel Slide Segmented Switch & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/10">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection')
                setSlide('tables')
              }}
              className={`flex min-h-[44px] items-center gap-2 rounded-lg px-4 text-xs font-bold transition ${
                currentSlide === 'tables'
                  ? 'bg-apple-blue text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>Aktīvie galdi ({matches.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection')
                setSlide('standings')
              }}
              className={`flex min-h-[44px] items-center gap-2 rounded-lg px-4 text-xs font-bold transition ${
                currentSlide === 'standings'
                  ? 'bg-apple-blue text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Trophy size={14} />
              <span>Kopvērtējums</span>
            </button>
          </div>

          {/* Play / Pause Toggle */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              togglePlay()
            }}
            aria-label={isPlaying ? 'Pauzēt rotāciju' : 'Atsākt rotāciju'}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-white/10 text-white/80 hover:bg-white/20 hover:text-white active:scale-95 transition"
            title={isPlaying ? 'Pauzēt (Space)' : 'Atsākt (Space)'}
          >
            {isPlaying ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
          </button>

          {/* Prev / Next */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              prevSlide()
            }}
            aria-label="Iepriekšējais skats"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-white/10 text-white/80 hover:bg-white/20 hover:text-white active:scale-95 transition"
            title="Iepriekšējais (Bultiņa pa kreisi)"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              nextSlide()
            }}
            aria-label="Nākamais skats"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-white/10 text-white/80 hover:bg-white/20 hover:text-white active:scale-95 transition"
            title="Nākamais (Bultiņa pa labi)"
          >
            <ChevronRight size={18} />
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label={isFullscreen ? 'Iziet no pilnekrāna' : 'Pilnekrāna režīms'}
            className="hidden sm:flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-white/10 text-white/80 hover:bg-white/20 hover:text-white active:scale-95 transition"
            title="Pilnekrāna režīms"
          >
            {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>

          {/* Close / Exit Kiosk Button */}
          {onClose && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection')
                onClose()
              }}
              aria-label="Aizvērt kioska skatu"
              className="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-rose-600/30 text-rose-300 hover:bg-rose-600/50 hover:text-white px-3.5 text-xs font-semibold active:scale-95 transition border border-rose-500/30"
              title="Aizvērt kioska TV (Esc)"
            >
              <X size={16} />
              <span className="hidden sm:inline">Aizvērt</span>
            </button>
          )}
        </div>
      </header>

      {/* Auto-Rotation Progress Bar */}
      <div className="h-1.5 w-full bg-white/10 overflow-hidden">
        <div
          className={`h-full transition-all duration-100 ease-linear ${
            isPlaying ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-white/30'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Sub-header status and clock */}
      <div className="flex items-center justify-between px-6 py-2 bg-black/30 border-b border-white/5 text-xs text-white/60">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-apple-blue" />
            <span>Kārta {tournament.currentRound} no {tournament.totalRounds}</span>
          </span>
          <span>·</span>
          <span>
            Nākamā rotācija pēc <strong className="font-mono text-white tabular-nums">{secondsRemaining}s</strong>
          </span>
        </div>
        <div className="font-mono text-xs font-semibold tracking-wider text-white/80">
          {currentTime}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CAROUSEL VIEW CONTAINER                                                   */}
      {/* ========================================================================= */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {currentSlide === 'tables' ? (
          <KioskTablesSlide tournament={tournament} matches={matches} />
        ) : (
          <KioskStandingsSlide standings={standings} />
        )}
      </main>
    </div>
  )
}

/**
 * High-visibility Table Matrix for Wall Mount Projectors & Hall TVs
 */
function KioskTablesSlide({ tournament, matches }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <span>Spēļu galds un rezultāti</span>
          <span className="rounded-full bg-apple-blue/20 text-apple-blue px-3 py-0.5 text-xs font-bold font-mono">
            {matches.length} galdi
          </span>
        </h2>
        <span className="text-xs text-white/50">10-Foot Glanceable Hall View</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
        {matches.map((match) => {
          const { playerA, playerB } = getMatchPlayers(match, tournament.players)
          const status = deriveMatchStatus(match, tournament.maxSetsPerMatch)
          const scoreA = getSetScore(match, match.playerAId)
          const scoreB = getSetScore(match, match.playerBId)
          const perfectA = getMatchPerfectPlays(match, match.playerAId)
          const perfectB = getMatchPerfectPlays(match, match.playerBId)

          const isDisputed = status === 'disputed'
          const isCompleted = status === 'completed'
          const isInProgress = status === 'in_progress'

          const borderGlow = isDisputed
            ? 'border-amber-500/50 bg-amber-950/20 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
            : isCompleted
              ? 'border-emerald-500/30 bg-emerald-950/15'
              : isInProgress
                ? 'border-blue-500/40 bg-blue-950/20 shadow-[0_0_20px_rgba(59,130,246,0.12)]'
                : 'border-white/10 bg-white/[0.04]'

          return (
            <div
              key={match.id}
              className={`rounded-2xl border p-5 transition-all ${borderGlow}`}
            >
              {/* Table Number & Status Pill */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-white/10 text-white font-mono text-3xl font-black tabular-nums">
                    {match.table}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/50">Galds</span>
                    <h3 className="text-sm font-semibold text-white/90">
                      {tournament.maxSetsPerMatch} setu mačs
                    </h3>
                  </div>
                </div>

                <KioskStatusBadge status={status} />
              </div>

              {/* Matchup Players & Big Scores */}
              <div className="mt-4 space-y-3">
                {/* Player A */}
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-lg sm:text-xl font-bold text-white truncate">
                        {playerA?.name || 'Spēlētājs A'}
                      </p>
                      {perfectA > 0 && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                          <Star size={11} className="fill-amber-400" /> x{perfectA}
                        </span>
                      )}
                    </div>
                    {playerA?.representation && (
                      <p className="text-xs text-white/50 truncate mt-0.5">{playerA.representation}</p>
                    )}
                  </div>
                  <span className="font-mono text-3xl sm:text-4xl font-black tabular-nums text-white shrink-0">
                    {scoreA}
                  </span>
                </div>

                {/* Player B */}
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-lg sm:text-xl font-bold text-white truncate">
                        {playerB?.name || 'Spēlētājs B'}
                      </p>
                      {perfectB > 0 && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                          <Star size={11} className="fill-amber-400" /> x{perfectB}
                        </span>
                      )}
                    </div>
                    {playerB?.representation && (
                      <p className="text-xs text-white/50 truncate mt-0.5">{playerB.representation}</p>
                    )}
                  </div>
                  <span className="font-mono text-3xl sm:text-4xl font-black tabular-nums text-white shrink-0">
                    {scoreB}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Glanceable Hall Standings Leaderboard
 */
function KioskStandingsSlide({ standings }) {
  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <Trophy size={24} className="text-amber-400" />
          <span>Kopvērtējuma līderu saraksts</span>
        </h2>
        <span className="text-xs text-white/50 font-mono tabular-nums">
          Kopā {standings.length} dalībnieki
        </span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden divide-y divide-white/5">
        {/* Table Header */}
        <div className="grid grid-cols-[60px_1fr_120px_120px] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/40">
          <span>Vieta</span>
          <span>Spēlētājs</span>
          <span className="text-right">Buholcs</span>
          <span className="text-right">Punkti</span>
        </div>

        {/* Rows */}
        {standings.slice(0, 16).map((player, index) => {
          const rank = index + 1
          const rankBadge =
            rank === 1
              ? 'bg-amber-400 text-black font-black'
              : rank === 2
                ? 'bg-slate-300 text-black font-bold'
                : rank === 3
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-white/10 text-white/70'

          return (
            <div
              key={player.id}
              className={`grid grid-cols-[60px_1fr_120px_120px] items-center px-5 py-3.5 text-sm sm:text-base transition-colors ${
                rank <= 3 ? 'bg-white/[0.02]' : ''
              }`}
            >
              <div>
                <span className={`inline-flex size-8 items-center justify-center rounded-lg font-mono text-sm tabular-nums ${rankBadge}`}>
                  {rank}
                </span>
              </div>

              <div className="min-w-0 pr-3">
                <p className="font-bold text-white truncate text-base sm:text-lg">
                  {player.name}
                </p>
                {player.representation && (
                  <p className="text-xs text-white/50 truncate">
                    {player.representation}
                  </p>
                )}
              </div>

              <div className="text-right font-mono text-white/70 tabular-nums">
                {player.buchholz}
              </div>

              <div className="text-right">
                <span className="inline-block font-mono text-xl sm:text-2xl font-black text-apple-blue tabular-nums">
                  {player.points} p.
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function KioskStatusBadge({ status }) {
  const configs = {
    scheduled: { label: 'Ieplānots', icon: Clock, badge: 'border-white/10 bg-white/10 text-white/70' },
    in_progress: { label: 'Notiek', icon: Activity, badge: 'border-blue-500/40 bg-blue-500/20 text-blue-300 animate-pulse' },
    disputed: { label: 'Tiesnesis pie galda', icon: AlertTriangle, badge: 'border-amber-500/40 bg-amber-500/20 text-amber-300' },
    investigating: { label: 'Izmeklē', icon: Clock, badge: 'border-amber-500/40 bg-amber-500/20 text-amber-300' },
    awaiting_confirmation: { label: 'Gaida apstiprinājumu', icon: Clock, badge: 'border-purple-500/40 bg-purple-500/20 text-purple-300' },
    completed: { label: 'Pabeigts', icon: CheckCircle2, badge: 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300' },
  }

  const current = configs[status] || configs.scheduled
  const Icon = current.icon

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${current.badge}`}>
      <Icon size={13} strokeWidth={2.4} />
      <span>{current.label}</span>
    </span>
  )
}

