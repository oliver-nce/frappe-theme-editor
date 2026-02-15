# Refactoring Plan Request: frappe-theme-editor.html

## Context

I have a single-file HTML/CSS/JS admin tool for designing color themes. It has grown organically over many iterations and now suffers from structural problems that make it difficult to maintain, debug, and extend.

The file is `frappe-theme-editor.html` (~6000 lines).

## Current Architecture Problems

### 1. CSS Organization (Lines 1-1811)

**Problem: No separation of concerns**
- All styles are in one monolithic `<style>` block
- Layout rules are mixed with component styles
- Utility classes are scattered throughout
- No consistent naming convention

**Problem: Duplicate and overlapping selectors**
- `.btn` and `.edit-btn` both define the same base button properties independently
- `.editor-panel` and `.neutral-picker-panel` repeat identical shadow/border/background rules
- Multiple slider styles (`.hue-slider`, `.offset-slider`, `.sat-slider-picker`) share common track/thumb patterns but are written separately

**Problem: Specificity conflicts**
- Some selectors use element context (`.section-row .section:first-child`)
- Others use IDs (`#neutralGrid`, `#semanticGrid`)
- Results in unpredictable cascade behavior

**Problem: Inconsistent responsive strategy**
- Some components use `@media (max-width: 800px)`
- Others use `@media (max-width: 600px)`
- The `.section-row` uses CSS Grid but the media query tries to apply `flex-direction: column` (wrong property for grid)

### 2. HTML Structure (Lines 1813-3190)

**Problem: No clear container hierarchy**
- `.page-wrapper` contains `.container` but the relationship is unclear
- `.section` is used for multiple purposes (color panels, button controls, frappe settings)
- Nesting depth varies inconsistently

**Problem: Mixed layout approaches**
- `.section-row` uses a 10-column grid with `nth-child` selectors for column spans
- Other areas use flexbox
- Some use no explicit layout system at all

**Problem: ID-heavy markup**
- Many elements have IDs for JS targeting (`#primaryGrid`, `#editor-primary`, `#textFlipButtons`)
- Makes components non-reusable
- Creates tight coupling between HTML and JS

### 3. JavaScript (Lines 3191-6064)

**Problem: Global scope pollution**
- Functions like `toggleEditor()`, `setDefaultShade()`, `updateUI()` are all global
- State object is global
- CONFIG is global

**Problem: Inline event handlers**
- HTML contains `onclick="toggleEditor('primary')"` style handlers
- Makes it hard to track what triggers what

**Problem: DOM manipulation scattered throughout**
- `document.getElementById()` calls everywhere
- No centralized DOM reference management
- `innerHTML` used to build complex UI (brittle, XSS-prone)

## What I Need From You

Please produce a **refactoring plan** (not code) that addresses:

1. **CSS Architecture**
   - Propose a layered structure (tokens → reset → layout → components → utilities)
   - Identify which current styles should be consolidated
   - Recommend a naming convention (BEM or similar)
   - Define a responsive breakpoint strategy

2. **HTML Scaffold**
   - Propose a clear container hierarchy with named regions
   - Define reusable component patterns (panel, swatch, button group, editor drawer)
   - Suggest semantic structure improvements

3. **JavaScript Organization**
   - Propose a module or namespace pattern to eliminate globals
   - Suggest an event delegation strategy
   - Recommend a state management approach

4. **Migration Strategy**
   - What order should changes be made?
   - How can we refactor incrementally without breaking functionality?
   - What are the high-risk areas to test carefully?

5. **File Structure** (optional consideration)
   - Should this remain a single file for portability?
   - Or would splitting into CSS/JS files be worth it?

Please be specific about WHAT is wrong and WHY each proposed change improves the situation. Reference specific class names and patterns from the current code where relevant.