import { ChatMessage } from '@/types';

export type ExportFormat = 'txt' | 'markdown' | 'html';

export interface ExportOptions {
  includeTimestamp?: boolean;
  includeReasoning?: boolean;
}

function formatTimestamp(timestamp: number, includeTimestamp: boolean): string {
  if (!includeTimestamp) return '';
  return `[${new Date(timestamp).toLocaleString()}] `;
}

export function exportAsTXT(
  messages: ChatMessage[],
  conversationTitle: string,
  options: ExportOptions = {}
): string {
  const { includeTimestamp = true, includeReasoning = false } = options;
  
  const lines: string[] = [
    `对话: ${conversationTitle}`,
    `导出时间: ${new Date().toLocaleString()}`,
    `消息数量: ${messages.length}`,
    '='.repeat(50),
    '',
  ];

  messages.forEach((msg) => {
    const role = msg.role === 'user' ? '你' : '未来鹅AI';
    const timestamp = formatTimestamp(msg.timestamp, includeTimestamp);
    
    lines.push(`${timestamp}${role}:`);
    lines.push(msg.content);
    
    if (includeReasoning && msg.reasoning_content) {
      lines.push('');
      lines.push('[思考过程]');
      lines.push(msg.reasoning_content);
      lines.push('');
    }
    
    lines.push('');
    lines.push('-'.repeat(30));
    lines.push('');
  });

  lines.push('');
  lines.push('---');
  lines.push('由「未来鹅」AI陪伴平台生成');
  lines.push('https://future-goose.netlify.app');

  return lines.join('\n');
}

export function exportAsMarkdown(
  messages: ChatMessage[],
  conversationTitle: string,
  options: ExportOptions = {}
): string {
  const { includeTimestamp = true, includeReasoning = false } = options;
  
  const lines: string[] = [
    `# ${conversationTitle}`,
    '',
    `> 导出时间: ${new Date().toLocaleString()}`,
    `> 消息数量: ${messages.length}`,
    '',
    '---',
    '',
  ];

  messages.forEach((msg) => {
    const role = msg.role === 'user' ? '👤 **你**' : '🤖 **未来鹅AI**';
    const timestamp = includeTimestamp ? ` _(${new Date(msg.timestamp).toLocaleString()})_` : '';
    
    lines.push(`### ${role}${timestamp}`);
    lines.push('');
    lines.push(msg.content);
    lines.push('');
    
    if (includeReasoning && msg.reasoning_content) {
      lines.push('<details>');
      lines.push('<summary>💭 思考过程</summary>');
      lines.push('');
      lines.push(msg.reasoning_content);
      lines.push('');
      lines.push('</details>');
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  });

  lines.push('');
  lines.push('_由「未来鹅」AI陪伴平台生成_');

  return lines.join('\n');
}

export function exportAsHTML(
  messages: ChatMessage[],
  conversationTitle: string,
  options: ExportOptions = {}
): string {
  const { includeTimestamp = true, includeReasoning = false } = options;
  
  const messagesHTML = messages.map((msg) => {
    const role = msg.role === 'user' ? 'user' : 'assistant';
    const roleLabel = msg.role === 'user' ? '你' : '未来鹅AI';
    const timestamp = includeTimestamp
      ? `<span class="timestamp">${new Date(msg.timestamp).toLocaleString()}</span>`
      : '';
    
    const reasoningHTML =
      includeReasoning && msg.reasoning_content
        ? `<details class="reasoning">
            <summary>💭 思考过程</summary>
            <div class="reasoning-content">${msg.reasoning_content.replace(/\n/g, '<br>')}</div>
          </details>`
        : '';

    return `
      <div class="message ${role}">
        <div class="message-header">
          <strong class="role-label">${roleLabel}</strong>
          ${timestamp}
        </div>
        <div class="message-content">${msg.content.replace(/\n/g, '<br>')}</div>
        ${reasoningHTML}
      </div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${conversationTitle} - 未来鹅</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Noto Sans SC', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 40px 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #0052D9 0%, #3B82F6 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 { font-size: 24px; margin-bottom: 10px; }
    .header .meta { opacity: 0.9; font-size: 14px; }
    .messages { padding: 30px; }
    .message {
      margin-bottom: 24px;
      padding: 20px;
      border-radius: 12px;
      background: #F5F7FA;
    }
    .message.user {
      background: #EBF5FF;
      border-left: 4px solid #0052D9;
    }
    .message.assistant {
      background: #F8F9FA;
      border-left: 4px solid #667eea;
    }
    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .role-label { color: #0052D9; }
    .timestamp { color: #999; font-size: 12px; }
    .message-content {
      line-height: 1.8;
      color: #333;
      white-space: pre-wrap;
    }
    details.reasoning {
      margin-top: 12px;
      padding: 12px;
      background: #F3E8FF;
      border-radius: 8px;
      border-left: 3px solid #A855F7;
    }
    details.reasoning summary {
      color: #7C3AED;
      cursor: pointer;
      font-weight: 500;
    }
    .reasoning-content {
      margin-top: 8px;
      color: #6B7280;
      font-size: 14px;
      line-height: 1.6;
    }
    .footer {
      padding: 20px 30px;
      background: #F8F9FA;
      text-align: center;
      color: #999;
      font-size: 14px;
      border-top: 1px solid #E5E7EB;
    }
    .footer a { color: #0052D9; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${conversationTitle}</h1>
      <div class="meta">
        导出时间: ${new Date().toLocaleString()} | 消息数量: ${messages.length}
      </div>
    </div>
    <div class="messages">
      ${messagesHTML}
    </div>
    <div class="footer">
      由「未来鹅」AI陪伴平台生成 | <a href="https://future-goose.netlify.app">future-goose.netlify.app</a>
    </div>
  </div>
</body>
</html>`;
}

export function exportConversation(
  messages: ChatMessage[],
  conversationTitle: string,
  format: ExportFormat,
  options: ExportOptions = {}
): string {
  switch (format) {
    case 'txt':
      return exportAsTXT(messages, conversationTitle, options);
    case 'markdown':
      return exportAsMarkdown(messages, conversationTitle, options);
    case 'html':
      return exportAsHTML(messages, conversationTitle, options);
    default:
      return exportAsTXT(messages, conversationTitle, options);
  }
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => false
    );
  }
  
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const success = document.execCommand('copy');
    textArea.remove();
    return Promise.resolve(success);
  } catch {
    textArea.remove();
    return Promise.resolve(false);
  }
}
