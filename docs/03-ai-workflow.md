# AI Collaboration & Workflow Guide

This guide outlines best practices for leveraging both **Web Claude** (system architect) and **Cursor AI** (executor) throughout the Game Store Rental Tracker project. Follow these workflow rules to ensure an efficient, accurate, and secure AI-driven development process.

---

## Architect vs. Executor Pattern

- **Web Claude (Architect)**
  - Focus on high-level design discussions, system architecture, prompt engineering, and documentation.
  - Use Claude to brainstorm requirements, produce technical specs, clarify workflows, and outline APIs/components.
  - Example: Draft overall API shape before code generation, or prompt for schema suggestions in natural language.

- **Cursor AI (Executor)**
  - Executes on specific tasks: code writing, file editing, inline completions, and refactors, based on Claude’s or human-provided guidance.
  - Use Cursor to generate actual code, insert files or components, automate repetitive edits, and apply upgrades.

---

## Context Management

Efficient context handling ensures accurate AI output and reduces token usage:

- Reference only *relevant* files in conversations (e.g., via `@docs/file.md` or highlighting the current file).
- Use **Ctrl + L** to link or pin files that are immediately needed for the current task.  
  - Avoid attaching large unrelated files.
  - When possible, use **precise file references** ("see `prisma/schema.prisma`") instead of full files.
- For architectural work, load only the design docs and schema. For code generation, load the target files and direct dependencies.
- *Regularly clear context* of unneeded attachments to optimize performance.

---

## Code Review & Quality Rules

- **Every AI-generated component, API route, or business logic must be:**
  1. **Manually reviewed** by a developer before merge.
  2. **Tested**—either automatically (via unit/integration tests) or manually (locally).
  3. **Committed in atomic Git units:**  
     - Separate unrelated changes.
     - Structure PRs for clear review: one feature or fix per commit or PR.
- **Never merge "AI dump" PRs** containing multiple unrelated changes.
- **Document rationale** for significant architectural choices in `/docs` (using Claude, then review).

---

## Privacy Rule

- **Code privacy mode must remain enabled at all times.**
- **Never copy/paste or reference real secrets, credentials, or private `.env` values in AI prompts or docs.**
- Scrub API keys, salts, passwords, and customer data from all context before engaging AI.
- If sample secrets are required for documentation, use placeholders: `SUPABASE_ANON_KEY=example_key`, etc.

---

_These rules ensure a collaborative, transparent, and secure workflow, leveraging both high-level AI reasoning and code automation responsibly._