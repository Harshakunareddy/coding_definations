# Supra Assistant — Design Document

**Hospital:** Supra Multi-Specialty Hospital, Hyderabad
**System:** Clinical decision-support assistant
**Build time:** 90 minutes
**Author:** Harshavardhan Reddy

---

## 1. Executive summary

Supra Hospital does not need a chatbot that knows medicine. Every doctor at Supra already knows
medicine, and any general model already knows medicine better than it knows Supra.

What Supra needs is a system that knows **Supra's medicine** — the January 2025 decision by
Dr. Vikram that NSAIDs are banned at every step of post-TKR analgesia; the fact that patient
Rajan has refused NSAIDs eight times and his family will ask again; the fact that the sepsis
bundle was tightened to a one-hour lactate in v3; the fact that a patient discharged at 36 hours
came back with a DVT and so 48 hours is now the floor.

None of that is medical knowledge. All of it is **institutional** knowledge, and it is the part
that a general-purpose assistant structurally cannot have.

So the central design decision of this system is this: **the language model is the least
important component.** It is a formatting layer. The parts that make the system trustworthy —
retrieval scoping, the safety rule engine, the output guard — are deterministic code that runs
identically whether the model is available, degraded, or replaced next quarter by a different
vendor.

The system is built around one claim: **safety must not be delegated to a probability
distribution.** Telling a model "never recommend NSAIDs for Rajan" is a request. Supra needs a
guarantee. So the rule engine runs twice — before generation, to constrain the prompt, and after
generation, to inspect what came back — and a violation is caught by code, not by luck.

**Delivered:** a working web application, 15 Supra knowledge documents, 7 clinical safety rules,
a 5-stage answer pipeline, and a 51-assertion regression suite that passes with the model
switched off.

---

## 2. Why a hospital cannot just use ChatGPT

This is the question the assignment asks, so it deserves a precise answer rather than a general
one about "hallucination". Below are four failure modes, each demonstrated against Supra's
actual corpus and each reproducible in the prototype.

### 2.1 It gives the right answer to the wrong hospital

Ask any general assistant *"what pain medication for a post-TKR patient?"* and you will get a
multimodal analgesia regimen built on NSAIDs — ibuprofen or diclofenac, plus paracetamol,
opioids for breakthrough. That is textbook-correct and matches most enhanced-recovery protocols
worldwide.

At Supra it is **wrong**. Dr. Vikram ruled in January 2025 that NSAIDs are avoided at *all* steps
because of surgical bleeding risk. A model with no access to that decision will confidently
contradict the HOD, and the junior doctor reading the answer has no way to know it happened.

The failure is not that the model is stupid. The failure is that it is **right about the wrong
institution**, which is more dangerous than being obviously wrong, because it is plausible.

### 2.2 It has no patient record, so it cannot know who it is prescribing for

*"Patient Rajan has knee pain, what should I prescribe?"*

To a general model, "Rajan" is a name with no referent. It will answer the generic question —
knee pain — and the generic answer to knee pain is an NSAID. Rajan has a 2022 cardiac stent and
is on dual antiplatelet therapy. An NSAID here is a bleeding risk stacked on top of two existing
antiplatelet agents.

The corpus records that this has already been attempted **eight times** and that the family also
asks. This is not a hypothetical edge case; it is a documented, recurring pressure point where a
plausible-sounding AI answer would give a tired doctor cover to do the wrong thing.

Our system binds the token "Rajan" to a patient record, activates an absolute contraindication,
and blocks the entire NSAID class — both in the prompt and again in the output.

### 2.3 It cannot tell you which version of the protocol you are on

Supra's sepsis bundle is **v3, 2026: lactate within 1 hour**, tightened from v2's 3 hours. A
general model will quote the Surviving Sepsis Campaign and land on the widely-published 3-hour
and 6-hour bundles. It cannot know Supra tightened the window, and it cannot know that quoting
v2 in 2026 is quoting a superseded document.

