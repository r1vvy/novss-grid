import React from 'react'
import { Grid3X3, User } from 'lucide-react'

export function ViewToggle({ view, onViewChange }) {
  return (
    <div className="inline-flex rounded-xl border border-black/[0.04] bg-black/[0.06] p-1">
      <button
        type="button"
        onClick={() => onViewChange('organizer')}
        className={`flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 text-xs font-semibold transition-all ${
          view === 'organizer'
            ? 'bg-white text-[#1C1C1E] shadow-apple-sm'
            : 'text-[#8E8E93] hover:text-[#1C1C1E]'
        }`}
      >
        <Grid3X3 size={15} strokeWidth={2.2} />
        <span>Organizators</span>
      </button>
      <button
        type="button"
        onClick={() => onViewChange('player')}
        className={`flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 text-xs font-semibold transition-all ${
          view === 'player'
            ? 'bg-white text-[#1C1C1E] shadow-apple-sm'
            : 'text-[#8E8E93] hover:text-[#1C1C1E]'
        }`}
      >
        <User size={15} strokeWidth={2.2} />
        <span>Spēlētājs</span>
      </button>
    </div>
  )
}
