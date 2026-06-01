import { useAppStore } from '@/store';
import { quickQuestions } from '@/services/aiApi';

export default function QuickQuestions({
  questions,
  showTitle = true,
}: {
  questions?: string[];
  showTitle?: boolean;
}) {
  const { profile, conversations, currentConversationId, sendMessage } = useAppStore();
  const grade = profile.grade;
  const currentScene = conversations.find(c => c.id === currentConversationId)?.scene || 'career';

  const questionsToShow = questions || quickQuestions[currentScene]?.[grade] || [];

  if (questionsToShow.length === 0) return null;

  return (
    <div className="ml-9 mt-2 chat-quick-questions-enter">
      {showTitle && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-goose-orange to-orange-400 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">猜你想问</span>
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {questionsToShow.map((q, index) => (
          <button
            key={index}
            onClick={() => sendMessage(q)}
            className="btn-secondary-micro px-3 py-1.5 bg-gradient-to-br from-white to-gray-50 dark:from-[#1E2230] dark:to-[#181C28] text-gray-700 dark:text-gray-300 rounded-full text-xs border border-gray-200 dark:border-[#2A2D37] hover:border-tencent-blue/40 hover:text-tencent-blue dark:hover:text-tencent-blue-light hover:shadow-sm transition-all"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
