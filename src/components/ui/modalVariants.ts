import { cva } from 'class-variance-authority'

export const modalVariants = cva(
  'fixed inset-0 z-modal flex items-center justify-center p-4',
  {
    variants: {
      position: {
        center: 'items-center justify-center',
        top: 'items-start justify-center pt-16',
        bottom: 'items-end justify-center pb-16',
        right: 'items-stretch justify-end',
        left: 'items-stretch justify-start',
      },
    },
    defaultVariants: {
      position: 'center',
    },
  }
)

export const modalHeaderVariants = cva(
  'flex items-center justify-between px-6 py-4 border-b border-border',
  {
    variants: {
      size: {
        sm: 'px-4 py-3',
        md: 'px-6 py-4',
        lg: 'px-8 py-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export const modalBodyVariants = cva(
  'px-6 py-4 overflow-y-auto max-h-[calc(100vh-16rem)]',
  {
    variants: {
      size: {
        sm: 'px-4 py-3',
        md: 'px-6 py-4',
        lg: 'px-8 py-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export const modalFooterVariants = cva(
  'flex items-center justify-end gap-3 px-6 py-4 border-t border-border',
  {
    variants: {
      size: {
        sm: 'px-4 py-3',
        md: 'px-6 py-4',
        lg: 'px-8 py-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export const modalContentVariants = cva(
  'bg-bg-surface rounded-modal shadow-modal w-full',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        full: 'max-w-full mx-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)
