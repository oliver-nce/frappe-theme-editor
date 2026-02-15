# Frappe Theme Editor - Restructure Instructions

**Goal:** Reorganize the app to follow standard Frappe v15 conventions so it installs cleanly via `bench install-app`.

**Date:** February 14, 2026

**Status:** Restructure executed. Run `./restructure.sh` to copy large HTML files and remove old root duplicates, then install on your v15 bench.

---

## Context Summary

### Root Cause of All Installation Failures

When `pip install -e .` runs from the git root, `find_packages()` discovers `frappe_theme_editor/` (the inner folder) as the importable Python package. So `import frappe_theme_editor` loads **Level 2**.

Frappe then looks for `hooks.py` and `modules.txt` **inside Level 2**. But:

- `modules.txt` only exists at Level 1 → **Frappe can't find it → module never created**
- Level 2's `hooks.py` has fixtures **commented out** → fixtures never sync
- Level 2 has no Level 3 module subfolder → `.frappe`, `doctype/`, `page/` are at Level 2 instead of Level 3 → **Frappe can't find the module folder**

This is the classic "shoehorned app" problem documented in `frappe-v16-workspace-guide.md` Appendix B.

### Standard Frappe v15 App Structure (from `bench new-app`)

```
frappe_theme_editor/                 # Level 1: Git root (NO __init__.py!)
├── setup.py                         # Package build config
├── requirements.txt
├── README.md
│
└── frappe_theme_editor/             # Level 2: Python package
    ├── __init__.py                  # Has __version__
    ├── hooks.py                     # THE ONE hooks.py
    ├── modules.txt                  # Module declarations
    ├── patches.txt
    ├── public/                      # Static assets
    │   ├── logo.svg
    │   ├── theme-editor.html
    │   └── theme-editor-standalone.html
    ├── templates/
    │   └── __init__.py
    ├── www/
    │   └── theme-editor.html
    ├── themes/
    │   └── default-theme.json
    │
    └── frappe_theme_editor/         # Level 3: MODULE folder
        ├── .frappe                  # Required marker
        ├── __init__.py
        ├── doctype/
        │   ├── __init__.py
        │   └── theme/
        │       ├── __init__.py
        │       ├── theme.json
        │       ├── theme.py
        │       └── test_theme.py
        ├── page/
        │   ├── __init__.py
        │   └── theme_editor/
        │       ├── __init__.py
        │       ├── theme_editor.json
        │       ├── theme_editor.html
        │       └── theme_editor.js
        └── workspace/
            └── frappe_theme_editor/
                └── frappe_theme_editor.json
```

### Key Rules (from project docs)

- Level 1 (git root) must NOT have `__init__.py` — it is NOT a Python package
- Level 2 (Python package) has `hooks.py`, `modules.txt`, `public/`, `templates/`, `www/`
- Level 3 (module folder) has `.frappe`, `doctype/`, `page/`, `workspace/`
- Module name casing must match everywhere:
  - `modules.txt`: "Frappe Theme Editor" (Title Case)
  - Module folder name: `frappe_theme_editor` (snake_case)
  - Page JSON `module` field: "Frappe Theme Editor" (Title Case)
  - Workspace JSON `module` field: "Frappe Theme Editor" (Title Case)

---

## Steps

All paths are relative to the app root:
`/Users/oliver2/Documents/_NCE_projects/Theme_editor/frappe_theme_editor/`

### Step 1: Remove `__init__.py` from Level 1

**Delete:** `__init__.py` (at git root)

Level 1 must NOT be a Python package. The `__init__.py` here causes `find_packages()` to treat Level 1 as the importable package instead of Level 2.

### Step 2: Remove duplicate `hooks.py` from Level 1

**Delete:** `hooks.py` (at git root)

There must be only ONE `hooks.py`, at Level 2 (`frappe_theme_editor/hooks.py`).

### Step 3: Move `modules.txt` and `patches.txt` to Level 2

**Move:** `modules.txt` → `frappe_theme_editor/modules.txt`
**Move:** `patches.txt` → `frappe_theme_editor/patches.txt`

Frappe looks for these inside the Python package (Level 2).

### Step 4: Move `public/`, `themes/`, `www/` to Level 2

**Move:** `public/` → `frappe_theme_editor/public/`
**Move:** `themes/` → `frappe_theme_editor/themes/`
**Move:** `www/` → `frappe_theme_editor/www/`

Static assets and web routes must be inside the Python package.

### Step 5: Move `desktop_icon/` to Level 2

**Move:** `desktop_icon/` → `frappe_theme_editor/desktop_icon/`

### Step 6: Create Level 3 module folder

**Create directory:** `frappe_theme_editor/frappe_theme_editor/`
**Create file:** `frappe_theme_editor/frappe_theme_editor/__init__.py` (empty)

### Step 7: Move module content from Level 2 to Level 3

