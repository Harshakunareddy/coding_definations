# Task-Supra Codebase — Revision Notes

> Simple English summary of every file. Good for quick revision before interviews or code review.

---

## What is this project?

**Supra Hospital AI Assistant** — a chatbot for doctors/clinicians at Supra Multi-Specialty Hospital, Hyderabad.

A clinician types a question like *"What painkiller should I give this patient?"*  
The system finds the relevant hospital policy, checks safety rules, asks an AI model, and returns a safe, cited answer.

---

## How a query flows through the system

```
Clinician types a question
        ↓
   server.js  (receives the HTTP request)
        ↓
   pipeline.js  (orchestrates all steps)
     ├── retrieval.js  (finds relevant hospital documents)
     ├── safety.js     (checks drug safety rules)
     ├── prompt.js     (builds instructions for the AI)
     └── llm.js        (calls the AI model and gets the answer)
        ↓
   Final answer sent back to the browser
```

---

## File-by-File Breakdown

---

### `server.js` — The Front Door

**What it does:** Starts a web server using Express. Loads data at startup. Handles all HTTP requests from the browser.

#### Constants

| Constant | What it does |
|----------|--------------|
| `MAX_QUERY_LENGTH` | Max characters allowed in a query (1000). Longer queries are rejected to prevent abuse |
| `GREETING` | A regex that matches simple greetings like `hi`, `hello`, `hey`, `good morning`. These get a canned reply — no AI call needed |

#### Helper

| Function | Type | What it does |
|----------|------|--------------|
| `readJson(path)` | helper | Synchronously reads and parses a JSON file. Used at startup to load `knowledge.json` and `safety_rules.json` |

#### Startup (runs once when the server starts)
1. Load `data/knowledge.json` — the hospital's policy documents
2. Load `data/safety_rules.json` — drug safety rules
3. Call `buildIndex(corpus)` — pre-build the BM25 index so every query is fast
4. Start Express on `PORT` (default 3000)
5. Call `resolveModel()` — probe the AI provider, log which model is ready

#### API Routes

| Route | What it does |
|-------|--------------|
| `GET /api/bootstrap` | Called once when the page loads. Warms up the AI model and returns 4 example test queries for the UI |
| `POST /api/ask` | Main route. Takes `{ query }` in the request body. Validates it, handles greetings, then runs the full pipeline and returns the governed answer |

#### What `POST /api/ask` does step by step:
1. Check query is a non-empty string → reject with 400 if not
2. Check query length ≤ 1000 chars → reject with 400 if too long
3. If it's a greeting → return a canned onboarding message immediately
4. Run `answer({ query, corpus, index, ruleset })` from `pipeline.js`
5. Return `{ governed: { answer, mode, sources, safety, ... } }` as JSON

---

### `src/retrieval.js` — The Search Engine

**What it does:** Finds which hospital policy documents are most relevant to the query using BM25 scoring.

#### Constants

| Constant | What it does |
|----------|--------------|
| `STOPWORDS` | A `Set` of ~50 common English words (`the`, `is`, `at`, `how`...) removed before indexing — they carry no useful meaning for search |
| `SYNONYMS` | A map of medical abbreviations/shorthand to their expanded forms. e.g. `dvt` → `["deep", "vein", "thrombosis"]`. When you search `dvt`, documents that only say the full form still match |
| `K1 = 1.5` | BM25 tuning param — controls term-frequency saturation. Higher = more weight for repeated terms, but still with diminishing returns |
| `B = 0.75` | BM25 tuning param — controls length normalisation. `1.0` = full penalty for long docs, `0` = no penalty |

#### All Functions

