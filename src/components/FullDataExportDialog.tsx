import { X, Download, Database, User, MessageCircle, Heart, Check } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/store';
import { useToastStore } from '@/store/toastStore';
import {
  generateFullDataExport,
  sanitizeExportData,
  exportDataToJSON,
  downloadExportFile,
  getExportFilename,
  ExportScope,
} from '@/utils/fullDataExport';

interface FullDataExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FullDataExportDialog({ isOpen, onClose }: FullDataExportDialogProps) {
  const { profile, onboarding, conversations, favoriteJobs } = useAppStore();
  const [selectedScope, setSelectedScope] = useState<ExportScope>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);

  const handleExport = () => {
    setIsExporting(true);

    try {
      const exportData = generateFullDataExport(
        profile,
        onboarding,
        conversations,
        favoriteJobs,
        selectedScope
      );

      const sanitizedData = sanitizeExportData(exportData);
      const jsonContent = exportDataToJSON(sanitizedData);
      const filename = getExportFilename(selectedScope);

      downloadExportFile(jsonContent, filename);
      useToastStore.getState().success('导出成功', `数据已保存为 ${filename}`);
      onClose();
    } catch (error) {
      console.error('导出失败:', error);
      useToastStore.getState().error('导出失败', '请稍后重试');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    try {
      const exportData = generateFullDataExport(
        profile,
        onboarding,
        conversations,
        favoriteJobs,
        selectedScope
      );

      const sanitizedData = sanitizeExportData(exportData);
      const jsonContent = exportDataToJSON(sanitizedData);

      await navigator.clipboard.writeText(jsonContent);
      setCopied(true);
      useToastStore.getState().success('复制成功', '数据已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
      useToastStore.getState().error('复制失败', '请稍后重试');
    }
  };

  const scopeOptions = [
    {
      value: 'all' as ExportScope,
      label: '全部数据',
      icon: Database,
      description: '个人画像、对话记录、收藏岗位等所有数据',
      stats: `${conversations.length} 个对话, ${totalMessages} 条消息, ${favoriteJobs.length} 个收藏`,
    },
    {
      value: 'profile-only' as ExportScope,
      label: '个人画像',
      icon: User,
      description: '年级信息、测评结果、能力画像、成长进度等',
      stats: `评分 ${profile.assessmentScore}%, 已完成测评: ${profile.assessmentCompleted ? '是' : '否'}`,
    },
    {
      value: 'conversations-only' as ExportScope,
      label: '对话记录',
      icon: MessageCircle,
      description: '所有历史对话记录,包含消息内容和场景信息',
      stats: `${conversations.length} 个对话, ${totalMessages} 条消息`,
    },
    {
      value: 'favorites-only' as ExportScope,
      label: '收藏岗位',
      icon: Heart,
      description: '已收藏的腾讯岗位信息',
      stats: `${favoriteJobs.length} 个收藏岗位`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">数据导出</h2>
            <p className="text-sm text-gray-500 mt-1">备份你的所有成长数据</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">选择导出范围</label>
            <div className="space-y-2">
              {scopeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedScope(option.value)}
                    className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      selectedScope === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      selectedScope === option.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                      <div className="text-xs text-blue-600 mt-1 font-medium">{option.stats}</div>
                    </div>
                    {selectedScope === option.value && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">导出说明</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• 数据以 JSON 格式导出,方便备份和迁移</li>
              <li>• 包含个人画像、对话记录、收藏岗位等完整数据</li>
              <li>• 导出的文件可导入到其他设备或用于数据分析</li>
              <li>• 敏感数据(如图片预览)已自动清理</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 space-y-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Download className="w-5 h-5" />
            {isExporting ? '导出中...' : '导出 JSON 文件'}
          </button>

          <button
            onClick={handleCopy}
            disabled={copied}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-green-600">已复制</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制为 JSON
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
