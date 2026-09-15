# Task-Supra Codebase — Revision Notes

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

## 🏥 Real Example Walkthrough — Follow One Query End to End

> **Scenario:** Dr. Priya opens the Supra Assistant and types:
> **`"What painkiller should I give Rajan after his knee surgery?"`**

---

### Step 1 — The browser sends the question to `server.js`

The browser does a `POST /api/ask` with 
`{ query: "What painkiller should I give Rajan after his knee surgery?" }`.

`server.js` receives it and does 3 quick checks:
- Is it a string? ✅
- Is it under 1000 characters? ✅
- Is it a greeting like "hi" or "hello"? ❌ No — so it goes forward.

It then calls `answer()` from `pipeline.js`, passing the query + the pre-loaded corpus + the pre-built BM25 index + the safety ruleset.

---

### Step 2 — `pipeline.js` starts the 8-step process

`pipeline.js` is the **orchestrator**. It doesn't do any thinking itself — it just calls the right function at the right time in order.

---

**Step 2.1 — Find relevant documents → calls `search()` in `retrieval.js`**

The query goes into `search()` inside `retrieval.js`. It does 4 things:

---

**① Tokenize — clean the query into bare keywords**

```
"What painkiller should I give Rajan after his knee surgery?"

  → lowercase      : "what painkiller should i give rajan after his knee surgery?"
  → strip punct    : "what painkiller should i give rajan after his knee surgery"
  → split words    : ["what","painkiller","should","i","give","rajan","after","his","knee","surgery"]
  → drop stopwords : ["painkiller", "rajan", "knee", "surgery"]
                      removed: what, should, i, give, after, his  (common words, useless)
```

---

**② Expand — add synonyms to catch more docs**

```
"painkiller" → in SYNONYMS → adds ["pain", "analgesia", "analgesic"]
"surgery"    → in SYNONYMS → adds ["surgical", "operative", "post-op"]
"rajan"      → not in SYNONYMS → kept as-is
"knee"       → not in SYNONYMS → kept as-is

Final search tokens:
["painkiller", "rajan", "knee", "surgery", "pain", "analgesia", "analgesic", "surgical", "operative", "post-op"]
```

> Why expand? SUPRA-KB-001 says "post-TKR" not "surgery" — without expansion it scores lower.

---

**③ Detect patient names**

```
All known patients in knowledge.json : ["Rajan", "Padma"]
"rajan" found in query               → mentionedPatients = ["Rajan"]
```

Any doc belonging to a patient NOT named here → score forced to 0 (hidden from results).

---

**④ BM25 Score — score all 15 docs and apply boosts**

```
SUPRA-KB-001  "Post-TKR Pain Management"
  matched tokens : pain(TF=3), painkiller(TF=2), knee(TF=1), post-op(TF=2), surgery(TF=1)
  raw BM25       : ~9.5
  patient field  : null → no guard, no boost
  severity       : "high" → no critical boost
  FINAL SCORE    : 9.5

SUPRA-KB-002  "Patient Rajan Drug Alert"
  matched tokens : rajan(TF=4), knee(TF=1), pain(TF=1)
  raw BM25       : ~8.2
  patient field  : "Rajan" → IS in query → ✅ not hidden → +12 boost → 8.2 + 12 = 20.2
  severity       : "critical" + matched terms → ×1.35 → 20.2 × 1.35 = ~27.3
  FINAL SCORE    : 27.3  ← highest

SUPRA-KB-004  "DVT Prophylaxis"
  matched tokens : post-op(TF=2), surgery(TF=2), knee(TF=1) via tags
  raw BM25       : ~4.1
  FINAL SCORE    : 4.1

SUPRA-KB-006  "TKR Discharge Rule"
  matched tokens : surgery(TF=1) — weak
  raw BM25       : ~2.1
  FINAL SCORE    : 2.1

All other 11 docs → 0  (no query tokens matched)
```

