import React from 'react'
import { ChevronLeft } from 'lucide-react'

export function AppShell({ title, showBack = false, onBack, children }) {
  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E] font-sans">
      <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
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
                <span className="inline-flex items-center rounded-full bg-apple-blue/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-apple-blue">
                  NVSSGRID
                </span>
              </div>
              <h1 className="truncate text-lg font-semibold tracking-tight text-[#1C1C1E] sm:text-xl">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-black/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-500">
              <span className="size-1.5 rounded-full bg-apple-green animate-pulse" />
              Tiešsaiste
            </span>
          </div>
        </div>
      </header>
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}
