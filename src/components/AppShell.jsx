import React from 'react'
import { ChevronLeft } from 'lucide-react'

export function AppShell({ title, showBack = false, hideHeader = false, onBack, children }) {
  return (
    <div className="min-h-screen bg-[#F0F2F6] text-[#1C1C1E] font-sans relative overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-900">
      {/* ========================================================================= */}
      {/* GLOBAL macOS VIBRANT MESH GRADIENTS & FROSTED GLASS ATMOSPHERE            */}
      {/* ========================================================================= */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
        {/* Electric Sapphire & Cobalt Orb (top left) */}
        <div className="absolute -top-[12%] -left-[10%] h-[750px] w-[850px] rounded-full bg-gradient-to-br from-blue-600/60 via-indigo-600/45 to-sky-400/40 blur-[110px]" />

        {/* Baltic Birch Amber & Warm Honey Glow (top right) */}
        <div className="absolute -top-[5%] -right-[10%] h-[720px] w-[800px] rounded-full bg-gradient-to-bl from-amber-400/65 via-orange-500/50 to-yellow-300/40 blur-[110px]" />

        {/* Vibrant Rose & Coral Magenta Orb (bottom right) */}
        <div className="absolute -bottom-[15%] right-[8%] h-[680px] w-[750px] rounded-full bg-gradient-to-tl from-rose-500/55 via-pink-500/45 to-purple-600/40 blur-[110px]" />

        {/* Deep Violet & Iris Center Halo */}
        <div className="absolute top-[30%] left-[25%] h-[550px] w-[600px] rounded-full bg-gradient-to-tr from-violet-600/40 via-indigo-500/30 to-transparent blur-[100px]" />

        {/* Alpine Emerald & Nordic Cyan Mist (bottom left) */}
        <div className="absolute -bottom-[10%] -left-[5%] h-[580px] w-[650px] rounded-full bg-gradient-to-tr from-emerald-400/45 via-teal-400/35 to-sky-500/30 blur-[100px]" />

        {/* Subtle macOS Frosted Glass Grain / Texture */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay"
        >
          <filter id="mac-glass-grain-global">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#mac-glass-grain-global)" />
        </svg>
      </div>

      {!hideHeader && (
        <header className="sticky top-0 z-40 border-b border-black/[0.05] bg-white/55 backdrop-blur-2xl shadow-[inset_0_-0.5px_0_rgba(255,255,255,0.7),0_1px_4px_rgba(0,0,0,0.02)] transition-all">
          <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
            <div className="flex items-center gap-3 min-w-0">
              {showBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="group -ml-1.5 flex min-h-[44px] items-center gap-0.5 rounded-xl px-2.5 py-1 text-[15px] font-normal text-apple-blue transition-all active:bg-apple-blue/10 active:opacity-75 focus-visible:ring-2 focus-visible:ring-apple-blue/30"
                  aria-label="Atgriezties uz sākumu"
                >
                  <ChevronLeft size={20} strokeWidth={2.5} className="transition-transform group-active:-translate-x-0.5" />
                  <span>Sākums</span>
                </button>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#1C1C1E] shadow-sm">
                    <span className="size-1.5 rounded-full bg-rose-500" />
                    NVSSGRID
                  </span>
                </div>
                <h1 className="truncate text-lg font-semibold tracking-tight text-[#1C1C1E] sm:text-xl">
                  {title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-[#636366] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
                <span className="size-1.5 rounded-full bg-apple-green animate-pulse" />
                Tiešsaiste
              </span>
            </div>
          </div>
        </header>
      )}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  )
}
