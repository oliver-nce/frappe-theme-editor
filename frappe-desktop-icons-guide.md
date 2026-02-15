# Frappe Desktop Icons Guide (v16+)

## Overview

Desktop icons (also called "App Tiles") allow your Frappe app to appear on the main apps page, making it easily accessible to users. When configured, your app appears alongside built-in apps like Home, CRM, HR, and Accounting.

> **Important:** Frappe v16 introduced significant changes to how desktop icons work. This guide covers the complete setup required for v16+, which involves **multiple configuration files** working together.

---

## How Desktop Icons Work in Frappe v16

In Frappe v16, desktop icons require **three components** working together:

1. **`hooks.py`** - Registers the app for the apps screen (provides route info)
2. **`app_logo_url`** - Top-level hook for the app's logo (used by sidebar)
3. **`desktop_icon/*.json`** - Desktop Icon DocType definition (provides the actual icon on desktop)

The `add_to_apps_screen` hook alone is **not sufficient** for the icon to appear with a custom logo. You must also create a Desktop Icon JSON file.

---

## Recommended: Use `bench new-app`

The easiest way to create a properly structured Frappe app is to use the built-in command:

```bash
cd ~/frappe-bench
bench new-app your_app
```

This creates the correct triple-folder structure automatically. Then:
1. Copy your existing code into the correct folders (see File Structure Reference below)
2. Configure `hooks.py` with logo and app screen settings
3. Create `desktop_icon/` and `workspace_sidebar/` folders at app root
4. Run `bench --site your-site install-app your_app`

> **Warning:** If you create the app structure manually or copy from another source, you may encounter issues with Pages, DocTypes, or icons not syncing. The `bench new-app` command ensures all folders and marker files are in the correct locations.

---

## Quick Start (All Required Steps)

### Step 1: Edit hooks.py

Add **both** the `app_logo_url` hook AND the `add_to_apps_screen` configuration:

```python
app_name = "your_app"
app_title = "Your App"
app_publisher = "Your Name"
app_description = "Description"
app_email = "you@example.com"
app_license = "MIT"

# REQUIRED for v16: Top-level logo URL hook
app_logo_url = "/assets/your_app/logo.svg"

# App screen configuration
add_to_apps_screen = [
	{
		"name": "your_app",
		"logo": "/assets/your_app/logo.svg",
		"title": "Your App",
		"route": "/app/your-doctype",
	}
]
```

### Step 2: Create the Logo File

Place your logo in the `public/` folder:
```
your_app/public/logo.svg    (or logo.png)
```

### Step 3: Create Desktop Icon JSON (CRITICAL for v16)

Create the folder and JSON file at the **app root level** (same level as `hooks.py`):

```
your_app/
├── hooks.py
├── desktop_icon/              ← Create this folder
│   └── your_app.json          ← Create this file
├── public/
│   └── logo.svg
└── ...
```

**File: `your_app/desktop_icon/your_app.json`**
```json
{
 "app": "your_app",
 "docstatus": 0,
 "doctype": "Desktop Icon",
 "hidden": 0,
 "icon": "tool",
 "icon_type": "Link",
 "idx": 0,
 "label": "Your App",
 "logo_url": "/assets/your_app/logo.svg",
 "link_to": "Your App",
 "link_type": "Workspace Sidebar",
 "name": "Your App",
 "owner": "Administrator",
 "standard": 1
}
```

> **Critical:** The `name` field MUST match the filename (without `.json`). If your file is `your_app.json`, then `"name": "Your App"` should be the label, and the filename should match the scrubbed version.

### Step 4: Create Workspace Sidebar JSON (Required for navigation)

Create at the **app root level**:

```
your_app/
├── hooks.py
├── desktop_icon/
├── workspace_sidebar/         ← Create this folder
│   └── your_app.json          ← Create this file
└── ...
```

**File: `your_app/workspace_sidebar/your_app.json`**
```json
{
 "app": "your_app",
 "docstatus": 0,
 "doctype": "Workspace Sidebar",
 "icon": "tool",
 "idx": 0,
 "items": [],
 "module": "Your App",
 "name": "Your App",
 "owner": "Administrator",
 "standard": 1,
 "title": "Your App"
}
```

