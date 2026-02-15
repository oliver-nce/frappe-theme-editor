# Frappe CSS Research: Application Points Deep Dive

**Research Date:** January 10, 2026  
**Purpose:** Document Frappe UI elements for NCE Design System integration

---

## Executive Summary

Frappe uses a **hybrid CSS system**:
- Bootstrap 4 base classes (buttons, modals, grid)
- Custom CSS variables for theming
- Component-specific selectors (`.frappe-control`, `.indicator`, etc.)
- Tailwind CSS in newer versions (v16+) and Frappe UI

**Key Finding:** Frappe's theming is fragmented across multiple systems. Your NCE Design System can unify this.

---

## Application Point 1: Form View

### CSS Selectors & Classes

| Element | Selector | Style Properties |
|---------|----------|------------------|
| Form wrapper | `.frappe-control` | Container for each field |
| Field label | `.control-label` | Typography, color |
| Field input | `.control-input` | Border, background, focus |
| Required indicator | `.reqd` | Color (typically red asterisk) |
| Section break | `.section-break` | Background, border, padding |
| Column break | `.column-break` | Gap/gutter spacing |
| Tab break | `.form-tabs` | Active/inactive states |
| Read-only field | `.like-disabled-input` | Background, text color |
| HTML field | `.html-field` | Full CSS control |

### NCE Style Specs Needed

```json
"form": {
  "fieldLabel": { "color": "neutral-700", "fontWeight": 500 },
  "fieldInput": { 
    "background": "white",
    "border": "neutral-300",
    "focusBorder": "primary-500",
    "focusRing": "primary-100"
  },
  "requiredIndicator": { "color": "error-600" },
  "sectionHeader": { 
    "background": "neutral-50",
    "border": "neutral-200",
    "textColor": "neutral-800"
  },
  "readOnlyField": { "background": "neutral-50", "textColor": "neutral-600" }
}
```

---

## Application Point 2: List View

### CSS Selectors & Classes

| Element | Selector | Style Properties |
|---------|----------|------------------|
| List container | `.frappe-list` | Container styling |
| Header row | `.list-row-head` | Background, typography |
| Data row | `.list-row` | Background, hover, borders |
| Row hover | `.list-row:hover` | Background change |
| Selected row | `.list-row.selected` | Background highlight |
| Checkbox column | `.list-row-checkbox` | Checkbox styling |
| Action buttons | `.list-actions` | Button group styling |

### List View JavaScript API

```javascript
frappe.listview_settings['DocType'] = {
  get_indicator: function(doc) {
    // Returns: [label, color, filter]
    return ["Draft", "orange", "status,=,Draft"];
  },
  formatters: {
    fieldname: function(val) {
      return `<span class="custom-class">${val}</span>`;
    }
  }
};
```

### NCE Style Specs Needed

```json
"list": {
  "headerBackground": "neutral-100",
  "headerText": "neutral-700",
  "rowBackground": "white",
  "rowAlternate": "neutral-50",
  "rowHover": "primary-50",
  "rowSelected": "primary-100",
  "rowBorder": "neutral-200"
}
```

---

## Application Point 3: Status Indicators

### Frappe's Built-in Indicator Colors

| Color Name | CSS Class | Hex Value | Typical Use |
|------------|-----------|-----------|-------------|
| `blue` | `.indicator.blue` | `#5e64ff` | Draft, In Progress |
| `green` | `.indicator.green` | `#98d85b` | Submitted, Active, Paid |
| `red` | `.indicator.red` | `#ff5858` | Cancelled, Failed, Overdue |
| `orange` | `.indicator.orange` | `#ffa00a` | Pending, On Hold |
| `purple` | `.indicator.purple` | `#743ee2` | Custom status |
| `darkgrey` | `.indicator.darkgrey` | `#b8c2cc` | Disabled, Closed |
| `yellow` | `.indicator.yellow` | (varies) | Warning states |
| `light-blue` | `.indicator.light-blue` | (varies) | Info states |

### DocStatus Mapping

| docstatus | Label | Recommended Color |
|-----------|-------|-------------------|
| 0 | Draft | `orange` or `blue` |
| 1 | Submitted | `green` |
| 2 | Cancelled | `red` |

### NCE Style Specs Needed

