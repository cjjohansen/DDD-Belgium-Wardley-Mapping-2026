# Exercise 5: Cut It Down

**Time:** 15 minutes  
**After:** Knowledge Architecture section

Your map probably has 15-25 components. Too many for a focused decision.

**Tristan Slominski:** Map only around the primary constraint.

## Three Techniques

1. **Write a question** - Map answers ONE question
2. **Cut ruthlessly** - Delete what doesn't change the answer
3. **Use submaps** - Fold detail clusters

## Your Task

### Step 1: Write Your Question (2 min)

Examples:
- ❌ "How do we build software?" (too broad)
- ✅ "Why hasn't AI coding sped up delivery?"
- ✅ "Where does code get stuck between write and deploy?"

**Write it at the top of your map.**

### Step 2: Mark the Critical Chain (3 min)

Trace: User need → dependencies → constraint

**Highlight that chain.** Everything on it stays.

### Step 3: Cut Everything Else (5 min)

For each component NOT on the chain:
- Does it affect the constraint? No → Delete

**Your map should shrink to ~7-12 components.**

### Step 4: Create a Submap (5 min)

Some components hide complexity. **Fold them into submaps.**

**Mark with double ring:**
- "Domain Knowledge" submap: Taxonomy, ontology, training, experts
- "Architecture Decisions" submap: ADRs, process, checks, stewardship
- "Code Review Process" submap: Template, rules, feedback loops

**Note what's inside (don't draw it).**

## Before/After Example

Before (20 components): Everything from specs to monitoring  
After (9 components): Question + critical chain + 2 submaps

**Result:** Clear story, obvious constraint, actionable.

## Discussion

1. What was your question?
2. What did you cut and why?
3. What became your submap?
4. Is the constraint more obvious?

Next: [Exercise 6: Make a Move](06-make-a-move.md)
