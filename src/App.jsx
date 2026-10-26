import React, { useEffect, useMemo, useState } from 'react'
import { ShieldCheck, UserRound } from 'lucide-react'
import { initialTournament } from './data/mockTournament'
import { AppShell } from './components/AppShell'
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard'
import { OrganizerPlayersView } from './components/organizer/OrganizerPlayersView'
import { PlayerView } from './components/player/PlayerView'
import {
  appendSetResult,
  checkInPlayerByCode,
  clearRefereeRequest,
  confirmFinalScore,
  createRegistrationTournament,
  forceOverrideResult,
  getPlayerById,
  markMatchInvestigating,
  resetMatchInvestigation,
  removeSetResult,
  requestReferee,
  swapMatchTables,
  updatePlayer,
} from './utils/tournament'

const SESSION_KEY = 'nvssgrid.playerId'

export default function App() {
  const [tournament, setTournament] = useState(initialTournament)
  const [screen, setScreen] = useState('home')
  const [organizerView, setOrganizerView] = useState('dashboard')
  const [selectedPlayerId, setSelectedPlayerId] = useState(null)
  const [organizerAuthenticated, setOrganizerAuthenticated] = useState(false)

  useEffect(() => {
    const storedPlayerId = localStorage.getItem(SESSION_KEY)
    if (storedPlayerId && getPlayerById(initialTournament.players, storedPlayerId)) {
      setSelectedPlayerId(storedPlayerId)
    }
  }, [])

  const selectedPlayer = useMemo(
    () => getPlayerById(tournament.players, selectedPlayerId),
    [selectedPlayerId, tournament.players],
  )

  function handleCheckIn(code) {
    const result = checkInPlayerByCode(tournament, code)
    setTournament(result.tournament)
    if (result.player) {
      localStorage.setItem(SESSION_KEY, result.player.id)
      setSelectedPlayerId(result.player.id)
      setScreen('player')
    }
    return Boolean(result.player)
  }

  function handleSetupSubmit(config) {
    setTournament(createRegistrationTournament(config))
    setSelectedPlayerId(null)
    localStorage.removeItem(SESSION_KEY)
    setOrganizerView('dashboard')
    setScreen('organizer')
  }

  return (
    <AppShell
      title={screen === 'home' ? 'Turnīra izvēlne' : 'Novusa turnīra vadība'}
      showBack={screen !== 'home'}
      onBack={() => {
        setOrganizerView('dashboard')
        setScreen('home')
      }}
    >
      {screen === 'home' ? (
        <HomeScreen
          hasPlayerSession={Boolean(selectedPlayer)}
          onOrganizer={() => {
            setOrganizerView('dashboard')
            setScreen(organizerAuthenticated ? 'organizer' : 'organizer-login')
          }}
          onPlayer={() => setScreen('player')}
        />
      ) : null}

      {screen === 'organizer-login' ? (
        <OrganizerLogin
          onSubmit={() => {
            setOrganizerAuthenticated(true)
            setOrganizerView('dashboard')
            setScreen('organizer')
          }}
        />
      ) : null}

      {screen === 'organizer' ? (
        organizerView === 'dashboard' ? (
          <OrganizerDashboard
            tournament={tournament}
            onSetupSubmit={handleSetupSubmit}
            onClearAlert={(matchId) => setTournament((current) => clearRefereeRequest(current, matchId))}
            onMarkInvestigating={(matchId) => setTournament((current) => markMatchInvestigating(current, matchId))}
            onResetInvestigation={(matchId) => setTournament((current) => resetMatchInvestigation(current, matchId))}
            onForceOverride={(matchId, setResults, metadata) => setTournament((current) => forceOverrideResult(current, matchId, setResults, metadata))}
            onSwapTables={(sourceMatchId, targetMatchId) => setTournament((current) => swapMatchTables(current, sourceMatchId, targetMatchId))}
            onGenerateRound={(nextTournament) => setTournament(nextTournament)}
            onOpenPlayers={() => setOrganizerView('players')}
          />
        ) : (
          <OrganizerPlayersView
            tournament={tournament}
            onBack={() => setOrganizerView('dashboard')}
            onSavePlayer={(playerId, nextPlayer) => setTournament((current) => updatePlayer(current, playerId, nextPlayer))}
          />
        )
      ) : null}

      {screen === 'player' ? (
        <PlayerView
          tournament={tournament}
          player={selectedPlayer}
          onCheckIn={handleCheckIn}
          onScoreAdd={(matchId, winnerId, actorPlayerId) => setTournament((current) => appendSetResult(current, matchId, winnerId, actorPlayerId))}
          onScoreRemove={(matchId, winnerId, actorPlayerId) => setTournament((current) => removeSetResult(current, matchId, winnerId, actorPlayerId))}
          onConfirm={(matchId, playerId) => setTournament((current) => confirmFinalScore(current, matchId, playerId))}
          onCallReferee={(matchId, playerId) => setTournament((current) => requestReferee(current, matchId, playerId))}
          onCancelReferee={(matchId, playerId) => setTournament((current) => clearRefereeRequest(current, matchId, playerId))}
          onSignOut={() => {
            localStorage.removeItem(SESSION_KEY)
            setSelectedPlayerId(null)
            setScreen('home')
          }}
        />
      ) : null}
    </AppShell>
  )
}

