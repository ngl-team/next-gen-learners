# Artificial Intelligence at a $3B Community Bank: A Research Brief for Union Savings Bank

**Prepared at the request of**: Frank Rowella, Director, Union Savings Bank
**Intended readers**: USB Board of Directors and Chelen Reyes, CEO
**Author**: Brayan Tenesaca
**Date**: May 3, 2026

---

## 0. Cover Memo

Frank,

You said in early May that the USB board has been asked to write the bank's AI policy, and that the conversation around the table is still circling the same three things: regulation, client information leaving the bank, and cybersecurity. This brief is built specifically around those three concerns and the asset profile of USB. It is not a sales document and there is no service offer in it. It is a thank-you for the partnership conversation you spent on me last week.

**The five things the paper says, in order of board relevance:**

1. The megabank AI playbook does not transfer to a $3B community bank. The right reference set is Bankwell ($3.2B, CT), Webster, Eastern, Citizens, Live Oak, and Customers. Their public moves and public mistakes are mapped in Section 5.
2. Regulators have not issued an AI rule for community banks. They have made clear that AI is governed by the existing model risk and third-party risk frameworks (SR 11-7, OCC 2023-17, the FFIEC AIO booklet, CFPB Circulars 2022-03 and 2023-03, and the FinCEN 2018 Joint Statement). All cited with verifiable URLs in Section 4.
3. The board's instinct that "we should just ask AI" for the policy is closer to right than wrong, and Section 8 contains a working policy template that can be the starting point at the next board meeting.
4. The single highest-risk AI surface for USB right now is not a model the bank deploys. It is generative-AI-enabled fraud aimed at the bank, and email compromise is the leading vector. FinCEN issued the first formal Deepfake Alert (FIN-2024-Alert004) in November 2024.
5. A practical, sequenced 12-month roadmap exists for a community bank starting from zero. It is in Section 6. Month one is policy and inventory, not technology purchase.

**What matters most to read carefully:**

- For Frank: Sections 2, 4, and 8. The community-bank thesis, the regulatory frame, and the policy template you can hand the board.
- For Chelen: Sections 3, 5, 6, and 7. The use-case map, peer studies (with the contact section so peer CEOs are reachable), the 12-month roadmap, and the build-versus-buy reality.

**Author bio.** Brayan Tenesaca is an 18-year-old freshman at Babson College and the co-founder of Next Generation Learners (NGL), a sovereign-data AI implementation firm working with Northeast school districts and a few small private-sector clients. He has been mentored by Frank Rowella for five years. He is writing this paper as a gift, not as a vendor pitch. Reachable at brayan@nextgenerationlearners.com.

---

## 1. Executive Summary

A $3B community bank like USB faces a different AI problem than JPMorgan or Citizens. The community bank cannot afford a 24-person AI governance team. It cannot fund a $300M three-year transformation. It cannot embed OpenAI engineers in its operations on a multi-year deal. Yet it is governed by the same SR 11-7, the same FFIEC examination handbook, the same CFPB adverse-action rule, and the same BSA expectations as banks 25 times its size.

The asymmetry has a single resolution: a community bank's AI strategy must be vendor-led and governance-first, not model-build-first. The bank's competitive advantage is not its ability to train a model. It is the trust relationship and local data its lenders accumulate over decades. The board's job is to write the policy that lets the bank use AI without leaking that trust.

The paper recommends a six-part posture for USB:

1. **Adopt the NIST AI Risk Management Framework as the spine of the bank's AI policy.** It is the framework regulators and bank counsel are converging on.
2. **Inventory every AI tool already in the building.** This includes the LLM features inside Microsoft 365, the AI features inside the bank's core, the fraud and AML systems, and any employee personal use of ChatGPT. The inventory is the first deliverable, not the policy.
3. **Treat client information leakage as a contract-and-architecture problem, not a policy problem.** Section 7 names the vendors that contractually do not train on bank data and that offer tenant isolation.
4. **Make the BSA and fraud function the first AI value-creation use case.** Verafin or Abrigo. Both have 1,000+ community-bank deployments. The board's BSA risk and the board's AI ambition meet in the same investment.
5. **Wait on AI in credit underwriting.** CFPB Circulars 2022-03 and 2023-03 made adverse-action explainability a strict-liability problem. A community bank does not have to be the test case.
6. **Treat board and senior-staff AI literacy as a separate program, not a byproduct of vendor demos.** A two-day curriculum is sketched in Section 8.

The bank that executes this posture in the next 12 months will be at the front of the Connecticut community-bank pack. The bank that does nothing will not be punished by regulators in 2026, but it will be visibly behind Bankwell, Webster, and Eastern by the end of 2027.

---

## 2. The Community-Bank AI Thesis

Most published AI-in-banking writing assumes the reader is JPMorgan. JPMorgan has 2,000 data scientists, an in-house large language model (LLM Suite), and a Chief Data and Analytics Officer who reports to the CEO. None of that is reproducible at $3B in assets.

The community-bank thesis runs in three claims.

**Claim 1: The community bank's competitive advantage is local data and local trust, not model quality.** A megabank's AI advantage compounds because it has more transactions, more product lines, and more data engineers. A community bank cannot win that race. It can win the race for which lender remembers that a borrower's seasonal revenue dipped in 2008 and recovered, and which lender knows the borrower's children. AI's role at a community bank is to take the friction out of that relationship, not to replace it with a model.

**Claim 2: The community bank's binding constraint is governance bandwidth, not technology spend.** The Treasury report on AI cybersecurity risk (March 2024) put a name to this: the "capability gap" between large institutions and smaller ones is widening, and smaller institutions face higher concentration risk because they depend on a handful of vendors.[^treasury] A $3B bank that buys five AI tools without a governance framework around them is in a worse position than a $3B bank that runs zero AI tools.

**Claim 3: The community bank's regulatory exposure is asymmetric.** A community bank does not get the legal-team cushion of a megabank. A single OCC or FDIC enforcement action on a model risk failure or a third-party data breach can dominate the bank's earnings narrative for two quarters. The community bank therefore should not be a regulatory test case. It should be the bank that adopts AI with discipline that is visible to its examiners.

The practical translation:

- **Build no models.** Buy them.
- **Run no AI in credit decisions** until the explainability problem is settled (CFPB Circulars 2022-03 and 2023-03; see Section 4).
- **Run AI heavily in BSA, fraud, internal productivity, and customer service.** These are the four areas where the technology is mature, the vendor field is competitive, and the regulatory exposure is well-understood.
- **Make policy and inventory the first deliverable**, ahead of any vendor decision.

[^treasury]: U.S. Department of the Treasury, "Managing Artificial Intelligence-Specific Cybersecurity Risks in the Financial Services Sector," March 27, 2024. https://home.treasury.gov/system/files/136/Managing-Artificial-Intelligence-Specific-Cybersecurity-Risks-In-The-Financial-Services-Sector.pdf

---

## 3. The Seven Use-Case Map for USB

Each use case is rated on a three-axis scorecard:

- **Regulatory exposure**: Low / Medium / High. Reflects how directly an examiner has prescribed expectations.
- **Implementation risk**: Low / Medium / High. Reflects vendor maturity, integration complexity, and reversibility.
- **Rough first-year ROI**: Stated as efficiency gain, basis-point uplift, or risk reduction. ROI ranges are drawn from peer disclosures in Section 5 and vendor case studies in Section 7.

### 3.1 AI Policy and Governance

This is the foundation. Without it, the other six use cases either do not start or start unsafely.

