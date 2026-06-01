// Netlify Function - 智谱 AI API 代理
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
    return { allowed: false, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
  }

  record.count++;
  return { allowed: true };
}

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const clientIp =
    event.headers['x-forwarded-for'] ||
    event.headers['x-nf-client-connection-ip'] ||
    'unknown';
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return {
      statusCode: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(rateLimit.retryAfter || 60),
      },
      body: JSON.stringify({ error: '请求过于频繁，请稍后再试' }),
    };
  }

  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) {
    console.error('ZHIPU_API_KEY is not configured');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: '服务器配置错误' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: '请求体格式错误' }),
    };
  }

  const { messages, model = 'glm-4-flash', stream = true } = body;

  if (!messages || !Array.isArray(messages)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: '请求参数错误：需要 messages 数组' }),
    };
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
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData || { error: 'AI 服务请求失败' }),
      };
    }

    if (stream && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const fullData = new Uint8Array(chunks.reduce((acc, c) => acc + c.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        fullData.set(chunk, offset);
        offset += chunk.length;
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
        body: Buffer.from(fullData).toString('utf-8'),
        isBase64Encoded: false,
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: '服务器内部错误' }),
    };
  }
};
