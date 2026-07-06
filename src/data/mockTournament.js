export const initialTournament = {
  id: 'novuss-riga-open-2026',
  name: 'Riga Open Novuss Swiss',
  venue: 'Main Hall',
  status: 'active',
  currentRound: 4,
  totalRounds: 7,
  maxSetsPerMatch: 7,
  pointAllocation: {
    win: 3,
    draw: 1,
    closeWin: 2,
    loss: 0,
  },
  updatedAt: 'Live sandbox',
  players: [
    { id: 'p1', name: 'Anna Kalnina', club: 'Riga', registrationCode: 'ANNA42', status: 'checked_in' },
    { id: 'p2', name: 'Janis Berzins', club: 'Cesis', registrationCode: 'JANIS7', status: 'checked_in' },
    { id: 'p3', name: 'Marta Ozola', club: 'Valmiera', registrationCode: 'MARTA9', status: 'checked_in' },
    { id: 'p4', name: 'Rihards Liepa', club: 'Riga', registrationCode: 'RIX001', status: 'checked_in' },
    { id: 'p5', name: 'Elina Balode', club: 'Jelgava', registrationCode: 'ELINA5', status: 'checked_in' },
    { id: 'p6', name: 'Karlis Vetra', club: 'Liepaja', registrationCode: 'KARLIS', status: 'absent' },
    { id: 'p7', name: 'Laura Priede', club: 'Ogre', registrationCode: 'LAURA8', status: 'checked_in' },
    { id: 'p8', name: 'Nils Sprogis', club: 'Tukums', registrationCode: 'NILS22', status: 'checked_in' },
    { id: 'p9', name: 'Signe Egle', club: 'Riga', registrationCode: 'SIGNE1', status: 'checked_in' },
    { id: 'p10', name: 'Edgars Krumins', club: 'Cesis', registrationCode: 'EDGAR3', status: 'checked_in' },
    { id: 'p11', name: 'Inese Luse', club: 'Bauska', registrationCode: 'INESE4', status: 'checked_in' },
    { id: 'p12', name: 'Toms Abele', club: 'Riga', registrationCode: 'TOMS66', status: 'checked_in' },
    { id: 'p13', name: 'Dace Roze', club: 'Kuldiga', registrationCode: 'DACE77', status: 'checked_in' },
    { id: 'p14', name: 'Armands Sils', club: 'Dobele', registrationCode: 'ARM123', status: 'checked_in' },
    { id: 'p15', name: 'Liene Araja', club: 'Riga', registrationCode: 'LIENE2', status: 'checked_in' },
    { id: 'p16', name: 'Viesturs Kalns', club: 'Ogre', registrationCode: 'VIEST9', status: 'checked_in' },
    { id: 'p17', name: 'Zane Irbe', club: 'Jelgava', registrationCode: 'ZANE10', status: 'checked_in' },
    { id: 'p18', name: 'Roberts Lapsa', club: 'Riga', registrationCode: 'ROB111', status: 'checked_in' },
    { id: 'p19', name: 'Aija Saule', club: 'Cesis', registrationCode: 'AIJA12', status: 'checked_in' },
    { id: 'p20', name: 'Gatis Osis', club: 'Valka', registrationCode: 'GATIS6', status: 'checked_in' },
    { id: 'p21', name: 'Liga Viksna', club: 'Riga', registrationCode: 'LIGA21', status: 'checked_in' },
    { id: 'p22', name: 'Uldis Rudzis', club: 'Madona', registrationCode: 'ULDIS8', status: 'checked_in' },
    { id: 'p23', name: 'Paula Zile', club: 'Liepaja', registrationCode: 'PAULA3', status: 'checked_in' },
    { id: 'p24', name: 'Maris Seme', club: 'Riga', registrationCode: 'MARIS4', status: 'checked_in' },
    { id: 'p25', name: 'Ilze Krasta', club: 'Talsi', registrationCode: 'ILZE55', status: 'checked_in' },
    { id: 'p26', name: 'Oskars Grauds', club: 'Ogre', registrationCode: 'OSKARS', status: 'checked_in' },
    { id: 'p27', name: 'Eva Medne', club: 'Riga', registrationCode: 'EVAMED', status: 'checked_in' },
    { id: 'p28', name: 'Andris Cers', club: 'Bauska', registrationCode: 'ANDRIS', status: 'checked_in' },
    { id: 'p29', name: 'Baiba Sarta', club: 'Cesis', registrationCode: 'BAIBA1', status: 'checked_in' },
    { id: 'p30', name: 'Reinis Tilts', club: 'Riga', registrationCode: 'REINIS', status: 'checked_in' },
    { id: 'p31', name: 'Miks Priedis', club: 'Dobele', registrationCode: 'MIKS44', status: 'checked_in' },
    { id: 'p32', name: 'Santa Kalve', club: 'Jelgava', registrationCode: 'SANTA2', status: 'checked_in' },
  ],
  matches: [
    { id: 'r1-m1', table: 1, round: 1, status: 'verified', playerAId: 'p1', playerBId: 'p32', setResults: wins('p1', 4, 'p32', 1), targetWins: 4, confirmations: { p1: true, p32: true }, refereeRequested: false },
    { id: 'r1-m2', table: 2, round: 1, status: 'verified', playerAId: 'p2', playerBId: 'p31', setResults: wins('p2', 4, 'p31', 2), targetWins: 4, confirmations: { p2: true, p31: true }, refereeRequested: false },
    { id: 'r1-m3', table: 3, round: 1, status: 'verified', playerAId: 'p3', playerBId: 'p30', setResults: wins('p30', 4, 'p3', 3), targetWins: 4, confirmations: { p3: true, p30: true }, refereeRequested: false },
    { id: 'r2-m1', table: 1, round: 2, status: 'verified', playerAId: 'p1', playerBId: 'p2', setResults: wins('p1', 4, 'p2', 3), targetWins: 4, confirmations: { p1: true, p2: true }, refereeRequested: false },
    { id: 'r2-m2', table: 2, round: 2, status: 'verified', playerAId: 'p3', playerBId: 'p4', setResults: wins('p4', 4, 'p3', 2), targetWins: 4, confirmations: { p3: true, p4: true }, refereeRequested: false },
    { id: 'r3-m1', table: 1, round: 3, status: 'verified', playerAId: 'p1', playerBId: 'p4', setResults: wins('p4', 4, 'p1', 2), targetWins: 4, confirmations: { p1: true, p4: true }, refereeRequested: false },
    { id: 'r3-m2', table: 2, round: 3, status: 'verified', playerAId: 'p2', playerBId: 'p30', setResults: wins('p2', 4, 'p30', 0), targetWins: 4, confirmations: { p2: true, p30: true }, refereeRequested: false },
    ...roundFourMatches(),
  ],
}

