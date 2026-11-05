import React, { useState } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'
import { useSwissExplainer } from '../../hooks/useSwissExplainer'
import { triggerHaptic } from '../../utils/haptics'

export function SwissExplanationPill({ match, tournament, className = '', defaultExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const explanation = useSwissExplainer(match, tournament)

  if (!explanation || !explanation.summary) return null

  function toggleExpand() {
    triggerHaptic('light')
    setIsExpanded((prev) => !prev)
  }

  return (
    <div className={`group rounded-xl border border-indigo-500/20 bg-indigo-50/50 backdrop-blur-md transition-all duration-200 ${className}`}>
      <button
        type="button"
        onClick={toggleExpand}
        aria-expanded={isExpanded}
        aria-label="Šveices sistēmas pāra skaidrojums"
        className="flex min-h-[44px] w-full items-center justify-between gap-2.5 px-3 py-2 text-left text-xs transition hover:bg-indigo-50/80 active:scale-[0.99] rounded-xl"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex size-5 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-600">
            <Sparkles size={12} strokeWidth={2.4} />
          </div>
          <span className="truncate font-medium text-indigo-950">
            {explanation.summary}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 text-indigo-500">
          <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-wider">
            {isExpanded ? 'Mazāk' : 'Algoritms'}
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-indigo-500/15 px-3.5 py-2.5 text-xs text-indigo-900/80 bg-white/60 rounded-b-xl space-y-1">
          <p className="font-semibold text-indigo-950">{explanation.headline}</p>
          <p className="text-[11px] leading-relaxed">{explanation.details}</p>
        </div>
      )}
    </div>
  )
}

