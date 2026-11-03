import React from 'react'
import { AlertTriangle, CheckCircle2, Clock, Pencil, RotateCcw, Search, ShieldCheck } from 'lucide-react'
import { deriveMatchStatus, getCurrentRoundMatches, getMatchPlayers, getSetScore } from '../../utils/tournament'

export function AlertRail({
  tournament,
  alerts = [],
  investigations,
  onMarkInvestigating,
  onResetInvestigation,
  onOpenOverride,
  onOpenWarning,
  onClearAlert,
}) {
  const players = tournament?.players || []
  const maxSets = tournament?.maxSetsPerMatch

  // Determine active investigations
  const derivedInvestigating = investigations !== undefined
    ? investigations
    : alerts.some((m) => deriveMatchStatus(m, maxSets) === 'investigating')
      ? alerts.filter((m) => deriveMatchStatus(m, maxSets) === 'investigating')
      : (tournament ? getCurrentRoundMatches(tournament).filter((m) => deriveMatchStatus(m, maxSets) === 'investigating') : [])

  const investigatingMatches = derivedInvestigating || []

  // Determine disputed alerts (excluding investigating)
  const disputedMatches = alerts.filter(
    (m) => deriveMatchStatus(m, maxSets) !== 'investigating'
  )

  const hasDisputed = disputedMatches.length > 0
  const hasInvestigating = investigatingMatches.length > 0
  const hasItems = hasDisputed || hasInvestigating

  const renderDisputedMatch = (match) => {
    const { playerA, playerB } = getMatchPlayers(match, players)
    const scoreA = getSetScore(match, match.playerAId)
    const scoreB = getSetScore(match, match.playerBId)
    const hasScores = (match.setResults && match.setResults.length > 0) || scoreA > 0 || scoreB > 0

    return (
      <div
        key={match.id}
        className="rounded-xl border border-apple-red/25 bg-apple-red/[0.04] p-3.5 transition-all hover:bg-apple-red/[0.07]"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-lg border border-apple-red/20 bg-apple-red/15 px-2.5 py-0.5 font-mono text-xs font-bold text-apple-red">
            Galds {match.table}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-apple-red">
            <span className="size-1.5 rounded-full bg-apple-red animate-pulse" />
            Nepieciešama palīdzība
          </span>
        </div>

        <div className="mt-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs font-bold text-[#1C1C1E]">
              {playerA?.name || 'TBD'} <span className="font-normal text-[#8E8E93]">pret</span> {playerB?.name || 'TBD'}
            </p>
            {hasScores && (
              <span className="font-mono text-xs font-bold tabular-nums text-[#1C1C1E]">
                {scoreA}:{scoreB}
              </span>
            )}
          </div>
          {playerA?.representation || playerB?.representation ? (
            <p className="mt-0.5 text-[10px] text-[#8E8E93] truncate">
              {[playerA?.representation, playerB?.representation].filter(Boolean).join(' · ')}
            </p>
          ) : null}
        </div>

        {match.contestMeta?.reason && (
          <div className="mt-2 rounded-lg border border-apple-red/20 bg-white/80 p-2 text-[11px] text-[#1C1C1E] shadow-2xs">
            <span className="font-semibold text-apple-red">Strīda iemesls: </span>
            <span className="font-medium text-[#1C1C1E]">{match.contestMeta.reason}</span>
          </div>
        )}

        {match.warnings?.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-apple-orange/20 bg-apple-orange/10 px-2 py-1 text-[11px] font-semibold text-apple-orange">
            <AlertTriangle size={12} strokeWidth={2.3} />
            <span>{match.warnings.length} {match.warnings.length === 1 ? 'brīdinājums' : 'brīdinājumi'}</span>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {onMarkInvestigating && (
            <button
              type="button"
              onClick={() => onMarkInvestigating(match.id)}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-apple-orange px-3 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98]"
            >
              <Search size={14} strokeWidth={2.3} />
              <span>Marķēt kā izmeklē</span>
            </button>
          )}

          {onOpenWarning && (
            <button
              type="button"
              onClick={() => onOpenWarning(match)}
              className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-apple-orange/30 bg-apple-orange/10 px-3 text-xs font-semibold text-apple-orange transition hover:bg-apple-orange/20 active:scale-[0.98]"
              title="Izteikt brīdinājumu spēlētājam"
            >
              <AlertTriangle size={14} strokeWidth={2.3} />
              <span>Brīdināt</span>
            </button>
          )}

          {onOpenOverride && (
            <button
              type="button"
              onClick={() => onOpenOverride(match)}
              className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-apple-blue/20 bg-apple-blue/10 px-3 text-xs font-semibold text-apple-blue transition hover:bg-apple-blue/20 active:scale-[0.98]"
            >
              <Pencil size={14} strokeWidth={2.3} />
              <span>Atrisināt</span>
            </button>
          )}
        </div>

        {onClearAlert && (
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => onClearAlert(match.id)}
              className="inline-flex min-h-[32px] items-center text-[11px] font-semibold text-[#8E8E93] hover:text-apple-red transition"
            >
              Noņemt brīdinājumu
            </button>
          </div>
        )}
      </div>
    )
  }

  const renderInvestigatingMatch = (match) => {
    const { playerA, playerB } = getMatchPlayers(match, players)
    const scoreA = getSetScore(match, match.playerAId)
    const scoreB = getSetScore(match, match.playerBId)
    const hasScores = (match.setResults && match.setResults.length > 0) || scoreA > 0 || scoreB > 0

    const investigationAudit = (match.auditTrail || [])
      .slice()
      .reverse()
      .find((entry) => entry.type === 'investigation_started' || entry.type?.includes('investigat'))

    return (
      <div
        key={match.id}
        className="rounded-xl border border-apple-orange/30 bg-apple-orange/[0.04] p-3.5 transition-all hover:bg-apple-orange/[0.07]"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-lg border border-apple-orange/25 bg-apple-orange/15 px-2.5 py-0.5 font-mono text-xs font-bold text-apple-orange">
            Galds {match.table}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-apple-orange">
            <span className="size-1.5 rounded-full bg-apple-orange animate-pulse" />
            Tiek izmeklēts
          </span>
        </div>

        <div className="mt-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs font-bold text-[#1C1C1E]">
              {playerA?.name || 'TBD'} <span className="font-normal text-[#8E8E93]">pret</span> {playerB?.name || 'TBD'}
            </p>
            {hasScores && (
              <span className="font-mono text-xs font-bold tabular-nums text-[#1C1C1E]">
                {scoreA}:{scoreB}
              </span>
            )}
          </div>
          {playerA?.representation || playerB?.representation ? (
            <p className="mt-0.5 text-[10px] text-[#8E8E93] truncate">
              {[playerA?.representation, playerB?.representation].filter(Boolean).join(' · ')}
            </p>
          ) : null}
        </div>

        {match.contestMeta?.reason && (
          <div className="mt-2 rounded-lg border border-apple-orange/20 bg-white/80 p-2 text-[11px] text-[#1C1C1E] shadow-2xs">
            <span className="font-semibold text-apple-orange">Strīda iemesls: </span>
            <span className="font-medium text-[#1C1C1E]">{match.contestMeta.reason}</span>
          </div>
        )}

        {match.warnings?.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-apple-orange/20 bg-apple-orange/10 px-2 py-1 text-[11px] font-semibold text-apple-orange">
            <AlertTriangle size={12} strokeWidth={2.3} />
            <span>{match.warnings.length} {match.warnings.length === 1 ? 'brīdinājums' : 'brīdinājumi'}</span>
          </div>
        )}

        {investigationAudit?.timestamp && (
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#8E8E93]">
            <Clock size={11} strokeWidth={2.2} />
            <span>Izmeklēšana uzsākta plkst. {investigationAudit.timestamp}</span>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {onOpenWarning && (
            <button
              type="button"
              onClick={() => onOpenWarning(match)}
              className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-apple-orange/30 bg-apple-orange/10 px-3 text-xs font-semibold text-apple-orange transition hover:bg-apple-orange/20 active:scale-[0.98]"
              title="Izteikt brīdinājumu spēlētājam"
            >
              <AlertTriangle size={14} strokeWidth={2.3} />
              <span>Brīdināt</span>
            </button>
          )}

          {onOpenOverride && (
            <button
              type="button"
              onClick={() => onOpenOverride(match)}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-apple-blue px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-apple-blueHover active:scale-[0.98]"
            >
              <Pencil size={14} strokeWidth={2.3} />
              <span>Ievadīt lēmumu</span>
            </button>
          )}

          {onResetInvestigation && (
            <button
              type="button"
              onClick={() => onResetInvestigation(match.id)}
              className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-black/[0.1] bg-black/[0.03] px-3 text-xs font-semibold text-[#1C1C1E] transition hover:bg-black/[0.06] active:scale-[0.98]"
              title="Atcelt izmeklēšanu un atsākt spēli"
            >
              <RotateCcw size={14} strokeWidth={2.3} />
              <span>Atsākt</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <section className="rounded-2xl border border-white/80 bg-white/65 p-4 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.95),0_12px_36px_rgba(0,0,0,0.04)] backdrop-blur-2xl">
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`flex size-7 items-center justify-center rounded-lg ${
              hasDisputed
                ? 'bg-apple-red/10 text-apple-red'
                : hasInvestigating
                  ? 'bg-apple-orange/10 text-apple-orange'
                  : 'bg-apple-green/10 text-apple-green'
            }`}
          >
            {hasDisputed ? (
              <AlertTriangle size={15} strokeWidth={2.3} />
            ) : hasInvestigating ? (
              <Search size={15} strokeWidth={2.3} />
            ) : (
              <ShieldCheck size={15} strokeWidth={2.3} />
            )}
          </div>
          <h3 className="text-sm font-bold tracking-tight text-[#1C1C1E]">Tiesneša izsaukumi</h3>
        </div>

        <div className="flex items-center gap-1.5">
          {hasDisputed && (
            <span
              title="Jauni tiesneša izsaukumi"
              className="rounded-full bg-apple-red px-2.5 py-0.5 text-xs font-bold tabular-nums text-white shadow-2xs"
            >
              {disputedMatches.length}
            </span>
          )}
          {hasInvestigating && (
            <span
              title="Aktīvas izmeklēšanas"
              className="inline-flex items-center gap-1 rounded-full border border-apple-orange/30 bg-apple-orange/15 px-2.5 py-0.5 text-xs font-bold tabular-nums text-apple-orange"
            >
              <Search size={11} strokeWidth={2.3} />
              <span>{investigatingMatches.length} izmeklē</span>
            </span>
          )}
          {!hasItems && (
            <span className="inline-flex items-center gap-1 rounded-full border border-apple-green/20 bg-apple-green/10 px-2.5 py-0.5 text-[11px] font-semibold text-apple-green">
              <CheckCircle2 size={12} strokeWidth={2.3} />
              Mierīgs
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {hasDisputed && hasInvestigating ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 px-0.5 text-[10px] font-bold uppercase tracking-wider text-apple-red">
                <span className="size-1.5 rounded-full bg-apple-red animate-pulse" />
                <span>Jauni izsaukumi ({disputedMatches.length})</span>
              </div>
              {disputedMatches.map(renderDisputedMatch)}
            </div>

            <div className="pt-2.5 space-y-2 border-t border-black/[0.06]">
              <div className="flex items-center gap-1.5 px-0.5 text-[10px] font-bold uppercase tracking-wider text-apple-orange">
                <span className="size-1.5 rounded-full bg-apple-orange animate-pulse" />
                <span>Aktīva izmeklēšana ({investigatingMatches.length})</span>
              </div>
              {investigatingMatches.map(renderInvestigatingMatch)}
            </div>
          </>
        ) : (
          <>
            {disputedMatches.map(renderDisputedMatch)}
            {investigatingMatches.map(renderInvestigatingMatch)}
          </>
        )}

        {!hasItems && (
          <div className="rounded-xl border border-dashed border-black/[0.08] bg-[#F2F2F7]/50 p-5 text-center">
            <div className="mx-auto flex size-9 items-center justify-center rounded-full bg-apple-green/10 text-apple-green mb-2">
              <CheckCircle2 size={18} strokeWidth={2.3} />
            </div>
            <p className="text-xs font-semibold text-[#1C1C1E]">Visi galdi mierīgi</p>
            <p className="mt-0.5 text-[11px] text-[#8E8E93]">Nav aktīvu tiesneša izsaukumu vai strīdu.</p>
          </div>
        )}
      </div>
    </section>
  )
}
