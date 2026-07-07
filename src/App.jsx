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
  overrideMatchSetResults,
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
            onForceOverride={(matchId, winnerId, loserSets, metadata) => setTournament((current) => forceOverrideResult(current, matchId, winnerId, loserSets, metadata))}
            onOverrideSets={(matchId, setResults, metadata) => setTournament((current) => overrideMatchSetResults(current, matchId, setResults, metadata))}
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
          onCallReferee={(matchId) => setTournament((current) => requestReferee(current, matchId))}
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
    <main className="mx-auto flex min-h-[calc(100vh-90px)] max-w-5xl items-center px-4 py-8">
      <div className="grid w-full gap-4 md:grid-cols-2">
        <RoleCard
          icon={ShieldCheck}
          title="Organizators"
          description="Atver vadības paneli, pārskati brīdinājumus un pārvaldi aktīvo kārtu."
          actionLabel="Organizatora pieslēgšanās"
          onClick={onOrganizer}
        />
        <RoleCard
          icon={UserRound}
          title="Spēlētājs"
          description={hasPlayerSession ? 'Atjauno savu sesiju vai ievadi reģistrācijas kodu.' : 'Reģistrējies ar savu kodu un atver spēles ekrānu.'}
          actionLabel={hasPlayerSession ? 'Atvērt spēlētāja skatu' : 'Ievadīt spēlētāja kodu'}
          onClick={onPlayer}
        />
      </div>
    </main>
  )
}

function RoleCard({ icon: Icon, title, description, actionLabel, onClick }) {
  return (
    <section className="rounded-md border border-nvssBorder bg-nvssSurface p-6">
      <div className="flex size-14 items-center justify-center rounded-md bg-nvssBg text-nvssGreen">
        <Icon size={28} />
      </div>
      <h2 className="mt-6 text-3xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-sm text-sm leading-6 text-nvssMuted">{description}</p>
      <button
        type="button"
        onClick={onClick}
        className="mt-8 min-h-[52px] rounded-md bg-nvssGreenAction px-5 font-semibold text-white"
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
    <main className="mx-auto flex min-h-[calc(100vh-90px)] max-w-md items-center px-4 py-6">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit({ email, password })
        }}
        className="w-full rounded-md border border-nvssBorder bg-nvssSurface p-5"
      >
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nvssGreen">Testa piekļuve</p>
          <h2 className="mt-2 text-2xl font-semibold">Organizatora pieslēgšanās</h2>
          <p className="mt-2 text-sm text-nvssMuted">Šī ir pagaidu piekļuve organizatora saskarnei. Derēs jebkuri dati.</p>
        </div>
        <label className="block text-sm font-medium text-nvssMuted">
          E-pasts
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 min-h-[48px] w-full rounded border border-nvssBorder bg-nvssBg px-3 text-white"
            placeholder="organizer@nvssgrid.local"
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-nvssMuted">
          Parole
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 min-h-[48px] w-full rounded border border-nvssBorder bg-nvssBg px-3 text-white"
            placeholder="testa-parole"
          />
        </label>
        <button type="submit" className="mt-5 min-h-[52px] w-full rounded-md bg-nvssGreenAction px-4 font-semibold text-white">
          Turpināt uz organizatora skatu
        </button>
      </form>
    </main>
  )
}
