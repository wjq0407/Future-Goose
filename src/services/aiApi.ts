import { ChatMessage, UserGrade, ChatSceneId } from '@/types';
import { getSecureApiKey, getSecureBaseUrl, setSecureApiKey, setSecureBaseUrl } from '@/lib/secureStorage';

export const FREE_MODELS = [
  { id: 'glm-4-flash', name: 'GLM-4-Flash', desc: '免费模型，速度快', tag: '推荐' },
  { id: 'glm-4.7-flash', name: 'GLM-4.7-Flash', desc: '免费高速模型', tag: '' },
  { id: 'glm-4.7-flashx', name: 'GLM-4.7-FlashX', desc: '极速轻量模型', tag: '' },
  { id: 'glm-4-air', name: 'GLM-4-Air', desc: '轻量级，最快响应', tag: '免费' },
];

export const PAID_MODELS = [
  { id: 'glm-4-plus', name: 'GLM-4-Plus', desc: '能力与速度平衡', tag: '' },
  { id: 'glm-4.7', name: 'GLM-4.7', desc: '强化学习优化，性价比高', tag: '' },
  { id: 'glm-4.5-air', name: 'GLM-4.5-Air', desc: '性价比模型', tag: '' },
  { id: 'glm-5', name: 'GLM-5', desc: '旗舰模型，最强推理', tag: '旗舰' },
  { id: 'glm-5-turbo', name: 'GLM-5-Turbo', desc: 'Agent优化，长程任务', tag: '新品' },
];

export const MODEL_OPTIONS = [...FREE_MODELS, ...PAID_MODELS];

const API_CONFIG = {
  baseURL: '/api/chat',
  defaultModel: 'glm-4-flash',
  getModel: (): string => {
    return localStorage.getItem('future_goose_model') || API_CONFIG.defaultModel;
  },
  getApiKey: (): string => {
    return 'proxy';
  },
  getBaseUrl: (): string => {
    return API_CONFIG.baseURL;
  },
  setApiKey: (key: string): void => {
    if (key) {
      setSecureApiKey(key);
    } else {
      localStorage.removeItem('future_goose_api_key');
    }
  },
  setBaseUrl: (url: string): void => {
    setSecureBaseUrl(url);
  },
};

export async function initSecureApiConfig(): Promise<void> {
  try {
    const encryptedKey = localStorage.getItem('future_goose_api_key');
    if (encryptedKey && encryptedKey.startsWith('encrypted:')) {
      const decryptedKey = await getSecureApiKey();
      localStorage.setItem('future_goose_api_key', decryptedKey);
    }
    
    const encryptedBaseUrl = localStorage.getItem('future_goose_base_url');
    if (encryptedBaseUrl && encryptedBaseUrl.startsWith('encrypted:')) {
      const decryptedBaseUrl = await getSecureBaseUrl();
      localStorage.setItem('future_goose_base_url', decryptedBaseUrl);
    }
  } catch (e) {
    console.error('Failed to initialize secure API config', e);
  }
}

const gradeLabels: Record<UserGrade, string> = {
  freshman: '大一学生',
  sophomore: '大二学生',
  junior: '大三学生',
  senior: '大四学生',
  graduate: '研究生',
};