**Move:** `frappe_theme_editor/.frappe` → `frappe_theme_editor/frappe_theme_editor/.frappe`
**Move:** `frappe_theme_editor/doctype/` → `frappe_theme_editor/frappe_theme_editor/doctype/`
**Move:** `frappe_theme_editor/page/` → `frappe_theme_editor/frappe_theme_editor/page/`
**Move:** `frappe_theme_editor/workspace/` → `frappe_theme_editor/frappe_theme_editor/workspace/`

### Step 8: Update Level 2 `hooks.py` — enable fixtures

In `frappe_theme_editor/hooks.py`, change:

```python
# Fixtures
# --------
# fixtures = []
```

To:

```python
# Fixtures
# --------
fixtures = [
    {
        "doctype": "Page",
        "filters": [
            ["name", "in", ["theme-editor"]]
        ]
    }
]
```

### Step 9: Fix `setup.py` version import

The current `setup.py` imports version with:
```python
from frappe_theme_editor import __version__ as version
```

After removing `__init__.py` from Level 1, this import path stays the same because `find_packages()` will now find Level 2 as `frappe_theme_editor`. No change needed to setup.py.

### Step 10: Clean up

**Delete:** `frappe_theme_editor.egg-info/` (stale build artifacts)
**Delete:** `frappe_theme_editor/frappe_theme_editor/__pycache__/` (if exists)

### Step 11: Fix `requirements.txt`

The current file only has comments. This causes `setup.py` to fail when parsing it. Change contents to just an empty file or add a proper comment that won't break split():

```
# No additional dependencies - frappe is managed by bench
```

Wait — actually the current parsing (`f.read().strip().split("\n")`) would produce `['# Frappe Theme Editor dependencies', '# frappe is installed separately via bench']` which gets passed to `install_requires`. This would cause a pip warning/error. Fix by making the file empty or filtering comments.

**Replace** `requirements.txt` contents with:
```
# frappe is installed separately via bench
```

And update `setup.py` to filter comments:
```python
with open("requirements.txt") as f:
    install_requires = [
        line.strip() for line in f.readlines()
        if line.strip() and not line.strip().startswith("#")
    ]
```

---

## Verification After Restructure

### File Tree Check

After all steps, the structure should be:

```
frappe_theme_editor/                          # Level 1: Git root
├── setup.py
├── requirements.txt
├── README.md (if exists)
│
└── frappe_theme_editor/                      # Level 2: Python package
    ├── __init__.py                           # __version__ = "0.9.2.4"
    ├── hooks.py                              # With fixtures enabled
    ├── modules.txt                           # "Frappe Theme Editor"
    ├── patches.txt
    ├── desktop_icon/
    │   └── theme_editor.json
    ├── public/
    │   ├── logo.svg
    │   ├── theme-editor.html
    │   └── theme-editor-standalone.html
    ├── themes/
    │   └── default-theme.json
    ├── www/
    │   └── theme-editor.html
    │
    └── frappe_theme_editor/                  # Level 3: Module folder
        ├── .frappe
        ├── __init__.py
        ├── doctype/
        │   ├── __init__.py
        │   └── theme/
        │       ├── __init__.py
        │       ├── theme.json
        │       ├── theme.py
        │       └── test_theme.py
        ├── page/
        │   ├── __init__.py
        │   └── theme_editor/
        │       ├── __init__.py
        │       ├── theme_editor.json
        │       ├── theme_editor.html
        │       └── theme_editor.js
        └── workspace/
            └── frappe_theme_editor/
                └── frappe_theme_editor.json
```

### Installation Test

From the bench directory:

```bash
# 1. Symlink the app
ln -s /Users/oliver2/Documents/_NCE_projects/Theme_editor/frappe_theme_editor \
      apps/frappe_theme_editor

# 2. Install in dev mode
./env/bin/pip install -e apps/frappe_theme_editor

# 3. Add to apps.txt (if not already there)
echo "frappe_theme_editor" >> sites/apps.txt

# 4. Install to site
bench --site <site-name> install-app frappe_theme_editor

# 5. Verify module was created
bench --site <site-name> console
>>> frappe.get_all('Module Def', filters={'app_name': 'frappe_theme_editor'}, pluck='name')
# Should return: ['Frappe Theme Editor']

# 6. Verify page was created
>>> frappe.get_doc('Page', 'theme-editor')
# Should return the page document without error

# 7. Start server and test
bench start
# Navigate to http://<site>:8000/app/theme-editor
```

---

## Notes

- **User approval required** before each step
- **If any step is unclear or assumptions about existing code are wrong — STOP and ask**
- The `add_to_apps_screen` hook in hooks.py is v16-specific. On v15 it will be ignored harmlessly.
- The `desktop_icon/` folder is v16-specific. On v15 it will be ignored harmlessly.
- The `workspace/` folder works on both v15 and v16.
