import * as React from 'react'

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={decorative ? undefined : orientation}
        className={className}
        style={{
          alignSelf: 'stretch',
          backgroundColor: 'var(--gray-3)',
          ...(orientation === 'horizontal'
            ? { height: '1px', width: '100%' }
            : { width: '1px', height: '100%' }),
        }}
        {...props}
      />
    )
  }
)
Separator.displayName = 'Separator'
