const PROVIDERS = [
  {
    name: 'xAI Grok',
    env: 'XAI_API_KEY',
    prefix: 'xai-',
    base: 'https://api.x.ai/v1',
    models: ['grok-4-fast-non-reasoning', 'grok-4-fast', 'grok-3-mini', 'grok-3', 'grok-2-latest']
  },
  {
    name: 'Groq',
    env: 'GROQ_API_KEY',
    prefix: 'gsk_',
    base: 'https://api.groq.com/openai/v1',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'openai/gpt-oss-120b']
  },
  {
    name: 'Google Gemini',
    env: 'GEMINI_API_KEY',
    prefix: 'AIza',
    base: 'https://generativelanguage.googleapis.com/v1beta/openai',
    models: ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']
  },
  {
    name: 'OpenRouter',
    env: 'OPENROUTER_API_KEY',
    prefix: 'sk-or-',
    base: 'https://openrouter.ai/api/v1',
    headers: { 'HTTP-Referer': 'http://localhost:3000', 'X-Title': 'Supra Assistant' },
    models: [
      'openai/gpt-4o-mini',
      'openai/gpt-4o',
      'meta-llama/llama-3.3-70b-instruct',
      'meta-llama/llama-3.3-70b-instruct:free'
    ]
  },
  {
    name: 'OpenAI',
    env: 'OPENAI_API_KEY',
    prefix: 'sk-',
    base: 'https://api.openai.com/v1',
    models: ['gpt-4o-mini', 'gpt-4o']
  }
];

const PLACEHOLDERS = ['xai-your-key-here', 'your-key-here', 'sk-your-key-here'];

const MODELS_TIMEOUT_MS = 8000;
const COMPLETION_TIMEOUT_MS = 30000;

function isRealKey(v) {
  const k = (v || '').trim();
  return k.length > 20 && !PLACEHOLDERS.includes(k);
}

function activeProvider() {
  for (const p of PROVIDERS) {
    const key = process.env[p.env];
    if (isRealKey(key) && key.trim().startsWith(p.prefix)) {
      return { ...p, key: key.trim() };
    }
  }
  return null;
}

let resolved = null;
let lastError = null;
let health = { reachable: null, detail: null };

export function hasKey() {
  return activeProvider() !== null;
}

export function status() {
  const p = activeProvider();
  return {
    configured: Boolean(p),
    reachable: p ? health.reachable : false,
    provider: p ? p.name : null,
    model: resolved?.model || process.env.LLM_MODEL || null,
    detail: p ? health.detail : 'no key in .env',
    last_error: lastError
  };
}

function noteFailure(detail) {
  health = { reachable: false, detail };
}

function noteSuccess() {
  health = { reachable: true, detail: null };
}

export async function resolveModel() {
  const p = activeProvider();
  if (!p) return null;

  if (resolved && resolved.provider === p.name) return resolved.model;

  const pinned = process.env.LLM_MODEL;
  if (pinned) {
    resolved = { provider: p.name, model: pinned };
    return pinned;
  }

  try {
    const res = await fetch(`${p.base}/models`, {
      headers: { Authorization: `Bearer ${p.key}` },
      signal: AbortSignal.timeout(MODELS_TIMEOUT_MS)
    });
    if (!res.ok) {
      const err = new Error(`models list ${res.status}`);
      err.status = res.status;
      throw err;
    }
    const body = await res.json();
    const available = (body.data || []).map((m) => m.id);

    const model =
      p.models.find((m) => available.includes(m)) ||
      available.find((id) => p.models.some((m) => id.includes(m.split('/').pop()))) ||
      p.models[0];
    resolved = { provider: p.name, model };
    lastError = null;
  } catch (err) {
    lastError = err.message;
    console.error(`[llm] provider probe failed: ${p.name} ${err.message}`);
    resolved = { provider: p.name, model: p.models[0] };
    noteFailure(
      err.status === 401 || err.status === 403
        ? 'key rejected by provider'
        : 'provider unreachable'
    );
  }
  return resolved.model;
}

function clientSafeError(status) {
  if (status === 401 || status === 403) return 'model provider rejected the request';
  if (status === 429) return 'model provider rate limit reached';
  if (status >= 500) return 'model provider unavailable';
  return 'model provider error';
}

export async function complete({ system, user, temperature = 0.2, maxTokens = 900 }) {
  const p = activeProvider();
  if (!p) {
    return { ok: false, text: '', error: 'no model configured' };
  }

  const model = await resolveModel();

  try {
    const res = await fetch(`${p.base}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${p.key}`,
        'Content-Type': 'application/json',
        ...(p.headers || {})
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      }),
      signal: AbortSignal.timeout(COMPLETION_TIMEOUT_MS)
    });

    if (!res.ok) {
      const detail = await res.text();
      let msg = detail.slice(0, 220);
      try {
        const j = JSON.parse(detail);
        msg = j.error?.message || j.error || j.code || msg;
      } catch { /* keep raw text if it isn't JSON */ }
      lastError = `${p.name} ${res.status}: ${msg}`;
      console.error(`[llm] ${lastError}`);
      noteFailure(clientSafeError(res.status));
      return { ok: false, text: '', model, error: clientSafeError(res.status) };
    }

    const body = await res.json();
    const text = body.choices?.[0]?.message?.content?.trim() || '';
    lastError = null;
    noteSuccess();
    return { ok: true, text, model, provider: p.name, usage: body.usage };
  } catch (err) {
    const timedOut = err.name === 'TimeoutError' || err.name === 'AbortError';
    lastError = `${p.name}: ${err.message}`;
    console.error(`[llm] ${lastError}`);
    return {
      ok: false,
      text: '',
      model,
      error: timedOut ? 'model provider timed out' : 'model provider unreachable'
    };
  }
}
