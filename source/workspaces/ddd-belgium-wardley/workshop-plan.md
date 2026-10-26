# DDD Belgium workshop — plan

Working document for the deck `ddd-belgium-wardley.md`. Decisions are marked **decided**;
anything not yet settled is listed under [Open questions](#open-questions).

## The event

- Tue 20 Oct 2026, 18:00–22:30, Inuits, Brasschaat. Working time 18:45–22:00, about 195 minutes
  (pizza 18:00–18:30, welcome 18:30–18:45, drinks from 22:00). *Source: Kilo session of 8 Oct,
  read from the meetup text — verify.*
- End goal: lots of in-person mapping and collaboration, with fast 5–10 minute talks in between.
  Slides carry the minimum: points and conclusions. Showing beats explaining.
- **Decided:** the rhythm is *teach → group work → discussion*, repeated. Never several talks in a row.

## Materials

- Printed Wardley Mapping Canvas by Ben Mosior (CC BY-SA 4.0):
  https://github.com/HiredThought/wardley-mapping-canvas, project page
  https://learnwardleymapping.com/portfolio/wardley-mapping-canvas/ (print templates: PDF, A4 and
  larger). Plus sticky notes on the wall.
- Miro as a backup.
- The GitHub repo, for groups who want to model with AI the way we built these maps.
- **Handout:** the scenario card, the exercise steps, the notation and the concept appendix,
  printed or as a link to one compiled PDF.

## Teaching points

CJ's list (Kilo session, 8 Oct):

1. A map raises the quality of communication, compared with not having a map.
2. A Wardley map is a value chain: the landscape is the most basic thing we operate in.
3. On a map things can move and placement has meaning, unlike a graph.
4. Visibility, and problem domain vs solution domain: how to read a map.
5. Mapping at first is like learning the rules of chess; the next step is learning to win.
6. Things on the map move by market forces, or by active gameplay and decisions.
7. A map isn't perfect; the goal is shared understanding through better facilitation.
8. Too much on the map confuses us. Find the primary constraint (Theory of Constraints) and map
   only around it (Tristan Slominski).
9. The evolution axis can carry many labels; Wardley suggests several.
10. Climatic patterns, with the catalogue.
11. Doctrine.
12. Gameplays.

Added since:

