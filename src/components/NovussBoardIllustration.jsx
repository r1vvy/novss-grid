import React from 'react'

export function NovussBoardIllustration({
  className = 'w-full max-w-[360px] sm:max-w-[440px]',
  children,
}) {
  // Puck starting positions (4 on each side of the center divider, lined up against cushion)
  const topBlackPuckX = [440, 470, 500, 530, 560, 590, 620, 650]
  const bottomRedPuckX = [440, 470, 500, 530, 560, 590, 620, 650]

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-orange-400/15 to-blue-500/15 blur-2xl pointer-events-none" />

      {/* Main SVG of the Novuss Table (explicit z-0) */}
      <svg
        viewBox="0 0 1090 1090"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-0 w-full h-full drop-shadow-[0_16px_40px_rgba(0,0,0,0.16)] transition-transform duration-300 hover:scale-[1.01]"
        aria-label="Novusa galda vizualizācija"
        role="img"
      >
        <defs>
          {/* Cushion Frame Gradient (Cēlkoka apmales) */}
          <linearGradient id="boardFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#672D0B" />
            <stop offset="30%" stopColor="#853E0F" />
            <stop offset="70%" stopColor="#9A4E17" />
            <stop offset="100%" stopColor="#4A1E06" />
          </linearGradient>

          {/* Playing Field Birch Plywood Gradient (1000x1000 mm) */}
          <linearGradient id="birchSurfaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="40%" stopColor="#FAF2E2" />
            <stop offset="80%" stopColor="#F2E6CD" />
            <stop offset="100%" stopColor="#E9D9B9" />
          </linearGradient>

          {/* Corner Pocket Deep Hole (Ø 100 mm) */}
          <radialGradient id="pocketGrad" cx="38%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="45%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>

          {/* Red Puck (Ø 30 mm) 3D Radial */}
          <radialGradient id="redPuckGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="40%" stopColor="#E11D48" />
            <stop offset="85%" stopColor="#9F1239" />
            <stop offset="100%" stopColor="#881337" />
          </radialGradient>

          {/* Black Puck (Ø 30 mm) 3D Radial */}
          <radialGradient id="blackPuckGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="40%" stopColor="#334155" />
            <stop offset="85%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Drop Shadows */}
          <filter id="puckShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* 1. Outer Cushion Frame (45 mm apmale, 1090 × 1090 mm kopējais izmērs) */}
        <rect
          x="0"
          y="0"
          width="1090"
          height="1090"
          rx="18"
          fill="url(#boardFrameGrad)"
          stroke="#381503"
          strokeWidth="4"
        />

        {/* Inner Cushion Chamfer Highlight */}
        <rect
          x="6"
          y="6"
          width="1078"
          height="1078"
          rx="14"
          fill="none"
          stroke="#C27838"
          strokeWidth="1.5"
          opacity="0.35"
        />

        {/* 2. Playing Surface (Spēles virsma: 1000 × 1000 mm) */}
        <rect
          x="45"
          y="45"
          width="1000"
          height="1000"
          rx="4"
          fill="url(#birchSurfaceGrad)"
          stroke="#78350F"
          strokeWidth="2"
        />

        {/* Realistic Birch Grain Texture (subtle horizontal lines) */}
        <path
          d="M50 120 Q545 135 1040 120 M50 240 Q545 255 1040 240 M50 360 Q545 345 1040 360 M50 480 Q545 495 1040 480 M50 600 Q545 585 1040 600 M50 720 Q545 735 1040 720 M50 840 Q545 825 1040 840 M50 960 Q545 975 1040 960"
          stroke="#C2853E"
          strokeWidth="1"
          opacity="0.22"
          fill="none"
        />

        {/* 3. Official Zone Markings (Līnijas no viena borta līdz otram, veidojot 130x130 mm stūra laukumus) */}
        {/* Top Horizontal Line (y = 175 mm, 130 mm no augšējā borta) */}
        <line x1="45" y1="175" x2="1045" y2="175" stroke="#1C1C1E" strokeWidth="2.5" />

        {/* Bottom Horizontal Line (y = 915 mm, 130 mm no apakšējā borta) */}
        <line x1="45" y1="915" x2="1045" y2="915" stroke="#1C1C1E" strokeWidth="2.5" />

        {/* Left Vertical Line (x = 175 mm, 130 mm no kreisā borta) */}
        <line x1="175" y1="45" x2="175" y2="1045" stroke="#1C1C1E" strokeWidth="2.5" />

        {/* Right Vertical Line (x = 915 mm, 130 mm no labā borta) */}
        <line x1="915" y1="45" x2="915" y2="1045" stroke="#1C1C1E" strokeWidth="2.5" />

        {/* 4. Zone Center Divider Lines (Sadala apmales zonas uz pusēm) */}
        {/* Top Zone Divider (vertikāla līnija no borta līdz zonas līnijai pie x = 545) */}
        <line x1="545" y1="45" x2="545" y2="175" stroke="#1C1C1E" strokeWidth="2.5" />

        {/* Bottom Zone Divider (vertikāla līnija no zonas līnijas līdz bortam pie x = 545) */}
        <line x1="545" y1="915" x2="545" y2="1045" stroke="#1C1C1E" strokeWidth="2.5" />

        {/* Left Zone Divider (horizontāla līnija no borta līdz zonas līnijai pie y = 545) */}
        <line x1="45" y1="545" x2="175" y2="545" stroke="#1C1C1E" strokeWidth="2.5" />

        {/* Right Zone Divider (horizontāla līnija no zonas līnijas līdz bortam pie y = 545) */}
        <line x1="915" y1="545" x2="1045" y2="545" stroke="#1C1C1E" strokeWidth="2.5" />

        {/* 5. Center Circle (Vidus aplis: Ø 250 mm -> rādiuss 125 mm, centrā 545, 545) */}
        <circle
          cx="545"
          cy="545"
          r="125"
          stroke="#1C1C1E"
          strokeWidth="3"
          fill="none"
        />

        {/* Center Crosshairs (Perpendikulārās asis TIKAI iekš vidus apļa!) */}
        <line x1="420" y1="545" x2="670" y2="545" stroke="#1C1C1E" strokeWidth="2.5" />
        <line x1="545" y1="420" x2="545" y2="670" stroke="#1C1C1E" strokeWidth="2.5" />

        {/* 6. Four Corner Pockets (Caurumi stūros: Ø 100 mm -> rādiuss 50 mm, 15 mm no borta) */}
        {/* Top-Left Pocket (centrs 110, 110) */}
        <circle cx="110" cy="110" r="50" fill="url(#pocketGrad)" stroke="#000000" strokeWidth="2" />

        {/* Top-Right Pocket (centrs 980, 110) */}
        <circle cx="980" cy="110" r="50" fill="url(#pocketGrad)" stroke="#000000" strokeWidth="2" />

        {/* Bottom-Left Pocket (centrs 110, 980) */}
        <circle cx="110" cy="980" r="50" fill="url(#pocketGrad)" stroke="#000000" strokeWidth="2" />

        {/* Bottom-Right Pocket (centrs 980, 980) */}
        <circle cx="980" cy="980" r="50" fill="url(#pocketGrad)" stroke="#000000" strokeWidth="2" />

        {/* 7. Game Pucks (Spēles kauliņi sākuma izvietojumā: 8 melnie augšā, 8 sarkanie apakšā) */}
        {/* Top Black Pucks (8 melnie kauliņi gar augšējo bortu, 4 katrā pusē no centra līnijas) */}
        {topBlackPuckX.map((cx, i) => (
          <g key={`black-puck-${i}`} filter="url(#puckShadow)">
            <circle cx={cx} cy="60" r="15" fill="url(#blackPuckGrad)" />
            <circle cx={cx} cy="60" r="10" stroke="#94A3B8" strokeWidth="0.8" opacity="0.65" fill="none" />
            <circle cx={cx} cy="60" r="4" fill="#020617" />
          </g>
        ))}

        {/* Bottom Red Pucks (8 sarkanie kauliņi gar apakšējo bortu, 4 katrā pusē no centra līnijas) */}
        {bottomRedPuckX.map((cx, i) => (
          <g key={`red-puck-${i}`} filter="url(#puckShadow)">
            <circle cx={cx} cy="1030" r="15" fill="url(#redPuckGrad)" />
            <circle cx={cx} cy="1030" r="10" stroke="#FDA4AF" strokeWidth="0.8" opacity="0.75" fill="none" />
            <circle cx={cx} cy="1030" r="4" fill="#4C0519" />
          </g>
        ))}
      </svg>

      {/* Children placed directly over the table with high z-index (z-20) */}
      {children && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-3 sm:p-5 pointer-events-none">
          {children}
        </div>
      )}
    </div>
  )
}
