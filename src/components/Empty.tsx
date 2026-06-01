import { cn } from '@/lib/utils'
import GooseMascot from '@/components/GooseMascot'

interface EmptyProps {
  message?: string
  className?: string
}

// Empty state component with goose mascot
export default function Empty({ message = '这里空空如也', className = '' }: EmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-12', className)}>
      <GooseMascot mood="default" size="lg" className="text-tencent-blue animate-goose-bob" />
      <p className="text-text-secondary text-sm">{message}</p>
    </div>
  )
}
