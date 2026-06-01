import * as React from 'react'
import { cn } from '../../lib/utils'
import { modalVariants, modalHeaderVariants, modalBodyVariants, modalFooterVariants, modalContentVariants } from './modalVariants'

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]',
].join(', ')

export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onOpenChange?: (open: boolean) => void
  position?: 'center' | 'top' | 'bottom' | 'right' | 'left'
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ className, open, onOpenChange, position, closeOnOverlayClick = true, closeOnEsc = true, children, ...props }, ref) => {
    const modalRef = React.useRef<HTMLDivElement>(null)
    const previousFocusRef = React.useRef<HTMLElement | null>(null)

    React.useEffect(() => {
      if (open) {
        previousFocusRef.current = document.activeElement as HTMLElement
        document.body.style.overflow = 'hidden'

        const focusableElements = modalRef.current?.querySelectorAll(FOCUSABLE_SELECTORS)
        const firstFocusable = focusableElements?.[0] as HTMLElement
        if (firstFocusable) {
          firstFocusable.focus()
        }
      } else if (previousFocusRef.current) {
        document.body.style.overflow = ''
        previousFocusRef.current.focus()
      }

      return () => {
        if (open) {
          document.body.style.overflow = ''
        }
      }
    }, [open])

    React.useEffect(() => {
      if (!closeOnEsc || !open) return

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
          onOpenChange?.(false)
        }
      }

      document.addEventListener('keydown', handleKeyDown, true)
      return () => document.removeEventListener('keydown', handleKeyDown, true)
    }, [closeOnEsc, open, onOpenChange])

    React.useEffect(() => {
      if (!open || !modalRef.current) return

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return

        const focusableElements = Array.from(
          modalRef.current!.querySelectorAll(FOCUSABLE_SELECTORS)
        ) as HTMLElement[]

        if (focusableElements.length === 0) return

        const firstFocusable = focusableElements[0]
        const lastFocusable = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault()
            lastFocusable.focus()
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault()
            firstFocusable.focus()
          }
        }
      }

      modalRef.current.addEventListener('keydown', handleKeyDown)
      return () => modalRef.current?.removeEventListener('keydown', handleKeyDown)
    }, [open])

    if (!open) return null

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onOpenChange?.(false)
      }
    }

    return (
      <div
        className={cn(modalVariants({ position, className }))}
        ref={(el) => {
          if (typeof ref === 'function') ref(el)
          else if (ref) ref.current = el
          modalRef.current = el
        }}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        {...props}
      >
        <div className="fixed inset-0 bg-bg-overlay animate-fade-in" aria-hidden="true" />
        <div className="relative z-10 animate-scale-in">
          {children}
        </div>
      </div>
    )
  }
)
Modal.displayName = 'Modal'

export interface ModalHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  onClose?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, title, description, onClose, size, ...props }, ref) => {
    return (
      <div
        className={cn(modalHeaderVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-text-primary">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-text-secondary">
              {description}
            </p>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-bg-surface-elevated hover:text-text-primary transition-colors duration-fast"
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
ModalHeader.displayName = 'ModalHeader'

export interface ModalBodyProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

export const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        className={cn(modalBodyVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
ModalBody.displayName = 'ModalBody'

export interface ModalFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        className={cn(modalFooterVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
ModalFooter.displayName = 'ModalFooter'

export interface ModalContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full'
}

export const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        className={cn(modalContentVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
ModalContent.displayName = 'ModalContent'
