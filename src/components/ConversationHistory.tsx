import { useAppStore } from '@/store';
import { MessageCircle, Users, FileText, Trash2, Plus, Search, X } from 'lucide-react';
import { ChatSceneId } from '@/types';
import { useState, useMemo } from 'react';

const sceneIcons: Record<ChatSceneId, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  career: MessageCircle,
  interview: Users,
  resume: FileText,
};

const sceneColors: Record<ChatSceneId, string> = {
  career: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  interview: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
  resume: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400',
};

function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedHighlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        new RegExp(escapedHighlight, 'i').test(part) ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/30 text-gray-900 dark:text-gray-100 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export default function ConversationHistory() {
  const { conversations, currentConversationId, switchConversation, deleteConversation, createNewConversation, currentScene } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const sortedConversations = useMemo(() => {
    const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

    if (!searchQuery.trim()) {
      return sorted;
    }

    const query = searchQuery.toLowerCase().trim();
    return sorted.filter((conv) => {
      const titleMatch = conv.title.toLowerCase().includes(query);
      const messageMatch = conv.messages.some((msg) =>
        msg.content.toLowerCase().includes(query)
      );
      return titleMatch || messageMatch;
    });
  }, [conversations, searchQuery]);

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-[#2A2D37] space-y-3">
        <button
          onClick={() => createNewConversation(currentScene)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>新建对话</span>
        </button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索对话历史..."
            className="w-full pl-10 pr-8 py-2 bg-gray-50 dark:bg-[#181C28] border border-gray-200 dark:border-[#2A2D37] rounded-xl text-sm text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="清空搜索"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedConversations.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">未找到匹配的对话</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">尝试使用不同的关键词搜索</p>
          </div>
        )}

        {sortedConversations.map((conv) => {
          const Icon = sceneIcons[conv.scene];
          const colorClass = sceneColors[conv.scene];
          const isActive = conv.id === currentConversationId;

          return (
            <div
              key={conv.id}
              className={`group flex items-start gap-3 px-4 py-3 border-b border-gray-100 dark:border-[#2A2D37] hover:bg-gray-50 dark:hover:bg-[#181C28] cursor-pointer transition-colors ${
                isActive ? 'bg-blue-50 dark:bg-[#0052D9]/10 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => switchConversation(conv.id)}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                  <HighlightText text={conv.title} highlight={searchQuery} />
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatTime(conv.updatedAt)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conv.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-all"
                title="删除对话"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