- **What it is.** A board-approved policy that defines AI for USB, sets a risk-tiering framework, names the AI inventory owner, defines vendor diligence requirements, and specifies prohibited uses (e.g., consumer credit decisions made by AI without human override).
- **Regulatory exposure**: Medium. There is no current rule requiring a community bank to have an AI policy. There is rapidly converging examiner expectation that a bank will have one when it has any AI in production. SR 11-7 and OCC 2011-12 already require model governance; an AI policy operationalizes that for AI specifically.
- **Implementation risk**: Low. The deliverable is a document and an inventory.
- **Rough first-year ROI**: Not measured in dollars. Measured in defensibility. A bank with an approved AI policy and a current AI inventory enters its next IT exam in a different posture than one without.
- **Recommended structure**: NIST AI RMF 1.0 as the framework, mapped to the FFIEC AIO booklet AI/ML section. Template in Section 8.

### 3.2 BSA/AML and Fraud Detection

This is the highest-leverage AI use case for USB. Risk reduction and efficiency gain are aligned.

- **What it is.** A modern, AI-driven transaction monitoring system replacing or augmenting the bank's current rules-based BSA platform. Adds behavioral analytics for fraud (ACH, wire, check, P2P).
- **Regulatory exposure**: Medium-High. BSA is heavily examined, but FinCEN's 2018 Joint Statement is a regulatory permission slip for AI-driven AML pilots, including explicit assurance that pilots that fail will not draw supervisory criticism.[^fincen2018]
- **Implementation risk**: Medium. Mature vendors (Verafin, Abrigo, Hawk via CSI). 12-18 month implementation typical.
- **Rough first-year ROI**: 30-50% reduction in false-positive alerts is a typical industry-cited range. Headcount typically shifts from triage to investigation rather than reducing.
- **Recommended vendors**: Verafin (Nasdaq-owned, 2,700+ FI customers globally), Abrigo (Accel-KKR backed, community-bank focused). See Section 7.

[^fincen2018]: FinCEN with the four federal banking agencies, "Joint Statement on Innovative Industry Approaches to AML Compliance," December 3, 2018. https://www.fincen.gov/news/news-releases/treasurys-fincen-and-federal-banking-agencies-issue-joint-statement-encouraging

### 3.3 Customer-Facing Automation Under PII Constraints

This is the use case where Frank's "client information going out" concern lives directly. The architectural question is sovereign-data, not model-quality.

- **What it is.** AI-assisted retail and small-business interactions through the bank's website, mobile app, and contact center. Includes virtual assistants, agent-assist tools, intelligent IVR, and proactive outreach.
- **Regulatory exposure**: Medium. GLBA Safeguards Rule applies to any vendor handling NPI. The 2021 FTC amendments (effective 2023) require encryption, MFA, and board reporting on the information security program.[^ftc2021] CFPB UDAAP authority covers any deceptive AI behavior.
- **Implementation risk**: Medium. The category has matured; the integration risk is fitting AI on top of the bank's existing core (Jack Henry, FIS, Fiserv, COCC) and digital banking provider (Q2, Alkami).
- **Rough first-year ROI**: 20-40% containment of customer service contacts in the AI channel is a typical target. Citizens has stated it expects 50%+ of retail call-center calls to be handled by non-humans by year-end 2026.[^citizensaicare]
- **Sovereign-data architectural requirement**: Any vendor under contract must (1) commit in writing not to train models on USB customer data, (2) provide tenant isolation so USB data is not co-mingled with other banks' data in any retrieval index, and (3) submit to USB's model risk validation. This is contractable today with Microsoft, Glia, Posh, and Kasisto.
- **Recommended vendors**: Glia (700+ FI customers, fixed pricing), Posh (community-bank-only, MIT spinoff). See Section 7.

[^ftc2021]: FTC, "Standards for Safeguarding Customer Information," final rule, December 9, 2021. https://www.federalregister.gov/documents/2021/12/09/2021-25736/standards-for-safeguarding-customer-information
[^citizensaicare]: Penny Crosman, "Inside Citizens' plan to reimagine itself with AI," American Banker, July 2025. https://www.americanbanker.com/news/inside-citizens-plan-to-reimagine-itself-with-ai

### 3.4 Loan Underwriting Decision Support

The board should approach this use case with the most caution. Recommendation: do not deploy AI in consumer credit decisions in 2026. Use AI for support, not for the decision.

- **What it is.** AI used to extract information from documents (tax returns, bank statements, K-1s), to populate underwriting templates, to flag anomalies, and to assist commercial credit memos.
- **Regulatory exposure**: High. CFPB Circular 2022-03 (May 2022) established that ECOA and Regulation B's adverse-action-notice requirements apply identically to AI-driven credit decisions. A creditor's inability to explain its own model is not a defense.[^cfpb2022] CFPB Circular 2023-03 (September 2023) extended this: creditors cannot fall back on the CFPB sample form checkboxes when those reasons do not match the actual driver of denial.[^cfpb2023] The CT Attorney General's February 2026 AI memorandum confirmed that existing CT consumer protection and civil rights laws apply to AI-driven lending, with no safe harbor for unintentional discriminatory output.[^ctag]
- **Implementation risk**: High. The fair-lending and explainability stakes are unforgiving. Numerated, nCino's nIQ, and Zest AI all have community-bank deployments, but each requires fair-lending governance the bank does not currently have.
- **Rough first-year ROI**: 20-30% efficiency gain on commercial credit memo drafting is achievable through document AI alone, without putting AI into the credit decision itself. This is the right place to start.
- **Recommended posture**: Use Hebbia, nCino's document intelligence, or a Microsoft Copilot deployment to assist underwriters with document extraction and memo drafting. Do not deploy AI to make or recommend the credit decision until the bank has stood up a fair-lending model testing capability (FairPlay AI is the leading vendor; backed by JPMorgan Chase).[^fairplay]

[^cfpb2022]: CFPB Consumer Financial Protection Circular 2022-03, May 26, 2022. https://www.consumerfinance.gov/compliance/circulars/circular-2022-03-adverse-action-notification-requirements-in-connection-with-credit-decisions-based-on-complex-algorithms/
[^cfpb2023]: CFPB Consumer Financial Protection Circular 2023-03, September 19, 2023. https://www.consumerfinance.gov/compliance/circulars/circular-2023-03-adverse-action-notification-requirements-and-the-proper-use-of-the-cfpbs-sample-forms-provided-in-regulation-b/
[^ctag]: Office of the Connecticut Attorney General, "Memorandum on Artificial Intelligence," February 25, 2026. https://portal.ct.gov/ag/press-releases/2026-press-releases/attorney-general-tong-releases-memorandum-on-artificial-intelligence
[^fairplay]: Penny Crosman, "JPMorgan Chase, Nyca invest in AI testing firm FairPlay," American Banker. https://www.americanbanker.com/news/jpmorgan-chase-nyca-invest-in-ai-testing-firm-fairplay

### 3.5 Internal Research and Document Drafting

This is where Frank's "just ask AI" instinct becomes real. It is also the lowest-risk place to start.

- **What it is.** Microsoft Copilot, ChatGPT Enterprise, or Claude for Enterprise deployed to the bank's full headcount for internal productivity: drafting board materials, summarizing examiner letters, drafting policies, summarizing internal meetings, building Excel models.
- **Regulatory exposure**: Low when contracted correctly. Vendor must contractually agree not to train on bank data and must offer tenant isolation. This is standard with Microsoft Copilot for M365, OpenAI Enterprise, and Anthropic Enterprise contracts.
- **Implementation risk**: Low. The bank's IT team can deploy Copilot in 60 days. The risk is human-side: employees pasting customer information into consumer ChatGPT.
- **Rough first-year ROI**: Bank of Queensland publicly cites 99% / 88% / 75% time savings on internal manuals, marketing copy, and HR drafts respectively after Copilot deployment.[^cornerstone] Cornerstone Advisors' 2026 survey found 49% of US banks and 59% of US credit unions report some generative AI use.
- **Recommended vendor**: Microsoft 365 Copilot at approximately $21 per user per month, given the assumption that USB is already on Microsoft 365. This is the lowest-risk first AI deployment any community bank can make.