```json
"indicators": {
  "draft": { "background": "warning-100", "text": "warning-800", "dot": "warning-500" },
  "submitted": { "background": "success-100", "text": "success-800", "dot": "success-500" },
  "cancelled": { "background": "error-100", "text": "error-800", "dot": "error-500" },
  "pending": { "background": "warning-100", "text": "warning-700", "dot": "warning-400" },
  "active": { "background": "success-100", "text": "success-700", "dot": "success-500" },
  "info": { "background": "primary-100", "text": "primary-700", "dot": "primary-500" }
}
```

---

## Application Point 4: Buttons

### Frappe/Bootstrap Button Classes

| Class | Use Case | Default Color |
|-------|----------|---------------|
| `.btn-primary` | Primary action | Blue |
| `.btn-secondary` | Secondary action | Gray |
| `.btn-default` | Standard button | Light gray |
| `.btn-danger` | Destructive action | Red |
| `.btn-success` | Positive action | Green |
| `.btn-warning` | Caution action | Yellow/Orange |
| `.btn-lg` | Large button | Size modifier |
| `.btn-sm` | Small button | Size modifier |
| `.btn-xs` | Extra small | Size modifier |

### NCE Style Specs Needed

```json
"buttons": {
  "primary": {
    "background": "primary-600",
    "text": "white",
    "hoverBackground": "primary-700",
    "activeBackground": "primary-800"
  },
  "secondary": {
    "background": "primary-100",
    "text": "primary-700",
    "hoverBackground": "primary-200"
  },
  "default": {
    "background": "neutral-100",
    "text": "neutral-700",
    "border": "neutral-300",
    "hoverBackground": "neutral-200"
  },
  "danger": {
    "background": "error-600",
    "text": "white",
    "hoverBackground": "error-700"
  },
  "success": {
    "background": "success-600",
    "text": "white",
    "hoverBackground": "success-700"
  }
}
```

---

## Application Point 5: Dialogs & Modals

### CSS Selectors & Classes

| Element | Selector | Style Properties |
|---------|----------|------------------|
| Modal overlay | `.modal-backdrop` | Background opacity |
| Modal dialog | `.modal-dialog` | Width, positioning |
| Modal content | `.modal-content` | Background, border, shadow |
| Modal header | `.modal-header` | Background, border-bottom |
| Modal title | `.modal-title` | Typography |
| Modal body | `.modal-body` | Padding, content |
| Modal footer | `.modal-footer` | Background, button alignment |
| Close button | `.close` | Icon styling |

### NCE Style Specs Needed

```json
"modals": {
  "overlay": { "background": "rgba(0,0,0,0.5)" },
  "container": {
    "background": "white",
    "borderRadius": "8px",
    "shadow": "0 10px 40px rgba(0,0,0,0.2)"
  },
  "header": {
    "background": "neutral-50",
    "borderBottom": "neutral-200",
    "textColor": "neutral-900"
  },
  "body": { "textColor": "neutral-700" },
  "footer": { "background": "neutral-50", "borderTop": "neutral-200" }
}
```

---

## Application Point 6: Navigation (Navbar, Sidebar, Awesomebar)

### CSS Selectors & Classes

| Element | Selector | Style Properties |
|---------|----------|------------------|
| Navbar | `.navbar` | Background, height |
| Navbar brand | `.navbar-brand` | Logo area |
| Sidebar | `.desk-sidebar` | Background, width |
| Sidebar item | `.sidebar-item` | Text, hover, active |
| Active sidebar item | `.sidebar-item.active` | Background, text |
| Awesomebar | `.awesomplete` | Search input styling |
| Awesomebar results | `.awesomplete > ul` | Dropdown styling |
| Breadcrumbs | `.breadcrumb` | Navigation path |

### NCE Style Specs Needed

```json
"navigation": {
  "navbar": {
    "background": "neutral-900",
    "text": "white",
    "iconColor": "neutral-400"
  },
  "sidebar": {
    "background": "neutral-50",
    "itemText": "neutral-700",
    "itemHover": "primary-50",
    "itemActive": "primary-100",
    "itemActiveText": "primary-700",
    "moduleIcon": "primary-500"
  },
  "awesomebar": {
    "background": "white",
    "border": "neutral-300",
    "focusBorder": "primary-500",
    "resultsBackground": "white",
    "resultHover": "primary-50"
  },
  "breadcrumb": {
    "text": "neutral-500",
    "linkText": "primary-600",
    "separator": "neutral-400"
  }
}
```

---

## Application Point 7: Workspace Components

### CSS Selectors & Classes

| Element | Selector | Style Properties |
|---------|----------|------------------|
| Workspace container | `.workspace` | Layout |
| Shortcut card | `.workspace .shortcut` | Background, text |
| Shortcut count | `.shortcut-count` | Badge styling |
| Link card | `.widget` | Card container |
| Number card | `.number-card` | KPI display |
| Quick list | `.quick-list` | Recent items |

