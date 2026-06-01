import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store';
import { MODEL_OPTIONS, FREE_MODELS, PAID_MODELS } from '@/services/aiApi';
import { X, Key, Info, ExternalLink, ChevronDown, Check, Settings2, Zap, Crown } from 'lucide-react';

export function ApiKeyModal() {
  const { showApiKeyModal, setShowApiKeyModal, setCustomApiConfig } = useAppStore();
  const [inputKey, setInputKey] = useState('');
  const [inputBaseUrl, setInputBaseUrl] = useState('https://open.bigmodel.cn/api/paas/v4');

  const handleSave = () => {
    if (inputKey.trim()) {
      setCustomApiConfig({
        apiKey: inputKey.trim(),
        baseUrl: inputBaseUrl.trim() || 'https://open.bigmodel.cn/api/paas/v4',
      });
    }
  };

  if (!showApiKeyModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">配置AI API Key</h3>
          <button
            onClick={() => setShowApiKeyModal(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <div className="flex gap-2">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">如何获取API Key？</p>
              <p className="mb-2">1. 访问智谱AI开放平台</p>
              <a
                href="https://open.bigmodel.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                <span>https://open.bigmodel.cn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <p className="mt-2">2. 注册账号后在「API Keys」页面创建</p>
              <p className="mt-1">3. GLM-4-Flash等模型有免费额度</p>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="请输入你的智谱API Key"
            autoComplete="off"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />

          <input
            type="text"
            value={inputBaseUrl}
            onChange={(e) => setInputBaseUrl(e.target.value)}
            placeholder="API Base URL"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
        </form>

        <div className="flex gap-2">
          <button
            onClick={() => setShowApiKeyModal(false)}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!inputKey.trim()}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            保存并启用AI
          </button>
        </div>
      </div>
    </div>
  );
}

function ModelSelector() {
  const { selectedModel, setSelectedModel } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasCustomApi = !!useAppStore.getState().customApiConfig?.apiKey;
  const hasDefaultKey = !!import.meta.env.VITE_DEFAULT_API_KEY;
  const isUsingDefault = !hasCustomApi && hasDefaultKey;

  const availableModels = isUsingDefault ? FREE_MODELS : MODEL_OPTIONS;
  const selectedOption = availableModels.find(m => m.id === selectedModel) || availableModels[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!hasDefaultKey && !hasCustomApi) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/80 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-white hover:border-gray-300 transition-all"
      >
        <Settings2 className="w-3.5 h-3.5" />
        <span>{selectedOption.name}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-96 overflow-y-auto">
          {isUsingDefault ? (
            <>
              <div className="px-3 pb-2 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-500">免费模型</p>
              </div>
              {FREE_MODELS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedModel(option.id);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedModel === option.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedModel === option.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{option.name}</span>
                      {option.tag && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          option.tag === '推荐' ? 'bg-blue-100 text-blue-600' :
                          option.tag === '免费' ? 'bg-green-100 text-green-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {option.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{option.desc}</p>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <>
              <div className="px-3 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-green-500" />
                  <p className="text-xs font-medium text-gray-500">免费模型</p>
                </div>
              </div>
              {FREE_MODELS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedModel(option.id);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedModel === option.id
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedModel === option.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{option.name}</span>
                      {option.tag && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          option.tag === '推荐' ? 'bg-blue-100 text-blue-600' :
                          option.tag === '免费' ? 'bg-green-100 text-green-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {option.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{option.desc}</p>
                  </div>
                </button>
              ))}
              <div className="px-3 py-2 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-goose-orange" />
                  <p className="text-xs font-medium text-gray-500">付费模型</p>
                </div>
              </div>
              {PAID_MODELS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedModel(option.id);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedModel === option.id
                      ? 'border-goose-orange bg-goose-orange'
                      : 'border-gray-300'
                  }`}>
                    {selectedModel === option.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{option.name}</span>
                      {option.tag && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          option.tag === '旗舰' ? 'bg-purple-100 text-purple-600' :
                          option.tag === '新品' ? 'bg-goose-orange-100 text-goose-orange-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {option.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{option.desc}</p>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function ApiKeyTrigger() {
  const { setShowApiKeyModal, selectedModel, customApiConfig } = useAppStore();
  const hasDefaultKey = !!import.meta.env.VITE_DEFAULT_API_KEY;
  const hasCustomApi = !!customApiConfig?.apiKey;
  const isDemoMode = !hasDefaultKey && !hasCustomApi;
  const isUsingDefault = !hasCustomApi && hasDefaultKey;

  const availableModels = isUsingDefault ? FREE_MODELS : MODEL_OPTIONS;
  const selectedOption = availableModels.find(m => m.id === selectedModel) || availableModels[0];

  if (isDemoMode) {
    return (
      <button
        onClick={() => setShowApiKeyModal(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
        title="配置API Key以启用AI功能"
      >
        <Key className="w-4 h-4" />
        <span className="hidden sm:inline">配置API</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="hidden sm:inline">{selectedOption.name}</span>
      </div>
      <ModelSelector />
    </div>
  );
}