### Step 5: Create Workspace JSON (For workspace content)

Create inside the **module folder**:

```
your_app/
├── your_app/                  ← Module folder
│   ├── __init__.py
│   ├── .frappe               ← Required marker file (empty)
│   └── workspace/
│       └── your_app/
│           └── your_app.json
└── ...
```

**File: `your_app/your_app/workspace/your_app/your_app.json`**
```json
{
 "app": "your_app",
 "charts": [],
 "content": "[{\"type\":\"header\",\"data\":{\"text\":\"Your App\",\"col\":12}}]",
 "creation": "2026-02-09 10:00:00.000000",
 "docstatus": 0,
 "doctype": "Workspace",
 "for_user": "",
 "hide_custom": 0,
 "icon": "tool",
 "idx": 0,
 "is_hidden": 0,
 "label": "Your App",
 "links": [],
 "modified": "2026-02-09 10:00:00.000000",
 "modified_by": "Administrator",
 "module": "Your App",
 "name": "Your App",
 "number_cards": [],
 "owner": "Administrator",
 "parent_page": "",
 "public": 1,
 "quick_lists": [],
 "restrict_to_domain": "",
 "roles": [],
 "sequence_id": 1,
 "shortcuts": [],
 "title": "Your App",
 "type": "Workspace"
}
```

### Step 6: Create .frappe Marker File

Create an empty `.frappe` file in your module folder:

```bash
touch your_app/your_app/.frappe
```

This file is **required** for Frappe to recognize the folder as a module and sync its contents.

### Step 7: Apply Changes

```bash
bench --site your-site migrate
bench --site your-site clear-cache
bench build --app your_app
bench restart
```

Then hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+R).

---

## Understanding Each Configuration

### hooks.py Fields

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `app_logo_url` | Yes (v16) | Top-level hook for app logo | `"/assets/your_app/logo.svg"` |
| `name` | Yes | Unique identifier for the app tile | `"your_app"` |
| `logo` | Yes | Path to the icon image | `"/assets/your_app/logo.svg"` |
| `title` | Yes | Display name shown under the icon | `"Your App"` |
| `route` | Yes | URL path when users click the icon | `"/app/your-doctype"` |
| `has_permission` | No | Python path to permission check function | `"your_app.api.has_permission"` |

### Desktop Icon JSON Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Must match filename (without .json) |
| `label` | Yes | Display name for the icon |
| `app` | Yes | Your app's name (snake_case) |
| `logo_url` | Yes | Path to logo image |
| `icon_type` | Yes | Usually `"Link"` or `"App"` |
| `link_type` | Yes | Usually `"Workspace Sidebar"` |
| `link_to` | Yes | Name of the Workspace Sidebar to link to |
| `standard` | Yes | Set to `1` for app-defined icons |

---

## Route Options

The `route` field in `add_to_apps_screen` determines where clicking the icon takes the user.

### 1. **DocType List View (Recommended for simple apps)**
```python
"route": "/app/wp-tables"
```
Opens the list view of a specific DocType (shows all records).

### 2. **Workspace**
```python
"route": "/desk/your-app"
```
Opens a Workspace dashboard with links, shortcuts, and cards.

**Requires:** Workspace, Workspace Sidebar, and Desktop Icon JSON files (see Quick Start above).

### 3. **New Document Form**
```python
"route": "/app/wordpress-connection/new"
```
Opens a blank form to create a new document.

### 4. **Report**
```python
"route": "/app/query-report/Sync Status Report"
```
Opens a specific report.

### 5. **Custom Web Page**
```python
"route": "/your_app/dashboard"
```
Opens a custom HTML page from your `www/` folder.

**Requires:** File at `your_app/www/dashboard.html` or `dashboard.py`

---

## Adding the Logo

### Step 1: Create an Icon Image

**Requirements:**
- Format: SVG (recommended) or PNG
- Size: 100x100 pixels or larger (square)
- Background: Transparent or solid color
- File name: `logo.svg` or `logo.png`

### Step 2: Place in Public Folder

Copy your icon to:
```
your_app/public/logo.svg
```

### Step 3: Reference in THREE Places

