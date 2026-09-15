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

  const { results, mentionedPatients } = search(index, query, { corpus });

  const topScore = results.length ? results[0].score : 0;
  const floor = Math.max(ABSOLUTE_FLOOR, topScore * RELATIVE_FLOOR);
  const topHits = results.filter((r) => r.score >= floor).slice(0, TOP_K);

  const noCoverage = topScore < COVERAGE_FLOOR;
  if (noCoverage) topHits.length = 0;

  const { fired, blockedDrugs } = evaluateRules(query, topHits, ruleset);

  const contextIds = new Set(topHits.map((r) => r.doc.id));
  for (const rule of fired) {
    if (rule.source && !contextIds.has(rule.source)) {
      const forced = results.find((r) => r.doc.id === rule.source);
      if (forced) {
        topHits.push(forced);
        contextIds.add(rule.source);
      }
    }
  }

  const llm = await complete({
    system: buildSystemPrompt(fired),
    user: buildUserPrompt(query, topHits, noCoverage)
  });

  const deterministic = buildDeterministicAnswer(topHits, fired);
  let finalAnswer = llm.ok && llm.text ? llm.text : deterministic;
  let mode = llm.ok && llm.text ? 'llm_governed' : 'deterministic_fallback';

  const guard = inspectOutput(finalAnswer, blockedDrugs);
  if (!guard.passed) {
    finalAnswer =
      '**ANSWER SUPPRESSED BY THE SUPRA OUTPUT GUARD**\n\n' +
      'The generated answer referenced a medication that Supra policy blocks for this ' +
      'query, so it was withheld and replaced with the verified policy answer below.\n\n' +
      '---\n\n' +
      deterministic;
    mode = 'guard_suppressed';
  }

  const citedIds = [...new Set((finalAnswer.match(/SUPRA-KB-\d{3}/g) || []))];

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
    hallucinated_citations: citedIds.filter((id) => !corpus.some((d) => d.id === id)),
    patients_detected: mentionedPatients
  };
}