| Function | Type | What it does |
|----------|------|--------------|
| `knownPatients(corpus)` | exported | Returns a deduplicated list of all patient names that appear across the corpus docs |
| `tokenize(text)` | exported | Lowercases text, strips punctuation, splits on spaces, strips leading/trailing hyphens, removes stopwords and single-character tokens. Output is a clean token array ready for BM25 |
| `expand(tokens)` | helper | Loops through tokens. For each one that has an entry in `SYNONYMS`, appends the synonyms to the list. Returns original tokens + all synonyms combined |
| `buildIndex(corpus)` | exported | Processes every document and builds the BM25 data structures: a TF map per doc, a DF map across all docs, and the average doc length. Title is repeated 3× and tags 2× so they score higher |
| `search(index, query)` | exported | The main search function. Tokenizes + expands the query, scores every doc using BM25, applies boosts/guards, sorts by score, returns ranked results |

#### How `tokenize()` works:
```
"DVT Prophylaxis!" 
  → lowercase    → "dvt prophylaxis!"
  → strip punct  → "dvt prophylaxis"
  → split        → ["dvt", "prophylaxis"]
  → filter stops → ["dvt", "prophylaxis"]  (both kept, neither is a stopword)
```

#### How `buildIndex()` works:
- For each doc, it creates a **TF map** — counts how many times each token appears
- Then builds a **DF map** — counts how many docs contain each token (used for IDF in scoring)
- Also calculates **avgLength** — average token count across all docs (used for length normalisation)
- Returns `{ docs, df, avgLength, N }` — everything `search()` needs

#### How `search()` works step by step:
1. Tokenize the query → `["dvt", "prophylaxis"]`
2. Expand with synonyms → `["dvt", "prophylaxis", "deep", "vein", ...]`
3. Detect patient names in the query (e.g. `"Rajan"`)
4. For each doc: compute BM25 score by summing IDF × TF-saturation for each query token
5. **Privacy guard:** if a doc belongs to a specific patient and that patient is NOT named in the query → score = 0 (hidden)
6. **Patient match boost:** if the queried patient matches the doc's patient → +12 score
7. **Critical boost:** docs marked `severity: critical` that matched at least one term → score × 1.35
8. Sort by score descending
9. **Linked-doc promotion:** if a high-scoring doc (score > 3) links to another doc, the linked doc gets 85% of the parent's score
10. Re-sort and return

---

### `src/safety.js` — The Safety Checker

**What it does:** Enforces hospital drug safety rules. Checks if the AI's answer recommends a blocked drug.

#### Constants

| Constant | What it does |
|----------|-------------|
| `NEGATION_CUES` | List of words that mean a drug is being *avoided* — e.g. `"avoid"`, `"do not"`, `"contraindicated"`. If these appear near a drug name, it is NOT a violation |
| `CLASS_LABELS` | Drug class names like `"nsaid"`, `"sulfonylurea"`. These need a prescribing verb nearby before they count as a violation (class name alone might just be explaining why to avoid something) |
| `PRESCRIBING_CUES` | Words that mean the AI is *recommending* a drug — e.g. `"give"`, `"prescribe"`, `"recommend"`, `"start"` |
| `CLAUSE_BREAK` | A regex that finds sentence/clause endings (`.`, `!`, `?`, `;`, newlines). Used to limit how far back we look for negation — so a warning in one sentence doesn't accidentally excuse a drug in the next |
| `MAX_CLAUSE_LOOKBACK` | Max 260 characters to look back within the same clause when checking for negation cues |

#### All Functions

