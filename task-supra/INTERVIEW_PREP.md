# Supra Hospital AI — Interview Prep (Simple English)

---

## What is this project? (Say this first in every interview)

> "It is an AI chatbot for doctors in a hospital.
> A doctor types a question like 'what medicine should I give this patient?'
> The system finds the relevant hospital policy document,
> checks if the medicine is safe for that patient,
> and then asks an AI model to give a proper answer.
> The AI can only answer using the hospital's own documents — not from its own memory."

That's it. That is the whole project in 4 lines.

---

## The technical name for this pattern

**RAG — Retrieval Augmented Generation**

- **Retrieval** = find the right documents first
- **Augmented** = add those documents to the AI's context
- **Generation** = AI generates the answer using only those documents

Simple version: *"Find first, then ask AI"*

---

## What happens when a doctor types a question — step by step

### Step 1 — server.js receives the question

The browser sends the question to the server.
`server.js` does 3 quick checks:
- Is it text? ✅
- Is it too long (over 1000 characters)? ❌ reject it
- Is it a greeting like "hi" or "hello"? → send a canned reply, no AI needed

If it passes all checks → it hands the question to `pipeline.js`

---

### Step 2 — pipeline.js takes over (the main manager)

`pipeline.js` does NOT do any thinking itself.
It just calls the right function at the right time — like a manager who delegates.
It runs 8 steps in order.

---

### Step 3 — retrieval.js finds the relevant documents

This is the search engine of the system.

**Two things happen here:**

**① buildIndex() — runs once when server starts**

Before any doctor even opens the website, the server reads all 15 hospital documents
and builds a searchable index in memory.

Think of it like a library making a catalogue:
- For each document → count how many times each word appears → this is called **TF (Term Frequency)**
- Across all documents → count how many documents contain each word → this is called **DF (Document Frequency)**

Why TF and DF?
- TF: if a word appears many times in a document → that document is very relevant
- DF: if a word appears in almost every document → it is a common word, not useful
- Rare word in one document = very relevant → high score
- Common word in all documents = not useful → low score

This combination of TF and DF is called **BM25** — the scoring algorithm.

**② search() — runs on every query**

When the doctor types "what painkiller for Rajan after knee surgery?":

1. **Tokenize** — clean the question
   - lowercase everything
   - remove common words like "what", "should", "give", "after" (called **stopwords**)
   - result: ["painkiller", "rajan", "knee", "surgery"]

2. **Expand** — add medical synonyms
   - "painkiller" → also search for "pain", "analgesia"
   - "surgery" → also search for "post-op", "surgical"
   - This way even if the document uses a different word, it still gets found

3. **Detect patient name**
   - System checks: is "Rajan" or "Padma" mentioned in the query?
   - If yes → only show that patient's records, hide all other patient records (privacy)

4. **Score all 15 documents using BM25**
   - Every document gets a score
   - Documents with matching words score higher
   - Patient's own record gets +12 bonus
   - Documents marked "critical" get ×1.35 bonus
   - Documents belonging to other patients get score = 0 (hidden)

5. **Return the top ranked documents**

---

### Step 4 — pipeline.js filters weak results

Not all scored documents go to the AI.
Only documents that score above a minimum threshold are kept.
If even the best document scores too low → the system says "no protocol found"
and asks the doctor to escalate to the HOD.

---

### Step 5 — safety.js checks safety rules (BEFORE AI answers)

The system has a `safety_rules.json` file with 7 rules.
For example: "Never give NSAIDs to Rajan because of his cardiac stent."

`safety.js` checks three types of triggers:
- **patient trigger** → Is the patient Rajan mentioned? → fire the NSAID block rule
- **any_term trigger** → Is the word "nsaid" or "ibuprofen" in the question? → fire the rule
- **all_of trigger** → Must contain "post-op" AND "knee" both → fire only if BOTH match

If a rule fires:
- Blocked drug list is built: ["ibuprofen", "diclofenac", "aspirin"]
- These are injected into the AI's instructions as hard constraints

---

### Step 6 — prompt.js builds the instructions for the AI

Two things are built:

