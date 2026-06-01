import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, User, TrendingUp, Building2, Home, Sun, Moon, Circle, Settings } from 'lucide-react';
import PerformanceDashboard from '@/components/PerformanceDashboard';
import { useTheme } from '@/hooks/useTheme';
import GooseHead from '@/components/GooseHead';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/profile', label: '个人画像', icon: User },
  { path: '/chat', label: 'AI对话', icon: MessageCircle },
  { path: '/growth', label: '成长规划', icon: TrendingUp },
  { path: '/tencent', label: '鹅厂专区', icon: Building2 },
];

export default function Header() {
  const location = useLocation();
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const activeIndex = navItems.findIndex((item) => item.path === location.pathname);
    if (activeIndex >= 0 && navRefs.current[activeIndex]) {
      const element = navRefs.current[activeIndex];
      if (element) {
        const { offsetLeft, offsetWidth } = element;
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
      }
    }
  }, [location.pathname]);

  return (
    <>
      {/* Desktop Header */}
      {!isMobile && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#1A1D27]/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-[#2A2D37]/80" role="banner">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-tencent-blue/20 to-transparent dark:via-tencent-blue/30" aria-hidden="true" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-between h-16">
              {/* Logo with Goose Head */}
              <Link
                to="/"
                className="flex items-center gap-2.5 group"
                aria-label="未来鹅 - 首页"
              >
                <div className="relative w-9 h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 bg-gradient-to-br from-tencent-blue to-tencent-blue-light rounded-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
                  <GooseHead size={28} className="text-tencent-blue" />
                </div>
                <span className="font-bold text-lg text-brand-gradient">未来鹅</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="flex items-center gap-1 relative" aria-label="主导航">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      ref={(el) => { navRefs.current[index] = el; }}
                      className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-tencent-blue dark:text-tencent-blue-light'
                          : 'text-gray-700 dark:text-[#B0B3B8] hover:text-gray-900 dark:hover:text-[#E8EAED]'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <item.icon className="w-4 h-4" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {/* Active Indicator Line */}
                <div
                  className="absolute bottom-0 h-0.5 bg-gradient-to-r from-tencent-blue to-tencent-blue-light rounded-full transition-all duration-300 ease-out"
                  style={{
                    left: `${indicatorStyle.left}px`,
                    width: `${indicatorStyle.width}px`,
                  }}
                />

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 dark:text-[#8B8F96] hover:bg-gray-100/80 dark:hover:bg-[#242830]/80 hover:text-tencent-blue dark:hover:text-tencent-blue-light transition-all duration-300 ml-2"
                  aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
                  title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
                >
                  {isDark ? (
                    <Sun className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Moon className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>

                {/* AI Settings */}
                <Link
                  to="/ai-settings"
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 dark:text-[#8B8F96] hover:bg-gray-100/80 dark:hover:bg-[#242830]/80 hover:text-tencent-blue dark:hover:text-tencent-blue-light transition-all duration-300"
                  title="AI 模型设置"
                  aria-label="AI 模型设置"
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                </Link>

                {/* Performance Monitor - Subtle Dot */}
                <button
                  onClick={() => setShowPerformanceDashboard(true)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 dark:text-[#5C6068] hover:text-tencent-blue dark:hover:text-tencent-blue-light hover:bg-gray-100/80 dark:hover:bg-[#242830]/80 transition-all duration-300 ml-1"
                  title="性能监控面板 (Ctrl+Shift+P)"
                  aria-label="性能监控面板"
                >
                  <Circle className="w-2.5 h-2.5" fill="currentColor" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </header>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1A1D27]/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-[#2A2D37]/80" aria-label="移动端主导航">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-0 flex-1 transition-all duration-300 ${
                    isActive
                      ? 'text-tencent-blue dark:text-tencent-blue-light'
                      : 'text-gray-600 dark:text-[#8B8F96]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                  <span className="text-xs font-medium truncate">{item.label}</span>
                  {isActive && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-tencent-blue rounded-full" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
            <Link
              to="/ai-settings"
              className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-0 flex-1 transition-all duration-300 ${
                location.pathname === '/ai-settings'
                  ? 'text-tencent-blue dark:text-tencent-blue-light'
                  : 'text-gray-600 dark:text-[#8B8F96]'
              }`}
              aria-current={location.pathname === '/ai-settings' ? 'page' : undefined}
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
              <span className="text-xs font-medium truncate">设置</span>
              {location.pathname === '/ai-settings' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-tencent-blue rounded-full" aria-hidden="true" />
              )}
            </Link>
          </div>
        </nav>
      )}

      <PerformanceDashboard isOpen={showPerformanceDashboard} onClose={() => setShowPerformanceDashboard(false)} />
    </>
  );
}
