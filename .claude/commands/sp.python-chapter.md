---
description: Orchestrate full SpecKit Plus workflow for Python chapters (12-29). Automatically chains /sp.specify → /sp.plan → /sp.tasks with approval gates. Students learn Python through AIDD thinking (specification-first, validation-first, AI partnership).
---

# /sp.python-chapter: Orchestrated Python Chapter Workflow

**Purpose**: Design a complete Python chapter (12-29) using AIDD principles with **automatic orchestration** of the full SpecKit Plus workflow (Spec → Plan → Tasks → optional Implementation). Students learn programming by applying AIDD thinking learned in Chapters 1-11.

**Usage**:
```
/sp.python-chapter [chapter-number]
```

**Example**:
```
/sp.python-chapter 13
```

---

## VERTICAL INTELLIGENCE: AIDD-Driven Python Teaching

Before orchestration begins, understand what makes Python chapters effective in the AI-native era:

### Core Principle: Specification-First, Validation-First, AI Partnership

Students don't memorize Python syntax. Instead:

1. **Understand the concept** (plain language explanation)
2. **See minimal code** (what it does in action)
3. **Ask their AI** (explore through dialogue with Claude Code/Gemini CLI)
4. **Extract insight** (why this matters for thinking, not just coding)

### AIDD Thinking Applied to Programming

**Traditional Programming Teaching**:
- "Memorize Python syntax"
- "Here are all 47 string methods"
- Syntax-first (memorize, then apply)

**AIDD-First Python Learning**:
- "Understand concepts first, then use code as a tool"
- "Here's what you need; your AI shows how when needed"
- Understanding-first (understand, then code)
- Specification-first (clarify intent, then code)
- Validation-first (test understanding, not syntax)

### Teaching Pattern (Every Concept)

```markdown
## 1. [Concept Name] — [Why it matters]

**What it is:**
Plain-language explanation (2-3 sentences).

### 💻 Code Idea

\`\`\`python
# Minimal code showing the concept
# Focus on WHAT it does
\`\`\`

### 🤖 Think With Your AI

> "What does this do?"
>
> "What changes if we...?"
>
> "How would you use this to...?"

### 🧠 The Reasoning Pattern

[Why this concept matters for thinking, not just coding]
```

**Example:**

```markdown
## 1. Variables — Storing Data

**What it is:**
A variable names a value so your program can remember it.

### 💻 Code Idea

\`\`\`python
name = "Alex"
score = 95
\`\`\`

### 🤖 Think With Your AI

> "Why do we need variables instead of just using 95?"
>
> "What breaks if we forget to name a value?"
>
> "How do AI agents use variables to track context?"

### 🧠 The Reasoning Pattern

Programs need memory. Variables let you say "remember this as X"—
exactly how reasoning chains in AI maintain state.
```

---

## Python Standards (Chapters 12-29)

**Version:** 3.13+
**Syntax:** f-strings only, match/case (17+), modern types (`list[int]`, `X | None`)
**Type hints:** None (Ch 13) → Gradual (14-26) → Mandatory (27+)

**Security (non-negotiable):**
- ❌ No `eval()`, `shell=True`, hardcoded secrets
- ✅ Environment variables, input validation, modern patterns

---

## CRITICAL DESIGN RULES

### Rule 1: USER INTENT IS AUTHORITY

**Never override user input:**
- User says "beginner" → Make A1-A2 (NOT A2-B1)
- User says "just variables" → Only variables (NOT + functions + loops)
- User says "absolute beginners" → 5 concepts max, simple framing

**Always ask, always honor. Do NOT assume.**

---

### Rule 2: NO FORWARD REFERENCES

**Never mention untaught concepts:**
- ❌ NO Chapter 30+ references
- ❌ NO "Spec-Driven Development" (not yet taught)
- ❌ NO methodology beyond AIDD

**DO reference AIDD (Ch 1-11, already taught):**
- ✅ "Apply the specification-first thinking from Chapter 4..."
- ✅ "Recall the nine pillars of AIDD from Chapter 4..."
- ✅ "Use validation-first thinking when testing your code..."

---

### Rule 3: RUTHLESS CONTEXT FILTERING

**When extracting from context materials:**

**Chapter 13 "Introduction to Python":**
- ✅ "What is Python?" → USE (intro concept)
- ✅ "Your first program" → USE (intro outcome)
- ❌ "Functions" → SKIP (Ch 20 topic)
- ❌ "Classes" → SKIP (Ch 24+ topic)
- ❌ "Async/await" → SKIP (Ch 28 topic)

