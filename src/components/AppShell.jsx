import React from 'react'
import { ChevronLeft } from 'lucide-react'

export function AppShell({ title, showBack = false, onBack, children }) {
  return (
    <div className="min-h-screen bg-nvssBg text-white">
      <div className="border-b border-nvssBorder bg-nvssSurface/80 px-3 py-3 backdrop-blur sm:px-5">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nvssGreen">NVSSGRID</p>
            <h1 className="truncate text-xl font-semibold sm:text-2xl">{title}</h1>
          </div>
          {showBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex min-h-[44px] items-center gap-1 rounded border border-nvssBorder px-3 text-sm text-nvssMuted"
            >
              <ChevronLeft size={18} />
              Sākums
            </button>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  )
}
