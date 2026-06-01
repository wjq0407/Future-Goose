import { UserGrade } from '@/types';
import { useAppStore } from '@/store';
import { GraduationCap, BookOpen, Briefcase, Target, Award } from 'lucide-react';

const gradeCards: { grade: UserGrade; label: string; icon: typeof GraduationCap; description: string; color: string }[] = [
  { grade: 'freshman', label: '大一', icon: BookOpen, description: '探索互联网，发现兴趣', color: 'from-blue-400 to-blue-500' },
  { grade: 'sophomore', label: '大二', icon: Target, description: '确定方向，规划路径', color: 'from-purple-400 to-purple-500' },
  { grade: 'junior', label: '大三', icon: Briefcase, description: '实习探索，准备求职', color: 'from-orange-400 to-orange-500' },
  { grade: 'senior', label: '大四', icon: Award, description: '秋招冲刺，offer选择', color: 'from-green-400 to-green-500' },
  { grade: 'graduate', label: '研究生', icon: GraduationCap, description: '专业深化，高端求职', color: 'from-pink-400 to-pink-500' },
];

export default function GradeSelector() {
  const setGrade = useAppStore((state) => state.setGrade);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {gradeCards.map((card, index) => (
        <button
          key={card.grade}
          onClick={() => setGrade(card.grade)}
          className="card-grow-micro group relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-100/60 hover:shadow-medium transition-all duration-300 text-left overflow-hidden"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
          <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 relative z-10`}>
            <card.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1 relative z-10">{card.label}</h3>
          <p className="text-sm text-gray-500 relative z-10">{card.description}</p>
        </button>
      ))}
    </div>
  );
}
