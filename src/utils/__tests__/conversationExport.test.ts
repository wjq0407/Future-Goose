import { describe, it, expect } from 'vitest';
import {
  exportAsTXT,
  exportAsMarkdown,
  exportAsHTML,
  exportConversation,
} from '@/utils/conversationExport';
import type { ChatMessage } from '@/types';

describe('conversationExport.ts', () => {
  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      role: 'user',
      content: '你好，我想了解前端开发的学习路径',
      timestamp: 1700000000000,
    },
    {
      id: '2',
      role: 'assistant',
      content: '你好！前端开发的学习路径可以分为以下几个阶段...',
      timestamp: 1700000010000,
    },
    {
      id: '3',
      role: 'user',
      content: 'React和Vue应该先学哪个？',
      timestamp: 1700000020000,
    },
    {
      id: '4',
      role: 'assistant',
      content: '这取决于你的具体情况...',
      reasoning_content: '用户是初学者，需要给出平衡的建议',
      timestamp: 1700000030000,
    },
  ];

  describe('exportAsTXT', () => {
    it('should export conversation as TXT format', () => {
      const result = exportAsTXT(mockMessages, '前端学习咨询');
      expect(result).toContain('对话: 前端学习咨询');
      expect(result).toContain('消息数量: 4');
      expect(result).toContain('你:');
      expect(result).toContain('未来鹅AI:');
      expect(result).toContain('你好，我想了解前端开发的学习路径');
    });

    it('should include timestamps when enabled', () => {
      const result = exportAsTXT(mockMessages, 'Test', { includeTimestamp: true });
      expect(result).toMatch(/\[.+?\]/);
    });

    it('should exclude timestamps when disabled', () => {
      const result = exportAsTXT(mockMessages, 'Test', { includeTimestamp: false });
      expect(result).not.toMatch(/\[.+?\]/);
    });

    it('should include reasoning content when enabled', () => {
      const result = exportAsTXT(mockMessages, 'Test', { includeReasoning: true });
      expect(result).toContain('[思考过程]');
      expect(result).toContain('用户是初学者，需要给出平衡的建议');
    });

    it('should exclude reasoning content when disabled', () => {
      const result = exportAsTXT(mockMessages, 'Test', { includeReasoning: false });
      expect(result).not.toContain('[思考过程]');
    });
  });

  describe('exportAsMarkdown', () => {
    it('should export conversation as Markdown format', () => {
      const result = exportAsMarkdown(mockMessages, '前端学习咨询');
      expect(result).toContain('# 前端学习咨询');
      expect(result).toContain('> 消息数量: 4');
      expect(result).toContain('**你**');
      expect(result).toContain('**未来鹅AI**');
    });

    it('should include reasoning in details tag when enabled', () => {
      const result = exportAsMarkdown(mockMessages, 'Test', { includeReasoning: true });
      expect(result).toContain('<details>');
      expect(result).toContain('<summary>💭 思考过程</summary>');
      expect(result).toContain('用户是初学者，需要给出平衡的建议');
    });

    it('should use emoji for roles', () => {
      const result = exportAsMarkdown(mockMessages, 'Test');
      expect(result).toContain('👤');
      expect(result).toContain('🤖');
    });
  });

  describe('exportAsHTML', () => {
    it('should export conversation as HTML format', () => {
      const result = exportAsHTML(mockMessages, '前端学习咨询');
      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<title>前端学习咨询 - 未来鹅</title>');
      expect(result).toContain('前端学习咨询');
      expect(result).toContain('消息数量: 4');
    });

    it('should include user and assistant message classes', () => {
      const result = exportAsHTML(mockMessages, 'Test');
      expect(result).toContain('class="message user"');
      expect(result).toContain('class="message assistant"');
    });

    it('should include reasoning when enabled', () => {
      const result = exportAsHTML(mockMessages, 'Test', { includeReasoning: true });
      expect(result).toContain('class="reasoning"');
      expect(result).toContain('思考过程');
    });

    it('should preserve newlines in content', () => {
      const result = exportAsHTML(mockMessages, 'Test');
      expect(result).toContain('message-content');
    });
  });

  describe('exportConversation', () => {
    it('should export as TXT when format is txt', () => {
      const result = exportConversation(mockMessages, 'Test', 'txt');
      expect(result).toContain('对话: Test');
    });

    it('should export as Markdown when format is markdown', () => {
      const result = exportConversation(mockMessages, 'Test', 'markdown');
      expect(result).toContain('# Test');
    });

    it('should export as HTML when format is html', () => {
      const result = exportConversation(mockMessages, 'Test', 'html');
      expect(result).toContain('<!DOCTYPE html>');
    });

    it('should default to TXT for unknown format', () => {
      const result = exportConversation(mockMessages, 'Test', 'txt');
      expect(result).toContain('对话: Test');
    });
  });
});
