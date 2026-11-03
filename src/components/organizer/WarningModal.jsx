import React, { useState } from 'react'
import { AlertTriangle, ShieldAlert, X } from 'lucide-react'
import { useModalDismiss } from '../../hooks/useModalDismiss'
import { getMatchPlayers, getMatchWarnings } from '../../utils/tournament'

const WARNING_REASONS = [
  'Noteikumu pārkāpums',
  'Aizkavēta spēle',
  'Nesportiska rīcība',
  'Nepareizs sitiens',
  'Borta pārkāpums',
  'Cits',
]

export function WarningModal({
  tournament,
  match,
  onClose,
  onSubmit,
}) {
  const modalDismiss = useModalDismiss(Boolean(match), onClose)
  const { playerA, playerB } = getMatchPlayers(match, tournament?.players || [])

  const [selectedPlayerId, setSelectedPlayerId] = useState(match?.playerAId || '')
  const [reason, setReason] = useState(WARNING_REASONS[0])
  const [note, setNote] = useState('')

  if (!match) return null

  const warningsA = getMatchWarnings(match, match.playerAId)
  const warningsB = getMatchWarnings(match, match.playerBId)

  function handleSubmit(e) {
    e?.preventDefault()
    if (!selectedPlayerId) return

    onSubmit(selectedPlayerId, {
      reason,
      note: note.trim(),
      issuedBy: 'Tiesnesis',
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="warning-modal-title"
      onMouseDown={modalDismiss.onBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4 py-6"
    >
      <div className="flex max-h-[calc(100vh-48px)] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/85 bg-white/85 backdrop-blur-3xl shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_25px_65px_rgba(0,0,0,0.2)]">
        {/* Header */}
        <div className="border-b border-black/[0.06] px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-apple-orange/15 text-apple-orange">
                <ShieldAlert size={20} strokeWidth={2.3} />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-apple-orange">Tiesneša lēmums</span>
                <h3 id="warning-modal-title" className="text-lg font-bold tracking-tight text-[#1C1C1E]">
                  Izteikt brīdinājumu spēlētājam
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Aizvērt"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/[0.06] text-[#636366] transition hover:bg-black/[0.1] active:scale-95"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-black/[0.06] px-2.5 py-0.5 font-mono text-xs font-bold text-[#1C1C1E]">
              Galds {match.table}
            </span>
            <span className="text-xs text-[#8E8E93]">
              {playerA?.name || 'TBD'} pret {playerB?.name || 'TBD'}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Player Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#636366] mb-2">
              Izvēlieties spēlētāju <span className="text-apple-red">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedPlayerId(match.playerAId)}
                className={`flex min-h-[52px] flex-col justify-center rounded-2xl border p-3 text-left transition-all ${
                  selectedPlayerId === match.playerAId
                    ? 'border-apple-orange bg-apple-orange/10 ring-2 ring-apple-orange/30 shadow-apple-sm'
                    : 'border-black/[0.08] bg-[#F2F2F7]/50 hover:bg-[#F2F2F7]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-[#1C1C1E] truncate">{playerA?.name || 'Spēlētājs A'}</span>
                  {warningsA.length > 0 && (
                    <span className="rounded-full bg-apple-orange/20 px-1.5 py-0.5 text-[10px] font-bold text-apple-orange">
                      {warningsA.length} ⚠️
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#8E8E93] truncate">{playerA?.representation || 'Nav kluba'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlayerId(match.playerBId)}
                className={`flex min-h-[52px] flex-col justify-center rounded-2xl border p-3 text-left transition-all ${
                  selectedPlayerId === match.playerBId
                    ? 'border-apple-orange bg-apple-orange/10 ring-2 ring-apple-orange/30 shadow-apple-sm'
                    : 'border-black/[0.08] bg-[#F2F2F7]/50 hover:bg-[#F2F2F7]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-[#1C1C1E] truncate">{playerB?.name || 'Spēlētājs B'}</span>
                  {warningsB.length > 0 && (
                    <span className="rounded-full bg-apple-orange/20 px-1.5 py-0.5 text-[10px] font-bold text-apple-orange">
                      {warningsB.length} ⚠️
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#8E8E93] truncate">{playerB?.representation || 'Nav kluba'}</span>
              </button>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#636366] mb-2">
              Brīdinājuma iemesls <span className="text-apple-red">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {WARNING_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`min-h-[38px] rounded-xl px-3 text-xs font-semibold transition-all ${
                    reason === r
                      ? 'bg-apple-orange text-white shadow-2xs'
                      : 'border border-black/[0.08] bg-[#F2F2F7] text-[#1C1C1E] hover:bg-black/[0.06]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-black/[0.1] bg-[#F2F2F7] px-3.5 text-sm font-medium text-[#1C1C1E] transition focus:bg-white focus:border-apple-orange focus:ring-4 focus:ring-apple-orange/20"
            >
              {WARNING_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Note Input */}
          <div>
            <label htmlFor="warning-note" className="block text-xs font-bold uppercase tracking-wider text-[#636366] mb-1.5">
              Paskaidrojums vai piezīme auditam
            </label>
            <textarea
              id="warning-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Piem., Pārkāpta sitiena pozīcija un traucēts pretinieks..."
              className="w-full rounded-xl border border-black/[0.1] bg-[#F2F2F7] p-3 text-sm text-[#1C1C1E] transition placeholder:text-[#8E8E93] focus:bg-white focus:border-apple-orange focus:ring-4 focus:ring-apple-orange/20"
            />
            <p className="mt-1 text-[11px] text-[#8E8E93]">
              Brīdinājums tiks fiksēts mača audita žurnālā un uzrādīts spēlētājam.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-black/[0.06] bg-white px-6 py-4">
          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] rounded-xl border border-black/[0.08] bg-black/[0.03] px-4 text-xs font-semibold text-[#1C1C1E] transition hover:bg-black/[0.06] active:scale-[0.98]"
            >
              Atcelt
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedPlayerId}
              className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-apple-orange px-5 text-xs font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-black/[0.06] disabled:text-apple-tertiary"
            >
              <AlertTriangle size={15} strokeWidth={2.3} />
              <span>Piešķirt brīdinājumu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