Institutional knowledge has **versions and effective dates**. General knowledge does not. Our
documents carry `version`, `supersedes`, `decided_by` and `effective_date`, and the answer
surfaces them, so the clinician sees not just the rule but its provenance.

### 2.4 It cannot cite anything, so nothing it says can be checked

If a prescribing decision is questioned later — by a mortality review, an insurer, or the NMC —
"the AI said so" is not a defence. Someone has to answer: where did that instruction come from,
who ratified it, and when?

Every clinical claim this system makes carries a Supra document ID, the deciding authority and
the date. A general chat answer carries none of these, and cannot, because there is no
institutional document behind it to point at.

**Additionally:** sending patient names, conditions and medication histories to a consumer chat
product is a data-governance problem regardless of the answer quality. "Mrs. Padma, 62F, Type 2
DM, three hypoglycemia episodes" is identifiable patient data.

---

## 3. Architecture

```
   Clinician question
          |
  +-------v----------------+
  | 1  RETRIEVAL           |  BM25 over 15 docs, clinical synonym
  |                        |  expansion, patient entity binding,
  |                        |  linked-document traversal
  +-------+----------------+
  +-------v----------------+
  | 2  SAFETY RULE ENGINE  |  7 rules: patient contraindications,
  |                        |  drug interactions, procedure bans,
  |                        |  operational guards
  +-------+----------------+  -> hard constraints + safe alternatives
  +-------v----------------+
  | 3  CONSTRAINED         |  closed-book generation, citations
  |    GENERATION          |  mandatory, constraints above evidence
  +-------+----------------+
  +-------v----------------+
  | 4  OUTPUT GUARD        |  scan answer for blocked drugs with
  |                        |  negation + intent analysis
  +-------+----------------+  -> violation = suppress + substitute
  +-------v----------------+
  | 5  RESPOND             |  answer + safety banner + cited sources
  +------------------------+
```

Stages **2 and 4 are the ones a general chatbot does not have**, and they are the ones that carry
the safety guarantee. Stage 3 is replaceable; the others are not.

### 3.1 Graceful degradation

If the LLM is unreachable, rate-limited, or unconfigured, stage 3 fails and the pipeline
substitutes a **deterministic answer** assembled from the fired rules and the retrieved
documents. It is less fluent. It is never wrong in a new way, because nothing generated it.

A clinical tool that goes dark when a vendor's API has an incident is not a clinical tool. The
entire 51-assertion test suite passes in this mode — which is the real proof that safety is not
resting on the model.

This was not a theoretical concern. During the build the xAI account exhausted its credits and
every request began returning `403 permission-denied`. The assistant kept answering, correctly
and with citations, throughout. The client was subsequently made provider-agnostic (§10.5).

---

## 4. The knowledge model

The fifteen documents were supplied as `{title, content}`. Two fields cannot drive a safety
layer, so the first design step was deciding **what metadata the raw text implies**.

```jsonc
{
  "id": "SUPRA-KB-002",               // stable, citable, verifiable
  "title": "Patient Rajan Drug Alert",
  "content": "ABSOLUTE: No ibuprofen...",
  "department": "Cardiology",
  "doc_type": "patient_safety_alert", // protocol | patient_record |
                                      // incident_derived_rule | formulary ...
  "severity": "critical",             // drives retrieval boost
  "patient": "Rajan",                 // entity binding target
  "decided_by": "Cardiology / Patient Safety Committee",
  "effective_date": "2022",
  "version": "current",
  "supersedes": "v2 (lactate within 3 hours)",
  "linked_docs": ["SUPRA-KB-005"],
  "tags": ["rajan", "nsaid", "stent", "contraindication", ...]
}
```

Three fields deserve comment.

**`patient`** is what turns a document into a trigger. Without it, "Rajan" is just a token in a
sentence; with it, the retrieval layer can bind a name in the query to a specific safety record.

**`version` / `supersedes`** exist because the corpus already contains a superseded protocol.
Sepsis v3 explicitly replaces v2's 3-hour lactate window. Institutional knowledge has a timeline,
and an assistant that ignores it will eventually quote a rule that was withdrawn after an
incident.

