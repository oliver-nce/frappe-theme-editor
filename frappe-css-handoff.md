# Frappe CSS Theming - Chat Handoff Document

## Overview

This document contains verified information about Frappe Framework's CSS variable system for theming purposes. Use this to continue development of the NCE Theme system.

---

## Frappe's Three Variable Systems

| System | Syntax | Location | Runtime Changeable |
|--------|--------|----------|-------------------|
| CSS Custom Properties | `--variable-name` | `css_variables.scss` | ✅ Yes |
| SCSS Variables | `$variable-name` | `desk/variables.scss` | ❌ No (compile-time) |
| LESS Variables | `@variable-name` | `variables.less` | ❌ No (legacy) |

---

## Source File Paths

```
frappe/public/scss/common/css_variables.scss   → Main CSS custom properties
frappe/public/scss/desk/variables.scss         → Desk SCSS variables
frappe/public/scss/website/variables.scss      → Website SCSS variables
frappe/public/less/variables.less              → Legacy LESS variables
frappe/public/scss/common/global.scss          → Global styles (checkboxes, etc.)
frappe/public/scss/common/indicator.scss       → Status indicator colors
```

---

## Verified CSS Custom Properties (css_variables.scss)

### Core Variables
```scss
:root,
[data-theme="light"] {
  --brand-color: #0089FF;
  --primary-color: #2490EF;
  --btn-height: 28px;
  --border-radius: 6px;
  --border-radius-lg: 12px;
  --border-radius-full: 999px;
}
```

### Pink Scale (Example of Color Naming)
```scss
--pink-900: #5B1E34;
--pink-800: #702440;
--pink-700: #8C2F53;
--pink-600: #A73966;
--pink-500: #C24478;
--pink-400: #D56D97;
--pink-300: #E496B5;
--pink-200: #F0BFD4;
--pink-100: #FAE8F0;
```

---

## Verified SCSS Variables (desk/variables.scss)

### Gray Scale
```scss
$gray-900: #1F272E;  // Primary text
$gray-800: #313B44;  // Dark text
$gray-700: #505A62;  // Secondary headings
$gray-600: #687178;  // Muted text, labels
$gray-500: #7C868E;  // Placeholder text
$gray-400: #98A1A8;  // Disabled text
$gray-300: #C0C6CC;  // Borders
$gray-200: #EBEEF0;  // Light borders
$gray-100: #F4F5F6;  // Backgrounds (control-bg)
$gray-50:  #F9FAFA;  // Page background

$primary: #2490EF;
$danger:  #E24C4C;
$black:   #000;
$white:   #fff;
```

---

## Verified LESS Variables (variables.less)

### Brand Colors
```less
@brand-primary: #2996F1;
@erpnext-blue: #2996F1;
@brand-gradient: linear-gradient(180deg, #2C9AF1 0%, #2490EF 100%);
@control-bg: #F4F5F6;
@checkbox-color: #3b99fc;
@border-radius: 6px;
```

### Status Label Backgrounds
```less
@label-success-bg: #cef5d6;
@label-info-bg: #e8ddff;
@label-warning-bg: #ffe6bf;
@label-danger-bg: #ffdcdc;
```

### Color Palette (light/standard/dark variants)
```less
// Red
@red-light: #ffc4c4;
@red: #ff5858;
@red-dark: #a83333;

// Yellow
@yellow-light: #fffce7;
@yellow: #ECAD0B;
@yellow-dark: #a58b00;

// Green
@green-light: #cef5d6;
@green: #98D85B;
@green-dark: #48a30f;

// Blue
@blue-light: #d3f8ff;
@blue: #5e64ff;
@blue-dark: #3b69d9;

// Orange
@orange-light: #ffd7bf;
@orange: #f8814f;
@orange-dark: #d45619;

// Purple
@purple-light: #e8ddff;
@purple: #743ee2;
@purple-dark: #5424b8;

// Cyan
@cyan-light: #d4f1ff;
@cyan: #449CF0;
@cyan-dark: #007cc2;

// Pink
@pink-light: #ffd2d2;
@pink: #f095a5;
@pink-dark: #a8586a;

// Darkgrey
@darkgrey-light: #c5c5c5;
@darkgrey: #b1bdca;
@darkgrey-dark: #48515b;
```

### Breakpoints
```less
@screen-xs: 767px;
@screen-sm: 991px;
```

---

## How Frappe Theming Works

1. Frappe adds `data-theme="THEME-NAME"` to the `<html>` element
2. CSS variables defined in `:root` and `[data-theme="light"]` selectors
3. Custom themes override using `[data-theme="your_theme"]` selector

### Theme Override Example
```scss
[data-theme="nce_custom"] {
  --primary-color: #FF5757;
  --brand-color: #FF5757;
  --blue-500: #FF5757;  // Note: name stays "blue" even with red value
}
```

---

## Important: Color Naming Issue

**Frappe uses literal color names, not semantic names.**

The variable `--pink-500` is always called "pink" regardless of what hex value you assign:

```scss
--pink-500: #00FF00;  // Still called "pink" even though it's green
```

### Implication for NCE Theme

Your theme compiler needs to:
1. Accept semantic tokens (primary, accent, success, etc.)
2. Map them to Frappe's literal color-named variables
3. Generate CSS that overrides Frappe's names with your values

---

## Creating a Custom Theme App

### 1. Create hooks.py entry
```python
app_include_css = "your_theme.bundle.css"
web_include_css = "your_theme.bundle.css"
```

### 2. Create CSS override file
```scss
[data-theme="your_theme"] {
  --primary-color: #YOUR_COLOR;
  // ... other overrides
}
```

### 3. Build assets
```bash
bench build --app your_app
```

---

## Existing Theme Apps (Reference)

- `github.com/Suvaidyam/frappe_theme` - UI configuration via DocType
- `github.com/tahir-zaqout/sundae_theme` - Multiple color scheme options
- `github.com/Midocean-Technologies/business_theme_v14` - Business theme

---

## Key Variables for NCE Theme Mapping

| Purpose | Frappe Variable | Default |
|---------|-----------------|---------|
| Primary actions | `--primary-color` | #2490EF |
| Brand identity | `--brand-color` | #0089FF |
| Primary text | `$gray-900` | #1F272E |
| Muted text | `$gray-600` | #687178 |
| Backgrounds | `$gray-100` / `--control-bg` | #F4F5F6 |
| Page background | `$gray-50` | #F9FAFA |
| Borders | `$gray-300` | #C0C6CC |
| Danger/Error | `$danger` | #E24C4C |
| Success bg | `@label-success-bg` | #cef5d6 |
| Warning bg | `@label-warning-bg` | #ffe6bf |
| Info bg | `@label-info-bg` | #e8ddff |
| Button height | `--btn-height` | 28px |
| Border radius | `--border-radius` | 6px |

---

## Notes

- Frappe v15 changed default colors from blue to more neutral/black tones
- CSS Custom Properties (`--var`) can be changed at runtime via JavaScript
- SCSS/LESS variables require rebuild (`bench build`)
- The `frappe_theme` app by Suvaidyam provides a DocType-based UI for theme configuration

---

*Document created: January 2026*
*Source: Frappe Framework GitHub repository analysis*
