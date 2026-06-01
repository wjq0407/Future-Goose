import GrowthTimeline from '@/components/GrowthTimeline';
import { usePageLoading } from '@/hooks/useLoading';
import { TimelineSkeleton } from '@/components/PageSkeletons';
import { TrendingUp } from 'lucide-react';

export default function Growth() {
  const isLoading = usePageLoading(800);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-[#E8EAED] dark:via-[#B0B3B8] dark:to-[#E8EAED] bg-clip-text text-transparent">成长规划</h1>
          <p className="text-sm text-gray-500 dark:text-[#8B8F96]">查看你的专属成长路径</p>
        </div>
      </div>

      {isLoading ? <TimelineSkeleton /> : <GrowthTimeline />}
    </div>
  );
}