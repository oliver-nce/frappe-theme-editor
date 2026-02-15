# Refactoring Plan: frappe-theme-editor.html

## Executive Summary

This plan addresses the structural problems in a ~6000 line single-file HTML/CSS/JS theme editor. The goal is to create a maintainable, extensible architecture while preserving single-file portability.

---

## 1. CSS Architecture

### Current Problems (Specific Examples)

| Problem | Example | Line(s) |
|---------|---------|---------|
| No layered structure | Reset (`* { margin: 0 }`) mixed with component styles | 9, scattered |
| Duplicate patterns | `.btn`, `.edit-btn`, `.picker-apply-btn` all define similar button properties independently | 115, 183, various |
| Inconsistent specificity | `.section-row .section:first-child` vs `#neutralGrid` | 74, 147 |
| Mixed responsive breakpoints | `@media (max-width: 800px)` and `@media (max-width: 600px)` | 88, 1090 |
| Wrong property in media query | `.section-row` uses CSS Grid but media query applies `flex-direction: column` | 88-91 |

### Proposed CSS Structure

Organize styles into clearly commented layers within the single `<style>` block:

```
/* ═══════════════════════════════════════════════════════════════
   LAYER 1: DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════ */
:root {
    /* Spacing scale */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;
    
    /* Border radii */
    --radius-sm: 4px;
    --radius-md: 6px;
    --radius-lg: 12px;
    
    /* Shadows (reusable) */
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.08);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.15);
    --shadow-lg: 0 8px 48px rgba(0,0,0,0.12);
    
    /* Typography */
    --font-size-xs: 10px;
    --font-size-sm: 12px;
    --font-size-md: 14px;
    --font-size-lg: 16px;
    
    /* Breakpoints (as reference) */
    /* --bp-mobile: 600px */
    /* --bp-tablet: 800px */
}

/* ═══════════════════════════════════════════════════════════════
   LAYER 2: RESET & BASE
   ═══════════════════════════════════════════════════════════════ */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { ... }

/* ═══════════════════════════════════════════════════════════════
   LAYER 3: LAYOUT PRIMITIVES
   ═══════════════════════════════════════════════════════════════ */
.l-page { ... }
.l-container { ... }
.l-grid-10 { display: grid; grid-template-columns: repeat(10, 1fr); gap: var(--space-sm); }
.l-flex-row { display: flex; gap: var(--space-md); }
.l-stack { display: flex; flex-direction: column; gap: var(--space-md); }

/* ═══════════════════════════════════════════════════════════════
   LAYER 4: COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
/* Each component is self-contained */

/* ═══════════════════════════════════════════════════════════════
   LAYER 5: UTILITIES
   ═══════════════════════════════════════════════════════════════ */
.u-hidden { display: none !important; }
.u-flex-1 { flex: 1; }
```

### Naming Convention: Modified BEM

```
.component                    /* Block */
.component__element           /* Element within block */
.component--modifier          /* Variation of block */
.component__element--modifier /* Variation of element */
```

**Consolidation targets:**

| Current (duplicated) | Proposed (consolidated) |
|---------------------|------------------------|
| `.btn`, `.edit-btn`, `.picker-apply-btn` | `.c-btn`, `.c-btn--primary`, `.c-btn--small` |
| `.editor-panel`, `.neutral-picker-panel` | `.c-panel`, `.c-panel--editor` |
| `.hue-slider`, `.sat-slider-picker`, `.offset-slider` | `.c-slider`, `.c-slider--hue`, `.c-slider--sat` |
| `.swatch-picker-dropdown`, `.styled-menu-dropdown`, `.gray-picker-dropdown` | `.c-dropdown` |

### Responsive Strategy

Use a single breakpoint system with mobile-first approach:

```css
/* Base styles (mobile) */
.l-section-row {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}

/* Tablet and up */
@media (min-width: 800px) {
    .l-section-row {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        column-gap: var(--space-lg);
    }
}
```

---

## 2. HTML Scaffold

### Current Problems

