# Exercise 1: Cup of Tea

**Time:** 15 minutes  
**After:** Introduction to Wardley mapping

Build your first map using the Harbour Insurance scenario.

## The Scenario

**Harbour Insurance** provides marine insurance around the port of Antwerp.
- 6 product teams, ~40 developers, 1 architect
- **Purpose:** Get new insurance products to customers quickly and safely
- **Scope:** From product hypothesis → customers using the change

**Management's question:** "We pay for AI coding agents, but delivery isn't faster. What's happening?"

## Your Task

### Step 1: Users (Top)
Choose 2-4 users: Management, Product Manager, Product Team, Developer, Architect, AI Agent, Domain Expert

### Step 2: Needs (Below Users)
What does each user need?
- Management: Faster time to market
- Team: Clear requirements, code review
- Developer: Coding help, deployment

### Step 3: Dependencies (Value Chain)
For each need: "What does this depend on?"
Keep going until you reach infrastructure.

### Step 4: Stack by Visibility
- **High:** What customers/management see
- **Middle:** What teams work with  
- **Low:** Infrastructure

**Do NOT add evolution yet** - that's Exercise 2.

## Domain Expert Brief

| Question | Answer |
|----------|--------|
| PR wait time? | Before AI: <1 day. Now: 3 days |
| Who reviews? | 2 seniors + architect (~70% of PRs) |
| PR size? | Bigger - AI writes more code |
| PRs per week? | ~3x more than before |
| Pair programming? | Rarely. "It's slower" |
| AI tool? | Bought, commodity, paid per seat |

## Discussion

1. One interesting placement you debated
2. Where's the problem vs solution domain line?
3. What surprised you?

Next: [Exercise 2: Spread It Out](02-spread-it-out.md)