**System prompt** (the AI's rules):
- "You are the Supra Hospital AI assistant"
- "HARD BLOCK: Do NOT recommend ibuprofen, diclofenac, aspirin for Rajan"
- "Only use the documents I give you"
- "Always cite the document ID like [SUPRA-KB-001]"
- "Never invent drug names or document IDs"

**User prompt** (the actual question + context):
- All the relevant hospital documents are pasted here with their IDs and content
- Then the doctor's question is added at the end

---

### Step 7 — llm.js calls the AI model

`llm.js` supports 5 different AI providers:
xAI, Groq, Gemini, OpenRouter, OpenAI

It picks whichever one has a valid API key set in the `.env` file.
It sends the system prompt + user prompt to the AI.
It waits up to 30 seconds for a reply.

If the AI responds → return the text
If the AI fails or times out → return `ok: false` → pipeline uses fallback answer

---

### Step 8 — safety.js checks the AI's answer (AFTER AI answers)

Even though we told the AI "don't recommend ibuprofen", we don't fully trust it.

So `safety.js` scans the AI's answer word by word:
- Is "ibuprofen" in the answer?
  - Is it being warned against? ("avoid ibuprofen") → safe, skip it
  - Is it being prescribed? ("give ibuprofen") → VIOLATION!
- If violation found → answer is **suppressed**
- A safe rule-based answer is shown instead with a warning banner

---

### Step 9 — pipeline.js checks for hallucination

**Hallucination** = when the AI invents something that doesn't exist.

In this project, the AI might write "[SUPRA-KB-099]" in its answer.
But SUPRA-KB-099 doesn't exist in our hospital documents — the AI made it up.

The system scans the answer for all SUPRA-KB-XXX IDs.
It checks each one against the real document list.
Any ID that doesn't exist → marked as hallucinated → flagged in the response.

---

### Step 10 — server.js sends the final answer back

The doctor sees the answer in under 2-3 seconds.

---

## Key terms you MUST know for the interview

| Term | Simple meaning |
|------|---------------|
| **RAG** | Find documents first, then ask AI. AI uses only those docs to answer |
| **BM25** | Scoring algorithm. Rare words in one document = high score |
| **TF (Term Frequency)** | How many times a word appears in ONE document |
| **DF (Document Frequency)** | How many documents contain that word |
| **IDF** | Rare word = high value. Common word = low value. Opposite of DF |
| **Tokenize** | Clean the text: lowercase + remove stopwords + split into words |
| **Stopwords** | Common useless words: "the", "is", "what", "give" |
| **Synonym expansion** | "painkiller" also searches "pain", "analgesia" |
| **Hard block** | AI is absolutely forbidden from recommending this drug |
| **Advisory** | AI must mention this warning but it's not a full block |
| **Output guard** | Scanning AI's answer after it's generated to catch blocked drugs |
| **Hallucination** | AI cites a document ID or fact that doesn't actually exist |
| **Deterministic answer** | Safe answer built from rules + documents, no AI involved |
| **Fallback** | When AI fails or gets suppressed → use deterministic answer instead |
| **Privacy guard** | Patient A's records are hidden if query is about Patient B |
| **Critical boost** | Documents marked critical get ×1.35 score bonus |
| **Patient boost** | If query mentions a patient whose record exists → +12 score bonus |

---

## How to answer "what is the hardest part of this project?"

> "The hardest part is the safety layer. Just telling the AI 'don't recommend this drug'
> is not enough — the AI can still slip it in. So we have a two-phase safety check.
> Before the AI answers, we inject hard constraints into the system prompt.
> After the AI answers, we scan its text word by word to detect if any blocked drug
> was actually recommended. We also distinguish between the AI warning about a drug
> vs actually prescribing it — 'avoid ibuprofen' is fine, but 'give ibuprofen' is a violation.
> This nuance required the negation detection logic in safety.js."

---

## How to answer "what is BM25?"

> "BM25 is a ranking algorithm used in search engines.
> It scores how relevant a document is to a search query.
> It combines two things — how often the search word appears in that document (TF),
> and how rare that word is across all documents (IDF).
> If a word appears many times in one document but rarely in others,
> that document is very relevant and gets a high score.
> Common words like 'the' or 'protocol' appear everywhere, so they get low scores."

---

## How to answer "why not just use ChatGPT directly?"

> "ChatGPT answers from its training data — general medical knowledge from the internet.
> But hospital policies are specific to this hospital.
> The dosages, the approved drugs, the vendor choices, the patient-specific rules —
> none of that is in ChatGPT's training data.
> Also, ChatGPT doesn't know that Rajan has a cardiac stent and cannot take NSAIDs.
> By using RAG, we give the AI only the hospital's own documents as context,
> so it answers based on actual hospital policy, not general internet knowledge."

---

## Confidence tip

You built a system with:
- A custom search engine (BM25)
- A two-phase safety layer (pre + post AI check)
- Hallucination detection
- Multi-provider AI support with automatic fallback
- Patient privacy enforcement

That is not a small project. That is a production-grade clinical AI system.
Say it with confidence.
