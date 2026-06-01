import { cva } from 'class-variance-authority'

export const inputVariants = cva(
  'flex w-full rounded-input bg-bg-surface border transition-all duration-normal placeholder:text-text-disabled disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus:border-primary focus:shadow-focus',
  {
    variants: {
      variant: {
        default: 'border-border hover:border-border-dark text-text-primary',
        error: 'border-error text-text-primary',
        success: 'border-success text-text-primary',
      },
      inputSize: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-5 text-base',
      },
      withAddon: {
        true: 'rounded-none focus:z-10',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
      withAddon: false,
    },
  }
)
