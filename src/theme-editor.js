    // NCE DESIGN SYSTEM - THEME EDITOR MODULE
    // Wrapped in IIFE for encapsulation
    // ═══════════════════════════════════════════════════════════════════════════
    (function() {
        'use strict';
        
    // ═══════════════════════════════════════════════════════════════════════════
    // DOM CACHE - Cache frequently accessed elements for performance
    // ═══════════════════════════════════════════════════════════════════════════
    const DOM = {
        // Main containers
        body: document.body,
        
        // Editor panels
        editorPanel: null,
        colorPickerPanel: null,
        neutralPickerPanel: null,
        scaleBumpPanel: null,
        
        // Color grids
        primaryGrid: null,
        neutralGrid: null,
        semanticGrid: null,
        windowGrid: null,
        
        // Modal elements
        modalOverlay: null,
        modalContent: null,
        
        // Sliders
        hueSlider: null,
        satSlider: null,
        
        // Preview swatches
        previewSwatch: null,
        neutralPreviewSwatch: null,
        
        // Output areas
        cssOutput: null,
        
        // Initialize cache - called after DOM is ready
        init() {
            this.editorPanel = document.getElementById('editorPanel');
            this.colorPickerPanel = document.getElementById('colorPickerPanel');
            this.neutralPickerPanel = document.getElementById('neutralPickerPanel');
            this.scaleBumpPanel = document.getElementById('scaleBumpPanel');
            
            this.primaryGrid = document.getElementById('primaryGrid');
            this.neutralGrid = document.getElementById('neutralGrid');
            this.semanticGrid = document.getElementById('semanticGrid');
            this.windowGrid = document.getElementById('windowGrid');
            
            this.modalOverlay = document.getElementById('modalOverlay');
            this.modalContent = document.getElementById('modalContent');
            
            this.hueSlider = document.getElementById('hueSlider');
            this.satSlider = document.getElementById('satSlider');
            
            this.previewSwatch = document.getElementById('previewSwatch');
            this.neutralPreviewSwatch = document.getElementById('neutralPreviewSwatch');
            
            this.cssOutput = document.getElementById('cssOutput');
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // EVENT DELEGATION - Central event handler for all interactive elements
    // ═══════════════════════════════════════════════════════════════════════════
    function handleDelegatedClick(event) {
        const target = event.target.closest('[data-action]');
        if (!target) return;
        
        const action = target.dataset.action;
        const targetId = target.dataset.target;
        const value = target.dataset.value;
        
        // Prevent default for buttons
        if (target.tagName === 'BUTTON') {
            event.preventDefault();
        }
        
        // Route actions to appropriate handlers
        switch(action) {
            // Tab navigation
            case 'switch-tab':
                switchTab(targetId || value);
                break;
            case 'switch-subtab':
                switchSubtab(targetId || value);
                break;
                
            // Editor actions
            case 'toggle-editor':
                toggleEditor(targetId);
                break;
                
            // Swatch picker actions
            case 'toggle-swatch-picker':
                toggleSwatchPicker(targetId || value);
                break;
            case 'select-swatch':
                selectSwatchOption(targetId, value);
                break;
            case 'eyedropper':
                handleEyedropper();
                break;
                
            // Gray picker actions
            case 'toggle-gray-picker':
                toggleGrayPicker(targetId || value);
                break;
            case 'select-gray':
                const grayName = target.dataset.name || '';
                selectGray(targetId, value, grayName);
                break;
            case 'apply-neutral':
                applyNeutralColor();
                break;
                
            // Scale bump actions
            case 'bump-anchor':
                bumpAnchor(parseInt(value));
                break;
            case 'bump-neutral':
                bumpNeutralScale(parseInt(value));
                break;
                
            // Styled menu actions
            case 'toggle-menu':
                toggleStyledMenu(targetId);
                break;
            case 'select-menu-option':
                selectStyledMenu(targetId, value);
                break;
                
            // Font menu
            case 'select-font':
                selectFontMenu(value);
                break;
                
            // Navbar picker
            case 'toggle-navbar-picker':
                toggleNavbarPicker();
                break;
            case 'select-navbar-theme':
                selectNavbarTheme(value);
                break;
                
            // Typography actions
            case 'toggle-bold':
                toggleBold();
                break;
                
            // Background/gradient actions
            case 'toggle-gradient':
                toggleGradient(target.checked);
                break;
            case 'move-text-flip':
                moveTextFlip(parseInt(value));
                break;
                
            // Modal actions
            case 'show-modal':
                if (targetId === 'save') showSaveModal();
                else if (targetId === 'load') showLoadModal();
                else if (targetId === 'reset') showResetModal();
                break;
            case 'close-modal':
                closeModal();
                break;
            case 'confirm-save':
                confirmSave();
                break;
            case 'confirm-load':
                confirmLoad();
                break;
            case 'confirm-reset':
                confirmReset();
                break;
                
            // Copy CSS
            case 'copy-css':
                copyCSS();
                break;
                
            default:
                console.log('Unhandled action:', action, 'target:', targetId, 'value:', value);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // INITIALIZATION - Set up event delegation after DOM is ready
    // ═══════════════════════════════════════════════════════════════════════════
    function initializeApp() {
        // Cache DOM elements
        DOM.init();
        
        // Set up event delegation for clicks and changes
        document.addEventListener('click', handleDelegatedClick);
        document.addEventListener('change', handleDelegatedClick);
        
        // Initialize neutral picker
        buildNeutralGrid();
        if (DOM.neutralPreviewSwatch) {
            DOM.neutralPreviewSwatch.style.backgroundColor = hsvToHex(210, 8, 62);
        }
        
        // Initialize color grids and UI
        buildColorGrid();
        updateUI();
        
        // Initialize draggable modal
        initDraggableEditor();
        
        console.log('✅ NCE Theme Editor initialized');
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // FRAPPE ONLY: JS START - Tab/Subtab Switching
    // ═══════════════════════════════════════════════════════════════════════════
    
    function switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            // Check both data-target and data-value for compatibility
            if (btn.dataset.target === tabId || btn.dataset.value === tabId) {
                btn.classList.add('active');
            }
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const targetTab = document.getElementById('tab-' + tabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }
    
    function switchSubtab(subtabId) {
        // Update subtab buttons
        document.querySelectorAll('.subtab-btn').forEach(btn => {
            btn.classList.remove('active');
            // Check both data-target and data-value for compatibility
            if (btn.dataset.target === subtabId || btn.dataset.value === subtabId) {
                btn.classList.add('active');
            }
        });
        
        // Update subtab content
        document.querySelectorAll('.subtab-content').forEach(content => {
            content.classList.remove('active');
        });
        const targetSubtab = document.getElementById('subtab-' + subtabId);
        if (targetSubtab) {
            targetSubtab.classList.add('active');
        }
    }
    
    function updateFrappeState(key, value) {
        frappeState[key] = value;
        console.log('Frappe state updated:', key, '=', value);
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // FRAPPE ONLY: JS END - Tab/Subtab Switching
    // ═══════════════════════════════════════════════════════════════════════════
    
    function getTokenColor(token) {
        // Handle special values
        if (token === 'white') return '#ffffff';
        if (token === 'black') return '#000000';
        
        // Parse token like "primary-50" or "neutral-300"
        const [type, shade] = token.split('-');
        const shadeNum = parseInt(shade);

        if (type === 'primary') {
            // If this is the anchor shade, return exact hex
            if (state.anchorShade === shadeNum && state.anchorHex) {
                return state.anchorHex;
            }
            
            const shades = CONFIG.primaryShades;
            const currentIdx = shades.findIndex(s => s.shade === shadeNum);
            
            if (currentIdx !== -1) {
                let config = shades[currentIdx];
                
                if (state.anchorShade && state.anchorL !== null) {
                    // Anchor mode: calculate lightness relative to anchor
                    const anchorConfig = shades.find(s => s.shade === state.anchorShade);
                    if (anchorConfig) {
                        const offset = state.anchorL - anchorConfig.l;
                        const adjustedL = Math.max(5, Math.min(98, config.l + offset));
                        return hslToHex(state.primaryHue, state.primarySat || config.s, adjustedL);
                    }
                } else if (state.shadeOffset) {
                    // Quantum shift mode: use config from shifted index
                    const shiftedIdx = Math.max(0, Math.min(shades.length - 1, currentIdx + state.shadeOffset));
                    config = shades[shiftedIdx];
                }
                
                return hslToHex(state.primaryHue, state.primarySat || config.s, config.l);
            }
        } else if (type === 'neutral') {
            const shades = CONFIG.neutralShades;
            const currentIdx = shades.findIndex(s => s.shade === shadeNum);
            let config = shades.find(s => s.shade === shadeNum);
            
            // Apply neutral offset (bump)
            if (state.neutralOffset && currentIdx !== -1) {
                const shiftedIdx = Math.max(0, Math.min(shades.length - 1, currentIdx + state.neutralOffset));
                config = shades[shiftedIdx];
            }
            
            if (config) return hslToHex(state.neutralHue, config.s, config.l);
        }
        return '#cccccc';
    }
    
    // Get nested panel color (progressively darker behind white container)
    // Container is always white → Nested panels behind it go progressively darker
    function getNestedPanelColor(level = 1) {
        const baseL = 100; // Start from white (the container)
        
        // 4% lightness step per level - going darker
        const stepPercent = 4;
        const lightnessChange = stepPercent * level;
        
        // Always go darker from white container
        const newL = Math.max(5, baseL - lightnessChange);
        
        // Return neutral gray (same saturation as neutral tokens: 5%)
        return hslToHex(state.neutralHue, 5, newL);
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // FRAPPE ONLY: JS START - Frappe Settings UI Functions
    // (initFrappeSwatches, updateInheritedSwatches, swatch pickers for Frappe settings)
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Pure Gray Palette (no color cast)
    const PURE_GRAYS = [
        { name: 'White', hex: '#ffffff' },
        { name: 'Gray 50', hex: '#fafafa' },
        { name: 'Gray 100', hex: '#f5f5f5' },
        { name: 'Gray 200', hex: '#eeeeee' },
        { name: 'Gray 300', hex: '#cccccc' },
        { name: 'Gray 400', hex: '#aaaaaa' },
        { name: 'Gray 500', hex: '#888888' },
        { name: 'Gray 600', hex: '#666666' },
        { name: 'Gray 700', hex: '#444444' },
        { name: 'Gray 800', hex: '#333333' },
        { name: 'Gray 900', hex: '#1a1a1a' },
        { name: 'Black', hex: '#000000' }
    ];
    
    function toggleGrayPicker(pickerId) {
        const dropdown = document.getElementById(pickerId + '-dropdown');
        
        // Build dropdown if not built yet
        if (!dropdown.dataset.built) {
            buildGrayDropdown(pickerId);
        }
        
        // Close other dropdowns
        document.querySelectorAll('.gray-picker-dropdown, .swatch-picker-dropdown, .styled-menu-dropdown').forEach(d => {
            if (d.id !== pickerId + '-dropdown') d.classList.remove('open');
        });
        
        dropdown.classList.toggle('open');
    }
    
    function buildGrayDropdown(pickerId) {
        const dropdown = document.getElementById(pickerId + '-dropdown');
        const stateKey = pickerId.replace('gray-', '');
        const currentValue = frappeState[stateKey];
        
        let html = '<div class="gray-grid">';
        PURE_GRAYS.forEach(gray => {
            const selected = currentValue === gray.hex ? 'selected' : '';
            html += `<div class="gray-option ${selected}" 
                         style="background: ${gray.hex}; ${gray.hex === '#ffffff' ? 'border: 1px solid #ddd;' : ''}"
                         data-hex="${gray.hex}" 
                         data-name="${gray.name}"
                         data-action="select-gray"
                         data-target="${pickerId}"
                         data-value="${gray.hex}"
                         title="${gray.name}"></div>`;
        });
        html += '</div>';
        
        dropdown.innerHTML = html;
        dropdown.dataset.built = 'true';
    }
    
    function selectGray(pickerId, hex, name) {
        const stateKey = pickerId.replace('gray-', '');
        frappeState[stateKey] = hex;
        
        // Update trigger display
        const picker = document.getElementById(pickerId);
        const swatch = picker.querySelector('.gray-swatch');
        const label = picker.querySelector('.gray-label');
        
        if (swatch) swatch.style.background = hex;
        if (label) label.textContent = name;
        
        // Update selected state in dropdown
        const dropdown = document.getElementById(pickerId + '-dropdown');
        dropdown.querySelectorAll('.gray-option').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.hex === hex);
        });
        
        // Close dropdown
        dropdown.classList.remove('open');
        
        console.log('B&W state updated:', stateKey, '=', hex);
    }
    
    function initGrayPickers() {
        // Initialize all gray pickers with current state
        const grayPickers = ['printHeadingBW', 'printTextBW', 'printTableHeaderBW', 'printTableBorderBW', 'printFooterBW'];
        
        grayPickers.forEach(key => {
            const picker = document.getElementById('gray-' + key);
            if (!picker) return;
            
            const hex = frappeState[key];
            const gray = PURE_GRAYS.find(g => g.hex === hex) || { name: 'Custom', hex: hex };
            
            const swatch = picker.querySelector('.gray-swatch');
            const label = picker.querySelector('.gray-label');
            
            if (swatch) swatch.style.background = hex;
            if (label) label.textContent = gray.name;
        });
    }
    
    function updateSwatch(swatchId, token) {
        const swatch = document.getElementById('swatch-' + swatchId);
        if (swatch) {
            swatch.style.backgroundColor = getTokenColor(token);
        }
    }
    
    function updateNavbarSwatch(theme) {
        const swatch = document.getElementById('swatch-navbar');
        if (!swatch) return;
        
        if (theme === 'dark') {
            swatch.style.backgroundColor = getTokenColor('neutral-900');
        } else if (theme === 'light') {
            swatch.style.backgroundColor = '#ffffff';
        } else if (theme === 'primary') {
            swatch.style.backgroundColor = getTokenColor('primary-700');
        }
    }
    
    function initFrappeSwatches() {
        // Init navbar picker
        initNavbarPicker();
        
        // Update inherited swatches from Core Theme
        const primarySwatch = document.getElementById('inherited-primary');
        if (primarySwatch) {
            primarySwatch.style.backgroundColor = getTokenColor('primary-600');
        }
        
        const bgSwatch = document.getElementById('inherited-bg-color');
        if (bgSwatch) {
            // Page background - read from Core Theme state
            bgSwatch.style.backgroundColor = getTokenColor(state.pageBg);
            if (state.pageBg === 'white') {
                bgSwatch.style.border = '1px solid #ddd';
            }
        }
        
        const fgSwatch = document.getElementById('inherited-fg-color');
        if (fgSwatch) {
            // Panel/card background - read from Core Theme state
            fgSwatch.style.backgroundColor = getTokenColor(state.panelBg);
            if (state.panelBg === 'white') {
                fgSwatch.style.border = '1px solid #ddd';
            }
        }
        
        // Update inherited list swatches (from Common Elements)
        const listHoverSwatch = document.getElementById('inherited-list-hover');
        if (listHoverSwatch) {
            listHoverSwatch.style.backgroundColor = getTokenColor(frappeState.rowHoverColor);
        }
        
        const listSelectionSwatch = document.getElementById('inherited-list-selection');
        if (listSelectionSwatch) {
            listSelectionSwatch.style.backgroundColor = getTokenColor(frappeState.rowSelectionColor);
        }
        
        const listAlternateSwatch = document.getElementById('inherited-list-alternate');
        if (listAlternateSwatch) {
            listAlternateSwatch.style.backgroundColor = getTokenColor(frappeState.alternateRowColor);
        }
        
        // Form inherited swatches
        const formRequiredSwatch = document.getElementById('inherited-form-required');
        if (formRequiredSwatch) {
            // Uses error color from semantic colors
            formRequiredSwatch.style.backgroundColor = hslToHex(state.error.h, state.error.s, Math.min(state.error.l, 50));
        }
        
        const formInputBgSwatch = document.getElementById('inherited-form-input-bg');
        if (formInputBgSwatch) {
            formInputBgSwatch.style.backgroundColor = getTokenColor(frappeState.controlBg);
        }
        
        const formFocusSwatch = document.getElementById('inherited-form-focus');
        if (formFocusSwatch) {
            formFocusSwatch.style.backgroundColor = getTokenColor(frappeState.focusRingColor);
        }
        
        const formBorderSwatch = document.getElementById('inherited-form-border');
        if (formBorderSwatch) {
            formBorderSwatch.style.backgroundColor = getTokenColor(frappeState.defaultBorderColor);
        }
        
        // Indicator inherited swatches (from semantic colors - use exact same color)
        const indicatorGreen = document.getElementById('inherited-indicator-green');
        if (indicatorGreen) {
            indicatorGreen.style.backgroundColor = hslToHex(state.success.h, state.success.s, state.success.l);
        }
        
        const indicatorRed = document.getElementById('inherited-indicator-red');
        if (indicatorRed) {
            indicatorRed.style.backgroundColor = hslToHex(state.error.h, state.error.s, state.error.l);
        }
        
        const indicatorOrange = document.getElementById('inherited-indicator-orange');
        if (indicatorOrange) {
            indicatorOrange.style.backgroundColor = hslToHex(state.warning.h, state.warning.s, state.warning.l);
        }
        
        // Navigation inherited swatches
        const navNavbar = document.getElementById('inherited-nav-navbar');
        if (navNavbar) {
            const theme = frappeState.navbarTheme;
            if (theme === 'dark') {
                navNavbar.style.backgroundColor = '#1a1a1a';
            } else if (theme === 'light') {
                navNavbar.style.backgroundColor = '#ffffff';
                navNavbar.style.border = '1px solid #ddd';
            } else {
                navNavbar.style.backgroundColor = getTokenColor('primary-700');
            }
        }
        
        // Update all swatch pickers
        document.querySelectorAll('.swatch-picker').forEach(picker => {
            updateSwatchPicker(picker);
        });
        
        // Initialize color inputs
        initColorInputs();
        
        // Initialize B&W gray pickers
        initGrayPickers();
    }
    
    // Swatch Picker Functions
    const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
    
    function buildSwatchGrid(pickerId) {
        const dropdown = document.getElementById(pickerId + '-dropdown');
        if (!dropdown || dropdown.dataset.built) return;
        
        const stateKey = pickerId.replace('picker-', '');
        
        // Determine which state to read from
        const coreKeys = ['pageBg', 'panelBg'];
        const currentValue = coreKeys.includes(stateKey) ? state[stateKey] : frappeState[stateKey];
        
        // Include white option for background pickers
        const includeWhite = ['pageBg', 'panelBg'].includes(stateKey);
        
        let html = '';
        
        if (includeWhite) {
            html += `
            <div class="swatch-grid-section">
                <div class="swatch-grid-label">Special</div>
                <div class="swatch-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="swatch-grid-item${currentValue === 'white' ? ' selected' : ''}" 
                        data-value="white" data-shade="white" style="background: #fff; border: 1px solid #ddd;"
                        data-action="select-swatch" data-target="${pickerId}"
                       ></div>
                    <div class="swatch-grid-item${currentValue === 'black' ? ' selected' : ''}" 
                        data-value="black" data-shade="black" style="background: #000;"
                        data-action="select-swatch" data-target="${pickerId}"
                       ></div>
                </div>
            </div>`;
        }
        
        // Panel background should only show neutrals (Apple/Google HIG)
        const neutralOnly = stateKey === 'panelBg';
        
        if (!neutralOnly) {
            html += `
            <div class="swatch-grid-section">
                <div class="swatch-grid-label">Primary</div>
                <div class="swatch-grid">
                    ${SHADES.map(s => `<div class="swatch-grid-item${currentValue === 'primary-'+s ? ' selected' : ''}" 
                        data-value="primary-${s}" data-shade="${s}" 
                        data-action="select-swatch" data-target="${pickerId}"
                       ></div>`).join('')}
                </div>
            </div>`;
        }
        
        html += `
            <div class="swatch-grid-section">
                <div class="swatch-grid-label">Neutral</div>
                <div class="swatch-grid">
                    ${SHADES.map(s => `<div class="swatch-grid-item${currentValue === 'neutral-'+s ? ' selected' : ''}" 
                        data-value="neutral-${s}" data-shade="${s}" 
                        data-action="select-swatch" data-target="${pickerId}"
                       ></div>`).join('')}
                </div>
            </div>`;
        
        dropdown.innerHTML = html;
        dropdown.dataset.built = 'true';
        updateSwatchGridColors(pickerId);
    }
    
    function updateSwatchGridColors(pickerId) {
        const dropdown = document.getElementById(pickerId + '-dropdown');
        if (!dropdown) return;
        
        dropdown.querySelectorAll('.swatch-grid-item').forEach(item => {
            const value = item.dataset.value;
            item.style.backgroundColor = getTokenColor(value);
        });
    }
    
    function toggleSwatchPicker(pickerId) {
        const dropdown = document.getElementById(pickerId + '-dropdown');
        const isOpen = dropdown.classList.contains('open');
        
        // Close all dropdowns first
        document.querySelectorAll('.swatch-picker-dropdown').forEach(d => d.classList.remove('open'));
        
        // Build and toggle this one
        if (!isOpen) {
            buildSwatchGrid(pickerId);
            dropdown.classList.add('open');
        }
    }
    
    function selectSwatchOption(pickerId, value) {
        const stateKey = pickerId.replace('picker-', '');
        
        // Check if this is a Core Theme picker or Frappe picker
        const coreKeys = ['pageBg', 'panelBg'];
        if (coreKeys.includes(stateKey)) {
            state[stateKey] = value;
            updateUI(); // Refresh Core Theme UI
        } else {
            frappeState[stateKey] = value;
        }
        
        // Update trigger display
        const trigger = document.querySelector(`#${pickerId} .trigger-swatch`);
        const triggerLabel = document.querySelector(`#${pickerId} .trigger-label`);
        if (trigger) trigger.style.backgroundColor = getTokenColor(value);
        if (triggerLabel) triggerLabel.textContent = value;
        
        // Update selected state in grid
        const dropdown = document.getElementById(pickerId + '-dropdown');
        dropdown.querySelectorAll('.swatch-grid-item').forEach(item => {
            item.classList.toggle('selected', item.dataset.value === value);
        });
        
        // Close dropdown
        dropdown.classList.remove('open');
        
        // Update inherited swatches that may depend on this value
        updateInheritedSwatches();
        
        console.log('State updated:', stateKey, '=', value);
    }
    
    // Update all inherited swatches when parent values change
    function updateInheritedSwatches() {
        // Common Elements inherited in Lists
        const listHover = document.getElementById('inherited-list-hover');
        if (listHover) listHover.style.backgroundColor = getTokenColor(frappeState.rowHoverColor);
        
        const listSelection = document.getElementById('inherited-list-selection');
        if (listSelection) listSelection.style.backgroundColor = getTokenColor(frappeState.rowSelectionColor);
        
        const listAlternate = document.getElementById('inherited-list-alternate');
        if (listAlternate) listAlternate.style.backgroundColor = getTokenColor(frappeState.alternateRowColor);
        
        // Common Elements inherited in Forms
        const formInputBg = document.getElementById('inherited-form-input-bg');
        if (formInputBg) formInputBg.style.backgroundColor = getTokenColor(frappeState.controlBg);
        
        const formFocus = document.getElementById('inherited-form-focus');
        if (formFocus) formFocus.style.backgroundColor = getTokenColor(frappeState.focusRingColor);
        
        const formBorder = document.getElementById('inherited-form-border');
        if (formBorder) formBorder.style.backgroundColor = getTokenColor(frappeState.defaultBorderColor);
        
        // Navbar inherited in Navigation
        const navNavbar = document.getElementById('inherited-nav-navbar');
        if (navNavbar) {
            const theme = frappeState.navbarTheme;
            navNavbar.style.border = 'none';
            if (theme === 'dark') {
                navNavbar.style.backgroundColor = '#1a1a1a';
            } else if (theme === 'light') {
                navNavbar.style.backgroundColor = '#ffffff';
                navNavbar.style.border = '1px solid #ddd';
            } else {
                navNavbar.style.backgroundColor = getTokenColor('primary-700');
            }
        }
        
        // Core Theme inherited in Frappe CSS Variables
        const primarySwatch = document.getElementById('inherited-primary');
        if (primarySwatch) primarySwatch.style.backgroundColor = getTokenColor('primary-600');
        
        const bgSwatch = document.getElementById('inherited-bg-color');
        if (bgSwatch) {
            bgSwatch.style.backgroundColor = getTokenColor(state.pageBg);
            bgSwatch.style.border = state.pageBg === 'white' ? '1px solid #ddd' : 'none';
        }
        
        const fgSwatch = document.getElementById('inherited-fg-color');
        if (fgSwatch) {
            fgSwatch.style.backgroundColor = getTokenColor(state.panelBg);
            fgSwatch.style.border = state.panelBg === 'white' ? '1px solid #ddd' : 'none';
        }
        
        // Print inherited
        const printAlternate = document.getElementById('inherited-print-alternate');
        if (printAlternate) printAlternate.style.backgroundColor = getTokenColor(frappeState.alternateRowColor);
    }
    
    function updateSwatchPicker(picker) {
        const pickerId = picker.id;
        const stateKey = pickerId.replace('picker-', '');

        // Determine which state to read from
        const coreKeys = ['pageBg', 'panelBg'];
        const value = coreKeys.includes(stateKey) ? state[stateKey] : frappeState[stateKey];

        // Update trigger swatch color
        const trigger = picker.querySelector('.trigger-swatch');
        const triggerLabel = picker.querySelector('.trigger-label');
        if (trigger && value) {
            trigger.style.backgroundColor = getTokenColor(value);
            if (value === 'white') {
                trigger.style.border = '1px solid #ddd';
            } else {
                trigger.style.border = 'none';
            }
        }
        if (triggerLabel && value) {
            triggerLabel.textContent = value;
        }

        // Rebuild grid colors - force rebuild to reflect offset changes
        const dropdown = document.getElementById(pickerId + '-dropdown');
        if (dropdown) {
            dropdown.dataset.built = '';  // Force rebuild with new colors
            // If dropdown is visible, rebuild now
            if (dropdown.classList.contains('active')) {
                buildSwatchGrid(dropdown, pickerId, stateKey);
            }
        }
    }
    
    // Navbar Theme Picker Functions
    function toggleNavbarPicker() {
        const dropdown = document.getElementById('picker-navbarTheme-dropdown');
        const isOpen = dropdown.classList.contains('open');
        
        // Close all dropdowns first
        document.querySelectorAll('.swatch-picker-dropdown').forEach(d => d.classList.remove('open'));
        
        if (!isOpen) {
            // Update primary swatch color
            const primarySwatch = document.getElementById('navbar-primary-swatch');
            if (primarySwatch) {
                primarySwatch.style.backgroundColor = getTokenColor('primary-700');
            }
            dropdown.classList.add('open');
        }
    }
    
    function selectNavbarTheme(value, label) {
        frappeState.navbarTheme = value;
        
        // Update trigger
        const triggerSwatch = document.getElementById('navbar-trigger-swatch');
        const triggerLabel = document.getElementById('navbar-trigger-label');
        
        if (value === 'dark') {
            triggerSwatch.style.backgroundColor = '#1a1a1a';
        } else if (value === 'light') {
            triggerSwatch.style.backgroundColor = '#ffffff';
            triggerSwatch.style.border = '1px solid #ddd';
        } else {
            triggerSwatch.style.backgroundColor = getTokenColor('primary-700');
            triggerSwatch.style.border = 'none';
        }
        triggerLabel.textContent = label;
        
        // Update selected state
        document.querySelectorAll('#picker-navbarTheme-dropdown .swatch-picker-option').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.value === value);
        });
        
        // Close dropdown
        document.getElementById('picker-navbarTheme-dropdown').classList.remove('open');
        
        // Update inherited swatches that depend on this
        updateInheritedSwatches();
        
        console.log('Navbar theme:', value);
    }
    
    function initNavbarPicker() {
        const value = frappeState.navbarTheme;
        const triggerSwatch = document.getElementById('navbar-trigger-swatch');
        const triggerLabel = document.getElementById('navbar-trigger-label');
        
        if (value === 'dark') {
            triggerSwatch.style.backgroundColor = '#1a1a1a';
            triggerLabel.textContent = 'Dark';
        } else if (value === 'light') {
            triggerSwatch.style.backgroundColor = '#ffffff';
            triggerSwatch.style.border = '1px solid #ddd';
            triggerLabel.textContent = 'Light';
        } else {
            triggerSwatch.style.backgroundColor = getTokenColor('primary-700');
            triggerLabel.textContent = 'Primary';
        }
    }
    
    // Color Input Functions
    function updateColorInput(key, hexValue) {
        frappeState[key] = hexValue;
        console.log('Color updated:', key, '=', hexValue);
    }
    
    function initColorInputs() {
        // Initialize purple indicator with Frappe's default purple
        const purpleInput = document.getElementById('color-indicatorPurple');
        if (purpleInput) {
            purpleInput.value = frappeState.indicatorPurple;
        }
    }
    
    // Styled Menu Functions
    function toggleStyledMenu(menuId) {
        const dropdown = document.getElementById(menuId + '-dropdown');
        const isOpen = dropdown.classList.contains('open');
        
        // Close all dropdowns first
        document.querySelectorAll('.swatch-picker-dropdown, .styled-menu-dropdown').forEach(d => d.classList.remove('open'));
        
        if (!isOpen) {
            dropdown.classList.add('open');
        }
    }
    
    function selectStyledMenu(stateKey, value, label) {
        frappeState[stateKey] = value;
        
        // Update trigger label
        const menu = document.getElementById('menu-' + stateKey);
        const triggerLabel = menu.querySelector('.menu-label');
        if (triggerLabel) triggerLabel.textContent = label;
        
        // Update selected state
        menu.querySelectorAll('.styled-menu-option').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.value === value);
        });
        
        // Close dropdown
        document.getElementById('menu-' + stateKey + '-dropdown').classList.remove('open');
        
        // Update inherited swatches
        updateInheritedSwatches();
        
        console.log('Frappe state updated:', stateKey, '=', value);
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.swatch-picker') && !e.target.closest('.styled-menu') && !e.target.closest('.gray-picker')) {
            document.querySelectorAll('.swatch-picker-dropdown, .styled-menu-dropdown, .gray-picker-dropdown').forEach(d => d.classList.remove('open'));
        }
    });
    // ═══════════════════════════════════════════════════════════════════════════
    // FRAPPE ONLY: JS END - Frappe Settings UI Functions
    // ═══════════════════════════════════════════════════════════════════════════
    
    // ═══════════════════════════════════════════════════════════════════════════
    // MODAL DIALOG (SHARED)
    // ═══════════════════════════════════════════════════════════════════════════
    
    function showResetModal() {
        document.getElementById('modalContent').innerHTML = `
            <div class="modal-title">Reset to Defaults</div>
            <div class="modal-message">This will reset all colors to default values. Your current theme will be lost unless saved first.</div>
            <div class="modal-buttons">
                <button class="btn btn-secondary" data-action="close-modal" data-action="close-modal">Cancel</button>
                <button class="btn btn-primary" data-action="confirm-reset">Reset</button>
            </div>
        `;
        document.getElementById('modalOverlay').classList.add('show');
    }
    
    function confirmReset() {
        closeModal();
        localStorage.removeItem('colorEditorState');
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        updateUI();
    }
    
    function showLoadModal() {
        document.getElementById('modalContent').innerHTML = `
            <div class="modal-title">Load Theme</div>
            <div class="modal-message">Loading a theme will overwrite your current settings. Save your current theme first if you want to keep it.</div>
            <div class="modal-buttons">
                <button class="btn btn-secondary" data-action="close-modal">Cancel</button>
                <button class="btn btn-primary" data-action="confirm-load">Continue</button>
            </div>
        `;
        document.getElementById('modalOverlay').classList.add('show');
    }
    
    function confirmLoad() {
        closeModal();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const theme = JSON.parse(event.target.result);
                    
                    if (!theme.colors) {
                        showErrorModal('Invalid theme file format');
                        return;
                    }
                    
                    if (theme.colors.primary) {
                        state.primaryHue = theme.colors.primary.hue;
                        state.defaultShade = theme.colors.primary.defaultShade || 400;
                    }
                    if (theme.colors.neutral) state.neutralHue = theme.colors.neutral.hue;
                    if (theme.colors.semantic) {
                        if (theme.colors.semantic.success) state.success = theme.colors.semantic.success;
                        if (theme.colors.semantic.error) state.error = theme.colors.semantic.error;
                        if (theme.colors.semantic.warning) state.warning = theme.colors.semantic.warning;
                    }
                    if (theme.colors.window) {
                        if (theme.colors.window.close) state.close = theme.colors.window.close;
                        if (theme.colors.window.minimize) state.minimize = theme.colors.window.minimize;
                        if (theme.colors.window.maximize) state.maximize = theme.colors.window.maximize;
                    }
                    if (theme.colors.buttons?.gradient) {
                        state.gradient.angle = theme.colors.buttons.gradient.angle;
                    }
                    
                    updateUI();
                } catch (err) {
                    showErrorModal('Failed to load theme: ' + err.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
    
    function showSaveModal() {
        const timestamp = new Date().toISOString().split('T')[0];
        const defaultName = `NCE Theme ${timestamp}`;
        
        document.getElementById('modalContent').innerHTML = `
            <div class="modal-title">Save Theme</div>
            <div class="modal-message">Choose a name for your theme:</div>
            <input type="text" class="modal-input" id="themeNameInput" value="${defaultName}" placeholder="Theme name">
            <div class="modal-buttons">
                <button class="btn btn-secondary" data-action="close-modal">Cancel</button>
                <button class="btn btn-primary" data-action="confirm-save">Save</button>
            </div>
        `;
        
        document.getElementById('modalOverlay').classList.add('show');
        
        setTimeout(() => {
            const input = document.getElementById('themeNameInput');
            input.focus();
            input.select();
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') confirmSave();
            });
        }, 100);
    }
    
    function confirmSave() {
        const themeName = document.getElementById('themeNameInput').value.trim() || 'NCE Theme';
        const timestamp = new Date().toISOString().split('T')[0];
        
        // W3C Design Tokens Format (2025.10)
        // https://www.w3.org/community/design-tokens/
        const theme = {
            "$name": themeName,
            "$description": "NCE Design System theme for business web applications and Frappe applications. Hue-based color system with AI agent guidance.",
            "$version": "1.0.0",
            "$created": new Date().toISOString(),
            
            // ═══════════════════════════════════════════════════════════════
            // $extensions - Custom metadata including AI agent guidance
            // ═══════════════════════════════════════════════════════════════
            "$extensions": {
                "nce-design-system": {
                    "philosophy": {
                        "purpose": "Business web applications and Frappe applications",
                        "principles": [
                            "Usability, clarity, and visual hierarchy",
                            "Color hue as the central organizing principle",
                            "Style differences reflect functional distinctions, not decorative whim",
                            "Color and emphasis must communicate meaning"
                        ],
                        "consistency": "Where a style is defined for a UI element, apply it consistently to the same element type across the application. This ensures visual continuity and reinforces learned user behavior."
                    },
                    "agentGuidance": {
                        "colorSelection": {
                            "hueSystem": "Each hue provides related variants with controlled saturation and lightness. These variants work together as coherent palettes, not isolated colors.",
                            "textContrast": "Text colors are automatically chosen to ensure sufficient contrast and legibility, especially for alerts and status elements.",
                            "actionWeight": {
                                "highImpact": "Darker colors (shades 600-900) for irreversible or high-impact actions: Save, Reset, Exit, Quit, Delete",
                                "lowImpact": "Lighter variants (shades 100-400) for lower-priority or less consequential actions"
                            }
                        },
                        "neutralUsage": {
                            "purpose": "Provide visual rest and contrast where strong colors would be distracting",
                            "applications": [
                                "Page backgrounds",
                                "Alternating row backgrounds in lists",
                                "Low-contrast structural elements"
                            ]
                        },
                        "decisionRules": {
                            "undefinedElements": "If a UI element is not explicitly defined, choose styles within the existing theme gamut, maintaining consistency with the overall design system.",
                            "functionalAreas": "Elements within the same functional area should NOT use different colors for visual variety alone.",
                            "meaningfulDifference": "Style differences must reflect functional distinctions, not decorative whim.",
                            "whenInDoubt": "Choose the more subtle/neutral option — it is easier to add emphasis than remove it."
                        },
                        "rules": {
                            "do": [
                                "Use the defined shade scale (50-900) — never interpolate custom lightness values",
                                "Match button importance to action consequence (darker = more impactful)",
                                "Use semantic colors (success/error/warning) only for their intended meaning",
                                "Maintain consistent element styling within functional areas"
                            ],
                            "dont": [
                                "Never use raw hex/rgb colors — always reference theme variables",
                                "Never mix hues within the same component for decoration",
                                "Never use primary colors for neutral structural elements",
                                "Never choose colors based on visual variety alone"
                            ]
                        }
                    },
                    "shadeGuide": {
                        "50-100": "Backgrounds, subtle highlights, hover states on light elements",
                        "200-300": "Borders, dividers, disabled backgrounds, secondary surfaces",
                        "400-500": "Default interactive elements, icons, secondary text",
                        "600-700": "Primary buttons, links, active states, emphasis",
                        "800-900": "High-impact actions, critical buttons, primary text"
                    },
                    "componentGuidance": {
                        "buttons": {
                            "primary": "High-impact actions. Use primary-600 to primary-800.",
                            "secondary": "Standard actions. Use primary-300 to primary-500.",
                            "tertiary": "Low-priority actions. Use neutral-200 with neutral-700 text.",
                            "danger": "Destructive actions. Use error hue at shade 600-700."
                        },
                        "backgrounds": {
                            "page": "neutral-50 or neutral-100",
                            "card": "white or neutral-50",
                            "alternatingRows": "Alternate between neutral-50 and white",
                            "selected": "primary-100",
                            "hover": "primary-50 or neutral-100"
                        },
                        "text": {
                            "primary": "neutral-900 (high emphasis)",
                            "secondary": "neutral-600 (medium emphasis)",
                            "disabled": "neutral-400",
                            "onDarkBackground": "neutral-50 or white"
                        },
                        "borders": {
                            "subtle": "neutral-200",
                            "default": "neutral-300",
                            "emphasis": "primary-300",
                            "focus": "primary-500"
                        }
                    }
                }
            },
            
            // ═══════════════════════════════════════════════════════════════
            // PRIMARY COLOR - Brand hue with full shade scale
            // ═══════════════════════════════════════════════════════════════
            "primary": {
                "$description": "Primary brand color. Use for CTAs, links, interactive elements, and brand emphasis.",
                "hue": {
                    "$type": "number",
                    "$value": state.primaryHue,
                    "$description": "Primary hue value (0-360 degrees on color wheel)"
                },
                "defaultShade": {
                    "$type": "number",
                    "$value": state.defaultShade,
                    "$description": "Default shade for primary color (50-900)"
                },
                "textFlipShade": {
                    "$type": "number",
                    "$value": state.textFlipShade,
                    "$description": "Shade threshold where button text flips from dark to light"
                },
                "shades": {
                    "$description": "Full primary shade scale - all available for designer use",
                    ...Object.fromEntries(
                        CONFIG.primaryShades.map(({shade, s, l}) => [
                            shade.toString(),
                            {
                                "$type": "color",
                                "$value": hslToHex(state.primaryHue, s, l + (state.primaryOffset || 0))
                            }
                        ])
                    )
                }
            },
            
            // ═══════════════════════════════════════════════════════════════
            // NEUTRAL COLOR - Grays with full shade scale
            // ═══════════════════════════════════════════════════════════════
            "neutral": {
                "$description": "Neutral colors for backgrounds, borders, and structural elements. Use -1 for pure gray, or 0-360 for tinted neutrals.",
                "hue": {
                    "$type": "number",
                    "$value": state.neutralHue,
                    "$description": "Neutral hue value (-1 for pure gray, 0-360 for tinted)"
                },
                "shades": {
                    "$description": "Full neutral shade scale - all available for designer use",
                    ...Object.fromEntries(
                        CONFIG.neutralShades.map(({shade, s, l}) => {
                            const saturation = state.neutralHue === -1 ? 0 : s;
                            const hue = state.neutralHue === -1 ? 0 : state.neutralHue;
                            return [
                                shade.toString(),
                                {
                                    "$type": "color",
                                    "$value": hslToHex(hue, saturation, l + (state.neutralOffset || 0))
                                }
                            ];
                        })
                    )
                }
            },
            
            // ═══════════════════════════════════════════════════════════════
            // SEMANTIC COLORS - Status and feedback
            // ═══════════════════════════════════════════════════════════════
            "semantic": {
                "$description": "Status colors for user feedback. Use consistently to build user recognition.",
                
                "success": {
                    "$type": "color",
                    "$value": `hsl(${state.success.h}, ${state.success.s}%, ${state.success.l}%)`,
                    "$description": "Positive outcomes, completed actions, valid states, confirmations. Use for: form confirmations, successful operations, valid inputs, completed steps, positive badges (Active, Approved, Paid). NOT for: decorative green, unrelated positive emotions.",
                    "$extensions": {
                        "nce-hsl": { "h": state.success.h, "s": state.success.s, "l": state.success.l }
                    }
                },
                "error": {
                    "$type": "color",
                    "$value": `hsl(${state.error.h}, ${state.error.s}%, ${state.error.l}%)`,
                    "$description": "Failures, invalid states, destructive actions, critical problems. Use for: validation errors, failed operations, required fields, destructive buttons (Delete, Remove), negative badges (Rejected, Failed, Overdue). NOT for: warnings, attention-grabbing decoration.",
                    "$extensions": {
                        "nce-hsl": { "h": state.error.h, "s": state.error.s, "l": state.error.l }
                    }
                },
                "warning": {
                    "$type": "color",
                    "$value": `hsl(${state.warning.h}, ${state.warning.s}%, ${state.warning.l}%)`,
                    "$description": "Caution states, potential issues, actions needing attention. Use for: unsaved changes, approaching limits, non-destructive consequential actions (Archive, Disable), pending states, caution badges (Pending Review, Expiring Soon, Draft). NOT for: actual errors, informational notices.",
                    "$extensions": {
                        "nce-hsl": { "h": state.warning.h, "s": state.warning.s, "l": state.warning.l }
                    }
                }
            },
            
            // ═══════════════════════════════════════════════════════════════
            // WINDOW CONTROLS - macOS-style traffic light buttons
            // ═══════════════════════════════════════════════════════════════
            "windowControls": {
                "$description": "Window control button colors (macOS traffic light style)",
                
                "close": {
                    "$type": "color",
                    "$value": `hsl(${state.close.h}, ${state.close.s}%, ${state.close.l}%)`,
                    "$description": "Close/exit button color",
                    "$extensions": {
                        "nce-hsl": { "h": state.close.h, "s": state.close.s, "l": state.close.l }
                    }
                },
                "minimize": {
                    "$type": "color",
                    "$value": `hsl(${state.minimize.h}, ${state.minimize.s}%, ${state.minimize.l}%)`,
                    "$description": "Minimize button color",
                    "$extensions": {
                        "nce-hsl": { "h": state.minimize.h, "s": state.minimize.s, "l": state.minimize.l }
                    }
                },
                "maximize": {
                    "$type": "color",
                    "$value": `hsl(${state.maximize.h}, ${state.maximize.s}%, ${state.maximize.l}%)`,
                    "$description": "Maximize button color",
                    "$extensions": {
                        "nce-hsl": { "h": state.maximize.h, "s": state.maximize.s, "l": state.maximize.l }
                    }
                }
            },
            
            // ═══════════════════════════════════════════════════════════════
            // SURFACE - Background hierarchy
            // ═══════════════════════════════════════════════════════════════
            "surface": {
                "$description": "Background hierarchy for page elements",
                "$extensions": {
                    "nce-design-system": {
                        "rule": "shade-step",
                        "description": "Nested panels automatically step darker from panel background",
                        "direction": state.nestedPanelDirection || "darker",
                        "stepSize": state.nestedPanelStep || 50
                    }
                },
                "page": {
                    "$type": "color",
                    "$value": getTokenColor(state.pageBg),
                    "$description": "Page/canvas background",
                    "$extensions": { "nce-token": state.pageBg, "nce-level": 0 }
                },
                "panel": {
                    "$type": "color",
                    "$value": getTokenColor(state.panelBg),
                    "$description": "Card/panel background",
                    "$extensions": { "nce-token": state.panelBg, "nce-level": 1 }
                },
                "nested": {
                    "$type": "color",
                    "$value": getNestedPanelColor(1),
                    "$description": "Nested panel background (auto-calculated)",
                    "$extensions": { "nce-level": 2, "nce-computed": true }
                }
            },
            
            // ═══════════════════════════════════════════════════════════════
            // BUTTON SETTINGS - Gradient and text configuration
            // ═══════════════════════════════════════════════════════════════
            "button": {
                "$description": "Button styling configuration",
                
                "gradient": {
                    "angle": {
                        "$type": "number",
                        "$value": state.gradient.angle,
                        "$description": "Gradient angle in degrees (180 = top-lit, 0 = bottom-lit, 'none' = flat)"
                    }
                },
                "defaultShade": {
                    "$type": "number",
                    "$value": state.defaultShade,
                    "$description": "Default shade for primary buttons (50-900)"
                },
                "textFlipShade": {
                    "$type": "number",
                    "$value": state.textFlipShade,
                    "$description": "Shade threshold where button text flips from dark to light"
                }
            }
        };
        
        // ═══════════════════════════════════════════════════════════════════
        // FRAPPE ONLY: Add Frappe-specific settings to theme output
        // ═══════════════════════════════════════════════════════════════════
        if (typeof frappeState !== 'undefined') {
            // Add Frappe-specific agent guidance
            theme.$extensions["nce-design-system"].frappeGuidance = {
                "purpose": "Frappe/ERPNext Desk UI customization",
                "cssVariables": "All values map to Frappe CSS custom properties (--variable-name)",
                
                "coreToFrappeMapping": {
                    "$description": "How Core Theme tokens map to Frappe CSS variables",
                    "primary": {
                        "coreToken": "primary-{shade}",
                        "frappeVar": "--primary",
                        "note": "Frappe uses primary-500 as --primary by default. Shades available as --primary-{shade}."
                    },
                    "neutral": {
                        "coreToken": "neutral-{shade}",
                        "frappeVar": "--gray-{shade}",
                        "note": "Neutral tones. Used for --bg-color, --fg-color, borders, text."
                    },
                    "backgrounds": {
                        "pageBg": { "frappeVar": "--bg-color", "description": "Page/desk background" },
                        "panelBg": { "frappeVar": "--fg-color", "description": "Card/panel foreground" },
                        "controlBg": { "frappeVar": "--control-bg", "description": "Input field background" }
                    },
                    "semantic": {
                        "success": { "frappeVar": "--green-*", "indicators": ["Submitted", "Active", "Enabled"] },
                        "error": { "frappeVar": "--red-*", "indicators": ["Cancelled", "Failed", "Disabled"] },
                        "warning": { "frappeVar": "--orange-*", "indicators": ["Pending", "Draft", "On Hold"] }
                    },
                    "sizing": {
                        "borderRadius": { "frappeVar": "--border-radius", "default": "6px" },
                        "borderRadiusLg": { "frappeVar": "--border-radius-lg", "default": "12px" },
                        "btnHeight": { "frappeVar": "--btn-height", "default": "28px" }
                    }
                },
                "components": {
                    "lists": {
                        "description": "List View styling for doctypes",
                        "hover": "Use subtle primary tints (primary-50) for row hover",
                        "selection": "Use slightly stronger primary (primary-100) for selected rows",
                        "alternateRows": "Use neutral-50 for zebra striping to improve scanability"
                    },
                    "forms": {
                        "description": "Form View styling for document editing",
                        "sections": "Section headers use neutral backgrounds for visual grouping",
                        "controls": "Input backgrounds should be subtle (neutral-50) not white",
                        "focus": "Focus rings use primary color to show active field"
                    },
                    "navigation": {
                        "description": "Sidebar and Awesomebar styling",
                        "sidebar": "Use neutral backgrounds with primary accents for active items",
                        "navbar": "Dark theme recommended for contrast with content area"
                    },
                    "indicators": {
                        "description": "Status badge colors for workflow states",
                        "semantic": "Green/Red/Orange inherited from Core Theme semantic colors",
                        "custom": "Blue and Purple for info/custom states"
                    },
                    "print": {
                        "description": "PDF export and paper printing styles",
                        "colorMode": "Full color palette for PDF exports",
                        "bwMode": "Pure grayscale palette for paper printing (no color cast)",
                        "usage": "Add .print-bw-mode class to activate B&W palette before printing"
                    },
                    "customComponents": {
                        "description": "Custom HTML/JS pages, widgets, and panels in Frappe apps",
                        "colorSource": "For custom components, use the full palette from the Core Theme section (primary.shades, neutral.shades)",
                        "note": "The frappeCSS section contains only Frappe-native CSS variables. For custom HTML/JS work, reference the complete shade scales (50-900) in the primary and neutral sections at the root of this JSON.",
                        "examples": [
                            "Custom Page: Read primary.shades.600.$value for button backgrounds",
                            "Client Script HTML: Use neutral.shades.100.$value for panel backgrounds",
                            "Web Template: Reference any shade from the core palette"
                        ]
                    }
                },
                "sizingVariables": {
                    "borderRadius": "Global corner radius for small elements (buttons, inputs)",
                    "borderRadiusLg": "Corner radius for large elements (modals, cards)",
                    "btnHeight": "Standard button height - affects touch targets"
                }
            };
            
            // Helper to resolve token to hex value
            const resolveColor = (token) => {
                if (!token) return null;
                if (token.startsWith('#')) return token; // Already hex
                return getTokenColor(token);
            };
            
            // Get navbar background based on theme
            const getNavbarBg = () => {
                if (frappeState.navbarTheme === 'dark') return '#1a1a1a';
                if (frappeState.navbarTheme === 'light') return '#ffffff';
                return getTokenColor('primary-700');
            };
            
            // Frappe CSS Variables - EXACT names for Python script
            // All values resolved to hex, all inherited values included
            theme.frappeCSS = {
                "$description": "Frappe CSS custom properties - use these variable names exactly",
                "$usage": "Python script reads these directly into app CSS",
                
                // ─────────────────────────────────────────────────────────────
                // CORE (from Core Theme - repeated here for completeness)
                // ─────────────────────────────────────────────────────────────
                "--primary": resolveColor('primary-500'),
                "--primary-light": resolveColor('primary-100'),
                "--primary-dark": resolveColor('primary-700'),
                "--bg-color": resolveColor(state.pageBg),
                "--fg-color": resolveColor(state.panelBg),
                
                // Semantic colors (from Core Theme)
                "--green": hslToHex(state.success.h, state.success.s, 50),
                "--green-light": hslToHex(state.success.h, state.success.s, state.success.l),
                "--red": hslToHex(state.error.h, state.error.s, 50),
                "--red-light": hslToHex(state.error.h, state.error.s, state.error.l),
                "--orange": hslToHex(state.warning.h, state.warning.s, 50),
                "--orange-light": hslToHex(state.warning.h, state.warning.s, state.warning.l),
                
                // ─────────────────────────────────────────────────────────────
                // SIZING
                // ─────────────────────────────────────────────────────────────
                "--border-radius": frappeState.borderRadius,
                "--border-radius-lg": frappeState.borderRadiusLg,
                "--btn-height": frappeState.btnHeight,
                "--card-border-radius": frappeState.cardBorderRadius,
                
                // ─────────────────────────────────────────────────────────────
                // COMMON ELEMENTS
                // ─────────────────────────────────────────────────────────────
                "--navbar-bg": getNavbarBg(),
                "--control-bg": resolveColor(frappeState.controlBg),
                "--btn-default-bg": resolveColor(frappeState.btnDefaultBg),
                "--focus-ring-color": resolveColor(frappeState.focusRingColor),
                "--border-color": resolveColor(frappeState.defaultBorderColor),
                "--row-hover-bg": resolveColor(frappeState.rowHoverColor),
                "--row-selection-bg": resolveColor(frappeState.rowSelectionColor),
                "--alternate-row-bg": resolveColor(frappeState.alternateRowColor),
                
                // ─────────────────────────────────────────────────────────────
                // LISTS
                // ─────────────────────────────────────────────────────────────
                "--list-header-bg": resolveColor(frappeState.listHeaderBg),
                "--list-header-text": resolveColor(frappeState.listHeaderText),
                "--list-row-border": resolveColor(frappeState.listRowBorder),
                // Inherited - repeated for convenience
                "--list-row-hover": resolveColor(frappeState.rowHoverColor),
                "--list-row-selected": resolveColor(frappeState.rowSelectionColor),
                "--list-row-alt": resolveColor(frappeState.alternateRowColor),
                
                // ─────────────────────────────────────────────────────────────
                // FORMS
                // ─────────────────────────────────────────────────────────────
                "--form-label-color": resolveColor(frappeState.formLabelColor),
                "--form-section-bg": resolveColor(frappeState.formSectionBg),
                "--form-section-text": resolveColor(frappeState.formSectionText),
                "--form-tab-active": resolveColor(frappeState.formTabActive),
                "--checkbox-color": resolveColor(frappeState.checkboxColor),
                // Inherited - repeated for convenience
                "--form-control-bg": resolveColor(frappeState.controlBg),
                "--form-focus-ring": resolveColor(frappeState.focusRingColor),
                "--form-border-color": resolveColor(frappeState.defaultBorderColor),
                
                // ─────────────────────────────────────────────────────────────
                // INDICATORS
                // ─────────────────────────────────────────────────────────────
                "--indicator-blue": resolveColor(frappeState.indicatorBlue),
                "--indicator-purple": frappeState.indicatorPurple, // Already hex
                "--indicator-gray": resolveColor(frappeState.indicatorGray),
                // Semantic - repeated for convenience
                "--indicator-green": hslToHex(state.success.h, state.success.s, 50),
                "--indicator-red": hslToHex(state.error.h, state.error.s, 50),
                "--indicator-orange": hslToHex(state.warning.h, state.warning.s, 50),
                
                // ─────────────────────────────────────────────────────────────
                // NAVIGATION
                // ─────────────────────────────────────────────────────────────
                "--sidebar-bg": resolveColor(frappeState.sidebarBg),
                "--sidebar-text": resolveColor(frappeState.sidebarText),
                "--sidebar-hover": resolveColor(frappeState.sidebarHover),
                "--sidebar-active-bg": resolveColor(frappeState.sidebarActive),
                "--sidebar-active-text": resolveColor(frappeState.sidebarActiveText),
                "--awesomebar-hover": resolveColor(frappeState.awesomebarHover),
                
                // ─────────────────────────────────────────────────────────────
                // PRINT - COLOR (for PDF)
                // ─────────────────────────────────────────────────────────────
                "--print-heading": resolveColor(frappeState.printHeading),
                "--print-text": resolveColor(frappeState.printText),
                "--print-table-header": resolveColor(frappeState.printTableHeader),
                "--print-table-border": resolveColor(frappeState.printTableBorder),
                "--print-footer": resolveColor(frappeState.printFooter),
                
                // ─────────────────────────────────────────────────────────────
                // PRINT - B&W (for paper, use with .print-bw-mode class)
                // ─────────────────────────────────────────────────────────────
                "--print-heading-bw": frappeState.printHeadingBW,
                "--print-text-bw": frappeState.printTextBW,
                "--print-table-header-bw": frappeState.printTableHeaderBW,
                "--print-table-border-bw": frappeState.printTableBorderBW,
                "--print-footer-bw": frappeState.printFooterBW
            };
        }
        // ═══════════════════════════════════════════════════════════════════
        // END FRAPPE ONLY
        // ═══════════════════════════════════════════════════════════════════
        
        const json = JSON.stringify(theme, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${themeName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        document.getElementById('modalContent').innerHTML = `
            <div class="modal-success">
                <div class="modal-title">Theme Saved</div>
                <div class="modal-message">${themeName} has been downloaded</div>
            </div>
        `;
        
        setTimeout(() => {
            closeModal();
        }, 2000);
    }
    
    function showErrorModal(message) {
        document.getElementById('modalContent').innerHTML = `
            <div class="modal-title">Error</div>
            <div class="modal-message">${message}</div>
            <div class="modal-buttons">
                <button class="btn btn-primary" data-action="close-modal">OK</button>
            </div>
        `;
        document.getElementById('modalOverlay').classList.add('show');
    }
    
    function closeModal() {
        document.getElementById('modalOverlay').classList.remove('show');
    }
    
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'modalOverlay') {
            closeModal();
        }
    });
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    const CONFIG = {
        primaryShades: [
            { shade: 50,  s: 100, l: 97 },
            { shade: 100, s: 98,  l: 94 },
            { shade: 200, s: 95,  l: 88 },
            { shade: 300, s: 92,  l: 80 },
            { shade: 400, s: 88,  l: 70 },
            { shade: 500, s: 83,  l: 60 },
            { shade: 600, s: 78,  l: 50 },
            { shade: 700, s: 73,  l: 42 },
            { shade: 800, s: 68,  l: 37 },
            { shade: 900, s: 65,  l: 35 }
        ],
        
        neutralShades: [
            { shade: 50,  s: 5,  l: 98 },
            { shade: 100, s: 5,  l: 96 },
            { shade: 200, s: 5,  l: 92 },
            { shade: 300, s: 5,  l: 85 },
            { shade: 400, s: 5,  l: 73 },
            { shade: 500, s: 6,  l: 58 },
            { shade: 600, s: 7,  l: 46 },
            { shade: 700, s: 7,  l: 38 },
            { shade: 800, s: 8,  l: 32 },
            { shade: 900, s: 8,  l: 30 }
        ],
        
        semanticColors: [
            { id: 'success', name: 'Success', default: { h: 150, s: 75, l: 85 } },
            { id: 'error',   name: 'Error',   default: { h: 0,   s: 85, l: 90 } },
            { id: 'warning', name: 'Warning', default: { h: 45,  s: 90, l: 85 } }
        ],
        
        windowColors: [
            { id: 'close',    name: 'Close',    default: { h: 0,   s: 70, l: 55 } },
            { id: 'minimize', name: 'Minimize', default: { h: 45,  s: 70, l: 55 } },
            { id: 'maximize', name: 'Maximize', default: { h: 120, s: 50, l: 50 } }
        ]
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════════
    
    const DEFAULT_STATE = {
        primaryHue: 210,
        primarySat: 83,           // saturation from primary-500 config
        anchorShade: 500,         // which shade is exact match (500 = default brand)
        anchorHex: '#4198F0',     // default primary-500 hex (hsl 210, 83%, 60%)
        anchorL: 60,              // lightness from primary-500 config
        anchorOffset: 0,          // bump offset from initial anchor
        shadeOffset: 0,           // quantum shift for non-anchor mode
        neutralHue: 210,
        pageBg: 'neutral-100',
        panelBg: 'neutral-200',
        nestedPanelDirection: 'lighter',  // nested panels go lighter (Apple HIG style)
        nestedPanelStep: 50,             // half-shade increments
        success:  { h: 150, s: 75, l: 85 },
        error:    { h: 0,   s: 85, l: 90 },
        warning:  { h: 45,  s: 90, l: 85 },
        close:    { h: 0,   s: 70, l: 55 },
        minimize: { h: 45,  s: 70, l: 55 },
        maximize: { h: 120, s: 50, l: 50 },
        gradient: {
            angle: 180,
            stops: { top: 96, mid: 88, bottom: 82 }
        },
        defaultShade: 400,
        textFlipShade: 500,  // Shades >= this use light text
        uiFont: 'Arial',     // UI font family
        uiFontBold: false    // Bold toggle for UI elements
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // FRAPPE ONLY: JS START - Frappe State
    // ═══════════════════════════════════════════════════════════════════════════
    const DEFAULT_FRAPPE_STATE = {
        // Common Elements
        navbarTheme: 'dark',
        alternateRows: true,
        alternateRowColor: 'neutral-50',
        btnDefaultBg: 'primary-100',
        controlBg: 'neutral-50',
        rowHoverColor: 'primary-50',
        rowSelectionColor: 'primary-100',
        cardBorderRadius: '8px',
        focusRingColor: 'primary-100',
        defaultBorderColor: 'neutral-300',
        // Sizing & Dimensions
        borderRadius: '6px',
        borderRadiusLg: '12px',
        btnHeight: '28px',
        // Lists
        listHeaderBg: 'neutral-100',
        listHeaderText: 'neutral-700',
        listRowBorder: 'neutral-200',
        // Forms
        formLabelColor: 'neutral-700',
        formSectionBg: 'neutral-300',
        formSectionText: 'neutral-800',
        formTabActive: 'primary-600',
        checkboxColor: 'primary-500',
        // Indicators
        indicatorBlue: 'primary-500',
        indicatorPurple: '#743ee2',  // Frappe's default purple
        indicatorGray: 'neutral-400',
        // Navigation
        sidebarBg: 'neutral-50',
        sidebarText: 'neutral-700',
        sidebarHover: 'primary-50',
        sidebarActive: 'primary-100',
        sidebarActiveText: 'primary-700',
        awesomebarHover: 'primary-50',
        // Print (Full Color - for PDF)
        printHeading: 'primary-700',
        printText: 'neutral-900',
        printTableHeader: 'neutral-100',
        printTableBorder: 'neutral-300',
        printFooter: 'neutral-500',
        // Print B&W (Pure grays - for paper printing)
        printHeadingBW: '#333333',      // Gray 800
        printTextBW: '#1a1a1a',         // Gray 900
        printTableHeaderBW: '#f5f5f5',  // Gray 100
        printTableBorderBW: '#cccccc',  // Gray 300
        printFooterBW: '#888888'        // Gray 500
    };
    
    let frappeState = { ...DEFAULT_FRAPPE_STATE };
    // ═══════════════════════════════════════════════════════════════════════════
    // FRAPPE ONLY: JS END - Frappe State
    // ═══════════════════════════════════════════════════════════════════════════
    
    let state = loadState();
    
    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════
    
    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
    }
    
    function hexToHSL(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return { h: 0, s: 0, l: 50 };
        let r = parseInt(result[1], 16) / 255;
        let g = parseInt(result[2], 16) / 255;
        let b = parseInt(result[3], 16) / 255;
        
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }
    
    // Calculate relative luminance (WCAG standard)
    // Accounts for human eye sensitivity: green > red > blue
    function getRelativeLuminance(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return 0.5;
        
        // Normalize RGB to 0-1
        let r = parseInt(result[1], 16) / 255;
        let g = parseInt(result[2], 16) / 255;
        let b = parseInt(result[3], 16) / 255;
        
        // Apply gamma correction (sRGB to linear)
        r = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
        g = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
        b = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
        
        // Weighted sum based on human perception
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    
    // Get contrasting text color based on background luminance
    function getContrastTextColor(bgHex) {
        const luminance = getRelativeLuminance(bgHex);
        // Threshold raised to favor light text on mid-tones
        return luminance > 0.35 ? '#000000' : '#FFFFFF';
    }
    
    function getHueName(hue) {
        if (hue < 30) return 'Red';
        if (hue < 60) return 'Orange';
        if (hue < 90) return 'Yellow';
        if (hue < 150) return 'Green';
        if (hue < 210) return 'Cyan';
        if (hue < 270) return 'Blue';
        if (hue < 330) return 'Purple';
        return 'Pink';
    }
    
    function getTemperature(hue) {
        if ((hue >= 0 && hue < 60) || hue >= 300) return 'Warm';
        if (hue >= 180 && hue < 300) return 'Cool';
        return 'Neutral';
    }
    
    function getContrastColor(h, s, l) {
        return l > 60 ? hslToHex(h, 60, 20) : hslToHex(h, 20, 95);
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PERSISTENCE
    // ═══════════════════════════════════════════════════════════════════════════
    
    function loadState() {
        // Always return default state - no localStorage persistence
        // Users must explicitly save/load themes via buttons
        return { ...DEFAULT_STATE };
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // UI GENERATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    function createScaleSwatch(prefix, shade, hex) {
        // Both primary and neutral swatches open the primary editor (which contains both pickers)
        const editorTarget = 'primary';
        return `
            <div class="color-swatch clickable" data-action="toggle-editor" data-target="${editorTarget}">
                <div class="color-box">
                    <div class="color-box-bg" id="bg-${prefix}-${shade}" style="background:${hex}"></div>
                </div>
                <div class="color-info">
                    <div class="color-name" id="name-${prefix}-${shade}">${prefix}-${shade}</div>
                    <div class="color-value" id="hex-${prefix}-${shade}">${hex}</div>
                </div>
            </div>
        `;
    }
    
    function createPickerSwatch(id, name, hex, labelColor) {
        return `
            <div class="color-swatch clickable">
                <div class="color-box">
                    <div class="color-box-bg" id="bg-${id}" style="background:${hex}"></div>
                    <input type="color" class="color-box-input" id="input-${id}" value="${hex}">
                    <span class="color-box-label" id="label-${id}" style="color:${labelColor}">Click to Edit</span>
                </div>
                <div class="color-info">
                    <div class="color-name">${name}</div>
                    <div class="color-value" id="hex-${id}">${hex}</div>
                </div>
            </div>
        `;
    }
    
    function buildUI() {
        // Primary grid
        let primaryHTML = '';
        CONFIG.primaryShades.forEach(({ shade, s, l }) => {
            const hex = getTokenColor(`primary-${shade}`);
            primaryHTML += createScaleSwatch('primary', shade, hex);
        });
        document.getElementById('primaryGrid').innerHTML = primaryHTML;
        
        // Neutral grid
        let neutralHTML = '';
        CONFIG.neutralShades.forEach(({ shade, s, l }) => {
            const hex = hslToHex(state.neutralHue, s, l);
            neutralHTML += createScaleSwatch('neutral', shade, hex);
        });
        document.getElementById('neutralGrid').innerHTML = neutralHTML;
        
        // Semantic grid
        let semanticHTML = '';
        CONFIG.semanticColors.forEach(({ id, name }) => {
            const c = state[id];
            const hex = hslToHex(c.h, c.s, c.l);
            const labelColor = getContrastColor(c.h, c.s, c.l);
            semanticHTML += createPickerSwatch(id, name, hex, labelColor);
        });
        document.getElementById('semanticGrid').innerHTML = semanticHTML;
        
        // Window grid
        let windowHTML = '';
        CONFIG.windowColors.forEach(({ id, name }) => {
            const c = state[id];
            const hex = hslToHex(c.h, c.s, c.l);
            const labelColor = getContrastColor(c.h, c.s, c.l);
            windowHTML += createPickerSwatch(id, name, hex, labelColor);
        });
        document.getElementById('windowGrid').innerHTML = windowHTML;
        
        // Bind color picker events
        [...CONFIG.semanticColors, ...CONFIG.windowColors].forEach(({ id }) => {
            const input = document.getElementById('input-' + id);
            if (input) {
                input.addEventListener('input', function() {
                    state[id] = hexToHSL(this.value);
                    updateUI();
                });
            }
        });
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // TEXT FLIP THRESHOLD SELECTOR
    // ═══════════════════════════════════════════════════════════════════════════
    
    const TEXT_FLIP_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    
    function buildTextFlipTiles() {
        // Build 10 buttons showing each shade with live color preview
        const container = document.getElementById('textFlipButtons');
        if (!container) return;
        
        container.innerHTML = '';
        TEXT_FLIP_SHADES.forEach(shade => {
            const btn = document.createElement('button');
            btn.className = 'angle-preset text-flip-btn';
            btn.dataset.shade = shade;
            btn.textContent = shade;
            // Clicking tile sets default shade (button color)
            btn.onclick = function() { setDefaultShade(shade); };
            container.appendChild(btn);
        });
        
        updateTextFlipUI();
    }
    
    function updateTextFlipUI() {
        const flipShade = state.textFlipShade || 500;
        const defaultShade = state.defaultShade || 400;
        
        // Update button colors and text
        TEXT_FLIP_SHADES.forEach(shade => {
            const btn = document.querySelector(`.text-flip-btn[data-shade="${shade}"]`);
            if (!btn) return;
            
            const hex = getTokenColor('primary-' + shade);
            const useLightText = shade >= flipShade;
            
            btn.style.backgroundColor = hex;
            btn.style.color = useLightText ? '#ffffff' : '#000000';
            
            // Show asterisk on anchor shade
            const isAnchor = state.anchorShade === shade && state.anchorHex;
            btn.textContent = `${shade}${isAnchor ? '*' : ''}`;
            
            // Show which is the default shade with bold border
            if (shade === defaultShade) {
                btn.style.borderColor = '#0066cc';
                btn.style.borderWidth = '2px';
                btn.style.fontWeight = 'bold';
            } else {
                btn.style.borderColor = '#ddd';
                btn.style.borderWidth = '1px';
                btn.style.fontWeight = 'normal';
            }
        });
    }
    
    function moveTextFlip(direction) {
        console.log('moveTextFlip called with direction:', direction);
        const currentShade = state.textFlipShade || 500;
        const currentIndex = TEXT_FLIP_SHADES.indexOf(currentShade);
        const newIndex = Math.max(0, Math.min(TEXT_FLIP_SHADES.length - 1, currentIndex + direction));
        
        console.log('Flip shade changing from', currentShade, 'to', TEXT_FLIP_SHADES[newIndex]);
        state.textFlipShade = TEXT_FLIP_SHADES[newIndex];
        updateTextFlipUI();
        updateUI(); // Update button preview
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // UI UPDATE
    // ═══════════════════════════════════════════════════════════════════════════
    
    function updateUI() {
        // ═══════════════════════════════════════════════════════════════════
        // SET ALL CSS VARIABLES - Single source of truth for all elements
        // ═══════════════════════════════════════════════════════════════════
        
        // Primary shade scale (--primary-50 through --primary-900)
        CONFIG.primaryShades.forEach(({ shade }) => {
            const hex = getTokenColor(`primary-${shade}`);
            document.documentElement.style.setProperty(`--primary-${shade}`, hex);

            // Also update UI swatches
            const bg = document.getElementById('bg-primary-' + shade);
            const hexEl = document.getElementById('hex-primary-' + shade);
            const nameEl = document.getElementById('name-primary-' + shade);
            if (bg) bg.style.background = hex;
            if (hexEl) hexEl.textContent = hex;
            // Show asterisk on anchor shade
            if (nameEl) {
                const isAnchor = state.anchorShade === shade && state.anchorHex;
                nameEl.textContent = `primary-${shade}${isAnchor ? '*' : ''}`;
            }
        });
        document.getElementById('primaryLabel').textContent = getHueName(state.primaryHue);
        
        // Show/hide anchor legend
        const anchorLegend = document.getElementById('anchorLegend');
        if (anchorLegend) {
            anchorLegend.style.display = state.anchorHex ? 'block' : 'none';
        }

        // Update text flip tiles (keeps them in sync with primary colors)
        updateTextFlipUI();
        
        // Neutral shade scale (--neutral-50 through --neutral-900)
        CONFIG.neutralShades.forEach(({ shade }) => {
            const hex = getTokenColor('neutral-' + shade);
            document.documentElement.style.setProperty(`--neutral-${shade}`, hex);
            
            // Also update UI swatches
            const bg = document.getElementById('bg-neutral-' + shade);
            const hexEl = document.getElementById('hex-neutral-' + shade);
            if (bg) bg.style.background = hex;
            if (hexEl) hexEl.textContent = hex;
        });
        document.getElementById('neutralLabel').textContent = getTemperature(state.neutralHue);
        
        // Update semantic & window colors
        [...CONFIG.semanticColors, ...CONFIG.windowColors].forEach(({ id }) => {
            const c = state[id];
            const hex = hslToHex(c.h, c.s, c.l);
            const bg = document.getElementById('bg-' + id);
            const input = document.getElementById('input-' + id);
            const hexEl = document.getElementById('hex-' + id);
            const label = document.getElementById('label-' + id);
            
            if (bg) bg.style.background = hex;
            if (input) input.value = hex;
            if (hexEl) hexEl.textContent = hex;
            if (label) label.style.color = getContrastColor(c.h, c.s, c.l);
        });
        
        // Update page styling (self-style)
        const accentHex = hslToHex(state.primaryHue, 75, 55);
        const pageBg = getTokenColor(state.pageBg);              // from state (user-selectable)
        const containerBg = '#ffffff';                           // Always white
        const containerBorder = hslToHex(state.primaryHue, 70, 45); // primary-600
        const nestedPanelBg = getNestedPanelColor(1);            // 4% darker than white
        const nestedPanelBg2 = getNestedPanelColor(2);           // 8% darker than white
        const textColor = hslToHex(state.neutralHue, 10, 15);
        const mutedText = hslToHex(state.neutralHue, 5, 45);
        const successHex = hslToHex(state.success.h, state.success.s, Math.min(state.success.l, 45));
        
        document.documentElement.style.setProperty('--accent-color', accentHex);
        document.documentElement.style.setProperty('--page-bg', pageBg);
        document.documentElement.style.setProperty('--container-bg', containerBg);
        document.documentElement.style.setProperty('--container-border', containerBorder);
        document.documentElement.style.setProperty('--nested-panel-bg', nestedPanelBg);
        document.documentElement.style.setProperty('--nested-panel-bg-2', nestedPanelBg2);
        document.documentElement.style.setProperty('--page-text', textColor);
        document.documentElement.style.setProperty('--muted-text', mutedText);
        // Semantic colors - consistent naming for reuse across components
        const successHex2 = hslToHex(state.success.h, state.success.s, state.success.l);
        const successText = getContrastTextColor(successHex2);
        document.documentElement.style.setProperty('--success', successHex2);
        document.documentElement.style.setProperty('--success-text', successText);
        document.documentElement.style.setProperty('--success-color', successHex); // legacy
        
        const errorHex2 = hslToHex(state.error.h, state.error.s, state.error.l);
        const errorText2 = getContrastTextColor(errorHex2);
        document.documentElement.style.setProperty('--error', errorHex2);
        document.documentElement.style.setProperty('--error-text', errorText2);
        
        const warningHex = hslToHex(state.warning.h, state.warning.s, state.warning.l);
        const warningText = getContrastTextColor(warningHex);
        document.documentElement.style.setProperty('--warning', warningHex);
        document.documentElement.style.setProperty('--warning-text', warningText);

        // Button gradient - based on default shade
        const g = state.gradient;
        const isFlat = g.angle === 'none';

        // Get the lightness from the token (handles anchor system)
        const defaultHex = getTokenColor(`primary-${state.defaultShade}`);
        const defaultHSL = hexToHSL(defaultHex);
        const defaultNeutral = CONFIG.neutralShades.find(s => s.shade === state.defaultShade) || { s: 5, l: 80 };

        // Calculate gradient stops based on default shade lightness
        const baseL = defaultHSL.l;
        const topL = Math.min(98, baseL + 15);
        const midL = baseL;
        const bottomL = Math.max(5, baseL - 10);
        
        const baseNL = defaultNeutral.l;
        const topNL = Math.min(98, baseNL + 10);
        const midNL = baseNL;
        const bottomNL = Math.max(50, baseNL - 8);
        
        const primaryS = state.primarySat || 85;
        let btnGradient, btnSecGradient;
        if (isFlat) {
            btnGradient = `hsl(${state.primaryHue}, ${primaryS}%, ${midL}%)`;
            btnSecGradient = `hsl(${state.neutralHue}, ${defaultNeutral.s}%, ${midNL}%)`;
        } else {
            btnGradient = `linear-gradient(${g.angle}deg, 
                hsl(${state.primaryHue}, ${primaryS}%, ${topL}%) 0%, 
                hsl(${state.primaryHue}, ${primaryS}%, ${midL}%) 50%, 
                hsl(${state.primaryHue}, ${primaryS}%, ${bottomL}%) 100%)`;
            btnSecGradient = `linear-gradient(${g.angle}deg, 
                hsl(${state.neutralHue}, ${defaultNeutral.s}%, ${topNL}%) 0%, 
                hsl(${state.neutralHue}, ${defaultNeutral.s}%, ${midNL}%) 50%, 
                hsl(${state.neutralHue}, ${defaultNeutral.s}%, ${bottomNL}%) 100%)`;
        }
        
        // Text color - use user-defined textFlipShade threshold
        const flipShade = state.textFlipShade || 500;
        const useLightText = state.defaultShade >= flipShade;
        const btnText = useLightText ? '#ffffff' : '#000000';
        
        console.log('Button text update:', { flipShade, defaultShade: state.defaultShade, useLightText, btnText });
        
        document.documentElement.style.setProperty('--btn-gradient', btnGradient);
        document.documentElement.style.setProperty('--btn-text', btnText);
        
        // All button previews now use CSS variables via base classes:
        // .btn-solid uses --btn-gradient, --btn-text
        // .btn-outline uses --primary-500, --primary-600
        // .btn-ghost uses --primary-600
        // .btn-danger uses --error, --error-text
        // No inline style manipulation needed!

        // Secondary button gradient (neutral colors)
        const btnSecBgHex = hslToHex(state.neutralHue, defaultNeutral.s, midNL);
        const btnSecText = getContrastTextColor(btnSecBgHex);
        
        document.documentElement.style.setProperty('--btn-secondary-gradient', btnSecGradient);
        document.documentElement.style.setProperty('--btn-secondary-text', btnSecText);
        
        // Slider fill uses primary color
        const sliderBg = `linear-gradient(to right, hsl(${state.primaryHue}, 75%, 25%), hsl(${state.primaryHue}, 75%, 95%))`;
        document.documentElement.style.setProperty('--stop-slider-bg', sliderBg);

        // Update gradient preview (uses primary hue)
        updateGradientUI();
        
        // Update Frappe swatches (they depend on hue values)
        if (typeof initFrappeSwatches === 'function') {
            initFrappeSwatches();
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════════════════
    
    function toggleEditor(type) {
        const panel = document.getElementById('editor-' + type);
        const overlay = document.getElementById('editor-overlay');
        panel.classList.toggle('hidden');
        if (overlay) overlay.classList.toggle('hidden');
        
        // Reset position to center when opening
        if (!panel.classList.contains('hidden')) {
            panel.style.top = '50%';
            panel.style.left = '50%';
            panel.style.transform = 'translate(-50%, -50%)';
        }
    }
    
    // Draggable modal functionality
    function initDraggableEditor() {
        const panel = document.getElementById('editor-primary');
        const handle = document.getElementById('editorDragHandle');
        if (!panel || !handle) return;
        
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        handle.addEventListener('mousedown', function(e) {
            isDragging = true;
            panel.classList.add('dragging');
            
            // Get current position
            const rect = panel.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            startX = e.clientX;
            startY = e.clientY;
            
            // Remove transform so we can use absolute positioning
            panel.style.transform = 'none';
            panel.style.left = startLeft + 'px';
            panel.style.top = startTop + 'px';
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            panel.style.left = (startLeft + dx) + 'px';
            panel.style.top = (startTop + dy) + 'px';
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                panel.classList.remove('dragging');
            }
        });
    }
    
    function closeAllEditors() {
        const editors = ['primary', 'color', 'scaleBump'];
        editors.forEach(type => {
            const panel = document.getElementById('editor-' + type);
            if (panel && !panel.classList.contains('hidden')) {
                panel.classList.add('hidden');
            }
        });
        
        // Also close any open pickers
        const pickers = document.querySelectorAll('.color-picker-panel, .scale-bump-panel');
        pickers.forEach(picker => {
            if (picker && picker.style.display === 'block') {
                picker.style.display = 'none';
            }
        });
    }
    
    // Default shade function
    function setDefaultShade(shade) {
        console.log('setDefaultShade called with:', shade);
        state.defaultShade = parseInt(shade);
        updateTextFlipUI(); // Update tile borders
        updateUI();
    }

    // Brand Hex Application
    function applyBrandHex() {
        let hex = document.getElementById('brandHexInput').value.trim();

        // Validate and normalize hex
        if (!hex.startsWith('#')) hex = '#' + hex;
        if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            alert('Please enter a valid hex color (e.g., #1E90FF)');
            return;
        }

        // Convert to HSL
        const hsl = hexToHSL(hex);

        // Anchor at 500 by default, but adjust if there was a pre-apply bump
        const shades = CONFIG.primaryShades.map(s => s.shade);
        const baseAnchorIdx = shades.indexOf(500);
        const preBumpOffset = state.shadeOffset || 0;
        
        // Apply pre-bump: if user bumped lighter (+), anchor moves to higher shade
        const adjustedIdx = Math.max(0, Math.min(shades.length - 1, baseAnchorIdx - preBumpOffset));
        const anchorShade = shades[adjustedIdx];

        // Update state
        state.primaryHue = hsl.h;
        state.primarySat = hsl.s;
        state.anchorShade = anchorShade;
        state.anchorHex = hex.toUpperCase();
        state.anchorL = hsl.l;

        // Transfer pre-bump offset to anchor offset, then clear shadeOffset
        state.anchorOffset = preBumpOffset;
        state.shadeOffset = 0;
        document.getElementById('anchorIndicator').textContent = 
            state.anchorOffset === 0 ? '0' : `${state.anchorOffset}`;

        // Update UI
        updateUI();
        refreshAllSwatchPickers();
    }

    // Gradient functions
    function toggleGradient(enabled) {
        state.gradient.angle = enabled ? 180 : 'none';
        updateUI(); // Updates all buttons + gradient preview
    }
    
    function setGradientAngle(angle) {
        state.gradient.angle = angle === 'none' ? 'none' : parseInt(angle);
        updateUI(); // Updates all buttons + gradient preview
    }
    
    // Typography functions
    function selectFontMenu(fontFamily) {
        state.uiFont = fontFamily;
        
        // Update trigger label with selected font
        const menu = document.getElementById('menu-uiFont');
        const triggerLabel = menu.querySelector('.menu-label');
        if (triggerLabel) {
            triggerLabel.textContent = fontFamily;
            triggerLabel.style.fontFamily = `${fontFamily}, sans-serif`;
        }
        
        // Update selected state
        menu.querySelectorAll('.styled-menu-option').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.value === fontFamily);
        });
        
        // Close dropdown
        document.getElementById('menu-uiFont-dropdown').classList.remove('open');
        
        // Apply font to body and button previews
        document.body.style.fontFamily = `${fontFamily}, sans-serif`;
        document.querySelectorAll('.btn-preview').forEach(btn => {
            btn.style.fontFamily = `${fontFamily}, sans-serif`;
        });
        
        updateUI();
    }
    
    function updateFontMenuBold() {
        const fontWeight = state.uiFontBold ? '600' : 'normal';
        // Update font menu options bold state
        document.querySelectorAll('.font-option').forEach(opt => {
            opt.style.fontWeight = fontWeight;
        });
        // Update trigger label bold state
        const triggerLabel = document.getElementById('fontMenuLabel');
        if (triggerLabel) {
            triggerLabel.style.fontWeight = fontWeight;
        }
    }
    
    function updateFont(fontFamily) {
        state.uiFont = fontFamily;
        document.body.style.fontFamily = `${fontFamily}, sans-serif`;
        // Apply to button previews
        document.querySelectorAll('.btn-preview').forEach(btn => {
            btn.style.fontFamily = `${fontFamily}, sans-serif`;
        });
        updateUI();
    }
    
    function toggleBold() {
        state.uiFontBold = !state.uiFontBold;
        const boldBtn = document.getElementById('boldToggle');
        const fontWeight = state.uiFontBold ? '600' : 'normal';
        
        document.body.style.fontWeight = fontWeight;
        // Apply to button previews
        document.querySelectorAll('.btn-preview').forEach(btn => {
            btn.style.fontWeight = fontWeight;
        });
        
        if (state.uiFontBold) {
            boldBtn.classList.add('active');
        } else {
            boldBtn.classList.remove('active');
        }
        
        // Update font menu items bold state
        updateFontMenuBold();
        
        updateUI();
    }
    
    function updateGradientUI() {
        // Update shade preset buttons
        document.querySelectorAll('.shade-preset').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.shade) === state.defaultShade);
        });
        
        // Update toggle switch
        const gradientToggle = document.getElementById('gradientToggle');
        if (gradientToggle) {
            gradientToggle.checked = state.gradient.angle !== 'none';
        }
        
        // Update angle preset buttons (kept for backward compatibility if any exist)
        document.querySelectorAll('.angle-preset:not(.shade-preset)').forEach(btn => {
            const btnAngle = btn.dataset.angle === 'none' ? 'none' : parseInt(btn.dataset.angle);
            btn.classList.toggle('active', btnAngle === state.gradient.angle);
        });
        
        // Update typography controls
        const fontMenu = document.getElementById('menu-uiFont');
        if (fontMenu) {
            const triggerLabel = fontMenu.querySelector('.menu-label');
            const currentFont = state.uiFont || 'Arial';
            if (triggerLabel) {
                triggerLabel.textContent = currentFont;
                triggerLabel.style.fontFamily = `${currentFont}, sans-serif`;
            }
            fontMenu.querySelectorAll('.styled-menu-option').forEach(opt => {
                opt.classList.toggle('selected', opt.dataset.value === state.uiFont);
            });
        }
        const boldBtn = document.getElementById('boldToggle');
        if (boldBtn) {
            boldBtn.classList.toggle('active', state.uiFontBold);
        }
        
        // Update font menu bold state
        if (typeof updateFontMenuBold === 'function') {
            updateFontMenuBold();
        }
        
        // Apply typography to body and button previews
        const fontFamily = `${state.uiFont || 'Arial'}, sans-serif`;
        const fontWeight = state.uiFontBold ? '600' : 'normal';
        document.body.style.fontFamily = fontFamily;
        document.body.style.fontWeight = fontWeight;
        document.querySelectorAll('.btn-preview').forEach(btn => {
            btn.style.fontFamily = fontFamily;
            btn.style.fontWeight = fontWeight;
        });
        
        // Update preview button - use default shade
        const preview = document.getElementById('gradientPreview');
        const h = state.primaryHue;

        // Get the lightness from the token (handles anchor system)
        const defaultHex = getTokenColor(`primary-${state.defaultShade}`);
        const defaultHSL = hexToHSL(defaultHex);
        const baseL = defaultHSL.l;
        const s = state.primarySat || 85;
        
        // Calculate gradient stops based on default shade lightness (with offset)
        const topL = Math.min(98, baseL + 15);
        const midL = baseL;
        const bottomL = Math.max(5, baseL - 10);
        
        const angle = state.gradient.angle;
        
        if (angle === 'none') {
            // Flat color - use base lightness
            preview.style.background = `hsl(${h}, ${s}%, ${midL}%)`;
        } else {
            preview.style.background = `linear-gradient(${angle}deg, 
                hsl(${h}, ${s}%, ${topL}%) 0%, 
                hsl(${h}, ${s}%, ${midL}%) 50%, 
                hsl(${h}, ${s}%, ${bottomL}%) 100%)`;
        }
        
        // Text color handled by CSS: .btn-solid { color: var(--btn-text); }
        // --btn-text is set in updateUI() based on text flip threshold
    }
    
    function setupSlider(sliderId, numId, stateKey) {
        const slider = document.getElementById(sliderId);
        const num = document.getElementById(numId);
        const isPrimaryHue = stateKey === 'primaryHue';
        
        slider.addEventListener('input', () => {
            state[stateKey] = parseInt(slider.value);
            num.value = slider.value;
            // If hue slider used, clear anchor (back to original method)
            if (isPrimaryHue) clearAnchor();
            updateUI();
            if (isPrimaryHue) refreshAllSwatchPickers();
        });

        num.addEventListener('input', () => {
            let val = parseInt(num.value) || 0;
            val = Math.max(0, Math.min(360, val));
            state[stateKey] = val;
            slider.value = val;
            // If hue input used, clear anchor (back to original method)
            if (isPrimaryHue) clearAnchor();
            updateUI();
            if (isPrimaryHue) refreshAllSwatchPickers();
        });
    }
    
    function bumpAnchor(direction) {
        const shades = CONFIG.primaryShades.map(s => s.shade);
        // Shades array is [50,100,200...900], so negative direction = lighter (lower index)
        // direction: +1 = lighter (user wants lighter), -1 = darker (user wants darker)
        // But array index: lower = lighter, higher = darker
        // So we negate: +1 from user -> -1 to index (lighter), -1 from user -> +1 to index (darker)
        const indexDirection = -direction;
        
        if (state.anchorShade && state.anchorHex) {
            // With anchor: shift which shade the brand hex is assigned to
            const currentIdx = shades.indexOf(state.anchorShade);
            const newIdx = currentIdx + indexDirection;
            
            // Check bounds
            if (newIdx < 0 || newIdx >= shades.length) return;
            
            state.anchorShade = shades[newIdx];
            // Update offset counter (relative to initial anchor)
            state.anchorOffset = (state.anchorOffset || 0) + direction;
            document.getElementById('anchorIndicator').textContent = `${state.anchorOffset}`;
        } else {
            // Without anchor: quantum shift all shades
            // Use shadeOffset to track the shift level
            state.shadeOffset = (state.shadeOffset || 0) + direction;
            
            // Clamp to reasonable bounds (-5 to +5 steps)
            state.shadeOffset = Math.max(-5, Math.min(5, state.shadeOffset));
            
            document.getElementById('anchorIndicator').textContent = `${state.shadeOffset}`;
        }
        
        updateBumpButtons();
        updateUI();
        refreshAllSwatchPickers();
    }
    
    function updateBumpButtons() {
        const shades = CONFIG.primaryShades.map(s => s.shade);
        const lighterBtn = document.getElementById('anchorBumpLeft');
        const darkerBtn = document.getElementById('anchorBumpRight');
        
        if (!lighterBtn || !darkerBtn) return;
        
        if (state.anchorShade && state.anchorHex) {
            // Anchor mode: check shade position
            const currentIdx = shades.indexOf(state.anchorShade);
            lighterBtn.disabled = (currentIdx >= shades.length - 1);  // Can't go lighter when at 900
            darkerBtn.disabled = (currentIdx <= 0);  // Can't go darker when at 50
        } else {
            // Offset mode: check offset bounds
            const offset = state.shadeOffset || 0;
            lighterBtn.disabled = (offset <= -5);
            darkerBtn.disabled = (offset >= 5);
        }
    }
    
    function clearAnchor() {
        // Clear all anchor/brand state
        state.anchorShade = null;
        state.anchorHex = null;
        state.anchorL = null;
        state.primarySat = 85;
        state.shadeOffset = 0;
        state.anchorOffset = 0;

        // Clear UI elements
        var indicator = document.getElementById('anchorIndicator');
        var hexInput = document.getElementById('brandHexInput');
        var colorPicker = document.getElementById('brandColorPicker');
        
        if (indicator) indicator.textContent = '--';
        if (hexInput) hexInput.value = '';
        // Sync picker with current primary-500 (visual hint, no anchor)
        if (colorPicker) colorPicker.value = getTokenColor('primary-500');
        
        updateBumpButtons();
    }
    
    // Refresh all swatch pickers to reflect current colors (e.g., after offset change)
    function refreshAllSwatchPickers() {
        document.querySelectorAll('.swatch-picker').forEach(picker => {
            updateSwatchPicker(picker);
        });
        updateInheritedSwatches();
        initNavbarPicker(); // Update navbar theme trigger if showing primary
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CSS EXPORT
    // ═══════════════════════════════════════════════════════════════════════════
    
    function generateCSS() {
        let css = `/* NCE Design System - Custom Colors */\n:root {\n`;
        css += `    /* Primary Colors */\n`;
        css += `    --primary-hue: ${state.primaryHue};\n`;
        if (state.anchorHex) {
            css += `    /* Brand anchor: ${state.anchorShade} = ${state.anchorHex} */\n`;
        }
        CONFIG.primaryShades.forEach(({ shade }) => {
            css += `    --primary-${shade}: ${getTokenColor(`primary-${shade}`)};\n`;
        });
        css += `\n    /* Primary Defaults (shade ${state.defaultShade}) */\n`;
        css += `    --primary: var(--primary-${state.defaultShade});\n`;
        css += `    --primary-light: var(--primary-${Math.max(50, state.defaultShade - 200)});\n`;
        css += `    --primary-dark: var(--primary-${Math.min(900, state.defaultShade + 200)});\n`;
        
        css += `\n    /* Neutral Colors */\n`;
        css += `    --neutral-hue: ${state.neutralHue};\n`;
        CONFIG.neutralShades.forEach(({ shade, s, l }) => {
            css += `    --neutral-${shade}: ${hslToHex(state.neutralHue, s, l)};\n`;
        });
        css += `\n    /* Neutral Defaults */\n`;
        css += `    --neutral: var(--neutral-${state.defaultShade});\n`;
        css += `    --neutral-light: var(--neutral-${Math.max(50, state.defaultShade - 200)});\n`;
        css += `    --neutral-dark: var(--neutral-${Math.min(900, state.defaultShade + 200)});\n`;

        css += `\n    /* Backgrounds */\n`;
        css += `    --page-bg: ${getTokenColor(state.pageBg)};\n`;
        css += `    --panel-bg: ${getTokenColor(state.panelBg)};\n`;

        css += `\n    /* Semantic Colors */\n`;
        CONFIG.semanticColors.forEach(({ id }) => {
            const c = state[id];
            css += `    --${id}: ${hslToHex(c.h, c.s, c.l)};\n`;
        });
        
        css += `\n    /* Window Controls */\n`;
        CONFIG.windowColors.forEach(({ id }) => {
            const c = state[id];
            css += `    --window-${id}: ${hslToHex(c.h, c.s, c.l)};\n`;
        });
        
        css += `\n    /* Button Gradient */\n`;
        const g = state.gradient;
        const isFlat = g.angle === 'none';
        
        if (isFlat) {
            css += `    --btn-gradient: hsl(var(--primary-hue), 75%, ${g.stops.mid}%); /* flat */\n`;
            css += `    --btn-secondary-gradient: hsl(var(--neutral-hue), 5%, ${g.stops.mid}%); /* flat */\n`;
        } else {
            css += `    --btn-gradient-angle: ${g.angle}deg;\n`;
            css += `    --btn-gradient: linear-gradient(${g.angle}deg, \n`;
            css += `        hsl(var(--primary-hue), 75%, ${g.stops.top}%) 0%, \n`;
            css += `        hsl(var(--primary-hue), 75%, ${g.stops.mid}%) 50%, \n`;
            css += `        hsl(var(--primary-hue), 75%, ${g.stops.bottom}%) 100%);\n`;
            css += `    --btn-secondary-gradient: linear-gradient(${g.angle}deg, \n`;
            css += `        hsl(var(--neutral-hue), 5%, ${g.stops.top}%) 0%, \n`;
            css += `        hsl(var(--neutral-hue), 5%, ${g.stops.mid}%) 50%, \n`;
            css += `        hsl(var(--neutral-hue), 5%, ${g.stops.bottom}%) 100%);\n`;
        }
        css += `    --btn-text: hsl(var(--primary-hue), 60%, 25%);\n`;
        css += `    --btn-secondary-text: hsl(var(--neutral-hue), 10%, 25%);\n`;
        css += `\n    /* Button Styles */\n`;
        css += `    --btn-shadow: 0 1px 3px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.1);\n`;
        css += `    --btn-shadow-hover: 0 2px 6px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(0,0,0,0.1);\n`;
        
        css += `}\n`;
        return css;
    }
    
    function copyCSS() {
        navigator.clipboard.writeText(generateCSS()).then(() => {
            showNotification('Copied to clipboard');
        });
    }
    
    function showNotification(msg) {
        const el = document.getElementById('notification');
        el.textContent = msg;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 2000);
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // LOAD DEFAULT THEME FROM JSON
    // ═══════════════════════════════════════════════════════════════════════════
    
    async function loadDefaultTheme() {
        try {
            const response = await fetch('dist/default-theme.json');
            if (!response.ok) {
                console.warn('Could not load default theme, using built-in defaults');
                return false;
            }
            
            const theme = await response.json();
            console.log('Loading default theme:', theme.$name);
            
            // ─────────────────────────────────────────────────────────────
            // Load Core Theme values into state
            // ─────────────────────────────────────────────────────────────
            if (theme.primary) {
                if (theme.primary.hue?.$value !== undefined) state.primaryHue = theme.primary.hue.$value;
                if (theme.primary.defaultShade?.$value !== undefined) state.defaultShade = theme.primary.defaultShade.$value;
                if (theme.primary.textFlipShade?.$value !== undefined) state.textFlipShade = theme.primary.textFlipShade.$value;
                // Note: shades are computed from hue, not stored in state
            }
            
            if (theme.neutral?.hue?.$value !== undefined) {
                state.neutralHue = theme.neutral.hue.$value;
                // Note: shades are computed from hue, not stored in state
            }
            
            if (theme.semantic) {
                if (theme.semantic.success?.$extensions?.['nce-hsl']) {
                    state.success = theme.semantic.success.$extensions['nce-hsl'];
                }
                if (theme.semantic.error?.$extensions?.['nce-hsl']) {
                    state.error = theme.semantic.error.$extensions['nce-hsl'];
                }
                if (theme.semantic.warning?.$extensions?.['nce-hsl']) {
                    state.warning = theme.semantic.warning.$extensions['nce-hsl'];
                }
            }
            
            if (theme.windowControls) {
                if (theme.windowControls.close?.$extensions?.['nce-hsl']) {
                    state.close = theme.windowControls.close.$extensions['nce-hsl'];
                }
                if (theme.windowControls.minimize?.$extensions?.['nce-hsl']) {
                    state.minimize = theme.windowControls.minimize.$extensions['nce-hsl'];
                }
                if (theme.windowControls.maximize?.$extensions?.['nce-hsl']) {
                    state.maximize = theme.windowControls.maximize.$extensions['nce-hsl'];
                }
            }
            
            // Button settings (new structure)
            if (theme.button) {
                if (theme.button.gradient?.angle?.$value !== undefined) {
                    state.gradient.angle = theme.button.gradient.angle.$value;
                }
                if (theme.button.defaultShade?.$value !== undefined) {
                    state.defaultShade = theme.button.defaultShade.$value;
                }
                if (theme.button.textFlipShade?.$value !== undefined) {
                    state.textFlipShade = theme.button.textFlipShade.$value;
                }
            }
            
            // Legacy: buttonGradient (for backward compatibility)
            if (theme.buttonGradient?.angle?.$value !== undefined) {
                state.gradient.angle = theme.buttonGradient.angle.$value;
            }
            
            // ─────────────────────────────────────────────────────────────
            // Load Frappe values into frappeState (FRAPPE ONLY)
            // ─────────────────────────────────────────────────────────────
            if (typeof frappeState !== 'undefined' && theme.frappeCSS) {
                const css = theme.frappeCSS;
                
                // Helper to convert hex back to token (approximate)
                const hexToToken = (hex, prefix) => {
                    // For now, store the resolved values - we'll need reverse lookup
                    // This is a simplified approach - stores hex directly for some values
                    return hex;
                };
                
                // Sizing (direct values)
                if (css['--border-radius']) frappeState.borderRadius = css['--border-radius'];
                if (css['--border-radius-lg']) frappeState.borderRadiusLg = css['--border-radius-lg'];
                if (css['--btn-height']) frappeState.btnHeight = css['--btn-height'];
                if (css['--card-border-radius']) frappeState.cardBorderRadius = css['--card-border-radius'];
                
                // Navbar theme (detect from hex)
                if (css['--navbar-bg']) {
                    if (css['--navbar-bg'] === '#1a1a1a') frappeState.navbarTheme = 'dark';
                    else if (css['--navbar-bg'] === '#ffffff') frappeState.navbarTheme = 'light';
                    else frappeState.navbarTheme = 'primary';
                }
                
                // Indicators (purple is direct hex)
                if (css['--indicator-purple']) frappeState.indicatorPurple = css['--indicator-purple'];
                
                // Print B&W (direct hex values)
                if (css['--print-heading-bw']) frappeState.printHeadingBW = css['--print-heading-bw'];
                if (css['--print-text-bw']) frappeState.printTextBW = css['--print-text-bw'];
                if (css['--print-table-header-bw']) frappeState.printTableHeaderBW = css['--print-table-header-bw'];
                if (css['--print-table-border-bw']) frappeState.printTableBorderBW = css['--print-table-border-bw'];
                if (css['--print-footer-bw']) frappeState.printFooterBW = css['--print-footer-bw'];
                
                // Note: Token-based values (like 'primary-500', 'neutral-50') are 
                // regenerated from state.primaryHue/neutralHue, so we don't need 
                // to reverse-map those - they'll be correct after updateUI()
            }
            
            console.log('Default theme loaded successfully');
            return true;
            
        } catch (err) {
            console.warn('Error loading default theme:', err);
            return false;
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // INIT
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Build UI first (creates DOM elements)
    buildUI();
    buildTextFlipTiles();
    // Note: neutralHue slider removed - using new neutral picker instead
    
    // Wire up brand hex apply button
    document.getElementById('applyBrandHex').onclick = applyBrandHex;
    document.getElementById('brandHexInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') applyBrandHex();
    });
    
    // Sync color picker with text input
    document.getElementById('brandColorPicker').addEventListener('input', function() {
        document.getElementById('brandHexInput').value = this.value.toUpperCase();
    });
    document.getElementById('brandHexInput').addEventListener('input', function() {
        const hex = this.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            document.getElementById('brandColorPicker').value = hex;
        }
    });
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ENVIRONMENT DETECTION & COLOR PICKER SETUP
    // ═══════════════════════════════════════════════════════════════════════════

    const ENV = {
        isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
        hasEyeDropper: 'EyeDropper' in window,
        isMac: /Mac/.test(navigator.platform)
    };

    let pickerHSV = { h: 210, s: 85, v: 94 };
    let selectedGridCell = null;

    // ─────────────────────────────────────────────────────────────────────────
    // HSV ↔ HEX Conversion
    // ─────────────────────────────────────────────────────────────────────────
    function hsvToHex(h, s, v) {
        s /= 100;
        v /= 100;
        const c = v * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = v - c;
        let r, g, b;
        if (h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }
        const toHex = (n) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    }

    function hexToHSV(hex) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16) / 255;
        const g = parseInt(hex.substr(2, 2), 16) / 255;
        const b = parseInt(hex.substr(4, 2), 16) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const d = max - min;
        let h = 0, s = max === 0 ? 0 : d / max, v = max;
        if (d !== 0) {
            if (max === r) h = 60 * ((g - b) / d + (g < b ? 6 : 0));
            else if (max === g) h = 60 * ((b - r) / d + 2);
            else h = 60 * ((r - g) / d + 4);
        }
        if (h < 0) h += 360;
        return { h: Math.round(h), s: Math.round(s * 100), v: Math.round(v * 100) };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Build Color Grid (Apple NSColorPanel grid: 12x1 + 12x10)
    // ─────────────────────────────────────────────────────────────────────────
    function buildColorGrid() {
        const grid = document.getElementById('colorGridPicker');
        if (!grid) return;
        grid.innerHTML = '';

        // Top row (12): Apple palette anchors (from Apple.clr + system gray)
        const topRow = [
            '#FF2600', // Red
            '#FF9300', // Orange
            '#FFFB00', // Yellow
            '#00F900', // Green
            '#00FDFF', // Cyan
            '#0433FF', // Blue
            '#FF40FF', // Magenta
            '#942192', // Purple
            '#AA7942', // Brown
            '#FFFFFF', // White
            '#8E8E93', // Gray (system gray)
            '#000000'  // Black
        ];

        // 12x10 matrix: exact Apple grid values (row-major)
        // Grayscale row (row_0 from Apple spec, first cell is "no fill")
        const grayRow = [
            null, '#FFFFFF', '#EBEBEB', '#D6D6D6', '#C0C0C0', '#ABABAB',
            '#939393', '#7A7A7A', '#5F5F5F', '#444444', '#232323', '#000000'
        ];

        // Color grid rows - exact Apple color picker values (rows 1-9)
        const gridRows = [
            ['#00313F', '#001D4C', '#12013B', '#2E043E', '#3D071C', '#5C0700', '#5B1B01', '#573501', '#563D01', '#666101', '#4F5604', '#263D0F'],
            ['#014D63', '#002F7B', '#1B0853', '#430E59', '#56102A', '#821100', '#7C2A01', '#7B4A02', '#775801', '#8C8700', '#707607', '#375819'],
            ['#026E8E', '#0142A9', '#2C1276', '#61187C', '#781A3E', '#B61A01', '#AD3F00', '#A96801', '#A77B01', '#C4BC01', '#9BA60E', '#4F7A28'],
            ['#018DB4', '#0157D7', '#371A96', '#7B209E', '#9A234E', '#E22400', '#DA5100', '#D48601', '#D29F01', '#F5EC00', '#C5D117', '#679C33'],
            ['#00A2D7', '#0062FE', '#4E22B3', '#992ABD', '#BF2E66', '#FF4112', '#FF6A01', '#FEAA00', '#FEC802', '#FFFC40', '#DAEB38', '#77BB40'],
            ['#00C7FC', '#3A8AFC', '#5E30EA', '#BD39F3', '#E53C7A', '#FF6251', '#FF8548', '#FEB440', '#FECA3E', '#FFF86B', '#E4EF65', '#97D25F'],
            ['#52D4FD', '#74A7FF', '#864EFE', '#D258FE', '#EC719F', '#FF8D81', '#FEA57D', '#FFC879', '#FFD876', '#FFF894', '#EAF48F', '#B1DE8B'],
            ['#93D9F7', '#A4C7FF', '#B18CFF', '#DF90FC', '#F4A4C1', '#FFB5AE', '#FFC4AA', '#FED9A8', '#FFE4A9', '#FEFBB8', '#F2F8B8', '#CBE8B5'],
            ['#D1E6F1', '#D4E4FE', '#D7CEFD', '#F0CAFD', '#F9D2E2', '#FFDBD9', '#FEE2D5', '#FFEDD6', '#FFF2D4', '#FEFCDD', '#F7FADB', '#E0EDD4']
        ];

        // Render top row (anchor colors)
        topRow.forEach(hex => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.style.backgroundColor = hex;
            cell.dataset.hex = hex;
            cell.onclick = () => selectGridCell(cell, hex);
            grid.appendChild(cell);
        });

        // Spacer row (gap after top row like Apple)
        for (let i = 0; i < 12; i++) {
            const spacer = document.createElement('div');
            spacer.className = 'grid-spacer';
            grid.appendChild(spacer);
        }

        // Render grayscale row
        grayRow.forEach(hex => {
            const cell = document.createElement('div');
            if (hex === null) {
                // "No fill" cell with red diagonal line
                cell.className = 'grid-cell no-fill';
                cell.style.backgroundColor = '#FFFFFF';
                cell.dataset.hex = 'none';
                cell.title = 'No Fill';
            } else {
                cell.className = 'grid-cell';
                cell.style.backgroundColor = hex;
                cell.dataset.hex = hex;
                cell.onclick = () => selectGridCell(cell, hex);
            }
            grid.appendChild(cell);
        });

        // Render 12x10 color grid (dark to light)
        gridRows.forEach(row => {
            row.forEach(hex => {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.backgroundColor = hex;
                cell.dataset.hex = hex;
                cell.onclick = () => selectGridCell(cell, hex);
                grid.appendChild(cell);
            });
        });
    }

    function selectGridCell(cell, hex) {
        if (selectedGridCell) selectedGridCell.classList.remove('selected');
        selectedGridCell = cell;
        cell.classList.add('selected');
        pickerHSV = hexToHSV(hex);
        updatePickerUI(false);
        updatePickerSliderBackgrounds();
    }

    function updatePickerUI(deselectGrid = true) {
        const hex = hsvToHex(pickerHSV.h, pickerHSV.s, pickerHSV.v);
        document.getElementById('pickerHue').value = pickerHSV.h;
        document.getElementById('pickerHueNum').value = pickerHSV.h;
        document.getElementById('pickerSat').value = pickerHSV.s;
        document.getElementById('pickerSatNum').value = pickerHSV.s;
        document.getElementById('pickerVal').value = pickerHSV.v;
        document.getElementById('pickerValNum').value = pickerHSV.v;
        document.getElementById('pickerSwatchLarge').style.backgroundColor = hex;
        document.getElementById('pickerHexInput').value = hex;
        if (deselectGrid && selectedGridCell) {
            selectedGridCell.classList.remove('selected');
            selectedGridCell = null;
        }
    }

    function updatePickerSliderBackgrounds() {
        const satSlider = document.getElementById('pickerSat');
        const valSlider = document.getElementById('pickerVal');
        if (satSlider) {
            satSlider.style.background = `linear-gradient(to right, #888, hsl(${pickerHSV.h},100%,50%))`;
        }
        if (valSlider) {
            valSlider.style.background = `linear-gradient(to right, #000, hsl(${pickerHSV.h},100%,50%))`;
        }
    }

    function setupPickerSliders() {
        ['Hue', 'Sat', 'Val'].forEach(name => {
            const slider = document.getElementById('picker' + name);
            const num = document.getElementById('picker' + name + 'Num');
            if (!slider || !num) return;

            const update = (val) => {
                val = parseInt(val);
                if (name === 'Hue') pickerHSV.h = Math.max(0, Math.min(360, val));
                else if (name === 'Sat') pickerHSV.s = Math.max(0, Math.min(100, val));
                else pickerHSV.v = Math.max(0, Math.min(100, val));
                updatePickerUI();
                updatePickerSliderBackgrounds();
            };

            slider.addEventListener('input', () => { num.value = slider.value; update(slider.value); });
            num.addEventListener('input', () => { slider.value = num.value; update(num.value); });
        });

        // Hex input
        document.getElementById('pickerHexInput').addEventListener('input', function() {
            const hex = this.value;
            if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
                pickerHSV = hexToHSV(hex);
                updatePickerUI(false);
                updatePickerSliderBackgrounds();
            }
        });

        // Copy button
        document.getElementById('pickerCopyBtn').onclick = () => {
            const hex = document.getElementById('pickerHexInput').value;
            navigator.clipboard.writeText(hex);
            const indicator = document.getElementById('copiedIndicator');
            indicator.classList.add('show');
            setTimeout(() => indicator.classList.remove('show'), 2000);
        };

        // Apply button
        document.getElementById('pickerApplyBtn').onclick = () => {
            const hex = document.getElementById('pickerHexInput').value;
            document.getElementById('brandHexInput').value = hex;
            applyBrandHex();
        };
    }

    // Global eyedropper handler
    async function handleEyedropper() {
        // Safari on macOS: Trigger native color picker
        if (ENV.isSafari && ENV.isMac && !('EyeDropper' in window)) {
            const nativePicker = document.getElementById('brandColorPicker');
            const hint = document.getElementById('eyedropperHint');
            
            if (nativePicker) {
                // Show inline hint immediately
                if (hint) hint.classList.add('show');
                
                // Open picker immediately
                nativePicker.focus();
                nativePicker.click();
                
                // Start fade out after 3 seconds
                if (hint) {
                    setTimeout(() => {
                        hint.classList.add('fade');
                        setTimeout(() => hint.classList.remove('show', 'fade'), 600);
                    }, 3000);
                }
            }
            return;
        }
        
        // Chrome/Edge: Use EyeDropper API
        if (!('EyeDropper' in window)) {
            showNotification('EyeDropper not available in this browser');
            return;
        }
        
        try {
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open();
            const hex = result.sRGBHex.toUpperCase();
            pickerHSV = hexToHSV(hex);
            updatePickerUI(false);
            updatePickerSliderBackgrounds();
        } catch (err) {
            // User cancelled
        }
    }

    function setupColorPicker() {
        const safariRow = document.getElementById('safariPickerRow');
        const pickerPanel = document.getElementById('colorPickerPanel');
        const nativePicker = document.getElementById('brandColorPicker');
        const eyedropperBtn = document.getElementById('pickerEyedropperBtn');
        
        // Keep Safari row in normal flow but collapsed/hidden
        safariRow.style.height = '0';
        safariRow.style.overflow = 'hidden';
        safariRow.style.margin = '0';
        safariRow.style.marginLeft = '300px';
        safariRow.style.padding = '0';
        
        // Show custom inline panel
        pickerPanel.classList.add('active');
        
        // Build the color grid
        buildColorGrid();
        setupPickerSliders();
        updatePickerSliderBackgrounds();
        updatePickerUI(false);
        
        // Show eyedropper for Chrome/Edge/Safari
        if (ENV.hasEyeDropper || (ENV.isSafari && ENV.isMac)) {
            if (eyedropperBtn) {
                eyedropperBtn.classList.remove('eyedropper-hidden');
                if (ENV.isSafari && ENV.isMac) {
                    eyedropperBtn.title = 'Open color picker (with eyedropper)';
                }
            }
            
            // Safari: native picker updates custom picker
            if (ENV.isSafari && ENV.isMac && !ENV.hasEyeDropper) {
                nativePicker.addEventListener('input', function() {
                    const newHex = this.value.toUpperCase();
                    pickerHSV = hexToHSV(newHex);
                    updatePickerUI(false);
                    updatePickerSliderBackgrounds();
                });
            }
        }
    }

    // Setup color picker
    setupColorPicker();

    // Load default theme, then update UI
    loadDefaultTheme().then(() => {
        updateUI(); // Also updates gradient preview

        // FRAPPE ONLY: Initialize Frappe color swatches
        if (typeof initFrappeSwatches === 'function') {
            initFrappeSwatches();
        }

        // Sync brand color picker with current primary-500
        const currentColor = getTokenColor('primary-500');
        if (!state.anchorHex) {
            document.getElementById('brandColorPicker').value = currentColor;
            pickerHSV = hexToHSV(currentColor);
            updatePickerUI(false);
            updatePickerSliderBackgrounds();
        }
        
        updateBumpButtons();
        console.log('Theme editor initialized');
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // NEUTRAL COLOR PICKER (completely independent)
    // ═══════════════════════════════════════════════════════════════════════════

    var neutralSelectedHue = 210;
    var neutralSelectedCell = null;

    function buildNeutralGrid() {
        var grid = document.getElementById('neutralColorGrid');
        if (!grid) return;
        grid.innerHTML = '';

        // Exact hex codes from reference - 3 rows x 5 columns
        // Row 1: Subtle (LE)
        // Row 2: Medium (M)
        // Row 3: Strong (G)
        var gridColors = [
            // Row 1: Subtle - Cool to Warm
            { hex: '#9BA3A9', hue: 210 },
            { hex: '#9CA2A7', hue: 200 },
            { hex: '#9DA1A4', hue: 190 },
            { hex: '#9E9E9E', hue: 0 },
            { hex: '#9F9D9C', hue: 30 },
            // Row 2: Medium - Cool to Warm
            { hex: '#8A9BA8', hue: 210 },
            { hex: '#8F9BA3', hue: 200 },
            { hex: '#949B9F', hue: 190 },
            { hex: '#9E9E9E', hue: 0 },
            { hex: '#A19D9B', hue: 30 },
            // Row 3: Strong - Cool to Warm
            { hex: '#7A93A7', hue: 210 },
            { hex: '#84959F', hue: 200 },
            { hex: '#8E979A', hue: 190 },
            { hex: '#9E9E9E', hue: 0 },
            { hex: '#A39B97', hue: 30 }
        ];

        gridColors.forEach(function(color) {
            var cell = document.createElement('div');
            cell.className = 'neutral-grid-cell';
            cell.style.backgroundColor = color.hex;
            cell.dataset.hue = color.hue;
            cell.onclick = function() { selectNeutralCell(cell, color.hue, color.hex); };
            grid.appendChild(cell);
        });
    }

    function selectNeutralCell(cell, hue, hex) {
        if (neutralSelectedCell) neutralSelectedCell.classList.remove('selected');
        neutralSelectedCell = cell;
        cell.classList.add('selected');
        neutralSelectedHue = hue;
        document.getElementById('neutralPreviewSwatch').style.backgroundColor = hex;
    }

    function applyNeutralColor() {
        state.neutralHue = neutralSelectedHue;
        state.neutralOffset = 0;
        document.getElementById('neutralBumpIndicator').textContent = '0';
        updateNeutralBumpButtons();
        updateUI();
    }

    function bumpNeutralScale(direction) {
        state.neutralOffset = (state.neutralOffset || 0) + direction;
        state.neutralOffset = Math.max(-5, Math.min(5, state.neutralOffset));
        document.getElementById('neutralBumpIndicator').textContent = String(state.neutralOffset);
        updateNeutralBumpButtons();
        updateUI();
    }

    function updateNeutralBumpButtons() {
        var lighterBtn = document.getElementById('neutralBumpLighter');
        var darkerBtn = document.getElementById('neutralBumpDarker');
        if (!lighterBtn || !darkerBtn) return;
        var offset = state.neutralOffset || 0;
        lighterBtn.disabled = (offset <= -5);
        darkerBtn.disabled = (offset >= 5);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // BOOTSTRAP - Initialize the application when DOM is ready
    // ═══════════════════════════════════════════════════════════════════════════
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        // DOM is already ready
        initializeApp();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MODULE END - IIFE closes here
    // All interactions now handled via event delegation
    // ═══════════════════════════════════════════════════════════════════════════
    })(); // End IIFE