| Problem | Example | Why it's bad |
|---------|---------|--------------|
| Unclear hierarchy | `.page-wrapper` > `.container` relationship undefined | Hard to reason about nesting |
| Multi-purpose classes | `.section` used for color panels, button controls, frappe settings | No semantic meaning |
| ID-heavy markup | `#primaryGrid`, `#editor-primary`, `#textFlipButtons` | Tight coupling, non-reusable |
| Inline styles | `style="display: flex; gap: 16px;"` throughout | Unmaintainable |

### Proposed Container Hierarchy

```html
<body>
  <div class="l-page">
    
    <!-- REGION: Header -->
    <header class="c-header">
      <div class="c-header__brand">...</div>
      <nav class="c-header__actions">...</nav>
    </header>
    
    <!-- REGION: Main Content -->
    <main class="l-container">
      
      <!-- TAB: Core Theme -->
      <div class="c-tab-panel" data-tab="core">
        
        <!-- SECTION: Primary Colors -->
        <section class="c-section" data-section="primary">
          <header class="c-section__header">
            <h2 class="c-section__title">Primary Colors</h2>
            <button class="c-btn c-btn--small" data-action="toggle-editor" data-target="primary">Edit</button>
          </header>
          <div class="c-color-grid" data-grid="primary"></div>
          <div class="c-panel c-panel--editor" data-editor="primary" hidden>...</div>
        </section>
        
        <!-- SECTION: Row with multiple panels -->
        <div class="l-section-row">
          <section class="c-section" data-section="semantic" data-span="3">...</section>
          <section class="c-section" data-section="window" data-span="3">...</section>
          <section class="c-section" data-section="backgrounds" data-span="4">...</section>
        </div>
        
      </div>
      
      <!-- TAB: Frappe Settings -->
      <div class="c-tab-panel" data-tab="frappe" hidden>...</div>
      
    </main>
    
  </div>
  
  <!-- REGION: Modal (portal) -->
  <div class="c-modal" data-modal="root" hidden>...</div>
  
</body>
```

### Reusable Component Patterns

**1. Panel (`.c-panel`)**
```html
<div class="c-panel c-panel--editor" data-editor="primary">
  <button class="c-panel__close" data-action="close-panel">&times;</button>
  <div class="c-panel__content">...</div>
</div>
```

**2. Color Swatch (`.c-swatch`)**
```html
<div class="c-swatch c-swatch--clickable" data-swatch="primary-500">
  <div class="c-swatch__color" style="--swatch-color: var(--primary-500)"></div>
  <div class="c-swatch__label">primary-500</div>
  <div class="c-swatch__hex">#4198F0</div>
</div>
```

**3. Dropdown (`.c-dropdown`)**
```html
<div class="c-dropdown" data-dropdown="page-bg">
  <button class="c-dropdown__trigger" data-action="toggle-dropdown">
    <span class="c-dropdown__value">neutral-100</span>
    <span class="c-dropdown__arrow">▼</span>
  </button>
  <div class="c-dropdown__menu" hidden>
    <button class="c-dropdown__option" data-value="neutral-50">neutral-50</button>
    <button class="c-dropdown__option" data-value="neutral-100">neutral-100</button>
  </div>
</div>
```

**4. Button Group (`.c-btn-group`)**
```html
<div class="c-btn-group" data-group="shade-select">
  <button class="c-btn c-btn--toggle" data-value="50">50</button>
  <button class="c-btn c-btn--toggle is-active" data-value="100">100</button>
  <button class="c-btn c-btn--toggle" data-value="200">200</button>
</div>
```

### Key Principle: Data Attributes for JS Targeting

Instead of IDs, use `data-*` attributes:
- `data-action="toggle-editor"` - What this element does when clicked
- `data-target="primary"` - What it targets
- `data-section="semantic"` - Section identifier
- `data-swatch="primary-500"` - Swatch identifier

This decouples styling (classes) from behavior (data attributes).

---

## 3. JavaScript Organization

### Current Problems

| Problem | Example | Why it's bad |
|---------|---------|--------------|
| Global scope pollution | `function toggleEditor()`, `const state = {}` | Name collisions, hard to test |
| Inline handlers | `onclick="toggleEditor('primary')"` | Invisible dependencies |
| Scattered DOM queries | `document.getElementById()` everywhere | No caching, brittle |
| Mixed concerns | `updateUI()` does color calc + DOM update + CSS variable setting | Hard to debug |