[^cornerstone]: Cornerstone Advisors via FinXTech, "Copilot Efficiencies Could Translate Into Savings for Financial Institutions." https://finxtech.com/copilot-efficiencies-could-translate-into-savings-for-financial-institutions/

### 3.6 Cybersecurity and Threat Detection

This is on the board's list and it deserves its own line. AI's role in cybersecurity is mostly about defense against AI-enabled attacks, not just AI as a defense tool.

- **What it is.** AI-powered email defense (the leading attack vector), AI-powered managed detection and response, identity attack detection, and deepfake and synthetic-identity defense at onboarding.
- **Regulatory exposure**: Medium. NYDFS Part 500 (Second Amendment, November 2023) is the de facto Northeast benchmark for board-level cyber accountability.[^nydfs500] FFIEC IT Handbook AIO booklet treats AI/ML as an in-scope examined IT control as of 2021.[^ffiecaio] FinCEN issued FIN-2024-Alert004 in November 2024 specifically on deepfake-enabled fraud against banks, with nine red-flag indicators and a SAR filing instruction.[^fincendeep]
- **Implementation risk**: Low to Medium. Vendor field is mature.
- **Rough first-year ROI**: Avoidance, not creation. Email-based BEC fraud regularly costs community banks six- and seven-figure write-downs. A single prevented incident pays for the program.
- **Recommended vendors**: Abnormal Security for email (sits on top of M365), Arctic Wolf for managed detection and response (Gartner Customers' Choice 2026, fit for banks without an in-house SOC), SentinelOne via COCC for endpoint (CT-relevant given COCC's CT headquarters and partnership). See Section 7.

[^nydfs500]: NYDFS, "Cybersecurity Requirements for Financial Services Companies," 23 NYCRR Part 500, Second Amendment, adopted November 1, 2023. https://www.dfs.ny.gov/system/files/documents/2023/12/rf23_nycrr_part_500_amend02_20231101.pdf
[^ffiecaio]: FFIEC IT Examination Handbook, Architecture, Infrastructure, and Operations Booklet, Section VII.D (Artificial Intelligence and Machine Learning), June 30, 2021. https://ithandbook.ffiec.gov/it-booklets/architecture-infrastructure-and-operations/vii-evolving-technologies/viid-artificial-intelligence-and-machine-learning/
[^fincendeep]: FinCEN Alert FIN-2024-Alert004, "Fraud Schemes Involving Deepfake Media Targeting Financial Institutions," November 13, 2024. https://www.fincen.gov/news/news-releases/fincen-issues-alert-fraud-schemes-involving-deepfake-media-targeting-financial

### 3.7 Director and Staff AI Literacy Programs

A bank's AI policy is only as good as the literacy of the people running the policy. This use case is small in dollars and outsized in leverage.

- **What it is.** A formal AI literacy curriculum at three levels: a half-day board session (the policy and the fiduciary lens), a full-day senior management session (the operating implications), and a one-hour all-employee module with a use-case playbook for the bank's chosen tools.
- **Regulatory exposure**: Low directly, High indirectly. Examiners increasingly ask in interviews whether board and management can articulate the bank's AI posture. Visible literacy is a defensibility asset.
- **Implementation risk**: Low.
- **Rough first-year ROI**: Not measured in dollars. Measured in board-meeting quality.
- **Recommended structure**: Curriculum outline in Section 8.

---

## 4. Risk and Regulatory Framework

The most useful frame for the board is that no AI-specific community-bank rule has been issued, and likely will not be in 2026. AI is governed through eight existing or near-existing instruments. The board should treat these as the controlling text.

### 4.1 The Eight Controlling Instruments

**(a) NIST AI Risk Management Framework 1.0 (January 2023).**[^nistairmf] Voluntary, but the de facto governance spine. Four functions: Govern, Map, Measure, Manage. Treasury, OCC, and FDIC have all referenced it. The companion Generative AI Profile (NIST AI 600-1, July 2024) extends the framework to GenAI-specific risks (prompt injection, data leakage, IP exposure).[^nistgenai]

**(b) Federal Reserve SR 11-7 / OCC Bulletin 2011-12 (April 2011).**[^sr117][^occ201112] The foundational model risk management guidance. Three pillars: development and implementation, validation, governance. The "effective challenge" doctrine. Defines what counts as a "model" and what triggers documentation, inventory, and validation duties. Every AI/ML system used in lending, BSA, or pricing falls under this.

**(c) OCC Bulletin 2023-17 / FDIC FIL-29-2023 (June 2023).**[^occ202317][^fdicfil29] The current operative interagency third-party risk standard, replacing OCC 2013-29 and OCC 2020-10. Risk-based lifecycle approach: planning, due diligence, contract negotiation, ongoing monitoring, termination. Every AI vendor is a "third-party relationship" under this guidance.

**(d) FFIEC IT Examination Handbook, AIO Booklet, AI/ML Section (June 2021).**[^ffiecaio2] Defines AI/ML for examiners, lists banking use cases (fraud detection, AML, credit scoring, cybersecurity, algorithmic trading), and identifies the risks examiners look for: data breach exposure from large training sets, algorithmic bias, lack of explainability, uncontrolled dynamic updating. Companion: FRB SR 21-11[^sr2111] and FDIC FIL-47-2021.[^fdicfil47]

**(e) CFPB Consumer Financial Protection Circulars 2022-03 and 2023-03.**[^cfpb20223][^cfpb20233] AI does not change adverse-action-notice requirements. A creditor cannot use a model it cannot explain. Sample form checkboxes do not protect a creditor when the actual reason for denial does not match.

**(f) FinCEN 2018 Joint Statement on Innovative Industry Approaches to AML Compliance.**[^fincen2018b] The regulatory permission slip for BSA/AML AI pilots. Pilots that fail will not draw supervisory criticism. Pilots that expose existing-program gaps will not necessarily trigger enforcement. Companion: FinCEN Alert FIN-2024-Alert004 (November 2024) on deepfake-enabled bank fraud.[^fincendeep2]

**(g) FTC Safeguards Rule (December 2021, with 2023 breach-notification amendment effective May 2024).**[^ftc20212] Banks are exempt from FTC jurisdiction directly, but their non-bank affiliates and many fintech/AI vendors are not. The Safeguards Rule sets the floor any AI vendor handling customer NPI must meet.

**(h) CT Attorney General Memorandum on AI (February 2026) and NYDFS 23 NYCRR Part 500 (Second Amendment, November 2023).**[^ctag2][^nydfs5002] State-level. The CT memo confirms existing CT consumer protection, civil rights, and antitrust laws already apply to AI used in credit, employment, and consumer-facing decisions, with explicit enforcement intent. NYDFS Part 500 is the de facto Northeast cybersecurity benchmark.

### 4.2 What Has Not Been Issued

To honor the no-fabrication standard, the following do not exist as of May 2026, and should not be cited:

- A dedicated Federal Reserve SR letter on generative AI.
- A dedicated SEC Division of Examinations Risk Alert specifically on AI.
- An OCC final rule or bulletin titled as AI guidance in 2024 or 2025.
- A Connecticut Department of Banking AI-specific rule.

The OCC's 2025 statements signal that an AI/MRM RFI is under consideration.[^occ2025] If it issues, it will likely accelerate community-bank examiner expectations.

