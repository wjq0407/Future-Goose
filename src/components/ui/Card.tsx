import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { cardVariants } from './cardVariants'

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, padding, ...props }, ref) => {
    return (
      <div
        className={cn(cardVariants({ variant, interactive, padding, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'