13. Constraint (a capacity limit) vs inertia (resistance to change). Exploit and subordinate
    before you elevate (Goldratt's five focusing steps).
14. A map needs a question. Map broadly, cut down for the decision, drill into a submap where needed.
15. Evolution is about the market, not about how mature *your* organisation is at something.

## One pattern, three cases

When producing something gets cheap, **stewardship** becomes the constraint. It sits low on the
map, so it's invisible and hard to fund. The way out is not more gates but **co-creation**: the
stewardship happens while things are made, together, instead of in a review afterwards.

| Case | What got cheap | Where the bottleneck lands | The stewardship | Used for |
| --- | --- | --- | --- | --- |
| Knowledge | Capture, AI-written content | Curation | Stewardship of the body of knowledge | `ka`, `ka-focus`, `ka-arch` maps |
| Agentic delivery | Code, written by AI | Review and alignment | Code review is stewardship of the code | the exercises |
| Data | — | Data nobody trusts | Bad data is the effect of bad design and missing stewardship | its own map, in the appendix (**decided**, Q3) |

Sources for the agentic and data cases, all in *InfoQ eMag #124, Architecting Autonomy* (May 2026):

- *Architectural Governance at AI Speed* (pp. 5–13, CJ co-author): "Code is now a commodity,
  alignment is still not"; declarative architecture; collaborative modelling across team
  boundaries; agent learnings curated into `AGENTS.md`; Fig. 5 is the EM tooling map.
- *Decentralized Architecture in Practice* (p. 30): AI amplifies what is already there; it is a
  stress test of boundaries, decisions and guardrails.
- *Architecting Autonomy: How Decentralizing Architectural Decisions Enables Organizational Scale*
  (pp. 34–38): the architecture function becomes the bottleneck; architects move from controller
  to constraint designer; "You cannot decentralize accountability for shared data integrity."
- *Architecting Autonomy at Scale* (p. 20): data governance as a platform for data quality,
  metadata and stewardship.
- *Decentralizing Architecture at Scale: A Lean Value Tree Approach* (p. 45): start with the
  review that creates the worst bottleneck and automate it as a fitness function (exploit).

## Deck outline

| # | Section | Maps | Then |
| --- | --- | --- | --- |
| 01 | Cup of tea: users, needs, the map | `tea` (12 clicks), legend, scoping | Exercise 1, discussion |
| 01b | Back to the tea shop: constraint and inertia | `tea-toc` (5 clicks: constraint, inertia, exploit, subordinate, elevate) | **decided:** after exercise 1 |
| 02 | Strategy and patterns: how we use the map | five factors, OODA loop, climate | Exercise 2 |
| 03 | Pipelines (12 Oct, short) | a pipeline slide, Wardley's server → cloud map redrawn (`pipeline-wardley-compute`) | Exercise 3 |
| 03b | Tea shop at rush hour | `tea-toc` (7 clicks), Goldratt, legend | Exercise 4 (find the constraint and work it, merged 12 Oct) |
| – | Knowledge base | `kg` (9 clicks) | **moved to the spare slides (12 Oct)** |
| 04 | Knowledge architecture | `ka` (**decided:** all 12 clicks, the overload), `ka-focus` (10), `ka-arch` (7) | Exercise 4 |
| 05 | A real map: EM tooling | `em`, rebuilt from Fig. 5 | Exercise 5 |
| 06 | Wrap-up | — | Plenary |

**Decided (Q5):** the five factors and the OODA loop stay in the main flow, as a teaching section
on *how we use the map*: a map is for deciding the next move. The map is the **landscape**; the
decision is **leadership**; the **climate** is the AI revolution (a climatic pattern acting on
everyone); the OODA loop is the **innovation race**, with the drone war in Ukraine as the example of
who iterates faster. (The `kg` map and its place are still open.)

**Decided (Q6):** plan for six exercises, but treat the count and timings as a hypothesis. Adjust
after CJ's dry runs.

Storyline for section 04: *complexity → focus → depth.* The full map has no question; the
constraint view keeps only the chain to Stewardship, with Knowledge architecture and Platform as
submaps; the submap shows structure, meaning and behaviour, where the most visible layer
(choreography) is the least evolved.

## Notation (all maps)

**Decided:** one notation for every map in the deck, shown on its own slide (next to the legend)
and in the handout. From CJ's article, plus the marks the maps already use:

| Mark | Meaning |
| --- | --- |
| Solid double-line arrow | Intended move: we accelerate it |
| Dashed line | Natural evolution, already happened or still to come |
| Red | The future state (targets and the links between them), as is common Wardley practice. The repo's skill files currently say maps never use red (red is kept for the red button); update `wardley-maps/SKILL.md` and the renderer comment when the EM map is rebuilt |

| Striped bar behind a component | Constraint (the bottleneck) |
| Solid bar | Inertia (resists change) |
| Double ring | Submap: this component has its own map |

### EM map, read off Fig. 5 (CJ's InfoQ article)

Positions are `[visibility, evolution]`, read from the published figure, so roughly ±0.02.
"Now" is where the dot sits today; a move goes from now to the target.

| Component | Now | Move | Kind of move |
| --- | --- | --- | --- |
| Organisation (user) | 0.92, 0.34 | — | — |
| Software Architect (user) | 0.92, 0.50 | — | — |
| Model-driven software development | 0.78, 0.55 | → 0.75 | intended (solid double line) |
| Code following a standard | 0.72, 0.49 | → 0.78 | intended |
| Legacy modernisation | 0.67, 0.24 | → 0.74 | intended |
| Conversational AI Event Modelling | 0.62, 0.17 | → 0.49 | intended, **future state (red)** |
| Event Model Tooling | 0.49, 0.33 | → 0.48 | natural (dashed), **future state (red)** |
| Event Model Schema | 0.41, 0.29 | from 0.14 (past, dashed); → 0.73 | past: natural; future: natural, **red** |
| AI | 0.24, 0.77 | from 0.15 (past, dashed) | natural, already happened |

Links (A → B means A depends on B): Organisation → Legacy modernisation;
Software Architect → Legacy modernisation, Model-driven software development, Code following a standard;
Legacy modernisation, Model-driven software development and Code following a standard → Conversational AI Event Modelling;
Conversational AI Event Modelling → Event Model Tooling, Event Model Schema, AI; Event Model Tooling → Event Model Schema.
Future-state links (red): future Conversational AI Event Modelling → future Event Model Tooling → future Event Model Schema; future Conversational AI Event Modelling → AI.

Notes on the figure: "This is a novelty! $$$" (at Conversational AI Event Modelling); "Conversational AI Event
Modeling needs to be matured into a product."; "AI has been industrialized and is now a utility."; "AI + Schema +
Tooling enables the novelty 'Conversational AI Event Modeling' which enables higher order worth. Everything can be
advanced (industrialized) to product or commodity. And enable various strategic game plays."

The EM map (Fig. 5) is rebuilt with this notation. The deck's current version is wrong (AI drawn
in genesis, missing moves, wrong links).