[^nistairmf]: NIST, "Artificial Intelligence Risk Management Framework (AI RMF 1.0)," NIST AI 100-1, January 26, 2023. https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf
[^nistgenai]: NIST, "Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile," NIST AI 600-1, July 2024. https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf
[^sr117]: Federal Reserve, "Supervisory Guidance on Model Risk Management," SR 11-7, April 4, 2011. https://www.federalreserve.gov/boarddocs/srletters/2011/sr1107.htm
[^occ201112]: OCC Bulletin 2011-12, "Sound Practices for Model Risk Management." https://www.occ.gov/news-issuances/bulletins/2011/bulletin-2011-12.html
[^occ202317]: OCC Bulletin 2023-17, "Interagency Guidance on Third-Party Relationships: Risk Management," June 6, 2023. https://www.occ.gov/news-issuances/bulletins/2023/bulletin-2023-17.html
[^fdicfil29]: FDIC FIL-29-2023, "Interagency Guidance on Third-Party Relationships," June 6, 2023. https://www.fdic.gov/news/financial-institution-letters/2023/fil23029.html
[^ffiecaio2]: FFIEC IT Examination Handbook, AIO Booklet, AI/ML Section (June 2021). https://ithandbook.ffiec.gov/it-booklets/architecture-infrastructure-and-operations/vii-evolving-technologies/viid-artificial-intelligence-and-machine-learning/
[^sr2111]: Federal Reserve SR 21-11, "FFIEC AIO Examination Handbook," June 30, 2021. https://www.federalreserve.gov/supervisionreg/srletters/SR2111.htm
[^fdicfil47]: FDIC FIL-47-2021, "Updated FFIEC IT Examination Handbook AIO Booklet," June 30, 2021. https://www.fdic.gov/news/financial-institution-letters/2021/fil21047.html
[^cfpb20223]: CFPB Circular 2022-03, May 26, 2022. https://www.consumerfinance.gov/compliance/circulars/circular-2022-03-adverse-action-notification-requirements-in-connection-with-credit-decisions-based-on-complex-algorithms/
[^cfpb20233]: CFPB Circular 2023-03, September 19, 2023. https://www.consumerfinance.gov/compliance/circulars/circular-2023-03-adverse-action-notification-requirements-and-the-proper-use-of-the-cfpbs-sample-forms-provided-in-regulation-b/
[^fincen2018b]: FinCEN, "Joint Statement on Innovative Industry Approaches to AML Compliance," December 3, 2018. https://www.fincen.gov/news/news-releases/treasurys-fincen-and-federal-banking-agencies-issue-joint-statement-encouraging
[^fincendeep2]: FinCEN Alert FIN-2024-Alert004, November 13, 2024. https://www.fincen.gov/news/news-releases/fincen-issues-alert-fraud-schemes-involving-deepfake-media-targeting-financial
[^ftc20212]: FTC, "Standards for Safeguarding Customer Information," final rule, December 9, 2021. https://www.federalregister.gov/documents/2021/12/09/2021-25736/standards-for-safeguarding-customer-information
[^ctag2]: Office of the Connecticut Attorney General, AI Memorandum, February 25, 2026. https://portal.ct.gov/ag/press-releases/2026-press-releases/attorney-general-tong-releases-memorandum-on-artificial-intelligence
[^nydfs5002]: NYDFS, 23 NYCRR Part 500, Second Amendment, November 1, 2023. https://www.dfs.ny.gov/system/files/documents/2023/12/rf23_nycrr_part_500_amend02_20231101.pdf
[^occ2025]: OCC News Release 2025-38. https://www.occ.treas.gov/news-issuances/news-releases/2025/nr-occ-2025-38.html

### 4.3 Reputation Risk

This is what Frank named most directly in our April conversation: "client information going out... it could ruin your reputation which is a risk to the bank."

Reputation risk in an AI context resolves to four concrete failure modes:

1. **Customer NPI in a third-party model's training data.** Solved contractually (vendor commits not to train) and architecturally (tenant isolation). Verifiable in the OCC 2023-17 diligence process.
2. **Discriminatory output in an AI lending decision.** Solved by not deploying AI in consumer credit decisions until fair-lending model testing exists. CFPB exposure.
3. **Hallucinated information given to a customer in an AI service interaction.** Solved by retrieval-augmented generation grounded in the bank's own approved knowledge base, plus mandatory human escalation paths. UDAAP exposure if deceptive.
4. **Deepfake-enabled identity fraud at onboarding or in remote-channel servicing.** Solved by upgraded identity verification and the FinCEN red-flag indicators. BSA exposure.

A USB AI policy that addresses all four explicitly is defensible.

---

## 5. Peer-Institution Case Studies

Six banks were selected as the most relevant peer references for USB. Selection criteria: Northeast or geographically relevant; community or regional asset tier ($1B-$25B unless deliberately upmarket); demonstrably public AI activity; alive as a corporate entity in May 2026 (several merger-driven exclusions are noted in 5.7).

A note on contacts. Where an email was directly verified on the bank's own IR or press page, it is marked "VERIFIED." Where the email is inferred from the bank's domain pattern, it is marked "INFERRED. VERIFY BEFORE SENDING." A wrong email from this paper to a peer CEO is worse than no email. Chelen should treat every inferred address as a starting hypothesis.

### 5.1 Bankwell Financial Group (BWFG, New Canaan, CT). The Direct Peer

Bankwell is the closest single comparable in this paper. $3.2B in assets, Connecticut, FDIC-supervised. If USB has one peer to study, this is it.

**What they have built or are building:**
- Pilot of Cascading AI's Casca product for small-business loan lead prequalification. Bankwell publicly stated leads were "five or six times the quality" of organic.[^abwell]
- Microsoft Copilot deployed to approximately 175 employees out of approximately 200 total headcount, after starting with a 20-person pilot in marketing and credit operations.[^hbjbankwell]
- Anchor Connecticut customer for Kobalt Labs (compliance and risk-review automation).
- Brian Merritt named CTO in 2025 to advance digital capabilities.[^bwfgmerritt]

**What is publicly known about cost or scope:** Not disclosed. The Casca and Copilot deployments are operational, not capital-intensive.

**What worked:** Lead-quality multiplier from Casca. Broad Copilot adoption (~85% of headcount). Public AI narrative is consistent and disciplined.

**What is unresolved:** The bank had material strategic exposure shifts in 2024-2025 around commercial real estate. AI is part of an efficiency push, not a moonshot. The deeper question for the board: AI is helping at the margin, not transforming the bank.

**Why this matters to USB:** Bankwell is the same size, same state, same regulator overlay. Whatever they have done, USB can do.

**Contact section:**
- CEO: Christopher R. Gruseke. LinkedIn: https://www.linkedin.com/in/christopher-gruseke-42375267/
- IR contact: Investor contact page exists at https://investor.mybankwell.com/resources/investor-contacts/default.aspx but the live page should be checked before outreach. UNAVAILABLE as VERIFIED in this paper.
- Press contact: UNAVAILABLE as VERIFIED.
- Domain pattern: mybankwell.com. Pattern unverified. **INFERRED CEO email: cgruseke@mybankwell.com. VERIFY BEFORE SENDING.**

[^abwell]: Penny Crosman, "Bankwell Bank pilots generative AI in small-business lending," American Banker, February 8, 2024. https://www.americanbanker.com/news/bankwell-bank-pilots-generative-ai-in-small-business-lending
[^hbjbankwell]: Hartford Business Journal, "AI adoption accelerates across CT's banking industry." https://hartfordbusiness.com/article/ai-adoption-accelerates-across-cts-banking-industry/
[^bwfgmerritt]: Bankwell press release, "Bankwell Appoints Brian Merritt as Chief Technology Officer." https://investor.mybankwell.com/news/news-details/2025/Bankwell-Appoints-Brian-Merritt-as-Chief-Technology-Officer/default.aspx

### 5.2 Webster Financial / Webster Bank (WBS, Stamford, CT). The Dominant CT Peer

Webster is the largest Connecticut-headquartered bank. Approximately $80B in assets. While larger than USB, it sets the regulatory and competitive tone for CT banking.

**What they have built or are building:**
- Generative-AI proof-of-concepts in: intelligent internal search, syndicated commercial-loan workflow automation, customer-attrition prediction, and financial-statement summarization.[^cioweb]
- AI governance team of approximately 24 people, led by the chief enterprise architect and chief data officer, spanning technology, risk, compliance, and legal functions.
- Hiring "Managing Director, AI Engineer" publicly.[^webstercareer]

