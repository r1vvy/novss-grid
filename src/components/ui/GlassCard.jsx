import React, { forwardRef } from 'react'

const ELEVATION_CLASSES = {
  flat: 'bg-white/40 border border-black/[0.04] backdrop-blur-md shadow-none',
  subtle: 'bg-white/60 border border-white/80 backdrop-blur-xl shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.95),0_8px_24px_rgba(0,0,0,0.04)]',
  elevated: 'bg-white/70 border border-white/90 backdrop-blur-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_16px_45px_rgba(0,0,0,0.07)]',
  modal: 'bg-white/85 border border-white/95 backdrop-blur-3xl shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_25px_65px_rgba(0,0,0,0.2)]',
}

const VARIANT_CLASSES = {
  neutral: '',
  accent: 'border-apple-blue/30 bg-apple-blue/[0.04] text-[#1C1C1E]',
  success: 'border-apple-green/30 bg-apple-green/[0.04] text-[#1C1C1E]',
  warning: 'border-apple-orange/35 bg-apple-orange/[0.04] text-[#1C1C1E]',
  alert: 'border-apple-red/35 bg-apple-red/[0.04] text-[#1C1C1E]',
  birch: 'border-amber-200/80 bg-amber-50/45 text-[#1C1C1E]',
}

export const GlassCard = forwardRef(function GlassCard(
  {
    as: Component = 'div',
    elevation = 'subtle',
    variant = 'neutral',
    interactive = false,
    className = '',
    children,
    ...rest
  },
  ref,
) {
  const elevationClass = ELEVATION_CLASSES[elevation] || ELEVATION_CLASSES.subtle
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.neutral
  const interactiveClass = interactive
    ? 'transition-all duration-150 active:scale-[0.98] cursor-pointer hover:bg-white/80 select-none'
    : ''

  return (
    <Component
      ref={ref}
      data-glass="true"
      className={`glass-card rounded-2xl ${elevationClass} ${variantClass} ${interactiveClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Component>
  )
})