| Function | Type | What it does |
|----------|------|-------------|
| `expandBlocks(blocks, drugClasses)` | helper | Takes a list of block entries (could be a class name like `"nsaid"` or a specific drug like `"ibuprofen"`). Returns a flat list of actual drug name strings. e.g. `"nsaid"` → `["ibuprofen", "diclofenac", "aspirin"]` |
| `matchesAny(text, terms)` | helper | Returns `true` if the text contains **at least one** of the given terms. Case-insensitive |
| `normaliseListMarkers(text)` | helper | Converts numbered lists (`1.`, `2.`) into bullet dashes (`-`). This stops `CLAUSE_BREAK` from wrongly treating `"1."` as a sentence ending |
| `clauseBounds(lowerText, matchIndex)` | helper | Finds where the current clause/sentence starts and ends around a given position. Prevents negation from a previous sentence leaking into the current one |
| `isNegatedMention(lowerText, matchIndex, matchLength)` | helper | Returns `true` if the drug at this position is being talked about in a *"don't use this"* way — checks `NEGATION_CUES` in the same clause before and after the drug name |
| `hasPrescribingIntent(lowerText, matchIndex)` | helper | Returns `true` if there's a prescribing verb (from `PRESCRIBING_CUES`) within 55 characters **before** the drug name — meaning the AI is actively recommending it |
| `evaluateRules(query, docs, ruleset)` | exported | Checks if any safety rules are triggered by the query. Returns `fired` rules and `blockedDrugs` list |
| `inspectOutput(answer, blockedDrugs)` | exported | Scans the AI's final answer for blocked drug names. Returns `{ passed: true }` or `{ passed: false, violations: [...] }` |
| `buildDeterministicAnswer(docs, fired)` | exported | Builds a safe, rule-based answer without the AI. Used as fallback when AI is unavailable or its answer was suppressed |

#### How `evaluateRules()` works:
Rules can trigger in 3 ways:
- **patient** trigger — fires if that patient is mentioned in the query or their record was retrieved
- **any_term** trigger — fires if *any* word from a list appears in the query (e.g. `["nsaid", "ibuprofen"]`)
- **all_of** trigger — fires only if *all* groups match (e.g. `["post-op"] AND ["knee"]`)

Each rule is either:
- `hard_block` — the AI **must not** recommend that drug
- `advisory` — the AI **should mention** this note

#### How `inspectOutput()` works (the Output Guard):

For each blocked drug, it builds a word-boundary regex and scans the answer. For every match it finds:

1. If the drug is a **class label** (like `nsaid`) → check `hasPrescribingIntent()`. If no prescribing verb nearby → skip, it's just an explanation
2. Check `isNegatedMention()` → if the drug is being warned against → skip, it's fine
3. If neither skip applies → it's a **violation**. Record it and stop checking that drug

If any violation found → answer is **suppressed** and replaced with the safe deterministic answer.

#### How `buildDeterministicAnswer()` works:
Builds a plain text answer without the AI:
1. If a hard block rule fired and has a safe alternative → show it first: *"Do this instead: ..."*
2. Show the relevant policy documents with their content and attribution (who decided it, when)
3. If nothing matched at all → tell the clinician to escalate to the HOD or Pharmacy Committee
4. Append any advisory notes at the end

---

### `src/pipeline.js` — The Orchestrator

**What it does:** Ties all the pieces together. Runs the full 8-step pipeline for every clinician query and returns the final governed answer.

#### Constants

| Constant | What it does |
|----------|--------------|
| `TOP_K = 3` | Maximum number of top search results passed to the AI as context |
| `ABSOLUTE_FLOOR = 4.0` | A doc must score at least 4 to be included — no matter what |
| `RELATIVE_FLOOR = 0.50` | A doc must also score at least 50% of the top result's score |
| `COVERAGE_FLOOR = 6.0` | If even the best-scoring doc is below 6, we treat the query as having no matching protocol |

#### Function

| Function | Type | What it does |
|----------|------|--------------|
| `answer({ query, corpus, index, ruleset })` | exported | The only function in this file. Runs all 8 steps and returns the full governed response object |

#### The 8 Steps inside `answer()`:

| Step | What happens |
|------|--------------|
| 1 — Retrieval | Calls `search()` from `retrieval.js`. Gets all docs ranked by BM25 score |
| 2 — Filter | Keeps only docs that score ≥ `max(ABSOLUTE_FLOOR, topScore × RELATIVE_FLOOR)`. Also empties results if top score < `COVERAGE_FLOOR` |
| 3 — Safety rules | Calls `evaluateRules()` from `safety.js`. Finds which rules fire and what drugs are blocked |
| 4 — Force-include | If a fired rule references a source doc that wasn't in topHits, finds it in results and adds it. Ensures the rule's backing document is always in context |
| 5 — LLM call | Calls `complete()` from `llm.js` with the system prompt (safety constraints) and user prompt (docs + question) |
| 6 — Pick answer | Prefer the AI's text. If AI failed/unavailable, use `buildDeterministicAnswer()` from `safety.js` |
| 7 — Output guard | Calls `inspectOutput()` from `safety.js`. If any blocked drug slipped into the answer → suppress and prepend the warning banner |
| 8 — Return | Assembles and returns a big object: `answer`, `mode`, `model`, `latency_ms`, `sources`, `safety`, `citations`, `hallucinated_citations`, `patients_detected` |

