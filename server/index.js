// 本地开发用的 Express 后端服务器
// 生产环境使用 api/chat.ts (Vercel Serverless Function)

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({
  limit: '10mb',
  // 忽略 JSON 解析错误，避免服务器崩溃
  strict: true
}));

// 全局错误处理中间件（防止 JSON 解析错误导致崩溃）
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON 解析错误:', err.message);
    return res.status(400).json({ error: '请求体格式错误' });
  }
  next(err);
});

// 简单的内存限流（按 IP）
const rateLimitMap = new Map();
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW = 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

app.post('/api/chat', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.ip || 'unknown';
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfter || 60));
    return res.status(429).json({ error: '请求过于频繁，请稍后再试' });
  }

  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) {
    console.error('ZHIPU_API_KEY is not configured');
    return res.status(500).json({ error: '服务器配置错误' });
  }

  const { messages, model = 'glm-4-flash', stream = true } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: '请求参数错误：需要 messages 数组' });
  }

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.8,
        max_tokens: 4096,
        stream,
        thinking: {
          type: 'enabled',
          clear_thinking: false,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Zhipu API error:', response.status, errorData);
      return res.status(response.status).json(errorData || { error: 'AI 服务请求失败' });
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            res.write(chunk);
          }
        } catch (error) {
          console.error('Stream read error:', error);
          res.write(`data: ${JSON.stringify({ error: '流式响应中断' })}\n\n`);
        } finally {
          res.end();
        }
      } else {
        res.end();
      }
    } else {
      const data = await response.json();
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n未来鹅后端代理服务器已启动`);
  console.log(`地址: http://localhost:${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
  console.log(`API 代理: http://localhost:${PORT}/api/chat`);
  console.log(`\n按 Ctrl+C 停止服务器\n`);
});
