import { useAppStore } from '@/store';
import { growthPaths } from '@/data/growthPaths';
import { CheckCircle, Circle, Target, Zap, TrendingUp, BarChart3, Play, Monitor, Video, Code, Layout, Globe, Lightbulb, ArrowUpRight, Briefcase, Award } from 'lucide-react';
import { calculateProgressPercentage } from '@/utils/progressCalculator';

const videoPlatforms = [
  {
    name: '慕课网',
    url: 'https://www.imooc.com/',
    desc: '程序员的梦工厂，IT技能学习平台',
    tags: ['编程', '前端', '后端', '全栈'],
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    bgLight: 'from-blue-50 to-cyan-50',
    bgDark: 'from-[#1E40AF]/10 to-[#06B6D4]/10',
    borderColor: 'hover:border-blue-300/50',
  },
  {
    name: '哔哩哔哩',
    url: 'https://www.bilibili.com/v/knowledge/',
    desc: 'B站知识区，海量免费教程',
    tags: ['编程', '设计', '产品', '运营'],
    icon: Play,
    color: 'from-pink-500 to-blue-500',
    bgLight: 'from-pink-50 to-blue-50',
    bgDark: 'from-[#EC4899]/10 to-[#3B82F6]/10',
    borderColor: 'hover:border-pink-300/50',
  },
  {
    name: '极客时间',
    url: 'https://time.geekbang.org/',
    desc: 'IT技术人的在线学习平台',
    tags: ['架构', '算法', 'AI', '管理'],
    icon: Monitor,
    color: 'from-emerald-500 to-teal-500',
    bgLight: 'from-emerald-50 to-teal-50',
    bgDark: 'from-[#10B981]/10 to-[#14B8A6]/10',
    borderColor: 'hover:border-emerald-300/50',
  },
  {
    name: '中国大学MOOC',
    url: 'https://www.icourse163.org/',
    desc: '国家级精品课程，名校名师',
    tags: ['计算机', '数学', '英语', '通识'],
    icon: Video,
    color: 'from-indigo-500 to-purple-500',
    bgLight: 'from-indigo-50 to-purple-50',
    bgDark: 'from-[#6366F1]/10 to-[#A855F7]/10',
    borderColor: 'hover:border-indigo-300/50',
  },
  {
    name: '腾讯云开发课堂',
    url: 'https://cloud.tencent.com/developer/edu',
    desc: '腾讯云官方技术学习平台',
    tags: ['云计算', '小程序', 'AI', 'Serverless'],
    icon: Layout,
    color: 'from-blue-600 to-blue-400',
    bgLight: 'from-blue-50 to-blue-100',
    bgDark: 'from-[#0052D9]/10 to-[#4B8EFF]/10',
    borderColor: 'hover:border-tencent-blue/50',
  },
  {
    name: 'Coursera',
    url: 'https://www.coursera.org/',
    desc: '全球顶尖大学在线课程',
    tags: ['AI', '数据科学', '商业', '英语'],
    icon: Globe,
    color: 'from-blue-500 to-indigo-500',
    bgLight: 'from-blue-50 to-indigo-50',
    bgDark: 'from-[#1D4ED8]/10 to-[#4338CA]/10',
    borderColor: 'hover:border-blue-300/50',
  },
  {
    name: '牛客网',
    url: 'https://www.nowcoder.com/',
    desc: '求职面试必备，刷题+面经',
    tags: ['算法', '面试', '求职', '内推'],
    icon: Lightbulb,
    color: 'from-orange-500 to-yellow-500',
    bgLight: 'from-orange-50 to-yellow-50',
    bgDark: 'from-[#F97316]/10 to-[#EAB308]/10',
    borderColor: 'hover:border-orange-300/50',
  },
  {
    name: '实验楼',
    url: 'https://www.shiyanlou.com/',
    desc: '在线动手实验，边学边练',
    tags: ['Linux', 'Python', 'Web', '实战'],
    icon: Briefcase,
    color: 'from-green-500 to-emerald-500',
    bgLight: 'from-green-50 to-emerald-50',
    bgDark: 'from-[#22C55E]/10 to-[#10B981]/10',
    borderColor: 'hover:border-green-300/50',
  },
];

