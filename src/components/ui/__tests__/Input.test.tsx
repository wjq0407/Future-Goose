import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/Input'

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText(/enter text/i)
    expect(input).toBeTruthy()
    expect(input.tagName.toLowerCase()).toBe('input')
    expect(input).toHaveClass('h-10')
    expect(input).toHaveClass('rounded-input')
  })

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Input variant="default" placeholder="Default" />)
    expect(screen.getByPlaceholderText(/default/i)).toHaveClass('border-border')

    rerender(<Input variant="error" placeholder="Error" />)
    expect(screen.getByPlaceholderText(/error/i)).toHaveClass('border-error')

    rerender(<Input variant="success" placeholder="Success" />)
    expect(screen.getByPlaceholderText(/success/i)).toHaveClass('border-success')
  })

  it('applies size classes correctly', () => {
    const { rerender } = render(<Input inputSize="sm" placeholder="Small" />)
    expect(screen.getByPlaceholderText(/small/i)).toHaveClass('h-8')

    rerender(<Input inputSize="md" placeholder="Medium" />)
    expect(screen.getByPlaceholderText(/medium/i)).toHaveClass('h-10')

    rerender(<Input inputSize="lg" placeholder="Large" />)
    expect(screen.getByPlaceholderText(/large/i)).toHaveClass('h-12')
  })

  it('renders prefix when provided', () => {
    render(<Input prefix="🔍" placeholder="Search" />)
    expect(screen.getByText('🔍')).toBeTruthy()
    const input = screen.getByPlaceholderText(/search/i)
    expect(input).toHaveClass('rounded-l-none')
  })

  it('renders suffix when provided', () => {
    render(<Input suffix=".com" placeholder="Email" />)
    expect(screen.getByText('.com')).toBeTruthy()
    const input = screen.getByPlaceholderText(/email/i)
    expect(input).toHaveClass('rounded-r-none')
  })

  it('renders both prefix and suffix', () => {
    render(<Input prefix="$" suffix="/month" placeholder="Amount" />)
    expect(screen.getByText('$')).toBeTruthy()
    expect(screen.getByText('/month')).toBeTruthy()
  })

  it('shows error message when error is true', () => {
    render(<Input error errorMessage="This field is required" placeholder="Test" />)
    expect(screen.getByText(/this field is required/i)).toBeTruthy()
    expect(screen.getByText(/this field is required/i)).toHaveClass('text-error')
  })

  it('does not show error message when error is false', () => {
    render(<Input error={false} errorMessage="This field is required" placeholder="Test" />)
    expect(screen.queryByText(/this field is required/i)).toBeFalsy()
  })

  it('applies error variant when error prop is true', () => {
    render(<Input error placeholder="Error input" />)
    expect(screen.getByPlaceholderText(/error input/i)).toHaveClass('border-error')
  })

  it('forwards ref to input element', () => {
    const ref = vi.fn()
    render(<Input ref={ref} placeholder="Ref test" />)
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement))
  })

  it('merges custom className', () => {
    render(<Input className="custom-class" placeholder="Custom" />)
    expect(screen.getByPlaceholderText(/custom/i)).toHaveClass('custom-class')
  })

  it('passes through native props', () => {
    render(<Input type="email" required placeholder="Email" />)
    const input = screen.getByPlaceholderText(/email/i)
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('required')
  })

  it('handles value changes', async () => {
    render(<Input placeholder="Type here" />)
    const input = screen.getByPlaceholderText(/type here/i)
    await userEvent.type(input, 'Hello')
    expect(input).toHaveValue('Hello')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText(/disabled/i)).toBeDisabled()
  })

  it('applies focus styles on focus', () => {
    render(<Input placeholder="Focus me" />)
    expect(screen.getByPlaceholderText(/focus me/i)).toHaveClass('focus:shadow-focus')
    expect(screen.getByPlaceholderText(/focus me/i)).toHaveClass('focus:border-primary')
  })

  it('applies withAddon classes when has addon', () => {
    render(<Input prefix="@" withAddon placeholder="Username" />)
    expect(screen.getByPlaceholderText(/username/i)).toHaveClass('focus:z-10')
  })
})
