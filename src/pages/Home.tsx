import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import GradeSelector from '@/components/GradeSelector';
import { useAppStore } from '@/store';
import { usePageLoading } from '@/hooks/useLoading';
import { FeatureCardSkeleton } from '@/components/PageSkeletons';
import {
  MessageCircle, User, TrendingUp, Building2, ArrowUpRight,
  Sparkles, Target, GraduationCap
} from 'lucide-react';

/* ============================================================
   8度切割装饰线 - 腾讯设计语言升级
   带生长光效的倾斜线
   ============================================================ */
function DecoAngleLine({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center my-3 ${className}`} aria-hidden="true">
      <div className="relative h-[3px] w-16 overflow-hidden rounded-full">
        <div className="absolute inset-0 bg-gradient-to-r from-tencent-blue via-tencent-300 to-tencent-blue transform -skew-x-[8deg] origin-left dark:from-[#5A9CFF] dark:via-[#7FB3FF] dark:to-[#5A9CFF]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer -skew-x-[8deg]" />
      </div>
    </div>
  );
}

/* ============================================================
   生长脉冲圆环 - Hero 区域装饰
   仅用 transform + opacity 的高性能动画
   ============================================================ */
function GrowthRing({ delay = 0, size = 'md' }: { delay?: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-72 h-72',
    lg: 'w-96 h-96',
  };

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 rounded-full border border-tencent-blue/10 dark:border-[#5A9CFF]/8 ${sizeClasses[size]}`}
      style={{
        bottom: '-10%',
        animation: `growthPulse 4s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity: 0,
      }}
    />
  );
}

/* ============================================================
   功能卡片数据
   ============================================================ */
const featureCards = [
  {
    path: '/profile',
    label: '个人画像',
    description: '完成测评，了解自己的优势和方向',
    icon: User,
    color: 'from-tencent-blue to-tencent-300',
    colorDark: 'dark:from-[#5A9CFF] dark:to-[#7FB3FF]',
    glowColor: 'rgba(0, 82, 217, 0.15)',
    glowColorDark: 'rgba(90, 156, 255, 0.1)',
  },
  {
    path: '/chat',
    label: 'AI对话',
    description: '与AI助手交流，获取职业建议',
    icon: MessageCircle,
    color: 'from-[#0066FF] to-[#4B8EFF]',
    colorDark: 'dark:from-[#7FB3FF] dark:to-[#A3CEFF]',
    glowColor: 'rgba(0, 102, 255, 0.15)',
    glowColorDark: 'rgba(127, 179, 255, 0.1)',
  },
  {
    path: '/growth',
    label: '成长规划',
    description: '查看专属成长路径',
    icon: TrendingUp,
    color: 'from-success-500 to-success-400',
    colorDark: 'dark:from-success-600 dark:to-success-500',
    glowColor: 'rgba(43, 164, 113, 0.15)',
    glowColorDark: 'rgba(43, 164, 113, 0.1)',
  },
  {
    path: '/tencent',
    label: '鹅厂专区',
    description: '了解腾讯岗位和文化',
    icon: Building2,
    color: 'from-goose-orange to-goose-orange-light',
    colorDark: 'dark:from-orange-500 dark:to-orange-400',
    glowColor: 'rgba(255, 159, 67, 0.15)',
    glowColorDark: 'rgba(255, 159, 67, 0.1)',
  },
];

/* ============================================================
   首页组件
   ============================================================ */
export default function Home() {
  const profile = useAppStore((state) => state.profile);
  const onboarding = useAppStore((state) => state.onboarding);
  const startOnboarding = useAppStore((state) => state.startOnboarding);
  const isLoading = usePageLoading(600);

  // 功能卡片悬停状态
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // 鼠标追踪（用于卡片光效）
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [cardMousePositions, setCardMousePositions] = useState<Record<number, { x: number; y: number }>>({});

  useEffect(() => {
    if (!onboarding.isCompleted) {
      const timer = setTimeout(() => startOnboarding(), 500);
      return () => clearTimeout(timer);
    }
  }, [onboarding.isCompleted, startOnboarding]);

  const onboardingProgress = profile.grade && profile.assessmentCompleted;

  const handleCardMouseMove = (index: number, e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    setCardMousePositions((prev) => ({
      ...prev,
      [index]: { x: e.clientX - rect.left, y: e.clientY - rect.top },
    }));
  };

  /* ---------- 加载骨架屏 ---------- */
  if (isLoading) {
    return (
      <div className="space-y-12">
        <div className="text-center py-16 space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[80%] bg-gradient-to-t from-tencent-blue/10 to-transparent dark:from-[#5A9CFF]/5 rounded-full blur-3xl" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-tencent-50 dark:bg-[#5A9CFF]/10 rounded-full mx-auto border border-tencent-200/40 dark:border-[#5A9CFF]/15 shadow-sm">
            <div className="w-4 h-4 bg-gray-400/60 dark:bg-gray-600/60 rounded-full animate-pulse" />
            <div className="w-24 h-4 bg-gray-200/60 dark:bg-gray-700/60 rounded animate-pulse" />
          </div>
          <div className="w-80 h-12 bg-gray-200/60 dark:bg-gray-700/60 rounded-xl animate-pulse mx-auto" />
          <div className="w-16 h-1 bg-gray-200/60 dark:bg-gray-700/60 rounded mx-auto transform -skew-x-[8deg]" />
          <div className="w-96 h-5 bg-gray-200/60 dark:bg-gray-700/60 rounded animate-pulse mx-auto" />
        </div>
        <FeatureCardSkeleton />
      </div>
    );
  }

  /* ---------- 主内容 ---------- */
  return (
    <div className="relative">
      {/* ==================== Hero 区域：自树而生 ==================== */}
      <section className="text-center py-6 sm:py-8 lg:py-10 relative overflow-hidden">
        {/* --- 生长背景层 --- */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          {/* 底部向上生长的主渐变（腾讯蓝主导） */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-full bg-gradient-to-t from-tencent-blue/[0.08] via-tencent-blue/5 to-transparent dark:from-[#5A9CFF]/[0.06] dark:via-[#5A9CFF]/3 dark:to-transparent rounded-full blur-3xl" />

          {/* 侧向辅渐变 - 绿色象征生命成长 */}
          <div className="absolute bottom-[10%] left-[10%] w-[50%] h-[50%] bg-gradient-to-tr from-success-500/5 via-transparent to-transparent dark:from-success-500/3 rounded-full blur-3xl" />
          {/* 暖色辅渐变 - 橙色象征温暖陪伴 */}
          <div className="absolute bottom-[5%] right-[10%] w-[45%] h-[45%] bg-gradient-to-tl from-goose-orange/5 via-transparent to-transparent dark:from-orange-500/3 rounded-full blur-3xl" />

          {/* 生长脉冲圆环 - 象征成长向外辐射 */}
          <GrowthRing delay={0} size="sm" />
          <GrowthRing delay={1.3} size="md" />
          <GrowthRing delay={2.6} size="lg" />

          {/* 向上光束 - 生长感 */}
          <div className="growth-rays">
            <div className="growth-ray" style={{ '--ray-height': '50%' } as React.CSSProperties} />
            <div className="growth-ray" style={{ '--ray-height': '68%' } as React.CSSProperties} />
            <div className="growth-ray" style={{ '--ray-height': '82%' } as React.CSSProperties} />
            <div className="growth-ray" style={{ '--ray-height': '62%' } as React.CSSProperties} />
            <div className="growth-ray" style={{ '--ray-height': '45%' } as React.CSSProperties} />
          </div>

          {/* 浮动粒子 - 象征孢子/种子 */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="floating-particle" style={{ top: '12%', left: '10%', width: '3px', height: '3px', animationDelay: '0s' }} />
            <div className="floating-particle" style={{ top: '30%', left: '82%', animationDelay: '-2s' }} />
            <div className="floating-particle" style={{ top: '50%', left: '18%', animationDelay: '-4s' }} />
            <div className="floating-particle" style={{ top: '22%', left: '60%', animationDelay: '-1s', width: '5px', height: '5px' }} />
            <div className="floating-particle" style={{ top: '65%', left: '78%', animationDelay: '-5s' }} />
            <div className="floating-particle" style={{ top: '42%', left: '38%', animationDelay: '-3s', width: '3px', height: '3px' }} />
          </div>
        </div>



        {/* --- 内容区 --- */}
        <div className="relative z-10">
          {/* 标签徽章 */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 border shadow-sm backdrop-blur-sm relative overflow-hidden"
            style={{
              animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              animationDelay: '0s',
              opacity: 0,
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-tencent-50/90 to-[#E6F0FF]/90 dark:from-[#5A9CFF]/8 dark:to-[#003CAB]/8" />
            <Sparkles className="w-4 h-4 text-tencent-blue dark:text-[#5A9CFF] relative z-10" style={{ animation: 'softPulse 2s ease-in-out infinite' }} />
            <span className="text-sm font-medium text-tencent-700 dark:text-[#7FB3FF] relative z-10">AI驱动的成长陪伴</span>
          </div>

          {/* 主标题 - "你的未来，自树而生" */}
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-[#E8EAED] mb-4 leading-[1.15] tracking-tight"
            style={{
              animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              animationDelay: '0.15s',
              opacity: 0,
            }}
          >
            <span className="block">你的未来，</span>
            <span className="block mt-1.5">
              <span className="text-brand-gradient">自树而生</span>
            </span>
          </h1>

          {/* 副标题 */}
          <p
            className="text-lg sm:text-xl text-gray-600 dark:text-[#B0B3B8] max-w-2xl mx-auto leading-relaxed"
            style={{
              animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              animationDelay: '0.4s',
              opacity: 0,
            }}
          >
            扎根腾讯文化，以AI为土壤
            <br className="hidden sm:block" />
            {' '}让每一段成长都向光而生
          </p>
        </div>
      </section>

      {/* ==================== 引导卡片 ==================== */}
      {!onboarding.isCompleted && onboardingProgress && (
        <section
          style={{
            animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            animationDelay: '0.5s',
            opacity: 0,
          }}
        >
          <div className="relative overflow-hidden rounded-2xl p-6 border bg-white/80 dark:bg-[#1A1D27]/80 backdrop-blur-sm border-tencent-100/60 dark:border-[#5A9CFF]/15 shadow-lg shadow-tencent-blue/8 dark:shadow-[#5A9CFF]/5">
            {/* 左侧8度切角装饰 */}
            <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden rounded-tl-2xl pointer-events-none" aria-hidden="true">
              <div className="absolute -top-1 -left-1 w-12 h-12 bg-gradient-to-br from-tencent-blue/10 to-transparent transform rotate-45 origin-bottom-right" />
            </div>
            {/* 右上生长光晕 */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-tencent-blue/8 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" aria-hidden="true" />

            <div className="flex items-start gap-4 relative z-10">
              <div className="angle-cut-icon w-12 h-12 bg-gradient-to-br from-tencent-blue to-tencent-300 dark:from-[#5A9CFF] dark:to-[#4B8EFF] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-tencent-blue/25">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-[#E8EAED] mb-2">开始你的成长之旅</h3>
                <p className="text-sm text-gray-600 dark:text-[#8B8F96] mb-4">
                  已完成年级选择和测评，接下来可以体验AI对话、查看成长规划或浏览鹅厂专区
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/chat"
                    className="group inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-tencent-blue to-tencent-600 dark:from-[#5A9CFF] dark:to-[#4B8EFF] text-white rounded-xl text-sm font-medium hover:shadow-xl hover:shadow-tencent-blue/30 transition-all duration-300"
                    style={{ transitionProperty: 'transform, box-shadow' }}
                  >
                    <MessageCircle className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                    <span>开始AI对话</span>
                    <ArrowUpRight className="w-3.5 h-3.5 grow-arrow" />
                  </Link>
                  {!profile.assessmentCompleted && (
                    <Link
                      to="/profile"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white/90 dark:bg-[#242830]/90 backdrop-blur-sm text-tencent-blue dark:text-[#7FB3FF] rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-300 border border-tencent-200/40 dark:border-[#2A2D37]/80"
                    >
                      <Target className="w-4 h-4" />
                      <span>完成测评</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== 年级选择引导 ==================== */}
      {onboarding.isCompleted && !profile.grade && (
        <section
          style={{
            animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            animationDelay: '0.5s',
            opacity: 0,
          }}
        >
          <div className="relative overflow-hidden rounded-2xl p-6 border bg-white/80 dark:bg-[#1A1D27]/80 backdrop-blur-sm border-orange-100/60 dark:border-orange-500/15 shadow-lg shadow-goose-orange/8 dark:shadow-orange-500/5 mb-8">
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-goose-orange/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" aria-hidden="true" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="angle-cut-icon w-12 h-12 bg-gradient-to-br from-goose-orange to-warning-500 dark:from-orange-500 dark:to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-goose-orange/25">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-[#E8EAED] mb-2">选择你的年级身份</h3>
                <p className="text-sm text-gray-600 dark:text-[#8B8F96]">
                  我们会根据你的年级，提供专属的职业指导和成长建议
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#E8EAED] mb-6 flex items-center justify-center gap-3">
            <span>选择你的年级</span>
            <DecoAngleLine />
          </h2>
          <GradeSelector />
        </section>
      )}

      {/* ==================== 功能卡片区 ==================== */}
      {profile.grade && (
        <>
          <section
            aria-labelledby="explore-heading"
            style={{
              animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              animationDelay: '0.5s',
              opacity: 0,
            }}
          >
            {/* 标题栏 */}
            <div className="flex items-center justify-between mb-6">
              <h2 id="explore-heading" className="text-2xl font-bold text-gray-900 dark:text-[#E8EAED]">
                开始探索
              </h2>
              <button
                onClick={() => { useAppStore.getState().updateProfile({ grade: null }); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-tencent-blue dark:text-[#7FB3FF] bg-tencent-50 dark:bg-[#5A9CFF]/8 rounded-lg hover:bg-tencent-100 dark:hover:bg-[#5A9CFF]/15 transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                <span>更改年级</span>
              </button>
            </div>

            {/* 卡片网格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {featureCards.map((card, index) => {
                const Icon = card.icon;
                const isHovered = hoveredCard === index;
                const mousePos = cardMousePositions[index] || { x: 0, y: 0 };

                return (
                  <Link
                    key={card.path}
                    to={card.path}
                    ref={(el) => { cardRefs.current[index] = el; }}
                    className="group relative p-6 bg-white/80 dark:bg-[#1A1D27]/80 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-100/60 dark:border-[#2A2D37]/80 overflow-hidden card-grow-hover"
                    style={{
                      animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                      animationDelay: `${0.6 + index * 0.1}s`,
                      opacity: 0,
                    }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onMouseMove={(e) => handleCardMouseMove(index, e)}
                  >
                    {/* 鼠标追踪光斑 - 仅使用 opacity 动画 */}
                    <div
                      className="absolute w-40 h-40 rounded-full pointer-events-none transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle, ${isHovered ? card.glowColor : 'transparent'}, transparent 70%)`,
                        left: mousePos.x - 80,
                        top: mousePos.y - 80,
                        opacity: isHovered ? 1 : 0,
                      }}
                      aria-hidden="true"
                    />

                    {/* 卡片顶部装饰光效 */}
                    <div
                      className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-white/40 dark:from-[#242830]/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity duration-500"
                      style={{ opacity: isHovered ? 1 : 0.5 }}
                      aria-hidden="true"
                    />

                    {/* 底部生长线 - 悬停时展开 */}
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-tencent-blue/40 to-transparent transition-all duration-500"
                      style={{ width: isHovered ? '75%' : '0%' }}
                      aria-hidden="true"
                    />

                    <div className="relative z-10">
                      {/* 8度切角图标 */}
                      <div
                        className={`angle-cut-icon w-14 h-14 bg-gradient-to-br ${card.color} ${card.colorDark} rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 relative`}
                        style={{
                          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                          boxShadow: isHovered
                            ? `0 8px 24px ${card.glowColorDark || card.glowColor}`
                            : 'none',
                        }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                        {/* 切角高光 */}
                        <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-white/25 to-transparent rounded-tr-lg rounded-bl-sm pointer-events-none" />
                      </div>

                      {/* 文字内容 */}
                      <h3 className="font-semibold text-gray-900 dark:text-[#E8EAED] mb-1.5 text-base">{card.label}</h3>
                      <p className="text-sm text-gray-500 dark:text-[#8B8F96] mb-4 line-clamp-2 leading-relaxed">{card.description}</p>

                      {/* 行动提示 - 底部 */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-tencent-blue dark:text-[#5A9CFF]">立即开始</span>
                        <ArrowUpRight
                          className="w-4 h-4 text-tencent-blue dark:text-[#5A9CFF] transition-transform duration-300"
                          style={{ transform: isHovered ? 'rotate(0deg) translateX(2px)' : 'rotate(-45deg)' }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </>
      )}

    </div>
  );
}