**1. hooks.py (top-level):**
```python
app_logo_url = "/assets/your_app/logo.svg"
```

**2. hooks.py (add_to_apps_screen):**
```python
"logo": "/assets/your_app/logo.svg"
```

**3. desktop_icon JSON:**
```json
"logo_url": "/assets/your_app/logo.svg"
```

**Note:** The path is automatically mapped:
- `/assets/your_app/` → `your_app/public/`

---

## Permission Control

### Option 1: No Permission Check (Public)
```python
{
	"name": "your_app",
	"logo": "/assets/your_app/logo.svg",
	"title": "Your App",
	"route": "/app/your-doctype"
	# No has_permission field = everyone can see it
}
```

### Option 2: Custom Permission Function
```python
{
	"name": "your_app",
	"logo": "/assets/your_app/logo.svg",
	"title": "Your App",
	"route": "/app/your-doctype",
	"has_permission": "your_app.api.permission.has_app_permission"
}
```

**Create the permission function:**

File: `your_app/your_app/api/permission.py`
```python
import frappe

def has_app_permission():
	"""Check if user has permission to see the app"""
	# Option 1: Check role
	if "System Manager" in frappe.get_roles():
		return True
	
	# Option 2: Check custom permission
	if frappe.has_permission("Your DocType", "read"):
		return True
	
	return False
```

---

## Multiple Desktop Icons

You can add multiple icons for the same app. Each requires its own `desktop_icon/*.json` file:

**hooks.py:**
```python
add_to_apps_screen = [
	{
		"name": "your_app",
		"logo": "/assets/your_app/logo.svg",
		"title": "Your App",
		"route": "/app/main-doctype"
	},
	{
		"name": "quick_create",
		"logo": "/assets/your_app/quick_create.svg",
		"title": "Quick Create",
		"route": "/app/your-doctype/new"
	}
]
```

**desktop_icon/your_app.json** and **desktop_icon/quick_create.json** - create one for each.

---

## Complete Example (v16)

### File: `frappe_theme_editor/hooks.py`

```python
app_name = "frappe_theme_editor"
app_title = "Frappe Theme Editor"
app_publisher = "NCE"
app_description = "Visual theme editor for Frappe/ERPNext applications"
app_email = "dev@ncesoccer.com"
app_license = "MIT"

# REQUIRED for v16: Top-level logo URL hook
app_logo_url = "/assets/frappe_theme_editor/logo.svg"

# Desktop Icons / App Tiles
add_to_apps_screen = [
	{
		"name": "frappe_theme_editor",
		"logo": "/assets/frappe_theme_editor/logo.svg",
		"title": "Theme Editor",
		"route": "/app/theme-editor",
	}
]

# ... rest of hooks.py
```

### File: `frappe_theme_editor/desktop_icon/theme_editor.json`

```json
{
 "app": "frappe_theme_editor",
 "docstatus": 0,
 "doctype": "Desktop Icon",
 "hidden": 0,
 "icon": "tool",
 "icon_type": "Link",
 "idx": 0,
 "label": "Theme Editor",
 "logo_url": "/assets/frappe_theme_editor/logo.svg",
 "link_to": "Frappe Theme Editor",
 "link_type": "Workspace Sidebar",
 "name": "Theme Editor",
 "owner": "Administrator",
 "standard": 1
}
```

### File: `frappe_theme_editor/workspace_sidebar/frappe_theme_editor.json`

```json
{
 "app": "frappe_theme_editor",
 "docstatus": 0,
 "doctype": "Workspace Sidebar",
 "icon": "tool",
 "idx": 0,
 "items": [],
 "module": "Frappe Theme Editor",
 "name": "Frappe Theme Editor",
 "owner": "Administrator",
 "standard": 1,
 "title": "Frappe Theme Editor"
}
```

---

## Applying Changes

After creating/editing configuration files, you need to sync and restart:

### Method 1: Full Sync (Recommended)
```bash
bench --site your-site migrate
bench --site your-site clear-cache
bench build --app your_app
bench restart
```

### Method 2: Quick Refresh (After minor changes)
```bash
bench --site your-site clear-cache
bench restart
```

> **Note:** `bench migrate` is required whenever you add or modify JSON files in `desktop_icon/`, `workspace_sidebar/`, or `workspace/` folders. Simple cache clears won't sync these files to the database.

