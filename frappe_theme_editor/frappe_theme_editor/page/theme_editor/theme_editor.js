frappe.pages['theme-editor'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Theme Editor',
        single_column: true
    });
    
    // Load the theme editor HTML directly into the page
    fetch('/assets/frappe_theme_editor/theme-editor.html')
        .then(response => response.text())
        .then(html => {
            // Extract just the body content (skip <!DOCTYPE> and <html> tags)
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Get the body content
            const bodyContent = doc.body.innerHTML;
            
            // Insert into page
            page.main.html(bodyContent);
            
            // Execute any scripts that were in the HTML
            const scripts = doc.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript);
            });
        })
        .catch(err => {
            page.main.html('<div style="padding: 40px; text-align: center;">Failed to load theme editor: ' + err.message + '</div>');
        });
};
