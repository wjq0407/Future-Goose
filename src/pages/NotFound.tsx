import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import GooseMascot from '@/components/GooseMascot';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center space-y-8 py-12">
        <div className="space-y-4">
          {/* 陪伴型企鹅 - 鼓励状态 */}
          <div className="animate-goose-fade-in">
            <GooseMascot mood="encouraging" size="lg" className="text-tencent-blue mx-auto animate-goose-waddle" />
          </div>
          
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-tencent-blue to-tencent-blue-light">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-text-primary">
            页面走丢了
          </h2>
          <p className="text-lg text-text-secondary max-w-md mx-auto">
            看起来你访问的页面不存在,可能是路径有误或页面已被移除
          </p>
          <p className="text-sm text-text-tertiary">
            别担心,让我陪你找到正确的路 🐧
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-tencent-blue to-tencent-blue-light text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            <span>返回首页</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-bg-surface text-text-primary rounded-xl font-medium border border-border hover:bg-bg-surface-elevated hover:-translate-y-0.5 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回上一页</span>
          </button>
        </div>

        <div className="pt-8 text-sm text-text-tertiary">
          <p>如果你认为这是一个错误,请联系管理员</p>
        </div>
      </div>
    </div>
  );
}