**Ranked results returned to `pipeline.js`:**
```
1st → SUPRA-KB-002  "Patient Rajan Drug Alert"    score = 27.3  ← critical patient record
2nd → SUPRA-KB-001  "Post-TKR Pain Management"    score = 9.5   ← the pain protocol
3rd → SUPRA-KB-004  "DVT Prophylaxis"             score = 4.1   ← weak match via tags
4th → SUPRA-KB-006  "TKR Discharge Rule"          score = 2.1   ← very weak
rest→ everything else                             score = 0
```

---

**Step 2.2 — Filter weak results**

`pipeline.js` applies floors:
- `ABSOLUTE_FLOOR = 4.0` → drop any doc scoring below 4
- `RELATIVE_FLOOR = 0.50` → drop any doc below 50% of top score (27.3 × 0.5 = 13.65)
- KB-001 scores 9.5 → below 13.65 → **would be dropped**, BUT...
- `COVERAGE_FLOOR = 6.0` → top score is 27.3, way above 6 → coverage is fine

After filtering: **KB-002 and KB-001 pass** (pipeline force-includes KB-001 because it's the pain protocol referenced by safety rules — see Step 2.3).

---

**Step 2.3 — Check safety rules → calls `evaluateRules()` in `safety.js`**

`safety.js` reads the ruleset from `safety_rules.json` and checks if any rules fire for this query.

Rule fires: **NSAID block for Rajan** — because:
- The rule has a `patient` trigger for `"Rajan"`
- `"Rajan"` was detected in the query → **rule fires**

Result:
```
fired = [ { rule: "No NSAIDs for Rajan", type: "hard_block",
            blockedDrugs: ["ibuprofen", "diclofenac", "aspirin"],
            safe_alternative: "Paracetamol" } ]
blockedDrugs = ["ibuprofen", "diclofenac", "aspirin"]
```

**Force-include:** The fired rule references `SUPRA-KB-001` as its source doc. `pipeline.js` checks — KB-001 is already in topHits ✅ no extra action needed.

---

**Step 2.4 — Build prompts → calls `buildSystemPrompt()` + `buildUserPrompt()` in `prompt.js`**

`prompt.js` builds two texts to send to the AI:

**System prompt** (the AI's rules):
```
You are the Supra Assistant, the clinical decision-support system of
Supra Multi-Specialty Hospital, Hyderabad.

HARD BLOCK — [RULE for Rajan]:
Do NOT prescribe NSAIDs for patient Rajan.
REQUIRED ALTERNATIVE: Paracetamol.
YOU MUST NOT RECOMMEND: ibuprofen, diclofenac, aspirin.

[7 answering rules...]
[Output format: Answer / Supra specifics / Why this differs / Also note]
```

**User prompt** (the documents + the question):
```
SUPRA HOSPITAL DOCUMENTS (the only source you may use):

[SUPRA-KB-002] Patient Rajan Drug Alert
(department: Cardiology | type: patient_safety_alert | decided by: Cardiology / Patient Safety Committee | effective: 2022)
ABSOLUTE: No ibuprofen, no aspirin, no diclofenac for patient Rajan.
Cardiac stent 2022, dual antiplatelet therapy...

---

[SUPRA-KB-001] Post-TKR Pain Management
(department: Orthopaedics | type: protocol | decided by: Dr. Vikram | effective: 2025-01)
Supra Ortho uses Paracetamol 650mg QDS as first-line post-TKR...

---

CLINICIAN'S QUESTION: What painkiller should I give Rajan after his knee surgery?
```

---

**Step 2.5 — Call the AI → calls `complete()` in `llm.js`**

`llm.js` checks which provider has a valid API key (e.g. OpenRouter), picks the configured model, and sends both prompts as a chat message.

The AI replies with something like:
```
Answer: Use Paracetamol 650mg QDS for Rajan's post-TKR pain.

Supra specifics: Per SUPRA-KB-001, Paracetamol is first-line post-TKR.
Escalate to Tramadol 50mg if VAS > 6. [SUPRA-KB-001]

Why this differs: NSAIDs are absolutely contraindicated for Rajan due to
cardiac stent (2022) and dual antiplatelet therapy. [SUPRA-KB-002]

Also note: 8 previous NSAID refusals documented for this patient.
```

`llm.js` returns: `{ ok: true, text: "...", model: "grok-4-fast", latency_ms: 1820 }`

---

**Step 2.6 — Output guard → calls `inspectOutput()` in `safety.js`**

Even though the AI was told not to recommend NSAIDs, `safety.js` **double-checks the final answer** word by word:

- Scan for `"ibuprofen"` → found? No ✅
- Scan for `"diclofenac"` → found? No ✅
- Scan for `"aspirin"` → found? No ✅

`inspectOutput()` returns `{ passed: true }` → answer is safe, no suppression needed.

---

**Step 2.7 — Hallucination check**

`pipeline.js` scans the answer for any `SUPRA-KB-XXX` IDs the AI mentioned:
- `[SUPRA-KB-001]` → exists in corpus ✅
- `[SUPRA-KB-002]` → exists in corpus ✅
- `hallucinated_citations = []` → AI didn't invent any fake doc IDs ✅

---

### Step 3 — `server.js` sends the answer back to the browser

`pipeline.js` returns a big object to `server.js`:
```js
{
  answer:   "Use Paracetamol 650mg QDS for Rajan's post-TKR pain...",
  mode:     "llm_governed",        // AI answered successfully
  model:    "grok-4-fast",
  latency_ms: 1820,
  sources:  [ SUPRA-KB-002, SUPRA-KB-001 ],
  safety:   { fired: [Rajan NSAID block], passed: true },
  hallucinated_citations: []
}
```

`server.js` wraps it as `{ governed: { ... } }` and sends it as JSON to the browser.

**Dr. Priya sees the answer in under 2 seconds.** ✅

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

#### `buildIndex()` — step by step with a mini example

Imagine we have **2 documents** going in:

```
Doc A:  title = "DVT Protocol"
        content = "DVT prophylaxis is required post-op"

Doc B:  title = "Pain Protocol"
        content = "Pain management after surgery"
```

**Step 1 — Build the text blob for each doc**

Title is repeated 3× so it scores higher. Tags repeated 2×.

```
Doc A text blob:
  "DVT Protocol  DVT Protocol  DVT Protocol  dvt dvt  DVT prophylaxis is required post-op"
   ^^^title×3^^^                              ^^tags×2^^  ^^^content^^^

Doc B text blob:
  "Pain Protocol  Pain Protocol  Pain Protocol  pain pain  Pain management after surgery"
```

**Step 2 — Tokenize each blob**  
(lowercase → strip punct → split → remove stopwords)

```
Doc A tokens:  ["dvt", "protocol", "dvt", "protocol", "dvt", "protocol",
                "dvt", "dvt", "dvt", "prophylaxis", "required", "post-op"]

Doc B tokens:  ["pain", "protocol", "pain", "protocol", "pain", "protocol",
                "pain", "pain", "pain", "management", "surgery"]
```

**Step 3 — Build TF map for each doc**  
(count occurrences of each token *in that doc only*)

```
Doc A TF:  { dvt: 6, protocol: 3, prophylaxis: 1, required: 1, post-op: 1 }
Doc B TF:  { pain: 6, protocol: 3, management: 1, surgery: 1 }
```

**Step 4 — Build the shared DF map**  
(count *how many docs* contain each token — just 1 per doc, not total occurrences)

```
            Doc A   Doc B   DF count
dvt          ✓       ✗        1
protocol     ✓       ✓        2   ← common word, lower IDF → lower final score
prophylaxis  ✓       ✗        1
pain         ✗       ✓        1
surgery      ✗       ✓        1

DF map:  { dvt: 1, protocol: 2, prophylaxis: 1, pain: 1, surgery: 1, ... }
```

**Step 5 — Calculate avgLength**

```
Doc A length = 12 tokens
Doc B length = 11 tokens
avgLength    = (12 + 11) / 2 = 11.5
```

**Step 6 — Return the index**

```js
{
  docs: [
    { doc: DocA, tf: Map{ dvt→6, protocol→3, ... }, length: 12 },
    { doc: DocB, tf: Map{ pain→6, protocol→3, ... }, length: 11 }
  ],
  df:        Map{ dvt→1, protocol→2, prophylaxis→1, pain→1, surgery→1 },
  avgLength: 11.5,
  N:         2        // total number of docs
}
```

> `search()` then uses this to score a query: **high TF + low DF = high score**.  
> `"dvt"` scores better than `"protocol"` because `"protocol"` is in *both* docs (DF=2) so it's less distinctive.

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

#### `search()` — step by step with a mini example

Using the **same DocA / DocB index** from `buildIndex()` above.  
Query typed by the clinician: **`"dvt post-op"`**

```
Index we have:
  N = 2 docs,  avgLength = 11.5
  df  = { dvt:1, protocol:2, prophylaxis:1, post-op:1, pain:1, surgery:1 }
  Doc A tf = { dvt:6, protocol:3, prophylaxis:1, post-op:1 }   length=12
  Doc B tf = { pain:6, protocol:3, surgery:1 }                 length=11
```

**Step 1 — Tokenize the query**

```
"dvt post-op"
  → lowercase   → "dvt post-op"
  → split       → ["dvt", "post-op"]
  → stopwords   → ["dvt", "post-op"]   (neither is a stopword)
```

**Step 2 — Expand with synonyms**

```
"dvt"     → adds ["deep", "vein", "thrombosis", "prophylaxis", "clot"]
"post-op" → adds ["post", "op", "surgery", "surgical"]

Final query tokens: ["dvt", "post-op", "deep", "vein", "thrombosis", "prophylaxis", "clot",
                     "post", "op", "surgery", "surgical"]
```

**Step 3 — Score each doc using BM25**

For every query token, compute: `IDF × TF-saturation` and add to score.

BM25 formula per token:
```
IDF            = log(1 + (N - df + 0.5) / (df + 0.5))
TF-saturation  = (f × (K1+1)) / (f + K1 × (1 - B + B × docLen/avgLen))
                  where K1=1.5, B=0.75
```

Scoring **Doc A** for token `"dvt"`:
```
f   = 6  (dvt appears 6 times in Doc A)
df  = 1  (only 1 doc has dvt)
IDF = log(1 + (2 - 1 + 0.5) / (1 + 0.5))  = log(1 + 1.0) = 0.69
TF-sat = (6 × 2.5) / (6 + 1.5 × (0.25 + 0.75 × 12/11.5))
       = 15 / (6 + 1.5 × 1.033)
       = 15 / 7.55  ≈ 1.99

dvt contribution to Doc A score = 0.69 × 1.99 ≈ 1.37
```

Scoring **Doc A** for token `"post-op"`:
```
f   = 1  (post-op appears 1 time in Doc A)
df  = 1  (only 1 doc has it)
IDF = 0.69  (same as dvt — both appear in exactly 1 doc)
TF-sat ≈ 0.77

post-op contribution ≈ 0.69 × 0.77 ≈ 0.53
```

Scoring **Doc B** for token `"surgery"` (came from synonym expansion of "post-op"):
```
f   = 1  (surgery appears in Doc B)
df  = 1
IDF = 0.69
TF-sat ≈ 0.77

surgery contribution to Doc B ≈ 0.53
```

Adding up all matching tokens:

```
Doc A matched: dvt(1.37) + post-op(0.53) + prophylaxis(~0.5) = ~2.40
Doc B matched: surgery(0.53)                                  = ~0.53
```

**Step 4 — Apply boosts/guards**

```
Neither doc has a patient field → no privacy guard, no patient boost
Neither doc is marked severity:critical → no critical boost

Final scores:
  Doc A = 2.40  ✅  (matched dvt + post-op directly)
  Doc B = 0.53  (only matched via synonym expansion)
```

**Step 5 — Sort and return**

```
Ranked results:
  1st → Doc A "DVT Protocol"   score=2.40
  2nd → Doc B "Pain Protocol"  score=0.53
```

> **Doc A wins** because both query tokens (`dvt`, `post-op`) were found directly in it with high TF, while Doc B only got a weak synonym match (`surgery` ← from `post-op` expansion).


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
