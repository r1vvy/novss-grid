import React, { useMemo, useState } from 'react'
import { Eye, EyeOff, KeyRound, PencilLine, Save, Search, SquarePen, Users, ChevronLeft, X } from 'lucide-react'

const emptyDraft = {
  name: '',
  representation: '',
  rating: '',
  gender: '',
  registrationCode: '',
  status: 'checked_in',
}

export function OrganizerPlayersView({ tournament, onBack, onSavePlayer }) {
  const [playerSearch, setPlayerSearch] = useState('')
  const [editingPlayerId, setEditingPlayerId] = useState(null)
  const [visibleCodes, setVisibleCodes] = useState({})
  const [draft, setDraft] = useState(emptyDraft)

  const normalizedPlayerSearch = playerSearch.trim().toLowerCase()
  const registeredPlayersCount = useMemo(
    () => tournament.players.filter((player) => player.status === 'checked_in').length,
    [tournament.players],
  )
  const filteredPlayers = useMemo(() => {
    if (!normalizedPlayerSearch) return tournament.players

    return tournament.players.filter((player) => player.name.toLowerCase().includes(normalizedPlayerSearch))
  }, [normalizedPlayerSearch, tournament.players])

  function startEditing(player) {
    setEditingPlayerId(player.id)
    setDraft({
      name: player.name,
      representation: player.representation || '',
      rating: player.rating ?? '',
      gender: player.gender || '',
      registrationCode: player.registrationCode,
      status: player.status,
    })
  }

  function cancelEditing() {
    setEditingPlayerId(null)
    setDraft(emptyDraft)
  }

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function toggleCodeVisibility(playerId) {
    setVisibleCodes((current) => ({ ...current, [playerId]: !current[playerId] }))
  }

  function savePlayer(playerId) {
    onSavePlayer(playerId, draft)
    cancelEditing()
  }

  return (
    <main className="mx-auto max-w-[1700px] space-y-5 px-4 py-6">
      <header className="rounded-2xl border border-black/[0.08] bg-white p-5 sm:p-6 shadow-apple-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#8E8E93]">
              <span>{tournament.venue}</span>
              <span>·</span>
              <span>{tournament.updatedAt}</span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1C1E]">Reģistrētie spēlētāji</h2>
            <p className="mt-1 text-xs text-[#8E8E93]">Pārskatiet dalībnieku sarakstu, statusu un piešķirtos pieslēgšanās kodus.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-black/[0.08] bg-black/[0.03] px-3.5 text-xs font-semibold text-slate-700 shadow-apple-subtle transition hover:bg-black/[0.06] active:scale-[0.98]"
            >
              <ChevronLeft size={16} strokeWidth={2.3} />
              Atpakaļ uz vadības paneli
            </button>
            <div className="inline-flex min-h-[38px] items-center gap-2 rounded-xl border border-apple-blue/20 bg-apple-blue/10 px-3.5 text-xs font-semibold text-apple-blue">
              <Users size={15} strokeWidth={2.3} />
              <span className="tabular-nums">{registeredPlayersCount} no {tournament.players.length} reģistrēti</span>
            </div>
          </div>
        </div>
      </header>

      {/* Apple Spotlight Style Search Field */}
      <section className="rounded-2xl border border-black/[0.08] bg-white p-4 shadow-apple-card">
        <div className="relative">
          <Search size={16} strokeWidth={2.2} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={playerSearch}
            onChange={(event) => setPlayerSearch(event.target.value)}
            placeholder="Meklēt pēc vārda vai uzvārda..."
            className="min-h-[44px] w-full rounded-xl border border-black/[0.08] bg-[#F2F2F7] pl-10 pr-10 text-sm font-medium text-[#1C1C1E] transition focus:bg-white focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/20"
          />
          {playerSearch && (
            <button
              type="button"
              onClick={() => setPlayerSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </section>

      {/* Players List Table */}
      <section className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-apple-card">
        <div className="border-b border-black/[0.06] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1C1C1E]">
            <SquarePen size={16} className="text-apple-blue" strokeWidth={2.3} />
            <span>Spēlētāju saraksts</span>
          </div>
          <span className="text-xs text-[#8E8E93] tabular-nums">Rāda {filteredPlayers.length} dalībniekus</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-black/[0.06] bg-[#F2F2F7]/70 text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">
              <tr>
                <th className="px-5 py-3">Spēlētājs</th>
                <th className="px-4 py-3">Pārstāvniecība</th>
                <th className="px-4 py-3">Reitings</th>
                <th className="px-4 py-3">Dzimums</th>
                <th className="px-4 py-3">Statuss</th>
                <th className="px-4 py-3">Pieslēgšanās kods</th>
                <th className="px-5 py-3 text-right">Darbības</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05]">
              {filteredPlayers.map((player) => {
                const isEditing = editingPlayerId === player.id
                const isCodeVisible = Boolean(visibleCodes[player.id])

                return (
                  <tr key={player.id} className="transition-colors hover:bg-slate-500/[0.02] align-middle">
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <input
                          value={draft.name}
                          onChange={(event) => updateDraft('name', event.target.value)}
                          className="min-h-[38px] w-full rounded-lg border border-black/[0.1] bg-white px-3 text-sm font-medium text-[#1C1C1E] focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20"
                        />
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-apple-blue/10 text-xs font-bold text-apple-blue">
                            {player.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[#1C1C1E]">{player.name}</div>
                            <div className="font-mono text-[10px] text-[#8E8E93]">{player.id}</div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {isEditing ? (
                        <input
                          value={draft.representation}
                          onChange={(event) => updateDraft('representation', event.target.value)}
                          className="min-h-[38px] w-full rounded-lg border border-black/[0.1] bg-white px-3 text-sm font-medium text-[#1C1C1E] focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20"
                        />
                      ) : (
                        <span className="text-slate-700">{player.representation || '—'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={draft.rating}
                          onChange={(event) => updateDraft('rating', event.target.value)}
                          className="min-h-[38px] w-24 rounded-lg border border-black/[0.1] bg-white px-3 font-mono text-sm font-semibold text-[#1C1C1E] focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20"
                        />
                      ) : (
                        <span className="font-mono tabular-nums text-slate-700">{player.rating ?? '—'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {isEditing ? (
                        <select
                          value={draft.gender}
                          onChange={(event) => updateDraft('gender', event.target.value)}
                          className="min-h-[38px] rounded-lg border border-black/[0.1] bg-white px-2.5 text-sm text-[#1C1C1E] focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20"
                        >
                          <option value="">Nav norādīts</option>
                          <option value="female">Sieviete</option>
                          <option value="male">Vīrietis</option>
                        </select>
                      ) : (
                        <span className="text-slate-700">{formatGender(player.gender)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {isEditing ? (
                        <select
                          value={draft.status}
                          onChange={(event) => updateDraft('status', event.target.value)}
                          className="min-h-[38px] rounded-lg border border-black/[0.1] bg-white px-2.5 text-sm text-[#1C1C1E] focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20"
                        >
                          <option value="checked_in">Reģistrēts</option>
                          <option value="absent">Nav ieradies</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          player.status === 'checked_in'
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700'
                            : 'border-black/[0.08] bg-black/[0.04] text-[#8E8E93]'
                        }`}>
                          <span className={`size-1.5 rounded-full ${player.status === 'checked_in' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {player.status === 'checked_in' ? 'Reģistrēts' : 'Nav ieradies'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {isEditing ? (
                        <div className="relative">
                          <KeyRound size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            value={draft.registrationCode}
                            onChange={(event) => updateDraft('registrationCode', event.target.value.toUpperCase())}
                            className="min-h-[38px] w-full rounded-lg border border-black/[0.1] bg-white pl-9 pr-3 font-mono text-sm font-bold uppercase tracking-wider text-[#1C1C1E] focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <code className="min-w-[84px] rounded-lg border border-apple-blue/20 bg-apple-blue/10 px-2.5 py-1 text-center font-mono text-xs font-bold tracking-wider text-apple-blue">
                            {isCodeVisible ? player.registrationCode : '••••••'}
                          </code>
                          <button
                            type="button"
                            onClick={() => toggleCodeVisibility(player.id)}
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-black/[0.08] bg-black/[0.02] text-slate-500 transition hover:bg-black/[0.06] active:scale-95"
                            aria-label={isCodeVisible ? 'Paslēpt kodu' : 'Parādīt kodu'}
                            title={isCodeVisible ? 'Paslēpt kodu' : 'Parādīt kodu'}
                          >
                            {isCodeVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              className="min-h-[34px] rounded-lg border border-black/[0.08] bg-black/[0.02] px-3 text-xs font-semibold text-slate-700 transition hover:bg-black/[0.06] active:scale-95"
                            >
                              Atcelt
                            </button>
                            <button
                              type="button"
                              onClick={() => savePlayer(player.id)}
                              className="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg bg-apple-blue px-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-apple-blueHover active:scale-95"
                            >
                              <Save size={14} strokeWidth={2.3} />
                              Saglabāt
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEditing(player)}
                            className="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border border-black/[0.08] bg-black/[0.02] px-3 text-xs font-semibold text-slate-700 transition hover:bg-black/[0.06] active:scale-95"
                          >
                            <PencilLine size={14} strokeWidth={2.2} />
                            Rediģēt
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredPlayers.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#8E8E93]">
            Neviens spēlētājs ar vārdu “{playerSearch}” netika atrasts.
          </div>
        ) : null}
      </section>
    </main>
  )
}

function formatGender(gender) {
  if (gender === 'female') return 'Sieviete'
  if (gender === 'male') return 'Vīrietis'
  return '—'
}
