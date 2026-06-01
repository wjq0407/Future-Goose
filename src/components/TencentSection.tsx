import { useState } from 'react';
import { tencentCultures, tencentTraining } from '@/data/tencentInfo';
import { Heart, Globe, Shield, Users, GraduationCap, Briefcase, ExternalLink, Target, Award, Star, Trophy, CheckCircle, RotateCcw } from 'lucide-react';
import GooseMascot from '@/components/GooseMascot';

const cultureIconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  Heart,
  Globe,
  Shield,
  Users,
};

interface RecruitmentChannel {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  category: 'campus' | 'social';
  tags: string[];
  badge?: string;
}

const recruitmentChannels: RecruitmentChannel[] = [
  {
    id: 'campus-fresh',
    title: '应届毕业生招聘',
    description: '面向2026届应届毕业生，提供技术、产品、设计等多类正式岗位',
    url: 'https://join.qq.com/post.html?query=p_1',
    icon: GraduationCap,
    category: 'campus',
    tags: ['应届毕业生', '2026届', '正式岗位'],
    badge: '推荐',
  },
  {
    id: 'campus-intern',
    title: '实习生招聘',
    description: '面向全体在校学生的实习项目，不少于两个月的实习机会',
    url: 'https://join.qq.com/post.html?query=p_2',
    icon: Target,
    category: 'campus',
    tags: ['在校生', '实习项目', '积累经验'],
  },
  {
    id: 'social',
    title: '社会招聘',
    description: '面向有工作经验的专业人士，涵盖各业务线和职能部门',
    url: 'https://careers.tencent.com/search.html',
    icon: Briefcase,
    category: 'social',
    tags: ['社会人士', '有经验', '正式岗位'],
  },
  {
    id: 'global',
    title: '全球招聘',
    description: '腾讯海外业务招聘，覆盖多个国家和地区',
    url: 'https://careers.tencent.com/global.html',
    icon: Globe,
    category: 'social',
    tags: ['海外岗位', '国际化', '多元文化'],
  },
];

const tencentCareerPath = [
  { level: 'T1', title: '助理工程师', description: '入门级，学习和成长', icon: '🌱', color: '#2BA471' },
  { level: 'T2', title: '工程师', description: '独立完成工作任务', icon: '🌿', color: '#4B8EFF' },
  { level: 'T3', title: '高级工程师', description: '负责复杂项目和带新人', icon: '🌳', color: '#0052D9' },
  { level: 'T4', title: '专家工程师', description: '技术引领者和架构师', icon: '⭐', color: '#8B5CF6' },
  { level: 'T5', title: '首席科学家', description: '技术战略和行业影响', icon: '👑', color: '#FF9F43' },
];

const tencentQuizQuestions = [
  {
    question: '腾讯成立于哪一年？',
    options: ['1996年', '1998年', '2000年', '2002年'],
    correct: 1,
    explanation: '腾讯成立于1998年11月，由马化腾、张志东等五位创始人共同创立。',
  },
  {
    question: '腾讯的核心价值观是什么？',
    options: ['用户为本，科技向善', '创新引领，追求卓越', '开放合作，互利共赢', '诚信正直，持续学习'],
    correct: 0,
    explanation: '腾讯的核心价值观是"用户为本，科技向善"，强调一切以用户价值为依归，用科技解决社会问题。',
  },
  {
    question: '以下哪个产品不是腾讯的？',
    options: ['微信', 'QQ', '钉钉', '腾讯视频'],
    correct: 2,
    explanation: '钉钉是阿里巴巴集团推出的企业级通讯和协作平台，不是腾讯的产品。',
  },
  {
    question: '腾讯的瑞雪文化强调什么？',
    options: ['速度和效率', '正直和进取', '利润和增长', '规模和扩张'],
    correct: 1,
    explanation: '腾讯瑞雪文化强调正直进取、协作共赢，倡导员工在工作中保持诚信和积极向上的态度。',
  },
  {
    question: '腾讯双通道职业发展路径是哪两个方向？',
    options: ['技术和管理', '产品和运营', '设计和开发', '销售和市场'],
    correct: 0,
    explanation: '腾讯提供技术（T族）和管理（P族）双通道职业发展路径，员工可以根据自己的专长和兴趣选择发展方向。',
  },
];

interface QuizState {
  currentQuestion: number;
  score: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  isComplete: boolean;
  answers: number[];
}