**What is publicly known about cost or scope:** Specific spend not disclosed. Governance structure size (24 people) is the most-cited public number.

**What worked:** Governance structure stood up early. HSA Bank gives Webster a unique data asset that pure-play community banks do not have.

**What is unresolved:** Per the CIO.com article, Webster is still in proof-of-concept phase. No announced production-scale AI deployment.

**Why this matters to USB:** Webster's published posture is the language a $3B traditional bank can adopt almost verbatim. The bank's spokesperson said: "A prudent and calculated approach to the adoption of AI technologies, aligning with our moderate risk appetite as a traditional financial institution." That sentence belongs in USB's policy.

**Contact section:**
- CEO: John R. Ciulla. LinkedIn: https://www.linkedin.com/in/john-r-ciulla/
- IR contact (VERIFIED): Emlen Harmon, Director of Investor Relations. eharmon@websterbank.com. Phone 212-309-7646.
- Press contact: UNAVAILABLE as VERIFIED.
- Domain pattern: websterbank.com (consumer/IR), websteronline.com (corporate). Pattern is mixed. Emlen Harmon is "eharmon@" (first-initial-last-name). **INFERRED CEO email: jciulla@websterbank.com. VERIFY BEFORE SENDING.**

[^cioweb]: CIO.com, "CIOs weigh where to place AI bets and how to de-risk them." https://www.cio.com/article/1313542/cios-weigh-where-to-place-ai-bets-and-how-to-de-risk-them.html
[^webstercareer]: Webster careers page. https://careers.websteronline.com/managing-director-ai-engineer/job/28772179

### 5.3 Eastern Bank / Eastern Bankshares (EBC, Boston, MA). The MA Neighbor

Eastern is a $25.5B Massachusetts bank, Boston-headquartered, FDIC-supervised. Recognized as one of community banking's "AI mavericks" by American Banker in 2024.[^ebcav]

**What they have built or are building:**
- November 2025: Expanded existing nCino partnership to add Consumer Banking and Mortgage to the existing Commercial loan-origination platform. Integrating Alloy for fraud and identity decisioning. Zennify is the implementation partner.[^ebcncino]
- Eastern Labs: a longstanding internal innovation hub.[^hbsab]
- Numerated, the digital business lending platform now owned by Moody's, was originally a Eastern Bank spin-out.

**What is publicly known about cost or scope:** Not disclosed. The nCino expansion is multi-product and likely a multi-year investment in the eight figures.

**What worked:** #1 SBA lender in Massachusetts for 17 consecutive years. The nCino-driven commercial origination machine is the operational backbone.

**What is unresolved:** Consumer banking and mortgage nCino implementation is still in delivery as of late 2025.

**Why this matters to USB:** Eastern is the proof point that a Northeast community/regional bank can stand up a coherent AI vendor stack (nCino + Alloy + Zennify) and a long-running innovation function. The Numerated lineage is also instructive: a community bank can spin out a tool that becomes a Moody's-acquired company.

**Contact section:**
- Executive Chair: Bob Rivers. LinkedIn: https://www.linkedin.com/in/bob-rivers-09b49213
- CEO: Denis K. Sheahan. Verify on https://investor.easternbank.com/governance/leadership-team/default.aspx
- IR contact (VERIFIED): InvestorRelations@easternbank.com. Andrew Hersom, SVP and Head of IR. Phone 860-707-4432.
- Press contact (VERIFIED): a.goodman@easternbank.com. Andrea Goodman. Phone 781-598-7847.
- Domain pattern: easternbank.com. Verified pattern is **first-initial.lastname@easternbank.com** (per a.goodman). **INFERRED CEO email: d.sheahan@easternbank.com. VERIFY BEFORE SENDING.**

[^ebcav]: American Banker, "How community bank mavericks compete in AI space." https://www.americanbanker.com/news/how-community-bank-mavericks-compete-in-ai-space
[^ebcncino]: nCino press release, "nCino, Eastern Bank Expand Partnership to Consumer and Mortgage Product Lines." https://www.ncino.com/news/ncino-eastern-bank-expand-partnership-consumer-mortgage-product-lines
[^hbsab]: Harvard Business School case study on Eastern Bank. https://www.hbs.edu/faculty/Pages/item.aspx?num=53399

### 5.4 Citizens Financial Group (CFG, Providence, RI). The Regional Benchmark

Citizens is approximately $220B in assets, the largest Northeast peer in this set. The bank is included not as a size comparable but as the source of the most disciplined public AI strategy commentary at any Northeast bank.

**What they have built or are building:**
- "Reimagining the Bank" is a three-year, $300M AI-driven transformation announced July 2025. 47 initiatives. Target: 50%+ of retail call-center calls handled by non-humans by year-end 2026.[^cfgam]
- Piloting agentic AI in fraud claims and complaint handling.[^cfgam2]
- 750 applications moved to cloud, 25 data centers eliminated. 10-15% infrastructure cost reduction realized.[^cfgts]
- Hyderabad hub opened for IT, data, and AI staff. Up to 1,000 staff by March 2026. Cognizant is the partner.[^cfghyd]

**What worked:** Named "Bank of the Year" by The Banker, December 2025.[^cfgboy] Infrastructure cost cuts already realized.

**What is unresolved:** $300M spend has not yet visibly translated to bottom-line operating leverage. Agentic call-center deployment is mid-rollout.

**Why this matters to USB:** Bruce Van Saun's stated approach is the right intellectual posture for a $3B bank too: "You have to walk before you run. If you have a 'thousand flowers bloom' strategy, you'll start spinning your wheels and you won't actually make the real impact."[^cfgvansaun] Citizens is what disciplined regional AI looks like at scale.

**Contact section:**
- CEO: Bruce Van Saun. LinkedIn: search "Bruce Van Saun Citizens Financial" directly. No canonical /in/ slug surfaced in research; LinkedIn company page confirms he is Chairman and CEO.
- IR contact: Kristin Silberberg is Head of IR. Contact page is at https://investor.citizensbank.com/about-us/investor-relations/contact-investor-relations.aspx. UNAVAILABLE as VERIFIED.
- Press contact: UNAVAILABLE as VERIFIED.
- Domain pattern: citizensbank.com. Pattern unverified.

[^cfgam]: Penny Crosman, "Inside Citizens' plan to reimagine itself with AI," American Banker, July 2025. https://www.americanbanker.com/news/inside-citizens-plan-to-reimagine-itself-with-ai
[^cfgam2]: American Banker, "Citizens details how AI is speeding everything up." https://www.americanbanker.com/news/citizens-details-how-ai-is-speeding-everything-up
[^cfgts]: Tearsheet, "How Citizens Bank is building GenAI with a five-year vision, not just quick fixes." https://tearsheet.co/artificial-intelligence/how-citizens-bank-is-building-genai-with-a-five-year-vision-not-just-quick-fixes/
[^cfghyd]: QA Financial, "Citizens launches Hyderabad hub to boost digital resilience." https://qa-financial.com/citizens-launches-hyderabad-hub-to-boost-digital-resilience/
[^cfgboy]: Citizens press release, December 16, 2025. https://investor.citizensbank.com/about-us/newsroom/latest-news/2025/2025-12-16-140837139.aspx
[^cfgvansaun]: Banking Dive interview with Bruce Van Saun, June 4, 2024. https://www.bankingdive.com/news/citizens-ceo-bruce-van-saun-ai-banking-cloud-digital-trends/717947/

### 5.5 Live Oak Bancshares (LOB, Wilmington, NC). The Cleanest Lending-AI Story

Live Oak is approximately $13B in assets and is the single bank in this set with the cleanest AI-deploys-into-loan-workflow public story.

**What they have built or are building:**
- August 19, 2025: Live Oak Ventures invested in Cascading AI (Casca). Live Oak participated in a $29M round alongside Huntington.[^lobcasca][^lobam]
- Live Oak is a design partner deploying Casca to automate the Live Oak Express SBA loan workflow. Target: approve in 1-2 days.

