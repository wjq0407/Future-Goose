import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { avatarVariants } from './avatarVariants'

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: React.ReactNode
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    return (
      <div
        className={cn(avatarVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        {src ? (
          <img
            className="h-full w-full object-cover"
            src={src}
            alt={alt}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-bg-surface text-text-secondary font-medium">
            {fallback || (
              <svg className="h-1/2 w-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            )}
          </div>
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'