**`linked_docs`** exists because Mrs. Padma's record is clinically useless on its own. It says she
fasts and has had hypoglycemia; it does not say what to do. The instruction lives in the Diabetic
Fasting Protocol. Retrieval therefore traverses the link and pulls both.

---

## 5. Retrieval design

**BM25 with a curated clinical synonym map, not embeddings.** This was a deliberate choice and I
would defend it beyond the time constraint:

- **Determinism.** The same question retrieves the same evidence every time. A clinical tool
  whose evidence drifts between identical questions cannot be reasoned about.
- **Corpus size.** Fifteen documents. A dense index solves a problem this corpus does not have.
- **Explainability.** "Retrieved because the query contains 'TKR' and the document is tagged
  'tkr'" can be shown to a clinical governance committee. Cosine similarity in a 1536-dimension
  space cannot.
- **No network dependency** in the retrieval path.

The gap a lexical index leaves is vocabulary mismatch — staff type "TKR", the document says
"total knee replacement"; staff type "painkiller", the protocol says "analgesia". That gap is
closed with an explicit synonym table rather than an embedding model, which has the useful
property of being **auditable and editable by a pharmacist**.

Two ranking signals sit on top of BM25:

1. **Patient scoping and entity binding.** A patient-specific record is excluded outright unless
   that patient is named in the query; when named, it is pinned to the top (+12). This is the
   entire difference between *"knee pain -> NSAID"* and *"Rajan's knee pain -> never an NSAID"*,
   and it is what stops one patient's alert firing on another patient's question (§7.6).
2. **Critical-severity boost** (x1.35). For a contraindication document, recall matters more than
   precision. Retrieving a safety alert unnecessarily costs a few tokens; missing one costs a
   patient.

---

## 6. The safety rule engine

Seven rules in `data/safety_rules.json`, declarative, with two enforcement levels.

| Rule | Type | Enforcement |
|---|---|---|
| `RULE-PT-RAJAN-NSAID` | patient contraindication | **hard block** |
| `RULE-POSTTKR-NSAID` | procedure contraindication | **hard block** |
| `RULE-WARFARIN-NSAID` | drug interaction | **hard block** |
| `RULE-DM-FASTING-SULFONYLUREA` | condition contraindication | **hard block** |
| `RULE-TKR-DISCHARGE-48H` | operational guard | **hard block** |
| `RULE-VERBAL-ORDER` | operational guard | advisory |
| `RULE-ORTHO-DVT-MANDATORY` | care completeness | advisory |

Rules are **data, not code**. A pharmacist can add a contraindication by editing JSON. This
matters for the real deployment: the P&T Committee must be able to change policy without a
software release, because policy changes faster than software ships.

One rule is worth highlighting as a design idea rather than a transcription.
**`RULE-ORTHO-DVT-MANDATORY`** fires on post-op ortho questions even when nobody asked about DVT.
Supra policy says *ALL* ortho surgical patients get prophylaxis. A system that only answers the
question asked will never catch the omission — and the TKR discharge incident in the corpus was
exactly an omission, not an error. The assistant volunteers the reminder.

### 6.1 The output guard

The rule engine runs a second time *after* generation, scanning the produced text for any blocked
medication. A naive substring scan is useless here, because the correct answer *mentions the
blocked drugs constantly* — "AVOID NSAIDs", "no ibuprofen". So the guard performs two checks:

- **Negation analysis**, on both sides of the mention. `AVOID NSAIDs` has the cue before;
  `NSAIDs must NEVER be prescribed` has it after.
- **Prescribing-intent analysis** for class *labels* as opposed to drug names. "NSAID" is not
  administrable — it is a category, and it appears in policy titles like *Warfarin-NSAID
  Interaction*. A class label only counts as a violation when an affirmative prescribing verb
  sits nearby.

On violation the generated answer is **suppressed entirely** and replaced with the deterministic
policy answer, with a visible banner explaining that suppression occurred. The system fails
loudly, not silently.

