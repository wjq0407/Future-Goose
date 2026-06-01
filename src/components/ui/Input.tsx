import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { inputVariants } from './inputVariants'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>,
    VariantProps<typeof inputVariants> {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  error?: boolean
  errorMessage?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, withAddon, prefix, suffix, error, errorMessage, id, 'aria-describedby': ariaDescribedBy, ...props }, ref) => {
    const resolvedVariant = error ? 'error' : variant
    const hasAddon = !!(prefix || suffix || withAddon)
    const errorId = id ? `${id}-error` : undefined

    return (
      <div className="w-full">
        <div className="flex items-stretch">
          {prefix && (
            <span className="inline-flex items-center px-3 border border-r-0 border-border rounded-l-input bg-bg-surface text-text-secondary text-sm">
              {prefix}
            </span>
          )}
          <input
            id={id}
            className={cn(
              inputVariants({ variant: resolvedVariant, inputSize, withAddon: hasAddon, className }),
              prefix && 'rounded-l-none',
              suffix && 'rounded-r-none'
            )}
            ref={ref}
            aria-invalid={error}
            aria-describedby={error ? (ariaDescribedBy ? `${ariaDescribedBy} ${errorId}` : errorId) : ariaDescribedBy}
            {...props}
          />
          {suffix && (
            <span className="inline-flex items-center px-3 border border-l-0 border-border rounded-r-input bg-bg-surface text-text-secondary text-sm">
              {suffix}
            </span>
          )}
        </div>
        {error && errorMessage && (
          <p id={errorId} className="mt-1 text-xs text-error" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
