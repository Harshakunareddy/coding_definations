PS E: \coding_definations\task - supra > npm start

    > supra - hospital - ai@1.0.0 start
        > node server.js


  Supra Hospital AI Assistant
http://localhost:3000
15 knowledge documents | 7 safety rules
LLM: OpenRouter(openai / gpt - 4o - mini)


══════════════════════════════════════════════
  PIPELINE START
══════════════════════════════════════════════
QUERY: "Patient Rajan has knee pain, what should I prescribe?"
  PATIENTS FOUND: [Rajan]

──────────────────────────────────────────────
  STEP 1 — RETRIEVAL(BM25 ranked results)
──────────────────────────────────────────────
  #1[SUPRA - KB-002] "Patient Rajan Drug Alert"  score = 35.42  matched = [patient, rajan, knee, pain, prescribe]  signals = [patient - entity match: Rajan | critical - severity boost]
  #2[SUPRA - KB-010] "Warfarin-NSAID Interaction"  score = 6.24  matched = [pain, prescribe]  signals = [critical - severity boost]
  #3[SUPRA - KB-001] "Post-TKR Pain Management"  score = 6.17  matched = [knee, pain]  signals = [none]       
  #4[SUPRA - KB-006] "TKR Discharge Rule"  score = 1.66  matched = [patient]  signals = [critical - severity boost]
  #5[SUPRA - KB-015] "Emergency Codes"  score = 1.25  matched = [patient]  signals = [none]

──────────────────────────────────────────────
  STEP 2 — FILTER
──────────────────────────────────────────────
topScore = 35.42  floor = 17.71  COVERAGE_FLOOR = 6
noCoverage = false(top doc score 35.42 >= 6)
  Docs passing filter(will be sent to AI):
    ✅[SUPRA - KB-002] "Patient Rajan Drug Alert"  score = 35.42

──────────────────────────────────────────────
  STEP 3 — SAFETY RULES
──────────────────────────────────────────────
  🔴 RULE FIRED: [RULE - PT - RAJAN - NSAID]  enforcement = hard_block
blockedDrugs = [nsaid, nsaids, ibuprofen, brufen, advil, motrin, diclofenac, voveran, voltaren, aspirin, acetylsalicylic, ecosprin, disprin, naproxen, naprosyn, ketorolac, toradol, indomethacin, indocin, celecoxib, celebrex, etoricoxib, etozox, aceclofenac, acenac, mefenamic, meftal, piroxicam, nimesulide, nimulid, ketoprofen, combiflam]
safe_alternative = "Paracetamol 650mg QDS (Supra formulary brand: Calpol / Dolo). Escalate to Tramadol 50mg if pain remains severe. Discuss with Cardiology before any change to antiplatelet therapy."    
  All blocked drugs: [nsaid, nsaids, ibuprofen, brufen, advil, motrin, diclofenac, voveran, voltaren, aspirin, acetylsalicylic, ecosprin, disprin, naproxen, naprosyn, ketorolac, toradol, indomethacin, indocin, celecoxib, celebrex, etoricoxib, etozox, aceclofenac, acenac, mefenamic, meftal, piroxicam, nimesulide, nimulid, ketoprofen, combiflam]

──────────────────────────────────────────────
  STEP 4 — FORCE - INCLUDE(safety rule sources)
──────────────────────────────────────────────
  ✅[SUPRA - KB-002] already in topHits — no force - include needed

──────────────────────────────────────────────
  STEP 5 — LLM CALL
──────────────────────────────────────────────
  Sending 1 doc(s) to AI: [SUPRA - KB-002]
  Calling AI...
  LLM ok = true  model = "openai/gpt-4o-mini"  error = none
  AI answer preview: "**Answer** - Prescribe Paracetamol for pain management.  **Supra specifics** -  - **Paracetamol**: 650mg QDS (Supra form..."

──────────────────────────────────────────────
  STEP 6 — PICK ANSWER
──────────────────────────────────────────────
mode = "llm_governed"(AI answered ✅)

──────────────────────────────────────────────
  STEP 7 — OUTPUT GUARD
──────────────────────────────────────────────
  ✅ Output guard PASSED — no blocked drugs in answer

──────────────────────────────────────────────
  STEP 8 — HALLUCINATION CHECK
──────────────────────────────────────────────
Citations in answer : [none]
  Hallucinated IDs: [none ✅]

══════════════════════════════════════════════
  PIPELINE DONE  mode = "llm_governed"  latency = 4445ms
══════════════════════════════════════════════
