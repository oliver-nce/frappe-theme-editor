document.addEventListener("DOMContentLoaded", function () {
    if (frappe.boot && frappe.boot.theme_css) {
        if (!document.getElementById("nce-theme-override")) {
            const style = document.createElement("style");
            style.id = "nce-theme-override";
            style.textContent = frappe.boot.theme_css;
            document.head.appendChild(style);
        }
    }
});