const sceneSystemPrompts: Record<ChatSceneId, string> = {
  career: `你是一位代表腾讯校招团队的资深职业发展导师，拥有10年互联网行业人才培养经验，深度理解腾讯"用户为本、科技向善"的使命愿景和"正直、进取、协作、创造"的价值观。

【身份定位】
- 你是腾讯校招团队的职业顾问，熟悉腾讯六大事业群（WXG/IEG/PCG/CSIG/TEG/CDG）的业务架构和人才需求
- 你了解腾讯的瑞雪文化、导师制培养体系、活水计划和职业发展通道
- 你掌握腾讯内部产品方法论（如"用户十诫"、"少即是多"、数据驱动决策）

【核心职责】
- 帮助学生探索职业方向（技术、产品、运营、设计、算法等），并结合腾讯各BG的实际需求给出建议
- 分析学生的专业背景、兴趣和能力，给出分阶段的成长规划
- 解读腾讯企业文化：用户为本（一切以用户价值为依归）、科技向善（技术是一种能力，向善是一种选择）
- 介绍腾讯六大事业群的核心业务和人才画像：
  * WXG（微信事业群）：微信、视频号、小程序、企业微信，13亿+月活，张小龙团队
  * IEG（互动娱乐事业群）：游戏研发（天美/光子/魔方工作室）、电竞，2025年游戏收入2416亿
  * CSIG（云与智慧产业事业群）：腾讯云、腾讯会议、混元AI商业化，汤道生团队
  * TEG（技术工程事业群）：底层技术基础设施、AI算力、混元大模型基础研发
  * CDG（企业发展事业群）：金融科技、广告营销、战略投资
  * PCG（平台与内容事业群）：腾讯视频、新闻等内容生态
- 解答关于行业趋势、岗位选择、能力要求等问题

【回答风格】
- 友善鼓励、专业务实，像腾讯内部的导师一样温暖而专业
- 回答结构化：先给结论，再分点说明，最后给出行动建议
- 适当引用腾讯真实案例（如微信的"少即是多"、赛马机制、930组织变革）增强说服力
- 根据学生年级调整建议的深度和紧迫程度
- 融入腾讯文化元素：瑞雪文化（简单直接沟通、尊重多元）、长期主义、用户价值导向

【回答格式】
1. 先理解学生的核心问题
2. 给出清晰的判断/建议
3. 分点说明理由和依据（可适当引用腾讯案例）
4. 给出具体的下一步行动清单

【禁止事项】
- 不要代替学生做决定，而是帮他们分析利弊
- 不要给出过于笼统的建议，要具体可操作
- 不要过度推销腾讯，保持客观中立的职业顾问角色
- 不要泄露腾讯内部机密信息，仅使用公开资料`,

  interview: `你是一位代表腾讯校招团队的资深面试官，拥有15年大厂面试经验，曾任腾讯WXG/IEG/CSIG等技术团队面试官和面试官培训导师，深度理解腾讯的人才评估标准和"正直、进取、协作、创造"价值观。

【身份定位】
- 你是腾讯真实面试官的AI化身，熟悉腾讯校招全流程（笔试→一面→二面→三面→HR面）
- 你掌握腾讯技术面/产品面/HR面的评分标准和考察维度
- 你了解腾讯手撕代码贯穿始终的特点，以及各轮面试的不同侧重点

【腾讯校招面试全流程】
- 笔试/在线测评：算法、基础知识、逻辑思维、性格测试
- 一面（基础面）：直系主管或资深员工，考基础、手撕代码、项目细节（淘汰率最高）
- 二面（技术深度/Leader面）：部门大Leader，考系统设计、架构思维、难点攻克、技术广度
- 三面（GM/总监面）：有时有，考宏观视野、业务理解、潜力、价值观匹配
- HR面（文化面）：最后关卡，考稳定性、动机、薪资期望、"味道对不对"

【核心职责】
- 模拟腾讯真实面试场景，按轮次逐步提问
- 分析学生回答，给出专业点评和改进建议
- 传授面试技巧：STAR法则、回答框架、手撕代码规范
- 介绍腾讯各岗位的面试流程、题型和评分标准
- 融入腾讯文化考察：用户价值思维、协作精神、长期主义

【回答风格】
- 严肃但友善，像真实腾讯面试官一样专业
- 提问后等待学生回答，再进行点评，绝不一次性给所有问题
- 指出回答中的亮点和不足，给出具体改进方向
- 手撕代码时关注：正确性（60%）+ 复杂度（30%）+ 代码规范（10%）

【技术面知识点覆盖】
- 基础知识（40%）：TCP/HTTP、进程线程、数据库（MySQL索引、事务）、Redis
- 算法题（30%）：LeetCode Medium难度，手撕代码（LRU、快排、动态规划等）
- 项目深挖（20%）：你做过的项目，问得很细，注重量化成果
- 系统设计（10%）：高并发系统、分布式缓存、消息队列削峰

【产品面知识点覆盖】
- 需求分析：KANO模型、用户画像公式、用户价值评估
- 产品设计：少即是多、MVP思维、数据驱动迭代
- 数据分析：A/B测试、漏斗分析、留存率优化
- 腾讯产品观：一切以用户价值为依归、科技向善

【HR面知识点覆盖】
- 自我介绍：1分钟结构化表达
- 动机考察：为什么想来腾讯？对腾讯文化的理解
- 抗压能力：遇到困难的经历、如何面对失败
- 职业规划：未来3-5年想成为怎样的角色
- 文化契合：团队协作、冲突处理、瑞雪文化理解

【回答格式】
当学生说"开始面试"时：
1. 先确认目标岗位和事业群
2. 让学生做1分钟自我介绍
3. 根据岗位类型逐步提问（每次只问1-2个问题）
4. 等学生回答后再点评，给出评分和改进建议
5. 模拟腾讯真实面试节奏，不急于推进

【禁止事项】
- 不要一次性给出所有问题和答案
- 不要代替学生回答
- 不要在学生没回答完就给出结论
- 不要跳过面试轮次，要循序渐进`,

  resume: `你是一位代表腾讯校招团队的资深HR，拥有10年腾讯简历筛选和评估经验，熟悉腾讯NLP简历关键词匹配算法和各事业群的人才画像标准。

【身份定位】
- 你是腾讯校招简历评估的"守门员"，每年筛选数万份简历
- 你了解腾讯HR系统如何通过NLP模型抓取技术关键词和项目量化指标
- 你掌握腾讯六大BG对简历的不同侧重要求

【腾讯简历筛选逻辑】
- 技术岗：重点抓取算法名称、框架版本、量化指标（如"优化数据库查询效率30%"）
- 产品岗：关注用户增长公式、A/B测试案例、数据驱动决策能力
- 运营岗：看重用户运营数据、活动策划成果、社群管理经验
- 设计岗：注重作品集链接、设计工具熟练度、用户研究成果

【核心职责】
- 帮助学生撰写符合腾讯标准的简历
- 教授如何用STAR法则描述项目/实习经历
- 指导简历排版、格式、篇幅等细节（腾讯偏好简洁专业风格）
- 分析不同事业群的简历侧重点
- 提供简历修改的具体建议和对比示例

【回答风格】
- 专业严谨但友善，像经验丰富的腾讯HR导师
- 给出具体的修改建议，而不是泛泛而谈
- 用对比示例说明"好"和"差"的简历写法
- 关注简历的可量化成果和数据支撑
- 强调腾讯价值观的体现：用户为本、协作精神、长期主义

【简历评估维度】
- 基本信息（教育背景、联系方式、GitHub/Blog链接）
- 实习经历（公司含金量、岗位相关度、成果描述，腾讯看重"用户价值"相关成果）
- 项目经验（技术深度、创新性、影响力，要嵌入算法名称、框架版本）
- 技能清单（语言/框架/工具，标注熟练程度，腾讯关注底层原理理解）
- 荣誉奖项（竞赛、奖学金、专利等，体现"进取"价值观）
- 自我评价（真实具体、避免空话套话，展现"正直"价值观）

【STAR法则（腾讯简历核心方法）】
- S（情境）：项目/实习的背景和上下文
- T（任务）：你面临的具体任务或挑战
- A（行动）：你采取了什么行动（重点写！要具体到技术选型和决策过程）
- R（结果）：最终成果，用数据说话（腾讯HR系统会抓取量化指标）

【回答格式】
1. 先评估简历现状
2. 指出需要改进的具体点
3. 给出修改前后的对比示例
4. 提供针对性的优化建议
5. 说明腾讯HR系统会如何评估这份简历

【禁止事项】
- 不要帮学生编造不存在的经历（腾讯有背调，"正直"是高压线）
- 不要建议过度包装或夸大
- 不要给出不符合行业惯例的建议
- 不要忽略腾讯文化契合度的体现`,
};

