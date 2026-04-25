import os
import re
from datasets import load_dataset

OUTPUT_DIR = "src/content/problems/mathnet"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def clean_text(text):
    if not text:
        return ""

    # Remove attached image markdown for MVP.
    text = re.sub(r"!\[\]\(attached_image_\d+\.png\)", "", text)

    return text.strip()


def extract_topics(topics_flat):
    if not topics_flat:
        return []

    result = set()

    for t in topics_flat:
        t = t.lower()

        if "combinatorics" in t:
            result.add("combinatorics")
        if "invariant" in t:
            result.add("invariants")
        if "pigeonhole" in t:
            result.add("pigeonhole")
        if "number theory" in t:
            result.add("number_theory")
        if "geometry" in t:
            result.add("geometry")
        if "modular" in t or "congruence" in t:
            result.add("modular_arithmetic")
        if "coloring" in t:
            result.add("coloring")

    return sorted(result)


def guess_domain(topics):
    if "number_theory" in topics:
        return "number_theory"
    if "geometry" in topics:
        return "geometry"
    if "combinatorics" in topics:
        return "combinatorics"
    return "combinatorics"


def guess_strategy(topics):
    strategies = []

    if "invariants" in topics:
        strategies.append("invariant")
    if "pigeonhole" in topics:
        strategies.append("pigeonhole")
    if "modular_arithmetic" in topics:
        strategies.append("modular_arithmetic")

    return strategies


def guess_moves(topics, strategies):
    moves = []

    if "coloring" in topics and "invariant" in strategies:
        moves.append("coloring_invariant")
    elif "invariant" in strategies:
        moves.append("modulo_invariant")

    if "pigeonhole" in strategies and "modular_arithmetic" in strategies:
        moves.append("pigeonhole_on_residues")
    elif "pigeonhole" in strategies:
        moves.append("simple_pigeonhole")

    if "modular_arithmetic" in strategies:
        moves.append("residue_classes")

    return moves


def yaml_list(items, fallback=None):
    if items:
        return "".join(f"  - {item}\n" for item in items)
    if fallback:
        return f"  - {fallback}\n"
    return ""


ds = load_dataset("ShadenA/MathNet")["train"].remove_columns(["images"])

count = 0
MAX = 15

for row in ds:
    if count >= MAX:
        break

    # English only for now. Some entries have None even when written in English.
    if row["language"] not in (None, "English"):
        continue

    problem = clean_text(row["problem_markdown"])
    solutions = row["solutions_markdown"]

    if not problem or not solutions:
        continue

    solution = clean_text(solutions[0])

    topics = extract_topics(row["topics_flat"])
    domain = guess_domain(topics)
    strategies = guess_strategy(topics)
    moves = guess_moves(topics, strategies)

    slug = f"mathnet-{row['id']}"
    title = f"{row['competition']} problem"

    topics_yaml = yaml_list(topics, fallback=domain)
    strategies_yaml = yaml_list(strategies)
    moves_yaml = yaml_list(moves)

    mdx = f"""---
slug: "{slug}"
title: "{title}"
difficulty: 3
track: "mathnet-sample"
domain: {domain}
topics:
{topics_yaml}strategies:
{strategies_yaml}moves:
{moves_yaml}source: MathNet
---

## Problem
{problem}

---

## Hints

### Nudge
Start by identifying the main structure of the problem.

### Focus
Think about what mathematical object or property is central.

### Key idea
Look for a standard technique that applies here.

### Finish
Connect the key idea to reach the conclusion.

---

## Solution
{solution}
"""

    path = os.path.join(OUTPUT_DIR, f"{slug}.mdx")
    with open(path, "w", encoding="utf-8") as f:
        f.write(mdx)

    count += 1

print(f"Generated {count} problems.")