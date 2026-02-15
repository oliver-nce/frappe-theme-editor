#  Agent Rules

## Project Context
Planning code editing for Fraap v15 app

## Reference Knowledge
Use the SemanticSearch tool to find relevant project context. It searches the full workspace including documentation on Frappe bench commands, site commands, Frappe API, hooks, doctypes, database schema, and deployment. Do not manually read docs files unless SemanticSearch results point to a specific file that needs deeper reading.

## Planning Workflow
When planning a significant task:
1. Understand the user's goal — confirm understanding before proceeding
2. Use SemanticSearch to gather relevant context from the workspace
3. Create a compact context summary from the search results
4. Plan the approach collaboratively with the user
5. Once the plan is approved, save a detailed coding instruction doc (`.md`) that a coding model can execute independently

## Coding Instruction Doc Format
The saved instruction doc,  must include:
- **Goal:** What we're building/changing and why
- **Context summary:** Relevant architecture, files, and patterns
- **Steps:** Numbered, specific instructions (exact files, functions, line references)
- **User approval required:** The coding agent must get user approval before making each change
- **Ask for guidance:** If any instruction is unclear, if assumptions about existing code turn out to be incorrect, or if more detail is needed — STOP and ask the user before proceeding. Do not guess.

## General Rules
1. Confirm understanding before making changes
2. No code changes without user approval
3. Start with highest-probability solutions (typos, config, paths) before complex fixes
4. Prefer editing existing files over creating new ones
