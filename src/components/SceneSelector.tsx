import type { LucideIcon } from 'lucide-react';
import { MessageCircle, FileText, Users, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '@/store';
import { ChatSceneId } from '@/types';
import { useState } from 'react';

const scenes: { id: ChatSceneId; name: string; icon: LucideIcon; description: string; welcome: string }[] = [
  {
    id: 'career',
    name: '职业咨询',
    icon: MessageCircle,
    description: '规划职业方向',
    welcome: '你好！我是你的职业规划导师。你可以问我关于行业趋势、岗位选择、能力规划等问题，我会帮你找到最适合自己的发展方向。',
  },
  {
    id: 'interview',
    name: '模拟面试',
    icon: Users,
    description: '面试技巧训练',
    welcome: '你好！我是大厂资深面试官。你可以说"开始面试"来模拟真实面试，也可以问我面试技巧、常见问题、回答框架等。我会一步步帮你提升面试能力。',
  },
  {
    id: 'resume',
    name: '简历诊断',
    icon: FileText,
    description: '优化简历内容',
    welcome: '你好！我是负责校招简历筛选的HR。你可以把简历内容发给我，我会从筛选者的角度帮你找出亮点和不足，给出具体的优化建议。',
  },
];

export default function SceneSelector() {
  const { conversations, currentConversationId, switchConversation, createNewConversation, setCurrentScene } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSwitch = (sceneId: ChatSceneId) => {
    const sceneConversations = conversations
      .filter(c => c.scene === sceneId)
      .sort((a, b) => b.updatedAt - a.updatedAt);
    
    if (sceneConversations.length > 0) {
      switchConversation(sceneConversations[0].id);
    } else {
      setCurrentScene(sceneId);
    }
  };

  const handleNewChat = (sceneId: ChatSceneId) => {
    createNewConversation(sceneId);
  };

  const currentScene = conversations.find(c => c.id === currentConversationId)?.scene || 'career';
  const activeSceneData = scenes.find((s) => s.id === currentScene);

  return (
    <div className="mb-2">
      <div className="flex gap-1.5 mb-2">
        {scenes.map((scene) => {
          const isActive = currentScene === scene.id;
          return (
            <div key={scene.id} className="relative group">
              <button
                onClick={() => handleSwitch(scene.id)}
                className={`btn-micro flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-gray-200/50'
                }`}
              >
                <scene.icon className="w-3.5 h-3.5" />
                <span>{scene.name}</span>
              </button>
              <button
                onClick={() => handleNewChat(scene.id)}
                className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                  isActive ? 'bg-white text-blue-500' : 'bg-blue-500 text-white'
                }`}
                title="新建对话"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>
          );
        })}
      </div>

      {activeSceneData && (
        <div className="bg-white/60 border border-blue-100/40 rounded-lg shadow-sm overflow-hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-blue-50/50 transition-colors"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <activeSceneData.icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <p className="text-xs font-medium text-blue-800 truncate">
                {activeSceneData.name} - {activeSceneData.description}
              </p>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 transition-transform" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 transition-transform" />
            )}
          </button>
          {isExpanded && (
            <div className="px-3 pb-3 pl-9">
              <p className="text-xs text-blue-700/80 leading-relaxed">{activeSceneData.welcome}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