---

## Troubleshooting

### Icon Doesn't Appear At All

**Check 1:** Verify the app is installed
```bash
bench --site your-site list-apps
```

**Check 2:** Check if Desktop Icon exists in database
```bash
bench --site your-site console
>>> frappe.get_all("Desktop Icon", filters={"app": "your_app"}, fields=["name", "label", "logo_url"])
```

**Check 3:** Verify Desktop Icon JSON file location
- Must be at app root: `your_app/desktop_icon/your_app.json`
- NOT inside module folder: ~~`your_app/your_app/desktop_icon/`~~

**Check 4:** Verify `name` field matches filename
```json
// File: your_app/desktop_icon/theme_editor.json
{
  "name": "Theme Editor",  // ← Must relate to filename
  ...
}
```

**Check 5:** Run migrate to sync JSON files
```bash
bench --site your-site migrate
```

**Check 6:** Check for "Removing orphan Desktop Icons" in migrate output
- If your icon is being deleted, the JSON file isn't being found
- Verify folder location and filename

---

### Icon Appears But Shows Letter Instead of Logo

**Cause:** The `logo_url` field is missing or not synced to the database.

**Fix 1:** Add `logo_url` to desktop_icon JSON
```json
{
  "logo_url": "/assets/your_app/logo.svg",
  ...
}
```

**Fix 2:** Add `app_logo_url` to hooks.py (top-level, not inside add_to_apps_screen)
```python
app_logo_url = "/assets/your_app/logo.svg"
```

**Fix 3:** Re-run migrate and clear cache
```bash
bench --site your-site migrate
bench --site your-site clear-cache
bench restart
```

**Fix 4:** Verify logo_url is in database
```bash
bench --site your-site console
>>> frappe.get_value("Desktop Icon", "Your App", "logo_url")
```

---

### Icon Appears But Image Doesn't Load (Broken Image)

**Check 1:** Verify logo file exists
```bash
ls -la your_app/public/logo.svg
```

**Check 2:** Check logo path spelling (case-sensitive)
```python
"logo_url": "/assets/your_app/logo.svg"  # Correct
"logo_url": "/assets/your_app/Logo.svg"  # Wrong
```

**Check 3:** Test logo URL directly in browser
```
http://your-site:8000/assets/your_app/logo.svg
```

**Check 4:** Rebuild assets
```bash
bench build --app your_app
```

**Check 5:** Check file format
- Use SVG or PNG
- Avoid spaces in filename
- Ensure valid SVG syntax

---

### Icon Removed During Migrate ("Removing orphan Desktop Icons")

**Cause:** Frappe can't find the JSON file or the file format is incorrect.

**Fix 1:** Verify folder is at app root level
```
your_app/
├── desktop_icon/          ← Correct location
│   └── your_app.json
├── hooks.py
└── ...
```

NOT:
```
your_app/
├── your_app/
│   └── desktop_icon/      ← Wrong location
│       └── your_app.json
└── ...
```

**Fix 2:** Verify JSON is valid
```bash
python -m json.tool your_app/desktop_icon/your_app.json
```

**Fix 3:** Check `standard` field is set to `1`
```json
{
  "standard": 1,
  ...
}
```

---

### Wrong Route / 404 Error / "Page not found"

**Cause:** The Page or DocType isn't in the database, usually because it's in the wrong folder location.

**Fix 1:** Verify Page exists in database
```bash
bench --site your-site console
>>> frappe.db.get_value("Page", "your-page-name", ["name", "module"])
```
If this returns `None`, the page wasn't synced.

**Fix 2:** Check folder location - Pages must be in the MODULE folder (Level 3)
```
# CORRECT - page inside module folder (Level 3)
your_app/your_app/your_app/page/your_page/your_page.json

# WRONG - page at app root (Level 1)
your_app/page/your_page/your_page.json

# WRONG - page at package level (Level 2)
your_app/your_app/page/your_page/your_page.json
```

**Fix 3:** Check `module` field in page JSON matches your module name
```json
{
  "module": "Your App",  // Must match modules.txt
  ...
}
```

