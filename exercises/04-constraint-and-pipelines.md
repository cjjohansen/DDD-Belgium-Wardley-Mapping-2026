# Exercise 4: Find the constraint, draw three pipelines

**Time:** about 20 minutes
**After:** the tea shop at rush hour, Theory of Constraints and pipelines

## 4A: Find the constraint

A constraint is a capacity limit. Work piles up in front of it. Inertia is something else: the old way is kept although a better one exists.

Goldratt's five steps:

1. Identify the constraint.
2. Exploit it: get the most out of what is already there.
3. Subordinate everything else to it.
4. Elevate it: add capacity, and only now.
5. Repeat: the constraint has moved.

### Your task

1. Mark the constraint on your map with a striped bar. Where does work wait longest?
2. Mark one inertia with a solid bar on its evolution line. What resists change? Ask who would lose if it moved.
3. Exploit: what can you do with no budget? For example, small pull requests, or reviewing before starting new work.
4. Subordinate: how should the rest of the work serve the constraint? For example, don't start new work while pull requests are waiting.
5. Elevate: what would you invest in? For example, more people who can review, or architecture rules turned into automated checks.
6. Where does the constraint move after you elevate it?

## 4B: Draw three pipelines

A pipeline, in Simon Wardley's sense, is one component that is done in several ways at the same time. Each way sits at its own stage of evolution. You draw it as a box along the evolution axis, with each way inside it. If people are moving from one way to another, draw an arrow.

This is not a delivery pipeline. Build, test and release are steps that work passes through. A Wardley pipeline holds different ways of doing the same thing.

### Your task

Draw these three pipelines on your map, and place each way at its own stage:

- **Writing code:** by hand, with an AI assistant, by AI agents
- **Checking quality:** human review, pairing or ensemble work, automated checks
- **Releasing:** a change board, scripted deployment, continuous deployment

Then ask: which pipeline moved right? Which one holds the constraint?

## Back together

- Is your constraint a practice or a technology?
- Which of your exploit moves needs no budget?
- Where does the constraint move after you elevate it?
- Which way does your team use today, in each pipeline?
- Did a newer way remove the constraint, or only move it?

Next: [Exercise 5: Simplify and move](05-simplify-and-move.md)
