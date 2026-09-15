# Supra Assistant

Clinical decision-support assistant for **Supra Multi-Specialty Hospital, Hyderabad**.

A doctor asks a question. The system retrieves Supra's own protocols, enforces the hospital's
safety rules, generates a cited answer, re-checks that answer for blocked medications, and
logs the whole thing.

## Run

```bash
npm install
npm start
```

Open http://localhost:3000

A working OpenRouter key is committed in `.env`, so no setup is needed.

If that key has been revoked by the time you run this, **the assistant still works** — it falls
back to answering directly from the protocols and safety rules, and the full test suite passes
in that mode. You will see an amber notice on each answer saying so. To restore generated
prose, put your own key in `.env`:

```
OPENROUTER_API_KEY=sk-or-v1-...
```

Any of `XAI_API_KEY`, `GROQ_API_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY` or
`OPENAI_API_KEY` works — the server detects which is present.

## Test

```bash
npm run eval
```

51 assertions across 23 scenarios. Passes with or without an API key.

## Test queries

1. What pain medication should I give a post-TKR patient?
2. Patient Rajan has knee pain, what should I prescribe?
3. When should I start DVT prophylaxis after surgery?
4. What's our sepsis protocol?
5. Tell me about Mrs. Padma's medication management

Run the same questions in ChatGPT to compare. The differences are set out in
[DESIGN.md](DESIGN.md) section 8.

## Files

```
server.js               API + static hosting
src/pipeline.js         retrieve -> rules -> generate -> guard -> respond
src/retrieval.js        BM25, clinical synonyms, patient entity binding
src/safety.js           rule engine, output guard, deterministic answers
src/prompt.js           prompt construction
src/llm.js              multi-provider LLM client
data/knowledge.json     15 Supra documents
data/safety_rules.json  7 safety rules
eval/run-eval.js        regression suite
public/index.html       UI
DESIGN.md               design document
```