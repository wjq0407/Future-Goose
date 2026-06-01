import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, UserGrade, ChatMessage, ChatSceneId, Conversation, ChatAttachment, OnboardingState, FavoriteJob } from '@/types';
import { callAIAPIStream, getDemoStreamResponse, API_CONFIG, getAPIErrorMessage, abortAPIStream } from '@/services/aiApi';
import { useToastStore } from './toastStore';
import { calculateAutoProgress, getProgressBreakdown } from '@/utils/progressCalculator';

const STORAGE_KEY = 'future_goose_store';

export type ApiMode = 'free' | 'custom' | 'demo';

interface AppStore {
  profile: UserProfile;
  setGrade: (grade: UserGrade) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeAssessment: (scores: Record<string, number>) => void;
  updateMilestone: (milestoneId: string, completed: boolean) => void;
  autoCalculateProgress: () => void;
  getProgressBreakdown: () => Record<string, number>;
  
  onboarding: OnboardingState;
  completeOnboarding: () => void;
  startOnboarding: () => void;
  setOnboardingStep: (step: number) => void;
  hideOnboarding: () => void;
  
  conversations: Conversation[];
  currentConversationId: string | null;
  currentScene: ChatSceneId;
  isTyping: boolean;
  streamingContent: string;
  streamingReasoningContent: string;
  streamingMessageId: string | null;
  thinkingPlaceholder: string;
  apiKey: string;
  apiError: string | null;
  apiMode: ApiMode;
  showApiKeyModal: boolean;
  showExportDialog: boolean;
  selectedModel: string;
  customApiConfig: { apiKey: string; baseUrl: string } | null;
  
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  
  favoriteJobs: FavoriteJob[];
  toggleFavoriteJob: (jobId: string) => boolean;
  isJobFavorited: (jobId: string) => boolean;
  getFavoriteJobs: () => FavoriteJob[];
  
  setApiKey: (key: string) => void;
  setApiMode: (mode: ApiMode) => void;
  setShowApiKeyModal: (show: boolean) => void;
  setShowExportDialog: (show: boolean) => void;
  setSelectedModel: (model: string) => void;
  setCustomApiConfig: (config: { apiKey: string; baseUrl: string }) => void;
  setFreeMode: () => void;
  setDemoMode: () => void;
  setCurrentScene: (scene: ChatSceneId) => void;
  createNewConversation: (scene: ChatSceneId) => void;
  switchConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  sendMessage: (content: string, attachments?: ChatAttachment[]) => void;
  resetProfile: () => void;
  resetAssessment: () => void;
  abortStream: () => void;
}

const defaultProfile: UserProfile = {
  grade: null,
  interests: [],
  skills: {},
  careerDirection: [],
  goals: [],
  assessmentScore: 0,
  assessmentCompleted: false,
  milestones: {},
};

const defaultOnboarding: OnboardingState = {
  isCompleted: false,
  currentStep: 0,
  isShowing: false,
};

const thinkingPlaceholders = [
  '让我想想...',
  '正在为你分析...',
  '正在思考中...',
  '让我来帮你解答...',
  '正在整理思路...',
  '稍等,让我思考一下...',
];

function getRandomThinkingPlaceholder(): string {
  return thinkingPlaceholders[Math.floor(Math.random() * thinkingPlaceholders.length)];
}

function generateConversationTitle(messages: ChatMessage[], scene: ChatSceneId): string {
  if (messages.length === 0) {
    const sceneLabels: Record<ChatSceneId, string> = {
      career: '职业咨询',
      interview: '模拟面试',
      resume: '简历诊断',
    };
    return `新的${sceneLabels[scene]}对话`;
  }
  
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (firstUserMessage) {
    const content = firstUserMessage.content.trim();
    return content.length > 30 ? content.substring(0, 30) + '...' : content;
  }
  
  const sceneLabels: Record<ChatSceneId, string> = {
    career: '职业咨询',
    interview: '模拟面试',
    resume: '简历诊断',
  };
  return `${sceneLabels[scene]}对话`;
}

const now = Date.now();
const initialConversation: Conversation = {
  id: now.toString(),
  title: '新的职业咨询对话',
  scene: 'career',
  messages: [],
  createdAt: now,
  updatedAt: now,
};

