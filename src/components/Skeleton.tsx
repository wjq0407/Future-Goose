import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rounded' | 'rectangular'
  animation?: 'pulse' | 'wave' | 'none'
  width?: string
  height?: string
}

export default function Skeleton({
  className,
  variant = 'text',
  animation = 'pulse',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 overflow-hidden relative'
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rounded: 'rounded-xl',
    rectangular: 'rounded-none',
  }
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    none: '',
  }
  
  const style: React.CSSProperties = {}
  if (width) style.width = width
  if (height) style.height = height
  
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  )
}
