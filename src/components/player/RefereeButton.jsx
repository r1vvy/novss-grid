import React from 'react'
import { ShieldAlert } from 'lucide-react'

export function RefereeButton({ disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-5 flex min-h-[56px] w-full items-center justify-center gap-2 rounded border border-nvssAlert px-4 text-lg font-black text-nvssAlert disabled:cursor-not-allowed disabled:border-nvssBorder disabled:text-nvssMuted"
    >
      <ShieldAlert size={22} />
      Izsaukt tiesnesi
    </button>
  )
}
