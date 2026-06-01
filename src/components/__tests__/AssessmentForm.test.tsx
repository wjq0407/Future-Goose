import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AssessmentForm from '@/components/AssessmentForm';

vi.mock('@/store', () => ({
  useAppStore: vi.fn(() => ({
    completeAssessment: vi.fn(),
  })),
}));

vi.mock('@/data/assessmentData', () => ({
  assessmentQuestions: [
    {
      id: 'q1',
      question: '你喜欢哪种类型的活动？',
      skillDimension: '兴趣探索',
      options: [
        { text: '逻辑分析', score: 80 },
        { text: '创意设计', score: 60 },
      ],
    },
    {
      id: 'q2',
      question: '你更擅长什么？',
      skillDimension: '能力评估',
      options: [
        { text: '编程', score: 90 },
        { text: '沟通', score: 70 },
      ],
    },
  ],
  calculateSkills: vi.fn((answers) => answers),
  getCareerSuggestions: vi.fn(() => ['前端开发', '产品经理']),
}));

describe('AssessmentForm.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render assessment form with question', () => {
    render(<AssessmentForm />);
    expect(screen.getByText('你喜欢哪种类型的活动？')).toBeTruthy();
  });

  it('should show progress indicator', () => {
    render(<AssessmentForm />);
    expect(screen.getByText(/测评进度/)).toBeTruthy();
  });

  it('should display question options', () => {
    render(<AssessmentForm />);
    expect(screen.getByText('逻辑分析')).toBeTruthy();
    expect(screen.getByText('创意设计')).toBeTruthy();
  });

  it('should show dimension tag', () => {
    render(<AssessmentForm />);
    expect(screen.getByText('评估维度：兴趣探索')).toBeTruthy();
  });

  it('should disable back button on first question', () => {
    render(<AssessmentForm />);
    const backButton = screen.getByText('上一题').closest('button');
    expect(backButton).toBeDisabled();
  });
});
