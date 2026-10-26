#!/usr/bin/env node
// Generate one .mmd per reveal step, per map family. Each file is the FULL map drawn
// with only the first N pieces, so the audience watches the map build up click by click —
// and the presenter can step BACK through map history, because every state is its own slide.
// Layers (axes, domain brackets, strategy marks, notes) are separate pieces or per-state
// foot lines, so a slide can show or hide a whole layer.
//   node scripts/gen-reveal.mjs
import { writeFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(path.dirname(process.argv[1]), '..')
// These maps belong to the DDD Belgium deck, so they are written into its workspace.
const dir = path.join(root, 'workspaces', 'ddd-belgium-wardley', 'diagrams')

const HIDE_BOTH = ['%% hide-x-axis', '%% hide-y-axis']
const HIDE_X = ['%% hide-x-axis']
const BRACKET_PROBLEM = '%% domain-bracket "Problem domain" 0.94 0.68'
const BRACKET_SOLUTION = '%% domain-bracket "Solution domain" 0.64 0.02'

// The finished tea map, shared by the tea reveal (its last click) and the tea-toc reveal.
const TEA_MAP = [
  // Two users, as in Wardley's original (business and public): the shop and the person drinking the tea.
  'anchor "Tea shop" [0.88, 0.66]',
  'anchor "Customer" [0.88, 0.84]',
  'component "Cup of tea" [0.75, 0.75]',
  'component "Cup" [0.56, 0.76]',
  'component "Tea leaves" [0.46, 0.84]',
  'component "Hot water" [0.56, 0.92]',
  'component "Kettle" [0.42, 0.55]',
  'component "Cold water" [0.28, 0.80]',
  'component "Tap" [0.14, 0.90]',
  'component "Power" [0.28, 0.94]',
  '',
  '"Tea shop" -> "Cup of tea"',
  '"Customer" -> "Cup of tea"',
  '"Cup of tea" -> "Cup"',
  '"Cup of tea" -> "Tea leaves"',
  '"Cup of tea" -> "Hot water"',
  '"Hot water" -> "Kettle"',
  '"Kettle" -> "Cold water"',
  '"Cold water" -> "Tap"',
  '"Kettle" -> "Power"',
  '%% label-side "Cup" left',
  '%% label-side "Kettle" left',
]
// Rush hour adds the brewing practice: components can be practices too. It evolves toward batch
// brewing (a tea urn) and carries the inertia on that line ("we brew every cup by hand"); once
// the kettle is elevated the constraint moves onto it.
const TEA_RUSH = [...TEA_MAP, 'component "Hand brewing" [0.56, 0.30]', '"Cup of tea" -> "Hand brewing"', '%% label-side "Hand brewing" left']
const BREWING = 'component "Hand brewing" [0.56, 0.30]'
const BREWING_MOVE = ['evolve "Hand brewing" 0.55', 'note "Toward batch brewing: a tea urn" [0.50, 0.24]']
const teaInertia = (l) => (l === BREWING ? `${l} (inertia)` : l)
// Slominski's first question: is the constraint outside the organisation or inside it?
// No customers means it is outside: get seen (a move up the visibility axis, not along evolution).
const TEA_OUTSIDE = [
  'note "No customers? The constraint is outside the shop" [0.42, 0.06]',
  'note "Get seen: a sign in the street, a menu online" [0.34, 0.06]',
]
const TEA_NOTES = [
  'note "Exploit: boil ahead, keep it full" [0.42, 0.06]',
  'note "Subordinate: only the orders it can serve" [0.34, 0.06]',
  'note "Elevate: buy a hot water dispenser" [0.26, 0.06]',
]
const TEA_MOVED = 'note "The constraint moved: now what?" [0.18, 0.06]'

// Reference maps for the agentic delivery exercises (DRAFT): one state per exercise, the proposed
// answer after that round, and the prepared map for the next. Users are the fallback set from the
// plan; facts come from the domain expert brief.
function agenticStates() {
  // Three users with three different needs. The AI coding agent is a component, not a user: it has
  // no needs of its own, it is something the business uses to make code changes.
  const users = [
    // Ordered so the lines to the shared components cross as little as possible.
    'anchor "Architect" [0.95, 0.16]', 'anchor "Developer" [0.95, 0.40]', 'anchor "Business" [0.95, 0.64]',
  ]
  const NEED_B = 'New features reach customers sooner'
  const needs = () => [
    // two rows, so the long need names fit side by side
    'component "Code follows target architecture" [0.85, 0.16]', 'component "Feedback and better code" [0.79, 0.40]',
    `component "${NEED_B}" [0.85, 0.64]`,
    '%% label-side "Code follows target architecture" right', '%% label-side "Feedback and better code" right', `%% label-side "${NEED_B}" right`,
    '"Architect" -> "Code follows target architecture"', '"Developer" -> "Feedback and better code"', `"Business" -> "${NEED_B}"`,
  ]
  // [visibility, evolution after exercise 2, column in exercise 1]. Exercise 1 has no evolution
  // axis yet, so its columns only keep each chain running straight down (as on the tea map);
  // the rows are the same in every exercise, so a map only moves sideways when evolution comes in.
  const C = {
    // The scope starts at the product hypothesis (CJ, 13 Oct): the business states an intended outcome
    // and a hypothesis; the specification is written from it.
    'Product hypothesis': [0.74, 0.46, 0.72],
    'Code review process': [0.66, 0.36, 0.24], 'Code changes': [0.66, 0.76, 0.58], 'Release pipeline': [0.66, 0.90, 0.84],
    'Reviewers': [0.50, 0.30, 0.24], 'Architectural intent': [0.50, 0.44, 0.40], 'AI coding agent': [0.56, 0.80, 0.58], 'Continuous integration': [0.50, 0.92, 0.84],
    'Specification': [0.42, 0.56, 0.58], 'Scope and boundaries': [0.34, 0.60, 0.72], 'Domain knowledge': [0.24, 0.22, 0.40],
  }
  const comp = (n, flat, mark = '') => `component "${n}" [${C[n][0].toFixed(2)}, ${(flat ? C[n][2] : C[n][1]).toFixed(2)}]${mark}`
  const links = [
    `"${NEED_B}" -> "Code changes"`, `"${NEED_B}" -> "Code review process"`, `"${NEED_B}" -> "Release pipeline"`,
    `"${NEED_B}" -> "Product hypothesis"`, '"Product hypothesis" -> "Specification"',
    '"Code follows target architecture" -> "Code review process"', '"Code follows target architecture" -> "Architectural intent"',
    '"Feedback and better code" -> "Code review process"',
    '"Code changes" -> "AI coding agent"', '"Release pipeline" -> "Continuous integration"',
    '"AI coding agent" -> "Architectural intent"', '"AI coding agent" -> "Specification"', '"AI coding agent" -> "Scope and boundaries"',
    '"Code review process" -> "Reviewers"', '"Reviewers" -> "Domain knowledge"', '"Specification" -> "Domain knowledge"', '"Scope and boundaries" -> "Domain knowledge"',
  ]
  const sides = ['%% label-side "Code review process" left', '%% label-side "Reviewers" left', '%% label-side "Domain knowledge" left']
  // Once components spread along evolution, neighbours on a row need their labels on other sides.
  const evolvedSides = ['%% label-side "Architectural intent" right', '%% label-side "Code changes" left', '%% label-side "AI coding agent" left', '%% label-side "Specification" left', '%% label-side "Scope and boundaries" left', '%% label-side "Continuous integration" left']
  const all = (marks = {}) => [...users, ...needs(), ...Object.keys(C).map((n) => comp(n, false, marks[n] ?? '')), ...links, ...sides, ...evolvedSides]
  const NOTE = (t, v) => `note "${t}" [${v}, 0.04]`
  // Storyline v2 (agreed 10 Oct, built 16 Oct): the constraint moves from code review to
  // architecture decisions (the architect cannot decide fast enough once code arrives in hours),
  // then the way out is governance: decisions move to the teams, and governance goes from gates to
  // guard rails and feedback loops. The spec layers come in only at exercise 6, as the open end.
  const NEED_A = 'Code follows target architecture'
  const DECIDE = 'component "Architecture decisions" [0.36, 0.26]'
  const business = ['anchor "Business" [0.95, 0.50]', `component "${NEED_B}" [0.85, 0.50]`, `"Business" -> "${NEED_B}"`, `%% label-side "${NEED_B}" right`]
  // the cut-down map of exercises 5 and 6: the chain from the business to the decision bottleneck
  const small = [...business,
    comp('Code changes', false), comp('AI coding agent', false), 'component "Architectural intent" [0.50, 0.60]', DECIDE,
    'component "Governance practice" [0.22, 0.18]', 'component "Governance model" [0.22, 0.78]', 'component "Delivery platform" [0.30, 0.86]',
    `"${NEED_B}" -> "Code changes"`, `"${NEED_B}" -> "Delivery platform"`,
    '"Code changes" -> "AI coding agent"', '"AI coding agent" -> "Architectural intent"', '"Architectural intent" -> "Architecture decisions"',
    '"Architecture decisions" -> "Governance practice"', '"Architectural intent" -> "Governance model"',
    '%% constraint "Architecture decisions"', '%% submap "Delivery platform"',
    '%% label-side "Architecture decisions" left', '%% label-side "Governance practice" left', '%% label-side "AI coding agent" left', '%% label-side "Architectural intent" left',
    '%% comment "Rules as code, fitness functions: | the industrialised part of governance" "Governance model"',
    '%% comment "Review boards and approvals: | the part that still works like gates" "Governance practice"']
  const states = [
    { chip: 'exercise 1', full: [...users, ...needs(), ...Object.keys(C).map((n) => comp(n, true)), ...links, ...sides, '%% allow-crossing "Code review process"', ...HIDE_X] },
    { chip: 'exercise 2', full: [...all(), '%% allow-crossing "Code review process"'] },
    { chip: 'exercise 3', full: [...all({ 'Code review process': ' (inertia)' }), 'evolve "Code review process" 0.52', '%% constraint "Code review process"', '%% allow-crossing "Code review process"'] },
    {
      chip: 'exercise 4',
      full: ['anchor "Architect" [0.95, 0.12]', 'anchor "Developer" [0.95, 0.36]', 'anchor "Business" [0.95, 0.66]',
        `component "${NEED_A}" [0.85, 0.12]`, 'component "Feedback and better code" [0.79, 0.36]', `component "${NEED_B}" [0.85, 0.66]`,
        `"Architect" -> "${NEED_A}"`, '"Developer" -> "Feedback and better code"', `"Business" -> "${NEED_B}"`,
        `%% label-side "${NEED_A}" right`, '%% label-side "Feedback and better code" right', `%% label-side "${NEED_B}" right`,
        comp('Code changes', false), comp('AI coding agent', false), comp('Code review process', false, ' (inertia)'), 'evolve "Code review process" 0.52',
        comp('Reviewers', false), 'component "Ensemble work" [0.58, 0.18]', comp('Architectural intent', false), 'evolve "Architectural intent" 0.72', DECIDE, comp('Domain knowledge', false),
        '"Feedback and better code" -> "Code review process"', `"${NEED_B}" -> "Code review process"`, `"${NEED_B}" -> "Code changes"`, `"${NEED_B}" -> "Ensemble work"`,
        `"${NEED_A}" -> "Code review process"`, `"${NEED_A}" -> "Architectural intent"`,
        '"Code changes" -> "AI coding agent"', '"AI coding agent" -> "Architectural intent"', '"Code review process" -> "Reviewers"', '"Reviewers" -> "Domain knowledge"', '"Ensemble work" -> "Domain knowledge"',
        '"Architectural intent" -> "Architecture decisions"', '"Architecture decisions" -> "Domain knowledge"',
        ...sides, '%% label-side "Ensemble work" left', '%% label-side "AI coding agent" left', '%% label-side "Architecture decisions" left', '%% label-side "Architectural intent" right', '%% constraint "Architecture decisions"',
        '%% allow-crossing "Code review process"',
        NOTE('Exploit: small pull requests, review before starting new work', 0.14), NOTE('Elevate: build it together, and turn the architecture rules into automated checks', 0.08), NOTE('The constraint moves to architecture decisions: the architect cannot decide fast enough', 0.02)],
    },
    { chip: 'exercise 5', full: [...small, NOTE('Question: how do we make architecture decisions faster without losing alignment?', 0.06)] },
    {
      chip: 'exercise 6',
      full: [...small.filter((l) => !l.startsWith('%% comment')),
        '%% move "Architecture decisions" 0.56', 'evolve "Governance practice" 0.52', '%% future "Governance practice" "Guard rails and feedback"',
        'component "Product hypothesis" [0.74, 0.46]', 'component "Specification" [0.42, 0.56]', 'component "Experience model" [0.30, 0.10]',
        `"${NEED_B}" -> "Product hypothesis"`, '"Product hypothesis" -> "Specification"', '"Specification" -> "Experience model"',
        '%% label-side "Product hypothesis" right', '%% label-side "Specification" right', '%% label-side "Experience model" right',
        '%% comment "The open end: the experience model stays | in genesis. How much of it can AI do?" "Experience model"',
        NOTE('Play: decisions move to the teams; ADRs become learning, not approval', 0.06), NOTE('Governance moves from gates to guard rails and feedback loops', 0.01)],
    },
  ]
  // The full map with everything from exercises 1 to 4: the overcrowded map for exercise 5.
  states.crowded = { chip: 'too much on one map', full: [...all({ 'Code review process': ' (inertia)' }), 'evolve "Code review process" 0.52', 'component "Ensemble work" [0.58, 0.18]', `"${NEED_B}" -> "Ensemble work"`, '"Ensemble work" -> "Domain knowledge"', DECIDE, '"Architectural intent" -> "Architecture decisions"', '"Architecture decisions" -> "Domain knowledge"', '%% label-side "Ensemble work" left', '%% label-side "Architecture decisions" left', '%% constraint "Architecture decisions"', '%% allow-crossing "Code review process"'] }
  return states
}

function computeStates() {
  const users = ['anchor "Online shop" [0.95, 0.40]', 'anchor "Customer" [0.95, 0.60]']
  const need = ['component "Fast checkout" [0.85, 0.50]', '"Online shop" -> "Fast checkout"', '"Customer" -> "Fast checkout"']
  const app = ['component "Web shop" [0.70, 0.35]', '"Fast checkout" -> "Web shop"']
  const servers = ['component "Servers" [0.50, 0.55]', '"Web shop" -> "Servers"']
  const planning = ['"Servers" -> "Capacity planning"', '%% label-side "Capacity planning" left']
  const plan = (mark = '') => `component "Capacity planning" [0.34, 0.45]${mark}`
  const before = [...users, ...need, ...app, ...servers, plan(), ...planning]
  // CJ (10 Oct): draw capacity planning evolving into autoscaling, as an evolution of practice.
  // It is one way to draw it; the slide says so.
  const after = [
    ...users, ...need, ...app,
    'component "Cloud compute" [0.50, 0.86]', '"Web shop" -> "Cloud compute"',
    plan(' (inertia)'), '"Web shop" -> "Capacity planning"', '%% label-side "Capacity planning" left',
    'evolve "Capacity planning" 0.74',
    'component "Autoscaling" [0.34, 0.80]', '"Cloud compute" -> "Autoscaling"',
  ]
  const notes = {
    utility: 'note "Servers become cloud compute, a utility" [0.62, 0.60]',
    cloud: 'note "Cloud compute" [0.46, 0.80]',
    resist: 'note "Some teams still plan by hand: inertia" [0.24, 0.40]',
    coevolve: 'note "Practices co-evolve with the activity" [0.16, 0.40]',
    oneway: 'note "One way to draw it" [0.10, 0.40]',
  }
  return [
    { chip: 'the users', full: users },
    { chip: 'the need', full: [...users, ...need] },
    { chip: 'the web shop', full: [...users, ...need, ...app] },
    { chip: 'servers', full: [...users, ...need, ...app, ...servers] },
    { chip: 'the practice', full: before },
    { chip: 'compute evolves', full: [...before, 'evolve "Servers" 0.86', notes.utility, notes.cloud] },
    { chip: 'a new practice', full: [...after, notes.resist] },
    { chip: 'co-evolution', full: [...after, notes.resist, notes.coevolve, notes.oneway] },
  ]
}

// Family shapes:
//   pieces + foot [+ hideLast]  cumulative: state N draws pieces 1..N
//   states                       explicit: each { add, foot, full? }; adds are cumulative,
//                                `full` replaces the body (e.g. the slide-in state)
const families = {
  // Tea, User-Needs-Mapping first (Rich Allen / Team Topologies): users, needs, then the
  // vertical axis, then the two domain brackets (Kaiser), THEN components fill the solution
  // domain — all sitting at evolution 0.50 as a value chain. The last click wakes up the
  // horizontal axis: everything slides to its true stage and the chain becomes a map.
  tea: {
    states: [
      { add: ['anchor "Tea shop" [0.88, 0.42]', 'anchor "Customer" [0.88, 0.58]'], foot: HIDE_BOTH, chip: 'the users' },
      { add: ['component "Cup of tea" [0.75, 0.50]', '"Tea shop" -> "Cup of tea"', '"Customer" -> "Cup of tea"'], foot: HIDE_BOTH, chip: 'the need' },
      { add: ['component "Cup" [0.56, 0.32]', '"Cup of tea" -> "Cup"'], foot: HIDE_BOTH, chip: 'the cup' },
      { add: ['component "Tea leaves" [0.46, 0.46]', '"Cup of tea" -> "Tea leaves"'], foot: HIDE_BOTH, chip: 'tea leaves' },
      { add: ['component "Hot water" [0.56, 0.60]', '"Cup of tea" -> "Hot water"'], foot: HIDE_BOTH, chip: 'hot water' },
      { add: ['component "Kettle" [0.42, 0.60]', '"Hot water" -> "Kettle"'], foot: HIDE_BOTH, chip: 'the kettle' },
      { add: ['component "Cold water" [0.28, 0.60]', '"Kettle" -> "Cold water"'], foot: HIDE_BOTH, chip: 'cold water' },
      { add: ['component "Tap" [0.14, 0.60]', '"Cold water" -> "Tap"'], foot: HIDE_BOTH, chip: 'the tap' },
      { add: ['component "Power" [0.28, 0.74]', '"Kettle" -> "Power"'], foot: HIDE_BOTH, chip: 'power' },
      { add: [], foot: HIDE_X, chip: 'the vertical axis' },
      { add: [], foot: [...HIDE_X, BRACKET_PROBLEM], chip: 'problem domain' },
      { add: [], foot: [...HIDE_X, BRACKET_PROBLEM, BRACKET_SOLUTION], chip: 'solution domain' },
      {
        chip: 'the map wakes up',
        full: [
          ...TEA_MAP,
          BRACKET_PROBLEM,
          BRACKET_SOLUTION,
          '%% Stage reasoning: tea leaves, the cup, hot water, cold water, the tap and power are',
          '%% commodities; the kettle is a product. Rows match the flat stage. No sourcing marks on',
        ],
      },
    ],
  },

  // Internal knowledge base, AI-assisted and governed: buy the plumbing, build the graph,
  // hit the ontology snag, then evolve the graph toward a standard.
  // Back to the tea shop at rush hour: the simplest place to tell a constraint (a capacity
  // limit: one kettle) from inertia (resistance to change: hand-brewed loose leaf), then walk
  // Goldratt's steps on the kettle. Elevate is buying a commodity, not building something.
  'tea-toc': {
    states: [
      { chip: 'outside or inside?', full: [...TEA_RUSH, '%% constraint "Customer"', ...TEA_OUTSIDE] },
      { chip: 'the constraint', full: [...TEA_RUSH, '%% constraint "Kettle"', 'note "Or the constraint is inside the shop: the kettle" [0.42, 0.06]', 'note "Customers queue at rush hour, one kettle boils too slowly" [0.34, 0.06]'] },
      { chip: 'exploit', full: [...TEA_RUSH, '%% constraint "Kettle"', TEA_NOTES[0]] },
      { chip: 'subordinate', full: [...TEA_RUSH, '%% constraint "Kettle"', ...TEA_NOTES.slice(0, 2)] },
      { chip: 'elevate', full: [...TEA_RUSH, '%% constraint "Kettle"', ...TEA_NOTES, 'evolve "Kettle" 0.82'] },
      { chip: 'the constraint moves', full: [...TEA_RUSH, '%% constraint "Hand brewing"', ...TEA_NOTES, TEA_MOVED, 'evolve "Kettle" 0.82'] },
      { chip: 'the inertia', full: [...TEA_RUSH.map(teaInertia), ...BREWING_MOVE, '%% constraint "Hand brewing"', ...TEA_NOTES, TEA_MOVED, 'evolve "Kettle" 0.82', 'note "Inertia: staff want to brew every cup by hand" [0.10, 0.06]'] },
    ],
  },

  // Co-evolution of practice (Wardley's compute example): while servers are a product, the shop
  // needs capacity planning. When compute becomes a utility, a new practice (autoscaling) appears
  // and the old one carries the inertia. Bridges to the exercises: code review is the practice of
  // the era of expensive code.
  compute: {
    states: computeStates(),
  },

  // Proposed answers for the six exercises (draft), also the prepared maps for the next round.
  agentic: {
    states: agenticStates(),
  },
  'agentic-crowded': {
    states: [agenticStates().crowded],
  },

  // CJ's notes (10 Oct): the need is a trusted answer to a question; no sourcing marks (they are
  // not in the talk legend); "body of knowledge" as on the ka maps; the plumbing (source systems,
  // LLM) is drawn before governance and the ontology; the ontology's inertia sits on its evolution
  // line, toward an agreed, shared vocabulary.
  kg: {
    pieces: [
      ['anchor "Employee" [1.00, 0.62]'],
      ['component "Trusted answer to a question" [0.86, 0.62]', '"Employee" -> "Trusted answer to a question"'],
      ['component "AI assistant" [0.65, 0.56]', '"Trusted answer to a question" -> "AI assistant"'],
      ['component "Body of knowledge" [0.40, 0.45]', '"AI assistant" -> "Body of knowledge"', '"Trusted answer to a question" -> "Body of knowledge"'],
      ['component "Source systems" [0.11, 0.81]', '"Body of knowledge" -> "Source systems"', '%% comment "The source systems: the CRM, the ERP, | the wiki, the tickets, the file shares" "Source systems"'],
      ['component "LLM" [0.22, 0.80]', '"AI assistant" -> "LLM"'],
      // Governance sits below the ontology: agreeing the meanings is what the ontology depends on.
      ['component "Governance" [0.10, 0.66]', '"AI assistant" -> "Governance"'],
      ['component "Ontology" [0.20, 0.36] (inertia)', '"Body of knowledge" -> "Ontology"', '"Ontology" -> "Governance"',
        'evolve "Ontology" 0.60', '%% comment "Inertia: everyone must agree | the meanings again" "Ontology"'],
      ['evolve "Body of knowledge" 0.62'],
    ],
    foot: [
      '%% Stage reasoning: AI assistant = a product you rent; body of knowledge = custom built,',
      '%% evolving toward product; ontology = custom, evolving toward a shared vocabulary, with',
      '%% inertia; LLM and source systems = commodity; governance = productised policy tooling.',
      '%% constraint "Governance"',
      '%% The assistant needs governance directly (what it may answer); the answer is only as good as the body of knowledge.',
      '%% direct-need "AI assistant" "Governance"', '%% direct-need "Trusted answer to a question" "Body of knowledge"',
      '%% allow-crossing "AI assistant"',
    ],
  },

  // Chronoshub's real knowledge-architecture map (the MapAware session): four users with
  // actor-agnostic needs, Body of Knowledge as the hub, Stewardship marked as the primary
  // constraint, and the Elevate move as the final click.
  ka: {
    // Links run downward: "A -> B" means A depends on B, so A sits higher (more visible).
    pieces: [
      ['anchor "Organisation" [0.95, 0.40]'],
      ['component "Knowledge compounds" [0.85, 0.40]', '"Organisation" -> "Knowledge compounds"'],
      ['component "Body of Knowledge" [0.50, 0.38]', '"Knowledge compounds" -> "Body of Knowledge"'],
      [
        'anchor "SME / Contributor" [0.95, 0.20]',
        'anchor "Reader / Learner" [0.95, 0.80]',
        'anchor "Curator" [0.95, 0.60]',
        'component "Capture easily" [0.85, 0.20]',
        'component "Find what I need" [0.85, 0.80]',
        'component "Keep it current" [0.85, 0.60]',
        '"SME / Contributor" -> "Capture easily"',
        '"Reader / Learner" -> "Find what I need"',
        '"Curator" -> "Keep it current"',
      ],
      // Capture here is the practice of getting tacit knowledge out with little effort; the
      // storage it writes to is the commodity Content platform further down.
      ['component "Knowledge capture" [0.62, 0.15]', '"Capture easily" -> "Knowledge capture"', '"Knowledge capture" -> "Body of Knowledge"'],
      // Discovery is finding *trusted* knowledge through your own meaning layer (custom);
      // the generic search / LLM underneath is a product.
      ['component "Discovery" [0.74, 0.46]', '"Find what I need" -> "Discovery"', '"Discovery" -> "Body of Knowledge"'],
      // The hub depends on the practices that keep it alive (CJ, 12 Oct): classification keeps the
      // body of knowledge organised, stewardship keeps it current and trusted.
      ['component "Classification" [0.42, 0.50]', '"Discovery" -> "Classification"', '"Knowledge capture" -> "Classification"', '"Body of Knowledge" -> "Classification"'],
      // Stewardship is the curator's practice: it uses classification and looks after the vocabularies.
      [
        'component "Stewardship" [0.46, 0.22]',
        '"Keep it current" -> "Stewardship"',
        '"Body of Knowledge" -> "Stewardship"',
        '"Stewardship" -> "Classification"',
        '%% constraint "Stewardship"',
      ],
      [
        // The knowledge-architecture stack: behaviour acts on meaning, meaning builds on structure.
        'component "Choreography" [0.40, 0.20]',
        'component "Ontology" [0.30, 0.32]',
        'component "Taxonomy" [0.22, 0.45]',
        '"Body of Knowledge" -> "Choreography"',
        '"Choreography" -> "Ontology"',
        '"Ontology" -> "Taxonomy"',
        '"Classification" -> "Taxonomy"',
        '"Stewardship" -> "Ontology"',
        '"Stewardship" -> "Taxonomy"',
        '"Discovery" -> "Ontology"',
      ],
      [
        // The commodity layer: buy or use, but adopting it is still work.
        'component "Search / LLM" [0.48, 0.68]',
        'component "Tagging tooling" [0.32, 0.78]',
        'component "Access enforcement" [0.26, 0.84]',
        'component "Content platform" [0.16, 0.88]',
        '"Discovery" -> "Search / LLM"',
        '"Discovery" -> "Access enforcement"',
        '"Classification" -> "Tagging tooling"',
        '"Classification" -> "Access enforcement"',
        '"Search / LLM" -> "Content platform"',
        '"Body of Knowledge" -> "Content platform"',
      ],
      [
        // The learning loop: readers and curators depend on it; it feeds capture and curation.
        'component "Feedback loops" [0.70, 0.30]',
        'component "Notifications" [0.60, 0.80]',
        '"Find what I need" -> "Feedback loops"',
        '"Keep it current" -> "Feedback loops"',
        '"Knowledge compounds" -> "Feedback loops"',
        '"Feedback loops" -> "Knowledge capture"',
        '"Feedback loops" -> "Stewardship"',
        '"Feedback loops" -> "Notifications"',
      ],
      ['evolve "Stewardship" 0.55'],
    ],
    foot: [
      '%% Body of Knowledge, Stewardship and Discovery are hubs: links converge on them, so crossings are accepted.',
      '%% allow-crossing "Body of Knowledge"',
      '%% allow-crossing "Stewardship"',
      '%% allow-crossing "Discovery"',
      '%% Feedback loops is a practice the needs depend on, not a need itself.',
      '%% not-need "Feedback loops"',
      '%% Users and needs are spread evenly along the top for readability; their x carries no meaning.',
      '%% Stage reasoning: capture practice = genesis; discovery, feedback loops, body of knowledge',
      '%% and stewardship (in this org) = custom-built; classification at the custom/product boundary;',
      '%% search / LLM = product; tagging, access, notifications and content platform = commodity.',
      '%% Taxonomy (structure), ontology (meaning) and choreography (behaviour) are placed by',
      '%% practice maturity: taxonomy is the oldest discipline, choreography the least established.',
      '%% Open question: stewardship as a market practice may be ~product; if so the move is',
      '%% adopting it (inertia), not evolving it.',
    ],
  },

  // The same map, cut down to the question "where do we put effort next?": only the chain from
  // the users to the primary constraint, with two clusters collapsed into submaps. Teaching
  // point: the full `ka` map is the working document, this is the view you present.
  'ka-focus': {
    pieces: [
      ['anchor "Organisation" [0.95, 0.25]', 'component "Knowledge compounds" [0.85, 0.25]', '"Organisation" -> "Knowledge compounds"'],
      ['anchor "Curator" [0.95, 0.50]', 'component "Keep it current" [0.85, 0.50]', '"Curator" -> "Keep it current"'],
      ['anchor "Reader / Learner" [0.95, 0.75]', 'component "Find what I need" [0.85, 0.75]', '"Reader / Learner" -> "Find what I need"'],
      ['component "Body of Knowledge" [0.62, 0.38]', '"Knowledge compounds" -> "Body of Knowledge"', '"Find what I need" -> "Body of Knowledge"'],
      [
        'component "Stewardship" [0.50, 0.22]',
        '"Keep it current" -> "Stewardship"',
        '"Body of Knowledge" -> "Stewardship"',
        '%% constraint "Stewardship"',
      ],
      ['component "Classification" [0.38, 0.50]', '"Stewardship" -> "Classification"', '"Body of Knowledge" -> "Classification"'],
      [
        'component "Knowledge architecture" [0.26, 0.30]',
        '"Body of Knowledge" -> "Knowledge architecture"',
        '"Stewardship" -> "Knowledge architecture"',
        '"Classification" -> "Knowledge architecture"',
        '%% submap "Knowledge architecture"',
      ],
      [
        'component "Platform" [0.20, 0.82]',
        '"Body of Knowledge" -> "Platform"',
        '"Classification" -> "Platform"',
        '%% submap "Platform"',
      ],
      [
        'component "Feedback loops" [0.72, 0.32]',
        '"Find what I need" -> "Feedback loops"',
        '"Keep it current" -> "Feedback loops"',
        '"Feedback loops" -> "Stewardship"',
      ],
      ['evolve "Stewardship" 0.55'],
    ],
    foot: [
      '%% not-need "Feedback loops"',
      '%% not-need "Body of Knowledge"',
      '%% allow-crossing "Stewardship"',
      '%% Knowledge architecture = taxonomy, ontology, choreography (see ka-arch).',
      '%% Platform = search / LLM, content platform, tagging, access, notifications (commodity).',
    ],
  },

  // Submap of "Knowledge architecture": structure, meaning and behaviour as a stack, each
  // looked after by stewardship. Placed by practice maturity, so the most visible layer
  // (behaviour) is the least evolved one.
  'ka-arch': {
    pieces: [
      ['component "Knowledge architecture" [0.92, 0.32]', '%% submap "Knowledge architecture"'],
      ['component "Choreography" [0.74, 0.20]', '"Knowledge architecture" -> "Choreography"'],
      ['component "Ontology" [0.58, 0.34]', '"Choreography" -> "Ontology"'],
      ['component "Taxonomy" [0.42, 0.48]', '"Ontology" -> "Taxonomy"'],
      ['component "Stewardship" [0.24, 0.22]', '"Ontology" -> "Stewardship"', '"Taxonomy" -> "Stewardship"', '%% constraint "Stewardship"'],
      ['component "Behaviour notations" [0.50, 0.64]', '"Choreography" -> "Behaviour notations"'],
      ['component "Semantic standards" [0.26, 0.72]', '"Ontology" -> "Semantic standards"', '"Taxonomy" -> "Semantic standards"'],
    ],
    foot: [
      '%% Choreography = behaviour, ontology = meaning, taxonomy = structure.',
      '%% Behaviour notations: event models, BPMN (event modelling itself lives on the EM map).',
      '%% Semantic standards: SKOS, OWL.',
    ],
  },

  // A DDD effort: where workshop effort goes, and the move (evolve facilitation).
  // Kept for spare use; not in the current deck.
  ddd: {
    pieces: [
      ['anchor "Product team" [0.94, 0.62]'],
      ['component "Shared language" [0.80, 0.34]', '"Product team" -> "Shared language"'],
      ['component "Bounded contexts" [0.66, 0.28]', '"Shared language" -> "Bounded contexts"'],
      ['component "Event Storming" [0.52, 0.46]', '"Bounded contexts" -> "Event Storming"'],
      ['component "Facilitation" [0.38, 0.22] (inertia)', '"Event Storming" -> "Facilitation"'],
      ['component "Domain experts" [0.30, 0.40]', '"Event Storming" -> "Domain experts"'],
      ['component "Online whiteboard" [0.24, 0.74] (buy)', '"Event Storming" -> "Online whiteboard"'],
      ['component "Sticky notes" [0.10, 0.86]', '"Event Storming" -> "Sticky notes"'],
      ['evolve "Facilitation" 0.52'],
    ],
    foot: ['%% Event Storming is a hub: links leave it in every direction, so any label side is crossed.', '%% allow-crossing "Event Storming"'],
  },

  // CJ's EM tooling map (from the InfoQ article's Fig. 5), rebuilt in house style.
  // Two users top-centre, a genesis novelty, and layer states: strategy, notes, notes hidden.
  // Rebuilt from Fig. 5 (workshop-plan.md, "EM map, read off Fig. 5"; CJ's image, 11 Oct): the
  // schema sits below the tooling that depends on it; solid double arrows are intended moves,
  // dashed lines natural evolution (past and future), red the future state. No sourcing marks.
  em: {
    pieces: [
      ['anchor "Organisation" [0.94, 0.34]', 'anchor "Software Architect" [0.94, 0.50]'],
      ['component "Legacy modernisation" [0.67, 0.24]', '"Organisation" -> "Legacy modernisation"', '"Software Architect" -> "Legacy modernisation"'],
      ['component "Model-driven development" [0.80, 0.55]', '"Software Architect" -> "Model-driven development"'],
      ['component "Code following a standard" [0.73, 0.49]', '"Software Architect" -> "Code following a standard"'],
      ['component "Conversational AI event modelling" [0.58, 0.17]', '"Legacy modernisation" -> "Conversational AI event modelling"',
        '"Model-driven development" -> "Conversational AI event modelling"', '"Code following a standard" -> "Conversational AI event modelling"'],
      ['component "Event model tooling" [0.47, 0.33]', '"Conversational AI event modelling" -> "Event model tooling"'],
      ['component "Event model schema" [0.38, 0.29]', '"Conversational AI event modelling" -> "Event model schema"', '"Event model tooling" -> "Event model schema"'],
      ['component "AI" [0.22, 0.77]', '"Conversational AI event modelling" -> "AI"'],
      ['%% past "Event model schema" 0.14', '%% past "AI" 0.15'],
      ['%% move "Model-driven development" 0.75', '%% move "Code following a standard" 0.78', '%% move "Legacy modernisation" 0.74', '%% move "Conversational AI event modelling" 0.49'],
      ['evolve "Event model tooling" 0.48', 'evolve "Event model schema" 0.73',
        '%% future "Event model tooling" "Event model tooling"', '%% future "Event model schema" "Event model schema"',
        '%% future-link "Conversational AI event modelling" "Event model tooling"', '%% future-link "Event model tooling" "Event model schema"',
        '%% future-link "Conversational AI event modelling" "AI"'],
      ['%% comment "A novelty: room to differentiate | and earn ($$$). It needs to mature | into a product" "Conversational AI event modelling"',
        '%% comment "AI is industrialised: | a utility now" "AI"'],
    ],
    // Last state = notes layer hidden again, proving layers toggle off.
    hideLast: { copy: 11, chip: 'comments off' },
    foot: [
      '%% Conversational AI event modelling is a hub: links leave it in every direction.',
      '%% allow-crossing "Conversational AI event modelling"',
      '%% label-size 15',
      '%% label-side "Conversational AI event modelling" above',
      '%% label-side "Model-driven development" above',
      '%% label-side "Event model schema" below',
      '%% Event model tooling and model-driven development sit under links from the hub and the users.',
      '%% allow-crossing "Event model tooling"',
      '%% allow-crossing "Model-driven development"',
      '%% Code following a standard sits between the users and the hub: links cross it from both sides.',
      '%% allow-crossing "Code following a standard"',
    ],
  },
}

const TITLES = {
  tea: 'Cup of tea (Wardley, ch. 2)',
  kg: 'Governed knowledge graph',
  'tea-toc': 'Tea shop at rush hour',
  compute: 'Capacity planning to autoscaling',
  agentic: 'Agentic delivery: reference maps (draft)',
  'agentic-crowded': 'Agentic delivery: everything on one map (exercise 5)',
  ka: 'Chronoshub knowledge architecture',
  'ka-focus': 'Knowledge architecture: the constraint view',
  'ka-arch': 'Knowledge architecture submap',
  ddd: 'DDD workshop effort',
  em: 'Event Model tooling',
}

// Answers to the renderer's graph checks, per family: which components are leaves on purpose
// (nothing below them on this map) and which shortcut links are real direct needs. Each line says why.
const GRAPH_NOTES = {
  agentic: [
    '%% Domain knowledge is tacit, in people\'s heads; architectural intent is the architect\'s own judgement. Nothing below them on this map.',
    '%% leaf "Domain knowledge"', '%% leaf "Architectural intent"',
    '%% Governance practice (boards, approvals) and the experience model are where these maps stop.',
    '%% leaf "Governance practice"', '%% leaf "Experience model"',
    '%% The intent reaches the governance model directly: the rules as code enforce the intent.',
    '%% direct-need "Architectural intent" "Governance model"',
  ],
  'agentic-crowded': ['%% leaf "Domain knowledge"', '%% leaf "Architectural intent"'],
  'tea-toc': ['%% Hand brewing is the staff\'s own skill; the map stops there.', '%% leaf "Hand brewing"'],
  compute: ['%% Capacity planning is a practice people do by hand; the map stops there.', '%% leaf "Capacity planning"'],
  ddd: ['%% Domain experts, facilitation and the whiteboard are where this map stops.', '%% leaf "Domain experts"', '%% leaf "Facilitation"', '%% leaf "Online whiteboard"'],
  kg: ['%% Governance is policy tooling; this map does not go below it.', '%% leaf "Governance"'],
  em: [
    '%% Fig. 5: conversational modelling needs the schema directly, not only through the tooling.',
    '%% direct-need "Conversational AI event modelling" "Event model schema"',
    '%% The schema is the standard itself; nothing below it on this map.', '%% leaf "Event model schema"',
  ],
  'ka-arch': [
    '%% Meaning needs the standards and the steward directly, not only through structure.',
    '%% direct-need "Ontology" "Semantic standards"', '%% direct-need "Ontology" "Stewardship"',
  ],
  ka: [
    '%% Direct needs that other paths also reach: the hub needs classification itself; discovery uses',
    '%% classification, meaning and access control directly; keeping current is stewardship; feedback',
    '%% feeds curation; capture classifies as it writes; the need is the body of knowledge; the steward',
    '%% looks after both vocabularies.',
    '%% direct-need "Body of Knowledge" "Classification"', '%% direct-need "Discovery" "Classification"',
    '%% direct-need "Discovery" "Ontology"', '%% direct-need "Discovery" "Access enforcement"',
    '%% direct-need "Keep it current" "Stewardship"', '%% direct-need "Feedback loops" "Stewardship"',
    '%% direct-need "Knowledge capture" "Classification"', '%% direct-need "Knowledge compounds" "Body of Knowledge"',
    '%% direct-need "Stewardship" "Taxonomy"',
    '%% Taxonomy is the oldest discipline; the map stops there.', '%% leaf "Taxonomy"',
  ],
  'ka-focus': [
    '%% The hub needs classification, its architecture and the platform directly; keeping current is',
    '%% stewardship; the steward looks after the architecture.',
    '%% direct-need "Body of Knowledge" "Classification"', '%% direct-need "Body of Knowledge" "Knowledge architecture"',
    '%% direct-need "Body of Knowledge" "Platform"', '%% direct-need "Keep it current" "Stewardship"',
    '%% direct-need "Stewardship" "Knowledge architecture"',
    '%% Knowledge architecture is a submap; its own dependencies are on ka-arch.', '%% leaf "Knowledge architecture"',
  ],
}

for (const [fam, spec] of Object.entries(families)) {
  const write = (n, body) => writeFileSync(path.join(dir, `wardley-${fam}-reveal-${n}.mmd`), body + '\n')
  // Every state but the last is marked %% partial: the renderer then skips the graph checks that only
  // make sense on a finished map (orphans, shortcuts, leaves). Upward links are checked on every state.
  const wrap = (lines, foot, partial) => ['wardley-beta', 'size [1280, 720]', '', ...lines, '', ...(foot ?? []), ...(GRAPH_NOTES[fam] ?? []), ...(partial ? ['%% partial'] : []), ''].join('\n')
  if (spec.states) {
    spec.states.forEach((s, i) => {
      const n = String(i + 1).padStart(2, '0')
      const lines = s.full ?? spec.states.slice(0, i + 1).flatMap((p) => p.add)
      write(n, wrap(lines, s.foot, i < spec.states.length - 1))
    })
  } else {
    const { pieces, foot, hideLast } = spec
    const max = pieces.length + (hideLast ? 1 : 0)
    for (let i = 0; i < max; i++) {
      const n = String(i + 1).padStart(2, '0')
      const lines = (hideLast && i + 1 === max ? pieces.slice(0, hideLast.copy) : pieces.slice(0, i + 1)).flat()
      write(n, wrap(lines, foot, i + 1 < max))
    }
  }
  console.log(`wardley-${fam}-reveal: ${spec.states ? spec.states.length : spec.pieces.length + (spec.hideLast ? 1 : 0)} states`)

  // OWM export of the final map state, for onlinewardleymaps.com / create.wardleymaps.ai.
  const finalLines = spec.states ? (spec.states.at(-1).full ?? spec.states.flatMap((p) => p.add)) : spec.pieces.flat()
  writeFileSync(path.join(dir, `wardley-${fam}.owm`), toOwm(TITLES[fam] ?? fam, finalLines, spec.foot ?? spec.states?.at(-1)?.foot ?? []) + '\n')
  console.log(`wardley-${fam}.owm`)
}

// Translate the Mermaid wardley-beta source lines into the OnlineWardleyMaps DSL.
// Same coordinate order ([visibility, evolution]); names lose their quotes; the (build)/(buy)/
// (outsource) marks become standalone lines; (inertia) becomes the trailing keyword; our own
// `%%` renderer directives become `//` comments so nothing is silently dropped.
function toOwm(title, lines, foot) {
  const out = [`title ${title}`, '']
  const marks = []
  const unq = (s) => s.replace(/"/g, '')
  for (const raw of [...lines, ...foot]) {
    const line = raw.trim()
    if (!line) continue
    let m
    if ((m = line.match(/^(anchor|component) "([^"]+)" \[([^\]]+)\](?: \((\w+)\))?$/))) {
      const [, kind, name, coords, mark] = m
      if (mark === 'inertia') out.push(`${kind} ${name} [${coords}] inertia`)
      else {
        out.push(`${kind} ${name} [${coords}]`)
        if (mark) marks.push(`${mark} ${name}`)
      }
    } else if ((m = line.match(/^note "([^"]+)" \[([^\]]+)\]$/))) {
      out.push(`note ${m[1]} [${m[2]}]`)
    } else if ((m = line.match(/^evolve "([^"]+)" ([\d.]+)$/))) {
      out.push(`evolve ${m[1]} ${m[2]}`)
    } else if (line.includes('->')) {
      out.push(unq(line).replace(/\s*->\s*/, '->'))
    } else if (line.startsWith('%%')) {
      out.push(`// ${unq(line.slice(2).trim())}`)
    } else {
      out.push(`// (untranslated) ${line}`)
    }
  }
  if (marks.length) out.push('', ...marks)
  return out.join('\n')
}
