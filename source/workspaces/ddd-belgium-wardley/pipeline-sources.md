# Pipeline — source kit for the "what is a pipeline?" slide

Research date: 2026-10-08. Companion to `wardley-sources.md` and `ooda-fivefactors-sources.md`.
All quotes verified against live search/fetch of the linked URLs. Wardley's material is CC BY-SA
(book 4.0, older blog 3.0); `wardleymaps.com` glossary is CC BY-SA 4.0 (Krzysztof Daniel, adapted
from Wardley); Mermaid docs are MIT. Short quotes with attribution are fine for slides.

**Bottom line for the presenter:** the intuition "alternatives *and* an evolution" is half right.
Wardley's own canon says a pipeline is a **category of one meaning, holding many substitutes at
different stages of evolution** — alternatives (logical OR) is the core; "an evolution" is the
*reason they sit at different x-positions*, and even that is contested: Wardley's clearest
statement (Cynefin post) says pipeline children **independently** evolve, and "the pipeline doesn't
say that A evolves into B". The `evolve A -> B 0.62` one-thing-migrating reading is a *different*
notation (a single component's future position), which tools and secondary sources often blur into
"pipeline". See §1 and the "pitfalls" box.

---

## 1. What a pipeline IS (canon)

### The definition, from Wardley himself (short quotes)

> "You can think of pipelines as categories for many evolving components that we have choice over
> (i.e. substitution)"
> — Simon Wardley, Twitter/X thread, Oct 2021. https://threadreaderapp.com/thread/1448326797326790661.html

> "Not a single stock of capital but many continuously evolving stocks with a common meaning"
> — Simon Wardley, Twitter/X thread, May 2021. https://threadreaderapp.com/thread/1264535129160114176.html

> "Pipelines are used in maps when we have multiple things with a common meaning"
> — Simon Wardley, "Why the fuss about conversational programming?", 2023.
>   https://blog.gardeviance.org/2023/01/why-fuss-about-conversational.html
>   (same post's full sentence: "'power' can mean renewable or fossil fuel or nuclear — they are all
>   sources of 'power' … They are not always independent though and we can use a pipeline to
>   represent a choice in the evolution of a thing.")

> "Maps have logical ORs. The pipeline … represents a choice. You can choose … A OR B OR C."
> — Simon Wardley, "Wardley Maps and Cynefin", 2024.
>   https://blog.gardeviance.org/2024/01/wardley-maps-and-cynefin.html (Medium mirror: https://swardley.medium.com/wardley-maps-and-cynefin-d0c7a2b960e8)

> "The components in a pipeline are all independently evolving. The pipeline doesn't say that
> [A]'s solution evolves to become [B]'s solution"
> — Simon Wardley, "Wardley Maps and Cynefin", 2024 (same URLs as above)

> "A pipeline represents a flow or process that connects components across stages of evolution."
> — OnlineWardleyMaps docs (Damon Skelhorn). https://docs.onlinewardleymaps.com/docs/map-elements/pipeline/
>   (Tool-oriented phrasing; the "flow/process … chain" wording is the one most likely to mislead — see pitfalls.)

> "Sometimes, it is necessary to identify many components that fall into one category … a rectangle
> containing multiple small components … the square at the top … indicates the center of gravity"
> — wardleymaps.com glossary, "Notation" (Krzysztof Daniel). https://www.wardleymaps.com/glossary/notation

> "Pipeline components share visibility and only vary by evolution"
> — Mermaid `wardley-beta` docs. https://mermaid.js.org/syntax/wardley.html
>   (Syntax-level truth for the workshop's renderer: same y, different x.)

### Which of (a)/(b)/(c)/(d) is it?

**Answer: (d) — several of these, depending on author — with a clear hierarchy of authority:**

| Reading | Status in the canon | Who says it |
|---|---|---|
| **a) one activity shown at all four stages as alternatives** | Partially right, slightly wrong: it's *not necessarily one activity* and *not necessarily four stages* — it's *n* named substitutes for one *meaning*, at whatever x-positions each actually sits | Wardley (threads, Cynefin post); wardleymaps.com "Law" example |
| **b) value-chain slice / consumption chain** | The *weakest* canon reading. A pipeline is a **horizontal** band of substitutes at one visibility, not a vertical slice of the dependency chain. This reading comes mostly from OWM's "flow or process … complex requirement chains" doc wording and from everyday English "pipeline" | OnlineWardleyMaps docs; some secondary sources |
| **c) gameplay (ILC) device** | Wrong as a *definition*. Pipelines appear *on maps used for* gameplay (e.g. "accelerate the pipeline" in ch. 18), but ILC is a separate ecosystem play (sensing engines). Wardley's "constant pipeline of gameplay" in ch. 7 is the *ordinary-English* word, not the notation | Wardley ch. 18 (gameplay *applied to* a pipeline); ch. 7 (word used colloquially) |
| **d) several, depending on author** | Correct | — |

