Here's a comprehensive inventory of **Frappe Presentation Methods** where your NCE theme could be applied:

------

## Frappe Presentation Methods: Complete Inventory

### 1. **Desk (Admin Interface) - Core Views**

| View Type          | Description                    | Theme Application Points                                     |
| ------------------ | ------------------------------ | ------------------------------------------------------------ |
| **Form View**      | Individual document editing    | Field labels, inputs, buttons, sections, tabs, sidebar       |
| **List View**      | Tabular display of documents   | Row backgrounds, headers, filters, action buttons, selection states |
| **Report Builder** | Custom tabular reports         | Grid styling, headers, aggregation rows, export buttons      |
| **Tree View**      | Hierarchical data display      | Node styling, expand/collapse, indentation                   |
| **Calendar View**  | Date-based document display    | Event cards, day/week/month grid, navigation                 |
| **Kanban View**    | Card-based workflow boards     | Column headers, cards, drag states, status colors            |
| **Gantt View**     | Timeline/project visualization | Bars, dependencies, milestones, timeline grid                |
| **Image View**     | Gallery-style document listing | Thumbnails, hover states, selection                          |

### 2. **Workspaces** (As shown in your screenshots)

| Component              | Description                                    | Theme Application Points                          |
| ---------------------- | ---------------------------------------------- | ------------------------------------------------- |
| **Shortcut Blocks**    | Quick navigation links with counts             | Background, text, count badges, hover states      |
| **Link Cards**         | Grouped navigation (e.g., "Reports & Masters") | Card background, headers, link styling            |
| **Number Cards**       | KPI/metric displays                            | Value typography, label styling, trend indicators |
| **Chart Blocks**       | Embedded visualizations                        | Chart colors, axes, legends, tooltips             |
| **Quick List Blocks**  | Recent records display                         | Row styling, timestamps, action buttons           |
| **Onboarding Blocks**  | Step-by-step guides (as in Website screenshot) | Progress indicators, step styling, video buttons  |
| **Heading Blocks**     | Section headers                                | Typography, dividers                              |
| **Spacer Blocks**      | Layout spacing                                 | N/A (structural)                                  |
| **Custom HTML Blocks** | Arbitrary content                              | Full theme CSS access                             |

### 3. **Dashboards**

| Component           | Description                | Theme Application Points        |
| ------------------- | -------------------------- | ------------------------------- |
| **Dashboard**       | Container for charts/cards | Background, grid layout         |
| **Dashboard Chart** | Individual chart widgets   | Chart colors, titles, legends   |
| **Number Card**     | Single metric display      | Value color, background, trends |

### 4. **Reports**

| Report Type        | Description               | Theme Application Points            |
| ------------------ | ------------------------- | ----------------------------------- |
| **Query Report**   | SQL-based reports         | Table styling, headers, totals row  |
| **Script Report**  | Python-generated reports  | Full HTML/CSS control, chart colors |
| **Report Builder** | User-configurable reports | Grid styling, filters, grouping     |

### 5. **Print Formats**

| Component                | Description                         | Theme Application Points               |
| ------------------------ | ----------------------------------- | -------------------------------------- |
| **Print Format Builder** | Drag-drop print design              | Field styling, section breaks, headers |
| **Custom Print Format**  | HTML/Jinja templates                | Full CSS control, typography, colors   |
| **Print Designer**       | Visual print format tool            | Element styling, tables, dynamic data  |
| **Letter Head**          | Header/footer templates             | Logo placement, borders, typography    |
| **Print Style**          | CSS presets (Modern, Classic, etc.) | Base styling for all prints            |

### 6. **Web Pages (Public-facing)**

| Component         | Description                  | Theme Application Points                |
| ----------------- | ---------------------------- | --------------------------------------- |
| **Web Page**      | Static/dynamic content pages | Full CSS per page, sections             |
| **Web Form**      | Public data entry forms      | Form fields, buttons, validation states |
| **Web Template**  | Reusable page sections       | Section styling, responsive layouts     |
| **Website Theme** | Site-wide styling (SCSS)     | Colors, fonts, Bootstrap overrides      |
| **Blog Post**     | Article pages                | Typography, images, metadata            |
| **Portal Pages**  | User self-service pages      | Navigation, cards, tables               |

