export interface AssessmentQuestion {
  id: string;
  question: string;
  options: AssessmentOption[];
  skillDimension: string;
}

export interface AssessmentOption {
  text: string;
  score: number;
}

export const skillDimensions = [
  '技术能力',
  '产品思维',
  '沟通表达',
  '学习能力',
  '团队协作',
  '创新思维',
  '抗压能力',
  '商业洞察',
  '领导力',
];

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'tech_1',
    question: '你对编程的兴趣程度如何？',
    options: [
      { text: '完全不感兴趣', score: 10 },
      { text: '偶尔好奇，但不想深入学习', score: 30 },
      { text: '有兴趣，正在学习基础语法', score: 50 },
      { text: '比较喜欢，能独立完成小项目', score: 70 },
      { text: '非常热爱，经常参与开源或比赛', score: 90 },
    ],
    skillDimension: '技术能力',
  },
  {
    id: 'tech_2',
    question: '你目前掌握的编程语言数量？',
    options: [
      { text: '0门', score: 10 },
      { text: '1门，了解基础语法', score: 30 },
      { text: '1-2门，能写一些程序', score: 50 },
      { text: '2-3门，能独立完成项目', score: 70 },
      { text: '3门以上，有大型项目经验', score: 90 },
    ],
    skillDimension: '技术能力',
  },
  {
    id: 'tech_3',
    question: '你在技术项目中最擅长哪个环节？',
    options: [
      { text: '还没参与过技术项目', score: 15 },
      { text: '需求分析和方案设计', score: 40 },
      { text: '前端页面开发', score: 55 },
      { text: '后端逻辑和数据库', score: 70 },
      { text: '系统架构和性能优化', score: 90 },
    ],
    skillDimension: '技术能力',
  },
  {
    id: 'tech_4',
    question: '你如何跟进技术发展趋势？',
    options: [
      { text: '不太关注新技术', score: 15 },
      { text: '偶尔看新闻，了解大概', score: 35 },
      { text: '定期看技术社区和博客', score: 55 },
      { text: '参与技术讨论，动手实践新技术', score: 75 },
      { text: '持续关注前沿技术，有深入研究', score: 95 },
    ],
    skillDimension: '技术能力',
  },
  {
    id: 'tech_5',
    question: '你的代码规范和工程化意识如何？',
    options: [
      { text: '写代码比较随意，没有规范意识', score: 15 },
      { text: '知道一些规范，但不常遵守', score: 35 },
      { text: '遵循基本的代码规范', score: 55 },
      { text: '注重代码质量，使用版本控制和测试', score: 75 },
      { text: '严格遵守工程化规范，推动团队标准', score: 95 },
    ],
    skillDimension: '技术能力',
  },
  {
    id: 'product_1',
    question: '当你使用一款新App时，你会关注什么？',
    options: [
      { text: '能用就行，不太关注细节', score: 20 },
      { text: '界面好不好看', score: 40 },
      { text: '功能是否好用，流程是否顺畅', score: 60 },
      { text: '会思考产品经理的设计意图', score: 80 },
      { text: '会写产品分析报告或改进建议', score: 95 },
    ],
    skillDimension: '产品思维',
  },
  {
    id: 'product_2',
    question: '你是否参与过产品相关的比赛或实践？',
    options: [
      { text: '没有，也不太了解', score: 15 },
      { text: '听说过，但没参加过', score: 30 },
      { text: '参加过校内产品比赛', score: 55 },
      { text: '有过产品实习或自主项目', score: 75 },
      { text: '产品项目获得过奖项或被采纳', score: 95 },
    ],
    skillDimension: '产品思维',
  },
  {
    id: 'product_3',
    question: '你如何看待用户反馈在产品设计中的作用？',
    options: [
      { text: '不太在意用户反馈', score: 15 },
      { text: '知道重要，但不知道怎么收集和分析', score: 35 },
      { text: '会看用户评价，但较为主观', score: 55 },
      { text: '能设计用户调研，提炼关键需求', score: 75 },
      { text: '建立数据驱动的产品迭代体系', score: 95 },
    ],
    skillDimension: '产品思维',
  },
  {
    id: 'product_4',
    question: '你如何进行竞品分析？',
    options: [
      { text: '没做过竞品分析', score: 15 },
      { text: '简单对比功能和界面', score: 35 },
      { text: '从功能和用户角度对比优缺点', score: 55 },
      { text: '从市场、用户、商业模式多维度分析', score: 80 },
      { text: '能产出结构化竞品报告并提出策略', score: 95 },
    ],
    skillDimension: '产品思维',
  },
  {
    id: 'comm_1',
    question: '在团队项目中，你通常扮演什么角色？',
    options: [
      { text: '不太参与讨论，完成分配的任务', score: 25 },
      { text: '偶尔发表意见', score: 40 },
      { text: '积极参与讨论，能清晰表达观点', score: 60 },
      { text: '经常担任组长，协调分工', score: 80 },
      { text: '能主导项目方向和团队决策', score: 95 },
    ],
    skillDimension: '沟通表达',
  },
  {
    id: 'comm_2',
    question: '你在公开演讲或答辩时的表现如何？',
    options: [
      { text: '非常紧张，尽量避免', score: 15 },
      { text: '有些紧张，但能完成', score: 35 },
      { text: '基本能自如表达', score: 55 },
      { text: '表达清晰，能应对提问', score: 75 },
      { text: '擅长演讲，能感染听众', score: 95 },
    ],
    skillDimension: '沟通表达',
  },
  {
    id: 'comm_3',
    question: '你如何向非技术人员解释复杂的技术问题？',
    options: [
      { text: '很难解释清楚，通常跳过', score: 15 },
      { text: '直接说专业术语，对方能理解多少随缘', score: 35 },
      { text: '会用一些比喻，但有时还是说不明白', score: 55 },
      { text: '能用简单语言和案例让对方理解', score: 75 },
      { text: '擅长用故事和可视化方式清晰传达', score: 95 },
    ],
    skillDimension: '沟通表达',
  },
  {
    id: 'comm_4',
    question: '你在书面表达方面的能力如何？',
    options: [
      { text: '写作比较吃力，不太擅长', score: 15 },
      { text: '能完成基本的文档和邮件', score: 35 },
      { text: '能写结构清晰的技术文档', score: 60 },
      { text: '经常写博客或报告，表达流畅', score: 80 },
      { text: '能撰写专业方案，具有很强的说服力', score: 95 },
    ],
    skillDimension: '沟通表达',
  },
  {
    id: 'learn_1',
    question: '你平时通过什么方式学习新知识？',
    options: [
      { text: '主要靠课堂学习', score: 25 },
      { text: '偶尔看一些技术博客', score: 40 },
      { text: '经常在B站/Coursera等平台自学', score: 60 },
      { text: '有系统的学习计划并坚持执行', score: 80 },
      { text: '能产出学习总结并分享给他人', score: 95 },
    ],
    skillDimension: '学习能力',
  },
  {
    id: 'learn_2',
    question: '遇到一个不会的技术问题，你会怎么做？',
    options: [
      { text: '先放着，以后再说', score: 15 },
      { text: '问同学或老师', score: 35 },
      { text: '自己上网搜索解决方案', score: 55 },
      { text: '查阅官方文档，深入理解原理', score: 75 },
      { text: '研究源码并写技术博客总结', score: 95 },
    ],
    skillDimension: '学习能力',
  },
  {
    id: 'learn_3',
    question: '你多长时间学习一门新技能或知识领域？',
    options: [
      { text: '很少主动学习新东西', score: 15 },
      { text: '一两年学一次', score: 35 },
      { text: '每半年左右学习新技能', score: 55 },
      { text: '每季度都有新的学习计划', score: 75 },
      { text: '持续学习，有知识管理体系', score: 95 },
    ],
    skillDimension: '学习能力',
  },
  {
    id: 'learn_4',
    question: '你如何将学到的知识应用到实践中？',
    options: [
      { text: '学完就忘了，很少应用', score: 15 },
      { text: '偶尔尝试用一用', score: 35 },
      { text: '会做一些练习或小项目', score: 60 },
      { text: '主动在实际项目中应用', score: 80 },
      { text: '能将知识融会贯通，创新应用', score: 95 },
    ],
    skillDimension: '学习能力',
  },
  {
    id: 'team_1',
    question: '你有多少团队合作经验？',
    options: [
      { text: '几乎没有', score: 15 },
      { text: '参加过1-2次小组作业', score: 35 },
      { text: '参加过社团或实验室项目', score: 55 },
      { text: '在多个团队中担任过核心角色', score: 75 },
      { text: '有跨团队合作或带领团队的经验', score: 95 },
    ],
    skillDimension: '团队协作',
  },
  {
    id: 'team_2',
    question: '当团队出现分歧时，你会如何处理？',
    options: [
      { text: '不太参与，跟随大多数意见', score: 20 },
      { text: '简单表达自己的看法', score: 40 },
      { text: '尝试理解各方观点并促进讨论', score: 60 },
      { text: '主动协调，寻找最优方案', score: 80 },
      { text: '能引导团队达成共识并推进执行', score: 95 },
    ],
    skillDimension: '团队协作',
  },
  {
    id: 'team_3',
    question: '你在团队中如何分配和管理任务？',
    options: [
      { text: '没有经验，通常是被分配任务', score: 15 },
      { text: '能完成自己被分配的任务', score: 35 },
      { text: '能协助组长进行任务分配', score: 55 },
      { text: '能合理规划项目进度和责任分工', score: 80 },
      { text: '擅长项目管理，能优化团队协作流程', score: 95 },
    ],
    skillDimension: '团队协作',
  },
  {
    id: 'team_4',
    question: '你如何处理团队中的冲突或低效成员？',
    options: [
      { text: '避开冲突，自己完成工作', score: 15 },
      { text: '感到不满，但不知道怎么解决', score: 35 },
      { text: '私下沟通，尝试了解对方情况', score: 55 },
      { text: '组织团队讨论，公开透明解决问题', score: 80 },
      { text: '建立机制预防冲突，持续优化团队文化', score: 95 },
    ],
    skillDimension: '团队协作',
  },
  {
    id: 'innov_1',
    question: '你平时有多少创新和创意的想法？',
    options: [
      { text: '很少有新想法，按部就班', score: 15 },
      { text: '偶尔有些想法，但不常付诸实践', score: 35 },
      { text: '经常有创意，能做一些小创新', score: 55 },
      { text: '主动提出创新方案并推动落地', score: 75 },
      { text: '创新能力强，有专利或获奖作品', score: 95 },
    ],
    skillDimension: '创新思维',
  },
  {
    id: 'innov_2',
    question: '你如何解决一个没有标准答案的问题？',
    options: [
      { text: '感到困惑，不知道从何入手', score: 15 },
      { text: '寻找类似案例参考', score: 35 },
      { text: '从多角度分析，提出自己的方案', score: 60 },
      { text: '运用跨领域知识，创造性地解决', score: 80 },
      { text: '能建立新的思考框架，产出突破性方案', score: 95 },
    ],
    skillDimension: '创新思维',
  },
  {
    id: 'innov_3',
    question: '你是否参与过创新项目或创业实践？',
    options: [
      { text: '没有参与过', score: 15 },
      { text: '听说过一些，但没有参与', score: 30 },
      { text: '参加过创新创业比赛', score: 55 },
      { text: '有自主创业项目或创新实践', score: 75 },
      { text: '创业项目获得融资或被孵化', score: 95 },
    ],
    skillDimension: '创新思维',
  },
  {
    id: 'innov_4',
    question: '你如何将不同领域的知识结合起来？',
    options: [
      { text: '专注于单一领域，不太跨领域', score: 15 },
      { text: '了解一些其他领域，但很少结合', score: 35 },
      { text: '能有意识地将不同知识关联起来', score: 55 },
      { text: '善于跨领域整合，产出新方案', score: 80 },
      { text: '具有跨界创新能力，持续产出原创想法', score: 95 },
    ],
    skillDimension: '创新思维',
  },
  {
    id: 'pressure_1',
    question: '面对紧急的任务或deadline，你的表现如何？',
    options: [
      { text: '容易焦虑，效率下降', score: 15 },
      { text: '有压力，但勉强能完成', score: 35 },
      { text: '能适应压力，正常发挥', score: 60 },
      { text: '压力下反而效率更高', score: 80 },
      { text: '擅长时间管理，很少出现紧急情况', score: 95 },
    ],
    skillDimension: '抗压能力',
  },
  {
    id: 'pressure_2',
    question: '当你经历失败或挫折时，你会怎么做？',
    options: [
      { text: '情绪低落，需要很长时间恢复', score: 15 },
      { text: '会难过，但能慢慢调整', score: 35 },
      { text: '能较快从失败中恢复', score: 60 },
      { text: '从失败中总结教训，快速调整策略', score: 80 },
      { text: '将失败视为成长机会，持续优化', score: 95 },
    ],
    skillDimension: '抗压能力',
  },
  {
    id: 'pressure_3',
    question: '你如何处理多线程任务的压力？',
    options: [
      { text: '同时处理多件事让我很焦虑', score: 15 },
      { text: '能做，但经常顾此失彼', score: 35 },
      { text: '能分清优先级，依次处理', score: 60 },
      { text: '擅长任务管理，能高效处理多项任务', score: 80 },
      { text: '有成熟的工作方法，多线程处理游刃有余', score: 95 },
    ],
    skillDimension: '抗压能力',
  },
  {
    id: 'pressure_4',
    question: '你在高压环境下的决策质量如何？',
    options: [
      { text: '压力下容易做出错误决定', score: 15 },
      { text: '决策质量会下降', score: 35 },
      { text: '基本能保持正常决策水平', score: 55 },
      { text: '压力下能快速做出合理判断', score: 80 },
      { text: '擅长在复杂高压环境中做出最优决策', score: 95 },
    ],
    skillDimension: '抗压能力',
  },
  {
    id: 'business_1',
    question: '你对商业运作的了解程度如何？',
    options: [
      { text: '不太了解商业知识', score: 15 },
      { text: '知道一些基本概念', score: 35 },
      { text: '了解基本的商业模式和盈利方式', score: 55 },
      { text: '能分析不同行业的商业模式', score: 80 },
      { text: '有商业项目实践经验或创业经历', score: 95 },
    ],
    skillDimension: '商业洞察',
  },
  {
    id: 'business_2',
    question: '你如何看待一个新产品或新服务的市场前景？',
    options: [
      { text: '不太关注市场前景', score: 15 },
      { text: '凭直觉判断', score: 35 },
      { text: '从用户需求和竞品角度分析', score: 60 },
      { text: '从市场规模、竞争格局、趋势多维度分析', score: 80 },
      { text: '能建立商业模型，给出量化预测', score: 95 },
    ],
    skillDimension: '商业洞察',
  },
  {
    id: 'business_3',
    question: '你是否关注互联网行业的商业动态？',
    options: [
      { text: '很少关注行业新闻', score: 15 },
      { text: '偶尔看一些热点新闻', score: 35 },
      { text: '定期关注行业动态和公司动态', score: 60 },
      { text: '深度分析行业趋势和商业策略', score: 80 },
      { text: '能预判行业趋势，有独到见解', score: 95 },
    ],
    skillDimension: '商业洞察',
  },
  {
    id: 'business_4',
    question: '你如何评估一个商业机会？',
    options: [
      { text: '不太会评估商业机会', score: 15 },
      { text: '看是否赚钱、有没有市场', score: 35 },
      { text: '分析目标用户、市场需求和竞争', score: 60 },
      { text: '综合考虑成本、收益、风险、壁垒', score: 80 },
      { text: '能构建完整的商业分析框架和决策模型', score: 95 },
    ],
    skillDimension: '商业洞察',
  },
  {
    id: 'lead_1',
    question: '你有多少领导或带团队的经验？',
    options: [
      { text: '没有领导过任何人', score: 15 },
      { text: '带过小组作业（2-3人）', score: 35 },
      { text: '担任过社团或项目负责人', score: 60 },
      { text: '领导过较大规模的团队（5人以上）', score: 80 },
      { text: '有跨部门或大型团队管理经验', score: 95 },
    ],
    skillDimension: '领导力',
  },
  {
    id: 'lead_2',
    question: '你如何激励团队成员？',
    options: [
      { text: '不太关注团队激励', score: 15 },
      { text: '口头表扬和鼓励', score: 35 },
      { text: '根据成员特长分配任务', score: 55 },
      { text: '设定目标、提供反馈、创造成长机会', score: 80 },
      { text: '建立激励机制和团队文化，持续提升士气', score: 95 },
    ],
    skillDimension: '领导力',
  },
  {
    id: 'lead_3',
    question: '你如何设定和传达团队目标？',
    options: [
      { text: '没有设定过团队目标', score: 15 },
      { text: '简单分配任务', score: 35 },
      { text: '能制定清晰的目标和计划', score: 55 },
      { text: '目标有挑战性且可实现，团队认同', score: 80 },
      { text: '善用OKR等工具，对齐战略和执行', score: 95 },
    ],
    skillDimension: '领导力',
  },
  {
    id: 'lead_4',
    question: '你如何处理团队成员的成长和发展？',
    options: [
      { text: '只关注任务完成', score: 15 },
      { text: '偶尔关心成员感受', score: 35 },
      { text: '关注成员能力，提供适当指导', score: 55 },
      { text: '为每个成员制定成长计划', score: 80 },
      { text: '擅长人才梯队建设，培养领导者', score: 95 },
    ],
    skillDimension: '领导力',
  },
];

