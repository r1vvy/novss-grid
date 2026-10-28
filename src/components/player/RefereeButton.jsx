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
        className={`flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl px-4 text-[15px] font-semibold transition-all duration-150 active:scale-[0.98] ${
          armed
            ? 'bg-apple-red text-white shadow-sm ring-4 ring-apple-red/30 animate-pulse'
            : 'border border-apple-red/30 bg-apple-red/10 text-apple-red hover:bg-apple-red/15 active:bg-apple-red/25 disabled:cursor-not-allowed disabled:border-black/[0.08] disabled:bg-black/[0.03] disabled:text-apple-tertiary'
        }`}
      >
        <ShieldAlert size={19} strokeWidth={2.2} />
        <span>{armed ? 'Piespiediet vēlreiz, lai izsauktu tiesnesi' : label}</span>
      </button>
      {requireConfirm && !disabled ? (
        <p className="mt-2 text-center text-[11px] text-[#8E8E93]">
          Divi pieskārieni, lai novērstu nejaušu tiesneša izsaukšanu.
        </p>
      ) : null}
    </div>
  )
}
