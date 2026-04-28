# kumo

### an open research engine that doesn't look like it's from 2004.

[insert pic of 3 screens of the app / hero / landing page footage]


### metrics
  

- 427 searches

- 2500 impressions

- 3525 papers discovered

  

### role

founder, interaction & visual design

  

### opportunity

  

every time i needed to read a research paper, i'd hit a wall. $40 to unlock a single paper. login screens to publishers i don't have access to. citations that led nowhere. i'd spend 20 minutes just trying to figure out if i could even read the damn thing or not.

  

i tried zotero, mendeley, connected to my university library. they organized things fine, but they didn't solve the core issue. the friction was in the finding, not the organizing. knowledge was locked behind paywalls, and the tools to find it hadn't evolved since the stone age.

  

the first thing i asked myself was: why would someone like me even use this? do we really need another search tool? another layer that just repackages the same broken experience? or maybe we need something different. something that actually gets you to the paper. something that feels so *right* that you keep coming back—not because of the design, or the novelty, but because it actually works.

  

### problem

  

the problem wasn’t discovery. it’s access. when every result leads to a paywall, the search is useless.

  

i tried a bunch of research tools, and the pattern was always the same. they helped you organize after you found things, not find things you could actually read. more databases on top of locked content is still just locked content.

  

so i solved it with kumo.

  

### context

i originally started this as a personal tool to help myself read more papers. but then i realized: academic search has been broken for decades. at the time, i was building a complex version with every feature under the sun—it was becoming just another bloated research tool. it looked feature-rich, but it lacked the point.

  

[insert kumo_old footages]

  

### process

  

i went back to the foundations and rebuilt it around specific, unyielding constraints.

  

i focused on three main factors:

  

* **joyful interactions & motion:** making search feel tactile and alive, not clinical. every transition has weight, every gesture has feedback.

[insert wireframe pics]

  

* **the AIVS ranking:** building a client-side ranking algorithm that normalizes seven different APIs into one unified score. relevance × 3.0 + citation impact + velocity + recency + venue + open access, then MMR diversification to prevent clustering.

[insert ranking architecture]

  

* **speed:** every millisecond matters. we optimized the edge layer and ranking pass relentlessly.

[insert performance metrics]

  

i organized everything into P0, P1, and P2 priorities. the pace was intense. i mapped tasks out in figma and obsidian, and documented the ranking architecture so i wouldn't lose my technical clarity.

  

### solution (with features)

  

to keep kumo completely frictionless, we structured the experience around what matters: **find → route → read.** **open access first:** we built around openalex and unpaywall. users get results that actually link to readable papers right from the start. no paywalls, no "click here to request access" dead ends. new users see papers they can actually read immediately; returning users pick up exactly where they left off.

[insert video]

  

**searching papers:** after landing, you search what you want to read. we built a custom ranking system called AIVS (academic impact & velocity score) that normalizes relevance across seven different APIs, combines citation impact, velocity, recency, and venue prestige, then applies MMR diversification to prevent result clustering. users search by DOI, title, author, or keywords—a single input that actually works.

[insert video]

  

**the core loop:** each search returns papers with clear metadata. we kept results scannable. readable titles, citation counts, venue badges, open access indicators. the constraint of 50 results with fast pagination is enforced everywhere: in the UI, in the client, in the ranking pass. absolutely no walls of text.

[insert video]

  

**discovering:** we designed the experience around instant clarity. search is the pivotal moment. tapping a paper card opens a drawer with the full abstract—that single, smooth transition is the core experience loop. each paper has exactly two states: accessible or not. no login walls, no complexity. the moment you see it, you can read it. (and yes, you can always open the PDF if it's available. access over barriers.)

[insert video]

  

**the filters:** after searching, users can refine by recency, citations, or open access. there's no judgment. just pure clarity. the system tracks *cited by*, *date*, *pdf available*—not complexity, not noise.

[insert video]

  

**the AIVS ranking:** here's what actually runs under the hood. we query seven sources simultaneously, normalize each source's relevance to a [0,1] scale, then combine six signals:

- relevance (weighted ×3.0 — the strongest signal)

- citation impact (log-scale, normalized to median)

- velocity (citations per age — newer papers with citations rank higher)

- recency (exponential decay for older papers)

- venue prestige (20% boost for elite venues)

- open access (5% boost — it reflects our mission)

  

then we run MMR diversification to push similar papers apart by year, venue, and concept overlap—so users see a spread, not a cluster.

[insert video]

  

**the edge layer:** results are cached at the edge. each query is optimized before it reaches the user. there's no waiting. the speed is a vital part of the experience. every millisecond was fought for.

  

*we enforced specific vocabulary everywhere to build this mental model:* route (not search), papers (not results), readable (not gated), bridge (not database). the words shape how users think about the practice.

[insert video]

  

### impact

  

after a week of heads-down building, i designed a quick landing page, hit publish, and announced it on linkedin and X.

we saw over 2,500 impressions within 12 hours.

* 240 searches in 24 hours.

* 350 within the next week.

* 427+ shortly after.

  

[insert proofs]

  

### feedback from users

  

kumo grew purely through word of mouth. people recommended it to friends who were exhausted by paywalls and just wanted to read papers simply.

  

the constraint of open access routing surprised people. they expected to find paywalls everywhere, not direct PDF links. but the routing is exactly what freed them. no more hunting for library access—just read it. users reached out to tell me they finally read papers they couldn't access before, simply because kumo routed them to the arxiv version. that was the whole point.

  

[insert pics from friend chats]

  

### lessons learnt

  

kumo reinforced a few core truths for me:

  

* **ranking is a feature, not a checklist.** the first version tried to combine every signal equally. but relevance at ×3.0 performs radically differently from ×1.0. the weights *are* the product. tuning them based on real user behavior, not theory, is what makes the ranking actually work.

* **federated search is harder than it looks.** querying seven APIs simultaneously with different formats, different relevance definitions, and different metadata available sounds simple on paper. normalizing [0,1] across sources where one returns BM25 scores and another returns just positional order—that took more iterations than the UI.

* **client-side has a ceiling.** running a full ranking algorithm in the browser with O(n² log n) MMR diversification works at 200 papers. scaling beyond that would need a server. choosing to stay client-side meant accepting that ceiling—it also meant zero infrastructure cost and radical privacy.

* **routing is the product.** users don't want a better list. they want the PDF. the moment kumo started routing to open-access versions instead of showing publisher links, the product clicked. the routing logic *is* the differentiator.

* **good design is invisible.** i obsessed over the motion curves, the spring physics, the micro-interactions. but what users actually loved was that kumo got out of their way. beautiful design means never having to think about how to use it.

* **trusting my own judgment.** everyone told me "a search engine needs a backend." i said no. client-side means zero server costs, complete transparency, and your data never leaves your browser. that "no" is what let kumo stay free.

* **speed is a feature.** every millisecond we shaved off the ranking pass mattered. users notice 200ms. users hate waiting. optimizing the edge layer and caching aggressively wasn't optional—it was as important as the UI.

* **the philosophy comes first.** "knowledge should be as free as the air" isn't a tagline. it's the constraint that drives every decision. open access first, zero tracking, client-side only—these aren't features, they're the point.

  

### end

  

kumo is still finding its people. it's just the product doing exactly what it was designed to do.


each search starts fresh. each session asks a simple question: *did you find what you were looking for?*

we've kept it small on purpose. i am a solo team, the features are deliberate, and the constraints are intentional.

that's the point.