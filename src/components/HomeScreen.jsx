import React from 'react'
import {
  ShieldCheck,
  UserRound,
  ArrowRight,
  Trophy,
  Users,
  Grid,
  CheckCircle2,
  Sparkles,
  Flame,
} from 'lucide-react'
import { NovussBoardIllustration } from './NovussBoardIllustration'

export function HomeScreen({
  tournament,
  selectedPlayer,
  hasPlayerSession,
  onOrganizer,
  onPlayer,
}) {
  const currentRound = tournament?.currentRound ?? 1
  const totalRounds = tournament?.totalRounds ?? 11
  const playersCount = tournament?.players?.length ?? 32
  const activeTablesCount = tournament?.matches ? Math.max(...tournament.matches.map((m) => m.table || 0), 16) : 16
  const tournamentName = tournament?.name || 'Novusa Turnīrs'
  const venueName = tournament?.venue || 'Galvenā Zāle'

  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Dynamic Ambient Background Gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-full max-w-7xl -translate-x-1/2 overflow-hidden blur-3xl opacity-70">
        <div className="absolute top-10 left-1/4 h-[350px] w-[500px] rounded-full bg-gradient-to-tr from-amber-400/25 via-orange-400/20 to-rose-400/20" />
        <div className="absolute top-20 right-1/4 h-[320px] w-[460px] rounded-full bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-sky-400/15" />
      </div>

      <div className="mx-auto max-w-5xl space-y-10">
        {/* Hero Section */}
        <section className="relative rounded-3xl border border-black/[0.06] bg-white/70 p-6 sm:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Content Column */}
            <div className="space-y-4 text-left lg:col-span-7">
              {/* Live Status Pill */}
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-black/[0.08] bg-white/90 px-3.5 py-1 text-xs font-semibold text-[#1C1C1E] shadow-sm backdrop-blur-md">
                <span className="flex size-2 items-center justify-center">
                  <span className="absolute size-2.5 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative size-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-bold tracking-tight text-emerald-700">TIEŠRAIDE</span>
                <span className="text-[#8E8E93]">•</span>
                <span className="truncate max-w-[200px] font-medium text-[#1C1C1E]">{tournamentName}</span>
                <span className="text-[#8E8E93]">•</span>
                <span className="font-medium text-[#636366]">{venueName}</span>
              </div>

              {/* Title with Gradient Text Accents */}
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#1C1C1E] sm:text-4xl lg:text-5xl">
                  Novusa turnīru{' '}
                  <span className="bg-gradient-to-r from-amber-600 via-rose-600 to-blue-600 bg-clip-text text-transparent">
                    digitālā vadība
                  </span>
                </h1>
                <p className="text-base leading-relaxed text-[#636366] sm:text-lg">
                  Oficiālais Šveices sistēmas sacensību centrs. Reāllaika galdu pārraudzība tiesnešiem un tūlītēja setu reģistrēšana spēlētājiem.
                </p>
              </div>

              {/* Quick Tournament Metrics Capsule */}
              <div className="pt-2 grid grid-cols-3 gap-2.5 sm:gap-4">
                <div className="rounded-2xl border border-black/[0.06] bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8E8E93]">
                    <Trophy size={14} className="text-amber-500" />
                    <span>Kārta</span>
                  </div>
                  <p className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1E] tabular-nums">
                    {currentRound} <span className="text-xs font-normal text-[#8E8E93]">/ {totalRounds}</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-black/[0.06] bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8E8E93]">
                    <Users size={14} className="text-blue-500" />
                    <span>Dalībnieki</span>
                  </div>
                  <p className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1E] tabular-nums">
                    {playersCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-black/[0.06] bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8E8E93]">
                    <Grid size={14} className="text-rose-500" />
                    <span>Galdi</span>
                  </div>
                  <p className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1E] tabular-nums">
                    {activeTablesCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Graphic Column: Novuss Table Graphic */}
            <div className="flex flex-col items-center justify-center lg:col-span-5">
              <div className="relative flex items-center justify-center">
                <NovussBoardIllustration />
                {/* Floating Micro-Badge */}
                <div className="absolute -bottom-3 rounded-full border border-black/[0.08] bg-white/95 px-3.5 py-1 text-[11px] font-semibold text-[#1C1C1E] shadow-md backdrop-blur-md">
                  <span className="mr-1 text-amber-600">●</span> 100 × 100 cm standarts
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roles Grid (Organizer vs Player) */}
        <section className="space-y-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1E]">
              Izvēlieties savu lomu
            </h2>
            <p className="text-sm text-[#8E8E93]">
              Pieslēdzieties ar savām pilnvarām vai piekļūstiet savam spēļu galdam
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Role 1: Organizators */}
            <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,122,255,0.12)] hover:border-blue-500/30">
              {/* Vibrant Top Accent Gradient */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

              <div>
                {/* Top header row */}
                <div className="flex items-center justify-between">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white shadow-[0_4px_16px_rgba(0,122,255,0.35)] transition-transform duration-300 group-hover:scale-105">
                    <ShieldCheck size={28} strokeWidth={2.2} />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600">
                    <Sparkles size={12} />
                    Vadībai & Tiesnešiem
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight text-[#1C1C1E]">
                    Organizators
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Turnīra vadības panelis
                  </p>
                  <p className="text-sm leading-relaxed text-[#636366]">
                    Pārraugiet visus galdus reāllaikā, apstipriniet iesniegtos setus, reaģējiet uz tiesneša izsaukumiem un ģenerējiet Šveices sistēmas kārtas.
                  </p>
                </div>

                {/* Micro Capabilities List */}
                <ul className="mt-5 space-y-2 text-xs font-medium text-[#636366]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-blue-500 flex-shrink-0" />
                    <span>Tiešsaistes galdu matrica ar reāllaika statusiem</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-blue-500 flex-shrink-0" />
                    <span>Šveices sistēmas automātiskā pāru izloze</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-blue-500 flex-shrink-0" />
                    <span>Strīdu risināšana un rezultātu korekcija</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-black/[0.04]">
                <button
                  type="button"
                  onClick={onOrganizer}
                  className="group/btn relative flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(0,122,255,0.3)] transition-all duration-150 hover:from-blue-500 hover:to-blue-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30"
                >
                  <span>Atvērt organizatora paneli</span>
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover/btn:translate-x-1"
                  />
                </button>
              </div>
            </article>

            {/* Role 2: Spēlētājs */}
            <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(225,29,72,0.12)] hover:border-rose-500/30">
              {/* Vibrant Top Accent Gradient */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400" />

              <div>
                {/* Top header row */}
                <div className="flex items-center justify-between">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 text-white shadow-[0_4px_16px_rgba(225,29,72,0.35)] transition-transform duration-300 group-hover:scale-105">
                    <UserRound size={28} strokeWidth={2.2} />
                  </div>

                  {hasPlayerSession ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      Aktīva sesija
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600">
                      <Flame size={12} />
                      Spēlētājiem
                    </span>
                  )}
                </div>

                <div className="mt-5 space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight text-[#1C1C1E]">
                    Spēlētāja portāls
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                    Mans galds & Setu protokols
                  </p>
                  <p className="text-sm leading-relaxed text-[#636366]">
                    {hasPlayerSession && selectedPlayer
                      ? `Sveicināti atpakaļ, ${selectedPlayer.name}! Jūsu sesija ir aktīva. Turpiniet savas spēles rezultātu reģistrēšanu un sekojiet galdam.`
                      : 'Pieslēdzieties ar savu 6 zīmju dalībnieka kodu, lai skatītu galda piešķīrumu, ievadītu setus un fiksētu izcilās sērijas.'}
                  </p>
                </div>

                {/* Micro Capabilities List */}
                <ul className="mt-5 space-y-2 text-xs font-medium text-[#636366]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-rose-500 flex-shrink-0" />
                    <span>Galda piešķīruma un pretinieka informācija</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-rose-500 flex-shrink-0" />
                    <span>Tūlītēja setu ievade un abpusējs apstiprinājums</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-rose-500 flex-shrink-0" />
                    <span>Tiesneša izsaukuma poga strīdīgām situācijām</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-black/[0.04]">
                <button
                  type="button"
                  onClick={onPlayer}
                  className="group/btn relative flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-600 to-amber-600 px-5 text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(225,29,72,0.3)] transition-all duration-150 hover:from-rose-500 hover:to-amber-500 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/30"
                >
                  <span>
                    {hasPlayerSession ? 'Turpināt manu spēli' : 'Ievadīt spēlētāja kodu'}
                  </span>
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover/btn:translate-x-1"
                  />
                </button>
              </div>
            </article>
          </div>
        </section>

        {/* Novuss Tradition & Rules strip */}
        <section className="rounded-2xl border border-black/[0.06] bg-gradient-to-r from-amber-50/60 via-white/80 to-blue-50/60 p-4 sm:p-6 backdrop-blur-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-900">Novuss — Latvijas Nacionālais Sports</span>
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                  Kopš 1927. gada
                </span>
              </div>
              <p className="text-xs text-[#636366] max-w-2xl">
                Dinamiska divcīņa uz 100 × 100 cm finiera galda ar 8 sarkaniem un 8 melniem kauliņiem. NVSSGRID nodrošina precīzu digitālo protokolu un godīgu Šveices sistēmas kārtu ģenerēšanu.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1C1E] flex-shrink-0">
              <span className="rounded-lg border border-black/[0.08] bg-white px-2.5 py-1.5 shadow-sm">
                🎯 8 no vietas
              </span>
              <span className="rounded-lg border border-black/[0.08] bg-white px-2.5 py-1.5 shadow-sm">
                ⏱️ Šveices sistēma
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
