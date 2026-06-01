import Skeleton from './Skeleton'

export function CardSkeleton() {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton variant="rounded" width="48px" height="48px" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height="20px" />
          <Skeleton width="80%" height="14px" />
          <Skeleton width="70%" height="14px" />
        </div>
      </div>
    </div>
  )
}

export function FeatureCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <Skeleton variant="rounded" width="48px" height="48px" />
          <div className="space-y-2">
            <Skeleton width="70%" height="18px" />
            <Skeleton width="90%" height="14px" />
          </div>
          <Skeleton width="40%" height="14px" />
        </div>
      ))}
    </div>
  )
}

export function JobCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton width="80%" height="18px" />
              <Skeleton width="60%" height="14px" />
            </div>
            <Skeleton variant="circular" width="20px" height="20px" />
          </div>
          <div className="space-y-2">
            <Skeleton width="100%" height="12px" />
            <Skeleton width="90%" height="12px" />
            <Skeleton width="70%" height="12px" />
          </div>
          <div className="flex gap-2 pt-2">
            <Skeleton width="60px" height="24px" />
            <Skeleton width="60px" height="24px" />
            <Skeleton width="60px" height="24px" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function TimelineSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton width="120px" height="24px" />
          <Skeleton width="60px" height="20px" />
        </div>
        <Skeleton width="100%" height="8px" />
        
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex gap-4">
              <Skeleton variant="circular" width="24px" height="24px" />
              <div className="flex-1 space-y-2">
                <Skeleton width="40%" height="16px" />
                <Skeleton width="80%" height="14px" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <Skeleton width="100px" height="20px" className="mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl space-y-3">
              <div className="flex items-start justify-between">
                <Skeleton variant="rounded" width="40px" height="40px" />
                <Skeleton width="16px" height="16px" />
              </div>
              <div className="space-y-2">
                <Skeleton width="80%" height="16px" />
                <Skeleton width="90%" height="14px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
        <Skeleton width="120px" height="24px" />
        <div className="flex justify-center">
          <Skeleton variant="circular" width="300px" height="300px" />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
        <Skeleton width="80px" height="20px" />
        <div className="space-y-3">
          <div className="space-y-2">
            <Skeleton width="40px" height="14px" />
            <Skeleton width="60%" height="18px" />
          </div>
          <div className="space-y-2">
            <Skeleton width="60px" height="14px" />
            <Skeleton width="100%" height="8px" />
          </div>
          <div className="space-y-2">
            <Skeleton width="60px" height="14px" />
            <Skeleton width="40%" height="18px" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function AssessmentSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton width="100px" height="20px" />
        <Skeleton width="80%" height="16px" />
      </div>
      
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton width="90%" height="18px" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, optionIdx) => (
              <Skeleton key={optionIdx} width="100%" height="48px" />
            ))}
          </div>
        </div>
      ))}
      
      <Skeleton width="120px" height="44px" />
    </div>
  )
}

export function ConversationListSkeleton() {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="p-3 rounded-xl space-y-2">
          <Skeleton width="90%" height="16px" />
          <Skeleton width="60%" height="12px" />
        </div>
      ))}
    </div>
  )
}

export function PageHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton variant="rounded" width="40px" height="40px" />
      <div className="space-y-2">
        <Skeleton width="150px" height="28px" />
        <Skeleton width="100px" height="16px" />
      </div>
    </div>
  )
}