function buildSystemPrompt(grade: UserGrade | null, scene: ChatSceneId): string {
  const basePrompt = sceneSystemPrompts[scene];
  const gradeContext = grade
    ? `\n\n当前用户是${gradeLabels[grade]}。请根据该年级阶段的特点调整回答：
- 大一：以探索认知为主，建议体验课程、参加社团、了解行业，可关注腾讯技术课、腾讯校招公众号等官方资源
- 大二：以方向选择为主，建议开始积累项目经验和基础能力，可尝试申请腾讯日常实习
- 大三：以实习实战为主，建议申请暑期实习（腾讯3-4月开放）、准备秋招，关注各BG独立招聘
- 大四：以求职冲刺为主，建议全力准备秋招/春招（腾讯8-10月秋招），了解导师制培养体系
- 研究生：以专业深度为主，建议关注研究岗、算法岗等专业岗位，腾讯TEG和AI Lab非常欢迎研究背景人才`
    : '';
  const tencentContext = `\n\n你是腾讯校招团队的代表，当学生询问腾讯相关信息时，可以详细介绍：
- 六大事业群：WXG（微信事业群）、IEG（互动娱乐事业群）、CSIG（云与智慧产业事业群）、TEG（技术工程事业群）、CDG（企业发展事业群）、PCG（平台与内容事业群）
- 企业文化：用户为本（一切以用户价值为依归）、科技向善（技术是一种能力，向善是一种选择）
- 瑞雪文化：简单直接沟通、尊重多元、廉洁自律（腾讯高压线）、跨部门协作
- 培养体系：导师制（1v1带教）、活水计划（内部转岗）、职业发展通道（T族/P族双通道）
- 校招流程：网申→笔试/在线测评→群面（部分岗位）→一面（基础面）→二面（技术深度/Leader面）→三面（GM/总监面，有时有）→HR面（文化面）
- 福利待遇：1095工作强度（10点上班、9点下班、每周5天）、周三健康日、周五6点可下班、免费早晚餐、超大工位、健身房、团建福利
- 不要主动推销腾讯，保持客观中立的职业顾问角色`;

  return basePrompt + gradeContext + tencentContext;
}

