import React, { useMemo, useState } from 'react'
import {
  ShieldCheck,
  UserRound,
  ArrowRight,
  Trophy,
  Sparkles,
  CheckCircle2,
  LogIn,
  KeyRound,
  RotateCcw,
} from 'lucide-react'
import { NovussBoardIllustration } from './NovussBoardIllustration'
import { NovussPuck } from './NovussPuck'
import { activeTournamentsList } from '../data/mockTournament'

export function HomeScreen({
  tournament,
  tournaments = activeTournamentsList,
  selectedPlayer,
  hasPlayerSession,
  organizerAuthenticated = false,
  onOrganizer,
  onOrganizerLogin,
  onPlayer,
  onPlayerCheckIn,
  onSelectTournament,
}) {
  const [isOrganizerFlipped, setIsOrganizerFlipped] = useState(false)
  const [isPlayerFlipped, setIsPlayerFlipped] = useState(false)

  // Login form state
  const [orgEmail, setOrgEmail] = useState('organizer@nvssgrid.local')
  const [orgPassword, setOrgPassword] = useState('parole123')

  // Player code form state
  const [playerCode, setPlayerCode] = useState('')
  const [playerCodeError, setPlayerCodeError] = useState('')

  const tourneyList = useMemo(() => {
    if (!tournaments || tournaments.length === 0) {
      return tournament ? [tournament] : []
    }
    if (tournament && !tournaments.some((t) => t.id === tournament.id)) {
      return [tournament, ...tournaments]
    }
    return tournaments.map((t) => (t.id === tournament?.id ? { ...t, ...tournament } : t))
  }, [tournament, tournaments])

  const currentTourneyId = tournament?.id || tourneyList[0]?.id
  const currentTourney = tourneyList.find((t) => t.id === currentTourneyId) || tournament
  const tournamentName = currentTourney?.name || 'Novusa Turnīrs'
  const venueName = currentTourney?.venue || 'Galvenā Zāle'

  function handleOrganizerSubmit(e) {
    e.preventDefault()
    if (onOrganizerLogin) {
      onOrganizerLogin({ email: orgEmail, password: orgPassword })
    } else if (onOrganizer) {
      onOrganizer()
    }
  }

  function handlePlayerCodeSubmit(e) {
    e.preventDefault()
    const cleanCode = playerCode.trim().toUpperCase()
    if (!cleanCode) {
      setPlayerCodeError('Lūdzu, ievadiet 6 zīmju dalībnieka kodu.')
      return
    }

    if (onPlayerCheckIn) {
      const ok = onPlayerCheckIn(cleanCode)
      if (!ok) {
        setPlayerCodeError('Kods nav atrasts. Pārbaudiet kodu (piem., ANNA42, JANIS7).')
      } else {
        setPlayerCodeError('')
      }
    } else if (onPlayer) {
      onPlayer()
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8 flex flex-col justify-center">
      <div className="mx-auto max-w-[1500px] w-full">
        {/* ========================================================================= */}
        {/* macOS FROSTED GLASS HERO SHEET CONTAINER                                  */}
        {/* ========================================================================= */}
        <section
          aria-label="Novuss Nacionālais sports ievads un lomu izvēle"
          className="relative rounded-3xl border border-white/80 bg-white/45 sm:bg-white/50 p-5 sm:p-7 lg:p-9 shadow-[inset_0_1px_2px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.02),0_24px_70px_rgba(0,0,0,0.07)] backdrop-blur-3xl"
        >
          {/* Subtle Decorative Floating Kauliņi */}
          <div className="pointer-events-none absolute -top-4 right-10 hidden xl:block animate-float-gentle opacity-90 drop-shadow-lg">
            <NovussPuck type="red" size={54} />
          </div>
          <div className="pointer-events-none absolute -bottom-4 left-10 hidden xl:block animate-float-alt opacity-85 drop-shadow-lg">
            <NovussPuck type="black" size={48} />
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* ------------------------------------------------------------------- */}
            {/* LEFT COLUMN: HERO NARRATIVE & 3D FLIP ROLE CARDS (7 of 12 cols)     */}
            {/* ------------------------------------------------------------------- */}
            <div className="space-y-6 lg:col-span-7">
              {/* Top Live Bar with Translucent Glass Styling */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3.5 py-1 text-xs font-semibold text-[#1C1C1E] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-xl">
                  <span className="flex size-2 items-center justify-center">
                    <span className="absolute size-2 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative size-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="font-bold tracking-tight text-emerald-700">TIEŠRAIDE</span>
                  <span className="text-[#8E8E93]">•</span>
                  <span className="truncate max-w-[180px] font-medium text-[#1C1C1E]">{tournamentName}</span>
                  <span className="text-[#8E8E93]">•</span>
                  <span className="font-medium text-[#636366]">{venueName}</span>
                </div>
              </div>

              {/* Exact Requested Hero Narrative */}
              <div className="space-y-2.5">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[28px] xl:text-[34px] 2xl:text-[38px] font-black tracking-tight text-[#1C1C1E] sm:whitespace-nowrap leading-tight">
                  Novuss —{' '}
                  <span className="bg-gradient-to-r from-amber-600 via-rose-600 to-blue-600 bg-clip-text text-transparent">
                    Latvijas Nacionālais Sports
                  </span>
                </h1>
                <p className="text-sm sm:text-base leading-relaxed text-[#48484A]">
                  Kopš 1927. gada — dinamiska divcīņa uz 100 × 100 cm finiera galda ar 8 sarkaniem un 8 melniem kauliņiem.
                  NVSSGRID nodrošina precīzu digitālo protokolu un godīgu Šveices sistēmas kārtu ģenerēšanu.
                </p>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* INTEGRATED 3D FLIP ROLE CARDS WITH macOS GLASS MATERIAL           */}
              {/* ----------------------------------------------------------------- */}
              <div className="grid gap-4 sm:grid-cols-2 pt-1">
                {/* CARD 1: ORGANIZATORS (3D FLIP) */}
                <div className="perspective-1000 min-h-[360px]">
                  <div
                    className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                      isOrganizerFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* FRONT: ORGANIZER (macOS Glass) */}
                    <article className="backface-hidden flex flex-col justify-between rounded-2xl border border-white/80 bg-white/50 p-5 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.95),0_14px_36px_rgba(0,0,0,0.04)] hover:bg-white/65 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_20px_45px_rgba(0,122,255,0.12)] hover:border-white transition-all duration-300 backdrop-blur-2xl">
                      <div className="absolute top-0 inset-x-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
                            <ShieldCheck size={22} strokeWidth={2.2} />
                          </div>
                          <span className="rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 backdrop-blur-md">
                            Vadībai & Tiesnešiem
                          </span>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold tracking-tight text-[#1C1C1E]">
                            Organizators
                          </h2>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                            Turnīra vadība
                          </p>
                          <p className="mt-1 text-xs text-[#636366] leading-relaxed line-clamp-3">
                            Pārraugiet visus galdus, apstipriniet setus, risiniet tiesneša izsaukumus un ģenerējiet Šveices kārtas.
                          </p>
                        </div>

                        <ul className="space-y-1.5 text-xs text-[#636366]">
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-blue-500 flex-shrink-0" />
                            <span>16 Galdu tiešraides matrica</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-blue-500 flex-shrink-0" />
                            <span>Šveices sistēmas kārtu izloze</span>
                          </li>
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-black/[0.04] mt-4">
                        {organizerAuthenticated ? (
                          <button
                            type="button"
                            onClick={onOrganizer}
                            className="group/btn flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-blue-600 active:scale-[0.98]"
                          >
                            <span>Atvērt vadības paneli</span>
                            <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsOrganizerFlipped(true)}
                            className="group/btn flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-blue-600 active:scale-[0.98]"
                          >
                            <LogIn size={16} />
                            <span>Pieslēgties panelim</span>
                            <span className="text-[11px] text-blue-200 font-normal ml-0.5">(apgriezt)</span>
                          </button>
                        )}
                      </div>
                    </article>

                    {/* BACK: ORGANIZER LOGIN FORM (macOS Glass) */}
                    <article className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-2xl border border-white/90 bg-white/70 p-5 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.95),0_18px_40px_rgba(0,122,255,0.1)] backdrop-blur-2xl">
                      <div className="absolute top-0 inset-x-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                            <KeyRound size={18} />
                          </div>
                          <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 border border-blue-500/20">
                            Testa vide
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold tracking-tight text-[#1C1C1E]">
                            Organizatora ieeja
                          </h3>
                          <p className="text-[11px] text-[#8E8E93]">Demonstrācijas piekļuve</p>
                        </div>

                        <form id="hero-org-login" onSubmit={handleOrganizerSubmit} className="space-y-2">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#636366]">E-pasts</label>
                            <input
                              type="email"
                              value={orgEmail}
                              onChange={(e) => setOrgEmail(e.target.value)}
                              className="mt-0.5 min-h-[38px] w-full rounded-lg border border-white/80 bg-white/60 px-2.5 text-xs text-[#1C1C1E] backdrop-blur-md focus:bg-white focus:border-blue-500 shadow-inner"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#636366]">Parole</label>
                            <input
                              type="password"
                              value={orgPassword}
                              onChange={(e) => setOrgPassword(e.target.value)}
                              className="mt-0.5 min-h-[38px] w-full rounded-lg border border-white/80 bg-white/60 px-2.5 text-xs text-[#1C1C1E] backdrop-blur-md focus:bg-white focus:border-blue-500 shadow-inner"
                              required
                            />
                          </div>
                        </form>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-black/[0.04]">
                        <button
                          type="submit"
                          form="hero-org-login"
                          className="flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-3 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-blue-600 active:scale-[0.98]"
                        >
                          <LogIn size={15} />
                          <span>Ieiet vadības panelī</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsOrganizerFlipped(false)}
                          className="flex min-h-[32px] w-full items-center justify-center gap-1 rounded-lg border border-white/80 bg-white/50 text-[11px] font-medium text-[#636366] backdrop-blur-md transition-all hover:bg-white/80 active:scale-[0.98]"
                        >
                          <RotateCcw size={12} />
                          <span>Atpakaļ</span>
                        </button>
                      </div>
                    </article>
                  </div>
                </div>

                {/* CARD 2: SPĒLĒTĀJS (3D FLIP) */}
                <div className="perspective-1000 min-h-[360px]">
                  <div
                    className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                      isPlayerFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* FRONT: PLAYER (macOS Glass) */}
                    <article className="backface-hidden flex flex-col justify-between rounded-2xl border border-white/80 bg-white/50 p-5 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.95),0_14px_36px_rgba(0,0,0,0.04)] hover:bg-white/65 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_20px_45px_rgba(225,29,72,0.12)] hover:border-white transition-all duration-300 backdrop-blur-2xl">
                      <div className="absolute top-0 inset-x-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400" />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25">
                            <UserRound size={22} strokeWidth={2.2} />
                          </div>

                          {hasPlayerSession ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 backdrop-blur-md">
                              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Aktīva sesija
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/25 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-600 backdrop-blur-md">
                              <NovussPuck type="red" size={14} withShadow={false} />
                              Spēlētājiem
                            </span>
                          )}
                        </div>

                        <div>
                          <h2 className="text-xl font-bold tracking-tight text-[#1C1C1E]">
                            Spēlētāja portāls
                          </h2>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">
                            Mans galds & Seti
                          </p>
                          <p className="mt-1 text-xs text-[#636366] leading-relaxed line-clamp-3">
                            {hasPlayerSession && selectedPlayer
                              ? `Sveicināti, ${selectedPlayer.name}! Jūsu sesija ir aktīva. Turpiniet savas spēles rezultātu reģistrēšanu.`
                              : 'Pieslēdzieties ar savu 6 zīmju kodu, lai skatītu galdu, ievadītu setus un fiksētu izcilās sērijas.'}
                          </p>
                        </div>

                        <ul className="space-y-1.5 text-xs text-[#636366]">
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-rose-500 flex-shrink-0" />
                            <span>Galda un pretinieka tiešraide</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-rose-500 flex-shrink-0" />
                            <span>Tūlītēja setu un 8 no vietas fiksēšana</span>
                          </li>
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-black/[0.04] mt-4">
                        {hasPlayerSession ? (
                          <button
                            type="button"
                            onClick={onPlayer}
                            className="group/btn flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 px-4 text-sm font-semibold text-white shadow-md shadow-rose-500/25 transition-all hover:from-rose-500 hover:to-amber-500 active:scale-[0.98]"
                          >
                            <span>Turpināt manu spēli</span>
                            <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsPlayerFlipped(true)}
                            className="group/btn flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 px-4 text-sm font-semibold text-white shadow-md shadow-rose-500/25 transition-all hover:from-rose-500 hover:to-amber-500 active:scale-[0.98]"
                          >
                            <KeyRound size={16} />
                            <span>Ievadīt spēlētāja kodu</span>
                            <span className="text-[11px] text-rose-200 font-normal ml-0.5">(apgriezt)</span>
                          </button>
                        )}
                      </div>
                    </article>

                    {/* BACK: PLAYER CODE FORM (macOS Glass) */}
                    <article className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-2xl border border-white/90 bg-white/70 p-5 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.95),0_18px_40px_rgba(225,29,72,0.1)] backdrop-blur-2xl">
                      <div className="absolute top-0 inset-x-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400" />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex size-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                            <NovussPuck type="red" size={24} withShadow={false} />
                          </div>
                          <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-600 border border-rose-500/20">
                            Dalībnieka pieeja
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold tracking-tight text-[#1C1C1E]">
                            Ievadiet dalībnieka kodu
                          </h3>
                          <p className="text-[11px] text-[#8E8E93]">Piem., ANNA42, JANIS7, RIX001</p>
                        </div>

                        <form id="hero-player-code" onSubmit={handlePlayerCodeSubmit} className="space-y-2">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#636366]">Kods</label>
                            <input
                              type="text"
                              maxLength={10}
                              value={playerCode}
                              onChange={(e) => {
                                setPlayerCode(e.target.value.toUpperCase())
                                setPlayerCodeError('')
                              }}
                              className="mt-0.5 min-h-[40px] w-full rounded-lg border border-white/80 bg-white/60 px-3 text-center font-mono text-sm font-bold tracking-widest text-[#1C1C1E] uppercase backdrop-blur-md focus:bg-white focus:border-rose-500 shadow-inner"
                              placeholder="ANNA42"
                              autoComplete="off"
                            />
                            {playerCodeError && (
                              <p className="mt-1 text-[11px] font-medium text-rose-600">
                                {playerCodeError}
                              </p>
                            )}
                          </div>
                        </form>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-black/[0.04]">
                        <button
                          type="submit"
                          form="hero-player-code"
                          className="flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 px-3 text-xs font-semibold text-white shadow-md shadow-rose-500/20 transition-all hover:from-rose-500 hover:to-amber-500 active:scale-[0.98]"
                        >
                          <span>Pieslēgties galdam</span>
                          <ArrowRight size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsPlayerFlipped(false)}
                          className="flex min-h-[32px] w-full items-center justify-center gap-1 rounded-lg border border-white/80 bg-white/50 text-[11px] font-medium text-[#636366] backdrop-blur-md transition-all hover:bg-white/80 active:scale-[0.98]"
                        >
                          <RotateCcw size={12} />
                          <span>Atpakaļ</span>
                        </button>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* RIGHT COLUMN: NOVUSS TABLE WITH macOS GLASS OVERLAY PANEL           */}
            {/* ------------------------------------------------------------------- */}
            <div className="flex flex-col items-center justify-center lg:col-span-5">
              <NovussBoardIllustration>
                {/* macOS Translucent Glass Panel resting on the Table */}
                <div className="pointer-events-auto w-full max-w-[290px] sm:max-w-[315px] rounded-2xl border border-white/80 bg-white/50 p-3.5 sm:p-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.95),0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition-all duration-300 hover:bg-white/60">
                  {/* Header: Aktīvie turnīri */}
                  <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <Trophy size={16} className="text-amber-500" />
                      <span className="text-xs font-bold tracking-tight text-[#1C1C1E]">
                        Aktīvie turnīri
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 backdrop-blur-md">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Tiešraide
                    </span>
                  </div>

                  {/* Active Tournaments List */}
                  <div className="mt-2.5 space-y-2">
                    {tourneyList.map((t) => {
                      const isCurrent = t.id === currentTourneyId
                      return (
                        <div
                          key={t.id}
                          onClick={() => onSelectTournament?.(t)}
                          role="button"
                          tabIndex={0}
                          className={`w-full text-left rounded-xl p-2.5 transition-all ${
                            isCurrent
                              ? 'bg-blue-500/15 border border-blue-500/35 backdrop-blur-md shadow-xs'
                              : 'bg-white/40 hover:bg-white/65 border border-white/60 backdrop-blur-md cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-[#1C1C1E] truncate">
                              {t.name}
                            </h4>
                            {isCurrent && (
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-500/15 border border-blue-500/20 rounded-md px-1.5 py-0.5">
                                Aktīvs
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[11px] text-[#636366]">
                            <span className="truncate max-w-[150px]">{t.venue}</span>
                            <span className="font-semibold text-[#1C1C1E] tabular-nums">
                              {t.currentRound}. kārta
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </NovussBoardIllustration>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
