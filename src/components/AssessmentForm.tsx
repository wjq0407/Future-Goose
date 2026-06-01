import { useState, useRef } from 'react';
import { useAppStore } from '@/store';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { assessmentQuestions, calculateSkills } from '@/data/assessmentData';

export default function AssessmentForm() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const completeAssessment = useAppStore((state) => state.completeAssessment);
  const isTransitioning = useRef(false);

  const question = assessmentQuestions[currentQ];
  const progress = ((currentQ + 1) / assessmentQuestions.length) * 100;

  const handleSelect = (score: number) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    const newAnswers = { ...answers, [question.id]: score };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQ < assessmentQuestions.length - 1) {
        setCurrentQ(currentQ + 1);
        isTransitioning.current = false;
      } else {
        const skills = calculateSkills(newAnswers);
        completeAssessment(skills);
        isTransitioning.current = false;
      }
    }, 200);
  };

  const handleBack = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-100/60 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" aria-hidden="true"></div>
        <div className="mb-6 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">测评进度 {currentQ + 1}/{assessmentQuestions.length}</span>
            <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label={`测评进度：${Math.round(progress)}%`}>
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="mb-8 relative z-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{question.question}</h3>
          <span className="inline-block px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 text-xs rounded-md font-medium mb-4 border border-blue-100/50">
            评估维度：{question.skillDimension}
          </span>
          <div className="space-y-3" role="radiogroup" aria-label="请选择你的回答">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(option.score)}
                className="option-micro w-full flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 border-2 border-transparent transition-all duration-300 group hover:shadow-md"
                role="radio"
                aria-checked={false}
              >
                <span className="text-gray-700 group-hover:text-blue-600">{option.text}</span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-150" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between relative z-10">
          <button
            onClick={handleBack}
            disabled={currentQ === 0}
            className="flex items-center gap-1 px-4 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>上一题</span>
          </button>
          <div className="flex gap-1.5" aria-hidden="true">
            {assessmentQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentQ
                    ? 'bg-blue-500 scale-125'
                    : index < currentQ
                    ? 'bg-blue-300'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