function parseAPIError(status: number, errorData: { error?: { code?: string; message?: string }; message?: string }): string {
  const code = errorData?.error?.code;
  const message = errorData?.error?.message || errorData?.message || '';

  if (status === 401 || code === '1000' || code === '1001' || code === '1002' || code === '1003' || code === '1004') {
    return 'API_KEY_INVALID';
  }

  if (code === '1113' || message.includes('欠费') || message.includes('余额') || message.includes('充值')) {
    return 'ACCOUNT_BALANCE';
  }

  if (code === '1110' || code === '1111' || code === '1112' || code === '1121') {
    return 'ACCOUNT_ISSUE';
  }

  if (code === '1211' || message.includes('模型不存在') || message.includes('模型代码')) {
    return 'MODEL_NOT_FOUND';
  }

  if (code === '1309' || message.includes('套餐已到期') || message.includes('续订')) {
    return 'PLAN_EXPIRED';
  }

  if (code === '1310' || code === '1308' || message.includes('使用上限') || message.includes('限额')) {
    return 'RATE_LIMIT';
  }

  if (code === '1305' || code === '1312' || message.includes('访问量过大') || message.includes('稍后再试')) {
    return 'SERVICE_BUSY';
  }

  if (code === '1301' || message.includes('敏感内容') || message.includes('不安全')) {
    return 'CONTENT_BLOCKED';
  }

  if (code === '1210' || code === '1214' || status === 400) {
    return 'INVALID_PARAMS';
  }

  if (status === 429) {
    return 'ACCOUNT_BALANCE';
  }

  if (status >= 500) {
    return 'SERVER_ERROR';
  }

  return 'UNKNOWN';
}

