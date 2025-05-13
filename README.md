# Anteater – A trippy Langton's Ant Variant

A simulation based on Langton's Ant made with the soul purpose of creating trippy and interesting patterns.

[Live Demo](https://ebrows0.github.io/AntEater/)

---

## How it works

- The simulation uses **3–6 different states**, randomly selected at initialization.
- Each state has **5 rules**, determining how the ant behaves when on each color.
- There are **8 colors available**:
  - Black, Red, Green, Blue, Yellow, Magenta, Cyan, White
- This creates a **much richer state space** than traditional turmites which often only use 2 colors.

---

## Different Movement

- The ant can move in **8 directions**:
  - Cardinal: N, S, E, W
  - Diagonal: UL (up-left), U (up), UR (up-right), DR (down-right), D (down), DL (down-left)
- This allows for **more organic, flowing patterns**, as opposed to traditional 4-direction turmites.

---

## Ruleset Generation Logic

```js
// Generate 5 rules per state
for (let ruleIndex = 0; ruleIndex < 5; ruleIndex++) {
    // First two rules must lead to different states
    if (ruleIndex < 2) {
        nextState = String((state + Math.floor(Math.random() * (numStates - 1)) + 1) % numStates);
    } else {
        // 50% chance to stay in current state
        if (Math.random() < 0.5) {
            nextState = String(state);
        } else {
            nextState = String((state + Math.floor(Math.random() * (numStates - 1)) + 1) % numStates);
        }
    }
}
```

---

## What Makes This Different?

- **Forced State Transitions:** First two rules of each state **must go to different states**, avoiding trivial loops.
- **Balanced Transitions:** Remaining rules have a **50/50 chance** to stay or change, creating dynamic yet stable systems.
- **Color Shuffling:** Each state gets a shuffled set of colors, ensuring color variation and diversity.
- **8-Directional Movement:** Each rule picks randomly from all directions, resulting in more complex pathing.

This creates a system that:
- Generates **interesting emergent patterns**
- Balances **chaos and structure**
- Evolves visually with time
- Produces **striking visuals** through rich color and movement variety

From **geometric mazes** to **organic growths**.

---