## Legend: simple first, full later

**Decided (Shu-Ha-Ri):** the legend in the talk shows only the marks the exercises use: user, user need,
bottleneck, resists change (inertia on its evolution path), market evolution, push and hold, submap.
A **full legend** goes in the appendix: also pipeline, market, and the sourcing marks (build, buy,
outsource), each with an example. Pipeline examples: capacity planning → autoscaling (compute), and
cars (combustion, hybrid, electric).

## Appendix (later)

All Wardley map concepts in one place, for the back of the deck and the handout: the axes and
stage labels, users and needs, notation, climatic patterns, doctrine, gameplays, pipelines,
submaps, constraint and inertia, Theory of Constraints.

## Exercises

**Decided:** not on the tea map (groups would copy it). The exercise scenario is **agentic
delivery**: AI makes coding faster, the bottleneck moves to review, and co-creation is the way out.
Groups work on printed canvases with sticky notes, and each round adds one thing to discuss.

**Decided (Q1):** the users are open; each group may choose differently. Candidates to offer:
the organisation (management), the product manager (Marty Cagan's sense, not the Scrum product
owner), the product team (note: "development team → product team" can itself be an evolution on
the map), the domain or subject-matter expert, the architect, the individual developer, the AI agent.
**Fallback** for groups that get stuck, in the code scenario: architect, development team,
individual developer and AI agent (the fewest that tell the story). The knowledge scenario needs
more roles (organisation, contributor, curator, reader).

**Decided (Q2):** review is the new bottleneck. On the map that is simply the constraint mark.
Groups should make progress *and* struggle; the answer lands better after a struggle. Answers we
keep ready for the discussion: exploit by making reviews easy (small changes); a social rule that
review comes before starting new work; switch to pair or ensemble programming so the separate
review disappears; and more.

**The company (13 Oct, fictional):** Harbour Insurance insures ships, cargo and the businesses around
the port of Antwerp. About 2,000 employees and 300,000 policies; quotes, policies and claims run
through its own software. The product and engineering organisation has 6 product teams, about 40
developers and one architect. Its purpose (canvas step 1): get new insurance products and changes
to customers quickly and safely. Its scope for the exercises (step 2): from a product hypothesis to
customers using the change (CJ, 13 Oct: the spec part must stay in scope, so the chain starts at
the hypothesis, not at the code). Management's question: we pay for AI coding agents, but we don't see faster
delivery. What is happening?

**Domain expert brief (draft):** answers only when the group asks. Fictional, consistent with the card.

| They might ask | The domain expert answers |
| --- | --- |
| How many developers and teams? | 6 teams of 5–7, about 40 developers |
| How long does a pull request wait for review? | Before AI under a day; now 3 days on average |
| Who reviews? | Mostly 2 senior developers and the architect; they approve 70% of pull requests |
| How big are the pull requests? | Bigger than before: AI writes a lot of code per change |
| How many pull requests per week? | About three times as many as before AI |
| Why do the seniors review everything? | Rule: core modules need senior approval. Nobody else "knows the system" |
| Do you pair or work in an ensemble? | Rarely. "It's slower" |
| Tests and CI? | Unit tests fine, CI takes 25 minutes. Not the main problem |
| Deployment? | Weekly release, mostly automated |
| More bugs since AI? | A few more in production, mostly misunderstood domain rules |
| Who writes the requirements? | Product managers, now often as vibe-coded prototypes |
| Architectural intent? | 120 ADRs in a wiki. Few people read them |
| The AI tool? | Bought, a commodity, paid per seat |
| What does management want? | Faster time to market without more incidents. They pay per seat for the agents and see no faster delivery |
| What does the company do? | Marine insurance: ships, cargo and port businesses, around Antwerp. 2,000 employees, 300,000 policies |
| The data? | Customer data spread across 3 systems; nobody owns it (hint toward the parallel case) |

**Decided (Q4):** a mix. Each group gets the written scenario card and maps it themselves. After
each round we offer a **reference map**: it practises reading a map, and it is an escape hatch.
Taking it is voluntary: a group either continues on its own map or starts fresh from ours.

**Decided: groups of four, each person with a role.** Roles rotate after every exercise.

