import { Loader2 } from 'lucide-react';

export default function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <div className="absolute inset-0 w-10 h-10 animate-pulse rounded-full bg-blue-500/10" />
      </div>
      <p className="text-gray-500 text-sm animate-pulse">加载中...</p>
    </div>
  );
}
