import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-button font-medium transition-all duration-normal select-none focus-visible:outline-none focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-text-inverse shadow-button hover:shadow-button-hover hover:-translate-y-0.5 active:translate-y-0 active:shadow-button active:scale-[0.98]',
        secondary: 'bg-bg-surface text-text-primary border border-border hover:border-primary hover:text-primary shadow-1 hover:shadow-2 active:scale-[0.98]',
        outline: 'border border-primary text-primary hover:bg-primary/5 active:bg-primary/10 active:scale-[0.98]',
        ghost: 'text-text-secondary hover:bg-bg-surface-elevated hover:text-text-primary active:bg-bg-surface active:scale-[0.98]',
        destructive: 'bg-error text-text-inverse shadow-button hover:shadow-button-hover hover:-translate-y-0.5 active:translate-y-0 active:shadow-button active:scale-[0.98]',
        link: 'text-primary underline-offset-4 hover:underline active:opacity-80',
        gradient: 'bg-gradient-primary text-text-inverse shadow-button hover:shadow-button-hover hover:-translate-y-0.5 active:translate-y-0 active:shadow-button active:scale-[0.98]',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)
