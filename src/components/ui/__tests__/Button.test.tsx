import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeTruthy()
    expect(button).toHaveClass('bg-primary')
    expect(button).toHaveClass('h-10')
  })

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button', { name: /primary/i })).toHaveClass('bg-primary')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button', { name: /secondary/i })).toHaveClass('bg-bg-surface')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button', { name: /outline/i })).toHaveClass('border-primary')

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button', { name: /ghost/i })).toHaveClass('text-text-secondary')

    rerender(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole('button', { name: /destructive/i })).toHaveClass('bg-error')

    rerender(<Button variant="gradient">Gradient</Button>)
    expect(screen.getByRole('button', { name: /gradient/i })).toHaveClass('bg-gradient-primary')
  })

  it('applies size classes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button', { name: /small/i })).toHaveClass('h-8')

    rerender(<Button size="md">Medium</Button>)
    expect(screen.getByRole('button', { name: /medium/i })).toHaveClass('h-10')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button', { name: /large/i })).toHaveClass('h-12')

    rerender(<Button size="xl">Extra Large</Button>)
    expect(screen.getByRole('button', { name: /extra large/i })).toHaveClass('h-14')

    rerender(<Button size="icon">Icon</Button>)
    expect(screen.getByRole('button', { name: /icon/i })).toHaveClass('w-10')
  })

  it('shows loading spinner when loading', () => {
    render(<Button loading>Loading</Button>)
    const spinner = document.querySelector('svg.animate-spin')
    expect(spinner).toBeTruthy()
  })

  it('disables button when loading', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not call onClick when loading', async () => {
    const handleClick = vi.fn()
    render(<Button loading onClick={handleClick}>Loading</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('forwards ref to button element', () => {
    const ref = vi.fn()
    render(<Button ref={ref}>Ref Test</Button>)
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
  })

  it('merges custom className with variant classes', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button', { name: /custom/i })
    expect(button).toHaveClass('custom-class')
    expect(button).toHaveClass('bg-primary')
  })

  it('applies focus visible styles', () => {
    render(<Button>Focus Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('focus-visible:shadow-focus')
  })

  it('renders children correctly', () => {
    render(
      <Button>
        <span data-testid="child">Custom Child</span>
      </Button>
    )
    expect(screen.getByTestId('child')).toBeTruthy()
    expect(screen.getByText('Custom Child')).toBeTruthy()
  })

  it('applies transition classes', () => {
    render(<Button>Transition</Button>)
    expect(screen.getByRole('button')).toHaveClass('transition-all')
    expect(screen.getByRole('button')).toHaveClass('duration-normal')
  })
})
