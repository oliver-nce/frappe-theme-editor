$(document).on('page-change', function() {
	if (frappe.get_route_str() === 'Workspaces/Theme Editor') {
		frappe.set_route('theme-editor');
	}
});
