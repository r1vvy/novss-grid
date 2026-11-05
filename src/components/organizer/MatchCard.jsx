import React, { useState } from 'react'
import { AlertTriangle, CheckCircle2, ChevronDown, Clock, History, Pencil, Search, Star } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { SwissExplanationPill } from '../common/SwissExplanationPill'
import { CalmDisputeBanner } from '../player/CalmDisputeBanner'
import {
  deriveMatchStatus,
  getAuditActorName,
  getMatchPerfectPlays,
  getMatchPlayers,
  getSetScore,
} from '../../utils/tournament'

const statusLabels = {
  scheduled: 'Ieplānots',
  in_progress: 'Notiek',
  disputed: 'Strīds',
  investigating: 'Izmeklē',
  awaiting_confirmation: 'Gaida apstiprinājumu',
  completed: 'Pabeigts',
}

export function MatchCard({ tournament, match, onClearAlert, onMarkInvestigating, onOpenOverride, onOpenWarning, dragProps = {} }) {
  const [showAudit, setShowAudit] = useState(false)
  const { playerA, playerB } = getMatchPlayers(match, tournament.players)
  const status = deriveMatchStatus(match, tournament.maxSetsPerMatch)
  const scoreA = getSetScore(match, match.playerAId)
  const scoreB = getSetScore(match, match.playerBId)
  const perfectA = getMatchPerfectPlays(match, match.playerAId)
  const perfectB = getMatchPerfectPlays(match, match.playerBId)
  const warningsA = (match.warnings || []).filter((w) => w.playerId === match.playerAId).length
  const warningsB = (match.warnings || []).filter((w) => w.playerId === match.playerBId).length
  const auditTrail = match.auditTrail || []
  const isDisputed = status === 'disputed'
  const isInvestigating = status === 'investigating'
  const canEditResult = status !== 'scheduled'
  const editLabel = getEditLabel(status)

  const cardBorder = isDisputed
    ? 'border-apple-red/40 ring-2 ring-apple-red/20'
    : isInvestigating
      ? 'border-apple-orange/40 ring-2 ring-apple-orange/20'
    : status === 'in_progress'
      ? 'border-apple-blue/30'
      : status === 'completed'
        ? 'border-apple-green/30'
      : 'border-black/[0.08]'

  return (
    <GlassCard
      as="article"
      elevation="subtle"
      className={`p-4 transition-all ${cardBorder}`}
      {...dragProps}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">Galds</span>
          <span className="font-mono text-3xl font-black tabular-nums leading-none text-[#1C1C1E]">{match.table}</span>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Algorithmic Swiss Pairing Explanation */}
      <SwissExplanationPill match={match} tournament={tournament} className="mt-2.5" />

      {isDisputed && (
        <CalmDisputeBanner
          match={match}
          onCancelDispute={() => onClearAlert(match.id)}
          className="mt-3"
        />
      )}

      {match.contestMeta?.reason && !isDisputed && (
        <div className="mt-2.5 rounded-xl border border-apple-red/25 bg-apple-red/10 px-3 py-2 text-xs font-semibold text-apple-red">
          <span className="font-bold">Strīds: </span>
          <span>{match.contestMeta.reason}</span>
        </div>
      )}

      <div className="mt-3.5 space-y-2.5 rounded-2xl border border-black/[0.04] bg-[#F2F2F7]/60 p-3">
        <PlayerLine name={playerA?.name || 'TBD'} club={playerA?.representation} score={scoreA} perfectPlays={perfectA} warnings={warningsA} />
        <div className="border-t border-black/[0.04]" />
        <PlayerLine name={playerB?.name || 'TBD'} club={playerB?.representation} score={scoreB} perfectPlays={perfectB} warnings={warningsB} />
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {isDisputed ? (
          <button
            type="button"
            onClick={() => onMarkInvestigating(match.id)}
            className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-apple-orange/30 bg-apple-orange/10 px-3 text-xs font-semibold text-apple-orange transition hover:bg-apple-orange/20 active:scale-[0.98]"
          >
            <Search size={14} strokeWidth={2.3} />
            <span>Marķēt kā izmeklē</span>
          </button>
        ) : null}
        {onOpenWarning ? (
          <button
            type="button"
            onClick={() => onOpenWarning(match)}
            className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-apple-orange/30 bg-apple-orange/10 px-3 text-xs font-semibold text-apple-orange transition hover:bg-apple-orange/20 active:scale-[0.98]"
            title="Izteikt brīdinājumu spēlētājam"
          >
            <AlertTriangle size={14} strokeWidth={2.3} />
            <span>Brīdinājums</span>
          </button>
        ) : null}
        {canEditResult ? (
          <button
            type="button"
            onClick={() => onOpenOverride(match)}
            className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-apple-blue/20 bg-apple-blue/10 px-3 text-xs font-semibold text-apple-blue transition hover:bg-apple-blue/20 active:scale-[0.98]"
          >
            <Pencil size={14} strokeWidth={2.3} />
            <span>{editLabel}</span>
          </button>
        ) : null}
      </div>

      {isDisputed ? (
        <div className="mt-3 flex items-center justify-end border-t border-black/[0.06] pt-2.5">
          <button
            type="button"
            onClick={() => onClearAlert(match.id)}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-apple-red/30 px-3 py-1.5 text-xs font-semibold text-apple-red transition hover:bg-apple-red hover:text-white active:scale-95"
          >
            Noņemt brīdinājumu
          </button>
        </div>
      ) : null}

      {/* Audit Trail & Player-Made Actions Disclosure */}
      <div className="mt-3.5 border-t border-black/[0.06] pt-2">
        <button
          type="button"
          onClick={() => setShowAudit(!showAudit)}
          className="flex min-h-[44px] w-full items-center justify-between rounded-xl px-2 text-xs font-semibold text-[#636366] transition hover:bg-black/[0.03] active:bg-black/[0.06]"
          aria-expanded={showAudit}
          aria-label="Pārslēgt audita žurnālu"
        >
          <div className="flex items-center gap-1.5">
            <History size={14} className="text-[#8E8E93]" />
            <span>Audita žurnāls</span>
            {auditTrail.length > 0 && (
              <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-[10px] font-bold tabular-nums text-[#1C1C1E]">
                {auditTrail.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#8E8E93]">
            {auditTrail.length > 0 && !showAudit && (
              <span className="truncate max-w-[130px] font-normal text-right">
                {auditTrail[auditTrail.length - 1].message}
              </span>
            )}
            <ChevronDown size={14} className={`transition-transform duration-200 ${showAudit ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {showAudit && (
          <div className="mt-2 space-y-1.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7]/70 p-2.5">
            {auditTrail.length === 0 ? (
              <p className="text-center text-[11px] text-[#8E8E93] py-2">Nav reģistrētu darbību</p>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-0.5">
                {[...auditTrail].reverse().map((entry) => {
                  const actorName = getAuditActorName(entry.actor, tournament.players)
                  const isPlayer = entry.actorRole === 'player'
                  const isWarning = entry.type === 'player_warning'
                  const isReferee = entry.actorRole === 'referee' || isWarning || entry.type === 'referee_decision'
                  return (
                    <div
                      key={entry.id}
                      className={`rounded-lg border p-2 text-[11px] shadow-2xs ${
                        isWarning
                          ? 'border-apple-orange/30 bg-apple-orange/[0.06]'
                          : 'border-black/[0.04] bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 text-[#8E8E93]">
                        <span className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          isWarning
                            ? 'bg-apple-orange/20 text-apple-orange'
                            : isReferee
                              ? 'bg-apple-purple/15 text-apple-purple'
                              : isPlayer
                                ? 'bg-apple-blue/10 text-apple-blue'
                                : 'bg-black/[0.06] text-[#1C1C1E]'
                        }`}>
                          {isWarning ? '⚠️ Brīdinājums' : isReferee && actorName === 'referee' ? 'Tiesnesis' : actorName}
                        </span>
                        <span className="font-mono text-[10px] tabular-nums shrink-0">{entry.timestamp}</span>
                      </div>
                      <p className="mt-1 font-medium text-[#1C1C1E]">{entry.message}</p>
                      {((entry.addedTo && entry.addedTo.length > 0) || (entry.takenFrom && entry.takenFrom.length > 0)) && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5 pt-1 border-t border-black/[0.04]">
                          {entry.takenFrom?.map((item) => {
                            const name = getAuditActorName(item.playerId, tournament.players)
                            return (
                              <span
                                key={`taken-${item.playerId}`}
                                className="inline-flex items-center gap-1 rounded bg-apple-red/10 px-1.5 py-0.5 text-[10px] font-semibold text-apple-red"
                              >
                                <span>Noņemts no:</span>
                                <span className="font-bold">{name}</span>
                                <span className="font-mono tabular-nums">(-{item.count})</span>
                              </span>
                            )
                          })}
                          {entry.addedTo?.map((item) => {
                            const name = getAuditActorName(item.playerId, tournament.players)
                            return (
                              <span
                                key={`added-${item.playerId}`}
                                className="inline-flex items-center gap-1 rounded bg-apple-green/10 px-1.5 py-0.5 text-[10px] font-semibold text-apple-green"
                              >
                                <span>Pievienots:</span>
                                <span className="font-bold">{name}</span>
                                <span className="font-mono tabular-nums">(+{item.count})</span>
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  )
}

function getEditLabel(status) {
  if (status === 'disputed') return 'Atrisināt strīdu'
  if (status === 'investigating') return 'Ievadīt lēmumu'
  if (status === 'in_progress') return 'Pabeigt manuāli'
  if (status === 'awaiting_confirmation') return 'Labot rezultātu'
  return 'Koriģēt rezultātu'
}

function PlayerLine({ name, club, score, perfectPlays = 0, warnings = 0 }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-bold text-[#1C1C1E]">{name}</p>
          {perfectPlays > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              <Star size={10} className="fill-amber-500 text-amber-500" /> {perfectPlays}
            </span>
          )}
          {warnings > 0 && (
            <span
              title={`Spēlētājam izteikts ${warnings} brīdinājums(-i)`}
              className="inline-flex items-center gap-1 rounded-full border border-apple-orange/30 bg-apple-orange/15 px-2 py-0.5 text-[10px] font-bold text-apple-orange"
            >
              <AlertTriangle size={10} className="stroke-apple-orange" />
              <span>{warnings} {warnings === 1 ? 'brīdinājums' : 'brīdinājumi'}</span>
            </span>
          )}
        </div>
        <p className="truncate text-xs text-[#8E8E93]">{club || 'Gaida spēlētāju'}</p>
      </div>
      <span className="font-mono text-xl font-black tabular-nums text-[#1C1C1E]">{score}</span>
    </div>
  )
}

function StatusBadge({ status }) {
  const classes = {
    scheduled: 'text-[#8E8E93] border-black/[0.08] bg-black/[0.04]',
    in_progress: 'text-apple-blue border-apple-blue/20 bg-apple-blue/10',
    disputed: 'text-apple-red border-apple-red/25 bg-apple-red/10',
    investigating: 'text-apple-orange border-apple-orange/25 bg-apple-orange/10',
    awaiting_confirmation: 'text-apple-purple border-apple-purple/25 bg-apple-purple/10',
    completed: 'text-apple-green border-apple-green/20 bg-apple-green/10',
  }
  const Icon = status === 'disputed' ? AlertTriangle : status === 'investigating' ? Search : status === 'completed' ? CheckCircle2 : Clock
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${classes[status]}`}>
      <Icon size={12} strokeWidth={2.3} className={status === 'in_progress' ? 'animate-pulse text-apple-blue' : ''} />
      <span>{statusLabels[status]}</span>
    </span>
  )
}