---

## 7. Problems discovered while building

The assignment asks what problems surfaced during the build. These are the real ones, in the
order they were found, and each was found by the test suite rather than by reading the code.

### 7.1 Wrong-patient rule activation — the serious one

**Symptom:** the query *"Tell me about Mrs. Padma's medication management"* triggered **Rajan's**
NSAID contraindication.

**Cause:** retrieval used a fixed relevance floor of 1.5. Padma's genuine matches scored 24–28;
Rajan's drug alert scored 4.01 on incidental lexical overlap ("patient", "medication") and cleared
the floor. Once in the retrieved set, the rule engine — which correctly activates a patient's
rules when that patient's record is in context — fired Rajan's contraindication on a completely
different patient.

**Why it matters:** this is the exact failure mode that makes clinical AI dangerous. Nothing
crashed. The answer looked authoritative. It carried a red safety banner about a cardiac stent
belonging to somebody else. A clinician who trusts the tool would have been actively misinformed,
and a clinician who noticed would never trust the tool again.

**Fix:** an adaptive two-part threshold — an absolute floor of 3.0 *and* a relative floor at 30%
of the top hit, plus a coverage floor of 6.0 below which the system declares it has no policy at
all. The score distribution made this easy to calibrate: genuine hits score 20–30, coincidental
overlap scores 2–4. The gap is an order of magnitude.

**Generalisation:** in a clinical retrieval system, a weak match is not a *slightly worse* match.
It is a **different patient**. Relevance thresholds are a safety parameter, not a tuning
parameter.

### 7.2 The safety guard rejected its own safe answers

**Symptom:** correct answers were being suppressed. The guard flagged "NSAIDs" in its own sentence
*"CRITICAL interaction: NSAIDs must NEVER be prescribed to a patient on Warfarin."*

**Cause:** negation detection looked only *backwards* from the drug mention. `AVOID NSAIDs` puts
the cue before the drug; `NSAIDs must never be prescribed` puts it after.

**Second cause, found after fixing the first:** the token `NSAID` matched inside the document
*title* "Warfarin-NSAID Interaction". Citing a policy is not prescribing a drug.

**Third cause, found by probing the guard with realistic model output rather than waiting for it
to misfire:** the character window itself was the flaw. In *"Avoid all NSAIDs including
ibuprofen, aspirin, diclofenac, naproxen, ketorolac, indomethacin and celecoxib"* the seventh
item sits beyond any fixed window, so the guard flagged an entry in a **prohibition list** as a
prescription. "Paracetamol is preferred over ibuprofen" failed for a different reason: "over"
was not in the negation vocabulary.

**Fix:** negation is now scoped to the **clause** rather than a character count. The scan runs
from the start of the current clause to its end, so an entire ban list inherits its leading
"Avoid". Crucially, `but`, `however`, `except` and `although` are treated as clause boundaries,
so *"Avoid aspirin, but you may give ibuprofen"* is still caught. Markdown list markers are
normalised first — length-preservingly, so match offsets stay valid — because a newline before a
bullet continues a clause rather than ending one.

All fourteen phrasings, including four adversarial ones that must still be blocked, are now
asserted in the test suite.

**Generalisation:** a safety filter has two failure modes and the industry only talks about one.
False negatives are dangerous. **False positives destroy adoption** — a guard that suppresses
correct answers gets switched off within a week, and then you have no guard at all.

### 7.3 The system answered questions it had no business answering

**Symptom:** *"What is the recommended dose of ceftriaxone for meningitis?"* retrieved the
Diabetic Fasting Protocol (score 2.04, on the word "dose") and produced an answer.

**Cause:** no concept of *coverage*. Retrieval always returns a ranked list; something is always
at the top. Nothing distinguished "here is the relevant protocol" from "here is the least
irrelevant of fifteen documents".

**Fix:** an explicit coverage floor. Below it, the retrieved set is discarded and the model is
told plainly that no policy exists and it must decline and name an escalation path.

