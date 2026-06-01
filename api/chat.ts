// Vercel Serverless Function - 智谱 AI API 代理
// 作用：隐藏 API Key，防止泄露；统一处理流式响应；添加基础限流

// 简单的内存限流（按 IP）
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_MAX = 30; // 每分钟最多 30 次请求
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 分钟窗口

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
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

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const clientIp =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({ error: '请求过于频繁，请稍后再试' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(rateLimit.retryAfter || 60),
      },
    });
  }

  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) {
    console.error('ZHIPU_API_KEY is not configured');
    return new Response(JSON.stringify({ error: '服务器配置错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { messages?: unknown; model?: string; stream?: boolean };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: '请求体格式错误' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages, model = 'glm-4-flash', stream = true } = body;

  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: '请求参数错误：需要 messages 数组' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
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
      return new Response(JSON.stringify(errorData || { error: 'AI 服务请求失败' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (stream && response.body) {
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: '服务器内部错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
