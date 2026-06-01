import { useLocation, useNavigationType } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevPathRef = useRef<string>(location.pathname);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [animationClass, setAnimationClass] = useState('animate-page-enter');

  const routeOrder = useRef(['/', '/profile', '/chat', '/growth', '/tencent']).current;

  const getDirection = useCallback((): 'forward' | 'backward' | 'home' => {
    if (navigationType === 'POP') {
      return 'backward';
    }
    
    const prevIndex = routeOrder.indexOf(prevPathRef.current);
    const currentIndex = routeOrder.indexOf(location.pathname);
    
    if (location.pathname === '/') {
      return 'home';
    }
    
    if (currentIndex > prevIndex || prevIndex === -1) {
      return 'forward';
    }
    
    return 'backward';
  }, [location.pathname, navigationType, routeOrder]);

  useEffect(() => {
    const direction = getDirection();
    
    let newAnimationClass: string;
    if (prefersReducedMotion) {
      newAnimationClass = 'opacity-100';
    } else {
      if (direction === 'home') {
        newAnimationClass = 'animate-page-enter';
      } else {
        newAnimationClass = direction === 'forward' 
          ? 'animate-slide-left-enter' 
          : 'animate-slide-right-enter';
      }
    }
    
    setAnimationClass(newAnimationClass);
    prevPathRef.current = location.pathname;
  }, [location.pathname, navigationType, getDirection, prefersReducedMotion]);

  return (
    <div 
      key={location.pathname}
      className={animationClass}
      style={{ 
        willChange: 'transform, opacity',
        transform: 'translateZ(0)'
      }}
    >
      {children}
    </div>
  );
}
