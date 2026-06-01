import { describe, it, expect, vi } from 'vitest';
import {
  getDemoResponse,
  getAPIErrorMessage,
  quickQuestions,
  MODEL_OPTIONS,
} from '@/services/aiApi';
import type { UserGrade } from '@/types';

vi.mock('@/services/aiApi', async () => {
  const actual = await vi.importActual('@/services/aiApi');
  return {
    ...(actual as Record<string, unknown>),
    callAIAPI: vi.fn(),
    callAIAPIStream: vi.fn(),
  };
});

describe('aiApi.ts', () => {
  describe('getDemoResponse', () => {
    describe('Career Scene', () => {
      it('should return internet industry response', () => {
        const response = getDemoResponse('我想了解互联网行业', 'freshman', 'career');
        expect(response).toContain('互联网行业主要分为');
        expect(response).toContain('技术研发');
      });

      it('should return preparation advice', () => {
        const response = getDemoResponse('应该怎么准备', 'sophomore', 'career');
        expect(response).toContain('大二学生');
        expect(response).toContain('学好专业课');
      });

      it('should return direction selection advice', () => {
        const response = getDemoResponse('如何选择方向', 'junior', 'career');
        expect(response).toContain('选择方向可以考虑三个维度');
        expect(response).toContain('兴趣驱动');
      });

      it('should return Tencent info', () => {
        const response = getDemoResponse('腾讯有哪些业务', 'senior', 'career');
        expect(response).toContain('腾讯的核心业务板块');
        expect(response).toContain('社交');
        expect(response).toContain('游戏');
      });
    });

    describe('Interview Scene', () => {
      it('should return interview start response', () => {
        const response = getDemoResponse('开始面试', 'junior', 'interview');
        expect(response).toContain('模拟面试');
        expect(response).toContain('自我介绍');
      });

      it('should return self-introduction guide', () => {
        const response = getDemoResponse('自我介绍怎么写', 'senior', 'interview');
        expect(response).toContain('基本信息');
        expect(response).toContain('核心经历');
      });

      it('should return interview techniques', () => {
        const response = getDemoResponse('有什么面试技巧', 'junior', 'interview');
        expect(response).toContain('STAR法则');
        expect(response).toContain('主动沟通');
      });

      it('should return technical interview info', () => {
        const response = getDemoResponse('技术面考什么', 'junior', 'interview');
        expect(response).toContain('基础知识');
        expect(response).toContain('算法题');
      });

      it('should return HR interview info', () => {
        const response = getDemoResponse('HR面', 'senior', 'interview');
        expect(response).toContain('HR面常见问题');
        expect(response).toContain('为什么想来腾讯');
      });
    });

    describe('Resume Scene', () => {
      it('should return resume structure guide', () => {
        const response = getDemoResponse('简历怎么写', 'junior', 'resume');
        expect(response).toContain('基本信息');
        expect(response).toContain('实习经历');
      });

      it('should return STAR method explanation', () => {
        const response = getDemoResponse('STAR法则', 'sophomore', 'resume');
        expect(response).toContain('情境');
        expect(response).toContain('任务');
        expect(response).toContain('行动');
        expect(response).toContain('结果');
      });

      it('should return project description guide', () => {
        const response = getDemoResponse('项目经验怎么写', 'junior', 'resume');
        expect(response).toContain('项目经验的描述要点');
        expect(response).toContain('用数据说话');
      });

      it('should return format guide', () => {
        const response = getDemoResponse('格式', 'senior', 'resume');
        expect(response).toContain('简历格式建议');
        expect(response).toContain('篇幅');
        expect(response).toContain('排版');
      });
    });

    describe('Default Responses', () => {
      it('should return default career response for unmatched input', () => {
        const response = getDemoResponse('随机问题', 'freshman', 'career');
        expect(response).toContain('这是一个很好的职业发展问题');
        expect(response).toContain('大一学生');
      });

      it('should return default interview response for unmatched input', () => {
        const response = getDemoResponse('随机问题', 'junior', 'interview');
        expect(response).toContain('面试准备是一个系统性的过程');
      });

      it('should return default resume response for unmatched input', () => {
        const response = getDemoResponse('随机问题', 'senior', 'resume');
        expect(response).toContain('简历是求职的第一道关卡');
      });

      it('should include correct grade label', () => {
        const response = getDemoResponse('随机问题', 'graduate', 'career');
        expect(response).toContain('研究生');
      });

      it('should handle null grade', () => {
        const response = getDemoResponse('随机问题', null, 'career');
        expect(response).toContain('大学生');
      });
    });
  });

  describe('getAPIErrorMessage', () => {
    it('should return message for API_KEY_NOT_SET', () => {
      const message = getAPIErrorMessage('API_KEY_NOT_SET');
      expect(message).toContain('API Key');
    });

    it('should return message for API_KEY_INVALID', () => {
      const message = getAPIErrorMessage('API_KEY_INVALID');
      expect(message).toContain('无效');
    });

    it('should return message for ACCOUNT_BALANCE', () => {
      const message = getAPIErrorMessage('ACCOUNT_BALANCE');
      expect(message).toContain('余额');
    });

    it('should return message for RATE_LIMIT', () => {
      const message = getAPIErrorMessage('RATE_LIMIT');
      expect(message).toContain('使用上限');
    });

    it('should return message for SERVICE_BUSY', () => {
      const message = getAPIErrorMessage('SERVICE_BUSY');
      expect(message).toContain('访问量过大');
    });

    it('should return message for CONTENT_BLOCKED', () => {
      const message = getAPIErrorMessage('CONTENT_BLOCKED');
      expect(message).toContain('敏感');
    });

    it('should return default message for unknown error', () => {
      const message = getAPIErrorMessage('UNKNOWN_ERROR');
      expect(message).toContain('AI服务暂时不可用');
    });
  });

  describe('MODEL_OPTIONS', () => {
    it('should contain GLM models', () => {
      expect(MODEL_OPTIONS.length).toBeGreaterThan(0);
      expect(MODEL_OPTIONS.some(m => m.id === 'glm-4-flash')).toBe(true);
    });

    it('should have required fields for each model', () => {
      MODEL_OPTIONS.forEach(model => {
        expect(model).toHaveProperty('id');
        expect(model).toHaveProperty('name');
        expect(model).toHaveProperty('desc');
        expect(model).toHaveProperty('tag');
      });
    });

    it('should include free and flagship models', () => {
      const freeModel = MODEL_OPTIONS.find(m => m.tag === '推荐');
      const flagshipModel = MODEL_OPTIONS.find(m => m.tag === '旗舰');
      expect(freeModel).toBeDefined();
      expect(flagshipModel).toBeDefined();
    });
  });

  describe('quickQuestions', () => {
    it('should have questions for all grades in career scene', () => {
      const grades: UserGrade[] = ['freshman', 'sophomore', 'junior', 'senior', 'graduate'];
      grades.forEach(grade => {
        expect(quickQuestions.career[grade]).toBeDefined();
        expect(quickQuestions.career[grade].length).toBeGreaterThan(0);
      });
    });

    it('should have questions for all grades in interview scene', () => {
      const grades: UserGrade[] = ['freshman', 'sophomore', 'junior', 'senior', 'graduate'];
      grades.forEach(grade => {
        expect(quickQuestions.interview[grade]).toBeDefined();
      });
    });

    it('should have questions for all grades in resume scene', () => {
      const grades: UserGrade[] = ['freshman', 'sophomore', 'junior', 'senior', 'graduate'];
      grades.forEach(grade => {
        expect(quickQuestions.resume[grade]).toBeDefined();
      });
    });
  });
});
