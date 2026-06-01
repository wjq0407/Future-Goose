import ChatInterface from '@/components/ChatInterface';
import ConversationHistory from '@/components/ConversationHistory';
import ExportDialog from '@/components/ExportDialog';
import { Sparkles, Zap, PanelRightOpen, PanelRightClose, Share2 } from 'lucide-react';
import { useAppStore } from '@/store';
import { useState } from 'react';
import { ApiKeyTrigger } from '@/components/ApiKeyModal';
import GooseMascot from '@/components/GooseMascot';

export default function Chat() {
  const conversations = useAppStore((state) => state.conversations);
  const currentConversationId = useAppStore((state) => state.currentConversationId);
  const showExportDialog = useAppStore((state) => state.showExportDialog);
  const setShowExportDialog = useAppStore((state) => state.setShowExportDialog);
  const customApiConfig = useAppStore((state) => state.customApiConfig);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const hasMessages = (currentConversation?.messages.length || 0) > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-tencent-blue via-tencent-blue-light to-tencent-blue-dark rounded-xl flex items-center justify-center shadow-lg shadow-tencent-blue/30">
            <GooseMascot mood="happy" size="sm" className="text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-[#E8EAED] dark:via-[#B0B3B8] dark:to-[#E8EAED] bg-clip-text text-transparent">AI对话陪伴</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500 dark:text-[#8B8F96]">与AI助手交流，获取个性化建议</p>
            {(() => {
              const hasDefaultKey = !!import.meta.env.VITE_DEFAULT_API_KEY;
              const hasCustomApi = !!customApiConfig?.apiKey;
              const hasApi = hasDefaultKey || hasCustomApi;
              
              if (hasApi) {
                return (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-[#2BA471]/10 dark:to-[#2BA471]/5 text-green-700 dark:text-[#2BA471] text-xs rounded-full font-medium border border-green-100/50 dark:border-[#2BA471]/20 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    AI模式
                  </span>
                );
              } else {
                return (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#5C6068]/10 dark:to-[#5C6068]/5 text-gray-600 dark:text-[#8B8F96] text-xs rounded-full font-medium border border-gray-200/50 dark:border-[#2A2D37]/50 shadow-sm">
                    <Zap className="w-3 h-3" />
                    演示模式
                  </span>
                );
              }
            })()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasMessages && (
            <button
              onClick={() => setShowExportDialog(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              title="导出/分享对话"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">导出/分享</span>
            </button>
          )}
          <ApiKeyTrigger />
        </div>
      </div>

      <div className="bg-white/80 dark:bg-[#1A1D27]/80 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-100/60 dark:border-[#2A2D37]/80 flex h-[calc(100vh-120px)] min-h-[600px] overflow-hidden">
        <div className="flex-1 p-6 relative">
          <ChatInterface />
          <button
            onClick={() => setSidebarOpen(true)}
            className={`absolute top-2 right-2 z-10 p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all ${
              sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            title="展开历史对话"
          >
            <PanelRightOpen className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`flex-shrink-0 border-l border-gray-200 dark:border-[#2A2D37] transition-all duration-300 ease-in-out overflow-hidden bg-white dark:bg-[#1A1D27] ${
            sidebarOpen ? 'w-72' : 'w-0 border-l-0'
          }`}
        >
          <div className="w-72 h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-[#2A2D37]">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-[#E8EAED]">历史对话</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#242830] text-gray-500 dark:text-[#8B8F96] transition-colors"
                title="收起历史"
              >
                <PanelRightClose className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ConversationHistory />
            </div>
          </div>
        </div>
      </div>
      <ExportDialog isOpen={showExportDialog} onClose={() => setShowExportDialog(false)} />
    </div>
  );
}