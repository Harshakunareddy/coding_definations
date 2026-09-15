function expandBlocks(blocks, drugClasses) {
  const out = new Set();
  for (const b of blocks) {
    if (drugClasses[b]) {
      for (const drug of drugClasses[b]) out.add(drug.toLowerCase());
    } else {
      out.add(String(b).toLowerCase());
    }
  }
  return [...out];
}

function matchesAny(text, terms) {
  return terms.some((t) => text.includes(t.toLowerCase()));
}

export function evaluateRules(query, retrievedDocs, ruleset) {
  const text = ` ${query.toLowerCase()} `;
  const { drug_classes: drugClasses, rules } = ruleset;
  const fired = [];

  const retrievedPatients = retrievedDocs.map((r) => r.doc.patient).filter(Boolean);

  for (const rule of rules) {
    let hit = false;

    if (rule.trigger.patient) {
      const p = rule.trigger.patient.toLowerCase();
      hit = text.includes(p) || retrievedPatients.some((rp) => rp.toLowerCase() === p);
    }

    if (!hit && rule.trigger.any_term) {
      hit = matchesAny(text, rule.trigger.any_term);
    }

    if (!hit && rule.trigger.all_of) {
      hit = rule.trigger.all_of.every((group) => matchesAny(text, group));
    }

    if (hit) {
      fired.push({
        id: rule.id,
        type: rule.type,
        enforcement: rule.enforcement,
        message: rule.message,
        safe_alternative: rule.safe_alternative,
        source: rule.source,
        blocked_drugs: expandBlocks(rule.blocks || [], drugClasses)
      });
    }
  }

  const blockedDrugs = [...new Set(fired.flatMap((f) => f.blocked_drugs))];
  return { fired, blockedDrugs };
}

const NEGATION_CUES = [
  'avoid', 'avoided', 'avoiding', 'no ', 'not ', 'never', 'non-', 'without',
  'contraindicat', 'refuse', 'refused', 'refusal', 'withhold', 'withheld',
  'do not', "don't", 'must not', 'cannot', 'can not', 'instead of', 'rather than',
  'prohibit', 'forbidden', 'banned', 'exclude', 'stop', 'discontinue', 'hold',
  'blocked', 'unsafe', 'danger', 'risk of', 'allerg', 'absolute',
  'preferred over', 'chosen over', 'in place of', 'as an alternative to',
  'safer than', 'in preference to', 'not ', 'no '
];

const CLASS_LABELS = new Set(['nsaid', 'nsaids', 'sulfonylurea', 'sulfonylureas']);

const PRESCRIBING_CUES = [
  'give', 'giving', 'prescribe', 'prescribing', 'start', 'started', 'administer',
  'use ', 'using', 'recommend', 'switch to', 'add ', 'consider', 'offer', 'take',
  'first-line', 'first line', 'option', 'suitable', 'appropriate', 'can have'
];

const CLAUSE_BREAK =
  /[.!?;]+|\n(?!\s*(?:[-*•]|\d+[.)]))|\\bbut\\b|\\bhowever\\b|\\balthough\\b|\\bwhereas\\b|\\bexcept\\b/g;
const MAX_CLAUSE_LOOKBACK = 260;

function normaliseListMarkers(text) {
  return text.replace(
    /(\n[ \t]*)(\d{1,2})([.)])([ \t])/g,
    (_, lead, digits, punct, trail) => lead + '-'.repeat(digits.length) + ' ' + trail
  );
}

function clauseBounds(lowerText, matchIndex) {
  let start = 0;
  let end = lowerText.length;
  CLAUSE_BREAK.lastIndex = 0;
  let m;
  while ((m = CLAUSE_BREAK.exec(lowerText)) !== null) {
    const breakEnd = m.index + m[0].length;
    if (breakEnd <= matchIndex) {
      start = breakEnd;
    } else {
      end = m.index;
      break;
    }
  }
  CLAUSE_BREAK.lastIndex = 0;
  return { start: Math.max(start, matchIndex - MAX_CLAUSE_LOOKBACK), end };
}

function isNegatedMention(lowerText, matchIndex, matchLength) {
  const { start, end } = clauseBounds(lowerText, matchIndex);
  const before = lowerText.slice(start, matchIndex);
  const after = lowerText.slice(matchIndex + matchLength, end);
  return NEGATION_CUES.some((cue) => before.includes(cue) || after.includes(cue));
}

function hasPrescribingIntent(lowerText, matchIndex) {
  const before = lowerText.slice(Math.max(0, matchIndex - 55), matchIndex);
  return PRESCRIBING_CUES.some((cue) => before.includes(cue));
}

export function inspectOutput(answer, blockedDrugs) {
  const lower = normaliseListMarkers(answer.toLowerCase());
  const violations = [];

  for (const drug of blockedDrugs) {
    const re = new RegExp(`\\b${drug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    let m;
    while ((m = re.exec(lower)) !== null) {
      if (CLASS_LABELS.has(drug) && !hasPrescribingIntent(lower, m.index)) continue;
      if (!isNegatedMention(lower, m.index, m[0].length)) {
        const start = Math.max(0, m.index - 70);
        violations.push({
          drug,
          context: answer.slice(start, Math.min(answer.length, m.index + 70)).trim()
        });
        break;
      }
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}

export function buildDeterministicAnswer(permitted, fired) {
  const hardBlocks = fired.filter((f) => f.enforcement === 'hard_block');
  const advisories = fired.filter((f) => f.enforcement === 'advisory');
  const lines = [];

  for (const b of hardBlocks) {
    if (b.safe_alternative) lines.push(`**Do this instead:** ${b.safe_alternative}`, '');
  }

  for (const r of permitted) {
    const d = r.doc;
    const attribution = [d.decided_by, d.effective_date].filter(Boolean).join(', ');
    lines.push(`**${d.title}** [${d.id}]`);
    lines.push(d.content);
    if (attribution) lines.push(`*${attribution}*`);
    lines.push('');
  }

  if (!permitted.length && !hardBlocks.length) {
    lines.push(
      'No Supra Hospital policy was found covering this question. ' +
      'This assistant answers only from Supra protocols, so it will not offer general medical advice here. ' +
      'Escalate to the departmental HOD or the Pharmacy & Therapeutics Committee.'
    );
    lines.push('');
  }

  for (const a of advisories) {
    lines.push(`**Also note:** ${a.message} [${a.source}]`);
  }

  return lines.join('\n').trim();
}