**Generalisation:** knowing when to say nothing is a feature, not a limitation. A hospital
assistant that answers everything is indistinguishable from a general chatbot at exactly the
moment the distinction matters most.

### 7.4 The status indicator lied — twice, for different reasons

**First version:** the `.env` placeholder passed the "starts with `xai-`" check, so the UI
reported **"Grok connected"** while every request silently failed into the deterministic
fallback.

**Second version, found while deliberately testing an expired key:** the fix above validated the
key's *shape*, then probed the provider's `/models` endpoint and treated a 200 as proof of
health. It is not. **OpenRouter serves its model list without authentication** — the probe
returned 200 for a key of sixty-four zeroes, and the banner cheerfully announced a working model
while every completion 401'd.

A health check that can pass without the credential it is supposed to be checking is not a
health check. It is a decoration that happens to be green.

**Fix:** provider health is no longer inferred from a probe at all. It is *observed* — only a
real completion sets the state, and any failure marks the provider unavailable. Because that
means health is genuinely unknown until the first question is asked, the honest place to report
it is per answer: any response that fell back to the deterministic path now carries a visible
amber notice saying the model was unavailable and the answer came from protocol directly.

**Generalisation:** in a clinical tool, the user must always be able to tell **which mode
produced the answer in front of them**. Not which mode the system was in at page load — which
mode produced *this* answer. Aggregate status is a convenience; per-answer provenance is the
requirement.

### 7.5 Two-field documents cannot carry a safety layer

The supplied corpus is `{title, content}`. Version awareness needs a version. Patient binding
needs a patient. Rule attribution needs a decision author.

Every one of those had to be **inferred from prose**. That inference was done by hand here, and it
is the single biggest scaling obstacle: at 15 documents it takes an afternoon, at 4,000 documents
it is a programme of work. Section 10.1 addresses it.

### 7.6 Patient records leaked into questions about other patients

**Symptom:** the generic query *"What pain medication should I give a post-TKR patient?"* — which
names nobody — retrieved **Rajan's drug alert as its top hit**, ranking it above the actual
post-TKR analgesia protocol, and fired his absolute NSAID contraindication.

**Cause:** this is §7.1's failure returning through a different door. The adaptive threshold
stopped *weak* matches contaminating a query. It could not stop a *strong* one. Rajan's alert is
tagged `knee pain`, `prescribe`, `bleeding`, `nsaid` — ordinary clinical vocabulary that any
analgesia question matches — and it carries the ×1.35 critical-severity boost. It earned its
place at the top on the arithmetic. The arithmetic was the wrong tool.

**Fix:** a patient-scoped document is now **ineligible for retrieval unless that patient is named
in the query**. Not down-weighted — excluded, before scoring is even considered. Relevance is the
wrong question to ask about someone else's medical record; the right question is whose record it
is.

**Why this matters more than the first version:** in §7.1 the contaminating document was obvious
noise scoring 4 against genuine hits scoring 28. Here it was the highest-scoring document in the
corpus for that query. No threshold, however well calibrated, would have caught it. Ranking
alone cannot express "this document is about a different human being" — that requires a rule.

The same change removed three irrelevant protocols from that answer, cutting it from six source
documents to two and the response from a wall of text to 73 words. **The verbosity was a symptom
of the safety defect, not a separate cosmetic problem** — which is worth remembering, because
the verbosity is what was noticed first.

### 7.7 Findings from the pre-handover review

A deliberate review pass before handover turned up six defects that testing had not, because
none of them affect the answer text — they affect what happens around it.

**The provider client scavenged the environment.** If no key was found in the expected variable,
it scanned *every* environment variable for a value with a matching prefix. A borrowed CI secret
or an unrelated `sk-` token would have been sent as a bearer credential to a third party.
Removed: a key is now read only from its own named variable.

**No timeout on any outbound call.** A provider that accepts the connection and never responds
would hang the request indefinitely and leave the clinician looking at a spinner with no
recovery path. Both LLM calls now carry explicit abort timeouts, and so does the browser fetch.

