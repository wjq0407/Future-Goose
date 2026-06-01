import { useState } from 'react';
import { useAppStore } from '@/store';
import { FREE_MODELS, PAID_MODELS } from '@/services/aiApi';
import { ArrowLeft, Settings, Zap, Crown, AlertCircle, Eye, EyeOff, Check, X, Sparkles, Globe, Key, RefreshCw, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AISettings() {
  const navigate = useNavigate();
  const { 
    selectedModel, 
    setSelectedModel,
    setShowApiKeyModal,
    customApiConfig,
    setCustomApiConfig,
    apiMode,
    setApiMode,
    setFreeMode,
    setDemoMode,
  } = useAppStore();

  const [showKey, setShowKey] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const hasCustomApi = !!customApiConfig?.apiKey;
  const hasDefaultKey = !!import.meta.env.VITE_DEFAULT_API_KEY;

  const testConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel || 'glm-4-flash',
          messages: [{ role: 'user', content: '你好' }],
          stream: false,
        }),
      });

      if (response.ok) {
        setTestResult('success');
      } else {
        setTestResult('error');
      }
    } catch {
      setTestResult('error');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleFreeModeClick = () => {
    if (hasCustomApi) {
      setFreeMode();
    } else if (!hasDefaultKey) {
      setDemoMode();
    } else {
      setApiMode('free');
    }
  };

  const handleCustomModeClick = () => {
    setShowApiKeyModal(true);
  };

  const handleDemoModeClick = () => {
    setDemoMode();
  };

  const canUseFreeApi = !!import.meta.env.VITE_DEFAULT_API_KEY;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-tencent-blue" />
            AI 模型设置
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* 当前状态 */}
        <div className={`p-4 rounded-2xl border-2 ${
          apiMode === 'demo' 
            ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
            : apiMode === 'free' 
            ? 'bg-tencent-blue-50 dark:bg-tencent-blue-900/20 border-tencent-blue-200 dark:border-tencent-blue-800' 
            : 'bg-goose-orange-50 dark:bg-goose-orange-900/20 border-goose-orange-200 dark:border-goose-orange-800'
        }`}>
          <div className="flex items-center gap-3">
            {apiMode === 'demo' ? (
              <>
                <WifiOff className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">
                    当前使用：演示模式
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    使用模拟数据回复，非真实AI
                  </p>
                </div>
              </>
            ) : apiMode === 'free' ? (
              <>
                <Sparkles className="w-6 h-6 text-tencent-blue" />
                <div>
                  <p className="font-semibold text-tencent-blue-700 dark:text-tencent-blue-300">
                    当前使用：免费模式
                  </p>
                  <p className="text-sm text-tencent-blue-600 dark:text-tencent-blue-400 mt-1">
                    使用未来鹅提供的API额度，仅限免费模型，每日有限制
                  </p>
                </div>
              </>
            ) : (
              <>
                <Crown className="w-6 h-6 text-goose-orange" />
                <div>
                  <p className="font-semibold text-goose-orange-700 dark:text-goose-orange-300">
                    当前使用：自定义API模式
                  </p>
                  <p className="text-sm text-goose-orange-600 dark:text-goose-orange-400 mt-1">
                    使用自己的API Key，可解锁所有模型，无限制
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 模式选择 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg shadow-black/5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">使用模式</h2>
          
          <div className="space-y-3">
            {/* 免费模式 */}
            {canUseFreeApi && (
              <button
                onClick={handleFreeModeClick}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  apiMode === 'free'
                    ? 'border-tencent-blue bg-tencent-blue-50 dark:bg-tencent-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-tencent-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-tencent-blue-100 dark:bg-tencent-blue-900/50 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-tencent-blue" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">免费模式（推荐）</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">使用未来鹅提供的API，仅限免费模型，每日有限制</p>
                    </div>
                  </div>
                  {apiMode === 'free' && <Check className="w-5 h-5 text-tencent-blue" />}
                </div>
              </button>
            )}

            {/* 演示模式 */}
            {!canUseFreeApi && (
              <button
                onClick={handleDemoModeClick}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  apiMode === 'demo'
                    ? 'border-gray-400 bg-gray-50 dark:bg-gray-700'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      <WifiOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">演示模式</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">使用模拟数据回复，非真实AI</p>
                    </div>
                  </div>
                  {apiMode === 'demo' && <Check className="w-5 h-5 text-gray-500" />}
                </div>
              </button>
            )}

            {/* 自定义模式 */}
            <button
              onClick={handleCustomModeClick}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                apiMode === 'custom'
                  ? 'border-goose-orange bg-goose-orange-50 dark:bg-goose-orange-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-goose-orange-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-goose-orange-100 dark:bg-goose-orange-900/50 flex items-center justify-center">
                    <Key className="w-5 h-5 text-goose-orange" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">自定义API</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">使用自己的Key，解锁所有模型，无限制</p>
                  </div>
                </div>
                {apiMode === 'custom' && <Check className="w-5 h-5 text-goose-orange" />}
              </div>
            </button>
          </div>
        </div>

        {/* 模型选择 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg shadow-black/5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">选择模型</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {apiMode === 'demo' 
              ? '演示模式下模型选择无效，请切换到免费模式或自定义API' 
              : apiMode === 'free' 
              ? '免费模式下只能使用标注"免费"的模型' 
              : '自定义API可使用所有模型'}
          </p>

          {/* 免费模型 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-green-500" />
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">免费模型</h3>
              <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                {apiMode === 'free' ? '免费模式可用' : apiMode === 'demo' ? '演示模式不可用' : '自定义API可用'}
              </span>
            </div>
            <div className="grid gap-2">
              {FREE_MODELS.map(model => {
                const isCurrent = selectedModel === model.id;
                const isDisabled = apiMode === 'demo';
                
                return (
                  <button
                    key={model.id}
                    onClick={() => !isDisabled && setSelectedModel(model.id)}
                    disabled={isDisabled}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      isCurrent && apiMode !== 'demo'
                        ? 'border-tencent-blue bg-tencent-blue-50 dark:bg-tencent-blue-900/30'
                        : isDisabled
                        ? 'border-gray-100 dark:border-gray-700 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 dark:border-gray-700 hover:border-tencent-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">{model.name}</span>
                          {model.tag && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              model.tag === '推荐' 
                                ? 'bg-tencent-blue-100 dark:bg-tencent-blue-900/50 text-tencent-blue-700 dark:text-tencent-blue-300'
                                : model.tag === '免费'
                                ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                              {model.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{model.desc}</p>
                      </div>
                      {isCurrent && apiMode !== 'demo' && <Check className="w-5 h-5 text-tencent-blue flex-shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 付费模型 */}
          {apiMode === 'custom' && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-4 h-4 text-goose-orange" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">付费模型</h3>
                <span className="text-xs bg-goose-orange-100 dark:bg-goose-orange-900/50 text-goose-orange-700 dark:text-goose-orange-300 px-2 py-0.5 rounded-full">自定义API可用</span>
              </div>
              <div className="grid gap-2">
                {PAID_MODELS.map(model => {
                  const isCurrent = selectedModel === model.id;
                  
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        isCurrent
                          ? 'border-goose-orange bg-goose-orange-50 dark:bg-goose-orange-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-goose-orange-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white">{model.name}</span>
                            {model.tag && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                model.tag === '旗舰'
                                  ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                                  : model.tag === '新品'
                                  ? 'bg-goose-orange-100 dark:bg-goose-orange-900/50 text-goose-orange-700 dark:text-goose-orange-300'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                              }`}>
                                {model.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{model.desc}</p>
                        </div>
                        {isCurrent && <Check className="w-5 h-5 text-goose-orange flex-shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {apiMode !== 'custom' && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    付费模型需要自定义API
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    点击上方"自定义API"按钮，输入自己的API Key即可解锁所有付费模型
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 高级设置 */}
        {apiMode === 'custom' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-black/5">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-6 flex items-center justify-between"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-500" />
                高级设置
              </h2>
              <span className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {showAdvanced && (
              <div className="px-6 pb-6 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                {/* API Key 显示 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    API Key
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-mono text-sm text-gray-600 dark:text-gray-400">
                      {showKey ? (customApiConfig?.apiKey || '未设置') : 'sk-****' + (customApiConfig?.apiKey?.slice(-4) || '')}
                    </div>
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                    >
                      {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Base URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    API Base URL
                  </label>
                  <input
                    type="text"
                    value={customApiConfig?.baseUrl || ''}
                    onChange={(e) => setCustomApiConfig({ ...customApiConfig, baseUrl: e.target.value })}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-mono text-sm"
                    placeholder="https://open.bigmodel.cn/api/paas/v4"
                  />
                </div>

                {/* 测试连接 */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={testConnection}
                    disabled={testingConnection}
                    className="flex items-center gap-2 px-4 py-2 bg-tencent-blue text-white rounded-xl hover:bg-tencent-blue-dark transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${testingConnection ? 'animate-spin' : ''}`} />
                    测试连接
                  </button>
                  {testResult === 'success' && (
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> 连接成功
                    </span>
                  )}
                  {testResult === 'error' && (
                    <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                      <X className="w-4 h-4" /> 连接失败
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 提示 */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-semibold mb-1">如何获取API Key？</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>访问 <a href="https://open.bigmodel.cn/" target="_blank" rel="noopener noreferrer" className="underline">智谱AI开放平台</a></li>
                <li>注册/登录账号</li>
                <li>进入"API Keys"页面创建新的Key</li>
                <li>复制Key并粘贴到自定义API设置中</li>
              </ol>
              <p className="mt-2 text-amber-700 dark:text-amber-300">
                💡 GLM-4-Flash 等模型有免费额度，适合日常使用
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