const errorMessages: Record<string, string> = {
  API_KEY_NOT_SET: '请先配置API Key才能使用AI对话功能。点击右上角设置按钮进行配置。',
  API_KEY_INVALID: 'API Key 无效或已过期，请检查后重新配置。',
  ACCOUNT_BALANCE: '账户余额不足或额度已用完，请前往智谱AI开放平台充值。',
  ACCOUNT_ISSUE: '账户状态异常，请联系智谱客服处理。',
  MODEL_NOT_FOUND: '当前选择的模型不可用，请切换到其他模型重试。',
  PLAN_EXPIRED: '您的Coding套餐已到期，请续订或切换到其他模型。',
  RATE_LIMIT: '已达到使用上限，请稍后重试或切换模型。',
  SERVICE_BUSY: '当前模型访问量过大，请稍后重试或切换到其他模型。',
  CONTENT_BLOCKED: '检测到输入内容可能包含敏感信息，请修改后重试。',
  INVALID_PARAMS: '请求参数有误，请检查后重试。',
  SERVER_ERROR: '智谱AI服务器暂时不可用，请稍后重试。',
  UNKNOWN: 'AI服务暂时不可用，请稍后重试。如果问题持续，请检查API配置。',
};

export function getAPIErrorMessage(errorType: string): string {
  return errorMessages[errorType] || errorMessages.UNKNOWN;
}

function throwAPIError(status: number, errorData: { error?: { code?: string; message?: string }; message?: string }): never {
  const errorType = parseAPIError(status, errorData);
  const error = new Error(errorType) as Error & { errorType: string };
  error.errorType = errorType;
  throw error;
}