### Proposed Module Pattern

```javascript
const ThemeEditor = (function() {
    'use strict';
    
    // ═══════════════════════════════════════════════════════════════
    // PRIVATE: Configuration (immutable)
    // ═══════════════════════════════════════════════════════════════
    const CONFIG = Object.freeze({
        primaryShades: [ ... ],
        neutralShades: [ ... ],
        breakpoints: { mobile: 600, tablet: 800 }
    });
    
    // ═══════════════════════════════════════════════════════════════
    // PRIVATE: State
    // ═══════════════════════════════════════════════════════════════
    let state = { ... };
    
    // ═══════════════════════════════════════════════════════════════
    // PRIVATE: DOM Cache
    // ═══════════════════════════════════════════════════════════════
    const dom = {
        root: null,
        grids: {},
        panels: {},
        init() {
            this.root = document.querySelector('.l-page');
            this.grids.primary = this.root.querySelector('[data-grid="primary"]');
            this.grids.neutral = this.root.querySelector('[data-grid="neutral"]');
            // ... cache all frequently accessed elements
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // PRIVATE: Color Utilities (pure functions)
    // ═══════════════════════════════════════════════════════════════
    const Color = {
        hslToHex(h, s, l) { ... },
        hexToHSL(hex) { ... },
        getContrastText(hex) { ... }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // PRIVATE: State Management
    // ═══════════════════════════════════════════════════════════════
    const State = {
        get(key) { return state[key]; },
        set(key, value) {
            const old = state[key];
            state[key] = value;
            Events.emit('state:change', { key, old, value });
        },
        getAll() { return { ...state }; }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // PRIVATE: Event Bus
    // ═══════════════════════════════════════════════════════════════
    const Events = {
        listeners: {},
        on(event, fn) { ... },
        off(event, fn) { ... },
        emit(event, data) { ... }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // PRIVATE: UI Renderers (pure DOM updates)
    // ═══════════════════════════════════════════════════════════════
    const Render = {
        primaryGrid() { ... },
        neutralGrid() { ... },
        swatchPicker(target, options) { ... },
        updateCSSVariables() { ... }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // PRIVATE: Action Handlers
    // ═══════════════════════════════════════════════════════════════
    const Actions = {
        toggleEditor(target) { ... },
        selectSwatch(swatch) { ... },
        setShade(shade) { ... },
        exportTheme() { ... }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // PRIVATE: Event Delegation
    // ═══════════════════════════════════════════════════════════════
    function handleClick(e) {
        const action = e.target.closest('[data-action]');
        if (!action) return;
        
        const actionName = action.dataset.action;
        const target = action.dataset.target;
        
        switch (actionName) {
            case 'toggle-editor': Actions.toggleEditor(target); break;
            case 'select-swatch': Actions.selectSwatch(target); break;
            case 'toggle-dropdown': Actions.toggleDropdown(action); break;
            // ... 
        }
    }
    
    // ═══════════════════════════════════════════════════════════════
    // PUBLIC: API
    // ═══════════════════════════════════════════════════════════════
    return {
        init() {
            dom.init();
            document.addEventListener('click', handleClick);
            Events.on('state:change', Render.updateCSSVariables);
            Render.primaryGrid();
            Render.neutralGrid();
        },
        getState: State.getAll,
        setState: State.set,
        // Expose only what's needed
    };
})();

// Single initialization
document.addEventListener('DOMContentLoaded', ThemeEditor.init);
```

### Event Delegation Strategy

**Single delegated listener** on document or container:

```javascript
// Instead of: onclick="toggleEditor('primary')"
// Use: data-action="toggle-editor" data-target="primary"

document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-action]');
    if (!trigger) return;
    
    const { action, target, value } = trigger.dataset;
    
    // Route to handler
    if (ActionHandlers[action]) {
        ActionHandlers[action](target, value, e);
    }
});
```

### State Management

Simple observable pattern:

