import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore } from '@/store';

vi.mock('@/services/aiApi', () => ({
  callAIAPI: vi.fn(),
  callAIAPIStream: vi.fn(),
  getDemoResponse: vi.fn().mockResolvedValue('演示回复'),
  getDemoStreamResponse: vi.fn().mockResolvedValue('演示流式回复'),
  API_CONFIG: {
    getApiKey: () => '',
    setApiKey: vi.fn(),
    defaultModel: 'glm-4-flash',
    setBaseUrl: vi.fn(),
  },
  getAPIErrorMessage: vi.fn().mockReturnValue('错误信息'),
  abortAPIStream: vi.fn(),
}));

describe('AppStore', () => {
  beforeEach(() => {
    useAppStore.getState().resetProfile();
  });

  describe('Profile Management', () => {
    it('should set grade', () => {
      useAppStore.getState().setGrade('freshman');
      expect(useAppStore.getState().profile.grade).toBe('freshman');
    });

    it('should update profile', () => {
      useAppStore.getState().updateProfile({
        interests: ['前端', 'AI'],
        goals: ['找实习'],
      });
      const profile = useAppStore.getState().profile;
      expect(profile.interests).toEqual(['前端', 'AI']);
      expect(profile.goals).toEqual(['找实习']);
    });

    it('should reset profile to default', () => {
      useAppStore.getState().setGrade('junior');
      useAppStore.getState().resetProfile();
      expect(useAppStore.getState().profile.grade).toBeNull();
    });

    it('should complete assessment', () => {
      const scores = { javascript: 80, typescript: 90, react: 85 };
      useAppStore.getState().completeAssessment(scores);
      
      const profile = useAppStore.getState().profile;
      expect(profile.assessmentCompleted).toBe(true);
      expect(profile.skills).toEqual(scores);
      expect(profile.assessmentScore).toBe(85);
    });

    it('should reset assessment', () => {
      useAppStore.getState().completeAssessment({ javascript: 80 });
      useAppStore.getState().resetAssessment();
      
      const profile = useAppStore.getState().profile;
      expect(profile.assessmentCompleted).toBe(false);
      expect(profile.assessmentScore).toBe(0);
      expect(Object.keys(profile.skills).length).toBe(0);
    });

    it('should update milestone', () => {
      useAppStore.getState().updateMilestone('f1', true);
      expect(useAppStore.getState().profile.milestones['f1']).toBe(true);
    });
  });

  describe('Onboarding', () => {
    it('should start onboarding', () => {
      useAppStore.getState().startOnboarding();
      const onboarding = useAppStore.getState().onboarding;
      expect(onboarding.isCompleted).toBe(false);
      expect(onboarding.isShowing).toBe(true);
      expect(onboarding.currentStep).toBe(0);
    });

    it('should complete onboarding', () => {
      useAppStore.getState().startOnboarding();
      useAppStore.getState().completeOnboarding();
      const onboarding = useAppStore.getState().onboarding;
      expect(onboarding.isCompleted).toBe(true);
      expect(onboarding.isShowing).toBe(false);
    });

    it('should set onboarding step', () => {
      useAppStore.getState().startOnboarding();
      useAppStore.getState().setOnboardingStep(2);
      expect(useAppStore.getState().onboarding.currentStep).toBe(2);
    });

    it('should hide onboarding', () => {
      useAppStore.getState().startOnboarding();
      useAppStore.getState().hideOnboarding();
      expect(useAppStore.getState().onboarding.isShowing).toBe(false);
    });
  });

  describe('Conversation Management', () => {
    it('should create new conversation', () => {
      const initialCount = useAppStore.getState().conversations.length;
      useAppStore.getState().createNewConversation('interview');
      
      const state = useAppStore.getState();
      expect(state.conversations.length).toBe(initialCount + 1);
      expect(state.currentScene).toBe('interview');
    });

    it('should switch conversation', () => {
      useAppStore.getState().createNewConversation('career');
      const newConvId = useAppStore.getState().currentConversationId;
      
      useAppStore.getState().switchConversation(newConvId!);
      expect(useAppStore.getState().currentConversationId).toBe(newConvId);
    });

    it('should delete conversation and create new one if empty', () => {
      useAppStore.getState().createNewConversation('career');
      const convId = useAppStore.getState().currentConversationId;
      
      useAppStore.getState().deleteConversation(convId!);
      
      expect(useAppStore.getState().conversations.length).toBeGreaterThanOrEqual(1);
    });

    it('should set current scene', () => {
      useAppStore.getState().setCurrentScene('resume');
      expect(useAppStore.getState().currentScene).toBe('resume');
    });
  });

  describe('Favorite Jobs', () => {
    it('should toggle favorite job', () => {
      const result = useAppStore.getState().toggleFavoriteJob('job-1');
      expect(result).toBe(true);
      expect(useAppStore.getState().isJobFavorited('job-1')).toBe(true);
    });

    it('should unfavorite job', () => {
      useAppStore.getState().toggleFavoriteJob('job-2');
      const result = useAppStore.getState().toggleFavoriteJob('job-2');
      expect(result).toBe(false);
      expect(useAppStore.getState().isJobFavorited('job-2')).toBe(false);
    });

    it('should return favorite jobs', () => {
      useAppStore.getState().resetProfile();
      useAppStore.getState().toggleFavoriteJob('job-5');
      useAppStore.getState().toggleFavoriteJob('job-6');
      const favorites = useAppStore.getState().getFavoriteJobs();
      expect(favorites.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('API Configuration', () => {
    it('should set API key', () => {
      useAppStore.getState().setApiKey('test-api-key');
      expect(useAppStore.getState().apiKey).toBe('test-api-key');
    });

    it('should show/hide API key modal', () => {
      useAppStore.getState().setShowApiKeyModal(true);
      expect(useAppStore.getState().showApiKeyModal).toBe(true);
      
      useAppStore.getState().setShowApiKeyModal(false);
      expect(useAppStore.getState().showApiKeyModal).toBe(false);
    });

    it('should set API mode to free', () => {
      useAppStore.getState().setApiMode('free');
      expect(useAppStore.getState().apiMode).toBe('free');
    });

    it('should set API mode to demo', () => {
      useAppStore.getState().setDemoMode();
      expect(useAppStore.getState().apiMode).toBe('demo');
    });

    it('should set API mode to custom', () => {
      useAppStore.getState().setApiMode('custom');
      expect(useAppStore.getState().apiMode).toBe('custom');
    });

    it('should set selected model', () => {
      useAppStore.getState().setSelectedModel('glm-4-plus');
      expect(useAppStore.getState().selectedModel).toBe('glm-4-plus');
    });
  });

  describe('Streaming State', () => {
    it('should handle stream abort', () => {
      useAppStore.getState().abortStream();
      const state = useAppStore.getState();
      expect(state.isTyping).toBe(false);
      expect(state.streamingContent).toBe('');
      expect(state.streamingMessageId).toBeNull();
    });
  });

  describe('Show Toast', () => {
    it('should show toast', () => {
      expect(() => {
        useAppStore.getState().showToast('Test message', 'info');
      }).not.toThrow();
    });
  });
});
