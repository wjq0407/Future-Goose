import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RadarChart from '@/components/RadarChart';
import type { AppStore } from '@/store';
import { useAppStore } from '@/store';
import type { ChatSceneId } from '@/types';

vi.mock('@/store', () => ({
  useAppStore: vi.fn(),
}));

const mockedUseAppStore = vi.mocked(useAppStore);

const defaultMockStore: AppStore = {
  profile: {
    grade: null,
    interests: [],
    skills: {},
    careerDirection: [],
    goals: [],
    assessmentScore: 0,
    assessmentCompleted: false,
    milestones: {},
  },
  setGrade: vi.fn(),
  updateProfile: vi.fn(),
  completeAssessment: vi.fn(),
  updateMilestone: vi.fn(),
  autoCalculateProgress: vi.fn(),
  getProgressBreakdown: vi.fn(),
  onboarding: { isCompleted: false, currentStep: 0, isShowing: false },
  completeOnboarding: vi.fn(),
  startOnboarding: vi.fn(),
  setOnboardingStep: vi.fn(),
  hideOnboarding: vi.fn(),
  conversations: [],
  currentConversationId: null,
  currentScene: 'career' as ChatSceneId,
  isTyping: false,
  streamingContent: '',
  streamingReasoningContent: '',
  streamingMessageId: null,
  thinkingPlaceholder: '',
  apiKey: '',
  apiError: null,
  apiMode: 'demo' as const,
  setApiMode: vi.fn(),
  setFreeMode: vi.fn(),
  setDemoMode: vi.fn(),
  showApiKeyModal: false,
  selectedModel: '',
  customApiConfig: null,
  showToast: vi.fn(),
  showExportDialog: false,
  setShowExportDialog: vi.fn(),
  favoriteJobs: [],
  toggleFavoriteJob: vi.fn(),
  isJobFavorited: vi.fn(),
  getFavoriteJobs: vi.fn(),
  setApiKey: vi.fn(),
  setShowApiKeyModal: vi.fn(),
  setSelectedModel: vi.fn(),
  setCustomApiConfig: vi.fn(),
  setCurrentScene: vi.fn(),
  createNewConversation: vi.fn(),
  switchConversation: vi.fn(),
  deleteConversation: vi.fn(),
  sendMessage: vi.fn(),
  resetProfile: vi.fn(),
  resetAssessment: vi.fn(),
  abortStream: vi.fn(),
};

const createMockStore = (profileOverrides: Partial<AppStore['profile']>): AppStore => ({
  ...defaultMockStore,
  profile: { ...defaultMockStore.profile, ...profileOverrides },
});

describe('RadarChart.tsx', () => {
  beforeEach(() => {
    mockedUseAppStore.mockReset();
  });

  it('should render empty state when no skills', () => {
    const mockStore = createMockStore({
      grade: null,
      interests: [],
      skills: {},
      careerDirection: [],
      goals: [],
      assessmentScore: 0,
      assessmentCompleted: false,
      milestones: {},
    });
    mockedUseAppStore.mockImplementation((selector) => selector(mockStore));
    
    render(<RadarChart />);
    expect(screen.getByText('完成测评后将展示你的能力画像')).toBeTruthy();
  });

  it('should render radar chart when skills exist', () => {
    const mockStore = createMockStore({
      grade: 'junior',
      interests: [],
      skills: { javascript: 80, typescript: 75, react: 85 },
      careerDirection: ['技术'],
      goals: [],
      assessmentScore: 80,
      assessmentCompleted: true,
      milestones: {},
    });
    mockedUseAppStore.mockImplementation((selector) => selector(mockStore));
    
    const { container } = render(<RadarChart />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(screen.getByText('能力画像')).toBeTruthy();
  });

  it('should display title', () => {
    const mockStore = createMockStore({
      grade: 'junior',
      interests: [],
      skills: { javascript: 80 },
      careerDirection: ['技术'],
      goals: [],
      assessmentScore: 80,
      assessmentCompleted: true,
      milestones: {},
    });
    mockedUseAppStore.mockImplementation((selector) => selector(mockStore));
    
    render(<RadarChart />);
    expect(screen.getByText('能力画像')).toBeTruthy();
  });
});
