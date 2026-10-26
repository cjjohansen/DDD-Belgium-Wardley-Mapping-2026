---
marp: true
theme: galaxitech
paginate: true
footer: GalaxiTech · DDD Belgium workshop 2026

---

<!-- _class: title -->
<!-- _paginate: false -->
<!-- _footer: "" -->

<div class="brand"><img src="assets/star.svg" alt="">GALAXITECH</div>

### DDD Belgium · workshop 2026

# See the system

Wardley mapping, one click at a time

---

### How the evening runs

# Talk, group work, discussion

| Talk (5–10 min) | Then, in your group |
| --- | --- |
| 01 Cup of tea | Exercise 1 · Who needs what? |
| 02 Strategy: how we use the map | Exercise 2 · "Spread it out!" |
| 03 Pipelines | Exercise 3 · Three pipelines |
| 04 Tea shop at rush hour | Exercise 4 · Find the constraint and work it |
| 05 Knowledge architecture | Exercise 5 · Cut it down |
| 06 A real map: EM tooling | Exercise 6 · Make a move |

---

<!-- _class: divider -->
<!-- _paginate: false -->

###### 01

## Cup of tea

---

<!-- _class: map -->

### Cup of tea · 1 of 12 — the users

![Two users of the map: the tea shop and its customer](assets/diagrams/wardley-tea-reveal-01.svg)

---

<!-- _class: map -->

### Cup of tea · 2 of 12 — the need

![Both the tea shop and the customer need a cup of tea](assets/diagrams/wardley-tea-reveal-02.svg)

---

<!-- _class: map -->

### Cup of tea · 3 of 12 — the cup

![A cup to hold the tea](assets/diagrams/wardley-tea-reveal-03.svg)

---

<!-- _class: map -->

### Cup of tea · 4 of 12 — tea leaves

![Tea leaves appear under the need](assets/diagrams/wardley-tea-reveal-04.svg)

---

<!-- _class: map -->

### Cup of tea · 5 of 12 — hot water

![Hot water joins the chain](assets/diagrams/wardley-tea-reveal-05.svg)

---

<!-- _class: map -->

### Cup of tea · 6 of 12 — the kettle

![The kettle heats the water](assets/diagrams/wardley-tea-reveal-06.svg)

---

<!-- _class: map -->

### Cup of tea · 7 of 12 — cold water

![Cold water sits under the kettle](assets/diagrams/wardley-tea-reveal-07.svg)

---

<!-- _class: map -->

### Cup of tea · 8 of 12 — the tap

![The tap delivers the cold water](assets/diagrams/wardley-tea-reveal-08.svg)

---

<!-- _class: map -->

### Cup of tea · 9 of 12 — power

![Power completes the value chain](assets/diagrams/wardley-tea-reveal-09.svg)

---

<!-- _class: map -->

### Cup of tea · 10 of 12 — the vertical axis

![The visibility axis appears: user at the top, things underneath](assets/diagrams/wardley-tea-reveal-10.svg)

---

<!-- _class: map -->

### Cup of tea · 11 of 12 — problem domain

![A gold bracket marks the problem domain: user and need](assets/diagrams/wardley-tea-reveal-11.svg)

---

<!-- _class: map -->

### Cup of tea · 12 of 12 — solution domain

![A second bracket marks the solution domain](assets/diagrams/wardley-tea-reveal-12.svg)

---

### Reading the map

# Reading the value chain

- Upper components are visible to the user. Lower components are hidden from the user
- Read down to ask how: how is this need met?
- Read up to ask why: why do we need this?
- Each link is a dependency and an exchange: the component above pays money or effort, and gets a capability back
- So every component has a cost, and provides value to the one above it
- A map is a chain of <mark>needs</mark>

---

### Reading the map

# What goes on a map

- Activities: what we do. Making a cup of tea
- Practices: how we do it. Hand brewing
- Data: facts we keep. The menu and the prices
- Knowledge: what we understand. How strong tea should be
- Things we use: the cup, the kettle

---

<!-- _class: map exercise inset -->

### Mapping · the Wardley Mapping Canvas, by Ben Mosior

![The Wardley Mapping Canvas by Ben Mosior, CC BY-SA 4.0: six boxes, 1 purpose, 2 scope, 3 users, 4 user needs, 5 value chain with a visibility axis, 6 map with the evolution axis from genesis to commodity and the evolutionary characteristics of each stage](assets/wardley-mapping-canvas.webp)

---

<!-- _class: exercise -->

### Mapping · the canvas, step by step

# Exercise 1: six steps to a map

- 1 Purpose: why are we mapping?
- 2 Scope: what is in, what is out?
- 3 Users: who is it for?
- 4 User needs: what do they need?
- 5 Value chain: what do the needs depend on?
- 6 Map: place it all on the evolution axis (exercise 2)
- On the printed canvas, or sticky notes on a table or wall

---

<!-- _class: exercise -->

### The exercises · one scenario all evening

# Exercise 1: Harbour Insurance

- Imagine you are a product team at Harbour Insurance, a fictional company
- Every team now has AI coding agents. Code arrives in hours, not days
- Yet customers get new features no faster than before
- Management asks: we pay for AI coding agents, but we don't see faster delivery. <mark>What is happening?</mark>
- Your domain expert knows more about the company. Ask them
- Your task: map this situation on the canvas, steps 1 to 5

---

<!-- _class: exercise -->

### The exercises · the company

# Exercise 1: the company and its purpose

- Harbour Insurance insures ships, cargo and the businesses around the port of Antwerp
- About 2,000 employees and 300,000 policies. Quotes, policies and claims all run through its own software
- The product and engineering organisation: 6 product teams, about 40 developers, one architect
- Its purpose: get new insurance products and changes to customers quickly and safely
- Its scope for today: from a product hypothesis to customers using the change

---

<!-- _class: exercise -->

### Your group

# Exercise 1: four people, four roles

- Domain expert: has the final word and decides
- Facilitator: starts the talk, makes sure all are heard
- Timekeeper: keeps time and keeps you moving
- Clerk: materials, the canvas, runs to CJ with questions
- Feel free to swap roles after each exercise