```javascript
const State = {
    _data: { ... },
    _listeners: [],
    
    get(key) { 
        return this._data[key]; 
    },
    
    set(key, value) {
        const old = this._data[key];
        this._data[key] = value;
        this._notify({ key, old, value });
    },
    
    subscribe(fn) {
        this._listeners.push(fn);
        return () => this._listeners = this._listeners.filter(l => l !== fn);
    },
    
    _notify(change) {
        this._listeners.forEach(fn => fn(change));
    }
};
```

---

## 4. Migration Strategy

### Phase 1: CSS Consolidation (Low Risk)

**Order:**
1. Add design tokens at top of `<style>` block
2. Replace hardcoded values with token references (find/replace)
3. Add layer comments to organize existing styles
4. Consolidate duplicate button styles into `.c-btn` variants
5. Consolidate duplicate panel styles into `.c-panel` variants
6. Fix responsive breakpoint inconsistency

**Test:** Visual regression - screenshots before/after each change

### Phase 2: HTML Data Attributes (Low Risk)

**Order:**
1. Add `data-action` attributes alongside existing `onclick` handlers
2. Add `data-target` attributes to identify targets
3. Leave inline handlers in place (both will work)

**Test:** All interactions still function

### Phase 3: JavaScript Module (Medium Risk)

**Order:**
1. Create the module wrapper (IIFE)
2. Move CONFIG and DEFAULT_STATE inside module
3. Create dom cache object
4. Create event delegation handler
5. One by one, move functions into module, remove inline handlers
6. Test each function after moving

**Test:** Full interaction test after each function migration

### Phase 4: HTML Semantic Cleanup (Medium Risk)

**Order:**
1. Replace `.section` with semantic `<section>` + `.c-section`
2. Replace ID-based queries with data-attribute queries
3. Remove IDs that are only used for JS targeting
4. Convert inline styles to utility classes

**Test:** Full UI test

### Phase 5: Final Cleanup (Low Risk)

1. Remove dead code
2. Consolidate remaining duplicate styles
3. Add JSDoc comments
4. Create component documentation

### High-Risk Areas to Test Carefully

| Area | Risk | Why |
|------|------|-----|
| Color picker (Apple grid) | High | Complex mouse/click interactions |
| Theme export/import | High | Serialization must match exactly |
| Shade offset/anchor system | High | Complex state dependencies |
| Dropdown menus | Medium | Click-outside handling |
| Tab switching | Low | Simple show/hide |

---

## 5. File Structure Decision

### Recommendation: Keep Single File

**Reasons:**
1. **Portability** - Can be opened directly in browser, emailed, shared
2. **No build step** - Works immediately
3. **Context** - Everything visible in one place for small team

**Mitigation for size:**
- Clear layer/section comments act as virtual file boundaries
- Code folding in editors helps navigation
- Module pattern keeps JS organized

### Alternative (if team grows)

```
frappe-theme-editor/
├── index.html          # Minimal HTML shell
├── styles/
│   ├── tokens.css      # Design tokens
│   ├── base.css        # Reset, body
│   ├── layout.css      # Grid, containers
│   └── components.css  # All components
├── scripts/
│   ├── config.js       # CONFIG, DEFAULT_STATE
│   ├── color.js        # Color utilities
│   ├── state.js        # State management
│   ├── render.js       # DOM renderers
│   └── main.js         # Init, event delegation
└── build.sh            # Concatenate back to single file
```

---

## Summary: What Improves and Why

| Change | What it fixes | Result |
|--------|---------------|--------|
| Design tokens | Hardcoded values everywhere | Single source of truth |
| BEM naming | Unclear relationships | Self-documenting selectors |
| CSS layers | Random ordering | Predictable cascade |
| Layout primitives | Mixed grid/flex/none | Consistent layout tools |
| Component consolidation | 3+ button styles | One extensible button |
| Data attributes | ID coupling | Reusable components |
| Semantic HTML | `<div>` soup | Accessible, meaningful |
| Module pattern | Global pollution | Encapsulated, testable |
| Event delegation | Inline handlers | Centralized, traceable |
| State management | Direct mutation | Observable, debuggable |
| Phased migration | Big bang rewrite | Safe, incremental progress |