export function calculateSkills(answers: Record<string, number>): Record<string, number> {
  const dimensions: Record<string, { total: number; count: number }> = {};

  for (const question of assessmentQuestions) {
    const score = answers[question.id] || 0;
    if (!dimensions[question.skillDimension]) {
      dimensions[question.skillDimension] = { total: 0, count: 0 };
    }
    dimensions[question.skillDimension].total += score;
    dimensions[question.skillDimension].count += 1;
  }

  const result: Record<string, number> = {};
  for (const [dimension, data] of Object.entries(dimensions)) {
    result[dimension] = Math.round(data.total / data.count);
  }

  return result;
}

export function getCareerSuggestions(skills: Record<string, number>): string[] {
  const suggestions: string[] = [];
  const sortedSkills = Object.entries(skills).sort((a, b) => b[1] - a[1]);
  const topSkill = sortedSkills[0];

  if (topSkill) {
    switch (topSkill[0]) {
      case '技术能力':
        suggestions.push('你的技术能力突出，建议走技术专家路线');
        suggestions.push('可以关注腾讯的技术岗位（前端/后端/算法）');
        break;
      case '产品思维':
        suggestions.push('你有很强的产品sense，适合产品经理方向');
        suggestions.push('建议多写产品分析报告，积累实战经验');
        break;
      case '沟通表达':
        suggestions.push('你的表达能力很强，适合需要沟通的岗位');
        suggestions.push('可以考虑产品经理、运营、用户研究等方向');
        break;
      case '学习能力':
        suggestions.push('你的自主学习能力很强，这是很好的基础');
        suggestions.push('建议选择一个方向深入，把学习能力转化为专业技能');
        break;
      case '团队协作':
        suggestions.push('你有出色的团队协作能力');
        suggestions.push('未来可以考虑技术管理或项目管理方向');
        break;
      case '创新思维':
        suggestions.push('你的创新思维突出，具有很强的创造力');
        suggestions.push('适合产品创新、研发创新或创业方向');
        break;
      case '抗压能力':
        suggestions.push('你的抗压能力很强，适合高强度工作环境');
        suggestions.push('互联网大厂的快节奏工作会很适合你');
        break;
      case '商业洞察':
        suggestions.push('你有很好的商业敏感度，适合商业分析岗位');
        suggestions.push('可以考虑战略分析、商业产品经理、投资分析等方向');
        break;
      case '领导力':
        suggestions.push('你有很强的领导潜质，适合管理方向');
        suggestions.push('建议积累项目管理经验，培养团队管理能力');
        break;
    }
  }

  if (sortedSkills.length >= 2) {
    const secondSkill = sortedSkills[1];
    if (secondSkill) {
      const comboKey = `${topSkill[0]}+${secondSkill[0]}`;
      const reverseCombo = `${secondSkill[0]}+${topSkill[0]}`;
      
      if (comboKey === '技术能力+产品思维' || reverseCombo === '技术能力+产品思维') {
        suggestions.push('技术+产品的复合能力很适合技术产品经理岗位');
      } else if (comboKey === '技术能力+沟通表达' || reverseCombo === '技术能力+沟通表达') {
        suggestions.push('技术与沟通能力结合，很适合技术支持或售前工程师方向');
      } else if (comboKey === '产品思维+商业洞察' || reverseCombo === '产品思维+商业洞察') {
        suggestions.push('产品+商业的组合很适合商业化产品经理或战略产品方向');
      } else if (comboKey === '创新思维+领导力' || reverseCombo === '创新思维+领导力') {
        suggestions.push('创新+领导力是创业者或产品负责人的优秀组合');
      } else if (comboKey === '商业洞察+抗压能力' || reverseCombo === '商业洞察+抗压能力') {
        suggestions.push('商业敏感度+抗压能力很适合投资或咨询行业');
      }
    }
  }

  const avgScore = Object.values(skills).reduce((a, b) => a + b, 0) / Object.values(skills).length;
  if (avgScore >= 80) {
    suggestions.push('你的整体素质很优秀，建议冲击腾讯核心岗位');
  } else if (avgScore >= 60) {
    suggestions.push('你的基础不错，建议针对性提升薄弱维度');
  } else if (avgScore >= 40) {
    suggestions.push('你需要加强实践，多参与项目和比赛');
  } else {
    suggestions.push('建议从基础开始，制定系统的提升计划');
  }

  return suggestions;
}
