import TencentSection from '@/components/TencentSection';
import FavoriteJobs from '@/components/FavoriteJobs';
import { usePageLoading } from '@/hooks/useLoading';
import { JobCardSkeleton } from '@/components/PageSkeletons';
import { Building2, Star } from 'lucide-react';
import { useState } from 'react';

export default function Tencent() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'favorites'>('jobs');
  const isLoading = usePageLoading(900);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-orange-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">鹅厂专区</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">了解腾讯的岗位、文化和培养体系</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === 'jobs'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-sm'
            }`}
          >
            岗位浏览
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-1 ${
              activeTab === 'favorites'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-sm'
            }`}
          >
            <Star className="w-4 h-4" />
            我的收藏
          </button>
        </div>
      </div>

      {isLoading ? (
        <JobCardSkeleton count={6} />
      ) : (
        activeTab === 'jobs' ? <TencentSection /> : <FavoriteJobs />
      )}
    </div>
  );
}