import { useMemo } from 'react'
import { calculateStandings } from '../utils/tournament'

/**
 * Derives algorithmic pairing transparency explanation in plain Latvian for a Swiss pairing.
 * MX (Machine Experience) Transparency principle: explain the "why" behind the pairing.
 *
 * @param {object} match
 * @param {object} tournament
 * @returns {{ round: number, headline: string, summary: string, details: string, equalPoints: boolean }}
 */
export function getSwissPairingExplanation(match, tournament) {
  if (!match || !tournament) {
    return {
      round: 1,
      headline: 'Šveices sistēmas pāris',
      summary: 'Automātiska Šveices sistēmas pāru atlase',
      details: 'Pāri tiek ģenerēti atbilstoši FIDE / Novusa Šveices sistēmas kritērijiem.',
      equalPoints: true,
    }
  }

  const round = match.round || 1

  if (round === 1) {
    return {
      round: 1,
      headline: '1. kārta: Sākotnējā izloze',
      summary: '1. kārta: Izloze pēc reitinga un reģistrācijas secības',
      details: 'Pirmajā kārtā dalībnieki tiek sapāroti, izmantojot reitinga grupas vai sākotnējo izlozi. Neviens spēlētājs vēl nav aizvadījis nevienu spēli.',
      equalPoints: true,
    }
  }

  // Round 2+
  let standings = []
  try {
    standings = calculateStandings(tournament)
  } catch {
    standings = []
  }

  const playerA = standings.find((p) => p.id === match.playerAId)
  const playerB = standings.find((p) => p.id === match.playerBId)

  const ptsA = Number(playerA?.points ?? 0)
  const ptsB = Number(playerB?.points ?? 0)
  const buchA = Number(playerA?.buchholz ?? 0)
  const buchB = Number(playerB?.buchholz ?? 0)

  // Verify if they have met in earlier rounds
  const earlierMatches = (tournament.matches || []).filter(
    (m) =>
      m.round < round &&
      ((m.playerAId === match.playerAId && m.playerBId === match.playerBId) ||
        (m.playerAId === match.playerBId && m.playerBId === match.playerAId)),
  )
  const metBefore = earlierMatches.length > 0
  const noRematchText = metBefore ? 'Atkārtota tikšanās' : 'Nav tikušies iepriekšējās kārtās'

  const equalPoints = ptsA === ptsB

  if (equalPoints) {
    const summary = `${round}. kārta: Abi dalībnieki ar ${ptsA.toFixed(ptsA % 1 === 0 ? 0 : 1)} punktiem · ${noRematchText} · Buholcs ${buchA} pret ${buchB}`
    const headline = `Vienāds punktu skaits (${ptsA.toFixed(ptsA % 1 === 0 ? 0 : 1)} p.)`
    const details = `Šveices algoritms sapāro dalībniekus ar vienādu punktu skaitu (${ptsA.toFixed(ptsA % 1 === 0 ? 0 : 1)} p.), stingri ievērojot noteikumu netikties atkārtoti turnīra laikā. Izlīdzināšanai tiek ņemts vērā pretinieku spēks (Buholca rādītājs ${buchA} pret ${buchB}).`

    return {
      round,
      headline,
      summary,
      details,
      equalPoints: true,
      pointsA: ptsA,
      pointsB: ptsB,
      buchholzA: buchA,
      buchholzB: buchB,
    }
  }

  const summary = `${round}. kārta: Spēlētāji ar ${ptsA.toFixed(ptsA % 1 === 0 ? 0 : 1)} un ${ptsB.toFixed(ptsB % 1 === 0 ? 0 : 1)} punktiem · ${noRematchText} · Buholcs ${buchA} pret ${buchB}`
  const headline = `Punktu grupu piemeklēšana (${ptsA.toFixed(ptsA % 1 === 0 ? 0 : 1)} pret ${ptsB.toFixed(ptsB % 1 === 0 ? 0 : 1)} p.)`
  const details = `Tā kā punktu grupā nebija pieejams nesatikts pretinieks, algoritms piemeklēja tuvāko atbilstošo pretinieku no blakus grupas, ievērojot noteikumu netikties atkārtoti.`

  return {
    round,
    headline,
    summary,
    details,
    equalPoints: false,
    pointsA: ptsA,
    pointsB: ptsB,
    buchholzA: buchA,
    buchholzB: buchB,
  }
}

/**
 * Custom hook to obtain Swiss pairing explanation
 */
export function useSwissExplainer(match, tournament) {
  return useMemo(() => getSwissPairingExplanation(match, tournament), [match, tournament])
}

