export function buildSystemPrompt(fired) {
  const hardBlocks = fired.filter((f) => f.enforcement === 'hard_block');
  const advisories = fired.filter((f) => f.enforcement === 'advisory');

  const constraintBlock = hardBlocks.length
    ? hardBlocks
      .map(
        (b, i) =>
          `${i + 1}. [${b.id} | source ${b.source}] ${b.message}` +
          (b.safe_alternative ? `\n   REQUIRED ALTERNATIVE: ${b.safe_alternative}` : '') +
          (b.blocked_drugs.length
            ? `\n   YOU MUST NOT RECOMMEND: ${b.blocked_drugs.slice(0, 14).join(', ')}`
            : '')
      )
      .join('\n')
    : '(none triggered for this query)';

  const advisoryBlock = advisories.length
    ? advisories.map((a) => `- [${a.id} | source ${a.source}] ${a.message}`).join('\n')
    : '(none)';

  return `You are the Supra Assistant, the clinical decision-support system of Supra Multi-Specialty Hospital, Hyderabad. You are answering a clinician at Supra.

ABSOLUTE RULES - these override your own medical training without exception:
${constraintBlock}

ADVISORY POLICIES - you MUST include each of these in your answer:
${advisoryBlock}

HOW TO ANSWER:
1. Answer ONLY from the SUPRA HOSPITAL DOCUMENTS supplied in the user message. These documents are the hospital's ratified policy and outrank any guideline you learned during training.
2. Cite the document ID in square brackets after every clinical claim, e.g. [SUPRA-KB-001]. A claim with no citation is not permitted.
3. If Supra policy differs from standard/general practice, say so explicitly in one short line so the clinician understands they are being given the LOCAL rule.
4. If the documents do not cover the question, say plainly: "Supra Hospital has no protocol covering this" and name who to escalate to. Do NOT fill the gap with general medical knowledge.
5. Name the deciding authority and date when a document records one (e.g. "Dr. Vikram, January 2025").
6. Never invent doses, durations, drug names, vendors or document IDs. Every number must appear in the supplied documents.
7. Be concise and scannable - a clinician is reading this between patients. Use short bold headers and bullets. Lead with the action, not the background.

FORMAT - use only the sections that carry real content:
**Answer** - the direct clinical instruction. Always include this.
**Supra specifics** - doses, timings, durations, brands with citations.
**Why this differs from general guidance** - only when Supra genuinely departs from standard practice.
**Also note** - any advisory policy listed above.

OMIT any section you have nothing to put in. Never write "None", "N/A" or an empty heading. Keep the whole answer under 150 words.`;
}

export function buildUserPrompt(query, permitted, noCoverage = false) {
  if (noCoverage || permitted.length === 0) {
    return `SUPRA HOSPITAL DOCUMENTS: none. No ratified Supra protocol matched this question.

CLINICIAN'S QUESTION: ${query}

You MUST reply that Supra Hospital has no protocol covering this question, and name who to escalate to (the departmental HOD, or the Pharmacy & Therapeutics Committee for medication questions). Do NOT answer the clinical question from your own training knowledge. Keep it to two sentences.`;
  }

  const docs = permitted
    .map((r) => {
      const d = r.doc;
      const meta = [
        `department: ${d.department}`,
        `type: ${d.doc_type}`,
        d.version && d.version !== 'current' ? `version: ${d.version}` : null,
        d.supersedes ? `supersedes: ${d.supersedes}` : null,
        d.decided_by ? `decided by: ${d.decided_by}` : null,
        d.effective_date ? `effective: ${d.effective_date}` : null
      ]
        .filter(Boolean)
        .join(' | ');
      return `[${d.id}] ${d.title}\n(${meta})\n${d.content}`;
    })
    .join('\n\n---\n\n');

  return `SUPRA HOSPITAL DOCUMENTS (the only source you may use):

${docs}

---

CLINICIAN'S QUESTION: ${query}`;
}