**What is publicly known about cost or scope:** Not disclosed beyond the Casca round size.

**What worked:** Casca deployed into the SBA loan flow at a bank whose franchise is small-business lending. If this works, it works at the bank that can least afford it not to.

**What is unresolved:** Casca is early-stage. Productionization risk. Live Oak's earnings have been pressured during this build.

**Why this matters to USB:** Live Oak is the proof point that AI in commercial loan origination is possible at a community-tier bank, but the implementation risk is real.

**Contact section:**
- CEO: James S. "Chip" Mahan III. LinkedIn (VERIFIED): https://www.linkedin.com/in/chipmahan/
- IR contact: Claire Parker per snippet evidence. claire.parker@liveoak.bank, phone 910-597-1592. UNAVAILABLE as VERIFIED.
- Press contact: UNAVAILABLE as VERIFIED.
- Domain pattern: liveoak.bank (primary), liveoakbank.com. Apparent pattern: **firstname.lastname@liveoak.bank**. **INFERRED CEO email: chip.mahan@liveoak.bank. VERIFY BEFORE SENDING.**

[^lobcasca]: Live Oak press release. https://investor.liveoak.bank/news/news-details/2025/Live-Oak-Ventures-Participates-in-Financing-of-Cascading-AI-Inc-/default.aspx
[^lobam]: American Banker, "Huntington, Live Oak to invest in, deploy gen-AI-based lending." https://www.americanbanker.com/news/huntington-live-oak-to-invest-in-deploy-gen-ai-based-lending

### 5.6 Customers Bancorp (CUBI, West Reading, PA). The Aspirational and Cautionary Tale

Customers is approximately $22B in assets and is the most aggressive AI bet in the Northeast peer set. It is included for instructional contrast: this is what USB is *not* going to do, and the board should understand why.

**What they have built or are building:**
- April 27, 2026: Multi-year strategic collaboration with OpenAI. OpenAI engineers embedded at the bank to redesign lending, deposits, and payments. Target: commercial loan close from 30-45 days down to approximately 7 days.[^cubibw][^cubiabb][^cubicnbc]
- 75% of workforce already using OpenAI-powered tools, built on a 2023 ChatGPT Enterprise rollout.
- Targeting efficiency ratio improvement from approximately 49% to low 40s by 2027.

**What worked:** Demonstrable workflow time compression in pilots. Deep CEO alignment around AI as an institutional thesis.

**What is unresolved:** The bank had Federal Reserve regulatory action in 2024 over crypto-related deposit risk management. Context matters when citing as a model.

**Why this matters to USB:** Customers is a usable cautionary tale. The bet is real, the narrative is bold, and the regulatory posture is exposed. A $3B community bank should not be the first community bank to embed OpenAI engineers in its operations.

**Contact section:**
- CEO: Sam Sidhu. LinkedIn (VERIFIED): https://www.linkedin.com/in/ssidhu
- Press / Communications Director: David Patti. Phone 610-451-9452. Email UNAVAILABLE as VERIFIED.
- Domain pattern: customersbank.com. Pattern unverified.

[^cubibw]: Customers Bank press release. https://www.businesswire.com/news/home/20260427319349/en/Customers-Bank-Announces-Strategic-Collaboration-with-OpenAI-to-Redefine-the-Commercial-Banking-Operating-Model
[^cubiabb]: American Banker, "OpenAI will embed staff at Customers Bank under multiyear deal." https://www.americanbanker.com/news/openai-will-embed-staff-at-customers-bank-under-multiyear-deal
[^cubicnbc]: CNBC, "OpenAI partners with Customers Bank in push to automate finance." https://www.cnbc.com/2026/04/27/openai-partners-with-customers-bank-in-push-to-automate-finance.html

### 5.7 Banks Considered and Excluded

Several names were on the original candidate list and were excluded after research. The exclusions are themselves useful intelligence.

- **Pinnacle Financial Partners (PNFP)**: Completed merger with Synovus on January 2, 2026.[^pnfpmerge] Combined entity is approximately $117B, Atlanta-headquartered. Out of peer range.
- **Berkshire Hills + Brookline (now Beacon Financial Corp, BBT)**: Merger of equals completed September 1, 2025.[^bbtmerge] Mid-integration through Q1 2026. Pre-merger AI commentary is stale.
- **First National Bank of Long Island (FLIC)**: Merged into ConnectOne Bancorp June 2, 2025.[^flicmerge]
- **Salisbury Bancorp**: Acquired by NBT Bancorp August 2023. Defunct entity.
- **Hanover Bancorp, NBT Bancorp, Provident Financial Services**: Researched. No public AI deployment surfaced.
- **Patriot National Bancorp (PNBK)**: In turnaround. CEO David Lowery exited March 2025. Steven Sugarman (ex-Banc of California founder) installed as Chair, President, CEO after $57.75M private placement under Nasdaq financial-viability exception.[^pnbkam] Not an AI peer.

[^pnfpmerge]: Pinnacle press release. https://www.pnfp.com/about-pinnacle/media-room/news-releases/pinnacle-and-synovus-complete-merger-to-become-regional-bank-growth-champion/
[^bbtmerge]: Boston Globe coverage of Berkshire-Brookline merger completion. https://www.bostonglobe.com/2025/09/03/business/berkshire-brookline-bank-beacon-financial/
[^flicmerge]: ConnectOne Bancorp press release on completed FLIC merger. https://www.globenewswire.com/news-release/2025/06/02/3091713/25238/en/ConnectOne-Bancorp-Inc-Completes-Merger-With-the-First-of-Long-Island-Corporation.html
[^pnbkam]: American Banker, "Patriot National raises $50 million, parts ways with CEO." https://www.americanbanker.com/news/patriot-national-raises-50-million-parts-ways-with-ceo

---

## 6. A 12-Month Roadmap for a $3B Community Bank Starting from Zero

The roadmap assumes USB has done no formal AI work to date. It is sequenced so that the first six months produce a defensible regulatory posture, and the second six months produce visible operational and financial impact. Each month's deliverable is a single concrete artifact.

### Months 1-3: Policy, Inventory, and the First Productivity Deployment

**Month 1: Policy and inventory.**
- Board adopts an AI policy. Use the template in Section 8 as the starting draft. The policy aligns to NIST AI RMF 1.0 and references SR 11-7, OCC 2023-17, and the FFIEC AIO booklet.
- IT, Compliance, and Risk jointly produce the bank's first AI inventory. The inventory captures every system in production that uses AI/ML, including AI features inside the bank's core, AI features inside the BSA platform, and AI features inside Microsoft 365 if Copilot is in use.
- Name an AI Governance Officer. This is a part-time hat for an existing senior executive (typically the CRO, CIO, or Chief Compliance Officer), not a new hire.

**Month 2: Vendor governance update.**
- Update third-party risk management procedures to incorporate AI-specific diligence questions, aligned to OCC 2023-17. New diligence questions cover: training data use, tenant isolation, model explainability, fair-lending testing, breach notification timelines.
- Begin a contract review of the bank's three largest technology vendors (typically the core, the digital banking provider, and Microsoft) to confirm AI terms.

**Month 3: First productivity deployment.**
- Deploy Microsoft 365 Copilot to a 30-50 person pilot group covering compliance, credit, and marketing. Provide a written use-case playbook and a list of prohibited uses (e.g., do not paste customer NPI into prompts).
- Concurrent: deploy Abnormal Security or equivalent AI email defense if not already in place. The fraud surface is the most pressing operational risk.

### Months 4-6: BSA/AML and Cyber

**Month 4: BSA/AML platform decision.**
- Board approves vendor selection for the AI-driven BSA/AML platform. The decision is between Verafin (Nasdaq-owned, dominant community-bank market share) and Abrigo (Accel-KKR backed, integrated with CECL/lending). Selection is informed by integration with the existing core.