**Chapter 17 "Control Flow and Loops":**
- ✅ "if/elif/else statements" → USE (chapter focus)
- ✅ "for loops" → USE (chapter focus)
- ❌ "Functions" → SKIP (Ch 20 topic)
- ❌ "List comprehensions" → SKIP (advanced)
- ❌ "Exception handling" → SKIP (Ch 21 topic)

**Decision Rule:**
- IF context concept fits THIS chapter's title → EXTRACT
- IF context concept belongs to Ch N+1 or later → SKIP
- IF context concept is advanced variation → SKIP
- IF context concept requires future prerequisites → SKIP

---

### Rule 4: MINIMAL SCOPE

**Depth > breadth.**

- Beginner (Ch 12-16): 5 concepts max, 3-4 lessons
- Intermediate (Ch 17-23): 7 concepts max, 4-5 lessons
- Advanced (Ch 24-29): 10 concepts max, 5-6 lessons

---

### Rule 5: MINIMAL FILES

**Create ONLY:**
- ✅ spec.md (what students learn)
- ✅ plan.md (how we teach it)
- ✅ tasks.md (implementation checklist)

**Never create:**
- ❌ index.md, _templates/, _assets/, _code-examples/, lesson-template.md, capstone-rubric.md

---

## ORCHESTRATED WORKFLOW (What Actually Happens)

When you run `/sp.python-chapter [N]`:

### PHASE 0: Context Gathering (Interactive)

1. **Validate chapter**: Read `specs/book/chapter-index.md` and extract chapter title (ANCHOR)
2. **Ask 4 questions**:
   - Who are we teaching? (audience → complexity tier)
   - What's the core focus for THIS chapter? (scope → concept limit)
   - What can students BUILD? (outcome → learning objective)
   - Which context aspects fit? (materials → pedagogical patterns)
3. **Store responses** for next phases

**Apply AIDD**: Specification-first means understanding WHO and WHAT before designing HOW.

---

### PHASE 1: Specification (Automated)

```
→ Invoke: /sp.specify [chapter-context]
  ├─ Pass: chapter number, title, user answers, context materials
  ├─ Apply: AIDD principles, cognitive load limits, teaching patterns
  ├─ Create: specs/part-5-chapter-[N]/spec.md
  └─ Report: "Spec created. Review and approve."

WAIT: User reviews spec.md
→ User confirms: "✅ Spec approved" or provides feedback
  ├─ If feedback: Update spec.md iteratively
  └─ If approved: Continue to PHASE 2
```

**What /sp.specify receives:**
- Chapter title (anchor from chapter-index.md)
- User's audience answer (determines complexity tier: A1/A2/B1)
- User's scope answer (limits concepts to 5/7/10)
- User's outcome answer (real thing students will build)
- Context materials (extracted pedagogically)
- AIDD principles (specification-first, validation-first, AI partnership)
- Teaching pattern template (What it is → Code → Try → Why it matters)
- Cognitive load limits (max 5 for beginner, 7 for intermediate, 10 for advanced)

---

### PHASE 2: Planning (Automated)

```
→ Invoke: /sp.plan [spec-context]
  ├─ Read: specs/part-5-chapter-[N]/spec.md
  ├─ Apply: Lesson progression, CEFR proficiency levels, AI prompts
  ├─ Create: specs/part-5-chapter-[N]/plan.md
  └─ Report: "Plan created. Review and approve."

WAIT: User reviews plan.md
→ User confirms: "✅ Plan approved" or provides feedback
  ├─ If feedback: Update plan.md iteratively
  └─ If approved: Continue to PHASE 3
```

