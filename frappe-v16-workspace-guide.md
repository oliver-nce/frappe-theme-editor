# Frappe v16: Custom App Workspace & Desktop Setup Guide

## What Changed in v16

Frappe v16 completely redesigned the Desk UI. The key differences from v15:

- **Desktop Icons** are now a separate DocType — they control what appears on the main Desk landing page
- **Workspace Sidebar** is a new DocType — it defines the sidebar navigation within an app
- **Workspaces** still exist but now open with a sidebar and keep related items grouped
- The **app switcher** in the sidebar lets users switch between apps
- The `add_to_apps_screen` hook in `hooks.py` is how apps register themselves on the main app screen
- `bench create-desktop-icons-and-sidebar` is a new command to generate these from hooks

**Documentation for v16 is still incomplete/being written** — this is acknowledged by the community. Much of what follows comes from community trial-and-error.

---

## How the Three Pieces Fit Together

In v16, getting your app to appear on the Desk requires three DocTypes working together:

```
Desktop Icon (App type)         ← The icon/folder on the Desk home screen
  └── Desktop Icon (Link type)  ← Child icon pointing to a sidebar
        └── Workspace Sidebar   ← The left sidebar nav when your app is selected
              └── Workspace     ← The actual page content users see
```

You need all four layers for a fully working custom app on the Desk.

---

## Step-by-Step Setup

### Step 1: Confirm App Structure and Installation

From your bench directory, verify:

```bash
# App is installed on the site
bench --site your-site list-apps

# modules.txt has your module listed
cat apps/your_app/your_app/modules.txt

# hooks.py has the required metadata
cat apps/your_app/your_app/hooks.py
```

**`hooks.py` must have at minimum:**

```python
app_name = "your_app"
app_title = "Your App Title"
app_publisher = "Your Company"
app_description = "Description"
app_email = "you@example.com"
app_license = "MIT"
```

**`modules.txt` must list your module(s), one per line:**

```
Your Module Name
```

### Step 2: Confirm Module Def Exists

Navigate to `/app/module-def` in the browser. Your module must be listed there, with the correct `app_name` field set to your app.

If missing, enable developer mode and create it:

```bash
bench set-config developer_mode 1
```

Then go to Desk → Build → Module Def → New, and create it with your module name linked to your app.

### Step 3: Ensure At Least One DocType Exists in the Module

This is critical. **A module is invisible to non-admin users unless it contains at least one DocType** that the user has permissions on.

If your app has no DocTypes yet, create a simple Settings DocType in your module to make it visible.

### Step 4: Add `add_to_apps_screen` to hooks.py

This is the **v16-specific** hook that registers your app on the Desk app screen:

```python
# hooks.py

add_to_apps_screen = [
    {
        "name": "your_app",
        "logo": "/assets/your_app/logo.png",
        "title": "Your App Title",
        "route": "/desk/your_app",
        "has_permission": "your_app.api.check_app_permission"
    }
]
```

**Place the logo file at:** `your_app/your_app/public/logo.png`

**The permission check function** (optional but recommended):

```python
# your_app/api.py
import frappe

def check_app_permission():
    """Check if current user has permission to access the app."""
    roles = frappe.get_roles()
    if any(role in roles for role in ["System Manager", "Administrator"]):
        return True
    return False
```

### Step 5: Generate Desktop Icons and Sidebar

After updating hooks.py, run:

```bash
bench create-desktop-icons-and-sidebar
bench migrate
bench restart
```

If this command doesn't produce results, proceed to Step 6 for manual setup.

### Step 6: Manual Desktop Icon + Sidebar Setup

This is the approach the community has confirmed works when the bench command doesn't.

**A. Create the Parent Desktop Icon (the app folder on Desk):**

1. Log in as Administrator
2. Go to `/app/desktop-icon` → New
3. Set fields:
   - **Icon Type:** App
   - **Link Type:** External
   - **App:** frappe (or your app name if it appears)
   - **Label:** Your App Name
   - **Logo URL:** /assets/your_app/logo.png
   - **Link:** /desk/your_app
   - **Is Standard:** Check this
