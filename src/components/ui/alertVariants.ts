import { cva } from 'class-variance-authority'

export const alertVariants = cva(
  'flex gap-3 rounded-card p-4 transition-all duration-normal',
  {
    variants: {
      variant: {
        info: 'bg-info/10 border border-info/20 text-info-dark dark:text-info-light',
        success: 'bg-success/10 border border-success/20 text-success-dark dark:text-success-light',
        warning: 'bg-warning/10 border border-warning/20 text-warning-dark dark:text-warning-light',
        error: 'bg-error/10 border border-error/20 text-error-dark dark:text-error-light',
      },
      size: {
        sm: 'p-3 text-sm',
        md: 'p-4 text-sm',
        lg: 'p-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'info',
      size: 'md',
    },
  }
)
