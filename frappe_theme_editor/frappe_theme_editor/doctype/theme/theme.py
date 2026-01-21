# Copyright (c) 2026, NCE and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import json


class Theme(Document):
	def validate(self):
		# Validate that json_data is valid JSON
		if self.json_data:
			try:
				json.loads(self.json_data)
			except json.JSONDecodeError:
				frappe.throw("Invalid JSON data")


@frappe.whitelist()
def get_all_themes():
	"""Get all themes with basic info"""
	themes = frappe.get_all(
		"Theme",
		fields=["name", "theme_name", "description", "modified"],
		order_by="modified desc"
	)
	
	# Add color swatches - calculate from hue values stored in state
	for theme in themes:
		theme_doc = frappe.get_doc("Theme", theme.name)
		try:
			json_data = json.loads(theme_doc.json_data)
			
			# State stores hue values, we need to generate the 600 shade color
			primary_hue = json_data.get("primaryHue", 210)
			neutral_hue = json_data.get("neutralHue", 210)
			
			# Generate primary-600: hue, 78% sat, 50% lightness (from CONFIG.primaryShades)
			theme["primary_color"] = hsl_to_hex(primary_hue, 78, 50)
			# Generate neutral-600: hue, 7% sat, 46% lightness (from CONFIG.neutralShades)
			theme["neutral_color"] = hsl_to_hex(neutral_hue, 7, 46)
		except:
			theme["primary_color"] = "#4299F0"
			theme["neutral_color"] = "#666666"
	
	return themes


def hsl_to_hex(h, s, l):
	"""Convert HSL to hex color"""
	s = s / 100
	l = l / 100
	
	c = (1 - abs(2 * l - 1)) * s
	x = c * (1 - abs((h / 60) % 2 - 1))
	m = l - c / 2
	
	if h < 60:
		r, g, b = c, x, 0
	elif h < 120:
		r, g, b = x, c, 0
	elif h < 180:
		r, g, b = 0, c, x
	elif h < 240:
		r, g, b = 0, x, c
	elif h < 300:
		r, g, b = x, 0, c
	else:
		r, g, b = c, 0, x
	
	r = int((r + m) * 255)
	g = int((g + m) * 255)
	b = int((b + m) * 255)
	
	return f"#{r:02x}{g:02x}{b:02x}".upper()


@frappe.whitelist()
def get_theme(name):
	"""Get a specific theme's JSON data"""
	theme = frappe.get_doc("Theme", name)
	return {
		"name": theme.name,
		"theme_name": theme.theme_name,
		"description": theme.description,
		"json_data": theme.json_data
	}


@frappe.whitelist()
def save_theme(theme_name, description, json_data):
	"""Save a new theme"""
	theme = frappe.get_doc({
		"doctype": "Theme",
		"theme_name": theme_name,
		"description": description,
		"json_data": json_data
	})
	theme.insert()
	return theme.name


@frappe.whitelist()
def update_theme(name, description, json_data):
	"""Update an existing theme"""
	theme = frappe.get_doc("Theme", name)
	theme.description = description
	theme.json_data = json_data
	theme.save()
	return theme.name


@frappe.whitelist()
def delete_theme(name):
	"""Delete a theme"""
	frappe.delete_doc("Theme", name)
	return {"success": True}