#### Mode values in the response:
- `"llm_governed"` — AI answered successfully
- `"deterministic_fallback"` — AI failed, used rule-based answer
- `"guard_suppressed"` — AI answered but was caught recommending a blocked drug
- `"greeting"` — the query was a greeting (handled in `server.js` before pipeline runs)

#### Hallucination check:
Any `SUPRA-KB-XXX` ID in the final answer that doesn't exist in the corpus is collected in `hallucinated_citations`. This flags when the AI invented a fake document reference.

---

### `src/llm.js` — The AI Caller

**What it does:** Handles all communication with the AI model provider. Supports 5 different providers. Picks whichever one has a valid API key configured.

#### Constants / Config

| Constant | What it does |
|----------|--------------|
| `PROVIDERS` | Array of 5 provider configs (xAI Grok, Groq, Gemini, OpenRouter, OpenAI). Each has: env var name, key prefix, base URL, and a priority list of models to try |
| `PLACEHOLDERS` | List of fake placeholder key values (`"your-key-here"` etc.). Keys matching these are ignored even if set |
| `MODELS_TIMEOUT_MS = 8000` | Max 8 seconds to wait when fetching the provider's model list |
| `COMPLETION_TIMEOUT_MS = 30000` | Max 30 seconds to wait for a chat completion response |

#### Module-level state (lives in memory, reused across requests)

| Variable | What it stores |
|----------|----------------|
| `resolved` | Caches the chosen `{ provider, model }` so we don't re-probe on every request |
| `lastError` | Stores the last error message from a failed API call (shown in `status()`) |
| `health` | Stores `{ reachable, detail }` — whether the provider is reachable and why not if not |

#### All Functions

| Function | Type | What it does |
|----------|------|--------------|
| `isRealKey(v)` | helper | Returns `true` if the value is a real API key — must be longer than 20 chars and not a known placeholder |
| `activeProvider()` | helper | Loops through `PROVIDERS` in order. Returns the first one whose API key is set, real, and starts with the expected prefix (e.g. `"xai-"`, `"gsk_"`, `"AIza"`) |
| `noteFailure(detail)` | helper | Sets `health.reachable = false` and stores the reason. Called when an API call fails |
| `noteSuccess()` | helper | Sets `health.reachable = true`. Called after a successful API call |
| `clientSafeError(status)` | helper | Converts an HTTP error status code into a user-friendly string (e.g. 429 → `"model provider rate limit reached"`) |
| `hasKey()` | exported | Returns `true` if at least one provider has a valid API key. Used to show whether LLM mode is available |
| `status()` | exported | Returns a snapshot of current LLM state: `{ configured, reachable, provider, model, detail, last_error }`. Used by the UI and startup log |
| `resolveModel()` | exported | Picks and caches the model to use. Checks `.env` for a pinned model first; otherwise calls the provider's `/models` endpoint and picks the highest-priority match |
| `complete({ system, user })` | exported | Sends a chat completion request. Returns `{ ok, text, model, error }`. Handles timeouts, HTTP errors, and non-JSON responses gracefully |

#### How model selection in `resolveModel()` works:
1. If `LLM_MODEL` is set in `.env` → use it directly, skip network call
2. Call `GET /models` on the active provider
3. Pick the first model from our priority list that the provider actually has available
4. If no exact match → try a fuzzy match (model ID contains our model name)
5. If still nothing → fall back to the first model in our priority list
6. Cache the result in `resolved` — same model used for all subsequent requests until provider changes