**Fix 4:** Create `.frappe` marker file in module folder
```bash
touch your_app/your_app/your_app/.frappe
```

**Fix 5:** Run migrate to sync
```bash
bench --site your-site migrate
```

**Fix 6:** Use correct route format
```python
# Correct
"route": "/app/wp-tables"          # DocType: WP Tables
"route": "/app/your-page"          # Page: your-page

# Wrong
"route": "/app/WP Tables"          # Spaces not allowed
"route": "/wp-tables"              # Missing /app/
```

---

### Workspace Shows "Report" Instead of Content

**Cause:** Missing Workspace Sidebar or incorrect module reference.

**Fix 1:** Create workspace_sidebar JSON at app root
```
your_app/workspace_sidebar/your_app.json
```

**Fix 2:** Ensure `module` field matches in all JSON files
```json
"module": "Your App"  // Must be consistent
```

**Fix 3:** Verify Workspace Sidebar exists in database
```bash
bench --site your-site console
>>> frappe.get_all("Workspace Sidebar", filters={"app": "your_app"})
```

---

## Best Practices

### 1. **Use SVG for Icons**
SVG files scale better and load faster than PNG. They also look crisp on high-DPI displays.

### 2. **Keep Icon Simple**
- Use clear, recognizable imagery
- Avoid too much detail (icons are displayed small)
- Use high contrast colors
- 100x100 viewBox is ideal

### 3. **Descriptive Titles**
- Keep titles short (1-3 words)
- Use title case: "Theme Editor" not "theme editor"

### 4. **Consistent Naming**
```python
# Good - consistent naming across files
app_name = "frappe_theme_editor"
"name": "frappe_theme_editor"
"app": "frappe_theme_editor"
"module": "Frappe Theme Editor"

# Avoid - inconsistent naming causes sync issues
```

### 5. **Test After Every Change**
```bash
# Quick verification commands
bench --site your-site console
>>> frappe.get_all("Desktop Icon", filters={"app": "your_app"}, fields=["name", "logo_url"])
>>> frappe.get_all("Workspace Sidebar", filters={"app": "your_app"})
```

### 6. **Check Migrate Output**
Watch for "Removing orphan Desktop Icons" - this means your JSON isn't being found.

---

## File Structure Reference (v16 Complete)

### Standard Structure (created by `bench new-app`)

When you create an app with `bench new-app your_app`, Frappe creates a **triple-nested folder structure**:

```
apps/
└── your_app/                                # Level 1: App root (repo folder)
    ├── hooks.py                             # ← Configure app_logo_url + add_to_apps_screen
    ├── setup.py
    ├── requirements.txt
    ├── modules.txt                          # Lists module names (e.g., "Your App")
    │
    ├── desktop_icon/                        # ← APP ROOT LEVEL (same as hooks.py)
    │   └── your_app.json                    # Desktop Icon definition
    │
    ├── workspace_sidebar/                   # ← APP ROOT LEVEL (same as hooks.py)
    │   └── your_app.json                    # Workspace Sidebar definition
    │
    ├── public/                              # Static assets
    │   └── logo.svg                         # ← Place icon here
    │
    └── your_app/                            # Level 2: Python package folder
        ├── __init__.py
        │
        └── your_app/                        # Level 3: Module folder (CRITICAL!)
            ├── __init__.py
            ├── .frappe                      # ← REQUIRED marker file (empty)
            │
            ├── workspace/                   # Workspace definitions (IN module)
            │   └── your_app/
            │       └── your_app.json        # Workspace content config
            │
            ├── doctype/                     # Your DocTypes go here
            │   └── your_doctype/
            │       └── your_doctype.json
            │
            ├── page/                        # Your Pages go here
            │   └── your_page/
            │       ├── your_page.json
            │       ├── your_page.js
            │       └── your_page.html
            │
            └── report/                      # Your Reports go here
                └── ...
```

### Why Three Levels?

The app name appears three times because:
1. **Level 1** (`apps/your_app/`) - The app/repo root directory
2. **Level 2** (`your_app/your_app/`) - The Python package (what `import your_app` loads)
3. **Level 3** (`your_app/your_app/your_app/`) - The Frappe module (where DocTypes, Pages, etc. live)

