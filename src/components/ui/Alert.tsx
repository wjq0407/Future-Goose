import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { alertVariants } from './alertVariants'

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof alertVariants> {
  title?: React.ReactNode
  description?: React.ReactNode
  onClose?: () => void
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, size, title, description, onClose, children, ...props }, ref) => {
    const iconMap = {
      info: (
        <svg className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      success: (
        <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      warning: (
        <svg className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      error: (
        <svg className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    }

    return (
      <div
        className={cn(alertVariants({ variant, size, className }))}
        ref={ref}
        role="alert"
        {...props}
      >
        <div className="flex-shrink-0">{iconMap[variant ?? 'info']}</div>
        <div className="flex-1">
          {title && (
            <p className="font-medium">{title}</p>
          )}
          {description && (
            <p className="mt-1 opacity-80">{description}</p>
          )}
          {children}
        </div>
        {onClose && (
          <button
            type="button"
            className="flex-shrink-0 h-6 w-6 inline-flex items-center justify-center rounded-md opacity-70 hover:opacity-100 transition-opacity duration-fast"
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
Alert.displayName = 'Alert'