export type { AppStore };
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      onboarding: defaultOnboarding,
      setGrade: (grade) => {
        set((state) => ({
          profile: { ...state.profile, grade },
        }));
      },
      completeOnboarding: () => {
        set({ onboarding: { isCompleted: true, currentStep: 0, isShowing: false } });
      },
      startOnboarding: () => {
        set({ onboarding: { isCompleted: false, currentStep: 0, isShowing: true } });
      },
      setOnboardingStep: (step) => {
        set((state) => ({
          onboarding: { ...state.onboarding, currentStep: step },
        }));
      },
      hideOnboarding: () => {
        set((state) => ({
          onboarding: { ...state.onboarding, isShowing: false },
        }));
      },
      updateProfile: (updates) => {
        set((state) => ({
          profile: { ...state.profile, ...updates },
        }));
      },
      completeAssessment: (scores) => {
        const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
        set((state) => ({
          profile: {
            ...state.profile,
            skills: scores,
            assessmentScore: Math.round(avgScore),
            assessmentCompleted: true,
          },
        }));
        
        setTimeout(() => {
          get().autoCalculateProgress();
        }, 100);
      },
      updateMilestone: (milestoneId, completed) => {
        set((state) => ({
          profile: {
            ...state.profile,
            milestones: {
              ...state.profile.milestones,
              [milestoneId]: completed,
            },
          },
        }));
      },
      autoCalculateProgress: () => {
        set((state) => {
          const autoMilestones = calculateAutoProgress(state.profile, state.conversations);
          return {
            profile: {
              ...state.profile,
              milestones: autoMilestones,
            },
          };
        });
      },
      getProgressBreakdown: () => {
        const state = get();
        return getProgressBreakdown(state.profile, state.conversations);
      },
      
      conversations: [initialConversation],
      currentConversationId: initialConversation.id,
      currentScene: 'career',
      isTyping: false,
      streamingContent: '',
      streamingReasoningContent: '',
      streamingMessageId: null,
      thinkingPlaceholder: '',
      apiKey: API_CONFIG.getApiKey() || import.meta.env.VITE_DEFAULT_API_KEY || '',
      apiError: null,
      apiMode: import.meta.env.VITE_DEFAULT_API_KEY ? 'free' : 'demo',
      showApiKeyModal: false,
      showExportDialog: false,
      selectedModel: localStorage.getItem('future_goose_model') || API_CONFIG.defaultModel,
      customApiConfig: localStorage.getItem('future_goose_api_key')
        ? {
            apiKey: localStorage.getItem('future_goose_api_key') || '',
            baseUrl: localStorage.getItem('future_goose_base_url') || 'https://open.bigmodel.cn/api/paas/v4',
          }
        : null,
      favoriteJobs: [],
      showToast: (message, type = 'info') => {
        const { success, error, warning, info } = useToastStore.getState();
        const toastMap = { success, error, warning, info };
        toastMap[type](message);
      },
      toggleFavoriteJob: (jobId) => {
        const isFavorited = get().favoriteJobs.some(fj => fj.jobId === jobId);
        if (isFavorited) {
          set((state) => ({
            favoriteJobs: state.favoriteJobs.filter(fj => fj.jobId !== jobId),
          }));
          return false;
        } else {
          set((state) => ({
            favoriteJobs: [...state.favoriteJobs, { jobId, favoritedAt: Date.now() }],
          }));
          return true;
        }
      },
      isJobFavorited: (jobId) => {
        return get().favoriteJobs.some(fj => fj.jobId === jobId);
      },
      getFavoriteJobs: () => {
        return get().favoriteJobs;
      },
      setApiKey: (key) => {
        API_CONFIG.setApiKey(key);
        set({ apiKey: key, apiError: null, showApiKeyModal: false });
      },
      setApiMode: (mode) => {
        set({ apiMode: mode });
      },
      setFreeMode: () => {
        const defaultKey = import.meta.env.VITE_DEFAULT_API_KEY || '';
        if (defaultKey) {
          localStorage.removeItem('future_goose_api_key');
          localStorage.removeItem('future_goose_base_url');
          API_CONFIG.setApiKey('');
          set({ 
            customApiConfig: null, 
            apiMode: 'free', 
            apiKey: defaultKey 
          });
        }
      },
      setDemoMode: () => {
        set({ apiMode: 'demo' });
      },
      setShowApiKeyModal: (show) => {
        set({ showApiKeyModal: show });
      },
      setShowExportDialog: (show) => {
        set({ showExportDialog: show });
      },
      setSelectedModel: (model) => {
        localStorage.setItem('future_goose_model', model);
        set({ selectedModel: model });
      },
      setCustomApiConfig: (config) => {
        localStorage.setItem('future_goose_api_key', config.apiKey);
        localStorage.setItem('future_goose_base_url', config.baseUrl);
        API_CONFIG.setApiKey(config.apiKey);
        API_CONFIG.setBaseUrl(config.baseUrl);
        set({ 
          customApiConfig: config, 
          apiMode: 'custom', 
          apiKey: config.apiKey,
          showApiKeyModal: false 
        });
      },
      setCurrentScene: (scene) => {
        set({ currentScene: scene });
      },
      createNewConversation: (scene) => {
        const { conversations, currentConversationId } = get();
        
        if (currentConversationId) {
          const currentConv = conversations.find(c => c.id === currentConversationId);
          if (currentConv && currentConv.messages.length > 0) {
            const updatedConversations = conversations.map(c => {
              if (c.id === currentConversationId) {
                return {
                  ...c,
                  title: generateConversationTitle(c.messages, c.scene),
                  updatedAt: Date.now(),
                };
              }
              return c;
            });
            set({ conversations: updatedConversations });
          }
        }
        
        const newId = Date.now().toString();
        const sceneLabels: Record<ChatSceneId, string> = {
          career: '职业咨询',
          interview: '模拟面试',
          resume: '简历诊断',
        };
        
        const newConversation: Conversation = {
          id: newId,
          title: `新的${sceneLabels[scene]}对话`,
          scene,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set({
          conversations: [...conversations, newConversation],
          currentConversationId: newId,
          currentScene: scene,
          isTyping: false,
          streamingContent: '',
          streamingMessageId: null,
          thinkingPlaceholder: '',
        });
      },
      switchConversation: (conversationId) => {
        const { conversations } = get();
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
          set({
            currentConversationId: conversationId,
            currentScene: conversation.scene,
            isTyping: false,
            streamingContent: '',
            streamingMessageId: null,
            thinkingPlaceholder: '',
          });
        }
      },
      deleteConversation: (conversationId) => {
        const { conversations, currentConversationId } = get();
        const updatedConversations = conversations.filter(c => c.id !== conversationId);
        
        if (updatedConversations.length === 0) {
          const newId = Date.now().toString();
          const newConversation: Conversation = {
            id: newId,
            title: '新的职业咨询对话',
            scene: 'career',
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          set({
            conversations: [newConversation],
            currentConversationId: newId,
            currentScene: 'career',
          });
        } else if (currentConversationId === conversationId) {
          const lastConv = updatedConversations[updatedConversations.length - 1];
          set({
            conversations: updatedConversations,
            currentConversationId: lastConv.id,
            currentScene: lastConv.scene,
          });
        } else {
          set({ conversations: updatedConversations });
        }
      },
      sendMessage: async (content, attachments) => {
        const { profile, currentConversationId, currentScene, apiMode } = get();
        
        if (!currentConversationId) return;
        
        const userMessage: ChatMessage = {
          id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          role: 'user',
          content,
          timestamp: Date.now(),
          scene: currentScene,
          attachments,
        };
        
        const shouldUseApi = apiMode === 'free' || apiMode === 'custom';
        
        const aiMessageId = `ai_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        
        set((state) => ({
          conversations: state.conversations.map(c => {
            if (c.id === state.currentConversationId) {
              return {
                ...c,
                messages: [...c.messages, userMessage],
                updatedAt: Date.now(),
              };
            }
            return c;
          }),
          isTyping: true,
          streamingContent: '',
          streamingReasoningContent: '',
          streamingMessageId: aiMessageId,
          thinkingPlaceholder: getRandomThinkingPlaceholder(),
          apiError: null,
        }));
        
        try {
          const handleChunk = (chunk: string) => {
            set((state) => ({
              streamingContent: state.streamingContent + chunk,
              thinkingPlaceholder: '',
            }));
          };
          
          const handleReasoningChunk = (chunk: string) => {
            set((state) => ({
              streamingReasoningContent: state.streamingReasoningContent + chunk,
              thinkingPlaceholder: '',
            }));
          };
          
          let finalContent: string;
          let finalReasoningContent: string = '';
          
          const currentConv = get().conversations.find(c => c.id === get().currentConversationId);
          const currentMessages = currentConv?.messages || [];
          
          if (shouldUseApi) {
            const result = await callAIAPIStream(currentMessages, profile.grade, currentScene, handleChunk, handleReasoningChunk);
            finalContent = result.content;
            finalReasoningContent = result.reasoning_content;
          } else {
            finalContent = await getDemoStreamResponse(content, profile.grade, currentScene, handleChunk);
          }
          
          const aiMessage: ChatMessage = {
            id: aiMessageId,
            role: 'assistant',
            content: finalContent,
            ...(finalReasoningContent ? { reasoning_content: finalReasoningContent } : {}),
            timestamp: Date.now(),
            scene: currentScene,
          };
          
          set((state) => ({
            conversations: state.conversations.map(c => {
              if (c.id === state.currentConversationId) {
                const updatedMessages = [...c.messages, aiMessage];
                return {
                  ...c,
                  messages: updatedMessages,
                  updatedAt: Date.now(),
                  title: c.title.startsWith('新的') ? generateConversationTitle(updatedMessages, c.scene) : c.title,
                };
              }
              return c;
            }),
            isTyping: false,
            streamingContent: '',
            streamingReasoningContent: '',
            streamingMessageId: null,
            thinkingPlaceholder: '',
          }));
          
          setTimeout(() => {
            get().autoCalculateProgress();
          }, 100);
        } catch (error: unknown) {
          const errorType = (error as Error & { errorType?: string }).errorType || (error as Error).message || 'UNKNOWN';
          
          if (errorType === 'ABORTED') {
            const { streamingContent: sc, streamingReasoningContent: src } = get();
            const finalContent = sc || '（已停止生成）';
            const finalReasoningContent = src;
            
            const aiMessage: ChatMessage = {
              id: aiMessageId,
              role: 'assistant',
              content: finalContent,
              ...(finalReasoningContent ? { reasoning_content: finalReasoningContent } : {}),
              timestamp: Date.now(),
              scene: currentScene,
            };
            
            set((state) => {
              const currentConv = state.conversations.find(c => c.id === state.currentConversationId);
              if (currentConv?.messages.some(m => m.id === aiMessageId)) {
                return {
                  conversations: state.conversations,
                  isTyping: false,
                  streamingContent: '',
                  streamingReasoningContent: '',
                  streamingMessageId: null,
                  thinkingPlaceholder: '',
                };
              }
              return {
                conversations: state.conversations.map(c => {
                  if (c.id === state.currentConversationId) {
                    return {
                      ...c,
                      messages: [...c.messages, aiMessage],
                      updatedAt: Date.now(),
                    };
                  }
                  return c;
                }),
                isTyping: false,
                streamingContent: '',
                streamingReasoningContent: '',
                streamingMessageId: null,
                thinkingPlaceholder: '',
              };
            });
            
            setTimeout(() => {
              get().autoCalculateProgress();
            }, 100);
            return;
          }
          
          const errorMessage = getAPIErrorMessage(errorType);
          
          if (errorType === 'API_KEY_NOT_SET') {
            set({ apiMode: 'demo', apiError: null });
          } else if (errorType === 'API_KEY_INVALID') {
            set({ apiError: errorMessage });
          } else {
            set({ apiError: errorMessage });
          }
          
          const errorMessageObj: ChatMessage = {
            id: aiMessageId,
            role: 'assistant',
            content: errorMessage,
            timestamp: Date.now(),
            scene: currentScene,
          };
          
          set((state) => ({
            conversations: state.conversations.map(c => {
              if (c.id === state.currentConversationId) {
                return {
                  ...c,
                  messages: [...c.messages, errorMessageObj],
                  updatedAt: Date.now(),
                };
              }
              return c;
            }),
            isTyping: false,
            streamingContent: '',
            streamingReasoningContent: '',
            streamingMessageId: null,
            thinkingPlaceholder: '',
          }));
        }
      },
      resetProfile: () => {
        set({ profile: defaultProfile });
      },
      resetAssessment: () => {
        set((state) => ({
          profile: {
            ...state.profile,
            skills: {},
            assessmentScore: 0,
            assessmentCompleted: false,
          },
        }));
      },
      abortStream: () => {
        abortAPIStream();
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        profile: state.profile,
        onboarding: state.onboarding,
        currentScene: state.currentScene,
        conversations: state.conversations.map(c => ({
          ...c,
          messages: c.messages.slice(-50),
        })),
        currentConversationId: state.currentConversationId,
        selectedModel: state.selectedModel,
        customApiConfig: state.customApiConfig,
        favoriteJobs: state.favoriteJobs,
        apiMode: state.apiMode,
      }),
      migrate: (persisted: unknown) => {
        const state = persisted as Record<string, unknown>;
        if (state.conversations && Array.isArray(state.conversations)) {
          state.conversations = (state.conversations as Array<{ messages: Array<{ id: string }> }>).map(c => ({
            ...c,
            messages: Array.from(new Map(c.messages.map(msg => [msg.id, msg])).values()),
          }));
        }
        delete state.useRealApi;
        delete state.apiAvailable;
        const defaultKey = import.meta.env.VITE_DEFAULT_API_KEY || '';
        const hasCustomKey = !!localStorage.getItem('future_goose_api_key');
        if (hasCustomKey) {
          state.apiMode = 'custom';
        } else if (defaultKey) {
          state.apiMode = 'free';
        } else {
          state.apiMode = 'demo';
        }
        return state;
      },
    }
  )
);
