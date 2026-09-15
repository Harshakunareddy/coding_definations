import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildIndex } from './src/retrieval.js';
import { answer } from './src/pipeline.js';
import * as llm from './src/llm.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(__dirname, p), 'utf8'));

const corpus = readJson('data/knowledge.json');
const ruleset = readJson('data/safety_rules.json');

const index = buildIndex(corpus);

const MAX_QUERY_LENGTH = 1000;

const app = express();
app.use(express.json({ limit: '32kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const GREETING = /^\s*(hi|hey|hello|yo|hola|good (morning|afternoon|evening))[\s!.?]*$/i;

app.get('/api/bootstrap', async (req, res) => {
  await llm.resolveModel();
  res.json({
    llm: llm.status(),
    test_queries: [
      'Patient Rajan has knee pain, what should I prescribe?',
      'When should I start DVT prophylaxis after surgery?',
      "What's our sepsis protocol?",
      "Tell me about Mrs. Padma's medication management"
    ]
  });
});

app.post('/api/ask', async (req, res) => {
  const { query } = req.body || {};

  if (typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'query is required' });
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return res.status(400).json({ error: `query must be under ${MAX_QUERY_LENGTH} characters` });
  }

  if (GREETING.test(query)) {
    return res.json({
      governed: {
        answer:
          'Ask me anything covered by Supra Hospital protocol - post-op analgesia, ' +
          'DVT prophylaxis, the sepsis bundle, a specific patient\'s medication plan. ' +
          'Every answer cites the Supra document it came from.',
        mode: 'greeting', model: null, llm_error: null, latency_ms: 0,
        sources: [], citations: [], hallucinated_citations: [], patients_detected: [],
        safety: { rules_fired: [], blocked_drugs: [], output_guard: { passed: true, violations: [] } }
      }
    });
  }

  try {
    const governed = await answer({ query, corpus, index, ruleset });
    res.json({ governed });
  } catch (err) {
    console.error('[ask]', err);
    res.status(500).json({ error: 'the assistant could not complete this request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await llm.resolveModel();
  const s = llm.status();
  console.log(`\n  Supra Hospital AI Assistant`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`  ${corpus.length} knowledge documents | ${ruleset.rules.length} safety rules`);
  if (!s.configured) {
    console.log('  LLM: not configured - add a provider key to .env. Running in deterministic mode.\n');
  } else if (s.reachable === false) {
    console.log(`  LLM: ${s.provider} UNAVAILABLE (${s.detail}). Running in deterministic mode.\n`);
  } else {
    console.log(`  LLM: ${s.provider} (${s.model})\n`);
  }
});
