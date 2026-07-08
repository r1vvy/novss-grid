import React from 'react'
import { Grid3X3, User } from 'lucide-react'

export function ViewToggle({ view, onViewChange }) {
  return (
    <div className="grid grid-cols-2 rounded-md border border-nvssBorder bg-nvssBg p-1">
      <button
        type="button"
        onClick={() => onViewChange('organizer')}
        className={`flex min-h-[44px] items-center justify-center gap-2 rounded px-4 text-sm font-semibold ${
          view === 'organizer' ? 'bg-nvssGreenAction text-nvssSurface' : 'text-nvssMuted hover:text-nvssText'
        }`}
      >
        <Grid3X3 size={18} />
        Organizer
      </button>
      <button
        type="button"
        onClick={() => onViewChange('player')}
        className={`flex min-h-[44px] items-center justify-center gap-2 rounded px-4 text-sm font-semibold ${
          view === 'player' ? 'bg-nvssGreenAction text-nvssSurface' : 'text-nvssMuted hover:text-nvssText'
        }`}
      >
        <User size={18} />
        Player
      </button>
    </div>
  )
}