function wins(winnerId, winnerSets, loserId, loserSets) {
  const rows = []
  for (let i = 0; i < Math.max(winnerSets, loserSets); i += 1) {
    if (i < winnerSets) rows.push({ winnerId, score: i % 2 === 0 ? '11-8' : '11-7' })
    if (i < loserSets) rows.push({ winnerId: loserId, score: '9-11' })
  }
  return rows.slice(0, winnerSets + loserSets)
}

function roundFourMatches() {
  const pairs = [
    ['p1', 'p5', 'in_progress', wins('p1', 3, 'p5', 1)],
    ['p2', 'p6', 'disputed', wins('p2', 2, 'p6', 2)],
    ['p3', 'p7', 'scheduled', []],
    ['p4', 'p8', 'completed', wins('p4', 4, 'p8', 1)],
    ['p9', 'p10', 'in_progress', wins('p10', 2, 'p9', 1)],
    ['p11', 'p12', 'awaiting_confirmation', wins('p11', 4, 'p12', 3)],
    ['p13', 'p14', 'disputed', wins('p13', 1, 'p14', 1)],
    ['p15', 'p16', 'scheduled', []],
    ['p17', 'p18', 'in_progress', wins('p18', 3, 'p17', 2)],
    ['p19', 'p20', 'completed', wins('p20', 4, 'p19', 2)],
    ['p21', 'p22', 'scheduled', []],
    ['p23', 'p24', 'in_progress', wins('p23', 2, 'p24', 0)],
    ['p25', 'p26', 'completed', wins('p25', 4, 'p26', 3)],
    ['p27', 'p28', 'scheduled', []],
    ['p29', 'p30', 'in_progress', wins('p29', 3, 'p30', 3)],
    ['p31', 'p32', 'scheduled', []],
  ]

  return pairs.map(([playerAId, playerBId, status, setResults], index) => ({
    id: `r4-m${index + 1}`,
    table: index + 1,
    round: 4,
    status,
    playerAId,
    playerBId,
    setResults,
    targetWins: 4,
    confirmations: {
      [playerAId]: status === 'verified',
      [playerBId]: status === 'verified',
    },
    refereeRequested: status === 'disputed',
  }))
}
