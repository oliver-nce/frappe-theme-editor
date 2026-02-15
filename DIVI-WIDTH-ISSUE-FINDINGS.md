# Divi Theme Width Constraint Issue - Investigation Summary

**Date:** January 9, 2026  
**Project:** NCE Klaviyo Manager - Task Runner Dashboard  
**Issue:** Layout constrained to ~288px width instead of full-width on Divi WordPress sites

---

## Problem Description

The Klaviyo Manager page (https://ncesoccer.com/klaviyo-manager/) displays at only **287.6875px width** instead of full viewport width (1132px), despite using `.layout-simple` class which should enable full-width layout.

---

## Environment Details

- **Site:** ncesoccer.com
- **Theme:** Divi (WP Engine hosted)
- **Page Template:** Blank Page (page-template-page-template-blank-php)
- **Body Classes:** `wp-singular page-template et_pb_gutters1 et_full_width_page et_divi_theme`
- **CSS File:** `core-hue-system.css` loaded from `/wp-content/wp-custom-scripts/NCE-Design-System/dist/`

---

## HTML Structure

```html
<body class="wp-singular page-template ... et_pb_gutters1 ...">
    <div class="dashboard-wrapper layout-simple">
        <div class="dashboard-window">
            <div class="dashboard-body">
                <!-- Task grid content -->
            </div>
        </div>
    </div>
</body>
```

---

## Key Findings

### 1. **CSS Specificity War**
- Base CSS sets: `body { align-items: center }` which centers/constrains content
- `.layout-simple` class intended to override with `align-self: stretch` and `width: 100%`
- WordPress **strips the `body.layout-simple-page` class** from HTML, so body-level overrides don't work

### 2. **Divi Theme Override Attempt**
Added Divi-specific override:
```css
body[class*="et_pb"] .layout-simple,
body.et-db .layout-simple {
    max-width: 100% !important;
    width: 100% !important;
}
```
**Result:** Rule is loaded and present in CSS, but **still not working** - width remains 287.6875px

### 3. **Computed Styles**
```javascript
getComputedStyle(document.querySelector('.dashboard-wrapper')).width
// Returns: "287.6875px"

getComputedStyle(document.querySelector('.layout-simple')).alignSelf
// Returns: "stretch" ✅ (this works)

getComputedStyle(document.body).alignItems
// Returns: "center" ❌ (Divi's body flexbox is centering content)
```

### 4. **Width Propagation**
All containers inherit the same narrow width:
```javascript
{
  wrapper: 288px,
  window: 288px,
  body: 288px,
  viewport: 1132px
}
```

### 5. **Comparison with Working Page**
- Another page on the same site (Task Configuration table) displays **full-width correctly**
- **Key difference:** That page uses a `<table>` element instead of `.dashboard-wrapper` flexbox
- Tables naturally expand to content width and bypass Divi's flex constraints

---

## CSS Attempts Made

### Attempt 1: Add `align-self: stretch`
```css
.layout-simple {
    align-self: stretch;
    width: 100%;
    max-width: 100%;
}
```
**Result:** `align-self` works, but width still constrained ❌

### Attempt 2: Divi-specific override with `!important`
```css
body[class*="et_pb"] .layout-simple {
    width: 100% !important;
    max-width: 100% !important;
}
```
**Result:** Rule loads but doesn't affect computed width ❌

---

## Console Debugging Commands Used

```javascript
// Check if CSS is loaded
[...document.querySelectorAll('link[rel="stylesheet"]')].map(l => l.href).filter(h => h.includes('core-hue'))

// Check computed styles
getComputedStyle(document.querySelector('.dashboard-wrapper')).width
getComputedStyle(document.body).alignItems

// Find width constraints
[...document.styleSheets].flatMap(s => { 
  try { return [...s.cssRules] } catch(e) { return [] }
}).filter(r => r.selectorText?.includes('et_pb') && r.selectorText?.includes('layout-simple'))

// Manual override test (THIS WORKS!)
document.body.style.alignItems = 'stretch'
document.querySelector('.dashboard-wrapper').style.width = '100vw'
```

---

## What Works (Manual Override)

When manually setting via JavaScript console:
```javascript
document.body.style.alignItems = 'stretch'
document.querySelector('.layout-simple').style.width = '100vw'
```
**Result:** Layout expands to full width immediately ✅

This proves the issue is **CSS specificity/cascade**, not a structural problem.

---

## Suspected Root Cause

Divi theme applies extremely specific CSS rules to `body` and containers with `et_pb_*` classes that:
1. Set `body { display: flex; align-items: center }` 
2. Apply width constraints to child elements
3. Use high specificity or late-loaded stylesheets that override our CSS
4. May use inline styles or JavaScript-injected styles

Even with `!important`, our CSS is being overridden by Divi's more specific selectors or later-loaded styles.

---

## Recommended Solutions

### Option A: Inline Styles (Guaranteed to work)
Add inline styles directly to HTML:
```html
<body style="align-items: stretch !important;">
    <div class="dashboard-wrapper layout-simple" style="width: 100vw !important; max-width: 100vw !important;">
```

### Option B: JavaScript Injection
Add to page `<script>`:
```javascript
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.alignItems = 'stretch';
    document.querySelector('.dashboard-wrapper').style.setProperty('width', '100vw', 'important');
});
```

### Option C: Ultra-Specific CSS Override
Try even MORE specific selector:
```css
body.wp-singular.page-template.et_pb_gutters1 .dashboard-wrapper.layout-simple {
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
}
```

### Option D: Redesign Without Flexbox Wrapper
Use table-based layout like the working Task Configuration page, which naturally expands and bypasses Divi constraints.

---

## Files Modified

- `/Users/oliver2/_NCE_CSS/NCE-Design-System/dist/core-hue-system.css`
  - Added `align-self: stretch` to `.layout-simple` (line ~412)
  - Added Divi override rules (lines ~418-422)

---

## Next Steps

1. Try inline styles or JavaScript injection (most reliable)
2. Or investigate Divi's actual CSS file to find the exact rule blocking width
3. Or redesign page structure to avoid flexbox constraints (use table/grid layout)
4. Consider creating standalone HTML that doesn't load Divi theme styles

---

## Contact

For questions about this investigation, refer to the debugging session on January 9, 2026.