### NCE Style Specs Needed

```json
"workspace": {
  "shortcutCard": {
    "background": "white",
    "border": "neutral-200",
    "hoverBorder": "primary-300",
    "text": "neutral-800",
    "countBadge": {
      "background": "primary-100",
      "text": "primary-700"
    }
  },
  "numberCard": {
    "background": "white",
    "valueColor": "neutral-900",
    "labelColor": "neutral-600",
    "trendPositive": "success-600",
    "trendNegative": "error-600"
  },
  "linkCard": {
    "background": "white",
    "headerBackground": "neutral-50",
    "headerText": "neutral-800",
    "linkText": "primary-600",
    "linkHover": "primary-700"
  }
}
```

---

## Application Point 8: Child Tables (Grids)

### CSS Selectors & Classes

| Element | Selector | Style Properties |
|---------|----------|------------------|
| Grid container | `.frappe-control[data-fieldtype="Table"]` | Container |
| Grid header | `.grid-heading-row` | Header row |
| Grid row | `.grid-row` | Data row |
| Grid row edited | `.grid-row.edited` | Modified indicator |
| Add row button | `.grid-add-row` | Button styling |
| Remove row | `.grid-delete-row` | Delete icon |

### NCE Style Specs Needed

```json
"childTable": {
  "headerBackground": "neutral-100",
  "headerText": "neutral-700",
  "rowBackground": "white",
  "rowAlternate": "neutral-50",
  "rowEdited": "warning-50",
  "rowBorder": "neutral-200",
  "addButton": {
    "background": "primary-50",
    "text": "primary-600",
    "hoverBackground": "primary-100"
  }
}
```

---

## Application Point 9: Reports

### Report Types & Styling

| Type | Customization Method |
|------|---------------------|
| Query Report | `formatter` function in JS |
| Script Report | Full HTML/CSS control |
| Report Builder | Limited via CSS overrides |

### CSS Selectors

| Element | Selector | Style Properties |
|---------|----------|------------------|
| Report table | `.report-table` | Table styling |
| Report header | `.report-table th` | Header cells |
| Report cell | `.report-table td` | Data cells |
| Total row | `.report-table .total-row` | Summary row |

### NCE Style Specs Needed

```json
"reports": {
  "table": {
    "headerBackground": "neutral-100",
    "headerText": "neutral-800",
    "cellBackground": "white",
    "cellText": "neutral-700",
    "cellBorder": "neutral-200",
    "totalRowBackground": "neutral-100",
    "totalRowText": "neutral-900",
    "totalRowFontWeight": 600
  },
  "chart": {
    "colors": ["primary-500", "primary-300", "primary-700", "neutral-400"]
  }
}
```

---

## Application Point 10: Print Formats

### Styling Methods

1. **Print Format Builder** - Drag-drop, limited styling
2. **Custom CSS field** - Per-format CSS
3. **Print Style DocType** - Global print CSS

### Key CSS Considerations

| Element | Selector | Notes |
|---------|----------|-------|
| Print container | `@media print` | Print-specific rules |
| Header | `.print-heading` | Document title |
| Body | `.print-format` | Main content |
| Table | `.print-table` | Item tables |
| Footer | `.print-footer` | Page footer |

### NCE Style Specs Needed

```json
"print": {
  "pageBackground": "white",
  "textColor": "neutral-900",
  "heading": {
    "color": "primary-700",
    "fontWeight": 700
  },
  "table": {
    "headerBackground": "neutral-100",
    "headerText": "neutral-800",
    "cellBorder": "neutral-300",
    "alternateRow": "neutral-50"
  },
  "footer": {
    "textColor": "neutral-500",
    "borderTop": "neutral-300"
  }
}
```

---

## Application Point 11: Web Pages & Portal

### CSS Variables (Website Theme)

Frappe uses SCSS/Bootstrap variables for website theming:

```scss
$primary: #your-color;
$spacer: 1rem;
// Bootstrap 4 variables
```

### CSS Selectors

| Element | Selector | Style Properties |
|---------|----------|------------------|
| Web form header | `.web-form-header` | Header styling |
| Web form body | `.web-form` | Form container |
| Portal navbar | `.web-navbar` | Navigation |
| Portal card | `.card` | Content cards |
| Portal button | `.btn` | Bootstrap buttons |

### NCE Style Specs Needed

