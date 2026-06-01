import { GrowthPath, UserGrade } from '@/types';

export const growthPaths: Record<UserGrade, GrowthPath> = {
  freshman: {
    grade: 'freshman',
    milestones: [
      { id: 'f1', title: '了解互联网行业', description: '阅读行业报告、关注科技媒体', completed: false },
      { id: 'f2', title: '探索兴趣方向', description: '参加社团、技术沙龙、产品体验', completed: false },
      { id: 'f3', title: '打好专业基础', description: '认真学习专业课，保持好成绩', completed: false },
      { id: 'f4', title: '完成第一个项目', description: '参加技术比赛或自主开发小项目', completed: false },
    ],
    resources: [
      { id: 'fr1', type: 'course', title: '互联网行业入门课程', description: '了解互联网行业发展历程和趋势', url: '#', icon: 'BookOpen', priority: 'high', difficulty: 'beginner', tags: ['行业认知', '入门'] },
      { id: 'fr2', type: 'article', title: '腾讯技术课', description: '腾讯工程师分享技术经验', url: '#', icon: 'FileText', priority: 'medium', difficulty: 'beginner', tags: ['技术分享', '腾讯'] },
      { id: 'fr3', type: 'course', title: 'Python/Java入门', description: '打好编程基础', url: '#', icon: 'Code', priority: 'high', difficulty: 'beginner', tags: ['编程', '入门'] },
    ],
  },
  sophomore: {
    grade: 'sophomore',
    milestones: [
      { id: 's1', title: '确定职业方向', description: '技术/产品/运营/设计', completed: false },
      { id: 's2', title: '深入学习专业技能', description: '根据方向选择学习路径', completed: false },
      { id: 's3', title: '参加实习或项目', description: '积累实战经验', completed: false },
      { id: 's4', title: '建立技术影响力', description: '写技术博客、开源项目', completed: false },
    ],
    resources: [
      { id: 'sr1', type: 'course', title: '前端开发进阶', description: 'React/Vue深入学习', url: '#', icon: 'Code', priority: 'high', difficulty: 'intermediate', tags: ['前端', '框架'] },
      { id: 'sr2', type: 'certificate', title: '腾讯云认证', description: '获得行业认可的技能证书', url: '#', icon: 'Award', priority: 'medium', difficulty: 'intermediate', tags: ['证书', '云计算'] },
      { id: 'sr3', type: 'internship', title: '腾讯日常实习', description: '日常实习岗位开放申请', url: '#', icon: 'Briefcase', priority: 'high', difficulty: 'intermediate', tags: ['实习', '腾讯'] },
    ],
  },
  junior: {
    grade: 'junior',
    milestones: [
      { id: 'j1', title: '完成暑期实习', description: '争取大厂实习机会', completed: false },
      { id: 'j2', title: '优化简历', description: '突出项目经验和实习经历', completed: false },
      { id: 'j3', title: '准备秋招', description: '刷算法题、准备面试', completed: false },
      { id: 'j4', title: '参加提前批', description: '7-8月秋招提前批', completed: false },
    ],
    resources: [
      { id: 'jr1', type: 'course', title: '面试算法突击', description: 'LeetCode高频题目精讲', url: '#', icon: 'Brain', priority: 'high', difficulty: 'advanced', tags: ['面试', '算法'] },
      { id: 'jr2', type: 'article', title: '简历写作指南', description: '大厂HR教你写简历', url: '#', icon: 'FileText', priority: 'high', difficulty: 'beginner', tags: ['简历', '求职'] },
      { id: 'jr3', type: 'internship', title: '腾讯暑期实习', description: '暑期实习转正机会大', url: '#', icon: 'Briefcase', priority: 'high', difficulty: 'intermediate', tags: ['实习', '腾讯'] },
    ],
  },
  senior: {
    grade: 'senior',
    milestones: [
      { id: 'se1', title: '参加秋招', description: '8-10月集中投递', completed: false },
      { id: 'se2', title: '完成笔试面试', description: '技术面+HR面', completed: false },
      { id: 'se3', title: '对比offer', description: '多维度评估选择', completed: false },
      { id: 'se4', title: '签约入职', description: '完成三方协议', completed: false },
    ],
    resources: [
      { id: 'ser1', type: 'article', title: '腾讯校招攻略', description: '学长学姐经验分享', url: '#', icon: 'FileText', priority: 'high', difficulty: 'beginner', tags: ['校招', '腾讯'] },
      { id: 'ser2', type: 'course', title: 'offer选择指南', description: '如何评估和选择offer', url: '#', icon: 'Target', priority: 'high', difficulty: 'beginner', tags: ['offer', '求职'] },
      { id: 'ser3', type: 'article', title: '职场新人指南', description: '从校园到职场的转变', url: '#', icon: 'BookOpen', priority: 'medium', difficulty: 'beginner', tags: ['职场', '入门'] },
    ],
  },
  graduate: {
    grade: 'graduate',
    milestones: [
      { id: 'g1', title: '确定研究方向', description: '结合专业和市场需求', completed: false },
      { id: 'g2', title: '发表高质量论文', description: '提升学术影响力', completed: false },
      { id: 'g3', title: '参加学术会议', description: '建立行业人脉', completed: false },
      { id: 'g4', title: '准备高端岗位', description: '研究岗、技术专家岗', completed: false },
    ],
    resources: [
      { id: 'gr1', type: 'internship', title: '腾讯AI Lab实习', description: '前沿AI研究岗位', url: '#', icon: 'Brain', priority: 'high', difficulty: 'advanced', tags: ['实习', 'AI'] },
      { id: 'gr2', type: 'article', title: '研究岗位面试指南', description: '如何展示研究能力', url: '#', icon: 'FileText', priority: 'high', difficulty: 'advanced', tags: ['面试', '研究'] },
      { id: 'gr3', type: 'course', title: '技术领导力', description: '从技术到管理的进阶', url: '#', icon: 'Users', priority: 'medium', difficulty: 'advanced', tags: ['管理', '进阶'] },
    ],
  },
};