### 7. **Form Components (Detail)**

| Component                     | Description               | Theme Application Points                       |
| ----------------------------- | ------------------------- | ---------------------------------------------- |
| **Section Break**             | Collapsible form sections | Header styling, collapse icons, borders        |
| **Column Break**              | Multi-column layouts      | Gap/gutter styling                             |
| **Tab Break**                 | Form tabs                 | Active/inactive states, borders                |
| **Field Types**               | 40+ input types           | Input borders, focus states, labels, help text |
| **Child Table (Table field)** | Embedded grids            | Row styling, add/delete buttons, headers       |
| **HTML Field**                | Custom HTML in forms      | Full CSS control                               |
| **Attach/Image fields**       | File upload areas         | Drop zone styling, preview styling             |

### 8. **Dialogs & Modals**

| Component               | Description          | Theme Application Points         |
| ----------------------- | -------------------- | -------------------------------- |
| **Dialog**              | Modal windows        | Header, body, footer, overlay    |
| **Message Dialog**      | Alerts/confirmations | Icon colors, button styles       |
| **Prompt Dialog**       | Input requests       | Field styling within modal       |
| **Multi-select Dialog** | List selection       | Checkbox styling, search field   |
| **Link Selector**       | Document picker      | Search results, selection states |

### 9. **Navigation & Chrome**

| Component        | Description          | Theme Application Points            |
| ---------------- | -------------------- | ----------------------------------- |
| **Navbar**       | Top navigation bar   | Background, brand area, icons       |
| **Sidebar**      | Left navigation tree | Module colors, active states, icons |
| **Awesomebar**   | Search/command bar   | Input styling, results dropdown     |
| **Breadcrumbs**  | Navigation path      | Link styling, separators            |
| **Page Actions** | Action button area   | Primary/secondary button styling    |

### 10. **Scripting & Custom UI**

| Component                    | Description                 | Theme Application Points     |
| ---------------------------- | --------------------------- | ---------------------------- |
| **Client Script**            | Form-level JS customization | Can inject CSS, modify DOM   |
| **Server Script**            | Server-side logic           | N/A (backend)                |
| **Page (Custom Page)**       | Fully custom desk pages     | Complete HTML/CSS/JS control |
| **Custom HTML in Workspace** | Embedded widgets            | Full theme CSS access        |

------

## Theme Application Methods in Frappe

### Method 1: **CSS Variables via Custom App**

```css
/* Target the data-theme attribute */
[data-theme="nce-theme"] {
    --primary: hsl(210, 75%, 50%);
    --primary-light: hsl(210, 75%, 90%);
    --bg-color: hsl(210, 10%, 98%);
    /* ... */
}
```

### Method 2: **hooks.py CSS Injection**

```python
# hooks.py
app_include_css = "/assets/myapp/css/nce-theme.css"
web_include_css = "/assets/myapp/css/nce-theme.css"
```

### Method 3: **Website Theme DocType**

- Custom SCSS overrides
- Bootstrap variable overrides
- Custom JavaScript

### Method 4: **Print Style CSS**

- Per-print-format styling
- Global print CSS

------

## Recommended NCE Theme Extensions for Frappe

Based on your current theme structure and Frappe's needs, I recommend adding these sections:

```json
{
  "frappe": {
    "desk": {
      "form": {
        "sectionHeader": { "background": "neutral-100", "border": "neutral-200" },
        "fieldLabel": { "color": "neutral-700", "weight": 500 },
        "requiredIndicator": { "color": "error-600" },
        "readOnlyField": { "background": "neutral-50" }
      },
      "list": {
        "headerBackground": "neutral-100",
        "rowHover": "primary-50",
        "rowAlternate": "neutral-50",
        "selectedRow": "primary-100"
      },
      "sidebar": {
        "background": "neutral-50",
        "activeItem": "primary-100",
        "moduleIcon": "primary-500"
      }
    },
    "status": {
      "draft": { "background": "neutral-200", "text": "neutral-700" },
      "submitted": { "background": "primary-100", "text": "primary-800" },
      "cancelled": { "background": "error-100", "text": "error-700" }
    },
    "docstatus": {
      "0": "warning",
      "1": "success", 
      "2": "error"
    }
  }
}
```

