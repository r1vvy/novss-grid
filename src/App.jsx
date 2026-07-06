import React, { useEffect, useMemo, useState } from 'react'
import { ShieldCheck, UserRound } from 'lucide-react'
import { initialTournament } from './data/mockTournament'
import { AppShell } from './components/AppShell'
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard'
import { PlayerView } from './components/player/PlayerView'
import {
  appendSetResult,
  checkInPlayerByCode,
  clearRefereeRequest,
  confirmFinalScore,
  createRegistrationTournament,
  getPlayerById,
  requestReferee,
} from './utils/tournament'

const SESSION_KEY = 'nvssgrid.playerId'

export default function App() {
  const [tournament, setTournament] = useState(initialTournament)
  const [screen, setScreen] = useState('home')
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
    setScreen('organizer')
  }

  return (
    <AppShell
      title={screen === 'home' ? 'Tournament Entry' : 'Live Novuss Tournament Control'}
      showBack={screen !== 'home'}
      onBack={() => setScreen('home')}
    >
      {screen === 'home' ? (
        <HomeScreen
          hasPlayerSession={Boolean(selectedPlayer)}
          onOrganizer={() => setScreen(organizerAuthenticated ? 'organizer' : 'organizer-login')}
          onPlayer={() => setScreen('player')}
        />
      ) : null}

      {screen === 'organizer-login' ? (
        <OrganizerLogin
          onSubmit={() => {
            setOrganizerAuthenticated(true)
            setScreen('organizer')
          }}
        />
      ) : null}

      {screen === 'organizer' ? (
        <OrganizerDashboard
          tournament={tournament}
          onSetupSubmit={handleSetupSubmit}
          onClearAlert={(matchId) => setTournament((current) => clearRefereeRequest(current, matchId))}
          onGenerateRound={(nextTournament) => setTournament(nextTournament)}
        />
      ) : null}

      {screen === 'player' ? (
        <PlayerView
          tournament={tournament}
          player={selectedPlayer}
          onCheckIn={handleCheckIn}
          onScoreSet={(matchId, winnerId) => setTournament((current) => appendSetResult(current, matchId, winnerId))}
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
          title="Organizer"
          description="Open the control desk, review alerts, and manage the live round."
          actionLabel="Organizer Login"
          onClick={onOrganizer}
        />
        <RoleCard
          icon={UserRound}
          title="Player"
          description={hasPlayerSession ? 'Resume your player session or enter a registration code.' : 'Check in with your registration code and open your match screen.'}
          actionLabel={hasPlayerSession ? 'Open Player View' : 'Enter Player Code'}
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nvssGreen">Mocked Access</p>
          <h2 className="mt-2 text-2xl font-semibold">Organizer Login</h2>
          <p className="mt-2 text-sm text-nvssMuted">This is a placeholder gate for the organizer interface. Any credentials will work.</p>
        </div>
        <label className="block text-sm font-medium text-nvssMuted">
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 min-h-[48px] w-full rounded border border-nvssBorder bg-nvssBg px-3 text-white"
            placeholder="organizer@nvssgrid.local"
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-nvssMuted">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 min-h-[48px] w-full rounded border border-nvssBorder bg-nvssBg px-3 text-white"
            placeholder="mock-password"
          />
        </label>
        <button type="submit" className="mt-5 min-h-[52px] w-full rounded-md bg-nvssGreenAction px-4 font-semibold text-white">
          Continue to Organizer
        </button>
      </form>
    </main>
  )
}
