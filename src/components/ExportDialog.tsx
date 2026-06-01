import { X, FileText, Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/store';
import { useToastStore } from '@/store/toastStore';
import {
  exportConversation,
  downloadFile,
  copyToClipboard,
  ExportFormat,
} from '@/utils/conversationExport';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
  const { conversations, currentConversationId } = useAppStore();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('txt');
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [includeReasoning, setIncludeReasoning] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];
  const conversationTitle = currentConversation?.title || '未命名对话';

  if (!isOpen || messages.length === 0) return null;

  const handleExport = () => {
    setIsExporting(true);
    
    try {
      const content = exportConversation(messages, conversationTitle, selectedFormat, {
        includeTimestamp,
        includeReasoning,
      });

      const formatExtensions = {
        txt: 'txt',
        markdown: 'md',
        html: 'html',
      };

      const formatMimeTypes = {
        txt: 'text/plain',
        markdown: 'text/markdown',
        html: 'text/html',
      };

      const extension = formatExtensions[selectedFormat];
      const mimeType = formatMimeTypes[selectedFormat];
      const filename = `${conversationTitle}_${new Date().toISOString().slice(0, 10)}.${extension}`;

      downloadFile(content, filename, mimeType);
      useToastStore.getState().success('导出成功', `对话已保存为 ${filename}`);
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
      const content = exportConversation(messages, conversationTitle, 'txt', {
        includeTimestamp,
        includeReasoning,
      });

      const success = await copyToClipboard(content);
      
      if (success) {
        setCopied(true);
        useToastStore.getState().success('复制成功', '对话内容已复制到剪贴板');
        setTimeout(() => setCopied(false), 2000);
      } else {
        useToastStore.getState().error('复制失败', '请手动选择复制');
      }
    } catch (error) {
      console.error('复制失败:', error);
      useToastStore.getState().error('复制失败', '请稍后重试');
    }
  };

  const formatOptions = [
    { value: 'txt' as ExportFormat, label: '纯文本 (TXT)', icon: FileText, description: '通用格式，可在任何文本编辑器中打开' },
    { value: 'markdown' as ExportFormat, label: 'Markdown (MD)', icon: FileText, description: '支持格式化的标记语言，适合技术文档' },
    { value: 'html' as ExportFormat, label: '网页 (HTML)', icon: FileText, description: '带样式的完整网页，可直接在浏览器中查看' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 pb-8">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">导出对话</h2>
            <p className="text-sm text-gray-500 mt-1">{conversationTitle} · {messages.length} 条消息</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-3">选择导出格式</label>
            <div className="space-y-2">
              {formatOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedFormat(option.value)}
                    className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      selectedFormat === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      selectedFormat === option.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                    </div>
                    {selectedFormat === option.value && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">导出选项</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTimestamp}
                  onChange={(e) => setIncludeTimestamp(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">包含时间戳</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeReasoning}
                  onChange={(e) => setIncludeReasoning(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">包含AI思考过程</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 space-y-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Download className="w-5 h-5" />
            {isExporting ? '导出中...' : '导出文件'}
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
                <Copy className="w-5 h-5" />
                复制为文本
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
