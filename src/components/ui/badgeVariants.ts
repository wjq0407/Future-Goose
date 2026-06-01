import { cva } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-badge font-medium whitespace-nowrap transition-colors duration-fast',
  {
    variants: {
      variant: {
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-bg-surface-elevated text-text-secondary border border-border',
        success: 'bg-success/10 text-success-dark dark:text-success-light',
        warning: 'bg-warning/10 text-warning-dark dark:text-warning-light',
        error: 'bg-error/10 text-error-dark dark:text-error-light',
        info: 'bg-info/10 text-info-dark dark:text-info-light',
        goose: 'bg-goose-orange/10 text-goose-orange',
      },
      size: {
        sm: 'h-5 px-2 text-xs',
        md: 'h-6 px-2.5 text-xs',
        lg: 'h-7 px-3 text-sm',
      },
      dot: {
        true: 'gap-1.5',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      dot: false,
    },
  }
)
