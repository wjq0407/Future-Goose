import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from '@/components/ui/Card'

describe('Card', () => {
  it('renders with default props', () => {
    render(<Card>Card content</Card>)
    const card = screen.getByText(/card content/i)
    expect(card).toBeTruthy()
    expect(card).toHaveClass('rounded-card')
    expect(card).toHaveClass('bg-bg-surface')
    expect(card).toHaveClass('p-6')
  })

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Card variant="default">Default</Card>)
    expect(screen.getByText(/default/i)).toHaveClass('border')

    rerender(<Card variant="elevated">Elevated</Card>)
    expect(screen.getByText(/elevated/i)).toHaveClass('shadow-3')

    rerender(<Card variant="outlined">Outlined</Card>)
    expect(screen.getByText(/outlined/i)).toHaveClass('border-2')

    rerender(<Card variant="glass">Glass</Card>)
    expect(screen.getByText(/glass/i)).toHaveClass('glass-card')

    rerender(<Card variant="glossy">Glossy</Card>)
    expect(screen.getByText(/glossy/i)).toHaveClass('glossy-card')

    rerender(<Card variant="flat">Flat</Card>)
    expect(screen.getByText(/flat/i)).toHaveClass('border')
  })

  it('applies size classes correctly', () => {
    const { rerender } = render(<Card padding="none">No padding</Card>)
    expect(screen.getByText(/no padding/i)).not.toHaveClass('p-')

    rerender(<Card padding="sm">Small</Card>)
    expect(screen.getByText(/small/i)).toHaveClass('p-4')

    rerender(<Card padding="md">Medium</Card>)
    expect(screen.getByText(/medium/i)).toHaveClass('p-6')

    rerender(<Card padding="lg">Large</Card>)
    expect(screen.getByText(/large/i)).toHaveClass('p-8')
  })

  it('applies interactive class when interactive is true', () => {
    render(<Card interactive>Interactive Card</Card>)
    expect(screen.getByText(/interactive card/i)).toHaveClass('cursor-pointer')
    expect(screen.getByText(/interactive card/i)).toHaveClass('hover:-translate-y-1')
  })

  it('does not apply interactive class when interactive is false', () => {
    render(<Card interactive={false}>Non-interactive Card</Card>)
    expect(screen.getByText(/non-interactive card/i)).not.toHaveClass('cursor-pointer')
  })

  it('forwards ref to div element', () => {
    const ref = vi.fn()
    render(<Card ref={ref}>Ref Test</Card>)
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement))
  })

  it('merges custom className with variant classes', () => {
    render(<Card className="custom-class">Custom</Card>)
    const card = screen.getByText(/custom/i)
    expect(card).toHaveClass('custom-class')
    expect(card).toHaveClass('bg-bg-surface')
  })

  it('renders children correctly', () => {
    render(
      <Card>
        <h2 data-testid="title">Card Title</h2>
        <p>Card description</p>
      </Card>
    )
    expect(screen.getByTestId('title')).toBeTruthy()
    expect(screen.getByText(/card description/i)).toBeTruthy()
  })

  it('applies transition classes', () => {
    render(<Card>Transition</Card>)
    expect(screen.getByText(/transition/i)).toHaveClass('transition-all')
    expect(screen.getByText(/transition/i)).toHaveClass('duration-normal')
  })
})
