import { search } from './retrieval.js';
import { evaluateRules, inspectOutput, buildDeterministicAnswer } from './safety.js';
import { buildSystemPrompt, buildUserPrompt } from './prompt.js';
import { complete } from './llm.js';

const TOP_K = 3;

const ABSOLUTE_FLOOR = 4.0;
const RELATIVE_FLOOR = 0.50;
const COVERAGE_FLOOR = 6.0;

export async function answer({ query, corpus, index, ruleset }) {
  const t0 = Date.now();

  // ─────────────────────────────────────────────
  // STEP 1 — RETRIEVAL
  // Send the query into BM25 search.
  // Gets back all 15 docs ranked by score.
  // ─────────────────────────────────────────────
  const { results, mentionedPatients } = search(index, query, { corpus });

  console.log('\n══════════════════════════════════════════════');
  console.log('  PIPELINE START');
  console.log('══════════════════════════════════════════════');
  console.log(`  QUERY         : "${query}"`);
  console.log(`  PATIENTS FOUND: [${mentionedPatients.join(', ') || 'none'}]`);

  console.log('\n──────────────────────────────────────────────');
  console.log('  STEP 1 — RETRIEVAL (BM25 ranked results)');
  console.log('──────────────────────────────────────────────');
  results.forEach((r, i) => {
    if (r.score > 0) {
      console.log(`  #${i + 1} [${r.doc.id}] "${r.doc.title}"  score=${r.score.toFixed(2)}  matched=[${[...r.matchedTerms].join(', ')}]  signals=[${r.signals.join(' | ') || 'none'}]`);
    }
  });

  // ─────────────────────────────────────────────
  // STEP 2 — FILTER
  // Drop docs below the score floor.
  // If even the top doc scores below COVERAGE_FLOOR → no protocol found.
  // ─────────────────────────────────────────────
  const topScore = results.length ? results[0].score : 0;
  const floor = Math.max(ABSOLUTE_FLOOR, topScore * RELATIVE_FLOOR);
  const topHits = results.filter((r) => r.score >= floor).slice(0, TOP_K);

  const noCoverage = topScore < COVERAGE_FLOOR;
  if (noCoverage) topHits.length = 0;

  console.log('\n──────────────────────────────────────────────');
  console.log('  STEP 2 — FILTER');
  console.log('──────────────────────────────────────────────');
  console.log(`  topScore=${topScore.toFixed(2)}  floor=${floor.toFixed(2)}  COVERAGE_FLOOR=${COVERAGE_FLOOR}`);
  console.log(`  noCoverage=${noCoverage}  (top doc score ${topScore.toFixed(2)} ${noCoverage ? '<' : '>='} ${COVERAGE_FLOOR})`);
  if (topHits.length) {
    console.log(`  Docs passing filter (will be sent to AI):`);
    topHits.forEach((r) => console.log(`    ✅ [${r.doc.id}] "${r.doc.title}"  score=${r.score.toFixed(2)}`));
  } else {
    console.log('  ❌ No docs passed the filter — noCoverage mode');
  }

  // ─────────────────────────────────────────────
  // STEP 3 — SAFETY RULES
  // Check which rules from safety_rules.json fire.
  // Builds the blockedDrugs list.
  // ─────────────────────────────────────────────
  const { fired, blockedDrugs } = evaluateRules(query, topHits, ruleset);

  console.log('\n──────────────────────────────────────────────');
  console.log('  STEP 3 — SAFETY RULES');
  console.log('──────────────────────────────────────────────');
  if (fired.length) {
    fired.forEach((f) => {
      console.log(`  🔴 RULE FIRED: [${f.id}]  enforcement=${f.enforcement}`);
      console.log(`     blockedDrugs=[${f.blocked_drugs.join(', ')}]`);
      if (f.safe_alternative) console.log(`     safe_alternative="${f.safe_alternative}"`);
    });
    console.log(`  All blocked drugs: [${blockedDrugs.join(', ')}]`);
  } else {
    console.log('  ✅ No safety rules fired for this query');
  }

  // ─────────────────────────────────────────────
  // STEP 4 — FORCE-INCLUDE
  // If a fired rule references a source doc that didn't make it into
  // topHits, forcefully add it so the AI has the right context.
  // ─────────────────────────────────────────────
  const contextIds = new Set(topHits.map((r) => r.doc.id));
  console.log('\n──────────────────────────────────────────────');
  console.log('  STEP 4 — FORCE-INCLUDE (safety rule sources)');
  console.log('──────────────────────────────────────────────');
  for (const rule of fired) {
    if (rule.source && !contextIds.has(rule.source)) {
      const forced = results.find((r) => r.doc.id === rule.source);
      if (forced) {
        topHits.push(forced);
        contextIds.add(rule.source);
        console.log(`  ➕ Force-included [${rule.source}] (required by rule ${rule.id})`);
      }
    } else if (rule.source) {
      console.log(`  ✅ [${rule.source}] already in topHits — no force-include needed`);
    }
  }
  if (!fired.length) console.log('  No rules fired — nothing to force-include');

  // ─────────────────────────────────────────────
  // STEP 5 — LLM CALL
  // Build the system + user prompts and send to the AI.
  // ─────────────────────────────────────────────
  console.log('\n──────────────────────────────────────────────');
  console.log('  STEP 5 — LLM CALL');
  console.log('──────────────────────────────────────────────');
  console.log(`  Sending ${topHits.length} doc(s) to AI: [${topHits.map(r => r.doc.id).join(', ')}]`);
  console.log('  Calling AI...');

  const llm = await complete({
    system: buildSystemPrompt(fired),
    user: buildUserPrompt(query, topHits, noCoverage)
  });

  console.log(`  LLM ok=${llm.ok}  model="${llm.model}"  error=${llm.error || 'none'}`);
  if (llm.ok && llm.text) {
    console.log(`  AI answer preview: "${llm.text.slice(0, 120).replace(/\n/g, ' ')}..."`);
  }

  // ─────────────────────────────────────────────
  // STEP 6 — PICK FINAL ANSWER
  // Prefer AI answer. Fall back to deterministic if AI failed.
  // ─────────────────────────────────────────────
  const deterministic = buildDeterministicAnswer(topHits, fired);
  let finalAnswer = llm.ok && llm.text ? llm.text : deterministic;
  let mode = llm.ok && llm.text ? 'llm_governed' : 'deterministic_fallback';

  console.log('\n──────────────────────────────────────────────');
  console.log('  STEP 6 — PICK ANSWER');
  console.log('──────────────────────────────────────────────');
  console.log(`  mode="${mode}"  (${llm.ok && llm.text ? 'AI answered ✅' : 'AI failed ❌ — using deterministic fallback'})`);

  // ─────────────────────────────────────────────
  // STEP 7 — OUTPUT GUARD
  // Scan the final answer for blocked drug names.
  // If any found → suppress answer and use safe fallback.
  // ─────────────────────────────────────────────
  const guard = inspectOutput(finalAnswer, blockedDrugs);

  console.log('\n──────────────────────────────────────────────');
  console.log('  STEP 7 — OUTPUT GUARD');
  console.log('──────────────────────────────────────────────');
  if (guard.passed) {
    console.log('  ✅ Output guard PASSED — no blocked drugs in answer');
  } else {
    console.log('  🚨 Output guard FAILED — blocked drug found in answer!');
    guard.violations.forEach((v) => {
      console.log(`     drug="${v.drug}"  context="...${v.context}..."`);
    });
    console.log('  Answer SUPPRESSED → switching to deterministic fallback');
  }

  if (!guard.passed) {
    finalAnswer =
      '**ANSWER SUPPRESSED BY THE SUPRA OUTPUT GUARD**\n\n' +
      'The generated answer referenced a medication that Supra policy blocks for this ' +
      'query, so it was withheld and replaced with the verified policy answer below.\n\n' +
      '---\n\n' +
      deterministic;
    mode = 'guard_suppressed';
  }

  // ─────────────────────────────────────────────
  // STEP 8 — HALLUCINATION CHECK + RETURN
  // Find any SUPRA-KB-XXX IDs in the answer that don't exist in corpus.
  // ─────────────────────────────────────────────
  const citedIds = [...new Set((finalAnswer.match(/SUPRA-KB-\d{3}/g) || []))];
  const hallucinated = citedIds.filter((id) => !corpus.some((d) => d.id === id));

  console.log('\n──────────────────────────────────────────────');
  console.log('  STEP 8 — HALLUCINATION CHECK');
  console.log('──────────────────────────────────────────────');
  console.log(`  Citations in answer : [${citedIds.join(', ') || 'none'}]`);
  console.log(`  Hallucinated IDs    : [${hallucinated.join(', ') || 'none ✅'}]`);

  console.log('\n══════════════════════════════════════════════');
  console.log(`  PIPELINE DONE  mode="${mode}"  latency=${Date.now() - t0}ms`);
  console.log('══════════════════════════════════════════════\n');

  return {
    answer: finalAnswer,
    mode,
    model: llm.model || null,
    llm_error: llm.ok ? null : llm.error,
    latency_ms: Date.now() - t0,
    sources: topHits.map((r) => ({
      id: r.doc.id,
      title: r.doc.title,
      content: r.doc.content,
      decided_by: r.doc.decided_by,
      effective_date: r.doc.effective_date,
      version: r.doc.version,
      supersedes: r.doc.supersedes || null,
      score: Number(r.score.toFixed(2))
    })),
    safety: {
      rules_fired: fired,
      blocked_drugs: blockedDrugs,
      output_guard: guard
    },
    citations: citedIds,
    hallucinated_citations: hallucinated,
    patients_detected: mentionedPatients
  };
}
