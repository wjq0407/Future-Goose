import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

describe('Modal', () => {
  it('does not render when open is false', () => {
    const { container } = render(
      <Modal open={false} onOpenChange={() => {}}>
        <ModalContent>Content</ModalContent>
      </Modal>
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders when open is true', () => {
    render(
      <Modal open onOpenChange={() => {}}>
        <ModalContent>Modal Content</ModalContent>
      </Modal>
    )
    expect(screen.getByText(/modal content/i)).toBeTruthy()
  })

  it('renders overlay background', () => {
    render(
      <Modal open onOpenChange={() => {}}>
        <ModalContent>Content</ModalContent>
      </Modal>
    )
    const overlay = document.querySelector('.fixed.inset-0.bg-bg-overlay')
    expect(overlay).toBeTruthy()
  })

  it('calls onOpenChange when overlay is clicked', async () => {
    const handleOpenChange = vi.fn()
    render(
      <Modal open onOpenChange={handleOpenChange}>
        <ModalContent>Content</ModalContent>
      </Modal>
    )
    const overlay = document.querySelector('.fixed.inset-0')
    await act(async () => {
      await userEvent.click(overlay!)
    })
    expect(handleOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not call onOpenChange when overlay click is disabled', async () => {
    const handleOpenChange = vi.fn()
    render(
      <Modal open onOpenChange={handleOpenChange} closeOnOverlayClick={false}>
        <ModalContent>Content</ModalContent>
      </Modal>
    )
    const overlay = document.querySelector('.fixed.inset-0')
    await act(async () => {
      await userEvent.click(overlay!)
    })
    expect(handleOpenChange).not.toHaveBeenCalled()
  })

  it('calls onOpenChange when Escape key is pressed', async () => {
    const handleOpenChange = vi.fn()
    render(
      <Modal open onOpenChange={handleOpenChange}>
        <ModalContent>Content</ModalContent>
      </Modal>
    )
    await act(async () => {
      await userEvent.keyboard('{Escape}')
    })
    expect(handleOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not call onOpenChange when Escape is disabled', async () => {
    const handleOpenChange = vi.fn()
    render(
      <Modal open onOpenChange={handleOpenChange} closeOnEsc={false}>
        <ModalContent>Content</ModalContent>
      </Modal>
    )
    await act(async () => {
      await userEvent.keyboard('{Escape}')
    })
    expect(handleOpenChange).not.toHaveBeenCalled()
  })

  it('applies position classes', () => {
    const { rerender } = render(
      <Modal open position="center" onOpenChange={() => {}}>
        <ModalContent>Center</ModalContent>
      </Modal>
    )
    const modal = document.querySelector('.fixed.inset-0.z-modal')
    expect(modal).toHaveClass('items-center')

    rerender(
      <Modal open position="top" onOpenChange={() => {}}>
        <ModalContent>Top</ModalContent>
      </Modal>
    )
    expect(document.querySelector('.fixed.inset-0.z-modal')).toHaveClass('items-start')
  })
})

describe('ModalContent', () => {
  it('renders with default size', () => {
    render(<ModalContent>Default Size</ModalContent>)
    expect(screen.getByText(/default size/i)).toHaveClass('max-w-md')
  })

  it('applies size classes correctly', () => {
    const { rerender } = render(<ModalContent size="sm">Small</ModalContent>)
    expect(screen.getByText(/small/i)).toHaveClass('max-w-sm')

    rerender(<ModalContent size="lg">Large</ModalContent>)
    expect(screen.getByText(/large/i)).toHaveClass('max-w-lg')

    rerender(<ModalContent size="xl">Extra Large</ModalContent>)
    expect(screen.getByText(/extra large/i)).toHaveClass('max-w-xl')

    rerender(<ModalContent size="2xl">2XL</ModalContent>)
    expect(screen.getByText(/2xl/i)).toHaveClass('max-w-2xl')

    rerender(<ModalContent size="full">Full</ModalContent>)
    expect(screen.getByText(/full/i)).toHaveClass('max-w-full')
  })

  it('applies base styles', () => {
    render(<ModalContent>Base</ModalContent>)
    expect(screen.getByText(/base/i)).toHaveClass('bg-bg-surface')
    expect(screen.getByText(/base/i)).toHaveClass('rounded-modal')
    expect(screen.getByText(/base/i)).toHaveClass('shadow-modal')
  })
})

describe('ModalHeader', () => {
  it('renders title', () => {
    render(<ModalHeader title="Test Title" />)
    expect(screen.getByText(/test title/i)).toBeTruthy()
  })

  it('renders description when provided', () => {
    render(<ModalHeader title="Title" description="Description text" />)
    expect(screen.getByText(/description text/i)).toBeTruthy()
  })

  it('renders close button when onClose is provided', () => {
    render(<ModalHeader title="Title" onClose={() => {}} />)
    expect(screen.getByRole('button', { name: /close/i })).toBeTruthy()
  })

  it('does not render close button when onClose is not provided', () => {
    render(<ModalHeader title="Title" />)
    expect(screen.queryByRole('button', { name: /close/i })).toBeFalsy()
  })

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn()
    render(<ModalHeader title="Title" onClose={handleClose} />)
    await userEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('applies size classes', () => {
    const { rerender, container } = render(<ModalHeader title="Small" size="sm" />)
    const header = container.firstChild as HTMLElement
    expect(header).toHaveClass('px-4')
    expect(header).toHaveClass('py-3')

    rerender(<ModalHeader title="Medium" size="md" />)
    expect(header).toHaveClass('px-6')

    rerender(<ModalHeader title="Large" size="lg" />)
    expect(header).toHaveClass('px-8')
  })
})

describe('ModalBody', () => {
  it('renders children', () => {
    render(<ModalBody>Body Content</ModalBody>)
    expect(screen.getByText(/body content/i)).toBeTruthy()
  })

  it('applies size classes', () => {
    const { rerender } = render(<ModalBody size="sm">Small</ModalBody>)
    expect(screen.getByText(/small/i)).toHaveClass('px-4')

    rerender(<ModalBody size="md">Medium</ModalBody>)
    expect(screen.getByText(/medium/i)).toHaveClass('px-6')

    rerender(<ModalBody size="lg">Large</ModalBody>)
    expect(screen.getByText(/large/i)).toHaveClass('px-8')
  })
})

describe('ModalFooter', () => {
  it('renders children', () => {
    render(
      <ModalFooter>
        <Button>Cancel</Button>
        <Button>Confirm</Button>
      </ModalFooter>
    )
    expect(screen.getByRole('button', { name: /cancel/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /confirm/i })).toBeTruthy()
  })

  it('applies size classes', () => {
    const { rerender } = render(<ModalFooter size="sm">Small</ModalFooter>)
    expect(screen.getByText(/small/i)).toHaveClass('px-4')

    rerender(<ModalFooter size="md">Medium</ModalFooter>)
    expect(screen.getByText(/medium/i)).toHaveClass('px-6')
  })
})

describe('Modal Integration', () => {
  it('renders complete modal structure', () => {
    render(
      <Modal open onOpenChange={() => {}}>
        <ModalContent>
          <ModalHeader title="Complete Modal" onClose={() => {}} />
          <ModalBody>Body text</ModalBody>
          <ModalFooter>
            <Button>OK</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
    expect(screen.getByText(/complete modal/i)).toBeTruthy()
    expect(screen.getByText(/body text/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /ok/i })).toBeTruthy()
  })
})
