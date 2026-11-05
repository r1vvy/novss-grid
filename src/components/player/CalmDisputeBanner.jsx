import React from 'react'
import { ShieldCheck, Undo2 } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { triggerHaptic } from '../../utils/haptics'

export function CalmDisputeBanner({
  match,
  playerId,
  onCancelDispute,
  className = '',
}) {
  const isCaller = match?.refereeRequestedBy === playerId
  const reason = match?.contestMeta?.reason

  function handleCancel() {
    triggerHaptic('selection')
    if (onCancelDispute) {
      onCancelDispute(match.id, playerId)
    }
  }

  return (
    <GlassCard
      elevation="subtle"
      variant="warning"
      className={`p-4 sm:p-5 border-amber-500/30 bg-amber-500/[0.06] ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 shadow-inner">
          <ShieldCheck size={20} strokeWidth={2.4} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-amber-950">
              Tiesnesis ir informēts un dodas uz jūsu galdu
            </h4>
            <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wide">
              {isCaller ? 'Jūsu izsaukums' : 'Izsaukts tiesnesis'}
            </span>
          </div>

          <p className="mt-1.5 text-xs font-medium text-amber-900/80 leading-relaxed">
            Lūgums neaiztikt kauliņus un saglabāt galda stāvokli nemainīgu līdz tiesneša klātbūtnei.
          </p>

          {reason && (
            <div className="mt-2.5 rounded-xl border border-amber-500/20 bg-white/70 px-3 py-1.5 text-xs text-amber-900">
              <span className="font-semibold text-amber-950">Iemesls: </span>
              <span>{reason}</span>
            </div>
          )}

          {isCaller && onCancelDispute && (
            <div className="mt-3.5 flex justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-amber-600/30 bg-white/90 px-3.5 text-xs font-semibold text-amber-900 shadow-sm transition hover:bg-white active:scale-[0.98]"
              >
                <Undo2 size={15} strokeWidth={2.2} />
                <span>Atsaukt tiesneša izsaukumu</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  )
}

