import React from 'react'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useLiveAnnouncements } from '../../hooks/useLiveAnnouncements'
import { GlassCard } from '../ui/GlassCard'

const TYPE_CONFIG = {
  info: {
    icon: Info,
    variant: 'accent',
    textColor: 'text-apple-blue',
    badgeClass: 'bg-apple-blue/10 text-apple-blue',
  },
  success: {
    icon: CheckCircle2,
    variant: 'success',
    textColor: 'text-apple-green',
    badgeClass: 'bg-apple-green/10 text-apple-green',
  },
  warning: {
    icon: AlertTriangle,
    variant: 'warning',
    textColor: 'text-amber-600',
    badgeClass: 'bg-amber-500/10 text-amber-600',
  },
  error: {
    icon: XCircle,
    variant: 'alert',
    textColor: 'text-apple-red',
    badgeClass: 'bg-apple-red/10 text-apple-red',
  },
}

export function LiveAnnouncer({ className = '' }) {
  const { currentAnnouncement, dismiss } = useLiveAnnouncements({ autoDismissTimeout: 4000 })

  return (
    <>
      {/* Invisible live region for screen readers (VoiceOver) */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {currentAnnouncement ? currentAnnouncement.message : ''}
      </div>

      {/* Visual floating Glass Toast */}
      {currentAnnouncement && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${className}`}
        >
          <GlassCard
            elevation="elevated"
            variant={TYPE_CONFIG[currentAnnouncement.type]?.variant || 'neutral'}
            className="flex items-center justify-between gap-3 p-3.5 shadow-apple-modal border border-white/90"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {(() => {
                const config = TYPE_CONFIG[currentAnnouncement.type] || TYPE_CONFIG.info
                const IconComponent = config.icon
                return (
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${config.badgeClass}`}>
                    <IconComponent size={16} strokeWidth={2.4} />
                  </div>
                )
              })()}
              <p className="truncate text-xs font-semibold text-[#1C1C1E]">
                {currentAnnouncement.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => dismiss(currentAnnouncement.id)}
              aria-label="Aizvērt paziņojumu"
              className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-[#8E8E93] hover:text-[#1C1C1E] active:scale-95 transition"
            >
              <X size={16} />
            </button>
          </GlassCard>
        </div>
      )}
    </>
  )
}

