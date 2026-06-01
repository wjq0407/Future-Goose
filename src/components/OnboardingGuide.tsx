import { useAppStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  GraduationCap,
  MessageCircle,
  TrendingUp,
  Building2,
  Target,
  Play,
} from 'lucide-react';

const onboardingSteps = [
  {
    id: 'welcome',
    title: '欢迎来到未来鹅！',
    description: '这是你的AI职业成长陪伴平台，我们将从入学到求职全程陪伴你成长',
    icon: Sparkles,
    color: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-indigo-50',
  },
  {
    id: 'grade',
    title: '选择你的年级身份',
    description: '我们会根据你的年级，提供专属的职业指导和成长建议',
    icon: GraduationCap,
    color: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-50 to-pink-50',
    action: {
      label: '前往首页选择年级',
      target: '/',
    },
  },
  {
    id: 'assessment',
    title: '完成职业测评',
    description: '5道快速测评题，帮助你了解自己的职业兴趣、技能优势和适合的发展方向',
    icon: Target,
    color: 'from-orange-500 to-orange-600',
    bgGradient: 'from-orange-50 to-yellow-50',
    action: {
      label: '开始测评',
      target: '/profile',
    },
  },
  {
    id: 'chat',
    title: 'AI智能对话',
    description: '与AI助手交流，支持职业咨询、模拟面试、简历诊断三大场景，获取个性化职业建议',
    icon: MessageCircle,
    color: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-cyan-50',
    action: {
      label: '体验AI对话',
      target: '/chat',
    },
  },
  {
    id: 'growth',
    title: '成长路径规划',
    description: '查看专属成长路径，了解每个阶段的目标和推荐资源，跟踪你的进步',
    icon: TrendingUp,
    color: 'from-green-500 to-green-600',
    bgGradient: 'from-green-50 to-emerald-50',
    action: {
      label: '查看成长规划',
      target: '/growth',
    },
  },
  {
    id: 'tencent',
    title: '鹅厂专区',
    description: '了解腾讯热门岗位、企业文化和校招培养体系，提前锁定大厂机会',
    icon: Building2,
    color: 'from-orange-500 to-orange-600',
    bgGradient: 'from-orange-50 to-red-50',
    action: {
      label: '浏览鹅厂专区',
      target: '/tencent',
    },
  },
];

export default function OnboardingGuide() {
  const onboarding = useAppStore((state) => state.onboarding);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const navigate = useNavigate();

  if (!onboarding.isShowing || onboarding.isCompleted) {
    return null;
  }

  const currentStep = onboarding.currentStep;
  const step = onboardingSteps[currentStep] || onboardingSteps[0];
  const totalSteps = onboardingSteps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  const handleNext = () => {
    if (isLast) {
      completeOnboarding();
    } else {
      setOnboardingStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setOnboardingStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const handleAction = () => {
    if (step.action) {
      completeOnboarding();
      navigate(step.action.target);
    }
  };

  const handleDotClick = (index: number) => {
    setOnboardingStep(index);
  };

  const IconComponent = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleSkip}
      />

      <div className="relative w-full max-w-lg mx-4 animate-in fade-in zoom-in duration-300">
        <div
          className={`bg-gradient-to-br ${step.bgGradient} rounded-3xl shadow-2xl overflow-hidden`}
        >
          <div className="p-8">
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            <div className="mb-6">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
              >
                <IconComponent className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {step.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>

            {step.action && (
              <button
                onClick={handleAction}
                className={`w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${step.color} text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all`}
              >
                <Play className="w-4 h-4" />
                <span>{step.action.label}</span>
              </button>
            )}

            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrev}
                disabled={isFirst}
                className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>上一步</span>
              </button>

              <div className="flex gap-1.5">
                {onboardingSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentStep
                        ? `bg-gradient-to-r ${step.color} w-6`
                        : index < currentStep
                        ? 'bg-gray-400'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span>{isLast ? '完成' : '下一步'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${step.color} transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs text-gray-500 text-center mt-2">
              {currentStep + 1} / {totalSteps}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
