import { Bot } from 'lucide-react'
import Skeleton from './Skeleton'

interface ChatLoadingSkeletonProps {
  count?: number
}

export default function ChatLoadingSkeleton({ count = 3 }: ChatLoadingSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
        >
          <div className={`flex items-start gap-2 max-w-[80%] ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center flex-shrink-0">
              {index % 2 === 0 ? (
                <Bot className="w-4 h-4 text-gray-300 dark:text-gray-600" />
              ) : (
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
              )}
            </div>
            <div className={`px-4 py-3 rounded-2xl ${index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-700 rounded-tl-sm' : 'bg-blue-200 dark:bg-blue-900 rounded-tr-sm'}`}>
              <div className="space-y-2">
                <Skeleton width="120px" height="12px" />
                <Skeleton width="80px" height="12px" />
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex justify-start">
        <div className="flex items-start gap-2 max-w-[80%]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-900 animate-pulse flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white/70" />
          </div>
          <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-sm min-w-[120px]">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
