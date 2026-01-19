# Frappe Theme Editor

A visual theme editor for Frappe/ERPNext applications. Create and customize color themes with real-time preview, then export as JSON for use in your Frappe apps.

## Features

- **Hue-based color system** - Select primary and neutral hues, get a complete shade scale (50-900)
- **Semantic colors** - Success, error, warning with automatic text contrast
- **Frappe-specific settings** - Lists, forms, navigation, indicators, print styles
- **AI agent guidance** - Embedded design principles for consistent theming
- **JSON export** - W3C Design Tokens format with Frappe CSS variable mappings

## Usage

### Standalone (Current)

1. Open `frappe-theme-editor.html` in a browser
2. Adjust colors using the visual controls
3. Click "Save Theme" to export JSON
4. Use the JSON in your Frappe app

### As Frappe App (Planned)

Future versions will include:
- DocType for saving multiple themes
- "Inject into Site" button to push CSS directly
- Theme switching for comparison

## JSON Structure

The exported JSON includes:

- **Core Theme** - Primary/neutral palettes, semantic colors, window controls
- **Frappe CSS** - Ready-to-use CSS custom properties (`--primary`, `--bg-color`, etc.)
- **Agent Guidance** - Design principles for AI-assisted development

## Files

- `frappe-theme-editor.html` - The main editor application
- `themes/default-theme.json` - Default theme configuration

## License

MIT