**Month 5: Cyber baseline.**
- Engage Arctic Wolf for managed detection and response if the bank does not run a 24x7 SOC. Arctic Wolf is the Gartner Customers' Choice for MDR and is fit-for-purpose for a $3B bank.
- Deploy or upgrade endpoint protection. SentinelOne via COCC is the most CT-relevant option given COCC's role in the Northeast community-bank stack.

**Month 6: Half-year board review.**
- The AI Governance Officer presents to the board: inventory, policy implementation status, vendor decisions made, incidents (none expected, but the discipline of reporting is the deliverable).
- The board's AI literacy session is scheduled for month 7. See Section 8.

### Months 7-9: Customer-Facing AI and Board Education

**Month 7: Board AI literacy session.**
- Half-day board session. The first hour is the policy, the second hour is a hands-on Copilot session, the third hour is a review of the bank's actual AI inventory with the executives running each system.

**Month 8: Customer service AI scoping.**
- Begin RFP for an AI-powered digital customer service platform. The two strongest candidates are Glia (700+ FI customers, fixed pricing) and Posh (community-bank-only, MIT spinoff). Selection criteria emphasize tenant isolation, no-train commitments, and integration with the digital banking platform.

**Month 9: BSA/AML go-live preparation.**
- The new BSA/AML platform enters parallel run. Old and new systems run side-by-side for at least 90 days before the new system becomes the system of record.

### Months 10-12: Lending Productivity (Without AI in the Decision)

**Month 10: Document AI in commercial credit.**
- Deploy a document-extraction tool to commercial credit underwriters. This can be a feature of nCino if the bank is on nCino, a feature of Microsoft Copilot for tax-return and statement extraction, or a dedicated tool like Hebbia for credit-memo research at banks with significant C&I or CRE volume.
- Critical constraint: AI assists the underwriter. AI does not make or recommend the credit decision.

**Month 11: Customer service AI go-live.**
- The selected customer service AI platform enters production for digital channel inquiries. Mandatory human escalation for any inquiry the AI cannot ground in approved knowledge base content.

**Month 12: Annual review and roadmap reset.**
- The AI Governance Officer presents the annual review to the board. The bank now has: a board-adopted policy, a current inventory, two production AI tools (Copilot, customer service), one production AI risk tool (BSA/AML), and a defined set of cyber-AI defenses.
- Year-two priorities are scoped: AI in fair-lending model testing, AI in SBA / SMB lending workflows, and the first AI literacy refresh for staff.

### What Is Deliberately Not in the First 12 Months

- AI in consumer credit decisions.
- A custom-built model.
- Any vendor that does not contractually commit to no-training and tenant isolation.
- Any "AI Center of Excellence" or innovation lab. The bank cannot spare the headcount, and the work belongs in the operating units.

---

## 7. Build vs. Buy Reality

A community bank should buy almost everything and build almost nothing. The question is which buy.

### 7.1 Build

There are two areas where USB should build, both small and both internal.

- **Prompt libraries and retrieval indexes for the bank's own knowledge.** The bank's policies, procedures, FAQs, product documentation, and approved external responses should be assembled into a retrieval-augmented index that grounds Copilot and customer service AI outputs. This is a content-engineering task more than a software-engineering task. It belongs to Compliance and Operations, not to IT.
- **The bank's AI inventory and governance process.** The artifact of the AI program is the documentation. The bank owns it.

### 7.2 Buy

Most categories. The vendor recommendations below are filtered to vendors with named community-bank customers, transparent pricing or analyst-estimated pricing, and a regulatory profile that survives diligence. Detailed vendor profiles are in the briefs received during research; the names and use cases are summarized here.

**Productivity (full-headcount deployment):**
- Microsoft 365 Copilot. Approximately $21 per user per month with annual commit. Standard contract supports no-training commitments and tenant isolation. The lowest-risk first AI deployment.

**Email and endpoint defense:**
- Abnormal Security. Behavioral AI for inbound email. Sits on top of Microsoft 365 or Google Workspace.
- Arctic Wolf. Managed detection and response. Strongest fit for a $3B community bank without an in-house SOC.
- SentinelOne. AI-powered endpoint detection. Available via COCC partnership (CT-relevant).

**BSA/AML and fraud:**
- Nasdaq Verafin. 2,700+ FI customers globally. The dominant community-bank choice.
- Abrigo. Community-bank focused, integrates BSA/AML with CECL and lending. Accel-KKR backed.
- Hawk. Distributed via CSI's WatchDOG modules. Strong fit if the bank is on CSI.

**Customer service AI:**
- Glia. 700+ FI customers, "Priceless Pricing" (fixed price, no per-seat).
- Posh AI. Community-bank-only, MIT spinoff. CCUA partnership for FIs under $300M.
- Kasisto. KAI Banking platform. Pre-integrated with NCR, FIS, Q2.

**Lending and credit (decision-support, not decision-making):**
- nCino with nIQ. Cloud Banking Platform on Salesforce. 2,700+ FI customers.
- Numerated. End-to-end SMB and commercial lending. Acquired by Moody's November 2024. Originated as an Eastern Bank spin-out.
- Hebbia. Document research and credit-memo support. Enterprise-priced; right for banks with significant C&I or CRE volume.

**Governance and model risk:**
- ValidMind. Purpose-built for FI MRM, aligned to SR 11-7. Right tier for a $3B bank.
- FairPlay AI. Fair-lending testing. Backed by JPMorgan Chase. Required if the bank deploys AI in lending decisions.

### 7.3 Wait

- **AI in consumer credit decisions.** Wait until CFPB and OCC guidance settles further and until in-house fair-lending testing exists. The Bankwell Casca pilot is in lead prequalification, not in the decision itself, which is the right boundary.
- **Custom-built LLMs or fine-tunes for the bank's data.** A community bank does not have the data volume or the talent base to make this economical in 2026. The answer is retrieval-augmented generation on top of a vendor LLM.
- **Voice-cloned executive comms or AI-generated investor communications.** SEC enforcement (Delphia, Global Predictions, March 2024) made AI-misrepresentation a securities-fraud problem.[^secai] The category is not yet ready.

[^secai]: SEC press release on AI washing, March 18, 2024. https://www.sec.gov/newsroom/press-releases/2024-36

### 7.4 A Note on Vendor Diligence Flags

Three vendor-level items the board should be aware of when reviewing third-party diligence packages:

- **Upstart.** CFPB terminated Upstart's no-action letter in June 2022, at Upstart's request, so Upstart could change its model without CFPB approval.[^cfpbupstart] The earlier 2017 NAL was a fair-lending shield. Its termination removed that shield. Worth flagging for any partnership using Upstart in fair-lending sensitive products.
- **Darktrace.** Quintessential Capital Management short-seller report (January 2023) alleged accounting irregularities. EY review (commissioned by Darktrace) found no evidence of fraud, but Darktrace acknowledged historical control weaknesses. Now private under Thoma Bravo as of October 2024.[^thomabravo] Disclose in vendor diligence.
- **Zest AI.** Founder Douglas Merrill's 2022 fraud guilty plea was related to Outcome Health, a separate venture. Not a Zest AI corporate matter. Public record. A board may ask.

[^cfpbupstart]: CFPB, "CFPB Issues Order to Terminate Upstart No-Action Letter." https://www.consumerfinance.gov/about-us/newsroom/cfpb-issues-order-to-terminate-upstart-no-action-letter/
[^thomabravo]: Thoma Bravo press release on Darktrace acquisition. https://www.thomabravo.com/press-releases/thoma-bravo-completes-acquisition-of-darktrace

---

## 8. Appendix

### 8.1 AI Policy Template (Starting Draft)

The following template is a working starting draft. It is structured to align with NIST AI RMF 1.0 and to be readable by an examiner. It is not a finished policy. The board should treat it as a basis for refinement, not as a finished product.

---

