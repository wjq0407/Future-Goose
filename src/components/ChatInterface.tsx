import { useAppStore } from '@/store';
import { Bot, User, Send, Square, Paperclip, X, FileText, Image, FileCode, Brain, MessageCircle, Clock } from 'lucide-react';
import { useState, useRef, useEffect, useCallback, Fragment } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import SceneSelector from '@/components/SceneSelector';
import QuickQuestions from '@/components/QuickQuestions';
import { ChatAttachment, ChatSceneId } from '@/types';
import GooseMascot from '@/components/GooseMascot';
import { useToastStore } from '@/store/toastStore';

let pdfjsLib: typeof import('pdfjs-dist') | null = null;
let mammothModule: typeof import('mammoth') | null = null;

async function loadPdfjs() {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
  return pdfjsLib;
}

async function loadMammoth() {
  if (!mammothModule) {
    mammothModule = await import('mammoth');
  }
  return mammothModule;
}

const ALLOWED_FILE_TYPES = [
  '.txt', '.md', '.pdf', '.doc', '.docx',
  '.png', '.jpg', '.jpeg', '.gif', '.webp',
  '.json', '.csv', '.html', '.css', '.js', '.ts', '.tsx',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return Image;
  if (type.includes('code') || /\.(js|ts|tsx|html|css|json|py|go|java)$/.test(type)) return FileCode;
  return FileText;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const lib = await loadPdfjs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    const pages: string[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map(item => {
          if ('str' in item) {
            return item.str;
          }
          return '';
        })
        .filter(Boolean)
        .join(' ');
      pages.push(pageText);
    }
    
    return pages.join('\n\n');
  } catch (e) {
    console.error('PDF解析失败:', e);
    return `[PDF解析失败: ${file.name}]`;
  }
}

async function extractTextFromWord(file: File): Promise<string> {
  try {
    const mammoth = await loadMammoth();
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || `[Word文档内容为空: ${file.name}]`;
  } catch (e) {
    console.error('Word文档解析失败:', e);
    return `[Word文档解析失败: ${file.name}]`;
  }
}

function extractTextFromAttachment(file: File): Promise<string> {
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    return extractTextFromPDF(file);
  }
  
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      file.type === 'application/msword' || 
      file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
    return extractTextFromWord(file);
  }
  
  if (file.type === 'text/plain' || file.type === 'text/markdown' || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(file);
    });
  }
  
  if (file.type.startsWith('image/')) {
    return Promise.resolve(`[图片: ${file.name}]`);
  }
  
  if (file.name.endsWith('.json') || file.name.endsWith('.csv') || file.name.endsWith('.html') || file.name.endsWith('.css') || file.name.endsWith('.js') || file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(file);
    });
  }
  
  return Promise.resolve(`[文件: ${file.name}]`);
}

const sceneCards: Array<{
  id: ChatSceneId;
  icon: typeof MessageCircle;
  title: string;
  description: string;
  gradient: string;
}> = [
  {
    id: 'career',
    icon: MessageCircle,
    title: '职业咨询',
    description: '规划职业方向，探索未来可能',
    gradient: 'from-tencent-blue to-tencent-blue-light',
  },
  {
    id: 'interview',
    icon: Bot,
    title: '模拟面试',
    description: '大厂资深面试官，实战演练',
    gradient: 'from-goose-orange to-goose-orange-light',
  },
  {
    id: 'resume',
    icon: FileText,
    title: '简历诊断',
    description: '优化简历内容，提升竞争力',
    gradient: 'from-goose-green to-goose-green',
  },
];