function HomeScreen({ hasPlayerSession, onOrganizer, onPlayer }) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl items-center px-4 py-10 sm:px-6">
      <div className="w-full space-y-6">
        <div className="text-center max-w-lg mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-apple-blue">Turnīra vadība</p>
          <h2 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1C1E]">
            Izvēlieties savu lomu
          </h2>
          <p className="mt-2 text-sm text-[#8E8E93]">
            Piekļūstiet organizatora vadības panelim vai ievadiet savu spēlētāja kodu, lai sekotu galdam un setu rezultātiem.
          </p>
        </div>

        <div className="grid w-full gap-5 sm:grid-cols-2">
          <RoleCard
            icon={ShieldCheck}
            iconBg="bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-sm"
            badge="Tiesnešiem & vadībai"
            title="Organizators"
            description="Pārskatiet visus galdus, apstipriniet rezultātus, reaģējiet uz strīdiem un ģenerējiet Šveices sistēmas kārtas."
            actionLabel="Organizatora panelis"
            onClick={onOrganizer}
          />
          <RoleCard
            icon={UserRound}
            iconBg="bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-sm"
            badge={hasPlayerSession ? "Aktīva sesija" : "Spēlētājiem"}
            title="Spēlētājs"
            description={hasPlayerSession ? 'Atjaunojiet savu aktīvo sesiju un turpiniet spēles rezultātu reģistrēšanu.' : 'Pieslēdzieties ar savu 6 zīmju dalībnieka kodu, lai skatītu galda piešķīrumu un ievadītu setus.'}
            actionLabel={hasPlayerSession ? 'Atvērt manu spēli' : 'Ievadīt spēlētāja kodu'}
            onClick={onPlayer}
          />
        </div>
      </div>
    </main>
  )
}

function RoleCard({ icon: Icon, iconBg, badge, title, description, actionLabel, onClick }) {
  return (
    <section className="group flex flex-col justify-between rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
      <div>
        <div className="flex items-center justify-between">
          <div className={`flex size-14 items-center justify-center rounded-2xl ${iconBg}`}>
            <Icon size={28} strokeWidth={2.2} />
          </div>
          <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-500">
            {badge}
          </span>
        </div>
        <h3 className="mt-5 text-2xl font-bold tracking-tight text-[#1C1C1E]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#636366]">{description}</p>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="mt-8 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-apple-blue px-5 text-[15px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-apple-blueHover active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-apple-blue/30"
      >
        {actionLabel}
      </button>
    </section>
  )
}

function OrganizerLogin({ onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center px-4 py-8">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit({ email, password })
        }}
        className="w-full rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full bg-apple-blue/10 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-apple-blue">
            Testa vide
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#1C1C1E]">Organizatora pieslēgšanās</h2>
          <p className="mt-1.5 text-sm text-[#8E8E93]">Šī ir demonstrācijas piekļuve organizatora saskarnei. Derēs jebkuri ievades dati.</p>
        </div>
        <div className="space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#636366]">
            E-pasts
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 min-h-[46px] w-full rounded-xl border border-black/[0.1] bg-[#F2F2F7] px-3.5 text-[15px] text-[#1C1C1E] transition-all focus:bg-white focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/20"
              placeholder="organizer@nvssgrid.local"
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#636366]">
            Parole
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 min-h-[46px] w-full rounded-xl border border-black/[0.1] bg-[#F2F2F7] px-3.5 text-[15px] text-[#1C1C1E] transition-all focus:bg-white focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/20"
              placeholder="testa-parole"
            />
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-apple-blue px-4 text-[15px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-apple-blueHover active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-apple-blue/30"
        >
          Turpināt uz vadības paneli
        </button>
      </form>
    </main>
  )
}