**UNION SAVINGS BANK**
**ARTIFICIAL INTELLIGENCE POLICY**
**[Date of Adoption]**

**1. Purpose.** This policy governs the use of artificial intelligence and machine learning ("AI") at Union Savings Bank. It applies to all AI used by the Bank, whether developed internally, embedded in third-party software, or accessed as a service. The policy aligns with the NIST AI Risk Management Framework 1.0 and with the Bank's existing model risk and third-party risk frameworks.

**2. Scope.** This policy applies to all directors, officers, employees, contractors, and vendors of the Bank. It applies to AI used in any function of the Bank, including BSA/AML, fraud detection, lending, credit risk, customer service, marketing, internal productivity, cybersecurity, and back-office operations.

**3. Definition.** For purposes of this policy, "AI" means any system that uses machine learning, statistical inference, generative models (including large language models), or other techniques that produce probabilistic or non-deterministic output and that is used in or substantially affects a Bank decision, customer interaction, employee workflow, or risk control.

**4. Governance Structure.**
4.1. The Board has ultimate responsibility for the Bank's AI posture.
4.2. The Bank shall designate an AI Governance Officer reporting to senior management. The AI Governance Officer's responsibilities include maintaining the AI Inventory, reviewing all proposed AI deployments, coordinating model risk validation for AI systems, and reporting to the Board at least annually.
4.3. AI proposals exceeding [defined risk-tier or dollar threshold] require AI Governance Officer approval. AI proposals affecting consumer lending decisions, BSA/AML system-of-record functions, or customer-facing automation handling NPI require Board notification.

**5. AI Inventory.** The Bank shall maintain a current AI Inventory listing every AI system in production. The Inventory shall capture, at minimum: system name, vendor (or "internal"), use case, business owner, risk tier, regulatory exposure, model risk validation status, and date of last review. The Inventory shall be reviewed and updated at least quarterly.

**6. Risk Tiering.**
6.1. *Tier 1 (High Risk).* AI systems that make or materially influence consumer credit decisions; AI systems that act as the system of record for BSA/AML; AI systems that handle PII or NPI in unmanaged ways. Tier 1 systems require Board notification, formal model risk validation under SR 11-7, and quarterly review.
6.2. *Tier 2 (Medium Risk).* AI systems that interact with customers; AI systems that influence pricing, marketing, or operational decisions. Tier 2 systems require AI Governance Officer approval and annual review.
6.3. *Tier 3 (Low Risk).* AI systems used solely for internal productivity, code assistance, or non-customer-facing tasks. Tier 3 systems require business-unit-leader approval and inclusion in the Inventory.

**7. Vendor Diligence.** Any AI vendor relationship shall be subject to the Bank's third-party risk management framework as updated in accordance with OCC Bulletin 2023-17. AI-specific diligence shall additionally confirm, in writing in the vendor contract:
7.1. The vendor will not train or fine-tune models on Bank or customer data.
7.2. The vendor provides logical or physical tenant isolation such that Bank data is not co-mingled with other clients' data in any retrieval index.
7.3. The vendor will provide model documentation sufficient to support the Bank's model risk validation.
7.4. The vendor will notify the Bank of any model material change, training-data incident, or breach within timeframes consistent with applicable law and the FTC Safeguards Rule.
7.5. The vendor's security posture meets or exceeds the standards of the Bank's information security program.

**8. Prohibited Uses.** The following uses of AI are prohibited at the Bank without prior Board approval:
8.1. Use of AI as the sole or substantial decision-maker in any consumer credit decision (origination or adverse action).
8.2. Use of AI to generate communications attributed to a Bank executive without disclosure.
8.3. Use of consumer or commercial customer NPI in any AI tool that does not provide written no-training and tenant-isolation commitments.
8.4. Use of AI in a manner inconsistent with applicable law, including ECOA, the Fair Housing Act, FCRA, GLBA, the BSA, UDAAP authorities, and the laws of the State of Connecticut.

**9. Customer-Facing AI Disclosure.** Where AI is used in a substantial customer interaction, the Bank shall provide clear disclosure to the customer that AI is involved and shall ensure a human escalation path is available.

**10. AI Literacy.** The Bank shall provide AI literacy training annually to the Board and to senior management, and shall provide use-case training to any employee with access to a generative AI tool.

**11. Incident Reporting.** Any incident involving an AI system that results in unauthorized data exposure, customer harm, or material control failure shall be reported immediately to the AI Governance Officer and shall be treated as an incident under the Bank's Information Security Incident Response procedures.

**12. Annual Review.** This policy shall be reviewed annually by the Board.

---

### 8.2 Board and Staff AI Literacy Curriculum Outline

**Board session (half-day, four hours).**
- Hour 1: The regulatory frame. SR 11-7, OCC 2023-17, FFIEC AIO booklet, CFPB Circulars, FinCEN, NIST AI RMF, the CT AG memo. Plain-English walk-through.
- Hour 2: The Bank's AI policy, in depth. Each section reviewed. Open Q&A with the AI Governance Officer.
- Hour 3: Hands-on session. Each director uses Microsoft Copilot to summarize a real-board-quality document (e.g., a recent examiner letter or earnings release). Goal: directors' personal experience of what AI is and is not.
- Hour 4: The Bank's AI Inventory. Each system in production reviewed by the executive who owns it. Q&A.

**Senior management session (one full day, eight hours).**
- Morning: Same content as the board session, expanded. Add a competitive intelligence segment on the peer banks in Section 5.
- Afternoon: Working session by function. Each function (Lending, BSA, IT, Operations, Marketing, HR) builds a one-page list of its three highest-leverage AI use cases. Outputs feed the next year's AI roadmap.

**All-employee module (one hour).**
- Use-case playbook for the Bank's chosen tools (e.g., Copilot).
- Prohibited uses (especially: do not paste customer NPI into prompts).
- The escalation path when an employee is unsure.
- One short live demo.

### 8.3 Glossary

- **Adverse Action Notice.** Notice required under ECOA / Reg B when a creditor takes adverse action on a credit application. Must include the principal reasons. Applies to AI-driven decisions.
- **AI Inventory.** A current list of all AI systems in production at the Bank. Required by examiner expectation if not by formal rule.
- **BSA.** Bank Secrecy Act. The U.S. anti-money-laundering legal regime.
- **Effective Challenge.** The doctrine in SR 11-7 that requires independent, competent, and influential review of any model output.
- **FFIEC AIO Booklet.** The Federal Financial Institutions Examination Council's IT Examination Handbook section on Architecture, Infrastructure, and Operations, including the AI/ML subsection.
- **GenAI.** Generative AI. AI systems that produce new content (text, images, code, audio).
- **GLBA.** Gramm-Leach-Bliley Act. The federal law governing financial-services privacy and the safeguarding of NPI.
- **LLM.** Large Language Model. The class of generative AI models that produce text (and increasingly code, images, audio).
- **MRM / SR 11-7.** Model Risk Management. The 2011 joint Federal Reserve and OCC supervisory guidance.
- **NIST AI RMF.** The National Institute of Standards and Technology's voluntary AI Risk Management Framework, version 1.0 (January 2023).
- **NPI.** Nonpublic Personal Information. Defined under GLBA.
- **OCC 2023-17.** The June 2023 interagency third-party risk management guidance.
- **RAG.** Retrieval-Augmented Generation. The architectural pattern where an LLM is grounded in a curated knowledge base rather than relying solely on its training data. The right pattern for a community bank.
- **Tenant Isolation.** The vendor architectural property that one customer's data is logically (or physically) separate from another's, including in any retrieval indexes.
- **UDAAP.** Unfair, Deceptive, or Abusive Acts or Practices. The CFPB and prudential regulators' authority over consumer-facing conduct, including AI behaviors.

---

*End of paper. Prepared by Brayan Tenesaca, May 3, 2026, at Frank Rowella's request, as a gift to the Union Savings Bank board.*
