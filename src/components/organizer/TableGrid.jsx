import React from 'react'
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { deriveMatchStatus, getMatchPlayers, getSetScore } from '../../utils/tournament'

const statusLabels = {
  scheduled: 'Ieplānots',
  in_progress: 'Notiek',
  disputed: 'Strīds',
  completed: 'Pabeigts',
  awaiting_confirmation: 'Gaida apstiprinājumu',
  verified: 'Apstiprināts',
}

export function TableGrid({ tournament, matches, onClearAlert, headerContent = null, titleActions = null }) {
  if (matches.length === 0) {
    return (
      <section className="rounded-md border border-dashed border-nvssBorder bg-nvssSurface p-6 text-sm text-nvssMuted">
        Nav aktīvu kārtas galdu. Reģistrācijas turnīrs ir izveidots.
      </section>
    )
  }

  return (
    <section className="w-full overflow-hidden rounded-md border border-nvssBorder bg-nvssSurface">
      <div className="border-b border-nvssBorder px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Aktīvā kārta</h3>
      </div>
      {headerContent || titleActions ? (
        <div className="border-b border-nvssBorder">
          {headerContent}
          {titleActions ? <div className="px-4 py-3">{titleActions}</div> : null}
        </div>
      ) : null}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-full table-fixed text-left text-sm">
          <colgroup>
            <col className="w-20" />
            <col className="w-[30%]" />
            <col className="w-[30%]" />
            <col className="w-24" />
            <col className="w-56" />
          </colgroup>
          <thead className="bg-nvssBg text-left text-xs uppercase tracking-[0.12em] text-nvssMuted">
            <tr className="text-left">
              <th className="px-4 py-3 !text-left font-semibold" style={{ textAlign: 'left' }}>Galds</th>
              <th className="px-4 py-3 !text-left font-semibold" style={{ textAlign: 'left' }}>Spēlētājs A</th>
              <th className="px-4 py-3 !text-left font-semibold" style={{ textAlign: 'left' }}>Spēlētājs B</th>
              <th className="px-4 py-3 !text-left font-semibold" style={{ textAlign: 'left' }}>Rezultāts</th>
              <th className="px-4 py-3 !text-left font-semibold" style={{ textAlign: 'left' }}>Statuss</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => {
              const { playerA, playerB } = getMatchPlayers(match, tournament.players)
              const status = deriveMatchStatus(match)
              const isDisputed = status === 'disputed'
              const scoreA = getSetScore(match, match.playerAId)
              const scoreB = getSetScore(match, match.playerBId)

              return (
                <tr
                  key={match.id}
                  className={`border-t border-nvssBorder align-top ${isDisputed ? 'bg-nvssAlert/10' : 'hover:bg-nvssBg/60'}`}
                >
                  <td className="px-4 py-3">
                    <div className="text-lg font-black text-white">{match.table}</div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="truncate font-semibold text-white">{playerA?.name || 'TBD'}</p>
                    <p className="truncate text-xs text-nvssMuted">{playerA?.representation || 'Gaida spēlētāju'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="truncate font-semibold text-white">{playerB?.name || 'TBD'}</p>
                    <p className="truncate text-xs text-nvssMuted">{playerB?.representation || 'Gaida spēlētāju'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-base font-bold text-white">
                      {scoreA} : {scoreB}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={status} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function StatusBadge({ status }) {
  const classes = {
    scheduled: 'text-nvssMuted border-nvssBorder',
    in_progress: 'text-nvssGreen border-nvssGreen',
    disputed: 'text-nvssAlert border-nvssAlert',
    completed: 'text-slate-300 border-nvssBorder',
    awaiting_confirmation: 'text-nvssBlue border-nvssBlue',
    verified: 'text-nvssGreen border-nvssBorder',
  }
  const Icon = status === 'disputed' ? AlertTriangle : status === 'verified' ? CheckCircle2 : Clock

  return (
    <span className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs font-semibold ${classes[status]}`}>
      <Icon size={14} className={status === 'in_progress' ? 'animate-pulse' : ''} />
      {statusLabels[status]}
    </span>
  )
}
