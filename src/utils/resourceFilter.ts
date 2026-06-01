import { Resource, ResourceFilterOptions } from '@/types';

const priorityWeight: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const difficultyWeight: Record<string, number> = {
  advanced: 3,
  intermediate: 2,
  beginner: 1,
};

export function filterResources(resources: Resource[], filters: ResourceFilterOptions): Resource[] {
  let filtered = resources;

  if (filters.type !== 'all') {
    filtered = filtered.filter(r => r.type === filters.type);
  }

  if (filters.difficulty !== 'all') {
    filtered = filtered.filter(r => r.difficulty === filters.difficulty);
  }

  if (filters.tag) {
    filtered = filtered.filter(r => r.tags?.includes(filters.tag!));
  }

  return filtered;
}

export function sortResources(resources: Resource[], sortBy: ResourceFilterOptions['sortBy'], sortOrder: ResourceFilterOptions['sortOrder']): Resource[] {
  const sorted = [...resources];

  sorted.sort((a, b) => {
    let compare = 0;

    switch (sortBy) {
      case 'priority': {
        const priorityA = priorityWeight[a.priority || 'medium'] || 2;
        const priorityB = priorityWeight[b.priority || 'medium'] || 2;
        compare = priorityA - priorityB;
        break;
      }

      case 'difficulty': {
        const diffA = difficultyWeight[a.difficulty || 'intermediate'] || 2;
        const diffB = difficultyWeight[b.difficulty || 'intermediate'] || 2;
        compare = diffA - diffB;
        break;
      }

      case 'title':
        compare = a.title.localeCompare(b.title, 'zh-CN');
        break;

      case 'type':
        compare = a.type.localeCompare(b.type);
        if (compare === 0) {
          compare = a.title.localeCompare(b.title, 'zh-CN');
        }
        break;
    }

    return sortOrder === 'asc' ? compare : -compare;
  });

  return sorted;
}

export function filterAndSortResources(resources: Resource[], filters: ResourceFilterOptions): Resource[] {
  const filtered = filterResources(resources, filters);
  return sortResources(filtered, filters.sortBy, filters.sortOrder);
}

export function getAllTags(resources: Resource[]): string[] {
  const tagSet = new Set<string>();
  resources.forEach(r => r.tags?.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

export function getDefaultFilters(): ResourceFilterOptions {
  return {
    type: 'all',
    difficulty: 'all',
    sortBy: 'priority',
    sortOrder: 'desc',
  };
}

export const resourceTypeLabels: Record<string, string> = {
  all: '全部',
  course: '课程',
  certificate: '证书',
  internship: '实习',
  article: '文章',
};

export const difficultyLabels: Record<string, string> = {
  all: '全部难度',
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级',
};

export const sortLabels: Record<string, string> = {
  priority: '优先级',
  difficulty: '难度',
  title: '标题',
  type: '类型',
};
