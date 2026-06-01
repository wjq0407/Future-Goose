import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/Badge'

describe('Badge', () => {
  it('renders with default props', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText(/default/i)
    expect(badge).toBeTruthy()
    expect(badge).toHaveClass('bg-primary/10')
    expect(badge).toHaveClass('text-primary')
    expect(badge).toHaveClass('h-6')
  })

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Badge variant="primary">Primary</Badge>)
    expect(screen.getByText(/primary/i)).toHaveClass('bg-primary/10')
    expect(screen.getByText(/primary/i)).toHaveClass('text-primary')

    rerender(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText(/secondary/i)).toHaveClass('bg-bg-surface-elevated')
    expect(screen.getByText(/secondary/i)).toHaveClass('border')

    rerender(<Badge variant="success">Success</Badge>)
    expect(screen.getByText(/success/i)).toHaveClass('bg-success/10')

    rerender(<Badge variant="warning">Warning</Badge>)
    expect(screen.getByText(/warning/i)).toHaveClass('bg-warning/10')

    rerender(<Badge variant="error">Error</Badge>)
    expect(screen.getByText(/error/i)).toHaveClass('bg-error/10')

    rerender(<Badge variant="info">Info</Badge>)
    expect(screen.getByText(/info/i)).toHaveClass('bg-info/10')

    rerender(<Badge variant="goose">Goose</Badge>)
    expect(screen.getByText(/goose/i)).toHaveClass('bg-goose-orange/10')
  })

  it('applies size classes correctly', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>)
    expect(screen.getByText(/small/i)).toHaveClass('h-5')
    expect(screen.getByText(/small/i)).toHaveClass('text-xs')

    rerender(<Badge size="md">Medium</Badge>)
    expect(screen.getByText(/medium/i)).toHaveClass('h-6')
    expect(screen.getByText(/medium/i)).toHaveClass('text-xs')

    rerender(<Badge size="lg">Large</Badge>)
    expect(screen.getByText(/large/i)).toHaveClass('h-7')
    expect(screen.getByText(/large/i)).toHaveClass('text-sm')
  })

  it('renders dot indicator when dot is true', () => {
    render(<Badge dot>With Dot</Badge>)
    expect(screen.getByText(/with dot/i)).toHaveClass('gap-1.5')
    const dot = document.querySelector('.h-1\\.5')
    expect(dot).toBeTruthy()
    expect(dot).toHaveClass('w-1.5')
    expect(dot).toHaveClass('rounded-full')
  })

  it('dot color matches variant', () => {
    const { rerender } = render(<Badge variant="primary" dot>Primary</Badge>)
    let dot = document.querySelector('.bg-primary')
    expect(dot).toBeTruthy()

    rerender(<Badge variant="success" dot>Success</Badge>)
    dot = document.querySelector('.bg-success')
    expect(dot).toBeTruthy()

    rerender(<Badge variant="warning" dot>Warning</Badge>)
    dot = document.querySelector('.bg-warning')
    expect(dot).toBeTruthy()

    rerender(<Badge variant="error" dot>Error</Badge>)
    dot = document.querySelector('.bg-error')
    expect(dot).toBeTruthy()

    rerender(<Badge variant="goose" dot>Goose</Badge>)
    dot = document.querySelector('.bg-goose-orange')
    expect(dot).toBeTruthy()
  })

  it('forwards ref to span element', () => {
    const ref = vi.fn()
    render(<Badge ref={ref}>Ref Test</Badge>)
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLSpanElement))
  })

  it('merges custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>)
    expect(screen.getByText(/custom/i)).toHaveClass('custom-class')
  })

  it('renders children correctly', () => {
    render(<Badge>Badge Text</Badge>)
    expect(screen.getByText('Badge Text')).toBeTruthy()
  })

  it('applies transition classes', () => {
    render(<Badge>Transition</Badge>)
    expect(screen.getByText(/transition/i)).toHaveClass('transition-colors')
    expect(screen.getByText(/transition/i)).toHaveClass('duration-fast')
  })

  it('is inline-flex by default', () => {
    render(<Badge>Inline</Badge>)
    expect(screen.getByText(/inline/i)).toHaveClass('inline-flex')
  })
})
