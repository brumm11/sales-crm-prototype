# Sales CRM — mobile prototype build spec

## Context (for the AI: read this before writing any code)

This is a clickable mobile-web prototype for a take-home PM challenge. It simulates an intelligence/UX layer sitting on top of an existing internal CRM used by field sales associates. All data is fake/hardcoded — there is no real backend. Optimize for: looks and feels like a real phone app, one coherent flow, fast to build, no dead ends.

Build as a single-page mobile-width web app (React or plain HTML/CSS/JS, whichever is fastest to ship as a live clickable link). Design for a phone viewport (~390px wide), not desktop.

## The problem statement

Rahul is a field sales associate for Asian Paints, managing ~15-20 dealer/retailer deals across his territory. His day happens almost entirely outside a desk — visiting dealers, negotiating, doing follow-ups, logging meeting notes, uploading documents. He touches the CRM in short bursts, standing in a shop or between visits, on his phone.

**The real pain:** There is no single source of truth for a deal's current state, and no way to tell which deals actually need Rahul today versus which are fine. He starts his day blind — he can't tell a strong deal from a weak one, or urgent from fine, without manually reopening each deal and re-reading old notes. This is both a daily-planning problem (where do I start this morning) and an in-the-moment lookup problem (what's the context on this account, right before I walk in).

## Who this is for and what it must NOT be

- This is Rahul's app, not a leadership dashboard. Nothing here is styled like an analytics tool for a manager.
- This is not a new CRM — assume deals, accounts, and basic records already exist elsewhere. This prototype is a smarter mobile layer on top, not a replacement.
- Do not build: calendar integration (fake it), a real backend, a document upload that actually stores files (fake the upload action, just show a success state), a "reassign deal to colleague" feature (explicitly out of scope for v1), anything resembling a desktop dashboard.

## The three screens (this is the whole prototype — one continuous flow)

### Screen 1 — Home
Purpose: give Rahul a fast entry point when he opens the app, and route into the same underlying deal list below.

- A short header: Rahul's name, today's date, maybe "Good morning, Rahul."
- "Today's meetings" — a small static list of 2-3 fake meetings (dealer name, time). This is clearly stubbed data, no real logic behind it.
- Three tappable summary chips/counters that act as filters into Screen 2, not a separate data view:
  - Needs attention (count)
  - On hold (count)
  - Pending documents (count)
- Tapping a chip navigates to Screen 2 pre-filtered to that state. Tapping nothing / a "view all deals" link goes to the unfiltered list.

### Screen 2 — My Deals (ranked list)
Purpose: answer "which deal do I go to next."

- A list of ~8-10 fake deals (dealer/retailer names, e.g. "Sharma Hardware," "ABC Paints Distributors").
- Each deal card shows:
  - Company name
  - A priority score (0-100) and a label: High / Medium / Low
  - 1-3 short "reason" tags explaining the score in plain language, e.g. "Large deal," "No follow-up in 6 days," "Client responded yesterday," "On hold"
  - Deal value (fake number, e.g. "₹4.2L")
- Sort order = priority score, descending, by default. Filter chips from Screen 1 apply here.
- **Priority score logic (rule-based, not ML — make this explicit in the UI or at least in code comments):** compute from a weighted combination of:
  - Deal value (higher value = higher score contribution)
  - Days since last update (more days = higher urgency contribution, i.e. more "needs attention")
  - Whether client responded recently (recent response = higher score, i.e. strike while hot)
  - On-hold status (if on hold, this should demote/cap the score regardless of other factors — an on-hold deal should not show up as "needs attention today")
  - Pending documents (adds to urgency)
  - Show the actual reason(s) driving the score as tags, don't just show a bare number.

### Screen 3 — Deal detail
Purpose: give Rahul everything he needs before or during a client visit, without manually searching.

Header block: Company name, deal value, stage (e.g. "Negotiation," "Proposal Sent," "Closing"), owner (Rahul), next meeting (fake date/time).

**AI deal brief** (fake/hardcoded per deal, written to look like it was generated from notes): a short 2-3 sentence synthesis of deal history, e.g. "Last visited 6 days ago. Client raised pricing concerns on bulk order. No documents uploaded since initial proposal." This should read like a summary, not a raw note dump.

**Sentiment tag**: Positive / Neutral / Negative, shown as a small colored label, with a one-line reason underneath drawn from the fake notes — e.g. "Negative — client mentioned 'price is a concern' in last visit." Do not show a bare label with no reason. This is meant to be keyword/lexicon-based sentiment in spirit (e.g. flags words like "pricing concern," "delayed," "happy," "signed") — fake this convincingly with 3-4 example deals showing different sentiments and matching trigger phrases.

**Documents section**: a short fake list of documents (e.g. "Proposal_v2.pdf," "PO_copy.jpg") with file type icons. Include an "Upload document" button that opens a simple upload sheet/modal (fake — clicking "upload" just shows a success toast/state, no real file storage needed).

**Quick actions** (buttons/row): 
  - Mark update (logs that Rahul touched this deal today — should visibly change "last updated" and would demote urgency if reflected back on Screen 2)
  - Toggle "On hold" (when toggled on, this deal should stop appearing in "needs attention" filtering — reflect this state change even if only within this prototype session)
  - Upload document (see above)
  - Add note (simple text input, appends to a visible notes list, doesn't need to feed back into the AI brief in real time — static is fine)

## Deployment target

This will be pushed to GitHub and deployed on Vercel or Cloudflare Pages, so it must be accessible via a public URL with no login required — reviewers will click a link, not clone a repo. Build it as a standard static/React web app (Next.js, Vite, or plain HTML/CSS/JS) that deploys cleanly to Vercel or Cloudflare Pages with zero configuration — no environment variables, no backend service, no database. Everything is client-side and hardcoded/in-memory, so the build step should be trivial.

**Important — reviewers will open this on a desktop browser, not an actual phone.** Since this is a mobile-first design, don't let the mobile layout just float awkwardly in a wide desktop viewport. Handle this properly:
- Center the mobile-width app (~390-430px) in the viewport on larger screens, with a neutral background around it (e.g. a subtle solid color or a simple phone-frame-style container) so it's clear the narrow width is intentional design, not a broken layout.
- Do not attempt a responsive redesign into a desktop layout — that's out of scope and would dilute the "this is a phone app" framing the brief wants. Keep the actual app content fixed at mobile width; just handle the surrounding canvas gracefully on desktop.
- The app should still be fully clickable and functional with mouse/trackpad input, not just touch — no interactions that only work via touch gestures.

## Design mandate

Act as a senior product designer with 10+ years at companies like Apple, Linear, Stripe, and Notion. Do not produce a generic template or a wireframe-grade concept. This should look and feel like a screen shipped by one of those companies — a premium, production-ready mobile SaaS interface, not a hackathon demo.

Requirements:
- Apply established UX laws deliberately: Fitts's Law (tap targets sized and placed for thumb reach), Hick's Law (don't overload any single screen with choices — progressive disclosure where needed), Jakob's Law (use interaction patterns people already know from apps they use daily), visual hierarchy via size/weight/color/spacing (not borders and dividers everywhere).
- Strong, consistent typographic scale. Consistent spacing system (a real spacing scale, not arbitrary px values). A restrained color palette where color is only used to carry meaning (priority, sentiment, status) — not decoration.
- Every interactive element needs all relevant states designed and implemented: default, hover, focus (visible focus rings for accessibility), active/pressed, loading, disabled, empty state, success state, error state. A button that only has one visual state is unfinished.
- Micro-interactions: transitions on tap, smooth state changes when toggling hold/marking updates, a real loading state if anything takes a beat, a real success confirmation on document upload (not just an instant silent change).
- Accessibility: sufficient color contrast, don't rely on color alone to convey priority/sentiment (pair with text labels/icons), legible font sizes, adequate tap target sizes (44px minimum).
- Responsive within the mobile viewport — this is a phone app, but the code should not break at slightly different mobile widths.
- Every component should be built as a reusable piece (deal card, status chip, sentiment tag, button) used consistently across screens — not one-off markup per screen.
- Empty states matter: what does "My Deals" look like with the "pending documents" filter applied and zero results? Design that, don't skip it.

## Feature usage and logic context (for the builder to understand what each thing is for, not just render it)

**Status chips (Home screen):** These exist because Rahul's very first decision each day is "where do I even start." They are not decoration — they are literally a filter trigger. Tapping "Needs attention" should feel like the natural next step after seeing the count, taking him straight into a pre-filtered version of My Deals. The interaction should make it obvious these are clickable (not just informational counters) — hover/press state, maybe a chevron or subtle affordance.

**Priority score (My Deals):** This exists to answer "which deal do I visit next" without Rahul having to open each one and think about it himself. It's a deterministic, explainable score — never show the number without also showing the reason tags, because an unexplained number is not trustworthy to a user who has to act on it. The score should visibly update within the session when Rahul takes an action (marks update, toggles hold) — this reactivity is the point of the whole feature; if scores are static and never change after an action, the core value of the prototype doesn't come through.

**On-hold toggle (Deal detail):** This exists because deals sometimes stall for reasons outside Rahul's control (client-side delays), and he needs a way to say "don't flag this as urgent, I know it's paused" without it looking like he's neglecting it. Toggling it on should immediately and visibly remove that deal from "needs attention" contexts — this cause-and-effect needs to be felt, not just stored.

**AI deal brief and sentiment tag (Deal detail):** This exists to kill the "manually re-read old notes before every visit" problem. It should read like a short human-style summary, not a data dump. The sentiment tag always needs its one-line reason visible underneath or on tap — a bare "Negative" label with no explanation is not something Rahul can act on or trust.

**Mark update / Add note (Deal detail):** These exist so Rahul's actions in the field are the same actions that feed the prioritization logic — this is what makes the app feel like one system instead of a UI mockup bolted onto fake data. "Mark update" should reset the "days since last update" signal in a way the user can see reflected if they go back to the list.

**Document upload:** This exists because 4 different sales associates independently asked for reliable document logging — it's the single highest-signal ask driving this feature. The upload flow doesn't need real storage, but the interaction (select file → brief loading state → success confirmation → appears in the list) should feel complete and real, not like a placeholder.

Fake data should feel real: use plausible Indian dealer/retailer business names, real-sounding rupee values, real-sounding note content. Avoid "Lorem ipsum" or "Company A."

## Explicit non-goals for this build (do not implement)

- No real authentication/login
- No real file storage or backend of any kind
- No calendar sync — "today's meetings" is static fake data
- No "reassign deal to colleague" feature
- No actual ML/LLM call for sentiment or the AI brief — all of it is pre-written fake content per deal, styled to look AI-generated
- No leadership/manager view

## What "done" looks like

Rahul opens the app → sees today's meetings and three status counters → taps "Needs attention" → sees a ranked list of deals with clear reasons why each is flagged → taps into "Sharma Hardware" → sees deal value/stage, an AI brief, a sentiment tag with reason, documents, and can mark it updated, toggle hold, upload a doc, or add a note → goes back to the list and sees that deal's state reflect the change.

That loop, working end-to-end with believable fake data, is the entire prototype.