**What /sp.plan receives:**
- Approved spec.md (learning objectives, concepts, success criteria)
- Chapter scope (what fits this chapter, what doesn't)
- AIDD teaching pattern (Concept → Code → Try → Why)
- Proficiency expectations (CEFR A1/A2/B1 levels)
- Real outcome students will build

---

### PHASE 3: Tasks (Automated)

```
→ Invoke: /sp.tasks [spec+plan-context]
  ├─ Read: specs/part-5-chapter-[N]/spec.md + plan.md
  ├─ Apply: Acceptance criteria, validation steps, implementation checklist
  ├─ Create: specs/part-5-chapter-[N]/tasks.md
  └─ Report: "Tasks created. Review and approve."

WAIT: User reviews tasks.md
→ User confirms: "✅ Tasks approved" or provides feedback
  ├─ If feedback: Update tasks.md iteratively
  └─ If approved: Continue to PHASE 4
```

**What /sp.tasks receives:**
- Approved spec.md + plan.md (complete design)
- Learning objectives (what success looks like)
- Lessons (what needs to be implemented)
- Acceptance criteria (how to validate)

---

### PHASE 4: Implementation (Optional)

```
→ Ask user: "Ready to implement lesson content?"

Options:
A) Implement with lesson-writer subagent
   → Invoke: lesson-writer subagent
   → Pass: spec.md, plan.md, tasks.md
   → Apply: AIDD teaching pattern, CEFR levels, validation-first approach
   → Create: docs/part-5/chapter-[N]/{01,02,03,04}-lesson-*.md

B) Manual implementation
   → User implements using tasks.md as checklist

C) Done for now
   → Keep design artifacts, skip implementation

→ Report final status
```

---

## KEY PRINCIPLES (Always Applied)

### ✅ AIDD-First
- Reinforce specification-first thinking from Chapters 1-11
- Validation-first practice: "How will students test understanding?"
- AI partnership: "How will they use Claude Code/Gemini CLI?"

### ✅ No Forward References
- Zero mentions of Chapters 30+ (SDD taught later)
- No concepts from future chapters
- Chapter title from `chapter-index.md` is the absolute anchor

### ✅ Honors User Intent
- User's audience choice = final decision (never override)
- User's scope answer = limits concepts (never expand)
- User's outcome answer = determines lessons (never modify)

### ✅ Ruthless Context Filtering
- Only extract context matching THIS chapter's title
- Skip concepts from future chapters (even if in materials)
- Skip advanced variations and tangential concepts

### ✅ Cognitive Load Limits
- Max 5 concepts for beginner (Ch 12-16)
- Max 7 concepts for intermediate (Ch 17-23)
- Max 10 concepts for advanced (Ch 24-29)

### ✅ Teaching Intelligence Preserved
- Every phase applies AIDD principles
- Every phase uses teaching patterns
- Every phase respects chapter boundaries
- Every phase validates against acceptance criteria

---

## EXECUTION INSTRUCTIONS (For Claude Code)

The command must implement this workflow with vertical intelligence:

```python
# MAIN EXECUTION FUNCTION

def sp_python_chapter(chapter_num):
    # PHASE 0: Validation & Context Gathering
    chapter_title = validate_and_read_chapter(chapter_num)  # 12-29

    user_context = ask_user_four_questions(chapter_num, chapter_title)
    # Stores: audience, core_focus, outcome, context_materials

    # PHASE 1: Specification (AUTOMATED + INTELLIGENT)
    spec_context = prepare_context(
        chapter_num, chapter_title, user_context,
        aidd_principles=True,
        teaching_patterns=True,
        cognitive_load_limits=True
    )

    SlashCommand.invoke("/sp.specify", context=spec_context)
    # → Creates: specs/part-5-chapter-{N}/spec.md
    # → Applies: AIDD thinking, pedagogy, teaching patterns

    print("📋 Spec created: specs/part-5-chapter-{N}/spec.md")
    print("Please review and confirm: '✅ Spec approved' or feedback")

    wait_for_approval()  # Blocks until user confirms

    # PHASE 2: Planning (AUTOMATED + INTELLIGENT)
    spec_content = Read(f"specs/part-5-chapter-{N}/spec.md")
    plan_context = prepare_context(
        chapter_num, chapter_title, spec_content,
        proficiency_levels=True,
        lesson_progression=True,
        ai_prompts=True
    )

    SlashCommand.invoke("/sp.plan", context=plan_context)
    # → Creates: specs/part-5-chapter-{N}/plan.md
    # → Applies: CEFR levels, lesson structure, AI partnership

    print("📋 Plan created: specs/part-5-chapter-{N}/plan.md")
    print("Please review and confirm: '✅ Plan approved' or feedback")

    wait_for_approval()  # Blocks until user confirms

    # PHASE 3: Tasks (AUTOMATED + INTELLIGENT)
    plan_content = Read(f"specs/part-5-chapter-{N}/plan.md")
    tasks_context = prepare_context(
        chapter_num, chapter_title, spec_content, plan_content,
        acceptance_criteria=True,
        validation_steps=True,
        implementation_checklist=True
    )

    SlashCommand.invoke("/sp.tasks", context=tasks_context)
    # → Creates: specs/part-5-chapter-{N}/tasks.md
    # → Applies: Testing, validation, completeness checks

    print("📋 Tasks created: specs/part-5-chapter-{N}/tasks.md")
    print("Please review and confirm: '✅ Tasks approved' or feedback")

    wait_for_approval()  # Blocks until user confirms

    # PHASE 4: Implementation (OPTIONAL + INTELLIGENT)
    print("\n✅ All 3 design artifacts complete!")
    print(f"  - specs/part-5-chapter-{N}/spec.md")
    print(f"  - specs/part-5-chapter-{N}/plan.md")
    print(f"  - specs/part-5-chapter-{N}/tasks.md")

    choice = ask_user([
        "A) Implement with lesson-writer subagent",
        "B) Manual implementation",
        "C) Done for now"
    ])

    if choice == "A":
        tasks_content = Read(f"specs/part-5-chapter-{N}/tasks.md")
        Task.invoke(
            subagent_type="lesson-writer",
            prompt=prepare_lesson_writer_prompt(
                spec_content, plan_content, tasks_content,
                aidd_teaching_pattern=True,
                cefr_levels=True,
                validation_first=True
            )
        )
        # → Creates: docs/part-5/chapter-{N}/*-lesson-*.md
        # → Applies: Full AIDD methodology, AI partnership approach

    # Final Report
    report_completion(chapter_num)
```

---

## CRITICAL VALIDATION (Before Each Phase)

**PHASE 1 Validation** (before `/sp.specify`):
- ✅ Chapter number valid (12-29)
- ✅ Chapter title matches `chapter-index.md`
- ✅ User's audience answer captured
- ✅ User's scope answer captured
- ✅ User's outcome answer captured
- ✅ Context will be ruthlessly filtered
- ✅ AIDD principles will be applied

**PHASE 2 Validation** (before `/sp.plan`):
- ✅ spec.md was created successfully
- ✅ Concept count ≤ tier limit (5/7/10)
- ✅ No forward references (Chapters 30+)
- ✅ No methodology names (except AIDD for reinforcement)
- ✅ Only Chapters 1-N are prerequisites
- ✅ Teaching pattern respected

**PHASE 3 Validation** (before `/sp.tasks`):
- ✅ plan.md was created successfully
- ✅ Lessons match spec's learning objectives
- ✅ Proficiency levels assigned (CEFR)
- ✅ AI prompts specified for each lesson
- ✅ Validation points defined

**PHASE 4 Validation** (before lesson-writer):
- ✅ All 3 design files exist and are valid
- ✅ User chose implementation option
- ✅ Context filtered ruthlessly
- ✅ AIDD principles embedded
- ✅ Ready for lesson content creation

---

## WHAT GETS CREATED

**By End of PHASE 3** (mandatory):
```
specs/part-5-chapter-[N]/
  ├── spec.md       (What students learn + AIDD principles)
  ├── plan.md       (How we teach it, lesson-by-lesson + CEFR levels)
  └── tasks.md      (Implementation checklist + validation)
```

**By End of PHASE 4** (if Option A chosen):
```
docs/part-5/chapter-[N]/
  ├── 01-lesson-1-[topic].md
  ├── 02-lesson-2-[topic].md
  ├── 03-lesson-3-[topic].md
  ├── 04-lesson-4-[topic].md (or more, based on plan)
  └── index.md (auto-generated TOC)
```

---

## EXAMPLE EXECUTION (What User Sees)

```
> /sp.python-chapter 13

⏺ PHASE 0: Context Gathering

Chapter 13: "Introduction to Python" (Part 5)
Prerequisites: Chapters 1-12 (AIDD principles + tools)

Q1: Who are we teaching?
[User answers: Absolute beginners AND professionals transitioning to AI-native]

Q2: Core focus for THIS chapter?
[User answers: Introduction fundamentals + first program]

Q3: What will students BUILD?
[User answers: Interactive program asking for name and printing greeting]

Q4: Which context aspects from materials?
[User answers: Use existing lesson structure but adapt for AIDD principles]

✅ Context gathered. Moving to PHASE 1...

---

⏺ PHASE 1: Specification (Automated)

Invoking: /sp.specify with chapter context...
Applying: AIDD principles, teaching patterns, cognitive load limits

[/sp.specify generates spec.md]

📋 Spec created: specs/part-5-chapter-13/spec.md

Please review the specification:
- Does this match your vision for Chapter 13?
- Are learning objectives clear?
- Is scope appropriate (not too broad)?
- Are AIDD principles reinforced?

Reply with: "✅ Spec approved" or provide feedback

[User: ✅ Spec approved]

✅ Spec approved. Moving to PHASE 2...

---

⏺ PHASE 2: Planning (Automated)

Invoking: /sp.plan with approved spec...
Applying: Lesson progression, CEFR levels, AI prompts

[/sp.plan generates plan.md]

📋 Plan created: specs/part-5-chapter-13/plan.md

Please review the lesson breakdown:
- Are 3-4 lessons appropriate?
- Are AI prompts specified for each lesson?
- Are CEFR proficiency levels correct (A1 for intro)?
- Is AIDD teaching pattern applied?

Reply with: "✅ Plan approved" or provide feedback

[User: ✅ Plan approved]

✅ Plan approved. Moving to PHASE 3...

---

⏺ PHASE 3: Tasks (Automated)

Invoking: /sp.tasks with spec + plan...
Applying: Validation points, acceptance criteria, testing

[/sp.tasks generates tasks.md]

📋 Tasks created: specs/part-5-chapter-13/tasks.md

Please review the implementation checklist:
- Are acceptance criteria clear?
- Are validation steps included?
- Are all lesson phases covered?

Reply with: "✅ Tasks approved" or provide feedback

[User: ✅ Tasks approved]

✅ Tasks approved. Moving to PHASE 4...

---

⏺ PHASE 4: Implementation (Optional)

All design artifacts complete:
  ✅ specs/part-5-chapter-13/spec.md (AIDD-driven)
  ✅ specs/part-5-chapter-13/plan.md (CEFR-leveled)
  ✅ specs/part-5-chapter-13/tasks.md (validation-first)

Ready to implement lesson content?

A) Implement with lesson-writer subagent
   → Automatically creates lesson .md files with full AIDD methodology
B) Manual implementation
   → You create lessons using tasks.md as guide
C) Done for now
   → Keep design artifacts, implement later

[User chooses A]

✅ Invoking lesson-writer subagent...

---

✅ WORKFLOW COMPLETE

Chapter 13 design package ready:
  ✅ Specification (AIDD-driven)
  ✅ Lesson Plan (CEFR-leveled, AI prompts)
  ✅ Implementation Tasks (validation-first)
  ✅ Lesson Content (AIDD teaching pattern applied)

Next: Share with technical-reviewer for validation
```

---

## CRITICAL SUCCESS FACTORS

1. **Automatic Invocation**: `/sp.specify`, `/sp.plan`, `/sp.tasks` must be invoked automatically via SlashCommand tool with full intelligence context

2. **Vertical Intelligence Preserved**: Every phase applies AIDD principles, teaching patterns, pedagogical design, and chapter boundary awareness

3. **Approval Gates**: User must explicitly approve each phase ("✅ Approved") before proceeding to next

4. **Context Preservation**: Each phase receives full context from all previous phases + vertical intelligence

5. **Ruthless Filtering**: Context extraction must skip any concepts from future chapters, even if present in materials

6. **User Authority**: User's answers to 4 questions are final — never override with assumptions

7. **Compliance**: Every phase validates against acceptance criteria before proceeding

8. **Teaching Quality**: Intelligence flows through all 4 phases, not just documentation

---

## REFERENCES

- **Chapter Index**: `specs/book/chapter-index.md` (Part 5 Quick Lookup: Chapters 12-29)
- **Constitution**: `.specify/memory/constitution.md` (AIDD principles, domain skills)
- **Design Template**: `.specify/templates/book/PYTHON_CHAPTER_DESIGN_TEMPLATE.md` (Pedagogical rules + intelligence)
- **Sample Input**: `.claude/commands/sp.python-chapter.SAMPLE_INPUT.md` (Example invocations)
- **Context Materials**: `context/13_chap12_to_29_specs/` (Lesson files, teaching examples)

---

## ONE COMMAND. FULL INTELLIGENCE. COMPLETE WORKFLOW.

Run `/sp.python-chapter [N]` and the system:

✅ Gathers intelligent context (AIDD-driven questions)
✅ Automatically chains `/sp.specify` → `/sp.plan` → `/sp.tasks` with approval gates
✅ Applies vertical intelligence (AIDD principles, teaching patterns, pedagogy) at every phase
✅ Respects chapter boundaries (ruthless context filtering)
✅ Honors user intent (never overrides)
✅ Validates quality (acceptance criteria at each gate)
✅ Optionally implements lessons with lesson-writer subagent

**Result: Specification-first, validation-first, AIDD-centered Python chapters ready for AI-native development learning.**
