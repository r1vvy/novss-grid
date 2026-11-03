import React from 'react'

export function NovussBoardIllustration({ className = 'w-full max-w-[280px] sm:max-w-[320px]' }) {
  return (
    <div className={`relative aspect-square select-none ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-orange-400/15 to-blue-500/15 blur-xl pointer-events-none" />

      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-[1.02]"
        aria-label="Novusa galda vizualizācija"
        role="img"
      >
        <defs>
          {/* Wood cushion frame gradient */}
          <linearGradient id="boardFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="50%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          {/* Playing field birch gradient */}
          <linearGradient id="birchSurfaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="50%" stopColor="#F9F2E3" />
            <stop offset="100%" stopColor="#EFE4CD" />
          </linearGradient>

          {/* Red puck 3D gradient */}
          <radialGradient id="redPuckGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="45%" stopColor="#E11D48" />
            <stop offset="90%" stopColor="#9F1239" />
            <stop offset="100%" stopColor="#881337" />
          </radialGradient>

          {/* Black puck 3D gradient */}
          <radialGradient id="blackPuckGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="45%" stopColor="#1E293B" />
            <stop offset="90%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Striker (Māte) wood & amber gradient */}
          <radialGradient id="strikerGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="45%" stopColor="#FDE68A" />
            <stop offset="85%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>

          {/* Cue stick gradient */}
          <linearGradient id="cueGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="50%" stopColor="#B45309" />
            <stop offset="90%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          {/* Corner pocket deep hole */}
          <radialGradient id="pocketGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Puck Drop Shadows */}
          <filter id="shadowPuck" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.25" />
          </filter>
          <filter id="shadowStriker" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="2" dy="4" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer Wooden Cushion Frame (Borts) */}
        <rect
          x="12"
          y="12"
          width="296"
          height="296"
          rx="22"
          fill="url(#boardFrameGrad)"
          stroke="#451A03"
          strokeWidth="3"
        />

        {/* Inner Wooden Cushion Border Highlight */}
        <rect
          x="16"
          y="16"
          width="288"
          height="288"
          rx="18"
          fill="none"
          stroke="#B45309"
          strokeWidth="1"
          opacity="0.4"
        />

        {/* Playing Field (Birch plywood surface) */}
        <rect
          x="28"
          y="28"
          width="264"
          height="264"
          rx="12"
          fill="url(#birchSurfaceGrad)"
          stroke="#78350F"
          strokeWidth="1.5"
        />

        {/* Subdued wood grain lines */}
        <path
          d="M30 75 Q160 80 290 75 M30 145 Q160 148 290 145 M30 215 Q160 212 290 215"
          stroke="#D97706"
          strokeWidth="0.5"
          opacity="0.25"
          fill="none"
        />

        {/* Zone & Baseline Markings (10 cm zone guidelines) */}
        <rect
          x="54"
          y="54"
          width="212"
          height="212"
          rx="6"
          fill="none"
          stroke="#B45309"
          strokeWidth="1"
          opacity="0.35"
        />

        {/* Quadrant Crosshair lines */}
        <line x1="160" y1="28" x2="160" y2="292" stroke="#B45309" strokeWidth="1" opacity="0.3" />
        <line x1="28" y1="160" x2="292" y2="160" stroke="#B45309" strokeWidth="1" opacity="0.3" />

        {/* Center Target Rings (Centra aplis) */}
        <circle cx="160" cy="160" r="44" stroke="#B45309" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
        <circle cx="160" cy="160" r="22" stroke="#B45309" strokeWidth="1.5" opacity="0.5" />
        <circle cx="160" cy="160" r="4" fill="#B45309" opacity="0.75" />

        {/* 4 Corner Pockets (Bedrītes) */}
        {/* Top-Left */}
        <circle cx="44" cy="44" r="15" fill="url(#pocketGrad)" stroke="#1E293B" strokeWidth="1.5" />
        {/* Top-Right */}
        <circle cx="276" cy="44" r="15" fill="url(#pocketGrad)" stroke="#1E293B" strokeWidth="1.5" />
        {/* Bottom-Left */}
        <circle cx="44" cy="276" r="15" fill="url(#pocketGrad)" stroke="#1E293B" strokeWidth="1.5" />
        {/* Bottom-Right */}
        <circle cx="276" cy="276" r="15" fill="url(#pocketGrad)" stroke="#1E293B" strokeWidth="1.5" />

        {/* Pocket mesh net pattern highlights */}
        <path d="M37 44 Q44 50 51 44 M44 37 Q50 44 44 51" stroke="#94A3B8" strokeWidth="0.8" opacity="0.4" fill="none" />
        <path d="M269 44 Q276 50 283 44 M276 37 Q282 44 276 51" stroke="#94A3B8" strokeWidth="0.8" opacity="0.4" fill="none" />
        <path d="M37 276 Q44 282 51 276 M44 269 Q50 276 44 283" stroke="#94A3B8" strokeWidth="0.8" opacity="0.4" fill="none" />
        <path d="M269 276 Q276 282 283 276 M276 269 Q282 276 276 283" stroke="#94A3B8" strokeWidth="0.8" opacity="0.4" fill="none" />

        {/* Game Discs (Kauliņi) */}
        {/* Red Puck 1 (Center Left) */}
        <g filter="url(#shadowPuck)">
          <circle cx="132" cy="138" r="13" fill="url(#redPuckGrad)" />
          <circle cx="132" cy="138" r="8" stroke="#FDA4AF" strokeWidth="0.75" opacity="0.7" fill="none" />
          <circle cx="132" cy="138" r="3.5" fill="#4C0519" />
        </g>

        {/* Red Puck 2 (Upper right zone) */}
        <g filter="url(#shadowPuck)">
          <circle cx="204" cy="108" r="13" fill="url(#redPuckGrad)" />
          <circle cx="204" cy="108" r="8" stroke="#FDA4AF" strokeWidth="0.75" opacity="0.7" fill="none" />
          <circle cx="204" cy="108" r="3.5" fill="#4C0519" />
        </g>

        {/* Black Puck 1 (Center Right) */}
        <g filter="url(#shadowPuck)">
          <circle cx="188" cy="154" r="13" fill="url(#blackPuckGrad)" />
          <circle cx="188" cy="154" r="8" stroke="#94A3B8" strokeWidth="0.75" opacity="0.7" fill="none" />
          <circle cx="188" cy="154" r="3.5" fill="#020617" />
        </g>

        {/* Black Puck 2 (Upper left zone) */}
        <g filter="url(#shadowPuck)">
          <circle cx="106" cy="94" r="13" fill="url(#blackPuckGrad)" />
          <circle cx="106" cy="94" r="8" stroke="#94A3B8" strokeWidth="0.75" opacity="0.7" fill="none" />
          <circle cx="106" cy="94" r="3.5" fill="#020617" />
        </g>

        {/* Māte (The Striker - Lielais kauliņš) on bottom baseline */}
        <g filter="url(#shadowStriker)">
          <circle cx="160" cy="242" r="17" fill="url(#strikerGrad)" stroke="#B45309" strokeWidth="1" />
          <circle cx="160" cy="242" r="11" stroke="#E11D48" strokeWidth="1.2" opacity="0.85" fill="none" />
          <circle cx="160" cy="242" r="4.5" fill="#78350F" />
        </g>

        {/* Cue Stick (Kija) pointing toward the striker */}
        <g opacity="0.9">
          <line
            x1="228"
            y1="288"
            x2="174"
            y2="252"
            stroke="url(#cueGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Cue tip indicator */}
          <circle cx="174" cy="252" r="2.5" fill="#3B82F6" opacity="0.85" />
        </g>

        {/* Subtle decorative badges inside corner corners */}
        <text x="32" y="24" fill="#B45309" fontSize="6" fontWeight="bold" opacity="0.4" letterSpacing="0.5">NVSS</text>
        <text x="264" y="24" fill="#B45309" fontSize="6" fontWeight="bold" opacity="0.4" letterSpacing="0.5">100cm</text>
      </svg>
    </div>
  )
}