```json
"webPortal": {
  "pageBackground": "neutral-50",
  "cardBackground": "white",
  "cardBorder": "neutral-200",
  "navbarBackground": "primary-700",
  "navbarText": "white",
  "formHeader": {
    "background": "primary-50",
    "border": "primary-200",
    "textColor": "primary-800"
  }
}
```

---

## Application Point 12: Specialized Views (Kanban, Calendar, Gantt)

### Kanban Board

| Element | Selector | Style Properties |
|---------|----------|------------------|
| Kanban container | `.kanban-board` | Container |
| Kanban column | `.kanban-column` | Column styling |
| Kanban card | `.kanban-card` | Card styling |
| Column header | `.kanban-column-header` | Header |

### Calendar View

Configured via `{doctype}_calendar.js`:

```javascript
frappe.views.calendar['DocType'] = {
  style_map: {
    'Public': 'success',
    'Private': 'info'
  }
};
```

### Gantt Chart (CSS Variables)

```css
:root {
  --g-bar-color: var(--primary-500);
  --g-bar-border: var(--primary-600);
  --g-progress-color: var(--primary-700);
  --g-header-background: var(--neutral-100);
  --g-row-color: var(--neutral-50);
  --g-today-highlight: var(--primary-100);
}
```

### NCE Style Specs Needed

```json
"specializedViews": {
  "kanban": {
    "columnBackground": "neutral-50",
    "columnHeader": "neutral-700",
    "cardBackground": "white",
    "cardBorder": "neutral-200",
    "cardDragging": "primary-50"
  },
  "calendar": {
    "todayBackground": "primary-50",
    "eventDefault": "primary-500",
    "eventSuccess": "success-500",
    "eventWarning": "warning-500",
    "eventDanger": "error-500"
  },
  "gantt": {
    "barColor": "primary-500",
    "barBorder": "primary-600",
    "progressColor": "primary-700",
    "headerBackground": "neutral-100",
    "rowColor": "neutral-50",
    "todayHighlight": "primary-100"
  }
}
```

---

## Frappe's Core CSS Variables

Based on research, Frappe uses these core variables (varies by version):

```css
:root {
  --primary: #5e64ff;
  --primary-light: /* computed */;
  --bg-color: #f5f5f6;
  --fg-color: #ffffff;
  --text-color: #1f272e;
  --text-muted: #687178;
  --text-light: #b0bac0;
  --border-color: #d1d8dd;
  --dark-border-color: #8d99a6;
  --control-bg: #f7fafc;
  --control-bg-on-gray: #ffffff;
  --awesomplete-hover-bg: #f0f4f7;
  --btn-default-bg: #f7fafc;
}
```

---

## JSON Organization Options

### Option A: Grouped by Application Point

```json
{
  "frappe": {
    "form": { ... },
    "list": { ... },
    "indicators": { ... },
    "buttons": { ... },
    "modals": { ... },
    "navigation": { ... },
    "workspace": { ... },
    "childTable": { ... },
    "reports": { ... },
    "print": { ... },
    "webPortal": { ... },
    "specializedViews": { ... }
  }
}
```

**Pros:** Logical grouping, easy for AI to find "how to style a form"
**Cons:** Styles scattered across sections

### Option B: Attached to Style Tokens

```json
{
  "primary-500": {
    "$value": "hsl(210, 83%, 60%)",
    "frappeUsage": ["btn-primary", "focus-ring", "kanban-bar", "link-text"]
  }
}
```

**Pros:** Clear token-to-element mapping
**Cons:** Harder to understand full component styling

### Option C: Hybrid (Recommended)

```json
{
  "tokens": { /* W3C Design Tokens */ },
  "frappeMapping": {
    "applicationPoints": {
      "form": { ... },
      "list": { ... }
    },
    "cssOverrides": {
      /* Ready-to-use CSS variable mappings */
    },
    "agentInstructions": {
      /* Per-application-point guidance */
    }
  }
}
```

**Pros:** Best of both worlds - tokens stay clean, Frappe specifics are additive
**Cons:** Larger file size

---

## Next Steps Discussion Points

1. **Which JSON structure** works best for your AI agent workflow?
2. **Priority order** - which Application Points matter most?
3. **CSS file generation** - should export also produce ready-to-use `.css` files?
4. **Version targeting** - Frappe v14/v15/v16+ differences?
5. **ERPNext specifics** - any ERPNext-only components to include?

---

*Research compiled from Frappe documentation, GitHub repos, and community resources.*
