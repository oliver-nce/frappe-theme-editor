# Handoff Document: frappe-theme-editor.html Refactoring

## Overview

You are taking over a refactoring project for `frappe-theme-editor.html`, a ~6000 line single-file HTML/CSS/JS theme editor tool.

**Key files to read before starting:**
1. `NCE-Design-System/REFACTORING-PLAN.md` - The complete refactoring plan with 5 phases
2. `NCE-Design-System/frappe-theme-editor.html` - The current codebase
3. This handoff document

---

## Current State

The codebase is **functional but has structural debt**:
- CSS: Monolithic, duplicated patterns, inconsistent naming
- HTML: ID-heavy, mixed layout approaches, inline styles
- JavaScript: Global scope, inline handlers, scattered DOM queries

**No refactoring has started yet.** The code is at its original state (with recent UI tweaks).

---

## The Plan (Summary)

### Phase 1: CSS Consolidation (Do First)
1. Add design tokens (`:root` variables) at top of `<style>` block
2. Add layer comments to organize existing styles
3. Replace hardcoded values with token references
4. Consolidate duplicate button styles into `.c-btn` variants
5. Consolidate duplicate panel styles into `.c-panel` variants
6. Fix responsive breakpoint inconsistency (use `min-width: 800px`)

### Phase 2: HTML Data Attributes
1. Add `data-action` attributes alongside existing `onclick` handlers
2. Add `data-target` attributes to identify targets
3. Keep inline handlers in place initially (both will work)

### Phase 3: JavaScript Module
1. Create IIFE wrapper
2. Move CONFIG and DEFAULT_STATE inside
3. Create DOM cache object
4. Create event delegation handler
5. Migrate functions one at a time, removing inline handlers as you go

### Phase 4: HTML Semantic Cleanup
1. Replace `.section` with semantic `<section>` + `.c-section`
2. Replace ID-based queries with data-attribute queries
3. Remove IDs only used for JS targeting
4. Convert inline styles to utility classes

### Phase 5: Final Cleanup
1. Remove dead code
2. Consolidate remaining duplicates
3. Add comments/documentation

---

## How to Proceed

### For Each Task:

1. **Read the relevant section** of REFACTORING-PLAN.md first
2. **Make one small change** at a time
3. **Test visually** after each change (open in browser, click around)
4. **Commit or checkpoint** before moving to next change

### Recommended First Tasks (Phase 1):

**Task 1.1: Add Design Tokens**
- Location: Top of `<style>` block (after line 8)
- Add `:root` with spacing, radius, shadow, and typography tokens
- See REFACTORING-PLAN.md "LAYER 1: DESIGN TOKENS" for exact values

**Task 1.2: Add Layer Comments**
- Add section divider comments throughout CSS
- Don't move code yet, just add organizational comments
- Layers: Tokens → Reset → Layout → Components → Utilities

**Task 1.3: Consolidate Button Styles**
- Find all button-like classes: `.btn`, `.edit-btn`, `.picker-apply-btn`, `.angle-preset`
- Create `.c-btn` base class with shared properties
- Create modifier variants: `.c-btn--primary`, `.c-btn--small`, `.c-btn--toggle`
- Update HTML to use new classes (keep old classes temporarily for safety)

---

## High-Risk Areas (Be Careful)

| Area | Why | Test How |
|------|-----|----------|
| Color picker (lines ~5400-5700) | Complex grid/click interactions | Click grid cells, verify color updates |
| Theme export/import | JSON structure must match exactly | Export, then re-import, verify no data loss |
| Shade offset/anchor system | Subtle state dependencies | Change anchor, verify all shades update |
| Dropdown menus | Click-outside handling | Open dropdown, click outside, verify closes |

---

## Key Code Locations

| What | Lines (approximate) |
|------|---------------------|
| CSS start | 8 |
| CSS end | ~1810 |
| HTML body start | ~1813 |
| Tab 1 (Core Theme) HTML | ~1813-2085 |
| Tab 2 (Frappe Settings) HTML | ~2087-3190 |
| JavaScript start | ~3191 |
| CONFIG object | ~4510 |
| DEFAULT_STATE | ~4554 |
| DEFAULT_FRAPPE_STATE | ~4586 |
| Color utilities (hslToHex, etc.) | ~4700-4800 |
| updateUI() function | ~5000 |
| Event handlers | ~5100+ |
| Apple color picker | ~5400-5700 |

---

## Naming Conventions to Use

**CSS Classes (Modified BEM):**
```
.c-component           /* Component block */
.c-component__element  /* Child element */
.c-component--modifier /* Variation */
.l-layout              /* Layout primitive */
.u-utility             /* Utility class */
```

**Data Attributes:**
```
data-action="toggle-editor"  /* What happens on click */
data-target="primary"        /* What it affects */
data-section="semantic"      /* Section identifier */
data-value="500"             /* Value to apply */
```

---

## Git Safety

- **Create a branch** before starting: `git checkout -b refactor/phase-1`
- **Commit after each successful task**
- **Don't force push**
- **Test before committing**

---

## Questions to Ask User

If you're unsure about any decision, ask the user. Key things that might need clarification:

1. Should we keep single-file structure or split into multiple files?
   - **Current answer: Keep single file for portability**

2. What's the priority order for phases?
   - **Current answer: Phase 1 first, in order**

3. How much visual testing is needed between changes?
   - **Suggest: Open in browser after each task, verify nothing broke**

---

## Success Criteria

After Phase 1 is complete:
- [ ] Design tokens defined in `:root`
- [ ] CSS organized with layer comments
- [ ] Single `.c-btn` class with variants instead of multiple button classes
- [ ] Single `.c-panel` class with variants instead of multiple panel classes
- [ ] Responsive breakpoints consistent (all use `min-width: 800px`)
- [ ] No visual regressions (UI looks identical)
- [ ] All interactions still work

---

## Contact/Context

This refactoring was planned in a previous conversation with Claude Opus. The full reasoning and specific consolidation targets are in `REFACTORING-PLAN.md`.

If the context seems lost or decisions seem unclear, refer back to that document or ask the user to clarify.

Good luck!
