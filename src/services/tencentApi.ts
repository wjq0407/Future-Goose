import type {
  TencentJobApiResponse,
  TencentAPIJobPost,
  TencentJobQueryParams,
  TencentJob,
} from '@/types';

const TENCENT_CAREER_API_BASE = import.meta.env.DEV
  ? '/tencent-api/post'
  : 'https://careers.tencent.com/tencentcareer/api/post';

export type RecruitType = 'campus' | 'social';
export type CampusSubType = 'fresh' | 'intern';

function buildQueryUrl(params: TencentJobQueryParams = {}, recruitType?: RecruitType): string {
  const {
    pageIndex = 1,
    pageSize = 20,
    keyword = '',
    categoryId = '',
    bgIds = '',
    locationName = '',
    language = 'zh-cn',
    area = 'cn',
  } = params;

  const searchParams = new URLSearchParams();
  searchParams.set('timestamp', String(Date.now()));
  searchParams.set('pageIndex', String(pageIndex));
  searchParams.set('pageSize', String(pageSize));
  searchParams.set('language', language);
  searchParams.set('area', area);

  if (recruitType === 'campus') {
    searchParams.set('query', 'p_1');
  } else if (recruitType === 'social') {
    searchParams.set('query', 'p_2');
  }

  if (keyword) {
    searchParams.set('keyword', keyword);
  }

  if (categoryId) {
    searchParams.set('categoryId', categoryId);
  }
  if (bgIds) {
    searchParams.set('bgIds', bgIds);
  }
  if (locationName) {
    searchParams.set('locationName', locationName);
  }

  return `${TENCENT_CAREER_API_BASE}/Query?${searchParams.toString()}`;
}

export function parseResponsibilityText(text: string): {
  description: string;
  responsibilities: string[];
  requirements: string[];
  plusItems: string[];
} {
  const lines = text.split(/[\r\n]+/).filter((l) => l.trim());

  const responsibilities: string[] = [];
  const requirements: string[] = [];
  const plusItems: string[] = [];

  let inRequirements = false;
  let inPlusItems = false;

  const requirementKeywords = ['岗位要求', '任职要求', '任职要求：', '要求：', '职位要求', '职位要求：'];
  const plusKeywords = ['加分项', '优先考虑', '加分', '加分条件', '优先考虑条件'];
  const responsibilityKeywords = ['岗位职责', '工作内容', '工作职责', '职责：'];

  for (const line of lines) {
    const trimmedLine = line.trim();

    const isRequirementHeader = requirementKeywords.some((kw) => trimmedLine.includes(kw));
    const isPlusHeader = plusKeywords.some((kw) => trimmedLine.includes(kw));
    const isResponsibilityHeader = responsibilityKeywords.some((kw) => trimmedLine.includes(kw));

    if (isResponsibilityHeader) {
      continue;
    }

    if (isRequirementHeader) {
      inRequirements = true;
      continue;
    }

    if (isPlusHeader) {
      inPlusItems = true;
      continue;
    }

    const cleanLine = trimmedLine.replace(/^[-•*]\s*/, '').replace(/^\d+[、.]\s*/, '').trim();

    if (!cleanLine) continue;

    if (inRequirements) {
      requirements.push(cleanLine);
    } else if (inPlusItems) {
      plusItems.push(cleanLine);
    } else {
      responsibilities.push(cleanLine);
    }
  }

  const description = responsibilities.length > 0
    ? responsibilities[0]
    : '暂无岗位描述';

  return {
    description,
    responsibilities,
    requirements,
    plusItems,
  };
}

export function mapApiPostToTencentJob(post: TencentAPIJobPost, recruitSubType?: 'fresh' | 'intern'): TencentJob {
  const parsed = parseResponsibilityText(post.Responsibility);

  return {
    id: post.PostId,
    category: post.CategoryName,
    title: post.RecruitPostName,
    description: parsed.description,
    requirements: parsed.requirements,
    responsibilities: parsed.responsibilities,
    qualifications: parsed.requirements,
    plusItems: parsed.plusItems,
    location: post.LocationName,
    applyLink: post.PostURL,
    bgName: post.BGName,
    productName: post.ProductName,
    workYears: post.RequireWorkYearsName,
    recruitSubType,
    fullDescription: post.Responsibility,
    detailLoaded: true,
  };
}

