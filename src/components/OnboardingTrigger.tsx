import { useAppStore } from '@/store';
import { HelpCircle } from 'lucide-react';

export default function OnboardingTrigger() {
  const onboarding = useAppStore((state) => state.onboarding);
  const startOnboarding = useAppStore((state) => state.startOnboarding);

  if (onboarding.isCompleted && onboarding.isShowing) {
    return null;
  }

  return (
    <button
      onClick={startOnboarding}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center"
      title="查看新手引导"
    >
      <HelpCircle className="w-5 h-5" />
    </button>
  );
}
