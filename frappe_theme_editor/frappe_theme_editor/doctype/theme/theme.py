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
	
	# Add color swatches
	for theme in themes:
		theme_doc = frappe.get_doc("Theme", theme.name)
		try:
			json_data = json.loads(theme_doc.json_data)
			theme["primary_color"] = json_data.get("primary", {}).get("hue", 200)
			theme["neutral_color"] = json_data.get("neutral", {}).get("hue", 0)
		except:
			theme["primary_color"] = 200
			theme["neutral_color"] = 0
	
	return themes


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
