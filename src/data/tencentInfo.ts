import { TencentJob, TencentCulture } from '@/types';

export const tencentJobs: TencentJob[] = [
  {
    id: '1',
    category: '技术类',
    title: '前端开发工程师',
    description: '负责腾讯核心产品的前端开发与优化',
    requirements: ['精通HTML/CSS/JavaScript', '熟悉React/Vue框架', '了解前端工程化', '有良好的代码规范'],
    responsibilities: [
      '负责腾讯核心产品（微信、QQ等）的前端架构设计与开发',
      '持续优化产品性能，提升用户体验',
      '参与前端技术选型和基础设施建设',
      '与产品、设计、后端团队紧密协作，推动项目落地'
    ],
    qualifications: [
      '计算机或相关专业本科及以上学历',
      '精通HTML5、CSS3、JavaScript等前端技术',
      '深入理解React/Vue/Angular等至少一种主流框架',
      '熟悉前端工程化工具（Webpack/Vite等）',
      '了解HTTP协议、浏览器原理及性能优化'
    ],
    plusItems: [
      '有大型互联网项目经验',
      '参与过开源项目或有技术博客',
      '了解TypeScript、Node.js',
      '有移动端开发经验（小程序/React Native等）'
    ],
    location: '深圳/广州',
    applyLink: 'https://join.qq.com/',
  },
  {
    id: '2',
    category: '技术类',
    title: '后端开发工程师',
    description: '参与腾讯高并发系统的架构设计与开发',
    requirements: ['精通C++/Go/Java', '熟悉分布式系统', '了解数据库优化', '有大规模系统经验优先'],
    responsibilities: [
      '参与腾讯核心业务系统的架构设计与开发',
      '负责高并发、海量数据处理的技术攻关',
      '优化系统性能，保障服务稳定性和可用性',
      '编写高质量的技术文档'
    ],
    qualifications: [
      '计算机或相关专业本科及以上学历',
      '精通C++/Go/Java等至少一种后端语言',
      '熟悉MySQL/Redis等存储系统',
      '了解分布式系统原理，有微服务架构经验',
      '掌握常用的数据结构与算法'
    ],
    plusItems: [
      '有大规模分布式系统经验',
      '熟悉Kafka/RabbitMQ等消息队列',
      '了解容器化技术（Docker/K8s）',
      '有开源项目贡献'
    ],
    location: '深圳/广州',
    applyLink: 'https://join.qq.com/',
  },
  {
    id: '3',
    category: '技术类',
    title: '算法工程师',
    description: '参与AI算法研发，应用于搜索、推荐、广告等场景',
    requirements: ['硕士及以上学历', '熟悉机器学习/深度学习', '有顶会论文优先', '编程能力强'],
    responsibilities: [
      '参与推荐系统/搜索算法/广告算法的研发与优化',
      '跟踪前沿AI技术，探索新算法在业务场景的应用',
      '与工程团队协作，推动算法上线和迭代',
      '参与技术论文撰写和专利申请'
    ],
    qualifications: [
      '计算机/数学/统计学等相关专业硕士及以上学历',
      '扎实的机器学习/深度学习基础',
      '熟练使用Python/C++，熟悉PyTorch/TensorFlow',
      '有较强的论文阅读和算法实现能力',
      '有良好的数据分析和实验设计能力'
    ],
    plusItems: [
      '在顶会（NeurIPS/ICML/KDD等）发表论文',
      '有推荐系统/搜索/广告相关经验',
      '参与过Kaggle等算法竞赛并获奖',
      '有大模型（LLM）相关经验'
    ],
    location: '深圳/北京',
    applyLink: 'https://join.qq.com/',
  },
  {
    id: '4',
    category: '产品类',
    title: '产品经理',
    description: '负责核心产品的规划与落地',
    requirements: ['优秀的逻辑思维能力', '数据分析能力', '用户洞察力', '沟通协调能力'],
    responsibilities: [
      '负责产品的需求分析、功能规划和落地执行',
      '深入理解用户需求，持续优化产品体验',
      '协调设计、开发、运营等团队，推动产品迭代',
      '基于数据分析进行产品决策和效果评估'
    ],
    qualifications: [
      '本科及以上学历，专业不限',
      '有较强的逻辑思维和问题分析能力',
      '熟练使用Axure/Figma等产品工具',
      '有数据分析能力，能基于数据做决策',
      '有优秀的沟通和跨团队协作能力'
    ],
    plusItems: [
      '有互联网产品实习经验',
      '有自己的产品作品或项目',
      '了解用户体验设计原则',
      '对某一领域（社交/内容/游戏等）有深入理解'
    ],
    location: '深圳/广州',
    applyLink: 'https://join.qq.com/',
  },
  {
    id: '5',
    category: '产品类',
    title: '用户研究员',
    description: '通过用户研究为产品决策提供依据',
    requirements: ['熟悉用户研究方法', '数据分析能力', '心理学/社会学背景优先', '良好的报告撰写能力'],
    responsibilities: [
      '制定用户研究计划，开展定性和定量研究',
      '通过深度访谈、可用性测试、问卷等方式洞察用户需求',
      '输出研究报告，为产品设计和优化提供依据',
      '跟踪行业动态，研究用户行为趋势'
    ],
    qualifications: [
      '心理学/社会学/人机交互等相关专业本科及以上学历',
      '熟悉用户研究方法和工具',
      '有较强的数据分析和报告撰写能力',
      '具备良好的沟通和共情能力',
      '有独立思考和创新意识'
    ],
    plusItems: [
      '有用研项目实践经验',
      '掌握统计分析工具（SPSS/R/Python）',
      '了解用户体验设计流程',
      '有学术研究背景或发表过论文'
    ],
    location: '深圳',
    applyLink: 'https://join.qq.com/',
  },
  {
    id: '6',
    category: '运营类',
    title: '内容运营',
    description: '负责平台内容生态的建设与运营',
    requirements: ['优秀的文案能力', '数据分析能力', '对内容行业有深入了解', '有运营经验优先'],
    responsibilities: [
      '负责内容生态规划和运营策略制定',
      '策划并执行内容活动，提升用户参与度和活跃度',
      '挖掘优质创作者，建立创作者合作关系',
      '基于数据分析持续优化内容运营策略'
    ],
    qualifications: [
      '本科及以上学历，新闻/传播/中文等相关专业优先',
      '有优秀的文案撰写和内容策划能力',
      '对内容行业（短视频/图文/直播等）有深入了解',
      '有数据分析能力，能基于数据调整策略',
      '有敏锐的热点嗅觉和内容敏感度'
    ],
    plusItems: [
      '有互联网内容运营实习经验',
      '有自媒体运营经验或作品',
      '了解创作者生态和MCN运作',
      '熟悉各内容平台规则和玩法'
    ],
    location: '深圳/广州',
    applyLink: 'https://join.qq.com/',
  },
  {
    id: '7',
    category: '设计类',
    title: 'UI/UX设计师',
    description: '负责腾讯产品的用户体验设计',
    requirements: ['熟练使用设计工具', '有作品集', '理解用户心理', '良好的沟通能力'],
    responsibilities: [
      '负责腾讯产品的用户体验设计，包括界面设计和交互设计',
      '参与用户研究，理解用户需求并转化为设计方案',
      '与产品经理和开发团队协作，推动设计落地',
      '建立和维护设计系统，保证设计一致性'
    ],
    qualifications: [
      '设计/人机交互/心理学等相关专业本科及以上学历',
      '熟练使用Figma/Sketch/Photoshop等设计工具',
      '有完整的作品集，展示设计思维和流程',
      '了解用户体验设计原则和交互设计方法论',
      '有良好的沟通表达和团队协作能力'
    ],
    plusItems: [
      '有互联网产品设计经验',
      '了解前端开发基础知识',
      '有动效设计能力',
      '参与过设计系统建设'
    ],
    location: '深圳',
    applyLink: 'https://join.qq.com/',
  },
  {
    id: '8',
    category: '设计类',
    title: '视觉设计师',
    description: '负责品牌视觉与运营视觉设计',
    requirements: ['优秀的设计审美', '熟练掌握设计软件', '有品牌设计经验', '创意能力强'],
    responsibilities: [
      '负责腾讯品牌和产品的视觉设计',
      '参与营销活动、运营活动的视觉创意设计',
      '建立品牌视觉规范，保证品牌形象一致性',
      '探索设计创新，提升品牌视觉表现力'
    ],
    qualifications: [
      '视觉传达/艺术设计等相关专业本科及以上学历',
      '有优秀的视觉设计能力和审美水平',
      '熟练使用PS/AI/AE等设计软件',
      '有完整的作品集，展示多元化设计能力',
      '有创意发散和落地执行能力'
    ],
    plusItems: [
      '有品牌设计或4A广告公司经验',
      '有3D设计或动效设计能力',
      '了解插画设计',
      '获得过设计类奖项'
    ],
    location: '深圳',
    applyLink: 'https://join.qq.com/',
  },
];

export const tencentCultures: TencentCulture[] = [
  { title: '用户为本', description: '一切以用户价值为依归', icon: 'Heart' },
  { title: '科技向善', description: '用科技解决社会问题', icon: 'Globe' },
  { title: '正直进取', description: '坚持原则，持续创新', icon: 'Shield' },
  { title: '协作共赢', description: '开放合作，共同成长', icon: 'Users' },
];

export const tencentTraining = {
  title: '腾讯校招培养体系',
  items: [
    { title: '导师制', description: '每位新人配备专属导师，一对一辅导' },
    { title: '轮岗机会', description: '有机会在不同团队轮岗，拓宽视野' },
    { title: '学习资源', description: '丰富的内部课程和技术分享平台' },
    { title: '成长通道', description: '清晰的技术/管理双通道发展路径' },
  ],
};