**Provider errors were forwarded verbatim to the browser.** The xAI credit-exhaustion response
contained the account's internal team UUID, and it was being rendered in the UI. Errors are now
logged server-side in full and returned to the client as a category — rate limited, unavailable,
timed out — with no upstream detail.

**The query was unbounded.** No length check before tokenizing and forwarding upstream. Capped
at 1,000 characters with a 32kb body limit.

**The 500 handler leaked internals**, returning raw exception messages. Now logs server-side and
returns a fixed message.

**The safety stop was rendered twice** — once in the alert banner, once inside the answer body.
Duplicated warnings are not twice as safe; they train staff to skim warnings, which is the
opposite of the intent. The hard-block message now appears once, in the banner, and the answer
carries only the required alternative.

The theme connecting them: **five of the six are invisible to a demo and none would have failed
a test.** Correct answers on screen are not evidence that a clinical system is safe to deploy.

---

## 8. Evidence — the five test queries

| # | Query | General assistant | Supra Assistant |
|---|---|---|---|
| 1 | Post-TKR pain medication | Multimodal analgesia including NSAIDs (ibuprofen / diclofenac) | Paracetamol 650mg QDS -> Tramadol 50mg if VAS > 6. **NSAIDs banned at all steps.** Attributed to Dr. Vikram, Jan 2025 `[SUPRA-KB-001]` |
| 2 | Rajan, knee pain | Generic knee-pain advice; typically an NSAID | **SAFETY STOP.** Absolute NSAID contraindication — stent 2022, dual antiplatelet, 8 prior refusals, refuse family requests. Paracetamol instead `[SUPRA-KB-002]` |
| 3 | DVT prophylaxis timing | "6–24 hours post-op, 10–35 days", varies by source | Enoxaparin 40mg SC daily from **12 hours** post-op; **14 days TKR / 28 days THR** `[SUPRA-KB-004]` |
| 4 | Sepsis protocol | Surviving Sepsis Campaign, lactate within 3 hours | **Supra Bundle v3 2026** — lactate within **1 hour**, superseding v2 `[SUPRA-KB-003]` |
| 5 | Mrs. Padma's medication | "I have no information about this patient" | 62F, Type 2 DM, Ekadashi fasting twice monthly, 3 hypoglycemia episodes in 2025 -> adjust insulin **timing not dose**, skip Glimepiride, continue Metformin `[SUPRA-KB-013] [SUPRA-KB-005]` |

Beyond the five, two cases separate an institutional system from a retrieval demo:

- **Incident memory.** *"Can I discharge my TKR patient at 36 hours?"* -> blocked, with the
  reason: someone was discharged at 36 hours and came back with a DVT.
- **Refusal.** *"Dose of ceftriaxone for meningitis?"* -> no Supra policy, escalate to P&T.

In every case the difference comes from the same place: the Supra answer is constrained by
hospital policy and carries a document ID, and the general answer is constrained by nothing.

---

## 9. Evaluation

`npm run eval` — **51 assertions, 23 scenarios, 0 failures.**

The suite deliberately asserts on **deterministic pipeline properties**, never on generated prose:
which documents entered context, which rules fired, whether the output guard held, whether any
citation was fabricated. Consequently it passes with the API key removed — a property worth more
than the pass count, because it demonstrates that the safety guarantees do not depend on the
model.

Two invariants are asserted on **every** scenario:

- the output guard passed
- no citation refers to a document ID that does not exist

The bugs in section 7 were caught by this suite or by review, not by inspection. That is the argument for
writing it inside a 90-minute build rather than after.

---

## 10. What I would add with more time

### 10.1 Metadata extraction at scale — the blocking problem

The safety layer runs on metadata that I hand-authored. Supra has years of protocols. The first
real engineering task is an ingestion pipeline that proposes `doc_type`, `patient`, `version` and
`supersedes` from raw documents, and routes each proposal to a human owner for approval. One rule:
**an LLM may propose a classification but never approve one.**

