
# MathLab

**MathLab** is an open training environment for learning mathematical problem solving.

The goal of the project is simple:

> Help students transition from solving textbook exercises to thinking through real mathematical problems.

Many students learn techniques in class but struggle with **how to begin** unfamiliar problems. MathLab focuses on building those first problem-solving instincts.

---

# Philosophy

MathLab is built around a few simple ideas.

### Problem solving is learned by doing
Reading solutions is not enough. Real understanding comes from experimenting with problems, trying ideas, and making mistakes.

### Writing helps thinking
Staring at a problem rarely produces insight. Writing examples, observations, and partial ideas helps reveal structure.

Each problem page includes a **Work tab** where users can write notes while exploring the problem.

### Hints should guide thinking
Hints are structured to guide the problem-solving process rather than reveal answers immediately.

MathLab uses a **hint ladder**:

Nudge → Focus → Key Idea → Finish

This structure encourages productive thinking before revealing the final idea.

### Minimal interface
The interface is intentionally simple. The goal is a clean environment for mathematical thinking.

Each problem page contains:

Work | Hints | Solution

---

# Design Principles

These principles guide development decisions.

### 1. Simplicity over features
MathLab should remain minimal and focused.

New features should only be added if they clearly improve the learning experience.

### 2. Pedagogy first
Every feature should support how people actually learn problem solving.

Examples:
- The **Work tab** encourages writing and experimentation.
- **Hint ladders** help guide thinking rather than spoil solutions.

### 3. Consistent hint structure
All problems follow the same hint format:

Nudge → Focus → Key Idea → Finish

This trains students to develop repeatable problem-solving habits.

### 4. Content before technology
The real value of MathLab comes from:
- good problems
- clear hints
- thoughtful tracks

Infrastructure should remain lightweight.

### 5. Open and extensible
Problems are stored as **MDX files**, making the system easy to extend.

New tracks can be created simply by adding new problem folders.

---

# Project Structure

src/
 ├─ app/
 │   ├─ library/           # List of all problems
 │   ├─ tracks/            # Problem tracks
 │   └─ p/[slug]/          # Individual problem pages
 │
 ├─ components/
 │   └─ ProblemTabs.tsx    # Work / Hints / Solution tabs
 │
 └─ content/
     └─ problems/
         └─ putnam-warmups/
             pw-001-...
             pw-002-...
             pw-003-...

Problems are written using **MDX**, allowing math and structured content in the same file.

---

# Example Problem File

---
slug: "pw-003-pigeonhole"
title: "A pigeonhole principle warmup"
difficulty: 3
tags: ["pigeonhole principle", "combinatorics"]
track: "putnam-warmups"
---

## Problem
...

## Hints

### Nudge
...

### Focus
...

### Key idea
...

### Finish
...

## Solution
...

---

# Tracks

Tracks organize problems into learning sequences.

Example:

Putnam Warmups

This track introduces core problem-solving ideas:

- invariants
- modular reasoning
- pigeonhole principle
- extremal arguments
- experimentation

Tracks are stored in:

src/content/problems/<track-name>/

---

# Development

Install dependencies:

npm install

Run the development server:

npm run dev

Open the app:

http://localhost:3000

---

# Deployment

MathLab is deployed using **Vercel**.

Production updates occur when the `main` branch is updated.

Typical workflow:

feature branch
→ commit
→ push
→ merge to main
→ Vercel deploy

---

# Contributing

When adding new problems:

1. Place the file in the correct track folder
2. Follow the hint ladder structure
3. Keep solutions concise
4. Ensure hints guide thinking rather than reveal answers

Hints should help readers **generate progress**, not immediately reveal the trick.

---

# Future Ideas

Possible directions for the project include:

- track progress indicators
- recommended next problem
- additional problem tracks
- optional AI feedback on attempts
- optional formal proofs (Lean)

The goal is to keep MathLab focused on **learning to think mathematically**.

---

# Author

Jorge Guzman

---

# Closing Thought

Mathematical problem solving is not about memorizing tricks.

It is about learning how to **experiment, observe structure, and persist**.

MathLab is an attempt to make that process easier to learn.
