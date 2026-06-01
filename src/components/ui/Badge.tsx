import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { badgeVariants } from './badgeVariants'

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => {
    return (
      <span
        className={cn(badgeVariants({ variant, size, dot, className }))}
        ref={ref}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              variant === 'primary' && 'bg-primary',
              variant === 'success' && 'bg-success',
              variant === 'warning' && 'bg-warning',
              variant === 'error' && 'bg-error',
              variant === 'info' && 'bg-info',
              variant === 'goose' && 'bg-goose-orange',
              variant === 'secondary' && 'bg-text-secondary'
            )}
          />
        )}
        {children}
      </span>
    )
  }
)
Badge.displayName = 'Badge'
