import { useAppStore } from '@/store';
import AssessmentForm from '@/components/AssessmentForm';
import RadarChart from '@/components/RadarChart';
import FullDataExportDialog from '@/components/FullDataExportDialog';
import { usePageLoading } from '@/hooks/useLoading';
import { ProfileSkeleton, AssessmentSkeleton } from '@/components/PageSkeletons';
import { User, CheckCircle, RefreshCw, Download } from 'lucide-react';
import { useState } from 'react';

const gradeLabels: Record<string, string> = {
  freshman: '大一',
  sophomore: '大二',
  junior: '大三',
  senior: '大四',
  graduate: '研究生',
};

export default function Profile() {
  const profile = useAppStore((state) => state.profile);
  const resetAssessment = useAppStore((state) => state.resetAssessment);
  const isLoading = usePageLoading(700);
  const [showExportDialog, setShowExportDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2A2D37] dark:bg-[#353945] rounded-xl animate-pulse" />
          <div className="space-y-2">
            <div className="w-32 h-7 bg-[#2A2D37] dark:bg-[#353945] rounded animate-pulse" />
            <div className="w-24 h-4 bg-[#2A2D37] dark:bg-[#353945] rounded animate-pulse" />
          </div>
        </div>
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-[#E8EAED] dark:via-[#B0B3B8] dark:to-[#E8EAED] bg-clip-text text-transparent">个人画像</h1>
          <p className="text-sm text-gray-500 dark:text-[#8B8F96]">了解你的优势和方向</p>
        </div>
      </div>

      {!profile.grade && (
        <div className="bg-white/80 dark:bg-[#1A1D27]/80 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 border border-blue-100/50 dark:border-[#5A9CFF]/20 shadow-soft">
          <p className="text-blue-600 dark:text-[#5A9CFF]">请先在首页选择你的年级</p>
        </div>
      )}

      {profile.grade && !profile.assessmentCompleted && (
        <>
          <div className="bg-white/80 dark:bg-[#1A1D27]/80 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 border border-green-100/50 dark:border-[#2BA471]/20 shadow-soft">
          <CheckCircle className="w-5 h-5 text-green-500 dark:text-[#2BA471]" />
          <span className="text-gray-700 dark:text-[#B0B3B8]">已选择年级：<strong>{gradeLabels[profile.grade]}</strong></span>
        </div>
          <AssessmentForm />
        </>
      )}

      {profile.grade && profile.assessmentCompleted && !isLoading && (
        <div className="space-y-6">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setShowExportDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">导出数据</span>
            </button>
            <button
              onClick={resetAssessment}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">更新画像/重新测评</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RadarChart />
            
            <div className="bg-white/80 dark:bg-[#1A1D27]/80 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-100/60 dark:border-[#2A2D37]/80 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-[#E8EAED] mb-4">画像信息</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500 dark:text-[#8B8F96]">年级</span>
                  <p className="font-medium text-gray-900 dark:text-[#E8EAED]">{gradeLabels[profile.grade || '']}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-[#8B8F96]">综合评分</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-[#2A2D37] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${profile.assessmentScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 dark:from-[#5A9CFF] dark:to-purple-400 bg-clip-text text-transparent">{profile.assessmentScore}%</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-[#8B8F96]">测评状态</span>
                  <p className="font-medium text-green-600 dark:text-[#2BA471]">已完成</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {profile.grade && !profile.assessmentCompleted && isLoading && (
        <AssessmentSkeleton />
      )}

      <FullDataExportDialog isOpen={showExportDialog} onClose={() => setShowExportDialog(false)} />
    </div>
  );
}