4. Save

**B. Create a Workspace Sidebar:**

1. Go to `/app/workspace-sidebar` → New
2. Add sidebar items — these are the links that appear in the left sidebar when your app is selected
3. Each item can link to a Workspace, DocType, Page, Report, or external URL
4. Save

**C. Create Child Desktop Icons (sidebar entries):**

1. Go to `/app/desktop-icon` → New
2. Set fields:
   - **Icon Type:** Link
   - **Link Type:** Workspace Sidebar
   - **Parent Icon:** Select the parent Desktop Icon you created in step A
   - **Link To:** Select the Workspace Sidebar you created in step B
   - **Logo URL:** your icon
3. Save

**D. Refresh the browser** (hard refresh: Ctrl+Shift+R)

**Tip:** If building from scratch seems daunting, try duplicating an existing Desktop Icon (e.g. the "Build" or "Buying" icon) and modifying it. This avoids some of the quirks with creating from scratch.

### Step 7: Create the Workspace Page

The workspace is the actual content page users see when they click a sidebar item:

**Via UI (recommended):**
1. Navigate to any existing workspace
2. Click on the workspace name in the top navbar
3. From there you can create a new workspace
4. Link it to your module
5. Set it as Public
6. Add blocks (shortcuts, cards, charts, etc.)

**Via JSON file:**
Create at: `your_app/your_app/your_module/workspace/your_workspace/your_workspace.json`

Then run `bench migrate` to sync it to the database.

---

## Setup Checklist

### App & Module

```
□ hooks.py has app_name, app_title, etc.
□ modules.txt lists your module name(s)
□ Module Def exists in database (check /app/module-def)
□ Module Def has correct app_name field
□ At least one DocType exists in the module
□ DocType has permissions set for target roles
□ User has module in their Allowed Modules
```

### v16 Desktop / Workspace

```
□ add_to_apps_screen configured in hooks.py
□ bench create-desktop-icons-and-sidebar run
  OR Desktop Icon manually created (parent + child)
□ Workspace Sidebar created and linked from child Desktop Icon
□ Workspace exists and is set to Public
□ Workspace is linked to your module
```

### Build & Cache

```
□ Logo file at your_app/your_app/public/logo.png
□ bench build (after adding static assets)
□ bench migrate
□ bench clear-cache
□ Hard refresh in browser (Ctrl+Shift+R)
```

---

## Common Issues

### Workspace Not Appearing in Sidebar

- Is `public` set on the workspace? Private workspaces only show for the owner.
- Is the `module` field set correctly? Must exactly match the Module Def name (case-sensitive).
- Does the module have at least one DocType? No DocType = invisible module for non-admins.
- Is the module enabled for the user? Check Allowed Modules in the User record.

### "Public" Checkbox Greyed Out on Workspace

- Enable developer mode: `bench set-config developer_mode 1`
- Must be logged in as Administrator
- Must have Workspace Manager role

### v16 Session Boot Error (500) After Creating Desktop Icon

- Make sure **Is Standard** is checked on the Desktop Icon
- Must be logged in as Administrator

### Workspace Sidebar Created But Not Visible Anywhere

- A Workspace Sidebar alone does nothing — it must be linked **FROM** a child Desktop Icon with **Link Type: Workspace Sidebar** and a **Parent Icon** set to your app's Desktop Icon.

### App Shows for Admin But Not Other Users

- Module not in user's Allowed Modules
- No DocType in the module that the user has permission on
- Roles restriction on workspace that user doesn't have

---

## Debugging Commands

