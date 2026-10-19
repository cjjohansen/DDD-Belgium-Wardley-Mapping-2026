# The Multiple Users Problem in Exercise 1

**Context:** DDD Belgium 2026 Workshop - Exercise 1: "Who needs what?"

**Observed issue:** Groups naturally identify multiple user types (management, product person, architect, developer, QA), each with their own needs. This creates a structural problem when trying to build a value chain in Exercise 2.

---

## The Problem

When groups complete Exercise 1, they typically identify **5+ user types**, each with 3-6 needs:

```
Users (blue stickies):
├─ management person
├─ product person
├─ Software Architect
├─ Software Developer
└─ QA Person

User Needs (green stickies):
├─ Management: predictability, measurable outcomes, alignment, profit, progress, BI
├─ Product: Hypotheses, Prototypes, Fast feedback
├─ Architect: Governance, overview, sustainable system, avoid bottlenecks
├─ Developer: Feedback, Validation, Learning, optimised flow
└─ QA: Validation, Quality, provide feedback
```

**The challenge:** How do you build **one value chain** from **5 anchor points**?

If each user becomes an anchor at the top of the map, you get:
- 5 diverging value chains
- 30+ components total
- An overcrowded, unusable map
- Violation of "map only around the constraint" principle

This is exactly the scenario Tristan Slominski warns against: mapping everything instead of mapping what matters.

---

## Why This Happens

**Exercise 1 instructions say:**
> "Identify users and their needs"

**Groups interpret this as:**
> "Identify ALL users and ALL their needs"

**Natural result:**
- Comprehensive stakeholder analysis ✓
- Focused value chain for one question ✗

**The missing guidance:**
> "Now pick ONE anchor for your value chain"

Without this step, Exercise 2 ("Spread it out") becomes impossible to execute well.

---

## Four Valid Solutions

### Solution 1: Shared Outcome (Recommended for beginners)

**Approach:** Find the common need all users ultimately serve.

**For Harbour Insurance scenario:**

```
User: The Organization (Harbour Insurance)
Need: Faster time to market

↓ depends on ↓

Validated features (QA's ultimate contribution)
Code quality (Architect's ultimate contribution)
Working software (Developer's ultimate contribution)
Requirements (Product's ultimate contribution)
Business goals (Management's ultimate contribution)
```

**Reasoning:**
- All 5 user types exist to serve **one outcome**: delivering value faster
- Their individual needs become **components** in the chain, not separate anchors
- Keeps the map focused on answering: "Why is delivery slow?"

**Pro:** One clear map, matches workshop scenario
**Con:** Loses individual user perspectives
**Difficulty:** Intermediate (requires abstraction)

---

### Solution 2: Visibility Layering

**Approach:** Place users at different visibility levels on the same map.

```
Y-axis (Visibility)
↑
│ High:     Management → Time to market
│ Med-High: Product → Hypotheses, Architect → Governance
│ Medium:   Developer → Code, QA → Validation
│ Low:      [Infrastructure components]
↓

← Genesis | Custom | Product | Commodity →
              X-axis (Evolution)
```

**Reasoning:**
- Users have different **visibility** into the system
- Management sees strategic outcomes (high visibility)
- Developers see implementation details (medium visibility)
- All feed into the same value chain

**Pro:** Shows multiple perspectives on one map
**Con:** Can become messy with 5 starting points
**Difficulty:** Advanced (requires understanding visibility axis)

---

### Solution 3: One Map + Submaps

**Approach:** Main map for the primary question, submaps for detailed concerns.

**Main map (Management view):**
```
Management: Time to market
└─ Quality review [→ SUBMAP: "Architect's governance concerns"]
   └─ Code [→ SUBMAP: "Developer's workflow"]
      └─ Test coverage [→ SUBMAP: "QA's validation process"]
```

**Submaps zoom into specific components:**
- Submap 1: How does the architect ensure governance?
- Submap 2: What does the developer's workflow depend on?
- Submap 3: How does QA validate quality?

**Reasoning:**
- Main map stays focused on ONE question
- Detail available via submaps when needed
- Matches Wardley's doctrine: "Use multiple maps" and "Use submaps"

**Pro:** Keeps main map clean, preserves detail
**Con:** Requires creating multiple maps
**Difficulty:** Advanced (requires understanding submaps)

---

### Solution 4: Separate Maps per Question

**Approach:** Create 3+ different maps answering different questions.

**Map 1 (Management question):**
> "Why is delivery slow despite AI agents coding faster?"

**Map 2 (Architect question):**
> "How do we maintain governance with AI-generated code?"

**Map 3 (Developer question):**
> "How do I optimize my workflow with AI agents?"