export default function ChatInterface() {
  const { conversations, currentConversationId, isTyping, streamingContent, streamingReasoningContent, sendMessage, abortStream, switchConversation } = useAppStore();
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  const messagesLength = currentConversation?.messages.length || 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesLength, streamingContent, streamingReasoningContent]);

  const lastConversation = conversations
    .filter(c => c.messages.length > 0)
    .sort((a, b) => b.updatedAt - a.updatedAt)[0];

  const handleContinueLastConversation = () => {
    if (lastConversation) {
      switchConversation(lastConversation.id);
    }
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const newAttachments: ChatAttachment[] = [];
    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        useToastStore.getState().warning(`文件 "${file.name}" 超过5MB限制`, '请选择更小的文件');
        continue;
      }
      try {
        const content = await extractTextFromAttachment(file);
        const isImage = file.type.startsWith('image/');
        let preview: string | undefined;
        if (isImage) {
          preview = URL.createObjectURL(file);
        }
        newAttachments.push({
          name: file.name,
          size: file.size,
          type: file.type,
          content,
          preview,
        });
      } catch (e) {
        console.error('文件处理失败:', e);
        useToastStore.getState().error(`文件 "${file.name}" 处理失败`, '该文件可能已损坏或格式不受支持');
      }
    }
    if (newAttachments.length > 0) {
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      const item = prev[index];
      if (item?.preview) {
        try {
          URL.revokeObjectURL(item.preview);
        } catch (e) {
          console.error('释放URL对象失败:', e);
        }
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSend = () => {
    if ((!input.trim() && attachments.length === 0) || isTyping) return;

    let finalContent = input.trim();
    const attachmentDescriptions: string[] = [];
    for (const att of attachments) {
      if (att.content) {
        attachmentDescriptions.push(`【附件内容 ${att.name}】\n${att.content}`);
      } else {
        attachmentDescriptions.push(`【上传文件 ${att.name}】`);
      }
    }
    if (attachmentDescriptions.length > 0) {
      finalContent = finalContent
        ? `${finalContent}\n\n${attachmentDescriptions.join('\n\n')}`
        : attachmentDescriptions.join('\n\n');
    }

    sendMessage(finalContent, attachments.length > 0 ? attachments : undefined);
    setInput('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isStreaming = isTyping && streamingContent.length > 0;
  const isReasoning = isTyping && streamingReasoningContent.length > 0 && streamingContent.length === 0;

  return (
    <div className="flex flex-col h-full" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      {dragOver && (
        <div className="absolute inset-0 bg-tencent-blue/10 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl border-2 border-dashed border-tencent-blue chat-drop-zone-enter" role="alert" aria-live="assertive" aria-label="文件拖拽区域">
          <div className="text-center">
            <div className="relative inline-block">
              <Paperclip className="w-12 h-12 text-tencent-blue mx-auto mb-2 chat-attach-float" aria-hidden="true" />
            </div>
            <p className="text-lg font-medium text-tencent-blue">拖拽文件到此处上传</p>
          </div>
        </div>
      )}

      <SceneSelector />

      <div className="flex-1 overflow-y-auto space-y-3 mb-2 pr-1" role="log" aria-live="polite" aria-label="对话消息列表">
        {messages.length === 0 && !isTyping && (
          <div className="text-center py-6 animate-goose-fade-in" role="region" aria-label="对话欢迎区域">
            <div className="relative inline-block mb-3">
              <div className="chat-goose-wrapper">
                <GooseMascot mood="happy" size="lg" className="text-tencent-blue mx-auto animate-goose-bob" />
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-tencent-blue/20 rounded-full filter blur-sm chat-bubble-float" style={{ animationDelay: '0s' }}></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-tencent-blue/15 rounded-full filter blur-sm chat-bubble-float" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <p className="text-text-secondary mb-1 font-medium text-sm">你好！我是未来鹅AI助手</p>
            <p className="text-xs text-text-tertiary mb-4">选择对话场景，开始你的成长之旅</p>

            {lastConversation && lastConversation.id !== currentConversationId && (
              <button
                onClick={handleContinueLastConversation}
                className="chat-continue-btn mb-4 w-full max-w-xs mx-auto"
                aria-label={`继续上次对话：${lastConversation.title}`}
              >
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm">继续上次对话</span>
                <span className="text-xs truncate max-w-[160px]">{lastConversation.title}</span>
              </button>
            )}

            <div className="chat-scene-cards grid grid-cols-3 gap-2.5 max-w-lg mx-auto px-2">
              {sceneCards.map((scene, idx) => {
                const Icon = scene.icon;
                const isActive = currentConversation?.scene === scene.id;
                return (
                  <button
                    key={scene.id}
                    onClick={() => {
                      const sceneConversations = conversations
                        .filter(c => c.scene === scene.id)
                        .sort((a, b) => b.updatedAt - a.updatedAt);
                      if (sceneConversations.length > 0) {
                        switchConversation(sceneConversations[0].id);
                      } else {
                        useAppStore.getState().setCurrentScene(scene.id);
                      }
                    }}
                    className={`chat-scene-card p-3 rounded-xl text-center transition-all duration-300 ${
                      isActive
                        ? 'ring-2 ring-tencent-blue bg-tencent-blue/5'
                        : 'bg-white/60 hover:bg-white/80 border border-gray-100/50'
                    }`}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                    aria-label={`${scene.title} - ${scene.description}`}
                    aria-pressed={isActive}
                  >
                    <div className={`w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-br ${scene.gradient} flex items-center justify-center chat-scene-icon-pop`}>
                      <Icon className="w-4 h-4 text-white" aria-hidden="true" />
                    </div>
                    <p className="text-xs font-semibold text-gray-800 mb-0.5">{scene.title}</p>
                    <p className="text-[10px] text-gray-500 leading-tight">{scene.description}</p>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-text-tertiary mt-3">支持拖拽上传简历、项目文件、图片等附件</p>
          </div>
        )}

        {messages.filter((msg, idx, self) => idx === self.findIndex(m => m.id === msg.id)).map((msg, idx) => {
          const isAssistant = msg.role !== 'user';
          const isLastAssistantMsg = isAssistant && 
            messages.slice(idx + 1).every(m => m.role === 'user' || m.id === msg.id);
          
          return (
            <Fragment key={msg.id}>
              <div
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} chat-message-enter`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 chat-avatar-pop ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-tencent-blue to-tencent-blue-dark'
                        : 'bg-gradient-to-br from-tencent-blue-light to-tencent-blue'
                    }`}
                    aria-hidden="true"
                  >
                    {msg.role === 'user' ? (
                      <User className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <div className="w-5 h-5">
                        <GooseMascot mood="default" size="xs" className="text-white" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl chat-bubble-enter ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-tencent-blue to-tencent-blue-dark text-white rounded-tr-sm shadow-lg shadow-tencent-blue/20'
                        : 'bg-gradient-to-br from-white to-gray-50/80 dark:from-[#1E2230] dark:to-[#181C28] text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-100/80 dark:border-[#2A2D37]/80 shadow-sm'
                    }`}
                    role="article"
                    aria-label={`${msg.role === 'user' ? '你的消息' : 'AI回复'}：${new Date(msg.timestamp).toLocaleTimeString()}`}
                  >
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className={`flex flex-wrap gap-1 mb-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.attachments.map((att, idx) => {
                          const Icon = getFileIcon(att.type);
                          const isImage = att.type.startsWith('image/');
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 px-2 py-1 rounded-lg text-xs ${
                                msg.role === 'user'
                                  ? 'bg-white/20 text-white'
                                  : 'bg-gray-100 dark:bg-[#242830] text-gray-600 dark:text-gray-400'
                              } ${isImage ? 'p-0 overflow-hidden rounded-xl' : ''}`}
                            >
                              {isImage && att.preview ? (
                                <img src={att.preview} alt={att.name} className="max-w-[120px] max-h-[80px] object-contain rounded-xl" />
                              ) : (
                                <>
                                  <Icon className="w-3 h-3" />
                                  <span className="max-w-[100px] truncate">{att.name}</span>
                                  <span className="opacity-60">{formatFileSize(att.size)}</span>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {msg.reasoning_content && (
                      <details className="mb-2">
                        <summary className="flex items-center gap-2 cursor-pointer text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
                          <Brain className="w-4 h-4" />
                          <span>思考过程</span>
                        </summary>
                        <div className="mt-2 pl-4 border-l-2 border-purple-200 dark:border-purple-500/30 text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap leading-relaxed bg-purple-50/50 dark:bg-purple-500/5 rounded p-2">
                          {msg.reasoning_content}
                        </div>
                      </details>
                    )}
                    <MarkdownRenderer content={msg.content} />
                    <span className={`text-xs mt-1 block ${msg.role === 'user' ? 'text-blue-100/70' : 'text-gray-400 dark:text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
              {isLastAssistantMsg && (
                <QuickQuestions />
              )}
            </Fragment>
          );
        })}

        {isTyping && (
          <div className="flex justify-start chat-message-enter" role="status" aria-live="polite" aria-label="AI正在思考回复">
            <div className="flex items-start gap-2 max-w-[80%]">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-tencent-blue-light to-tencent-blue flex items-center justify-center flex-shrink-0 chat-avatar-pop">
                <div className="w-5 h-5">
                  <GooseMascot mood="thinking" size="xs" className="text-white animate-goose-think" />
                </div>
              </div>
              <div className="px-3.5 py-2.5 bg-white dark:bg-[#1E2230] rounded-2xl rounded-tl-sm min-w-[120px] border border-gray-100/80 dark:border-[#2A2D37]/80 shadow-sm chat-loading-pulse">
                {isReasoning ? (
                  <div>
                    <details open className="mb-2">
                      <summary className="flex items-center gap-2 cursor-pointer text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium list-none">
                        <Brain className="w-4 h-4 animate-pulse" aria-hidden="true" />
                        <span>思考中</span>
                        <span className="chat-typing-cursor ml-0.5" aria-hidden="true" />
                      </summary>
                      <div className="mt-2 pl-4 border-l-2 border-purple-200 dark:border-purple-500/30 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto bg-purple-50/50 dark:bg-purple-500/5 rounded p-2">
                        {streamingReasoningContent}
                        <span className="chat-typing-cursor ml-0.5" aria-hidden="true" />
                      </div>
                    </details>
                  </div>
                ) : isStreaming ? (
                  <div>
                    {streamingReasoningContent && (
                      <details className="mb-2">
                        <summary className="flex items-center gap-2 cursor-pointer text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium list-none">
                          <Brain className="w-4 h-4" aria-hidden="true" />
                          <span>思考过程</span>
                        </summary>
                        <div className="mt-2 pl-4 border-l-2 border-purple-200 dark:border-purple-500/30 text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto bg-purple-50/50 dark:bg-purple-500/5 rounded p-2">
                          {streamingReasoningContent}
                        </div>
                      </details>
                    )}
                    <MarkdownRenderer content={streamingContent} />
                    <span className="chat-typing-cursor ml-0.5" aria-hidden="true" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 py-1">
                    <GooseMascot mood="thinking" size="sm" className="text-tencent-blue animate-goose-think" />
                    <span className="text-xs text-text-tertiary">{useAppStore.getState().thinkingPlaceholder || '思考中...'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2 chat-attachment-enter">
          {attachments.map((att, idx) => {
            const Icon = getFileIcon(att.type);
            const isImage = att.type.startsWith('image/');
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-[#1E2230]/80 rounded-xl text-xs group ${isImage ? 'p-1' : ''} border border-gray-100/50 dark:border-[#2A2D37]/50`}
              >
                {isImage && att.preview ? (
                  <img src={att.preview} alt={att.name} className="w-10 h-10 object-cover rounded-lg" />
                ) : (
                  <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                )}
                <span className="max-w-[80px] truncate text-gray-700 dark:text-gray-300">{att.name}</span>
                <button
                  onClick={() => removeAttachment(idx)}
                  className="p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-[#242830] text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100 dark:border-[#2A2D37]/50" role="form" aria-label="消息输入区域">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept={ALLOWED_FILE_TYPES.join(',')}
          multiple
          className="hidden"
          aria-label="选择文件上传"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isTyping}
          className="btn-micro px-2.5 py-2.5 bg-white/80 dark:bg-[#1E2230]/80 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-white dark:hover:bg-[#242830] hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm border border-gray-200/50 dark:border-[#2A2D37]/50 flex-shrink-0 chat-attach-btn"
          title="上传附件"
          aria-label="上传附件"
        >
          <Paperclip className="w-4 h-4" aria-hidden="true" />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入你的问题，或拖拽文件到此处..."
          disabled={isTyping}
          className="input-micro flex-1 px-4 py-2.5 bg-white dark:bg-[#1E2230] rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-tencent-blue/15 dark:focus:ring-tencent-blue-light/20 focus:border-tencent-blue dark:focus:border-tencent-blue-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-gray-200/50 dark:border-[#2A2D37]/50 shadow-sm chat-input-field"
          aria-label="输入消息"
        />
        {isTyping ? (
          <button
            onClick={abortStream}
            className="btn-micro px-3.5 py-2.5 bg-gradient-to-r from-goose-red to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 shadow-md"
            title="停止生成"
            aria-label="停止生成"
          >
            <Square className="w-4 h-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim() && attachments.length === 0}
            className="btn-primary-micro px-3.5 py-2.5 bg-gradient-to-r from-tencent-blue to-tencent-blue-dark text-white rounded-xl hover:from-tencent-blue-dark hover:to-tencent-blue-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-tencent-blue/30 transition-all duration-300 shadow-md chat-send-btn"
            aria-label="发送消息"
          >
            <Send className="w-4 h-4 chat-send-icon" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