export default function GrowthTimeline() {
  const { profile, updateMilestone, autoCalculateProgress, conversations } = useAppStore();

  const path = profile.grade ? growthPaths[profile.grade] : null;

  if (!profile.grade) {
    return (
      <div className="text-center py-12 bg-white/80 dark:bg-[#1A1D27]/80 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-100/60 dark:border-[#2A2D37]/80">
        <p className="text-gray-500 dark:text-[#8B8F96]">请先选择你的年级</p>
      </div>
    );
  }

  const completedCount = path!.milestones.filter((m) => profile.milestones[m.id]).length;
  const progress = calculateProgressPercentage(profile, profile.grade);

  const toggleMilestone = (milestoneId: string) => {
    const isCompleted = !!profile.milestones[milestoneId];
    updateMilestone(milestoneId, !isCompleted);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-[#1A1D27]/80 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-100/60 dark:border-[#2A2D37]/80 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 dark:from-[#5A9CFF]/8 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-[#E8EAED] flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500 dark:text-[#5A9CFF]" />
            成长里程碑
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-blue-600 dark:text-[#7FB3FF]">{progress}% 完成</span>
            <button
              onClick={autoCalculateProgress}
              className="btn-micro p-2 hover:bg-blue-50 dark:hover:bg-[#242830] rounded-lg transition-colors group"
              title="自动计算进度"
            >
              <Zap className="w-4 h-4 text-blue-500 dark:text-[#5A9CFF] group-hover:text-blue-600 dark:group-hover:text-[#7FB3FF] transition-colors" />
            </button>
          </div>
        </div>
        
        <div className="h-2 bg-gray-100 dark:bg-[#2A2D37] rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-500 dark:from-[#2BA471] dark:to-[#2BA471] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-2">
          {path.milestones.map((milestone, index) => {
            const isCompleted = !!profile.milestones[milestone.id];
            return (
              <button
                key={milestone.id}
                onClick={() => toggleMilestone(milestone.id)}
                className="list-item-micro w-full flex gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#242830]/50 transition-colors text-left group list-item-enter"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex flex-col items-center">
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-500 dark:text-[#2BA471] flex-shrink-0 group-hover:scale-110 transition-transform" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300 dark:text-[#353945] flex-shrink-0 group-hover:text-gray-400 dark:group-hover:text-[#5C6068] transition-colors" />
                  )}
                  {index < path.milestones.length - 1 && (
                    <div className={`w-0.5 h-8 mt-1 ${isCompleted ? 'bg-green-300 dark:bg-[#2BA471]/50' : 'bg-gray-200 dark:bg-[#2A2D37]'}`} />
                  )}
                </div>
                <div className="pb-4">
                  <h4 className={`font-medium transition-colors ${isCompleted ? 'text-green-600 dark:text-[#2BA471] line-through' : 'text-gray-900 dark:text-[#E8EAED]'}`}>
                    {milestone.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-[#8B8F96] mt-1">{milestone.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white/80 dark:bg-[#1A1D27]/80 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-100/60 dark:border-[#2A2D37]/80 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-400/10 dark:from-purple-400/5 to-transparent rounded-full -translate-y-1/2 -translate-x-1/2"></div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-[#E8EAED] mb-4 flex items-center gap-2 relative z-10">
          <BarChart3 className="w-5 h-5 text-purple-500 dark:text-purple-400" />
          进度分解
        </h3>
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div className="glossy-card p-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-br from-blue-400/20 via-blue-500/15 to-indigo-600/20 dark:from-blue-600/30 dark:via-blue-500/20 dark:to-indigo-600/25 border border-blue-300/30 dark:border-blue-400/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500 dark:text-blue-300" />
              <span className="text-sm font-medium text-gray-600 dark:text-blue-100/80">测评完成度</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-200">
              {profile.assessmentCompleted ? `${profile.assessmentScore}%` : '未完成'}
            </div>
            <p className="text-xs text-gray-500 dark:text-blue-200/60 mt-1">
              {profile.assessmentCompleted ? '职业测评已完成' : '完成测评解锁更多进度'}
            </p>
          </div>
          
          <div className="glossy-card p-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-br from-green-400/20 via-green-500/15 to-emerald-600/20 dark:from-green-600/30 dark:via-green-500/20 dark:to-emerald-600/25 border border-green-300/30 dark:border-green-400/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-green-500 dark:text-green-300" />
              <span className="text-sm font-medium text-gray-600 dark:text-green-100/80">AI对话</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent">
              {conversations.reduce((sum, conv) => sum + conv.messages.filter(m => m.role === 'user').length, 0)} 次
            </div>
            <p className="text-xs text-gray-500 dark:text-green-200/60 mt-1">
              对话次数影响进度计算
            </p>
          </div>
          
          <div className="glossy-card p-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-br from-orange-400/20 via-orange-500/15 to-amber-600/20 dark:from-orange-600/30 dark:via-orange-500/20 dark:to-amber-600/25 border border-orange-300/30 dark:border-orange-400/20">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-orange-500 dark:text-orange-300" />
              <span className="text-sm font-medium text-gray-600 dark:text-orange-100/80">技能成长</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-300 dark:to-amber-300 bg-clip-text text-transparent">
              {Object.keys(profile.skills).length > 0 
                ? `${Math.round(Object.values(profile.skills).reduce((a, b) => a + b, 0) / Object.values(profile.skills).length)}%`
                : '待评估'}
            </div>
            <p className="text-xs text-gray-500 dark:text-orange-200/60 mt-1">
              基于各维度技能分数
            </p>
          </div>
          
          <div className="glossy-card p-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-br from-purple-400/20 via-purple-500/15 to-pink-600/20 dark:from-purple-600/30 dark:via-purple-500/20 dark:to-pink-600/25 border border-purple-300/30 dark:border-purple-400/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-purple-500 dark:text-purple-300" />
              <span className="text-sm font-medium text-gray-600 dark:text-purple-100/80">里程碑</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
              {completedCount}/{path.milestones.length}
            </div>
            <p className="text-xs text-gray-500 dark:text-purple-200/60 mt-1">
              手动完成的里程碑
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-[#1A1D27]/80 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-100/60 dark:border-[#2A2D37]/80 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-400/10 dark:from-orange-400/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <Play className="w-5 h-5 text-orange-500 dark:text-orange-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-[#E8EAED]">优质学习平台</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {videoPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-4 rounded-xl bg-gradient-to-br ${platform.bgLight} dark:${platform.bgDark} border border-gray-200/50 dark:border-[#2A2D37]/80 ${platform.borderColor} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 block`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${platform.color} rounded-lg flex items-center justify-center shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 dark:text-[#5C6068] opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-[#E8EAED] mb-1 group-hover:text-blue-600 dark:group-hover:text-[#7FB3FF] transition-colors">
                  {platform.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-[#8B8F96] mb-2 leading-relaxed">
                  {platform.desc}
                </p>
                <div className="flex flex-wrap gap-1">
                  {platform.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-white/60 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}