function isCampusJob(post: TencentAPIJobPost): boolean {
  const workYears = (post.RequireWorkYearsName || '').toLowerCase();
  const title = (post.RecruitPostName || '').toLowerCase();
  const responsibility = (post.Responsibility || '').toLowerCase();

  const campusKeywords = ['应届', '校园', '校招', '在校生', '毕业生', '2026', '2027', '2025'];
  const socialKeywords = ['经验', '工作', '社招', 'X年以上', 'X年及以上', /\d+年/];

  const hasCampusKeyword = campusKeywords.some((kw) => workYears.includes(kw) || title.includes(kw) || responsibility.includes(kw));
  const hasSocialKeyword = socialKeywords.some((kw) => {
    if (typeof kw === 'string') return workYears.includes(kw);
    return kw.test(workYears);
  });

  if (workYears === '不限' || workYears === '') {
    return true;
  }

  if (hasCampusKeyword && !hasSocialKeyword) {
    return true;
  }

  if (hasSocialKeyword) {
    return false;
  }

  return false;
}

function isInternJob(post: TencentAPIJobPost): boolean {
  const workYears = (post.RequireWorkYearsName || '').toLowerCase();
  const title = (post.RecruitPostName || '').toLowerCase();

  return workYears.includes('实习') || title.includes('实习');
}

export async function fetchTencentJobs(params: TencentJobQueryParams = {}, recruitType?: RecruitType): Promise<{
  jobs: TencentJob[];
  total: number;
}> {
  console.groupCollapsed(' [腾讯API] fetchTencentJobs 开始');
  console.log('参数:', { params, recruitType });
  console.log('API Base:', TENCENT_CAREER_API_BASE);
  console.log('当前环境:', import.meta.env.DEV ? '开发环境(使用代理)' : '生产环境(直接请求)');

  const url = buildQueryUrl(params, recruitType);
  console.log(' API URL:', url);

  const startTime = Date.now();
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const elapsed = Date.now() - startTime;

  console.log(` API请求耗时: ${elapsed}ms`);
  console.log('HTTP状态:', response.status, response.ok ? '' : '');

  if (!response.ok) {
    console.error(' 腾讯招聘API请求失败');
    throw new Error(`腾讯招聘API请求失败: ${response.status} ${response.statusText}`);
  }

  const data: TencentJobApiResponse = await response.json();
  console.log(' API响应:', { Code: data.Code, Count: data.Data.Count, Posts数量: (data.Data.Posts || []).length });

  if (data.Code !== 200) {
    console.error(' API返回错误码:', data.Code);
    throw new Error(`腾讯招聘API返回错误码: ${data.Code}`);
  }

  const allPosts = (data.Data.Posts || []).filter(Boolean).filter((post) => post.IsValid);

  console.log(' 原始数据样本(前3条):');
  allPosts.slice(0, 3).forEach((post, i) => {
    console.log(`  [${i}] PostId: ${post.PostId}`);
    console.log(`      RecruitPostName: ${post.RecruitPostName}`);
    console.log(`      CategoryName: ${post.CategoryName}`);
    console.log(`      RequireWorkYearsName: ${post.RequireWorkYearsName}`);
    console.log(`      isCampusJob: ${isCampusJob(post)}`);
    console.log(`      isInternJob: ${isInternJob(post)}`);
  });

  let filteredPosts: TencentAPIJobPost[];

  if (recruitType === 'campus') {
    filteredPosts = allPosts.filter((post) => isCampusJob(post));
    console.log(` 校园招聘筛选: 原始=${allPosts.length}, 校园招聘=${filteredPosts.length}`);
  } else {
    filteredPosts = allPosts.filter((post) => !isCampusJob(post));
    console.log(` 社会招聘筛选: 原始=${allPosts.length}, 社会招聘=${filteredPosts.length}`);
  }

  const jobs = filteredPosts.map((post) => {
    const subType = isInternJob(post) ? 'intern' : 'fresh';
    return mapApiPostToTencentJob(post, recruitType === 'campus' ? subType : undefined);
  });

  console.log(` 岗位数据汇总: 过滤后=${filteredPosts.length}, 最终=${jobs.length}`);
  console.log(` 校园招聘明细: 应届生=${jobs.filter((j) => j.recruitSubType === 'fresh').length}, 实习生=${jobs.filter((j) => j.recruitSubType === 'intern').length}`);
  console.groupEnd();

  return {
    jobs,
    total: data.Data.Count,
  };
}

export async function fetchTencentJobDetail(postId: string): Promise<TencentAPIJobPost | null> {
  const url = `${TENCENT_CAREER_API_BASE}/GetPostDetail?timestamp=${Date.now()}&postId=${postId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`获取岗位详情失败: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.Code !== 200) {
    return null;
  }

  return data.Data;
}

export const TENCENT_BG_IDS: Record<string, string> = {
  WXG: 'wxg',
  IEG: 'ieg',
  CSIG: 'csig',
  TEG: 'teg',
  CDG: 'cdg',
  PCG: 'pcg',
};

export const TENCENT_CATEGORY_IDS: Record<string, string> = {
  技术: '40001001',
  产品: '40001002',
  设计: '40001003',
  市场: '40001004',
  销售: '40001005',
  战略: '40001006',
};
