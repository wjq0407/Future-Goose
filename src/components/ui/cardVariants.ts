import { cva } from 'class-variance-authority'

export const cardVariants = cva(
  'rounded-card bg-bg-surface transition-all duration-normal',
  {
    variants: {
      variant: {
        default: 'border border-border shadow-card hover:shadow-card-hover',
        elevated: 'shadow-3 hover:shadow-4',
        outlined: 'border-2 border-border hover:border-primary',
        glass: 'glass-card',
        glossy: 'glossy-card bg-bg-surface shadow-card hover:shadow-card-hover',
        flat: 'border border-border',
      },
      interactive: {
        true: 'cursor-pointer hover:-translate-y-1',
        false: '',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      interactive: false,
      padding: 'md',
    },
  }
)
