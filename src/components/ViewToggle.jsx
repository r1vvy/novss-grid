import React from 'react'
import { Grid3X3, User } from 'lucide-react'

export function ViewToggle({ view, onViewChange }) {
  return (
    <div className="grid grid-cols-2 rounded-md border border-nvssBorder bg-nvssBg p-1">
      <button
        type="button"
        onClick={() => onViewChange('organizer')}
        className={`flex min-h-[44px] items-center justify-center gap-2 rounded px-4 text-sm font-semibold ${
          view === 'organizer' ? 'bg-nvssGreenAction text-white' : 'text-nvssMuted hover:text-white'
        }`}
      >
        <Grid3X3 size={18} />
        Organizer
      </button>
      <button
        type="button"
        onClick={() => onViewChange('player')}
        className={`flex min-h-[44px] items-center justify-center gap-2 rounded px-4 text-sm font-semibold ${
          view === 'player' ? 'bg-nvssGreenAction text-white' : 'text-nvssMuted hover:text-white'
        }`}
      >
        <User size={18} />
        Player
      </button>
    </div>
  )
}
