import { describe, it, expect } from 'vitest';
import {
  calculateAutoProgress,
  calculateProgressPercentage,
  getProgressBreakdown,
} from '@/utils/progressCalculator';
import type { UserProfile, UserGrade, Conversation, ChatSceneId } from '@/types';
import { growthPaths } from '@/data/growthPaths';

describe('progressCalculator.ts', () => {
  const createMockProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
    grade: 'junior',
    interests: [],
    skills: {},
    careerDirection: [],
    goals: [],
    assessmentScore: 0,
    assessmentCompleted: false,
    milestones: {},
    ...overrides,
  });

  const createMockConversations = (count: number = 0, scene: string = 'career'): Conversation[] => {
    const conversations: Conversation[] = [];
    for (let i = 0; i < count; i++) {
      conversations.push({
        id: `conv-${i}`,
        title: `对话 ${i}`,
        scene: scene as ChatSceneId,
        messages: [
          { id: `user-${i}`, role: 'user', content: '消息', timestamp: Date.now() },
          { id: `ai-${i}`, role: 'assistant', content: '回复', timestamp: Date.now() },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
    return conversations;
  };

  describe('calculateProgressPercentage', () => {
    it('should return 0 when grade is null', () => {
      const profile = createMockProfile({ grade: null });
      const result = calculateProgressPercentage(profile, null);
      expect(result).toBe(0);
    });

    it('should return 0 when no milestones completed', () => {
      const profile = createMockProfile({ milestones: {} });
      const result = calculateProgressPercentage(profile, 'junior');
      expect(result).toBe(0);
    });

    it('should return 100 when all milestones completed', () => {
      const grade = 'junior' as UserGrade;
      const allCompleted: Record<string, boolean> = {};
      growthPaths[grade].milestones.forEach(m => {
        allCompleted[m.id] = true;
      });
      const profile = createMockProfile({ milestones: allCompleted, grade });
      const result = calculateProgressPercentage(profile, grade);
      expect(result).toBe(100);
    });

    it('should return 50 when half milestones completed', () => {
      const grade = 'junior' as UserGrade;
      const milestones = growthPaths[grade].milestones;
      const halfCompleted: Record<string, boolean> = {};
      milestones.slice(0, milestones.length / 2).forEach(m => {
        halfCompleted[m.id] = true;
      });
      const profile = createMockProfile({ milestones: halfCompleted, grade });
      const result = calculateProgressPercentage(profile, grade);
      expect(result).toBe(50);
    });
  });

  describe('getProgressBreakdown', () => {
    it('should return all zeros when grade is null', () => {
      const profile = createMockProfile({ grade: null });
      const result = getProgressBreakdown(profile, []);
      expect(result).toEqual({
        assessment: 0,
        conversation: 0,
        skill: 0,
        manual: 0,
        total: 0,
      });
    });

    it('should return non-zero values when progress exists', () => {
      const grade = 'junior' as UserGrade;
      const profile = createMockProfile({
        grade,
        assessmentCompleted: true,
        assessmentScore: 80,
        careerDirection: ['技术', '产品'],
        goals: ['找实习'],
        interests: ['AI'],
        skills: { javascript: 70, typescript: 60 },
        milestones: { j1: true },
      });
      const conversations = createMockConversations(10);

      const result = getProgressBreakdown(profile, conversations);

      expect(result.assessment).toBeGreaterThan(0);
      expect(result.conversation).toBeGreaterThan(0);
      expect(result.skill).toBeGreaterThan(0);
      expect(result.manual).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
    });

    it('should calculate correct assessment score', () => {
      const grade = 'junior' as UserGrade;
      const profile = createMockProfile({
        grade,
        assessmentCompleted: true,
        assessmentScore: 100,
        careerDirection: ['技术', '产品', '运营'],
        goals: ['找实习', '学算法', '做项目'],
        interests: ['AI', '前端', '后端'],
      });

      const result = getProgressBreakdown(profile, []);
      expect(result.assessment).toBe(100);
    });
  });

  describe('calculateAutoProgress', () => {
    it('should return empty object when grade is null', () => {
      const profile = createMockProfile({ grade: null });
      const result = calculateAutoProgress(profile, []);
      expect(result).toEqual({});
    });

    it('should return updated milestones with auto-calculated progress', () => {
      const grade = 'junior' as UserGrade;
      const profile = createMockProfile({
        grade,
        assessmentCompleted: true,
        assessmentScore: 80,
        skills: { javascript: 80 },
      });
      const conversations = createMockConversations(20, 'career');

      const result = calculateAutoProgress(profile, conversations);

      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('should preserve manually completed milestones', () => {
      const grade = 'junior' as UserGrade;
      const profile = createMockProfile({
        grade,
        assessmentCompleted: true,
        assessmentScore: 100,
        skills: { javascript: 100 },
        milestones: { j1: true, j2: true },
      });
      const conversations = createMockConversations(20);

      const result = calculateAutoProgress(profile, conversations);

      expect(result['j1']).toBe(true);
      expect(result['j2']).toBe(true);
    });

    it('should handle empty conversations', () => {
      const grade = 'junior' as UserGrade;
      const profile = createMockProfile({
        grade,
        assessmentCompleted: false,
        skills: {},
      });
      const result = calculateAutoProgress(profile, []);
      expect(result).toBeDefined();
    });

    it('should handle custom config', () => {
      const grade = 'junior' as UserGrade;
      const profile = createMockProfile({
        grade,
        assessmentCompleted: true,
        assessmentScore: 100,
        skills: { javascript: 100 },
      });
      const conversations = createMockConversations(20);

      const customConfig = {
        assessmentWeight: 0.5,
        conversationWeight: 0.2,
        skillWeight: 0.2,
        manualWeight: 0.1,
      };

      const result = calculateAutoProgress(profile, conversations, customConfig);
      expect(result).toBeDefined();
    });
  });
});