#### What `complete()` returns:
```js
{ ok: true,  text: "...", model: "grok-4-fast", provider: "xAI Grok", usage: {...} }  // success
{ ok: false, text: "",    model: "grok-4-fast", error: "model provider rate limit reached" } // failure
```

---

### `src/prompt.js` — The Prompt Builder

**What it does:** Builds the two text prompts that are sent to the AI model on every request — the system prompt (rules) and the user prompt (context + question).

#### All Functions

| Function | Type | What it does |
|----------|------|--------------|
| `buildSystemPrompt(fired)` | exported | Builds the system prompt. Sets the AI's identity, injects fired safety rules as hard constraints or advisories, and gives 7 strict answering rules + a format template |
| `buildUserPrompt(query, permitted, noCoverage)` | exported | Builds the user message. Either tells the AI no docs matched (→ escalate), or formats the retrieved docs with metadata and ends with the clinician's question |

#### What `buildSystemPrompt(fired)` puts in the prompt:

1. **Identity** — *"You are the Supra Assistant, the clinical decision-support system of Supra Multi-Specialty Hospital, Hyderabad"*
2. **Hard block constraints** — numbered list of rules like: *"[RULE-001 | source SUPRA-KB-005] Do not prescribe NSAIDs post-op. REQUIRED ALTERNATIVE: paracetamol. YOU MUST NOT RECOMMEND: ibuprofen, diclofenac..."*
3. **Advisory policies** — bullet list of soft guidance to include in the answer
4. **7 answering rules:**
   - Only use the supplied Supra documents
   - Cite every claim with `[SUPRA-KB-XXX]`
   - If Supra policy differs from general practice, say so
   - If not covered, say so and name who to escalate to
   - Name the deciding authority and date when available
   - Never invent doses, drug names, or doc IDs
   - Be concise — a clinician is reading between patients
5. **Output format** — 4 sections: `Answer`, `Supra specifics`, `Why this differs`, `Also note`

#### What `buildUserPrompt(query, permitted, noCoverage)` puts in the prompt:

**If no coverage** (`noCoverage = true` or `permitted` is empty):
```
SUPRA HOSPITAL DOCUMENTS: none. No ratified Supra protocol matched this question.
CLINICIAN'S QUESTION: <query>
(+ instruction to say "no protocol" and escalate in 2 sentences)
```

**If documents were found:**
```
SUPRA HOSPITAL DOCUMENTS (the only source you may use):

[SUPRA-KB-001] DVT Prophylaxis Protocol
(department: orthopaedics | type: protocol | decided by: Dr. Vikram | effective: Jan 2025)
<full document content>

---

[SUPRA-KB-002] ...

---

CLINICIAN'S QUESTION: <query>
```

---

## Data Flow Summary

| File | Role in one line |
|------|-----------------|
| `server.js` | Starts the server, loads data, routes HTTP requests |
| `retrieval.js` | Finds relevant hospital documents using BM25 search |
| `safety.js` | Checks drug safety rules and guards the AI's output |
| `pipeline.js` | Runs all 8 steps and assembles the final governed answer |
| `llm.js` | Talks to the AI provider and gets the answer text |
| `prompt.js` | Builds the instructions fed to the AI |

---

## Key Terms Quick Reference

| Term | Meaning |
|------|---------|
| **BM25** | Ranking algorithm to score how relevant a document is to a query |
| **TF** | Term Frequency — how often a word appears in a document |
| **IDF** | Inverse Document Frequency — rare words score higher |
| **Tokenize** | Split text into clean lowercase words |
| **Synonym expansion** | When you search "dvt", also search "deep vein thrombosis" |
| **Hard block** | Safety rule that absolutely forbids a drug |
| **Advisory** | Safety rule that adds a note/warning to the answer |
| **Output guard** | Final scan of the AI's answer for blocked drug names |
| **Deterministic answer** | Rule-based answer built without any AI (safe fallback) |
| **Hallucination** | When the AI cites a document ID that doesn't exist |
| **RAG** | Retrieval-Augmented Generation — find docs first, then ask the AI |