| Role | Job |
| --- | --- |
| Domain expert | Has the final word and makes the decisions, so the group doesn't discuss endlessly |
| Facilitator | Starts the conversation and makes sure everyone is heard |
| Timekeeper | Keeps the group to time and makes sure it makes progress |
| Clerk | Handles the practical things: materials, the canvas, and running to CJ with questions |

Six exercises and four roles: everyone holds each role at least once.

Every exercise gets its own slides in the deck: the **task** (what to put on the canvas, step by
step), the **time**, and **what to discuss** afterwards in plenum. The scenario card is a slide
before exercise 1 and is in the handout.

Draft (to agree):

| # | After | Task slide | Discussion slide |
| --- | --- | --- | --- |
| 1 | Cup of tea | Read the scenario. Put the users at the top, their needs under them, then what the needs depend on. Stack by visibility. No evolution axis yet. | Argue one placement. Where is the line between problem and solution domain? |
| 2 | Evolution / climate | Spread your components over the evolution axis. | Where did the room disagree? What is a commodity now that wasn't two years ago? |
| 3 | Pipelines | Draw three pipelines: how you write the specification, how you write code, how you control quality. Place each way of doing it where it is today; draw an arrow if you expect people to move from one way to another. Mark how your team works today. | Where are the pipelines out of step? Are AI evals a new invention or the industrialised form of review? |
| 4 | Tea shop at rush hour | Mark the constraint and one inertia. Exploit, subordinate, elevate. Where does the constraint move? | Is the constraint low on the map? Is it a practice or a technology? Which move needs no budget? |

**Decided 12 Oct:** exercise 3 is the pipelines; the old exercises 3 (find the friction) and 4
(work the constraint) merge into exercise 4; the knowledge base example moves to the spare slides.
Pipeline rule for the groups: a new invention starts on the left; the industrialised form of an
old activity goes on the right, however new it is (cloud, the AI coding agent).
| 5 | Knowledge architecture | Write the question your map answers. Cut everything that doesn't change the answer; fold a cluster into a submap. Reference map: the chain from the business to architecture decisions, the new constraint, resting on governance practice and the governance model. | What did you cut? Is the story clearer? |
| 6 | EM tooling | Draw one move: natural evolution or an intended move. Pick a play. Reference map: decisions move to the teams (ADRs as learning), governance practice evolves from gates to guard rails and feedback loops; the experience model stays in genesis as the open end. | Who loses when your component moves right? What change in your own organisation could you make visible with a map? |

**Storyline v2 built (16 Oct, ds-h8g):** the exercise 4 reference map works the review constraint (small pull
requests, review before new work, ensemble work, architecture rules as automated checks) and the constraint
moves to architecture decisions: the architect cannot decide fast enough once code arrives in hours. Exercises
5 and 6 follow that chain into governance. The spec layers appear only in exercise 6, as the open end.

## Decisions from CJ's slide notes (10–11 Oct)

- **Strategy cycle:** observe the landscape and the climate, orient in the landscape, decide (within
  doctrine), act. Leadership runs the whole loop. Doctrine is the rules we always keep: decisions
  can't violate it, and it makes them faster because there is nothing to discuss.
- **Rush hour:** start with Slominski's question, is the constraint outside the organisation or
  inside? No customers means outside: get seen (a move up the visibility axis). Hand brewing
  evolves toward batch brewing (a tea urn), with the inertia on that line.
- **Terms:** "body of knowledge" on the knowledge base and knowledge architecture maps; governance is
  the rules and decision rights, stewardship the daily practice.
- **Exercise 5 works on paper:** groups start from a printed, deliberately overcrowded agentic
  delivery map (about 20 components: exercise 4's reference map plus tests, CI, tickets, onboarding,
  metrics), write their question on top, cross out, and redraw the cut-down map on the canvas. The
  same map goes on Miro. *To build.*
- **The travelling map:** two people move to the next group with their map and explain it to the two
  who stay. Proposed after exercise 5. *Placement to confirm.*
- **EM map:** rebuilt here, not in the cloud session (done 11 Oct).
- **Public repo:** github.com/cjjohansen/DDD-Belgium-Wardley-Map-2026, created by CJ.

## Later (agreed to wait until the deck and exercises are in place)

- Editor refinements: open plain `.mmd` files, add/rename/delete components, draw links, export.
- CI: validate this deck, check generated files are up to date, warn on links that point upward.

## Open questions

1. The `kg` knowledge-base map: keep it in section 03, or drop it now that the KA section and
   the agentic exercises carry the constraint story?
2. The scenario card text for the agentic exercises (to draft next).
3. The reference map for each exercise round (to build once the scenario card is agreed).
