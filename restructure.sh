#!/bin/bash
# Complete the frappe_theme_editor restructure - run from Theme_editor project root
# Level 3 created. This script copies large HTML files and removes old root duplicates.

set -e
APP=frappe_theme_editor
ROOT="$(cd "$(dirname "$0")" && pwd)/$APP"

echo "=== Frappe Theme Editor Restructure (final steps) ==="

# Copy large HTML files from root public/ to Level 2 public/
echo "Copying theme-editor*.html to Level 2 public..."
cp "$ROOT/public/theme-editor.html" "$ROOT/$APP/public/" || { echo "WARN: theme-editor.html copy failed"; }
cp "$ROOT/public/theme-editor-standalone.html" "$ROOT/$APP/public/" || { echo "WARN: theme-editor-standalone.html copy failed"; }

# Copy www/theme-editor.html to Level 2 www/
echo "Copying www/theme-editor.html..."
mkdir -p "$ROOT/$APP/www"
cp "$ROOT/www/theme-editor.html" "$ROOT/$APP/www/" || { echo "WARN: www copy failed"; }

# Remove old root-level duplicates
echo "Removing old root-level files..."
rm -rf "$ROOT/public" "$ROOT/themes" "$ROOT/www" "$ROOT/desktop_icon"

# Remove empty doctype/page/workspace dirs from Level 2 if they exist
rmdir "$ROOT/$APP/doctype/theme" 2>/dev/null || true
rmdir "$ROOT/$APP/doctype" 2>/dev/null || true
rmdir "$ROOT/$APP/page/theme_editor" 2>/dev/null || true
rmdir "$ROOT/$APP/page" 2>/dev/null || true
rmdir "$ROOT/$APP/workspace/frappe_theme_editor" 2>/dev/null || true
rmdir "$ROOT/$APP/workspace" 2>/dev/null || true

# Remove egg-info
rm -rf "$ROOT/$APP.egg-info" 2>/dev/null || true

echo "=== Done. Run: bench migrate ==="
