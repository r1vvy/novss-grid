import React from 'react'

export function NovussPuck({
  type = 'red',
  size = 56,
  className = '',
  withShadow = true,
  interactive = false,
}) {
  const isRed = type === 'red'
  const isStriker = type === 'striker'

  const idSuffix = `${type}-${size}`

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-block select-none ${interactive ? 'cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95' : ''} ${className}`}
      aria-label={
        isStriker
          ? 'Novusa ripa (māte)'
          : isRed
            ? 'Sarkanais novusa kauliņš'
            : 'Melnais novusa kauliņš'
      }
      role="img"
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {withShadow && (
            <filter id={`puck-shadow-${idSuffix}`} x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="3"
                floodColor={isRed ? '#9F1239' : isStriker ? '#78350F' : '#0F172A'}
                floodOpacity="0.35"
              />
            </filter>
          )}

          {/* Red Puck Gradient (Ø 30 mm) */}
          <radialGradient id={`red-grad-${idSuffix}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="35%" stopColor="#E11D48" />
            <stop offset="75%" stopColor="#BE123C" />
            <stop offset="100%" stopColor="#881337" />
          </radialGradient>

          {/* Black Puck Gradient (Ø 30 mm) */}
          <radialGradient id={`black-grad-${idSuffix}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="35%" stopColor="#334155" />
            <stop offset="75%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#090D16" />
          </radialGradient>

          {/* Striker Ripa (Ø 44.5 mm) Natural Solid Wood */}
          <radialGradient id={`striker-grad-${idSuffix}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FEF9ED" />
            <stop offset="30%" stopColor="#F5E6CA" />
            <stop offset="70%" stopColor="#DEBE91" />
            <stop offset="100%" stopColor="#B38B57" />
          </radialGradient>

          {/* Bevel rim highlight */}
          <linearGradient id={`rim-highlight-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        <g filter={withShadow ? `url(#puck-shadow-${idSuffix})` : undefined}>
          {/* Main Disc Body */}
          <circle
            cx="32"
            cy="32"
            r="28"
            fill={
              isStriker
                ? `url(#striker-grad-${idSuffix})`
                : isRed
                  ? `url(#red-grad-${idSuffix})`
                  : `url(#black-grad-${idSuffix})`
            }
          />

          {/* Outer Bevel Rim */}
          <circle
            cx="32"
            cy="32"
            r="27"
            stroke={`url(#rim-highlight-${idSuffix})`}
            strokeWidth="1.5"
            fill="none"
          />

          {/* Engraved Concentric Groove */}
          <circle
            cx="32"
            cy="32"
            r={isStriker ? '18' : '17'}
            stroke={isStriker ? '#8C6636' : isRed ? '#FDA4AF' : '#94A3B8'}
            strokeWidth={isStriker ? '1.5' : '1.2'}
            strokeOpacity={isStriker ? '0.7' : '0.6'}
            fill="none"
          />

          {/* Drilled Center Hole (Kauliņam 8mm/30mm=26.7%, Ripai 10mm/44.5mm=22.5%) */}
          <circle
            cx="32"
            cy="32"
            r={isStriker ? '6.3' : '7.5'}
            fill={isStriker ? '#4A2609' : isRed ? '#4C0519' : '#020617'}
          />

          {/* Specular Reflection Highlight */}
          <path
            d="M 18 18 A 20 20 0 0 1 38 14"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.35"
          />
        </g>
      </svg>
    </div>
  )
}