**Synthesised canon definition (safe for the slide):**

> A pipeline is one capability/meaning shown as a **row of alternative components** — substitutes
> you could pick (OR, sometimes in mix) — each sitting at **its own evolution stage**. Children
> share the parent's visibility; they differ by evolution. (Wardley; OWM/Mermaid `pipeline { }`
> syntax encodes exactly this.)

**On the presenter's hypothesis — "it is not a chain — it feels like alternatives and also an evolution":**

- **Right that it is not a chain.** Wardley: "Maps have logical ORs" — the pipeline is choice/substitution, the opposite of the map's vertical chain-of-needs ("Maps represent a chain of relationships … Maps have logical ANDs"). The "chain" feeling is a documented trap: OWM's own doc sentence ("connects components across stages of evolution … complex requirement chains") is the main source of the confusion.
- **Right about "alternatives."** That's the definitional core (choice/substitution/common meaning).
- **Incomplete / partly wrong about "and also an evolution."** Two corrections:
  1. Not "an evolution" (singular, one thing's journey) by default. Wardley's clearest statement: children "are all **independently** evolving … the pipeline doesn't say that A evolves to become B". Each child is at a stage; the pipeline as a box shows the market's spread.
  2. The one-thing-migrates reading *does* exist in Wardley, but as an acknowledged **special case**: "They are not always independent though and we can use a pipeline to represent a choice in the evolution of a thing" (conversational-programming post) — e.g. X Factor → X Factor USA. Even then it's still a *choice among forms of one meaning* at successive stages, not a sequence of process steps.
- So the safest wording is: **alternatives (OR) at different evolution stages of one meaning**; "one thing evolving through forms" is the special case, not the rule.

**Pitfalls to avoid on the slide (why "pipeline" is hard):**

- English "pipeline" = sequential process (CI/CD, data pipeline). Wardley-pipeline = parallel substitutes. The word itself is the trap.
- OWM's doc definition ("flow or process … requirement chains") reads like the English meaning and contradicts Wardley's OR/choice canon. Prefer Wardley's wording on the slide.
- The `evolve A -> B 0.62` arrow (one component's future position) is a *different* element from `pipeline Parent { ... }`. Tool docs and community posts often slide between them.
- Lethain and *The Value Flywheel Effect* teach pipelines as "a series of expected improvements … over time" / "continuous evolution of a component" — a defensible simplification of the special case, but it drops the OR/substitution core. Fine for a 101 audience, risky for a DDD-Belgium crowd that will ask "so is it a process?"

---

## 2. Canonical published pipeline examples

All from published texts (no invented maps). "Stages" = the x-positions Wardley gives or implies.

**1. TV content — "commissioned shows → acquired formats" (Wardley's flagship pipeline example)**
- Activity/meaning: *content creation* for a TV company. Stages: commissioned shows (novel, e.g. a new X Factor) → acquired/repeated formats (X Factor USA, X Factor UK …).
- Source: "An introduction to Wardley (Value Chain) Mapping", 2015 — https://blog.gardeviance.org/2015/02/an-introduction-to-wardley-value-chain.html (CIO reprint: https://www.cio.com/article/196094/…; Medium ch. material). Elaborated with X Factor names in "Continuous and Sustainable Competitive Advantage…", 2015 — https://blog.gardeviance.org/2015/03/continuous-and-sustainable-competitive.html
- Teaches: creation vs distribution split; the pipeline is a set of *forms of one meaning* at different stages — and here the special case (a format evolving from novel show to repeated format) is front and centre. This is also the map where Fool's-Mate gameplay later attacks the pipeline's suppliers.

**2. Compute — "servers or cloud" (the choice-that-became-a-when)**
- Meaning: *compute*. Stages: servers (product-ish, ~0.6) vs cloud (utility, ~0.85).
- Source: "Map evolution not maturity", 2024 — https://medium.com/mappingpractice/map-evolution-not-maturity-bae6ea1a2743 (LinkedIn mirror: https://www.linkedin.com/pulse/you-map-evolution-maturity-simon-wardley-cpzfe)
- Teaches: a pipeline can show an apparent choice that evolution is resolving — "the real consideration was not 'if' cloud would be used, but 'when'". Also the canonical warning against reading the x-axis as maturity.

**3. Health treatments — "antibiotics … to CRISPR" (Wardley's fullest prose definition-in-example)**
- Meaning: *treatment*. Stages: antibiotics (once novel, now industrialised) → CRISPR (novel today); "all these novel approaches evolve to become industrialised and other novel approaches emerge. **Hence a pipeline.**"
- Source: *Wardley Maps* book, ch. 18 "Better for Less" — https://medium.com/wardleymaps/better-for-less-58fe8c0a3aaa (AsciiDoc: https://github.com/andrewharmellaw/wardley-maps-book/blob/master/chapter-18-better-for-less.adoc)
- Teaches: the market-wide view — one meaning, a stream of forms arriving and industrialising; "accelerate the pipeline" (via a medical fund = market enablement) is gameplay aimed at a pipeline's rate of evolution. Pairs perfectly with §3.

**4. Cars / automotive — "a pipeline of cars with some more commodity like"**
- Meaning: *cars* (getting from A to B + status). Stages: from less to more commodity-like "especially in terms of features".
- Source: book ch. 18 (same URLs as #3), figure "The automotive industry".
- Teaches: pipelines as feature/market segmentation spread along evolution, embedded in a full value chain (entertainment → infotainment → …).

**5. Health treatments v2 — "What is an expert?" (Wardley's cleanest notation gloss)**
- Same healthcare domain as #3, one sentence on the box: "We draw this as a pipeline of evolving
  components. The square box (the connection to the pipeline) is simply considered an average of
  the pipeline itself."
- Source: https://swardley.medium.com/what-is-an-expert-886274b2c1aa (2018).
- Teaches: what the top square means (average/center of gravity of the children) in Wardley's own
  words — pairs with the wardleymaps.com "center of gravity" wording.

**6. Law / legal (community canon, wardleymaps.com glossary)**
- Meaning: *law* (for a lawyer's case). Stages: AI law (novel) / Privacy / Financial / Property (more mature), with a "slider handle" for current focus and a top square as "center of gravity for the evolution of all the components".
- Source: https://www.wardleymaps.com/glossary/notation
- Teaches: the OR/choice reading with nice notation details (focus slider, foldable square). Good "what does the square mean" slide.

**7. Kettle — the tooling example (OWM docs + Mermaid `wardley-beta` demos)**
- Meaning: *kettle*. Stages (Mermaid demo): Campfire Kettle [0.35] / Electric Kettle [0.53] / Smart Kettle [0.72]; OWM docs: Campfire [0.50] / Electric [0.63].
- Sources: https://docs.onlinewardleymaps.com/docs/map-elements/pipeline/ · https://mermaid.js.org/syntax/wardley.html · https://github.com/mermaid-js/mermaid/blob/develop/demos/wardley.html
- Teaches: the syntax contract for the workshop's own `wardley-beta` slides — children inherit visibility, vary only by evolution. Note it straddles the two readings (independent products *and* an evolution story of "kettle"), which is exactly why the concept is hard.

**Does the classic cup-of-tea / event-storming material use pipelines?**
- **Cup of tea: mostly no — and the exceptions prove the rule.** Wardley's book ch. 2 tea-shop map is a plain chain of needs (no pipeline). *The Value Flywheel Effect*'s "How to Wardley Map" (https://itrevolution.com/articles/how-to-wardley-map/) is the one tea example that *does* use a pipeline: the **tea** component as fresh/pyramid tea bag → regular tea bag — "You can think of pipeline as a slider … select one component … not both together." (Note this is the special-case evolution reading again.) Some community tea.owm files use `pipeline Kettle` purely as tooling syntax. So: tea teaches chains; pipelines enter tea only in secondary/tooling versions.
- **EventStorming: no.** No published EventStorming material uses Wardley pipelines; the two notations are unrelated (Brandolini's flows are temporal; Wardley's pipelines are evolutive-choice). A DDD audience may *want* to map "pipeline" onto process/flow — that's the §1 pitfall.

---

## 3. Evolution vs active forces

The presenter's concern — "a difference between market evolution and active acceleration/advance and disacceleration" — is exactly the canon's **climate vs gameplay** split:

- **Natural evolution (climate):** components move left→right from market forces, whether you act or not. "Climatic pattern: Everything evolves — All components on your map are moving from left to right under the influence of supply and demand competition." (Wardley, book ch. 3 — https://medium.com/wardleymaps/exploring-the-map-ad0266fad59b). Climate "change[s] the map regardless of your actions … you cannot stop climatic patterns … you can influence, use and exploit them." (same chapter). Learn Wardley Mapping: "Everything evolves through supply and demand competition." (https://learnwardleymapping.com/climate/).
- **Active push/hold (gameplay):** deliberate plays that change the *rate*. "Accelerators — These enable you to accelerate the process of evolution." / "Deaccelerators — These enable you to slow down the process of evolution." (Wardley, "On 61 different forms of gameplay", 2015 — https://blog.gardeviance.org/2015/05/on-61-different-forms-of-gameplay.html; same text at https://www.wardleymaps.com/glossary/gameplay). Book ch. 5 makes the mechanism concrete: "the evolution of a component can be accelerated by an open approach … slowed down through … fear, uncertainty and doubt … or … patents" (https://medium.com/wardleymaps/the-play-and-a-decision-to-act-8eb796b1dff1).
- **Second-order intent (leadership):** "you'll start to reflect your more strategic intentions in the maps themselves (e.g., 'We want to accelerate the evolution of *this* component.'). The least brilliant thing to do … is to brute force your way to that outcome." (Ben Mosior, https://learnwardleymapping.com/leadership/) — the stratagems table there lists Accelerators / De-accelerators as *plays*, distinct from the climatic-pattern table on /climate/.
- **Syntax:** OWM `accelerator name [x, y]` / `deaccelerator name [x, y]` — "Use accelerators to indicate something that speeds up change or evolution … deaccelerators … slows down" (https://docs.onlinewardleymaps.com/docs/map-elements/accelerator/). Mermaid `wardley-beta`: `accelerator "AI Adoption" [0.55, 0.25]` / `deaccelerator "Legacy Constraints" [0.15, 0.75]` (https://mermaid.js.org/syntax/wardley.html). Notation-wise they're thick arrows: "An attempt to alter the map … our influence or goals" (https://www.wardleymaps.com/glossary/notation).
- **Worked bridge (use this on the slide):** book ch. 18's healthcare map — treatments evolve on their own (climate: "Hence a pipeline"); then "The best way … is to **accelerate the pipeline** … through reducing barriers to entry, setting up funds … or using open approaches" (gameplay: accelerators like market enablement/open approaches). Same object, two forces: one observed, one applied.

One line: **evolution is what the market does to a component; accelerators/deaccelerators are what *we* do to speed or hold that movement** — climate vs leadership/gameplay, arrows vs thick arrows.

---

## 4. Slide wording candidates

### "What is a pipeline?" — 3 candidates (each ≤4 bullets, ≤60 chars/bullet, no negations)

**Candidate A — "one meaning, many forms" (closest to Wardley's own words; recommended)**
- One need, one meaning — shown as a row
- Several substitute components you can pick
- Each sits at its own evolution stage
- In Mermaid: same visibility, x varies

**Candidate B — "the choice row" (for a decision-minded audience)**
- One need with more than one way to serve it
- Competing components at different stages
- Pick one, or mix a bit of each
- The square marks where the market is heading

**Candidate C — "the market's spread" (for a market/strategy-minded audience)**
- One capability, forms from novel to commodity
- New forms keep arriving alongside the old
- Each form evolves at its own pace
- Use it to see choice and substitution

### Legend wording pair (labels ≤20 chars each)

| Row | Label | Meaning line (for notes, not the legend) |
|---|---|---|
| Natural evolution | `Market evolution` (17 ch) | Components move with supply & demand — climate, happens anyway |
| Active push/hold | `Active push / hold` (18 ch) | Accelerators & deaccelerators — deliberate gameplay we apply |

Alt pairs if shorter labels are needed: `Natural drift` (13) / `Forced change` (13); or `Market movement` (15) / `Our push / hold` (15).

**Best wording candidate (pick of the kit):** Candidate A, because it states the canon positively in four beats — meaning, substitutes, stages, syntax — and its bullet 3 ("its own evolution stage") sets up the §3 legend pair on the next slide without ever using the forbidden "it is not X" negation.