function TencentQuiz() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    selectedAnswer: null,
    showExplanation: false,
    isComplete: false,
    answers: [],
  });

  const currentQ = tencentQuizQuestions[quizState.currentQuestion];

  const handleSelect = (answerIndex: number) => {
    if (quizState.showExplanation) return;

    const isCorrect = answerIndex === currentQ.correct;
    setQuizState((prev) => ({
      ...prev,
      selectedAnswer: answerIndex,
      showExplanation: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: [...prev.answers, answerIndex],
    }));
  };

  const handleNext = () => {
    if (quizState.currentQuestion < tencentQuizQuestions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        selectedAnswer: null,
        showExplanation: false,
      }));
    } else {
      setQuizState((prev) => ({
        ...prev,
        isComplete: true,
      }));
    }
  };

  const handleReset = () => {
    setQuizState({
      currentQuestion: 0,
      score: 0,
      selectedAnswer: null,
      showExplanation: false,
      isComplete: false,
      answers: [],
    });
  };

  if (quizState.isComplete) {
    const scorePercentage = Math.round((quizState.score / tencentQuizQuestions.length) * 100);
    return (
      <div className="bg-gradient-to-br from-tencent-blue/5 to-purple-500/5 dark:from-tencent-blue/10 dark:to-purple-500/10 rounded-2xl p-6 border border-tencent-blue/10 dark:border-tencent-blue/20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-tencent-blue to-tencent-blue-light text-white mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            答题完成！
          </h4>
          <div className="text-4xl font-bold bg-gradient-to-r from-tencent-blue to-tencent-blue-light bg-clip-text text-transparent mb-2">
            {quizState.score}/{tencentQuizQuestions.length}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            正确率 {scorePercentage}%
          </p>
          {scorePercentage >= 80 ? (
            <div className="flex items-center justify-center gap-2 text-success mb-4">
              <GooseMascot mood="happy" size="md" />
              <span className="text-sm font-medium">太棒了！企鹅为你骄傲！</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
              <GooseMascot mood="thinking" size="md" />
              <span className="text-sm">再接再厉，继续了解腾讯吧！</span>
            </div>
          )}
          <button
            onClick={handleReset}
            className="btn-micro inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-tencent-blue to-tencent-blue-light text-white rounded-lg font-medium hover:shadow-md transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新答题</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2 border border-gray-100/60 dark:border-gray-700/60 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-tencent-blue to-tencent-blue-light p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            <h4 className="font-semibold">腾讯知识问答</h4>
          </div>
          <span className="text-sm opacity-90">
            {quizState.currentQuestion + 1} / {tencentQuizQuestions.length}
          </span>
        </div>
        <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${((quizState.currentQuestion + 1) / tencentQuizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-5">
        <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {currentQ.question}
        </h5>

        <div className="space-y-2 mb-4">
          {currentQ.options.map((option, idx) => {
            let optionStyle = 'border-gray-200 dark:border-gray-600 hover:border-tencent-blue dark:hover:border-tencent-blue-light hover:bg-tencent-blue/5';
            if (quizState.showExplanation) {
              if (idx === currentQ.correct) {
                optionStyle = 'border-success bg-success/10 dark:border-success dark:bg-success/20';
              } else if (idx === quizState.selectedAnswer) {
                optionStyle = 'border-error bg-error/10 dark:border-error dark:bg-error/20';
              }
            } else if (idx === quizState.selectedAnswer) {
              optionStyle = 'border-tencent-blue bg-tencent-blue/10 dark:border-tencent-blue-light dark:bg-tencent-blue/20';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={quizState.showExplanation}
                className={`option-micro w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${optionStyle} ${
                  quizState.showExplanation ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                    quizState.showExplanation && idx === currentQ.correct
                      ? 'border-success bg-success text-white'
                      : quizState.showExplanation && idx === quizState.selectedAnswer
                      ? 'border-error bg-error text-white'
                      : 'border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {quizState.showExplanation && (
          <div className={`p-4 rounded-lg mb-4 ${
            quizState.selectedAnswer === currentQ.correct
              ? 'bg-success/10 dark:bg-success/20 border border-success/30'
              : 'bg-error/10 dark:bg-error/20 border border-error/30'
          }`}>
            <div className="flex items-start gap-2">
              {quizState.selectedAnswer === currentQ.correct ? (
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              ) : (
                <span className="text-error flex-shrink-0 mt-0.5">✗</span>
              )}
              <div>
                <p className={`font-medium mb-1 ${
                  quizState.selectedAnswer === currentQ.correct
                    ? 'text-success dark:text-success-light'
                    : 'text-error dark:text-error-light'
                }`}>
                  {quizState.selectedAnswer === currentQ.correct ? '回答正确！' : '回答错误'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{currentQ.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Next Button */}
        {quizState.showExplanation && (
          <button
            onClick={handleNext}
            className="btn-primary-micro w-full py-2.5 bg-gradient-to-r from-tencent-blue to-tencent-blue-light text-white rounded-lg font-medium hover:shadow-md hover:shadow-tencent-blue/20 transition-all"
          >
            {quizState.currentQuestion < tencentQuizQuestions.length - 1 ? '下一题' : '查看结果'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function TencentSection() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-8">
      {/* Culture Section - Enhanced with flip animation */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-tencent-blue via-tencent-blue-600 to-tencent-blue-800 p-8 text-white shadow-xl shadow-tencent-blue/30">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl"></div>

        {/* 8-degree decorative line */}
        <div className="absolute top-4 left-0 w-20 h-0.5 bg-white/30 transform -skew-x-12"></div>
        <div className="absolute bottom-4 right-0 w-32 h-0.5 bg-white/20 transform -skew-x-12"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <span className="text-3xl">🌱</span>
            腾讯文化价值观
          </h2>
          <p className="text-blue-100 mb-6 text-sm">自树而生，扎根成长，向上辐射</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {tencentCultures.map((culture, index) => {
              const Icon = cultureIconMap[culture.icon] || Heart;
              const isFlipped = flippedCards[`culture-${index}`];

              return (
                <div
                  key={culture.title}
                  className="perspective-1000 cursor-pointer h-32"
                  onClick={() => setFlippedCards((prev) => ({ ...prev, [`culture-${index}`]: !isFlipped }))}
                  onMouseEnter={() => setFlippedCards((prev) => ({ ...prev, [`culture-${index}`]: true }))}
                  onMouseLeave={() => setFlippedCards((prev) => ({ ...prev, [`culture-${index}`]: false }))}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 h-full flex flex-col items-center justify-center text-center hover:bg-white/15 hover:shadow-lg transition-all duration-300">
                        <Icon className="w-10 h-10 mb-3 text-white" />
                        <h3 className="font-semibold text-lg">{culture.title}</h3>
                        <p className="text-xs text-blue-100 mt-1 opacity-75">hover查看详情</p>
                      </div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180">
                      <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/30 h-full flex flex-col items-center justify-center text-center">
                        <h3 className="font-semibold mb-2">{culture.title}</h3>
                        <p className="text-sm text-blue-100">{culture.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Training System - Career Path Visualization */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-100/60 dark:border-gray-700/60 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-tencent-blue/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-tencent-blue/10 dark:bg-tencent-blue/20 rounded-xl">
              <Award className="w-6 h-6 text-tencent-blue dark:text-tencent-blue-light" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{tencentTraining.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">T族双通道职业发展路径</p>
            </div>
          </div>

          {/* Career Path Steps */}
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-success via-tencent-blue to-tencent-blue-800 rounded-full opacity-20"></div>

            <div className="grid grid-cols-5 gap-3">
              {tencentCareerPath.map((step) => (
                <div key={step.level} className="relative group">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}20, ${step.color}10)`,
                        border: `2px solid ${step.color}40`,
                      }}
                    >
                      {step.icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{step.level}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">{step.title}</span>
                    <span className="h-8 text-xs text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {step.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training Items */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tencentTraining.items.map((item) => (
              <div
                key={item.title}
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recruitment Channels */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-100/60 dark:border-gray-700/60 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/10 dark:from-purple-400/5 to-transparent rounded-full -translate-y-1/2 -translate-x-1/2"></div>

        <div className="mb-6 relative z-10">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">腾讯官方招聘渠道</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">以下链接均来自腾讯官方招聘网站，数据准确且实时更新</p>
        </div>

        <div className="space-y-8 relative z-10">
          {/* Campus Recruitment */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">校园招聘</h4>
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs rounded-full font-medium">适合在校大学生</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recruitmentChannels
                .filter((ch) => ch.category === 'campus')
                .map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <a
                      key={channel.id}
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block p-5 border border-gray-100/60 dark:border-gray-700/60 rounded-xl hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50"
                    >
                      {channel.badge && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full font-medium">
                          {channel.badge}
                        </span>
                      )}
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20 transition-colors flex-shrink-0">
                          <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {channel.title}
                            </h5>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{channel.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {channel.tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-700 flex items-center gap-1 text-purple-500 dark:text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>前往官网查看</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </a>
                  );
                })}
            </div>
          </div>

          {/* Social Recruitment */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">社会招聘</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recruitmentChannels
                .filter((ch) => ch.category === 'social')
                .map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <a
                      key={channel.id}
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-5 border border-gray-100/60 dark:border-gray-700/60 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                            {channel.title}
                          </h5>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{channel.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {channel.tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-700 flex items-center gap-1 text-blue-500 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>前往官网查看</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </a>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Advice Box */}
        <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex-shrink-0 mt-0.5">
              <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h5 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">给在校大学生的建议</h5>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                如果你想进入腾讯，建议优先关注<strong className="text-amber-900 dark:text-amber-200">2026校园招聘</strong>和<strong className="text-amber-900 dark:text-amber-200">实习生招聘</strong>。
                在校期间积累一段腾讯实习经历，对日后拿下正式offer会有非常大的帮助！
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Section */}
      <TencentQuiz />

      {/* Global Styles for 3D Transforms */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