```bash
# Check app is installed
bench --site your-site list-apps

# Check modules are registered
bench --site your-site console
>>> frappe.get_all("Module Def", filters={"app_name": "your_app"}, pluck="name")

# Check workspace exists
>>> frappe.get_all("Workspace", filters={"module": "Your Module Name"}, pluck="name")

# Check desktop icons
>>> frappe.get_all("Desktop Icon", filters={"app": "your_app"}, fields=["name", "label", "icon_type", "link_type"])

# Force full rebuild
bench build
bench migrate
bench clear-cache
bench restart
```

---

## References

- [How to Add a Custom App to Desktop in Frappe v16](https://discuss.frappe.io/t/how-to-add-a-custom-app-to-desktop-in-frappe-v16/159272) — Jan 2026
- [How to Create a Menu for a Workspace in v16](https://discuss.frappe.io/t/how-to-create-a-menu-for-a-workspace-in-frappe-version-16/159223) — Jan 2026, step-by-step with screenshots
- [Frappe 16 New UI Questions](https://discuss.frappe.io/t/frappe-16-new-ui-questions/157182) — Nov 2025
- [v16 UI Updates Tracking Issue](https://github.com/frappe/frappe/issues/27900) — Official list of all v16 UI changes
- [Frappe v16 Release Notes](https://github.com/frappe/frappe/releases/tag/v16.0.0)
- [Frappe v16 Feature Overview](https://frappe.io/framework/version-16)

---
---

# Appendix A: Expected Frappe App Directory Structure

This is the standard structure generated by `bench new-app`. Any custom app must conform to this layout.

```
your_app/                          # Git root
├── pyproject.toml                 # or setup.py — Python package config
├── your_app/                      # Inner package directory (SAME NAME as outer)
│   ├── __init__.py                # Must exist
│   ├── hooks.py                   # App metadata, integration hooks
│   ├── modules.txt                # List of modules (one per line)
│   ├── patches.txt                # Migration patches
│   ├── your_module/               # Module directory (snake_case)
│   │   ├── __init__.py            # Must exist
│   │   ├── doctype/               # DocTypes for this module
│   │   │   └── your_doctype/
│   │   │       ├── your_doctype.json
│   │   │       ├── your_doctype.py
│   │   │       └── your_doctype.js
│   │   └── workspace/             # Workspace definitions
│   │       └── your_workspace/
│   │           └── your_workspace.json
│   ├── public/                    # Static assets (CSS, JS, images)
│   │   ├── css/
│   │   └── js/
│   ├── templates/
│   │   ├── __init__.py
│   │   └── includes/
│   └── www/                       # Portal pages
```

---

# Appendix B: Issues Specific to Shoehorned (Non-Native) Frappe Apps

When an app is built outside Frappe and then retrofitted to work as a Frappe app, it typically breaks in predictable ways. This appendix documents those failure modes and fixes.

## B.1: Common Missing Pieces

| What's Missing | Symptom | Fix |
|---|---|---|
| `modules.txt` empty or wrong | Frappe doesn't know the app has modules; nothing appears | Add module name(s), one per line |
| Module Def not in database | Module won't appear in sidebar, Allowed Modules, anywhere | Create via UI at `/app/module-def` or via `after_install` hook |
| No `__init__.py` in module dirs | Python import errors, module not found | Add empty `__init__.py` to every package directory |
| Module folder name doesn't match Module Def | Workspace JSON not picked up, doctypes orphaned | Folder must be snake_case of Module Def name: "Quality Control" → `quality_control/` |
| No DocType in the module | Module invisible to non-admin users | Create a simple Settings DocType |
| `hooks.py` missing `app_name` etc | Frappe can't identify the app at all | Add all required metadata fields |
| `setup.py` / `pyproject.toml` wrong or missing | `bench install-app` fails or partially works | Copy from a working Frappe app and adapt |
| App not in `sites/apps.txt` | App code exists but isn't active | `bench --site your-site install-app your_app` |
| `add_to_apps_screen` not in hooks.py | App won't appear on v16 Desk | Add the hook (see Step 4 in main guide) |

## B.2: The Double-Nested Directory Problem

This is the #1 structural issue with shoehorned apps. Frappe requires:

```
your_app/              ← Git root / outer directory
  └── your_app/        ← Python package / inner directory (SAME NAME)
        ├── hooks.py
        ├── modules.txt
        └── your_module/
```

Shoehorned apps often have `hooks.py` at the git root (`your_app/hooks.py`) instead of inside the inner package (`your_app/your_app/hooks.py`). This breaks everything.

**Fix:** Restructure the directory layout to match the expected nesting. The outer directory is the git repo; the inner directory with the same name is the importable Python package.

## B.3: Module Name Casing Mismatches

Frappe uses three different forms of the module name in different places, and all must be consistent:

| Where | Format | Example |
|---|---|---|
| `modules.txt` | Title Case with spaces | `Quality Control` |
| Module Def `name` field | Title Case with spaces | `Quality Control` |
| Module folder name | snake_case | `quality_control` |
| Workspace JSON `module` field | Title Case with spaces | `Quality Control` |

If any of these don't match, things silently fail.

## B.4: App Not Pip-Installed in Bench Virtualenv

Frappe apps must be pip-installed (in editable mode) into the bench's virtualenv. If you manually copied your app into `apps/` without running `bench get-app` or `bench install-app`, the Python package might not be importable.

**Fix:**

```bash
# From the bench directory
source env/bin/activate
pip install -e apps/your_app
# Or
bench setup env
```

## B.5: Static Assets Not Built

After adding anything to `your_app/your_app/public/` (logos, CSS, JS), you must build:

```bash
bench build
```

Without this, `/assets/your_app/logo.png` will 404.

## B.6: Creating Module Def Programmatically

If your shoehorned app needs to create its Module Def automatically on install:

```python
# your_app/install.py
import frappe

def after_install():
    if not frappe.db.exists("Module Def", "Your Module Name"):
        doc = frappe.new_doc("Module Def")
        doc.module_name = "Your Module Name"
        doc.app_name = "your_app"
        doc.insert(ignore_permissions=True)
        frappe.db.commit()
```

In `hooks.py`:
```python
after_install = "your_app.install.after_install"
```

## B.7: Permission Check Function

A more robust permission check that works with module-based access:

```python
# your_app/api.py
import frappe
from frappe.utils import modules

def check_app_permission():
    """Check if current user has permission to access the app."""
    allowed_modules = modules.get_modules_from_all_apps_for_user()
    allowed_module_names = [x["module_name"] for x in allowed_modules]
    
    if "Your Module Name" not in allowed_module_names:
        return False
    
    roles = frappe.get_roles()
    if any(role in roles for role in [
        "System Manager",
        "Your App Manager",
        "Your App User"
    ]):
        return True
    
    return False
```

## B.8: Full Diagnostic Checklist

Run through this in order when things aren't working:

```
STRUCTURE
□ Outer dir and inner dir have the SAME NAME
□ __init__.py exists in inner dir
□ __init__.py exists in every module dir
□ hooks.py is in the inner dir (not the outer dir)
□ modules.txt is in the inner dir
□ patches.txt exists (can be empty)
□ setup.py or pyproject.toml exists and is valid

INSTALLATION
□ App is in sites/apps.txt
□ App is pip-installed in bench virtualenv
□ bench --site your-site list-apps shows your app

DATABASE
□ Module Def exists for your module (/app/module-def)
□ Module Def app_name field matches your app_name
□ At least one DocType exists in the module
□ DocType has permissions for target roles

STATIC ASSETS
□ Logo file at your_app/your_app/public/logo.png
□ bench build has been run

V16 DESK
□ add_to_apps_screen in hooks.py
□ Desktop Icons created (parent + child)
□ Workspace Sidebar created and linked
□ Workspace exists, is public, linked to module

CACHE
□ bench migrate
□ bench clear-cache  
□ bench restart
□ Hard browser refresh (Ctrl+Shift+R)
```