---

<!-- _class: exercise -->

### Exercise 1 · group work

# Exercise 1: who needs what?

- Follow the canvas, steps 1 to 5
- Write the purpose and the scope first
- Then the users, and under each user their needs
- Then the value chain: what the needs depend on
- Stack by visibility. Evolution comes later

---

<!-- _class: exercise -->

### Exercise 1 · back together

# Exercise 1: argue one placement

- Where is the line between problem and solution domain?
- Which component was hardest to place?
- Next round: carry on with your map, or start from ours

---

<!-- _class: map exercise -->

### Exercise 1 · one way to map it

![One way to map exercise 1: three users (architect, developer, business) with their needs, and the components they depend on, among them the code review process, continuous integration and the AI coding agent, stacked by visibility, no evolution yet](assets/diagrams/wardley-agentic-reveal-01.svg)

---

### Scoping · after Tristan Slominski

# How much should we map?

- Maps grow until they stop saying anything
- Ask: what is the primary constraint here?
- Map the user, the need, the path to it
- Map around the constraint, as Tristan Slominski teaches it

---

<!-- _class: map -->

### Cup of tea · the map wakes up: evolution

![The value chain spreads onto the evolution axis and becomes a map](assets/diagrams/wardley-tea-reveal-13.svg)

---

### Evolution · labels after Simon Wardley

# Every kind of component evolves

| Activities | Genesis | Custom built | Product (+ rental) | Commodity (+ utility) |
| --- | --- | --- | --- | --- |
| Practices | Novel | Emerging | Good | Best |
| Data | Unmodelled | Divergent | Convergent | Modelled |
| Knowledge | Concept | Hypothesis | Theory | Accepted |

Simon Wardley’s names for the four stages of each kind. Knowledge moves from poorly understood to well understood.

---

<!-- _class: split -->

<div class="text">

### Evolution · knowledge

# Circles on circles

Seen from the Earth, Mars draws loops. The models kept adding circles and still could not predict it.

</div>

<div class="media contain">

