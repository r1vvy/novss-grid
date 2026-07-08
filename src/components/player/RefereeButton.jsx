import React, { useEffect, useState } from 'react'
import { ShieldAlert } from 'lucide-react'

export function RefereeButton({ disabled, onClick, label = 'Izsaukt tiesnesi', requireConfirm = false }) {
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (!armed) return undefined

    const timeoutId = window.setTimeout(() => setArmed(false), 3000)
    return () => window.clearTimeout(timeoutId)
  }, [armed])

  useEffect(() => {
    if (disabled) setArmed(false)
  }, [disabled])

  function handleClick() {
    if (disabled) return
    if (!requireConfirm) {
      onClick()
      return
    }
    if (!armed) {
      setArmed(true)
      return
    }
    setArmed(false)
    onClick()
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`flex min-h-[56px] w-full items-center justify-center gap-2 rounded border px-4 text-lg font-black disabled:cursor-not-allowed disabled:border-nvssBorder disabled:text-nvssMuted ${
          armed ? 'border-nvssAlert bg-nvssAlert text-nvssSurface' : 'border-nvssAlert text-nvssAlert hover:bg-nvssAlert hover:text-nvssSurface'
        }`}
      >
        <ShieldAlert size={22} />
        {armed ? 'Piespied vēlreiz, lai izsauktu tiesnesi' : label}
      </button>
      {requireConfirm && !disabled ? (
        <p className="mt-2 text-center text-xs text-nvssMuted">
          Divi pieskārieni, lai izvairītos no nejaušas nospiešanas.
        </p>
      ) : null}
    </div>
  )
}