**Reasoning:**
- Different stakeholders have **different questions**
- Each question deserves its own focused map
- No need to force all concerns onto one map

**Pro:** Each map clearly answers its own question
**Con:** No shared view across stakeholders
**Difficulty:** Intermediate (but requires 3x the time)

---

## Conclusion: Our Reasoning

### The Conversation's Logic

**User (CJ) observation:**
> "5 users is too much. How to build value chain for 5 users?"

**Initial guidance:**
Pick ONE anchor (Management's "Time to market")

**User's counter:**
> "What about the end user? Wouldn't that be a better starting point?"

**Key insight:**
Different questions need different maps:
- **Insurance business map:** Start with insurance customer
- **Delivery capability map:** Start with management's delivery need
- The workshop scenario asks about **delivery capability**, not the insurance product

**Final realization:**
> "In the deck we reached architect, developer, business. Show me alternatives for mapping each."

**Conclusion:**
There are 4 valid approaches, each with trade-offs. The workshop needs to **explicitly guide** groups to pick one approach, or they'll get stuck.

---

## The Pedagogical Challenge (Shu-Ha-Ri)

### Shu-Ha-Ri Learning Stages

**Shu (守 - Follow):** Learn the rules
**Ha (破 - Break):** Understand when to break rules
**Ri (離 - Leave):** Make your own rules

### The Problem with Exercise 1

**What the exercise asks:**
> "Identify users and needs" → Build value chain

**What beginners need (Shu):**
> "Here's ONE user, here's their primary need, build the chain from here"

**What the exercise actually requires (Ha/Ri):**
- Recognize when 5 users is too many (Ha - breaking the "identify all users" rule)
- Choose an appropriate scoping strategy (Ri - making your own rule for this context)
- Understand that different questions need different maps (Ri - advanced doctrine)

**The gap:**
- Exercise 1 is positioned as **introductory** (first exercise, "Cup of Tea")
- But it requires **intermediate-to-advanced** judgment to complete successfully
- Groups without facilitation guidance will:
  - Identify 5 users ✓
  - Capture 30 needs ✓
  - Get stuck building value chain ✗
  - Feel like they "failed" at a beginner exercise ✗

### Question for Workshop Design

**Can we expect groups to reach a good result?**

**Without explicit guidance:** No.
- They'll create overcrowded maps
- Or spend 20+ minutes debating which user to pick
- Or get frustrated and disengage

**With explicit guidance:** Yes.
- Facilitator intervenes after Exercise 1: "Now pick ONE anchor"
- Or provide a "suggested anchor" in the exercise instructions
- Or show a worked example with 5 users → 1 anchor consolidation

### Recommendations for Facilitators

**Option A: Add guidance to Exercise 1**
```markdown
## Step 3: Pick Your Anchor

You've identified multiple users. Good! Now:

1. Ask: "What question is this map answering?"
2. Pick THE user whose need matters for that question
3. Set aside the other users' needs for now (they'll become components)

For Harbour Insurance: Pick "Management" and their need for "Time to market"
```

**Option B: Make Exercise 1 more prescriptive (Shu)**
```markdown
## Exercise 1: Who needs what?

User: Management at Harbour Insurance
Need: Faster time to market

Your task:
1. What does "time to market" depend on?
2. Keep asking "what does X depend on?" until you reach infrastructure
3. You now have a value chain
```

**Option C: Add a transition slide between Ex1 and Ex2**
```markdown
## Before Exercise 2: Consolidation

[Facilitator leads this]

"You've identified many users. Let's pick one anchor together.
Who's need matters most for our question about delivery speed?"

[Facilitator guides group to consensus]
```

---

## Summary

**The multiple users problem is real:**
- Groups naturally identify 5+ users in Exercise 1
- Building one value chain from 5 anchors is structurally difficult
- This is a **scoping problem**, not a mapping problem

**Four valid solutions exist:**
1. Shared outcome (best for beginners)
2. Visibility layering (advanced)
3. One map + submaps (advanced)
4. Separate maps per question (intermediate but time-consuming)

**The pedagogical gap:**
- Exercise 1 appears beginner-friendly (Shu)
- But requires intermediate judgment (Ha/Ri) to complete
- Groups need explicit guidance to consolidate 5 users → 1 anchor

**Recommendation:**
Add facilitation guidance between Exercise 1 and Exercise 2 to help groups pick one anchor, or make Exercise 1 more prescriptive from the start.

---

**Document status:** Analysis from DDD Belgium 2026 workshop observation
**Author:** Christian Johansen (CJ) + Claude (analysis)
**Date:** October 2026
