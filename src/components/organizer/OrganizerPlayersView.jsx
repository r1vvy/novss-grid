import React, { useMemo, useState } from 'react'
import { Eye, EyeOff, KeyRound, PencilLine, Save, Search, SquarePen, Users } from 'lucide-react'

const emptyDraft = {
  name: '',
  representation: '',
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
    <main className="mx-auto max-w-[1800px] space-y-4 px-3 py-4">
      <header className="rounded-md border border-nvssBorder bg-nvssSurface p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-nvssMuted">{tournament.venue} · {tournament.updatedAt}</p>
            <h2 className="mt-1 text-2xl font-semibold">Reģistrētie spēlētāji</h2>
            <p className="mt-1 text-sm text-nvssMuted">Pārskati un rediģē spēlētāju vārdus, pārstāvniecību, statusu un pieslēgšanās kodus.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onBack}
              className="min-h-[40px] rounded border border-nvssBorder bg-nvssBg px-3 text-sm font-semibold text-nvssMuted hover:text-white"
            >
              Atpakaļ uz turnīru
            </button>
            <div className="inline-flex min-h-[40px] items-center gap-2 rounded border border-nvssBorder bg-nvssBg px-3 text-sm font-semibold text-white">
              <Users size={16} className="text-nvssGreen" />
              {registeredPlayersCount} / {tournament.players.length}
            </div>
          </div>
        </div>
      </header>

      <section className="rounded-md border border-nvssBorder bg-nvssSurface p-4">
        <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-nvssMuted">
          Meklēt pēc vārda un uzvārda
          <div className="relative mt-2">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-nvssMuted" />
            <input
              type="search"
              value={playerSearch}
              onChange={(event) => setPlayerSearch(event.target.value)}
              placeholder="Anna Kalnina"
              className="min-h-[46px] w-full rounded border border-nvssBorder bg-nvssBg pl-10 pr-3 text-white"
            />
          </div>
        </label>
      </section>

      <section className="overflow-hidden rounded-md border border-nvssBorder bg-nvssSurface">
        <div className="border-b border-nvssBorder px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <SquarePen size={16} className="text-nvssGreen" />
            Spēlētāju saraksts
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-nvssBg text-xs uppercase tracking-[0.12em] text-nvssMuted">
              <tr>
                <th className="px-4 py-3 font-semibold">Spēlētājs</th>
                <th className="px-4 py-3 font-semibold">Pārstāvniecība</th>
                <th className="px-4 py-3 font-semibold">Statuss</th>
                <th className="px-4 py-3 font-semibold">Pieslēgšanās kods</th>
                <th className="px-4 py-3 text-right font-semibold">Darbības</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player) => {
                const isEditing = editingPlayerId === player.id
                const isCodeVisible = Boolean(visibleCodes[player.id])

                return (
                  <tr key={player.id} className="border-t border-nvssBorder align-top hover:bg-nvssBg/50">
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          value={draft.name}
                          onChange={(event) => updateDraft('name', event.target.value)}
                          className="min-h-[42px] w-full rounded border border-nvssBorder bg-nvssBg px-3 text-white"
                        />
                      ) : (
                        <div>
                          <div className="font-semibold text-white">{player.name}</div>
                          <div className="text-xs text-nvssMuted">{player.id}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          value={draft.representation}
                          onChange={(event) => updateDraft('representation', event.target.value)}
                          className="min-h-[42px] w-full rounded border border-nvssBorder bg-nvssBg px-3 text-white"
                        />
                      ) : (
                        <span className="text-white">{player.representation || '-'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={draft.status}
                          onChange={(event) => updateDraft('status', event.target.value)}
                          className="min-h-[42px] w-full rounded border border-nvssBorder bg-nvssBg px-3 text-white"
                        >
                          <option value="checked_in">Reģistrēts</option>
                          <option value="absent">Nav ieradies</option>
                        </select>
                      ) : (
                        <span className={`inline-flex rounded border px-2 py-1 text-xs font-semibold ${player.status === 'checked_in' ? 'border-nvssGreen text-nvssGreen' : 'border-nvssBorder text-nvssMuted'}`}>
                          {player.status === 'checked_in' ? 'Reģistrēts' : 'Nav ieradies'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="relative">
                          <KeyRound size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-nvssMuted" />
                          <input
                            value={draft.registrationCode}
                            onChange={(event) => updateDraft('registrationCode', event.target.value)}
                            className="min-h-[42px] w-full rounded border border-nvssBorder bg-nvssBg pl-10 pr-3 text-white"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <code className="min-w-[96px] rounded bg-nvssBg px-2 py-1 text-sm font-semibold text-nvssGreen">
                            {isCodeVisible ? player.registrationCode : '••••••'}
                          </code>
                          <button
                            type="button"
                            onClick={() => toggleCodeVisibility(player.id)}
                            className="inline-flex size-9 items-center justify-center rounded border border-nvssBorder bg-nvssBg text-nvssMuted hover:text-white"
                            aria-label={isCodeVisible ? 'Paslēpt kodu' : 'Parādīt kodu'}
                            title={isCodeVisible ? 'Paslēpt kodu' : 'Parādīt kodu'}
                          >
                            {isCodeVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              className="min-h-[40px] rounded border border-nvssBorder px-3 text-sm font-semibold text-nvssMuted hover:text-white"
                            >
                              Atcelt
                            </button>
                            <button
                              type="button"
                              onClick={() => savePlayer(player.id)}
                              className="inline-flex min-h-[40px] items-center gap-2 rounded bg-nvssGreenAction px-3 text-sm font-semibold text-white"
                            >
                              <Save size={16} />
                              Saglabāt
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEditing(player)}
                            className="inline-flex min-h-[40px] items-center gap-2 rounded border border-nvssBorder bg-nvssBg px-3 text-sm font-semibold text-nvssMuted hover:text-white"
                          >
                            <PencilLine size={16} />
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
          <div className="border-t border-nvssBorder px-4 py-6 text-sm text-nvssMuted">
            Nevienu spēlētāju ar tādu vārdu neizdevās atrast.
          </div>
        ) : null}
      </section>
    </main>
  )
}
