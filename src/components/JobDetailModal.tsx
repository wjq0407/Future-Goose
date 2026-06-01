import { TencentJob } from '@/types';
import { X, MapPin, Briefcase, CheckCircle, Star, ExternalLink } from 'lucide-react';
import { useAppStore } from '@/store';

interface JobDetailModalProps {
  job: TencentJob;
  onClose: () => void;
}

export default function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  const { toggleFavoriteJob, isJobFavorited, showToast } = useAppStore();

  // 详情展开日志 - 验证数据来源
  console.group('🟣 [JobDetailModal] 详情展开');
  console.log('岗位ID:', job.id);
  console.log('岗位标题:', job.title);
  console.log('岗位分类:', job.category);
  console.log('工作地点:', job.location);
  console.log('工作年限要求:', job.workYears);
  console.log('招聘子类型:', job.recruitSubType === 'fresh' ? '应届毕业生' : job.recruitSubType === 'intern' ? '实习生' : '未分类');
  console.log('数据来源验证:');
  console.log('  - applyLink:', job.applyLink);
  console.log('  - bgName (业务组):', job.bgName);
  console.log('  - productName (产品):', job.productName);
  console.log('  - fullDescription 存在:', !!job.fullDescription);
  console.log('  - fullResponsibilities 存在:', !!job.fullResponsibilities, job.fullResponsibilities ? `(${job.fullResponsibilities.length}条)` : '');
  console.log('  - fullRequirements 存在:', !!job.fullRequirements, job.fullRequirements ? `(${job.fullRequirements.length}条)` : '');
  console.log('  - detailLoaded:', job.detailLoaded);
  console.log('描述内容:', job.description?.substring(0, 100) + (job.description?.length > 100 ? '...' : ''));
  console.log('岗位职责:', job.responsibilities);
  console.log('任职要求:', job.qualifications);
  console.log('加分项:', job.plusItems);
  console.groupEnd();

  const handleToggleFavorite = () => {
    const isFavorited = toggleFavoriteJob(job.id);
    if (isFavorited) {
      showToast(`已收藏「${job.title}」`, 'success');
    } else {
      showToast(`已取消收藏「${job.title}」`, 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-strong max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-100/50">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg font-medium">
              {job.category}
            </span>
            {job.location && (
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-lg transition-colors ${
                isJobFavorited(job.id)
                  ? 'bg-yellow-50 text-yellow-400 hover:bg-yellow-100'
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-blue-500'
              }`}
              title={isJobFavorited(job.id) ? '取消收藏' : '收藏'}
            >
              <Star className={`w-5 h-5 ${isJobFavorited(job.id) ? 'fill-yellow-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              title="关闭"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
            <p className="text-gray-600">{job.description}</p>
          </div>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                岗位职责
              </h3>
              <ul className="space-y-2">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.qualifications && job.qualifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                任职要求
              </h3>
              <ul className="space-y-2">
                {job.qualifications.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.plusItems && job.plusItems.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-100">
              <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                加分项
              </h3>
              <ul className="space-y-2">
                {job.plusItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-amber-700">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.applyLink && (
            <div className="flex justify-center pt-4 border-t border-gray-100">
              <a
                href={job.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <span>立即申请</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