This is the **standard Frappe app structure**. The `bench new-app` command creates this automatically.

### Critical Placement Rules

| Item | Location | Example Path |
|------|----------|--------------|
| `hooks.py` | App root (Level 1) | `your_app/hooks.py` |
| `desktop_icon/` | App root (Level 1) | `your_app/desktop_icon/` |
| `workspace_sidebar/` | App root (Level 1) | `your_app/workspace_sidebar/` |
| `public/` | App root (Level 1) | `your_app/public/logo.svg` |
| `.frappe` marker | Module folder (Level 3) | `your_app/your_app/your_app/.frappe` |
| `doctype/` | Module folder (Level 3) | `your_app/your_app/your_app/doctype/` |
| `page/` | Module folder (Level 3) | `your_app/your_app/your_app/page/` |
| `workspace/` | Module folder (Level 3) | `your_app/your_app/your_app/workspace/` |

> **Critical:** `doctype/`, `page/`, and `workspace/` folders MUST be inside the **module folder** (Level 3, where `.frappe` marker is). If placed at Level 1 or Level 2, they will NOT be synced to the database during `bench migrate`.

---

## Summary Checklist (v16)

### Required Files
- [ ] `hooks.py` with `app_logo_url` (top-level hook)
- [ ] `hooks.py` with `add_to_apps_screen` configuration
- [ ] `public/logo.svg` (or .png) - your icon image
- [ ] `desktop_icon/your_app.json` - Desktop Icon definition with `logo_url`
- [ ] `workspace_sidebar/your_app.json` - Workspace Sidebar definition
- [ ] `your_app/workspace/your_app/your_app.json` - Workspace content
- [ ] `your_app/.frappe` - Empty marker file in module folder

### JSON File Checklist
- [ ] `desktop_icon/*.json` is at app root (not in module folder)
- [ ] `workspace_sidebar/*.json` is at app root (not in module folder)
- [ ] `name` field matches filename (without .json)
- [ ] `logo_url` field is present in desktop_icon JSON
- [ ] `standard` field is set to `1`
- [ ] `app` field matches your app name (snake_case)
- [ ] `module` field is consistent across all JSON files

### Commands to Run
- [ ] `bench --site your-site migrate` (syncs JSON files to database)
- [ ] `bench --site your-site clear-cache`
- [ ] `bench build --app your_app` (links assets)
- [ ] `bench restart`
- [ ] Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

### Verification
- [ ] Check Desktop Icon in database: `frappe.get_all("Desktop Icon", filters={"app": "your_app"})`
- [ ] Check logo_url is populated: `frappe.get_value("Desktop Icon", "Your App", "logo_url")`
- [ ] Test logo URL in browser: `http://site:8000/assets/your_app/logo.svg`
- [ ] Verify icon appears on apps page with custom logo
- [ ] Click icon and verify correct destination

---

## Common Mistakes to Avoid

1. **Putting `desktop_icon/` inside the module folder** - It must be at app root level (Level 1)
2. **Putting `doctype/` or `page/` at app root** - They must be inside the module folder (Level 3, where `.frappe` is)
3. **Forgetting `app_logo_url` in hooks.py** - The `logo` field in `add_to_apps_screen` alone isn't enough
4. **Missing `logo_url` in desktop_icon JSON** - This is what actually shows the icon
5. **Filename/name mismatch** - The `name` field must relate to the JSON filename
6. **Missing `.frappe` marker file** - Required for Frappe to recognize the module folder
7. **Not running `bench migrate`** - JSON files won't sync to database without it
8. **Only clearing cache without migrate** - Cache clear doesn't sync JSON files
9. **Wrong module name in JSON files** - The `module` field must match what's in `modules.txt`
10. **Non-standard app structure** - Always use `bench new-app` to create apps, then copy your code into the correct folders

---

## Additional Resources

- [Frappe Framework Documentation](https://frappeframework.com/docs)
- [Workspace Documentation](https://frappeframework.com/docs/user/en/desk/workspace)
- [Hooks Reference](https://frappeframework.com/docs/user/en/python-api/hooks)

---

**Last Updated:** February 2026  
**Frappe Version:** v16+  
**App Example:** frappe_theme_editor