### 10.2 Protocol supersession and effective dating

The corpus already contains a v2->v3 transition. At scale this becomes: which version was in force
on the date of the incident under review? Documents need validity intervals so a case review can
reconstruct what the system said in March rather than what it says today.

### 10.3 Integration with the HIS/EMR

Today the system knows Rajan because someone wrote a note about Rajan. It should know him because
it read his chart. Live allergy lists, current medications, eGFR and weight for dose checking, and
INR for the warfarin rule turn a static contraindication into a live one. This is where the
assistant stops being a search tool and starts being a safety net.

### 10.4 Write-back: the assistant as institutional memory

The most valuable long-term feature is capture, not retrieval. When Dr. Vikram makes a decision on
a ward round, that decision should become a knowledge document — proposed by the system, approved
by him, versioned, and immediately live for the whole department. The corpus in this build is a
snapshot of what one hospital learned; the system should be how the next thing gets learned.

### 10.5 Role-based access to restricted documents

Two of the fifteen documents are marked confidential — the FY2026 Ortho budget (HOD and Admin) and
the board expansion plan (Admin only). A production deployment must filter these by role **before
the documents reach the model's context window**, so a restricted document cannot leak through a
jailbreak or a summarisation side-channel. This build treats every user as a clinician with access
to clinical protocol only, which is correct for the demo and insufficient for production.

### 10.6 Hardening

Real authentication, an append-only audit record of every question and the evidence behind its
answer, prompt-injection defence on retrieved content, PII redaction at the model boundary or a
self-hosted model for patient-identifiable queries, rate limiting, and structured clinician
feedback on every answer feeding a regression corpus.

### 10.7 Retrieval upgrade

Hybrid dense + sparse retrieval with reciprocal rank fusion once the corpus exceeds a few hundred
documents, keeping BM25 in the ensemble so exact drug and protocol names never lose to semantic
drift — and keeping the lexical path explainable to the governance committee.

---

## 11. Limitations — what this is not

Stated plainly, because a clinical tool that oversells itself is itself a hazard.

- **It is decision support, not a decision.** Every answer is a prompt to a qualified clinician
  who remains responsible.
- **It is only as current as its corpus.** A superseded document that nobody archived will be
  served with full confidence. Governance is an organisational process; this is only the software
  that enforces it.
- **The rules are hand-written.** Seven rules over fifteen documents. Real coverage means hundreds
  of rules and a committee that owns them.
- **There is no authentication and no access control.** Every user sees every document.
- **The output guard is heuristic.** Negation and intent analysis on natural language will
  eventually meet a sentence that defeats it. It is a second line of defence behind prompt
  constraints, not a proof.
- **No clinical validation.** Nothing here has been reviewed by a practising clinician, and
  nothing should go near a patient until it has.

---

## 12. Closing

The temptation in a task like this is to build better RAG. But retrieval was never the hard part —
with fifteen documents, almost any retrieval works.

The hard part is everything that has to be true before a doctor at 2am will act on what the screen
says: that the answer reflects *this* hospital's ruling and not the internet's consensus; that it
knows which patient is in front of them; that it will say "I don't know" instead of improvising;
that when it does refuse, it says who to call instead; and that every claim can be traced back to
a document someone at Supra actually signed.

None of that comes from the model. All of it comes from the layer built around the model — and
that layer is the reason a hospital cannot just open ChatGPT.

---

**Appendix — repository map**

```
server.js               API and static hosting
src/pipeline.js         retrieve -> rules -> generate -> guard -> respond
src/retrieval.js        BM25, clinical synonyms, patient entity binding
src/safety.js           rule engine, output guard, deterministic answers
src/prompt.js           constrained prompt construction
src/llm.js              multi-provider LLM client with graceful degradation
data/knowledge.json     15 Supra documents
data/safety_rules.json  7 clinical safety rules
eval/run-eval.js        51-assertion regression suite
public/index.html       clinician UI
```
