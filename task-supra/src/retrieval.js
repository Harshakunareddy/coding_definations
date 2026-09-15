const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'of', 'to',
  'in', 'on', 'at', 'for', 'with', 'and', 'or', 'but', 'if', 'then', 'than', 'that',
  'this', 'these', 'those', 'it', 'its', 'as', 'by', 'from', 'we', 'our', 'us', 'i',
  'me', 'my', 'you', 'your', 'do', 'does', 'did', 'can', 'could', 'should', 'would',
  'will', 'shall', 'may', 'might', 'must', 'have', 'has', 'had', 'what', 'when',
  'where', 'who', 'how', 'why', 'which', 'about', 'tell', 'give', 'get', 'please'
]);

const SYNONYMS = {
  tkr: ['total', 'knee', 'replacement', 'arthroplasty'],
  thr: ['total', 'hip', 'replacement', 'arthroplasty'],
  dvt: ['deep', 'vein', 'thrombosis', 'prophylaxis', 'clot'],
  vte: ['deep', 'vein', 'thrombosis', 'prophylaxis'],
  painkiller: ['pain', 'analgesia', 'analgesic'],
  painkillers: ['pain', 'analgesia', 'analgesic'],
  analgesic: ['pain', 'analgesia'],
  analgesia: ['pain'],
  nsaid: ['ibuprofen', 'diclofenac', 'aspirin', 'nsaids'],
  nsaids: ['ibuprofen', 'diclofenac', 'aspirin', 'nsaid'],
  dm: ['diabetes', 'diabetic'],
  t2dm: ['diabetes', 'diabetic', 'type', '2'],
  diabetes: ['diabetic', 'dm'],
  diabetic: ['diabetes', 'dm'],
  sepsis: ['septic', 'bundle', 'lactate'],
  septic: ['sepsis', 'bundle'],
  lmwh: ['enoxaparin', 'heparin'],
  prophylaxis: ['prevention', 'preventive'],
  postop: ['post', 'op', 'surgery', 'surgical'],
  'post-op': ['post', 'op', 'surgery', 'surgical'],
  surgery: ['surgical', 'operative', 'post-op'],
  meds: ['medication', 'drug'],
  medication: ['drug', 'medicine'],
  medicine: ['drug', 'medication'],
  drug: ['medication', 'medicine'],
  prescribe: ['prescription', 'give', 'start'],
  handover: ['handoff', 'sbar', 'shift'],
  handoff: ['handover', 'sbar', 'shift'],
  budget: ['finance', 'financial', 'cost', 'crore'],
  vendor: ['implant', 'supplier', 'procurement'],
  code: ['emergency', 'codes'],
  fasting: ['fast', 'ekadashi', 'npo'],
  fast: ['fasting', 'ekadashi'],
  discharge: ['home', 'send'],
  bleed: ['bleeding', 'haemorrhage', 'hemorrhage'],
  bleeding: ['bleed', 'haemorrhage']
};

export function knownPatients(corpus) {
  return [...new Set(corpus.map((d) => d.patient).filter(Boolean))];
}

export function tokenize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^-+|-+$/g, ''))
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function expand(tokens) {
  const out = [...tokens];
  for (const t of tokens) {
    if (SYNONYMS[t]) out.push(...SYNONYMS[t]);
  }
  return out;
}

export function buildIndex(corpus) {
  const docs = corpus.map((doc) => {
    const text = [
      doc.title, doc.title, doc.title,
      (doc.tags || []).join(' '), (doc.tags || []).join(' '),
      doc.content,
      doc.department,
      doc.doc_type.replace(/_/g, ' '),
      doc.patient || ''
    ].join(' ');
    const terms = tokenize(text);

    const tf = new Map();
    for (const t of terms) tf.set(t, (tf.get(t) || 0) + 1);
    return { doc, tf, length: terms.length };
  });

  const df = new Map();
  for (const d of docs) {
    for (const t of d.tf.keys()) df.set(t, (df.get(t) || 0) + 1);
  }

  const avgLength = docs.reduce((s, d) => s + d.length, 0) / docs.length;
  return { docs, df, avgLength, N: docs.length };
}

const K1 = 1.5;
const B = 0.75;

export function search(index, query, { corpus } = {}) {
  const rawTokens = tokenize(query);
  const queryTokens = expand(rawTokens);
  const qLower = query.toLowerCase();

  const patients = corpus ? knownPatients(corpus) : [];
  const mentionedPatients = patients.filter((p) => qLower.includes(p.toLowerCase()));

  const scored = index.docs.map(({ doc, tf, length }) => {
    let score = 0;
    const matchedTerms = new Set();

    for (const term of queryTokens) {
      const f = tf.get(term);
      if (!f) continue;
      matchedTerms.add(term);
      const n = index.df.get(term) || 0;
      const idf = Math.log(1 + (index.N - n + 0.5) / (n + 0.5));
      score += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + B * (length / index.avgLength))));
    }

    const signals = [];

    if (doc.patient) {
      if (!mentionedPatients.includes(doc.patient)) {
        return {
          doc,
          score: 0,
          matchedTerms: [],
          signals: [`excluded: record belongs to ${doc.patient}, not named in this query`]
        };
      }
      score += 12;
      signals.push(`patient-entity match: ${doc.patient}`);
    }

    if (doc.severity === 'critical' && matchedTerms.size > 0) {
      score *= 1.35;
      signals.push('critical-severity boost');
    }

    return { doc, score, matchedTerms: [...matchedTerms], signals };
  });

  scored.sort((a, b) => b.score - a.score);

  const byId = new Map(scored.map((s) => [s.doc.id, s]));
  for (const hit of scored.filter((s) => s.score > 3)) {
    for (const linkedId of hit.doc.linked_docs || []) {
      const linked = byId.get(linkedId);
      if (linked && linked.score < hit.score) {
        linked.score = Math.max(linked.score, hit.score * 0.85);
        linked.signals.push(`linked from ${hit.doc.id}`);
      }
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return { results: scored, mentionedPatients, queryTokens: [...new Set(queryTokens)] };
}