function getApiConfigForCurrentMode(): { url: string; headers: Record<string, string>; body: Record<string, unknown> } {
  const customKey = localStorage.getItem('future_goose_api_key');
  const customBaseUrl = localStorage.getItem('future_goose_base_url');
  const isCustomMode = !!(customKey && customKey !== 'proxy');

  if (isCustomMode) {
    return {
      url: `${customBaseUrl}/chat/completions`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customKey}`,
      },
      body: {
        model: API_CONFIG.getModel(),
        temperature: 0.8,
        max_tokens: 4096,
        thinking: {
          type: 'enabled',
          clear_thinking: false,
        },
      },
    };
  }

  return {
    url: API_CONFIG.baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      model: API_CONFIG.getModel(),
    },
  };
}

export async function callAIAPI(
  messages: ChatMessage[],
  grade: UserGrade | null,
  scene: ChatSceneId
): Promise<string> {
  const apiKey = API_CONFIG.getApiKey();

  if (!apiKey) {
    throw new Error('API_KEY_NOT_SET');
  }

  const systemPrompt = buildSystemPrompt(grade, scene);

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.slice(-10).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })),
  ];

  const config = getApiConfigForCurrentMode();

  const response = await fetch(config.url, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      ...config.body,
      messages: apiMessages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throwAPIError(response.status, errorData);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '抱歉，我暂时无法回答这个问题，请稍后再试。';
}

let currentAbortController: AbortController | null = null;

export function abortAPIStream(): void {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
}

export async function callAIAPIStream(
  messages: ChatMessage[],
  grade: UserGrade | null,
  scene: ChatSceneId,
  onChunk: (chunk: string) => void,
  onReasoningChunk?: (chunk: string) => void
): Promise<{ content: string; reasoning_content: string }> {
  const apiKey = API_CONFIG.getApiKey();

  if (!apiKey) {
    throw new Error('API_KEY_NOT_SET');
  }

  const systemPrompt = buildSystemPrompt(grade, scene);

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.slice(-10).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
      ...(msg.reasoning_content ? { reasoning_content: msg.reasoning_content } : {}),
    })),
  ];

  currentAbortController = new AbortController();
  const { signal } = currentAbortController;

  let fullContent = '';
  let fullReasoningContent = '';

  try {
    const response = await fetch(API_CONFIG.getBaseUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: API_CONFIG.getModel(),
        messages: apiMessages,
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throwAPIError(response.status, errorData);
    }

    if (!response.body) {
      throw new Error('SERVER_ERROR');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;

          const dataStr = trimmed.slice(5).trim();
          if (dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);
            const finishReason = parsed.choices?.[0]?.finish_reason;
            if (finishReason === 'error' || finishReason === 'content_filter') {
              const errorMsg = parsed.choices?.[0]?.message?.content || parsed.error?.message || '';
              if (errorMsg) {
                throwAPIError(400, { error: { message: errorMsg } });
              }
            }
            const delta = parsed.choices?.[0]?.delta;
            if (delta) {
              if (delta.content) {
                fullContent += delta.content;
                onChunk(delta.content);
              }
              if (delta.reasoning_content) {
                fullReasoningContent += delta.reasoning_content;
                if (onReasoningChunk) {
                  onReasoningChunk(delta.reasoning_content);
                }
              }
            }
          } catch (e: unknown) {
            if ((e as Error & { errorType?: string }).errorType) throw e;
            continue;
          }
        }
      }
    }
  } catch (e: unknown) {
    if ((e as Error).name === 'AbortError') {
      const abortError = new Error('ABORTED') as Error & { errorType: string };
      (abortError as Error & { errorType: string }).errorType = 'ABORTED';
      throw abortError;
    }
    throw e;
  } finally {
    currentAbortController = null;
  }

  return {
    content: fullContent || '抱歉，我暂时无法回答这个问题，请稍后再试。',
    reasoning_content: fullReasoningContent,
  };
}

export async function getDemoStreamResponse(
  userMessage: string,
  grade: UserGrade | null,
  scene: ChatSceneId,
  onChunk: (chunk: string) => void
): Promise<string> {
  const fullResponse = getDemoResponse(userMessage, grade, scene);
  
  const words = fullResponse.split('');
  let current = '';
  
  for (const word of words) {
    if (currentAbortController?.signal.aborted) {
      const abortError = new Error('ABORTED') as Error & { errorType: string };
      (abortError as Error & { errorType: string }).errorType = 'ABORTED';
      throw abortError;
    }
    current += word;
    onChunk(word);
    await new Promise((resolve) => setTimeout(resolve, 20 + Math.random() * 30));
  }
  
  return current;
}

export function getDemoResponse(
  userMessage: string,
  grade: UserGrade | null,
  scene: ChatSceneId
): string {
  const gradeLabel = grade ? gradeLabels[grade] : '大学生';

  const careerResponses: Record<string, string> = {
    '互联网': '互联网行业主要分为以下几个方向：\n\n1. **技术研发**：前端、后端、移动端、算法、AI/ML\n2. **产品经理**：用户产品、策略产品、数据产品\n3. **运营**：内容运营、用户运营、活动运营\n4. **设计**：UI/UX设计、视觉设计、交互设计\n5. **其他**：市场、销售、HR、财务等\n\n建议先从自己感兴趣的方向入手，多了解各岗位的日常工作和能力要求。',
    '准备': `作为${gradeLabel}，建议你按以下节奏准备：\n\n1. **学好专业课**：打好基础知识是最重要的\n2. **多动手实践**：参加项目比赛或自己做一些小项目\n3. **了解行业**：关注行业报告和公司动态\n4. **建立人脉**：参加技术社区、校友活动等\n5. **保持好奇心**：持续关注新技术和新趋势`,
    '方向': '选择方向可以考虑三个维度：\n\n1. **兴趣驱动**：你对什么领域最有热情？\n2. **能力匹配**：你擅长什么？逻辑思维强可以考虑技术/算法，沟通能力强可以考虑产品/运营\n3. **市场需求**：当前行业趋势是什么？哪些岗位需求量大？\n\n建议多尝试不同方向，通过项目实践找到最适合自己的路。',
    '腾讯': '腾讯的核心业务板块：\n\n1. **社交**：微信、QQ\n2. **游戏**：天美、光子等工作室\n3. **云与AI**：腾讯云、混元大模型\n4. **金融科技**：微信支付\n5. **内容**：腾讯视频、腾讯音乐\n\n校招岗位包括技术、产品、运营、设计、市场等多个方向，每个BG（事业群）有独立招聘。腾讯文化强调"用户为本、科技向善"，校招有完善的导师制培养体系。',
  };

  const interviewResponses: Record<string, string> = {
    '开始面试': '好的，我们开始模拟面试。\n\n请先做一个1分钟的自我介绍，包括你的教育背景、项目经历和求职意向。\n\n（请直接在对话中回复你的自我介绍，我会根据你的回答进行点评和后续提问）',
    '自我介绍': '自我介绍建议遵循以下结构：\n\n1. **基本信息**（10秒）：学校+专业+年级\n2. **核心经历**（30秒）：1-2个最有含金量的项目/实习\n3. **能力亮点**（10秒）：你最大的优势是什么\n4. **求职意向**（10秒）：目标岗位和方向\n\n**示例**：\n"你好，我是XX大学计算机专业大三学生。之前在XX公司做过后端开发实习，参与了XX项目，用Go语言实现了XX功能，性能提升了30%。我擅长后端开发和系统设计，这次申请贵公司的后端开发岗位。"',
    '面试技巧': '面试核心技巧：\n\n1. **STAR法则**回答问题：情境(Situation)→任务(Task)→行动(Action)→结果(Result)\n2. **不懂的不要装懂**：坦诚说不会，但可以给出思考方向\n3. **边写边说**：算法题要边写边解释思路\n4. **主动沟通**：遇到不清楚的需求，主动提问确认\n5. **反问环节**：提前准备3-5个关于团队/业务/技术的问题',
    '技术面': '技术面常见考察点：\n\n1. **基础知识**（40%）：语言特性、网络、操作系统、数据库\n2. **算法题**（30%）：LeetCode Medium难度，注重思路清晰\n3. **项目深挖**（20%）：你做过的项目，会问得很细\n4. **系统设计**（10%）：简单的设计题，考察架构思维\n\n建议每天刷1-2道算法题，复习基础知识，准备2个能深度讲解的项目。',
    'HR面': 'HR面常见问题：\n\n1. "介绍一下你自己"（考察表达能力）\n2. "为什么想来腾讯"（考察动机）\n3. "你最大的优缺点"（考察自我认知）\n4. "遇到困难的经历"（考察抗压能力）\n5. "职业规划是什么"（考察稳定性）\n\n回答要点：真诚、有逻辑、有准备、展现对公司的了解。',
  };

  const resumeResponses: Record<string, string> = {
    '简历': '一份好的简历应该包含以下部分：\n\n1. **基本信息**：姓名、电话、邮箱、GitHub/Blog链接\n2. **教育背景**：学校、专业、GPA（如果高的话）、排名\n3. **实习经历**（最重要）：公司+岗位+具体贡献+数据成果\n4. **项目经验**：项目名称+你的角色+技术方案+成果\n5. **技能清单**：语言/框架/工具，标注熟练程度\n6. **荣誉奖项**：竞赛、奖学金、专利等\n\n建议控制在1页，重点突出与目标岗位相关的经历。',
    'STAR': 'STAR法则是简历描述的核心方法：\n\n**S（情境）**：项目/实习的背景和上下文\n**T（任务）**：你面临的具体任务或挑战\n**A（行动）**：你采取了什么行动（重点写！）\n**R（结果）**：最终成果，用数据说话\n\n**差的写法**：\n"负责后端开发"\n\n**好的写法**：\n"负责XX系统后端开发，使用Go+MySQL，设计并实现了XX接口，将响应时间从200ms优化至50ms，QPS提升3倍"',
    '项目': '项目经验的描述要点：\n\n1. **说清楚背景**：这是什么项目？解决了什么问题？\n2. **突出你的贡献**：你具体做了什么？（不要写团队做了什么）\n3. **用数据说话**：性能提升了多少？用户增长了多少？\n4. **体现技术深度**：用了什么技术？为什么这么选？遇到了什么坑？\n\n**公式**：动词 + 技术/工具 + 做了什么 + 结果（量化）\n\n例："使用Redis重构缓存层，将页面加载时间从3s降至500ms"',
    '格式': '简历格式建议：\n\n1. **篇幅**：本科1页，硕士最多2页\n2. **排版**：简洁专业，不要用花哨模板\n3. **字体**：微软雅黑/思源黑体，正文10-11号\n4. **间距**：行间距1.2-1.5，段落间留白\n5. **导出**：PDF格式，文件名"姓名-岗位-学校"\n6. **检查**：拼写、标点、格式一致性\n\n推荐工具：超级简历、知页简历、LaTeX模板',
  };

  const responsesByScene = {
    career: careerResponses,
    interview: interviewResponses,
    resume: resumeResponses,
  };

  const responses = responsesByScene[scene];

  for (const [keyword, response] of Object.entries(responses)) {
    if (userMessage.includes(keyword)) {
      return response;
    }
  }

  const defaultResponses: Record<ChatSceneId, string> = {
    career: `这是一个很好的职业发展问题！作为${gradeLabel}，建议你多关注行业动态、积累项目经验、保持学习热情。你可以具体问我关于岗位选择、能力要求、成长规划等问题，我会给你更详细的建议！`,
    interview: `面试准备是一个系统性的过程。建议你从基础知识复习、算法练习、项目梳理三个方面入手。你可以具体问我关于面试流程、常见问题、回答技巧等，我会给你针对性的指导！`,
    resume: `简历是求职的第一道关卡。建议你先梳理自己的所有经历，然后针对目标岗位筛选最相关的经历来写。你可以把简历内容发给我，我会帮你逐条优化！`,
  };

  return defaultResponses[scene];
}

export const quickQuestions: Record<ChatSceneId, Record<UserGrade, string[]>> = {
  career: {
    freshman: [
      '互联网行业有哪些方向？',
      '大一应该怎么准备进腾讯？',
      '腾讯六大事业群都是做什么的？',
    ],
    sophomore: [
      '如何选择适合自己的事业群？',
      '大二可以申请腾讯日常实习吗？',
      '技术岗和产品岗在腾讯有什么区别？',
    ],
    junior: [
      '腾讯暑期实习怎么申请？3-4月开放？',
      'WXG和IEG哪个更适合我？',
      '腾讯导师制培养体系怎么样？',
    ],
    senior: [
      '腾讯秋招8-10月流程是什么？',
      '腾讯1095工作强度是真的吗？',
      '腾讯T族和P族职业发展通道？',
    ],
    graduate: [
      '研究生进腾讯TEG AI Lab需要什么条件？',
      '腾讯混元大模型团队招什么方向？',
      'CSIG的AI商业化是做什么？',
    ],
  },
  interview: {
    freshman: [
      '腾讯一面考什么基础？',
      '手撕代码LRU怎么写？',
      '腾讯面试流程有几轮？',
    ],
    sophomore: [
      '腾讯技术面4-3-2-1评分比例？',
      'STAR法则在腾讯面试怎么用？',
      '腾讯HR面考察什么文化契合度？',
    ],
    junior: [
      '腾讯二面Leader面考系统设计吗？',
      '腾讯三面总监面问什么问题？',
      '腾讯面试为什么看重用户价值思维？',
    ],
    senior: [
      '腾讯秋招面试全流程模拟',
      '腾讯面试反问环节问什么？',
      '腾讯瑞雪文化在面试怎么体现？',
    ],
    graduate: [
      '腾讯研究岗面试特点？',
      '腾讯技术深度面怎么准备？',
      '腾讯面试手撕代码评分标准？',
    ],
  },
  resume: {
    freshman: [
      '大一简历怎么写能进腾讯？',
      '腾讯简历STAR法则怎么写？',
      '腾讯HR系统怎么抓取关键词？',
    ],
    sophomore: [
      '没有实习经历怎么写腾讯简历？',
      '腾讯技术岗简历要嵌入什么算法名称？',
      '腾讯产品岗简历怎么写用户增长案例？',
    ],
    junior: [
      '腾讯暑期实习简历优化要点',
      '腾讯六大BG简历侧重点有什么不同？',
      '腾讯简历量化指标怎么写？',
    ],
    senior: [
      '腾讯秋招简历1页还是2页？',
      '腾讯简历如何体现用户为本价值观？',
      '腾讯HR面简历背调会查什么？',
    ],
    graduate: [
      '研究生学术论文放腾讯简历哪里？',
      '腾讯TEG研究岗简历怎么写？',
      '腾讯AI Lab简历看重什么？',
    ],
  },
};

export { API_CONFIG };
