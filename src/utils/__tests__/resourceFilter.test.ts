import { describe, it, expect } from 'vitest';
import {
  filterResources,
  sortResources,
  filterAndSortResources,
  getAllTags,
  getDefaultFilters,
} from '@/utils/resourceFilter';
import type { Resource } from '@/types';

describe('resourceFilter.ts', () => {
  const mockResources: Resource[] = [
    {
      id: '1',
      type: 'course',
      title: 'React入门',
      description: '学习React基础',
      url: 'https://example.com',
      icon: 'book',
      priority: 'high',
      difficulty: 'beginner',
      tags: ['frontend', 'react'],
    },
    {
      id: '2',
      type: 'course',
      title: 'TypeScript进阶',
      description: '深入学习TypeScript',
      url: 'https://example.com',
      icon: 'book',
      priority: 'medium',
      difficulty: 'intermediate',
      tags: ['frontend', 'typescript'],
    },
    {
      id: '3',
      type: 'internship',
      title: '腾讯前端实习',
      description: '腾讯WXG前端实习岗位',
      url: 'https://example.com',
      icon: 'briefcase',
      priority: 'high',
      difficulty: 'advanced',
      tags: ['frontend', 'tencent'],
    },
    {
      id: '4',
      type: 'certificate',
      title: 'AWS认证',
      description: 'AWS云认证考试',
      url: 'https://example.com',
      icon: 'award',
      priority: 'low',
      difficulty: 'intermediate',
      tags: ['cloud', 'aws'],
    },
  ];

  describe('filterResources', () => {
    it('should filter by type', () => {
      const result = filterResources(mockResources, {
        type: 'course',
        difficulty: 'all',
        sortBy: 'priority',
        sortOrder: 'desc',
      });
      expect(result).toHaveLength(2);
      expect(result.every(r => r.type === 'course')).toBe(true);
    });

    it('should filter by difficulty', () => {
      const result = filterResources(mockResources, {
        type: 'all',
        difficulty: 'beginner',
        sortBy: 'priority',
        sortOrder: 'desc',
      });
      expect(result).toHaveLength(1);
      expect(result[0].difficulty).toBe('beginner');
    });

    it('should filter by tag', () => {
      const result = filterResources(mockResources, {
        type: 'all',
        difficulty: 'all',
        tag: 'frontend',
        sortBy: 'priority',
        sortOrder: 'desc',
      });
      expect(result).toHaveLength(3);
    });

    it('should return all resources when filters are "all"', () => {
      const result = filterResources(mockResources, {
        type: 'all',
        difficulty: 'all',
        sortBy: 'priority',
        sortOrder: 'desc',
      });
      expect(result).toHaveLength(4);
    });

    it('should handle combined filters', () => {
      const result = filterResources(mockResources, {
        type: 'course',
        difficulty: 'intermediate',
        sortBy: 'priority',
        sortOrder: 'desc',
      });
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('TypeScript进阶');
    });
  });

  describe('sortResources', () => {
    it('should sort by priority descending', () => {
      const result = sortResources(mockResources, 'priority', 'desc');
      expect(result[0].priority).toBe('high');
      expect(result[result.length - 1].priority).toBe('low');
    });

    it('should sort by priority ascending', () => {
      const result = sortResources(mockResources, 'priority', 'asc');
      expect(result[0].priority).toBe('low');
      expect(result[result.length - 1].priority).toBe('high');
    });

    it('should sort by difficulty', () => {
      const result = sortResources(mockResources, 'difficulty', 'asc');
      expect(result[0].difficulty).toBe('beginner');
    });

    it('should sort by title', () => {
      const result = sortResources(mockResources, 'title', 'asc');
      expect(result[0].title.localeCompare(result[1].title, 'zh-CN')).toBeLessThanOrEqual(0);
    });

    it('should sort by type', () => {
      const result = sortResources(mockResources, 'type', 'asc');
      const types = result.map(r => r.type);
      expect(types).toEqual([...types].sort());
    });
  });

  describe('filterAndSortResources', () => {
    it('should filter and sort in one call', () => {
      const result = filterAndSortResources(mockResources, {
        type: 'course',
        difficulty: 'all',
        sortBy: 'priority',
        sortOrder: 'desc',
      });
      expect(result).toHaveLength(2);
      expect(result[0].priority).toBe('high');
    });
  });

  describe('getAllTags', () => {
    it('should return all unique tags', () => {
      const tags = getAllTags(mockResources);
      expect(tags).toContain('frontend');
      expect(tags).toContain('react');
      expect(tags).toContain('typescript');
      expect(tags).toContain('tencent');
      expect(tags).toContain('cloud');
      expect(tags).toContain('aws');
    });

    it('should return sorted tags', () => {
      const tags = getAllTags(mockResources);
      const sorted = [...tags].sort();
      expect(tags).toEqual(sorted);
    });

    it('should handle empty resources', () => {
      const tags = getAllTags([]);
      expect(tags).toEqual([]);
    });

    it('should handle resources without tags', () => {
      const resourcesWithoutTags: Resource[] = [
        {
          id: '1',
          type: 'course',
          title: 'Test',
          description: 'Test',
          url: 'https://example.com',
          icon: 'book',
        },
      ];
      const tags = getAllTags(resourcesWithoutTags);
      expect(tags).toEqual([]);
    });
  });

  describe('getDefaultFilters', () => {
    it('should return default filter configuration', () => {
      const filters = getDefaultFilters();
      expect(filters).toEqual({
        type: 'all',
        difficulty: 'all',
        sortBy: 'priority',
        sortOrder: 'desc',
      });
    });
  });
});
