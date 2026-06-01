import { useAppStore } from '@/store';
import { tencentJobs } from '@/data/tencentInfo';
import { Star, Trash2, Briefcase } from 'lucide-react';
import { useState } from 'react';
import JobDetailModal from './JobDetailModal';
import { TencentJob } from '@/types';

export default function FavoriteJobs() {
  const { favoriteJobs, toggleFavoriteJob, showToast } = useAppStore();
  const [selectedJob, setSelectedJob] = useState<TencentJob | null>(null);

  const favoritedJobDetails = favoriteJobs
    .map(fj => {
      const job = tencentJobs.find(j => j.id === fj.jobId);
      return job ? { ...job, favoritedAt: fj.favoritedAt } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b!.favoritedAt - a!.favoritedAt);

  const handleRemoveFavorite = (jobId: string, jobTitle: string) => {
    toggleFavoriteJob(jobId);
    showToast(`已取消收藏「${jobTitle}」`, 'info');
  };

  if (favoriteJobs.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          我的收藏
        </h3>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">还没有收藏的岗位</p>
          <p className="text-sm text-gray-400 mt-2">浏览鹅厂专区，点击星标收藏感兴趣的岗位</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            我的收藏
            <span className="text-sm font-normal text-gray-500">
              ({favoriteJobs.length}个岗位)
            </span>
          </h3>
        </div>
        <div className="space-y-3">
          {favoritedJobDetails.map((job) => (
            <div
              key={job!.id}
              onClick={() => setSelectedJob(job)}
              className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium">
                      {job!.category}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{job!.title}</h4>
                  <p className="text-sm text-gray-500 mb-2">{job!.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {job!.requirements.slice(0, 3).map((req, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(job!.id, job!.title);
                  }}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  title="取消收藏"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </>
  );
}
