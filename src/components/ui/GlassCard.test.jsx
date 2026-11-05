import React, { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GlassCard } from './GlassCard'

describe('GlassCard UI Primitive', () => {
  it('renders with default subtle elevation and data-glass attribute', () => {
    render(<GlassCard>Content</GlassCard>)
    const el = screen.getByText('Content')
    expect(el).toBeInTheDocument()
    expect(el).toHaveAttribute('data-glass', 'true')
    expect(el.className).toContain('glass-card')
    expect(el.className).toContain('backdrop-blur-xl')
  })

  it('supports elevation tiers: flat, subtle, elevated, modal', () => {
    const { rerender } = render(<GlassCard elevation="flat">Flat</GlassCard>)
    expect(screen.getByText('Flat').className).toContain('backdrop-blur-md')

    rerender(<GlassCard elevation="elevated">Elevated</GlassCard>)
    expect(screen.getByText('Elevated').className).toContain('backdrop-blur-2xl')

    rerender(<GlassCard elevation="modal">Modal</GlassCard>)
    expect(screen.getByText('Modal').className).toContain('backdrop-blur-3xl')
  })

  it('supports polymorphic "as" prop', () => {
    render(<GlassCard as="section">Section Content</GlassCard>)
    const el = screen.getByText('Section Content')
    expect(el.tagName.toLowerCase()).toBe('section')
  })

  it('applies interactive spring styling when interactive=true', () => {
    render(<GlassCard interactive>Clickable</GlassCard>)
    const el = screen.getByText('Clickable')
    expect(el.className).toContain('active:scale-[0.98]')
    expect(el.className).toContain('cursor-pointer')
  })

  it('forwards ref to the underlying element', () => {
    const ref = createRef()
    render(<GlassCard ref={ref}>Ref Content</GlassCard>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('supports color variants like birch, accent, warning', () => {
    const { rerender } = render(<GlassCard variant="birch">Birch</GlassCard>)
    expect(screen.getByText('Birch').className).toContain('border-amber-200/80')

    rerender(<GlassCard variant="warning">Warning</GlassCard>)
    expect(screen.getByText('Warning').className).toContain('border-apple-orange/35')
  })
})

