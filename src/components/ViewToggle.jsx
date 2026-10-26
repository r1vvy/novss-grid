import React from 'react'
import { Grid3X3, User } from 'lucide-react'

export function ViewToggle({ view, onViewChange }) {
  return (
    <div className="inline-flex rounded-xl border border-black/[0.04] bg-black/[0.06] p-1">
      <button
        type="button"
        onClick={() => onViewChange('organizer')}
        className={`flex min-h-[36px] items-center justify-center gap-2 rounded-lg px-4 text-xs font-semibold transition-all ${
          view === 'organizer'
            ? 'bg-white text-slate-900 shadow-apple-sm'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Grid3X3 size={15} strokeWidth={2.2} />
        <span>Organizators</span>
      </button>
      <button
        type="button"
        onClick={() => onViewChange('player')}
        className={`flex min-h-[36px] items-center justify-center gap-2 rounded-lg px-4 text-xs font-semibold transition-all ${
          view === 'player'
            ? 'bg-white text-slate-900 shadow-apple-sm'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <User size={15} strokeWidth={2.2} />
        <span>Spēlētājs</span>
      </button>
    </div>
  )
}