![Kepler's own drawing of the path of Mars seen from the Earth, loops on loops, from Astronomia Nova, 1609](assets/kepler-mars.webp)

</div>

---

<!-- _class: split reverse -->

<div class="media top">

![Portrait of Johannes Kepler](assets/kepler.webp)

</div>

<div class="text">

### Evolution · knowledge

# Kepler removed the accidental complexity

He found a simple rule for how the planets move. Our model of the sky went from fuzzy to well understood, and useful.

$$P^2 = \frac{4\pi^2}{G(M_1+M_2)}\,a^3$$

</div>

---

<!-- _class: map -->

### Evolution · knowledge evolves too

![The solar system model on an evolution axis labelled uncharted, emerging, established, well known: it moves from uncharted to established; before, circles on circles, complex for lack of knowledge; Kepler's equation made the model clear and removed the accidental complexity](assets/diagrams/wardley-kepler.svg)

---

<!-- _class: map -->

### Evolution · knowledge evolves too · 1 of 4 — uncharted

![The solar system model on the knowledge evolution axis, with the stage "uncharted" circled in gold. Uncharted: the ancient model, circles on circles, complex for lack of knowledge](assets/diagrams/wardley-kepler-1.svg)

---

<!-- _class: map -->

### Evolution · knowledge evolves too · 2 of 4 — emerging

![The solar system model on the knowledge evolution axis, with the stage "emerging" circled in gold. Emerging: observations pile up and the model is questioned](assets/diagrams/wardley-kepler-2.svg)

---

<!-- _class: map -->

### Evolution · knowledge evolves too · 3 of 4 — established

![The solar system model on the knowledge evolution axis, with the stage "established" circled in gold. Established: Kepler finds the rule, and the model becomes clear and useful](assets/diagrams/wardley-kepler-3.svg)

---

<!-- _class: map -->

### Evolution · knowledge evolves too · 4 of 4 — well known

![The solar system model on the knowledge evolution axis, with the stage "well known" circled in gold. Well known: today everyone learns it at school](assets/diagrams/wardley-kepler-4.svg)

---

<!-- _class: map -->

### Climate · everything evolves

![Water pipes evolved from the aqueduct through custom-made pipes and pipes as products to a commodity that everyone has and nobody thinks about](assets/diagrams/wardley-pipes.svg)

---

<!-- _class: divider -->
<!-- _paginate: false -->

###### 02

## Strategy: how we use the map

---

<!-- _class: split reverse -->
<!-- _footer: "Photo: Martin Makaryan, Unsplash" -->

<div class="media">

![A carved wooden guardian warrior statue in a dark temple hall, black and white, lit from the side](assets/warrior-statue-makaryan.webp)

</div>

<div class="text">

### Strategy

# Strategy and tactics

"Tactics without strategy is the noise before defeat."

"Strategy without tactics is the slowest route to victory."

— attributed to Sun Tzu

</div>

---

### Sun Tzu

# Sun Tzu’s five factors

- Purpose — why we compete
- Landscape — where we stand
- Climate — what changes around us
- Doctrine — training and standard ways of operating
- Leadership — context-dependent strategic decisions

---

<!-- _class: map inset -->

### Sun Tzu · the five factors as Simon Wardley draws them, figure 1, CC BY-SA 4.0

![Simon Wardley's figure 1: the five factors as one ring, purpose, landscape, climate, doctrine and leadership, read clockwise from purpose](assets/wardley/five-factors-fig1.jpeg)

---

### John Boyd · the OODA loop

# John Boyd's OODA loop: observe, orient, decide, act

- Observe: look at the landscape and at what is changing around it, the climate
- Orient: make sense of it with the principles you trust, the doctrine
- Decide: choose the move, which is leadership
- Act: make the move, then observe again, because the landscape has changed
- Boyd was a fighter pilot. The side that goes round the loop faster wins, even with less
- Wardley puts the five factors on this loop. That is his strategy cycle, next slide

---

<!-- _class: map inset -->

### The strategy cycle · Simon Wardley's figure 7, CC BY-SA 4.0

![Simon Wardley's figure 7, the strategy cycle: John Boyd's OODA loop of observe, orient, decide and act around the ring of Sun Tzu's five factors, purpose, landscape, climate, doctrine and leadership, with the two types of why in the centre. His legend names the three sources: Sun Tzu's five factors, the two types of why, John Boyd's OODA loop](assets/wardley/strategy-cycle-fig7.jpeg)

---

<!-- _class: map inset -->

### Doctrine · Simon Wardley's table, figure 236 of his book, CC BY-SA 4.0

![Simon Wardley's doctrine table: forty principles in six categories, communication, development, operation, structure, learning and leading, coloured by the phase in which to adopt them, phase I stop self harm, II become context aware, III better for less, IV continuously evolving. Use appropriate methods sits in development, phase I](assets/wardley/doctrine-fig236-phases.jpeg)

---

<!-- _class: map -->

### Strategy · each loop narrows the uncertainty

![CJ's diagram: from the project start, each iteration gives a partial measurable result inside a decision range; the planned solutions scatter, while the real path converges on the final solution as uncertainty decreases](assets/iteration.webp)

---

### Strategy · after Simon Wardley

# Wardley’s two kinds of why

- Why of purpose: why we play. In chess: to win
- Why of movement: why this move over that one
- Leaders often give the first why and skip the second
- A map lets us argue the <mark>why of movement</mark>

---

<!-- _class: map inset -->

### Strategy · the two types of why, Simon Wardley's figure 2, CC BY-SA 4.0

![Simon Wardley's figure 2: the same ring with a small dotted loop inside it, the why of purpose and the why of movement. The why of purpose is what we are here for; the why of movement is why this move and not another](assets/wardley/two-whys-fig2.jpeg)

---

### Climate

# Things you can't stop

- Everything evolves: genesis to commodity
- Success breeds inertia
- Efficiency enables innovation
- You can anticipate these, not avoid them

---

<!-- _class: map -->

### Co-evolution · 1 of 8 — the users

![An online shop and its customer, the users](assets/diagrams/wardley-compute-reveal-01.svg)

---

<!-- _class: map -->

### Co-evolution · 2 of 8 — the need

![Both need a fast checkout](assets/diagrams/wardley-compute-reveal-02.svg)

---

<!-- _class: map -->

### Co-evolution · 3 of 8 — the web shop

![The web shop delivers the checkout](assets/diagrams/wardley-compute-reveal-03.svg)

---

<!-- _class: map -->

### Co-evolution · 4 of 8 — servers

![The web shop runs on servers, bought as a product](assets/diagrams/wardley-compute-reveal-04.svg)

---

<!-- _class: map -->

### Co-evolution · 5 of 8 — the practice

![Running servers needs capacity planning, a practice](assets/diagrams/wardley-compute-reveal-05.svg)

---

<!-- _class: map -->

### Co-evolution · 6 of 8 — compute evolves

![Servers evolve into cloud compute, a utility](assets/diagrams/wardley-compute-reveal-06.svg)

---

<!-- _class: map -->

### Co-evolution · 7 of 8 — a new practice

![With cloud compute, capacity planning evolves into autoscaling; some teams still plan by hand, which is inertia](assets/diagrams/wardley-compute-reveal-07.svg)

---

<!-- _class: map -->

### Co-evolution · 8 of 8 — co-evolution

![Practices co-evolve with the activity they support; this is one way to draw it](assets/diagrams/wardley-compute-reveal-08.svg)

---

### Climate · co-evolution

# Practices evolve with the activity

- Servers as a product: you need capacity planning
- Compute as a utility: autoscaling replaces it
- Some teams still plan capacity by hand. That is inertia
- Review is old: punch cards made mistakes costly
- Open source made review a daily practice
- Code is now a commodity. <mark>Review will evolve too</mark>

---


<!-- _class: exercise -->

### Exercise 2 · group work

# Exercise 2: "Spread it out!"

- Keep working on your agentic delivery map
- Place every component on the evolution axis
- Genesis, custom built, product, commodity
- Users and needs stay at the top
- Stuck on a placement? The domain expert decides

---

<!-- _class: exercise -->

### Exercise 2 · back together

# Exercise 2: where did your group disagree?

- What is a commodity now that was not two years ago?
- Which placement surprised you?

---

<!-- _class: map exercise -->

### Exercise 2 · one way to map it

![One way to map exercise 2: the same components spread on the evolution axis; code changes, the AI coding agent and continuous integration are product or commodity, the code review process and domain knowledge are custom built](assets/diagrams/wardley-agentic-reveal-02.svg)

---

<!-- _class: map inset -->

### Doctrine · use appropriate methods, Simon Wardley's figure 35, CC BY-SA 4.0

![Simon Wardley's own map for the doctrine use appropriate methods: the online photo service, with a legend of three zones, build in house with agile techniques on the left, use off the shelf products with lean in the middle, outsource to utility suppliers with six sigma on the right](assets/wardley/doctrine-fig35-use-appropriate-methods.jpeg)

---

### Doctrine · use appropriate methods, after Simon Wardley

# One way of working does not fit the whole map

| | Genesis, custom built | Product | Commodity, utility |
| --- | --- | --- | --- |
| The goal | Learn fast | Get it right | Cut cost and variation |
| How we work | Agile: small experiments | Lean: improve the flow | Six Sigma: standardise, automate |
| How we get it | Build it ourselves | Buy it and fit it in | Rent it as a utility |
| At Harbour Insurance | The product hypothesis | Event model tooling | AI coding agents, CI |

Simon Wardley’s doctrine <mark>use appropriate methods</mark>: pick the way of working by the stage you just placed it in, not by habit.

---

<!-- _class: divider -->
<!-- _paginate: false -->

###### 03

## Pipelines: several ways to do one thing

---

### Pipelines

# A pipeline: several ways to do one thing

- One component, several ways to do it, side by side in a box
- Each way sits at its own stage of evolution
- A new invention starts on the left
- The industrialised form of an old activity goes on the right, however new it is
- If people move from one way to another, draw an arrow

---

<!-- _class: map -->

### Pipelines · after Simon Wardley, "Map evolution not maturity"

![Compute as a pipeline, redrawn after Simon Wardley's map for an application builder in 2006: a user needs an application, which needs architectural practice, which needs compute. Compute is a pipeline of server and cloud. Cloud is newer but sits to the right, because it is compute as a utility; a red arrow shows people moving from server to cloud](assets/diagrams/pipeline-wardley-compute.svg)

---

<!-- _class: exercise -->

### Exercise 3 · group work

# Exercise 3: three pipelines

- Keep working on your map
- Draw three pipelines: how you write the specification, how you write code, and how you control quality
- In each pipeline, place every way of doing it where it is today
- If you expect people to move from one way to another, draw an arrow
- Mark the way your team works today

---

<!-- _class: exercise -->

### Exercise 3 · back together

# Exercise 3: where are the pipelines out of step?

- Which pipeline has moved furthest to the right?
- Are AI evals a new invention, or the industrialised form of review?
- Did anyone draw an arrow in quality control?

---

<!-- _class: map exercise -->

### Exercise 3 · one way to map it

![One way to map exercise 3: the business needs new features to reach customers sooner, which needs code changes, quality control and a specification, each drawn as a pipeline. Code changes: by hand, AI-assisted, AI coding agent, with an arrow from by hand to the AI coding agent. Quality control: AI evals on the left, review by people custom built, automated tests in CI on the right. Specification: written requirements, event model and specs, user stories, with an arrow from written requirements to the event model. Code moves right fast, and quality control has not followed](assets/diagrams/wardley-agentic-pipelines.svg)

---

<!-- _class: divider -->
<!-- _paginate: false -->

###### 04

## Tea shop at rush hour

---

<!-- _class: map -->

### Tea shop at rush hour · 1 of 7 — outside or inside?

![First question: is the constraint outside the shop? With no customers it is, and the move is to get seen](assets/diagrams/wardley-tea-toc-reveal-01.svg)

---

<!-- _class: map -->

### Tea shop at rush hour · 2 of 7 — the constraint

![Or the constraint is inside the shop: customers queue at rush hour and one kettle boils too slowly](assets/diagrams/wardley-tea-toc-reveal-02.svg)

---

<!-- _class: map -->

### Tea shop at rush hour · 3 of 7 — exploit

![Exploit the kettle: boil ahead, keep it full](assets/diagrams/wardley-tea-toc-reveal-03.svg)

---

<!-- _class: map -->

### Tea shop at rush hour · 4 of 7 — subordinate

![Subordinate: take only the orders the kettle can serve](assets/diagrams/wardley-tea-toc-reveal-04.svg)

---

<!-- _class: map -->

### Tea shop at rush hour · 5 of 7 — elevate

![Elevate: buy a hot water dispenser, the kettle evolves to commodity](assets/diagrams/wardley-tea-toc-reveal-05.svg)

---

<!-- _class: map -->

### Tea shop at rush hour · 6 of 7 — the constraint moves

![With the kettle elevated, the constraint moves to hand brewing](assets/diagrams/wardley-tea-toc-reveal-06.svg)

---

<!-- _class: map -->

### Tea shop at rush hour · 7 of 7 — the inertia

![Hand brewing could evolve toward batch brewing with a tea urn, but staff want to brew every cup by hand: the inertia sits on that line](assets/diagrams/wardley-tea-toc-reveal-07.svg)

---

### Tea shop at rush hour

# Two kinds of friction

- Constraint: a capacity limit. One kettle, a queue
- Inertia: resistance to change. "We brew by hand"
- A constraint caps the flow; inertia blocks the move
- Work on the constraint first. The rest waits on it

---

### Theory of Constraints · Goldratt

# Goldratt: exploit before you elevate

- First ask: is the constraint outside the shop or inside?
- Exploit: get the most out of the constraint as it is
- Subordinate: pace everything else to it
- Elevate: invest only when that is not enough
- Repeat: the constraint moves, often into a practice

---

<!-- _class: map -->

### Legend

![The marks used on these maps: person for the user, gold ring for a user need, striped bar for the bottleneck, solid bar for resists change, gold dashed arrow to a ghost ring for market evolution, block arrows for we push it right and we hold it back, double ring for a component with its own map](assets/diagrams/legend.svg)

---

<!-- _class: exercise -->

### Exercise 4 · group work

# Exercise 4: find the constraint and work it

- Keep working on your map
- Mark the constraint: where does the work wait?
- Mark one inertia: what resists change?
- Exploit it, subordinate everything else to it, then elevate it
- Then ask: where does the constraint move?

---

<!-- _class: exercise -->

### Exercise 4 · back together

# Exercise 4: where does the bottleneck move next?

- Is the constraint low on the map, where nobody sees it?
- Is it a practice or a technology?
- Which of your moves needs no budget?
- Did anyone make the practice itself change?

---

<!-- _class: map exercise -->

### Exercise 4 · one way to find the constraint

![One way to find the constraint in exercise 4: the code review process is the constraint and carries inertia](assets/diagrams/wardley-agentic-reveal-03.svg)

---

<!-- _class: map exercise -->

### Exercise 4 · one way to work the constraint

![One way to work the constraint in exercise 4: exploit with small pull requests and review before new work; elevate by building together and by turning the architecture rules into automated checks; the architect now sits on the map, and the constraint moves to architecture decisions, which the architect cannot make fast enough](assets/diagrams/wardley-agentic-reveal-04.svg)

---

<!-- _class: divider -->
<!-- _paginate: false -->

###### 05

## Zoom in: knowledge architecture

---

<!-- _class: map -->

### Knowledge architecture · 1 of 12 — the organisation

![The organisation, the first user](assets/diagrams/wardley-ka-reveal-01.svg)

---

<!-- _class: map -->

### Knowledge architecture · 2 of 12 — its need

![Its need: knowledge that compounds](assets/diagrams/wardley-ka-reveal-02.svg)

---

<!-- _class: map -->

### Knowledge architecture · 3 of 12 — the hub

![The body of knowledge, the hub](assets/diagrams/wardley-ka-reveal-03.svg)

---

<!-- _class: map -->

### Knowledge architecture · 4 of 12 — the roles

![Three roles and their needs: contributor, curator, reader](assets/diagrams/wardley-ka-reveal-04.svg)

---

<!-- _class: map -->

### Knowledge architecture · 5 of 12 — capture

![Knowledge capture feeds the body of knowledge](assets/diagrams/wardley-ka-reveal-05.svg)

---

<!-- _class: map -->

### Knowledge architecture · 6 of 12 — discovery

![Discovery helps readers find trusted knowledge](assets/diagrams/wardley-ka-reveal-06.svg)

---

<!-- _class: map -->

### Knowledge architecture · 7 of 12 — classification

![Classification, driven by discovery and capture](assets/diagrams/wardley-ka-reveal-07.svg)

---

<!-- _class: map -->

### Knowledge architecture · 8 of 12 — stewardship

![Stewardship, the curator practice, marked as the constraint](assets/diagrams/wardley-ka-reveal-08.svg)

---

<!-- _class: map -->

### Knowledge architecture · 9 of 12 — the stack

![Choreography, ontology and taxonomy as a stack](assets/diagrams/wardley-ka-reveal-09.svg)

---

<!-- _class: map -->

### Knowledge architecture · 10 of 12 — the platform

![The commodity platform underneath](assets/diagrams/wardley-ka-reveal-10.svg)

---

<!-- _class: map -->

### Knowledge architecture · 11 of 12 — the loop

![Feedback loops back to capture and stewardship](assets/diagrams/wardley-ka-reveal-11.svg)

---

<!-- _class: map -->

### Knowledge architecture · 12 of 12 — the move

![Stewardship evolves: the full map, now overloaded](assets/diagrams/wardley-ka-reveal-12.svg)

---

### Knowledge architecture

# A map with no question

- Twenty components, thirty lines
- Everything is true, nothing is decided
- Ask: which question does this map answer?
- Keep what changes the answer, fold the rest

---

### Knowledge architecture · cutting a map down

# Four ways to make a map readable

- One question per map: keep what changes the answer
- One map per user, when their needs really differ
- Map around the constraint: the chain to it, nothing else
- Fold a cluster into a submap
- Next: the constraint view, then a submap

---

<!-- _class: map -->

### The constraint view · 1 of 10 — viability

![The organisation and its need](assets/diagrams/wardley-ka-focus-reveal-01.svg)

---

<!-- _class: map -->

### The constraint view · 2 of 10 — the curator

![The curator keeps knowledge current](assets/diagrams/wardley-ka-focus-reveal-02.svg)

---

<!-- _class: map -->

### The constraint view · 3 of 10 — the reader

![The reader finds what they need](assets/diagrams/wardley-ka-focus-reveal-03.svg)

---

<!-- _class: map -->

### The constraint view · 4 of 10 — the hub

![The body of knowledge](assets/diagrams/wardley-ka-focus-reveal-04.svg)

---

<!-- _class: map -->

### The constraint view · 5 of 10 — the constraint

![Stewardship, the constraint](assets/diagrams/wardley-ka-focus-reveal-05.svg)

---

<!-- _class: map -->

### The constraint view · 6 of 10 — classification

![Classification depends on stewardship](assets/diagrams/wardley-ka-focus-reveal-06.svg)

---

<!-- _class: map -->

### The constraint view · 7 of 10 — a submap

![Knowledge architecture folded into a submap](assets/diagrams/wardley-ka-focus-reveal-07.svg)

---

<!-- _class: map -->

### The constraint view · 8 of 10 — the platform

![The platform folded into a submap](assets/diagrams/wardley-ka-focus-reveal-08.svg)

---

<!-- _class: map -->

### The constraint view · 9 of 10 — the loop

![Feedback loops](assets/diagrams/wardley-ka-focus-reveal-09.svg)

---

<!-- _class: map -->

### The constraint view · 10 of 10 — elevate

![Stewardship evolves: the elevate move](assets/diagrams/wardley-ka-focus-reveal-10.svg)

---

### Knowledge architecture · the constraint view

# Stewardship holds the flow

- Every need runs through stewardship
- Exploit: curate what readers ask for; agents pre-tag
- Subordinate: pace capture to curation
- Elevate: shared stewardship, the evolve arrow

---

<!-- _class: map -->

### Submap · knowledge architecture · 1 of 7 — the submap

![The knowledge architecture submap](assets/diagrams/wardley-ka-arch-reveal-01.svg)

---

<!-- _class: map -->

### Submap · knowledge architecture · 2 of 7 — behaviour

![Choreography: how the system behaves](assets/diagrams/wardley-ka-arch-reveal-02.svg)

---

<!-- _class: map -->

### Submap · knowledge architecture · 3 of 7 — meaning

![Ontology: what things mean](assets/diagrams/wardley-ka-arch-reveal-03.svg)

---

<!-- _class: map -->

### Submap · knowledge architecture · 4 of 7 — structure

![Taxonomy: what exists](assets/diagrams/wardley-ka-arch-reveal-04.svg)

---

<!-- _class: map -->

### Submap · knowledge architecture · 5 of 7 — the steward

![Stewardship looks after meaning and structure](assets/diagrams/wardley-ka-arch-reveal-05.svg)

---

<!-- _class: map -->

### Submap · knowledge architecture · 6 of 7 — notations

![Behaviour notations such as event models](assets/diagrams/wardley-ka-arch-reveal-06.svg)

---

<!-- _class: map -->

### Submap · knowledge architecture · 7 of 7 — standards

![Semantic standards such as SKOS and OWL](assets/diagrams/wardley-ka-arch-reveal-07.svg)

---

### Knowledge architecture · submap

# Structure, meaning, behaviour

- Taxonomy: what exists and how it is grouped
- Ontology: what things and their relations mean
- Behaviour: what happens over time
- Users feel behaviour, yet it is the <mark>least evolved</mark>
- We polish taxonomy because it is easy to see
- Stewardship looks after all three layers

---

### Knowledge architecture · the street light

# Searching where it is easy

![Storm P cartoon strip, 1926: a man searches for his key under a street lamp, although he lost it in the dark street, because the light is better here](assets/storm-p-streetlight.webp)

"Why look here?" "Because the light is better." Storm P, 1926.

---

<!-- _class: exercise -->

### Exercise 5 · group work

# Exercise 5: cut it down

- Keep working on your agentic delivery map
- Write the question your map answers
- Remove what does not change the answer
- Fold one cluster into a submap
- Keep the constraint and the chain to it
- Aim for twelve components or fewer

---

<!-- _class: exercise -->

### Exercise 5 · back together

# Exercise 5: what did you cut?

- Is the story clearer now?
- What went into your submap?

---

<!-- _class: map exercise -->

### Exercise 5 · one way to map it

![One way to map exercise 5: cut down to the business and one question, how do we make architecture decisions faster without losing alignment; the chain runs from the need through code changes, the AI coding agent and the architectural intent to architecture decisions, the constraint, which rests on governance practice (review boards and approvals) and the governance model (rules as code, fitness functions); the delivery platform is folded into a submap](assets/diagrams/wardley-agentic-reveal-05.svg)

---

<!-- _class: divider -->
<!-- _paginate: false -->

###### 06

## A real map

---

<!-- _class: map -->

### EM tooling · 1 of 13 — the users

![An organisation and a software architect, the users of the map](assets/diagrams/wardley-em-reveal-01.svg)

---

<!-- _class: map -->

### EM tooling · 2 of 13 — the stakes

![The organisation and the architect need legacy modernisation](assets/diagrams/wardley-em-reveal-02.svg)

---

<!-- _class: map -->

### EM tooling · 3 of 13 — the practice

![The architect works in a model-driven way](assets/diagrams/wardley-em-reveal-03.svg)

---

<!-- _class: map -->

### EM tooling · 4 of 13 — the standard

![Model-driven development needs code following a standard](assets/diagrams/wardley-em-reveal-04.svg)

---

<!-- _class: map -->

### EM tooling · 5 of 13 — the novelty

![Conversational AI event modelling, a novelty in genesis, serves all three](assets/diagrams/wardley-em-reveal-05.svg)

---

<!-- _class: map -->

### EM tooling · 6 of 13 — the tooling

![It runs on event model tooling](assets/diagrams/wardley-em-reveal-06.svg)

---

<!-- _class: map -->

### EM tooling · 7 of 13 — the schema

![The tooling depends on an event model schema, below it](assets/diagrams/wardley-em-reveal-07.svg)

---

<!-- _class: map -->

### EM tooling · 8 of 13 — the engine

![Conversational AI event modelling depends on AI, now a commodity](assets/diagrams/wardley-em-reveal-08.svg)

---

<!-- _class: map -->

### EM tooling · 9 of 13 — the past

![Dashed lines show where the schema and AI came from: natural evolution in the past](assets/diagrams/wardley-em-reveal-09.svg)

---

<!-- _class: map -->

### EM tooling · 10 of 13 — our moves

![Solid double arrows show intended moves: legacy modernisation, model-driven development, code following a standard and conversational AI event modelling, each to a red future state](assets/diagrams/wardley-em-reveal-10.svg)

---

<!-- _class: map -->

### EM tooling · 11 of 13 — the future

![Dashed red lines show the natural evolution still to come for the tooling and the schema; red links join the future state](assets/diagrams/wardley-em-reveal-11.svg)

---

<!-- _class: map -->

### EM tooling · 12 of 13 — comments on

![Notes: the novelty is room to differentiate and earn; it needs to mature into a product; AI is a utility now](assets/diagrams/wardley-em-reveal-12.svg)

---

<!-- _class: map -->

### EM tooling · 13 of 13 — comments off

![The same map with the notes hidden](assets/diagrams/wardley-em-reveal-13.svg)

---

### EM tooling

# Where this can go

- Evolve the schema — it becomes the standard
- Mature the tooling past custom built
- Treat AI as a utility — it already is
- The worth is in the <mark>conversation</mark>

---

<!-- _class: exercise -->

### Exercise 6 · group work

# Exercise 6: make a move

- Keep working on your agentic delivery map
- Draw one move on your map
- Natural evolution: a dashed line
- Intended move: a solid arrow
- Pick a play: something that speeds the move up, or holds it back

---

<!-- _class: exercise -->

### Exercise 6 · back together

# Exercise 6: who loses when your component moves right?

- Which component did you move, and where does it end up?
- Who gains from that move? Who loses a role, a budget or a skill they are proud of?
- Would you dare to make that move this quarter?
- What change in your own organisation or team could you make visible with a Wardley map?

---

<!-- _class: map exercise -->

### Exercise 6 · one way to map it

![One way to map exercise 6: two moves and an open end. Architecture decisions move right to the teams, with ADRs as learning rather than approval; governance practice evolves from gates to guard rails and feedback loops; the product hypothesis, the specification and the experience model join the map, and the experience model stays in genesis as the open end: how much of it can AI do](assets/diagrams/wardley-agentic-reveal-06.svg)

---

### Exercise 6 · the same story in this week's research

# One day of research news, 17 October 2026

- Martin Rosén-Lidholm reads the agentic engineering papers every day and writes a digest
- About today's batch he wrote: "one of the strongest Software Civil Engineering signals we've seen. Multiple papers independently converge on the same thesis from different angles."
- The thesis: code generation is cheap, so the work moves to formal workflows, verified approvals and clear specifications
- That is the map you just drew. Next: his six pillars, then his five papers on one map

---

### Exercise 6 · Martin Rosén-Lidholm's six pillars of an engineering discipline, 1 of 2

# Six pillars of Software Civil Engineering

| Pillar, from civil engineering | Software today | What Martin proposes |
| --- | --- | --- |
| Formal specification and verification | user stories, ad hoc documents | the event model as the specification, checked by evaluations |
| Standardised material datasheets | no performance profiles for frameworks or infrastructure | provider profiles: known latency, throughput, limits |
| Building codes and norms | fragments: OWASP, well-architected frameworks | a policy model of rules that must always hold |

---

### Exercise 6 · Martin Rosén-Lidholm's six pillars of an engineering discipline, 2 of 2

# Six pillars of Software Civil Engineering

| Pillar, from civil engineering | Software today | What Martin proposes |
| --- | --- | --- |
| Simulation and modelling | almost none for application logic | run the behaviour as pure functions first |
| Professional licensure and liability | no personal accountability | an open gap, nothing proposed yet |
| Formal education and examination | varies, no proof of competence | specification as an examined skill |

Source: Martin Rosén-Lidholm, Software Civil Engineering: From Craft to Discipline, 22 March 2026, chronograph.rosenlidholm.se

---

<!-- _class: map -->

### Exercise 6 · one day of research news on one map

![One day of research news on one map. An engineering organisation needs changes delivered safely by agents. The agent harness rests on authorisation of agent actions, the constraint today, on formal agent workflows, on root-cause analysis by agents and on routing of routine decisions. Model training is evolving towards product since agents now do it themselves. Inference is a commodity. Understanding ambiguous requirements stays in genesis, the same open end as exercise 6](assets/diagrams/digest-2026-10-17.svg)

---

<!-- _class: divider -->
<!-- _paginate: false -->

###### 07

## Wrap-up · the whole evening

---

### Back together

# What did the maps say?

- One insight per table, one sentence
- Where did the groups disagree?
- What moves right first?

---

<!-- _class: divider -->
<!-- _paginate: false -->

###### 08

## Extra exercise, if there is time · your own domain

---

### Exercise · 10 min

# Draw one chain

- Pick a real user and one real need
- Add three things the need depends on
- Stack them: most visible at the top
- Place each on the evolution axis

---

### Exercise · 10 min

# Add the truth

- Mark what you would buy tomorrow
- Mark what hurts to change
- Mark one thing that should move right
- Find the constraint. Focus your map on it, and remove what is not strictly needed

---

### Exercise · 15 min

# Swap and stress-test

- Swap maps with another pair
- Ask: what did we leave off the chain?
- Ask: where would we place this differently?
- One <mark>decision</mark> per map: buy, build or evolve

---

<!-- _class: divider -->
<!-- _paginate: false -->

###### 09

## Extra, if there is time · buy vs build

---

### Extra, if there is time · buy vs build

# Kettles and whiteboards

- The kettle: a product. Buy it, never build
- The whiteboard: rent, don't make
- Build only where customers pay you to differ
- If you build a kettle, you are the map's problem

---

<!-- _class: divider -->
<!-- _paginate: false -->

###### 10

## Extra, if there is time · inertia

---

### Extra, if there is time · inertia

# What resists moving right

- Good facilitation is a craft. It is hard to turn into a product
- When something won't move, ask who would lose if it did
- Turning a craft into a product can kill it, or let it scale
- Help it evolve, or work around it

---

<!-- _class: divider -->
<!-- _paginate: false -->

###### 11

## Extra, if there is time · the pipeline

---

### Extra, if there is time · the pipeline

# Several ways to do one thing

- One need, several ways to meet it
- Each way sits at its own stage of evolution
- Each way evolves at its own pace
- We can <mark>speed a move up</mark>: open source, standards
- Or slow it down: patents, lock-in

---

<!-- _class: map -->

### The pipeline — compute

![Compute as a pipeline: hand-built, managed hosting, IaaS and serverless in one row, with legacy skills holding it back and market pull pushing it right](assets/diagrams/pipeline.svg)

---

<!-- _class: divider -->
<!-- _paginate: false -->

###### 12

## Extra, if there is time · knowledge base

---

<!-- _class: map -->

### Knowledge base · 1 of 9 — the user

![An employee, the user of the knowledge base](assets/diagrams/wardley-kg-reveal-01.svg)

---

<!-- _class: map -->

### Knowledge base · 2 of 9 — the need

![The employee needs a trusted answer to a question](assets/diagrams/wardley-kg-reveal-02.svg)

---

<!-- _class: map -->

### Knowledge base · 3 of 9 — the assistant

![The answer comes through an AI assistant, a product](assets/diagrams/wardley-kg-reveal-03.svg)

---

<!-- _class: map -->

### Knowledge base · 4 of 9 — the knowledge

![The assistant and the answer both rest on the body of knowledge, custom built](assets/diagrams/wardley-kg-reveal-04.svg)

---

<!-- _class: map -->

### Knowledge base · 5 of 9 — the sources

![The body of knowledge is fed from source systems, a commodity](assets/diagrams/wardley-kg-reveal-05.svg)

---

<!-- _class: map -->

### Knowledge base · 6 of 9 — the model

![The AI assistant runs on an LLM, deep in commodity](assets/diagrams/wardley-kg-reveal-06.svg)

---

<!-- _class: map -->

### Knowledge base · 7 of 9 — the trust

![The assistant depends on governance, the constraint](assets/diagrams/wardley-kg-reveal-07.svg)

---

<!-- _class: map -->

### Knowledge base · 8 of 9 — the snag

![The body of knowledge rests on an ontology; its move toward a shared vocabulary carries inertia: everyone must agree the meanings again](assets/diagrams/wardley-kg-reveal-08.svg)

---

<!-- _class: map -->

### Knowledge base · 9 of 9 — the move

![The body of knowledge evolves toward a product](assets/diagrams/wardley-kg-reveal-09.svg)

---

### Knowledge base

# Trust is the product

- Buy the assistant, the model, the plumbing
- Build the body of knowledge — <mark>where you differ</mark>
- The ontology resists: everyone must agree the meanings again
- The constraint sits at governance — map there

---

<!-- _class: divider -->
<!-- _paginate: false -->

###### 13

## Appendix · cheat sheet

---

### Appendix · the evolution axis

# Evolution: four sets of stage labels

| Activities | Genesis | Custom built | Product (+ rental) | Commodity (+ utility) |
| --- | --- | --- | --- | --- |
| Practices | Novel | Emerging | Good | Best |
| Data | Unmodelled | Divergent | Convergent | Modelled |
| Knowledge | Concept | Hypothesis | Theory | Accepted |

Evolution runs left to right, as on the map.

---

### Appendix · users and needs

# Users and needs: start from the user

- The anchor is a user: a person, a team or an organisation
- Their needs sit just below, in their words
- Everything else is there to meet a need
- Ask "how?" to go down the chain, "why?" to go up
- Several users? Where their needs differ, look closer

---

<!-- _class: map -->

### Appendix · legend

![The marks used in the exercises: person for the user, gold ring for a user need, striped bar for the bottleneck, solid bar for resists change, gold dashed arrow to a ghost ring for market evolution, block arrows for we push it right and we hold it back, double ring for a component with its own map](assets/diagrams/legend.svg)

---

<!-- _class: map -->

### Appendix · the rest of the legend

![The marks the talk leaves out: hollow ring for we build it, light disc for we buy it, grey disc for we outsource it, clustered disc for a market, and a pipeline: a box with custom, product and utility stages in one row, one thing done several ways](assets/diagrams/legend-full.svg)

---

<!-- _class: map -->

### Appendix · pipeline — the cup

![The cup as a pipeline: a customer needs a cup of tea, which needs a cup; the cup is a pipeline of a recyclable cup, porcelain and disposable plastic, each at its own stage of evolution](assets/diagrams/pipeline-cup.svg)

---

<!-- _class: map -->

### Appendix · pipeline — cars

![Cars as a pipeline: a driver needs to get around, which needs a car, which needs propulsion; propulsion is a pipeline of electric, hybrid and combustion, each at its own stage of evolution](assets/diagrams/pipeline-cars.svg)

---

### Appendix · submaps

# Submaps: a map inside a component

- A square around a component: it has its own map
- Keep the top map to the decision at hand
- Open a submap only for the part your question is about
- Inside, the same rules: users, needs, evolution

---

### Appendix · constraint and inertia

# Constraint vs inertia

- Constraint: a capacity limit. Work piles up in front of it
- Inertia: the old way is kept although a better one exists
- Constraint sits on the component: the striped bar
- Inertia sits on its evolution line: the solid bar
- Ask who would lose if it moved: that is the inertia

---

### Appendix · Theory of Constraints · Goldratt

# Goldratt’s Theory of Constraints: five steps

- Identify the constraint
- Exploit it: get the most out of what is there
- Subordinate everything else to it
- Elevate it: add capacity, <mark>only now</mark>
- Repeat: the constraint has moved

---

### Appendix · climate · after Simon Wardley

# Wardley’s climate: patterns you can't stop

- Everything evolves through supply and demand competition
- Characteristics change as components evolve
- No choice over evolution
- Practices co-evolve with the activities they support
- Efficiency enables innovation
- Higher-order systems create new sources of worth
- Past success breeds inertia

---

### Appendix · doctrine · after Simon Wardley

# Wardley’s doctrine: principles that work anywhere

- Focus on user needs
- Know your users
- Use a common language
- Challenge assumptions
- Remove duplication and bias
- Use appropriate methods
- Think small: small teams, small parts

---

### Appendix · gameplay · after Simon Wardley

# Wardley’s gameplay: moves you can choose

- Open approaches: commoditise a layer someone else owns
- ILC: innovate, leverage, commoditise
- Standards game: set the rules others build on
- Exploit inertia: move where a rival can't follow
- Co-creation: build it with users, not for them

---

<!-- _class: map -->

### Appendix · a parallel case — data (draft)

![Draft map of the data case: the business needs decisions it can trust, which need reports, which need shared data; shared data depends on cheap data pipelines and cloud storage on the right, and on a data model and data stewardship on the left; data stewardship carries the bottleneck bar; notes say pipelines and storage are cheap, and bad data comes from missing design and stewardship](assets/diagrams/wardley-bad-data.svg)

---

### Reading · books that use Wardley maps

# If you want to read on

![h:108 Wardley Maps by Simon Wardley, the Leanpub edition](assets/books/wardley-maps-gunter.png) ![h:108 Architecture for Flow by Susanne Kaiser](assets/books/architecture-for-flow.jpg) ![h:108 Architecture Modernization by Nick Tune](assets/books/architecture-modernization.jpg) ![h:108 The Value Flywheel Effect by David Anderson, Mark McCann and Michael O’Reilly](assets/books/value-flywheel-effect.jpg) ![h:108 Crafting Engineering Strategy by Will Larson](assets/books/crafting-engineering-strategy.jpg) ![h:108 Flow Architectures by James Urquhart](assets/books/flow-architectures.jpg) ![h:108 The Art of Strategy by Erik Schön](assets/books/the-art-of-strategy.jpg) ![h:108 Crossing the Chasm with Wardley Maps by Joaquín Peña Fernández](assets/books/crossing-the-chasm-with-wardley-maps.jpg) ![h:108 Draw your company strategy by Joaquín Peña Fernández](assets/books/draw-your-company-strategy.jpg) ![h:108 Practical Introduction to Wardley Mapping by E. Alex Hudson](assets/books/practical-introduction-to-wardley-mapping.png) ![h:108 Platform Strategy by Gregor Hohpe](assets/books/platform-strategy.png)

- First: Simon Wardley’s own book, free to read at medium.com/wardleymaps and on Leanpub
- All the others map with Wardley maps. Kaiser and Tune write for a DDD audience
- Erik Schön’s annex to The Art of Strategy collects 168 Wardley maps from 90 mappers, free to read. One of them is my logistics map

---

<!-- _class: end -->
<!-- _paginate: false -->
<!-- _footer: "" -->

<div class="brand"><img src="assets/star.svg" alt="">GALAXITECH</div>

### Thank you

# Questions

galaxi.tech · cj@galaxi.tech<br>linkedin.com/in/cjjohansen<br>`github.com/cjjohansen/DDD-Belgium-Wardley-Map-2026`

<span class="btn gold">Book a workshop</span>
