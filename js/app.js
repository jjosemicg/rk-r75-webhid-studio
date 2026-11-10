// ==========================================================================
// MAIN APPLICATION CONTROLLER: RK R75 Blackberry Configurator (ISO-ES)
//  - Empty/Transparent keys render completely blank on the keyboard
//  - Layer access guide for Layers 0, 1, 2, 3
//  - Zero-lag 2D RGB Spectrum Picker + Direct Hex Input + Fast Real-Time Sync
// ==========================================================================

(function () {
    const {
        QMK_KEYCODES,
        HEX_TO_KEYCODE,
        DEFAULT_LAYER_SHORTCUTS,
        ISO_LAYOUT,
        KEYCODES_PALETTE,
        R75HIDDriver,
        KeyTester,
        MacroManager,
        RgbController,
        RGB_EFFECTS
    } = window.RKR75;

    const ISO_ENTER_PATH =
        "M 7 0 L 68 0 Q 75 0 75 7 L 75 95 Q 75 102 68 102 L 20.5 102 Q 13.5 102 13.5 95 L 13.5 52 Q 13.5 48 9.5 48 L 7 48 Q 0 48 0 41 L 0 7 Q 0 0 7 0 Z";

    // Layer descriptions & how to activate each layer on the RK R75
    const LAYER_INFO = {
        0: {
            title: "Capa 0 (Base Windows)",
            howTo: "Activa por defecto en Windows (o pulsando <kbd>Fn</kbd> + <kbd>A</kbd>)"
        },
        1: {
            title: "Capa 1 (Atajos Fn Windows)",
            howTo: "Se activa manteniendo pulsada <kbd>Fn</kbd> en modo Windows"
        },
        2: {
            title: "Capa 2 (Base MAC)",
            howTo: "Se activa cambiando a modo Mac con <kbd>Fn</kbd> + <kbd>S</kbd>"
        },
        3: {
            title: "Capa 3 (Atajos Fn MAC)",
            howTo: "Se activa manteniendo pulsada <kbd>Fn</kbd> estando en modo Mac (<kbd>Fn</kbd> + <kbd>S</kbd>)"
        }
    };

    class App {
        constructor() {
            this.currentTab = "keymap";
            this.currentLayer = 0;
            this.selectedKey = null;
            this.livePollInterval = null;

            this.layerMaps = this.loadSavedKeymaps();

            this.hidDriver = new R75HIDDriver();
            this.tester = new KeyTester();
            this.macros = new MacroManager();
            this.rgb = new RgbController(this.hidDriver);

            this.init();
        }

        loadSavedKeymaps() {
            try {
                const saved = JSON.parse(localStorage.getItem("rk_r75_keymaps_v2"));
                if (saved && saved[0]) return saved;
            } catch (e) {}
            return { 0: {}, 1: {}, 2: {}, 3: {} };
        }

        saveLocalKeymaps() {
            try {
                localStorage.setItem("rk_r75_keymaps_v2", JSON.stringify(this.layerMaps));
            } catch (e) {}
        }

        init() {
            this.setupNavigation();
            this.updateLayerHint();
            this.renderKeyboard();
            this.setupKeymapPanel();
            this.setupTester();
            this.setupLighting();
            this.setupMacros();
            this.setupHidAndSafety();
            this.rgb.applyVisualSimulation();

            this.hidDriver.tryAutoConnect();
        }

        // --- NAVIGATION & LAYER CONTROLS ---
        setupNavigation() {
            const tabBtns = document.querySelectorAll(".tab-btn");
            tabBtns.forEach((btn) => {
                btn.addEventListener("click", () => {
                    const target = btn.dataset.tab;
                    tabBtns.forEach((b) => b.classList.remove("active"));
                    btn.classList.add("active");

                    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
                    const content = document.getElementById("tab-" + target);
                    if (content) content.classList.add("active");

                    this.currentTab = target;
                    if (target === "tester") {
                        document.body.classList.add("tester-active");
                    } else {
                        document.body.classList.remove("tester-active");
                    }
                    this.tester.renderKeyStates();
                });
            });

            document.querySelectorAll(".layer-btn").forEach((btn) => {
                btn.addEventListener("click", async () => {
                    document.querySelectorAll(".layer-btn").forEach((b) => b.classList.remove("active"));
                    btn.classList.add("active");
                    this.currentLayer = parseInt(btn.dataset.layer, 10);
                    this.selectedKey = null;

                    // Sync MAC LED visual indicator when viewing Mac layers (2 or 3)
                    this.tester.leds.macMode = (this.currentLayer === 2 || this.currentLayer === 3);

                    this.updateLayerHint();
                    this.renderKeyboard();
                    this.updateSelectedKeyHeader();

                    if (this.hidDriver.isConnected) {
                        await this.readCurrentLayerFromHardware(true);
                    }
                });
            });
        }

        updateLayerHint() {
            const hintEl = document.getElementById("layer-access-hint");
            if (!hintEl) return;
            const info = LAYER_INFO[this.currentLayer] || LAYER_INFO[0];
            hintEl.innerHTML =
                '<i class="fa-solid fa-layer-group" style="color: var(--color-lilac-accent);"></i> ' +
                "<strong>" + info.title + ":</strong> " +
                "<span>" + info.howTo + "</span>";
        }

        getEffectiveKeyDef(item) {
            const coord = item.row + "," + item.col;
            const layerMap = this.layerMaps[this.currentLayer] || {};
            const defaultShortcuts = (DEFAULT_LAYER_SHORTCUTS && DEFAULT_LAYER_SHORTCUTS[this.currentLayer]) || {};
            let qmkId = layerMap[coord];

            // Layer 0: Base Windows
            if (this.currentLayer === 0) {
                if (qmkId && QMK_KEYCODES[qmkId]) {
                    const isBlank = (qmkId === "KC_TRNS" || qmkId === "KC_NO");
                    return {
                        qmkId: qmkId,
                        label: isBlank ? "" : QMK_KEYCODES[qmkId].label,
                        sub: isBlank ? "" : (QMK_KEYCODES[qmkId].sub || ""),
                        hex: QMK_KEYCODES[qmkId].hex
                    };
                }
                const baseObj = QMK_KEYCODES[item.qmk] || { hex: 0x0000 };
                return {
                    qmkId: item.qmk,
                    label: item.label,
                    sub: item.sub || "",
                    hex: baseObj.hex
                };
            }

            // Layer 2: Base MAC (same base keys as ISO-ES, with Mac modifiers Opt ⌥ / Cmd ⌘ / Fn MO(3))
            if (this.currentLayer === 2) {
                if (!qmkId || qmkId === "KC_TRNS") {
                    qmkId = defaultShortcuts[coord] || item.qmk;
                }
                if (qmkId === "KC_NO") {
                    return { qmkId: "KC_NO", label: "", sub: "", hex: 0x0000 };
                }
                if (qmkId === "KC_LALT" && coord === "5,1") {
                    return { qmkId: "KC_LALT", label: "Opt", sub: "⌥", hex: QMK_KEYCODES.KC_LALT.hex };
                }
                if ((qmkId === "KC_LGUI" && coord === "5,2") || ((qmkId === "KC_RGUI" || qmkId === "KC_RALT") && coord === "5,9")) {
                    return { qmkId: qmkId, label: "Cmd", sub: "⌘", hex: (QMK_KEYCODES[qmkId] || QMK_KEYCODES.KC_LGUI).hex };
                }
                if (qmkId === item.qmk) {
                    const baseObj = QMK_KEYCODES[item.qmk] || { hex: 0x0000 };
                    return {
                        qmkId: item.qmk,
                        label: item.label,
                        sub: item.sub || "",
                        hex: baseObj.hex
                    };
                }
                if (QMK_KEYCODES[qmkId]) {
                    return {
                        qmkId: qmkId,
                        label: QMK_KEYCODES[qmkId].label,
                        sub: QMK_KEYCODES[qmkId].sub || "",
                        hex: QMK_KEYCODES[qmkId].hex
                    };
                }
            }

            // Layers 1 (Fn Windows) & 3 (Fn Mac):
            // Keep Fn+A [3,1] visible as "Modo Win" even if firmware reports 0x0000 in Layer 1
            if (coord === "3,1" && (!qmkId || qmkId === "KC_NO" || qmkId === "KC_TRNS")) {
                qmkId = "TO_0";
            } else if (!qmkId) {
                qmkId = defaultShortcuts[coord] || "KC_TRNS";
            }

            if (qmkId && QMK_KEYCODES[qmkId] && qmkId !== "KC_TRNS" && qmkId !== "KC_NO") {
                return {
                    qmkId: qmkId,
                    label: QMK_KEYCODES[qmkId].label,
                    sub: QMK_KEYCODES[qmkId].sub || "",
                    hex: QMK_KEYCODES[qmkId].hex
                };
            }

            // Unassigned / transparent keys on Fn layers stay 100% blank
            return {
                qmkId: "KC_TRNS",
                label: "",
                sub: "",
                hex: 0x0001
            };
        }

        // --- RENDER KEYBOARD CHASSIS ---
        renderKeyboard() {
            const chassis = document.getElementById("keyboard-chassis");
            if (!chassis) return;

            chassis.innerHTML = "";

            ISO_LAYOUT.forEach((rowDef) => {
                const rowEl = document.createElement("div");
                rowEl.className = "kbd-row";

                rowDef.forEach((item) => {
                    const unitWidth = item.u || 1;

                    if (item.spacer) {
                        const spacerEl = document.createElement("div");
                        spacerEl.className = "spacer";
                        spacerEl.style.setProperty("--u", unitWidth);
                        rowEl.appendChild(spacerEl);
                        return;
                    }

                    if (item.ledCluster) {
                        const clusterEl = document.createElement("div");
                        clusterEl.className = "led-cluster";
                        clusterEl.style.setProperty("--u", unitWidth);

                        clusterEl.innerHTML =
                            '<div id="led-caps" class="led-item" title="Indicador Bloqueo de Mayúsculas (A)">' +
                                '<span class="led-label">A</span><span class="led-diode"></span>' +
                            "</div>" +
                            '<div id="led-win" class="led-item" title="Indicador Bloqueo de Tecla Windows (Haz clic para alternar)">' +
                                '<span class="led-label"><i class="fa-solid fa-lock" style="font-size:0.48rem;margin-right:1px;"></i>W</span><span class="led-diode"></span>' +
                            "</div>" +
                            '<div id="led-mac" class="led-item" title="Indicador Modo MAC (Haz clic para alternar)">' +
                                '<span class="led-label">MAC</span><span class="led-diode"></span>' +
                            "</div>";

                        clusterEl.querySelector("#led-caps").addEventListener("click", () => {
                            this.tester.toggleLed("caps");
                        });
                        clusterEl.querySelector("#led-win").addEventListener("click", () => {
                            this.tester.toggleLed("winLock");
                            this.showToast(
                                "Bloqueo de Windows: " + (this.tester.leds.winLock ? "ACTIVADO" : "DESACTIVADO"),
                                "info"
                            );
                        });
                        clusterEl.querySelector("#led-mac").addEventListener("click", () => {
                            this.tester.toggleLed("macMode");
                            this.showToast(
                                "Modo MAC: " + (this.tester.leds.macMode ? "ACTIVADO" : "DESACTIVADO"),
                                "info"
                            );
                        });

                        rowEl.appendChild(clusterEl);
                        return;
                    }

                    if (item.knob) {
                        const knobEl = document.createElement("div");
                        knobEl.className = "knob-container";
                        knobEl.style.setProperty("--u", unitWidth);
                        knobEl.title = "Rueda de Volumen CNC (Clic: Mute | Matriz 0,14)";
                        knobEl.innerHTML = '<div class="knob-inner"><i class="fa-solid fa-volume-high"></i></div>';
                        knobEl.addEventListener("click", () => {
                            this.tester.playClickSound(false);
                            if (this.currentTab === "keymap") {
                                this.selectKeyForRemap(knobEl, item);
                            } else {
                                this.showToast("Encoder CNC [0,14]: Silenciar / Volumen", "info");
                            }
                        });
                        rowEl.appendChild(knobEl);
                        return;
                    }

                    const effective = this.getEffectiveKeyDef(item);
                    const keyEl = document.createElement("div");
                    keyEl.className = "key key-" + item.type;
                    keyEl.style.setProperty("--u", unitWidth);
                    keyEl.dataset.code = item.code;
                    keyEl.dataset.row = item.row;
                    keyEl.dataset.col = item.col;
                    keyEl.title = "Matriz PCB: [" + item.row + "," + item.col + "] • QMK: " + effective.qmkId;

                    if (item.isoEnter) {
                        keyEl.classList.add("iso-enter-key");
                        const wrap = document.createElement("div");
                        wrap.className = "iso-enter-wrap";
                        wrap.style.setProperty("--u", unitWidth);

                        const enterText = effective.label
                            ? (effective.qmkId === "KC_ENT" ? "Enter ↵" : effective.label)
                            : "";

                        keyEl.innerHTML =
                            '<svg class="iso-enter-svg" viewBox="0 0 75 106" xmlns="http://www.w3.org/2000/svg">' +
                                "<defs>" +
                                    '<linearGradient id="isoEnterGrad" x1="0%" y1="0%" x2="0%" y2="100%">' +
                                        '<stop offset="0%" stop-color="#d5b8f6" />' +
                                        '<stop offset="100%" stop-color="#bc91eb" />' +
                                    "</linearGradient>" +
                                "</defs>" +
                                '<path class="iso-shadow-path" d="' + ISO_ENTER_PATH + '" transform="translate(0, 4)" />' +
                                '<path class="iso-body-path" d="' + ISO_ENTER_PATH + '" />' +
                            "</svg>" +
                            '<div class="iso-enter-legend"><span class="main-legend">' + enterText + "</span></div>";

                        wrap.appendChild(keyEl);
                        rowEl.appendChild(wrap);
                    } else {
                        let legendsHtml = "";
                        if (effective.sub) {
                            legendsHtml += '<span class="sub-legend">' + effective.sub + "</span>";
                        }
                        legendsHtml += '<span class="main-legend">' + effective.label + "</span>";
                        keyEl.innerHTML = legendsHtml;
                        rowEl.appendChild(keyEl);
                    }

                    keyEl.addEventListener("click", () => {
                        this.tester.playClickSound(false);
                        if (this.currentTab === "keymap") {
                            this.selectKeyForRemap(keyEl, item);
                        }
                    });
                });

                chassis.appendChild(rowEl);
            });

            this.tester.renderKeyStates();
            this.rgb.applyVisualSimulation();
        }

        // --- KEYMAP REMAP DOCK ---
        selectKeyForRemap(keyEl, keyData) {
            document.querySelectorAll(".key, .knob-container").forEach((k) => k.classList.remove("selected"));
            keyEl.classList.add("selected");
            this.selectedKey = { element: keyEl, data: keyData };
            this.updateSelectedKeyHeader();
        }

        updateSelectedKeyHeader() {
            const labelBadge = document.getElementById("selected-key-label");
            if (!labelBadge) return;

            if (!this.selectedKey) {
                labelBadge.textContent = "Ninguna seleccionada";
                return;
            }
            const d = this.selectedKey.data;
            const eff = this.getEffectiveKeyDef(d);
            const hexStr = "0x" + eff.hex.toString(16).toUpperCase().padStart(4, "0");
            const displayQmk = eff.label || "Vacía / Libre";
            labelBadge.textContent =
                (d.label || d.code) + " [" + d.row + "," + d.col + "] → " + displayQmk + " (" + hexStr + ")";
        }

        setupKeymapPanel() {
            const catButtons = document.querySelectorAll(".category-pill");
            catButtons.forEach((btn) => {
                btn.addEventListener("click", () => {
                    catButtons.forEach((b) => b.classList.remove("active"));
                    btn.classList.add("active");
                    this.renderPaletteCategory(btn.dataset.cat);
                });
            });

            this.renderPaletteCategory("basic");
        }

        renderPaletteCategory(category) {
            const grid = document.getElementById("keys-palette-grid");
            if (!grid) return;
            grid.innerHTML = "";

            const qmkIds = KEYCODES_PALETTE[category] || [];
            qmkIds.forEach((qmkId) => {
                const def = QMK_KEYCODES[qmkId];
                if (!def) return;

                const el = document.createElement("div");
                el.className = "palette-item";
                const hexStr = "0x" + def.hex.toString(16).toUpperCase().padStart(4, "0");
                const visibleName = def.paletteLabel || def.label;
                el.title = qmkId + " (" + hexStr + ")";
                el.innerHTML =
                    (def.sub ? '<span class="palette-sub">' + def.sub + "</span>" : "") +
                    '<span class="palette-main">' + visibleName + "</span>";

                el.addEventListener("click", async () => {
                    await this.assignKeycodeToSelected(qmkId, def);
                });
                grid.appendChild(el);
            });
        }

        async assignKeycodeToSelected(qmkId, def) {
            if (!this.selectedKey) {
                this.showToast("Primero haz clic en una tecla del teclado superior", "info");
                return;
            }

            const { row, col } = this.selectedKey.data;
            const coord = row + "," + col;

            if (!this.layerMaps[this.currentLayer]) {
                this.layerMaps[this.currentLayer] = {};
            }
            this.layerMaps[this.currentLayer][coord] = qmkId;
            this.saveLocalKeymaps();

            this.renderKeyboard();
            const newEl = document.querySelector('.key[data-row="' + row + '"][data-col="' + col + '"]');
            if (newEl) {
                newEl.classList.add("selected");
                this.selectedKey.element = newEl;
            }
            this.updateSelectedKeyHeader();

            const friendlyName = def.paletteLabel || def.label;

            if (this.hidDriver.isConnected) {
                if (this.hidDriver.writeProtection) {
                    this.showToast(
                        "Vista actualizada [" + friendlyName + "]. Desmarca 'Solo Lectura' para guardarlo en el teclado.",
                        "info"
                    );
                } else {
                    try {
                        await this.hidDriver.writeKeycode(this.currentLayer, row, col, def.hex);
                        this.showToast(
                            "Sincronizado: [" + friendlyName + "] → Capa " + this.currentLayer + " [" + row + "," + col + "]",
                            "success"
                        );
                    } catch (err) {
                        this.showToast("Error al sincronizar: " + err.message, "error");
                    }
                }
            } else {
                this.showToast("Asignado [" + friendlyName + "] en Capa " + this.currentLayer, "info");
            }
        }

        // --- TESTER TAB ---
        setupTester() {
            const resetBtn = document.getElementById("btn-reset-tester");
            if (resetBtn) {
                resetBtn.addEventListener("click", () => {
                    this.tester.reset();
                    this.showToast("Marcas del probador reiniciadas", "info");
                });
            }

            const soundCheck = document.getElementById("tester-sound-toggle");
            if (soundCheck) {
                soundCheck.addEventListener("change", (e) => {
                    this.tester.soundEnabled = e.target.checked;
                });
            }

            this.tester.onStatsUpdate = (stats) => {
                const activeEl = document.getElementById("stat-active-keys");
                const testedEl = document.getElementById("stat-tested-keys");
                const totalEl = document.getElementById("stat-total-presses");
                const lastKeyEl = document.getElementById("stat-last-key");

                if (activeEl) activeEl.textContent = stats.activeCount;
                if (testedEl) testedEl.textContent = stats.testedCount;
                if (totalEl) totalEl.textContent = stats.totalPresses;
                if (lastKeyEl) lastKeyEl.textContent = stats.lastKey;
            };
        }

        // --- LIGHTING RGB + 2D SPECTRUM BOX + HEX INPUT ---
        setupLighting() {
            const selectEffect = document.getElementById("select-rgb-effect");
            if (selectEffect) {
                selectEffect.innerHTML = "";
                RGB_EFFECTS.forEach((eff) => {
                    const opt = document.createElement("option");
                    opt.value = eff.id;
                    opt.textContent = eff.id + ". " + eff.name;
                    if (eff.id === this.rgb.getState().effect) opt.selected = true;
                    selectEffect.appendChild(opt);
                });

                selectEffect.addEventListener("change", (e) => {
                    this.rgb.updateProperty("effect", parseInt(e.target.value, 10), true);
                });
            }

            const sliderBrightness = document.getElementById("slider-brightness");
            const valBrightness = document.getElementById("val-brightness");
            if (sliderBrightness) {
                sliderBrightness.value = this.rgb.getState().brightness;
                if (valBrightness) valBrightness.textContent = sliderBrightness.value;
                sliderBrightness.addEventListener("input", (e) => {
                    if (valBrightness) valBrightness.textContent = e.target.value;
                    this.rgb.updateProperty("brightness", parseInt(e.target.value, 10), false);
                });
                sliderBrightness.addEventListener("change", (e) => {
                    this.rgb.updateProperty("brightness", parseInt(e.target.value, 10), true);
                });
            }

            const sliderSpeed = document.getElementById("slider-speed");
            const valSpeed = document.getElementById("val-speed");
            if (sliderSpeed) {
                sliderSpeed.value = this.rgb.getState().speed;
                if (valSpeed) valSpeed.textContent = sliderSpeed.value;
                sliderSpeed.addEventListener("input", (e) => {
                    if (valSpeed) valSpeed.textContent = e.target.value;
                    this.rgb.updateProperty("speed", parseInt(e.target.value, 10), false);
                });
                sliderSpeed.addEventListener("change", (e) => {
                    this.rgb.updateProperty("speed", parseInt(e.target.value, 10), true);
                });
            }

            this.initRgbSpectrumPicker();
        }

        initRgbSpectrumPicker() {
            const canvas = document.getElementById("rgb-spectrum-canvas");
            const wrap = document.getElementById("rgb-spectrum-wrap");
            const cursor = document.getElementById("rgb-spectrum-cursor");
            const hexInput = document.getElementById("rgb-hex-input");
            const previewChip = document.getElementById("rgb-color-preview-chip");
            const hsvReadout = document.getElementById("rgb-hsv-readout");

            if (!canvas || !wrap) return;
            const ctx = canvas.getContext("2d");
            const width = canvas.width;
            const height = canvas.height;

            const horizGrad = ctx.createLinearGradient(0, 0, width, 0);
            horizGrad.addColorStop(0,    "#ff0000");
            horizGrad.addColorStop(0.17, "#ffff00");
            horizGrad.addColorStop(0.33, "#00ff00");
            horizGrad.addColorStop(0.50, "#00ffff");
            horizGrad.addColorStop(0.67, "#0000ff");
            horizGrad.addColorStop(0.83, "#ff00ff");
            horizGrad.addColorStop(1,    "#ff0000");
            ctx.fillStyle = horizGrad;
            ctx.fillRect(0, 0, width, height);

            const vertGrad = ctx.createLinearGradient(0, 0, 0, height);
            vertGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
            vertGrad.addColorStop(1, "rgba(255, 255, 255, 1)");
            ctx.fillStyle = vertGrad;
            ctx.fillRect(0, 0, width, height);

            const applyHexToPickerUi = (hexColor, skipInputUpdate) => {
                const cleanHex = hexColor.startsWith("#") ? hexColor : "#" + hexColor;
                const hsv = R75HIDDriver.hexToQmkHsv(cleanHex);
                const xPct = (hsv.h / 255) * 100;
                const yPct = (1 - hsv.s / 255) * 100;

                if (cursor) {
                    cursor.style.left = xPct + "%";
                    cursor.style.top = yPct + "%";
                    cursor.style.backgroundColor = cleanHex;
                }
                if (previewChip) {
                    previewChip.style.backgroundColor = cleanHex;
                }
                if (hexInput && !skipInputUpdate) {
                    hexInput.value = cleanHex.replace("#", "").toUpperCase();
                }
                if (hsvReadout) {
                    hsvReadout.textContent =
                        cleanHex.toUpperCase() + " • H:" + hsv.h + " S:" + hsv.s;
                }
            };

            this.updatePickerUiFromHex = applyHexToPickerUi;
            applyHexToPickerUi(this.rgb.getState().color, false);

            const pickFromPointer = (e, saveFinal) => {
                const rect = wrap.getBoundingClientRect();
                const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

                const hByte = Math.round(relX * 255);
                const sByte = Math.round((1 - relY) * 255);
                const hex = R75HIDDriver.qmkHsvToHex(hByte, sByte);

                applyHexToPickerUi(hex, false);
                this.rgb.updateProperty("color", hex, saveFinal);
            };

            let isDragging = false;
            wrap.addEventListener("pointerdown", (e) => {
                isDragging = true;
                wrap.setPointerCapture(e.pointerId);
                pickFromPointer(e, false);
            });
            wrap.addEventListener("pointermove", (e) => {
                if (!isDragging) return;
                pickFromPointer(e, false);
            });
            wrap.addEventListener("pointerup", (e) => {
                if (!isDragging) return;
                isDragging = false;
                pickFromPointer(e, true);
            });

            if (hexInput) {
                hexInput.addEventListener("input", (e) => {
                    const raw = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
                    e.target.value = raw.toUpperCase();
                    if (raw.length === 6) {
                        const hex = "#" + raw.toLowerCase();
                        applyHexToPickerUi(hex, true);
                        this.rgb.updateProperty("color", hex, false);
                    }
                });

                hexInput.addEventListener("change", (e) => {
                    let raw = e.target.value.replace(/[^0-9a-fA-F]/g, "");
                    if (raw.length === 3) {
                        raw = raw[0] + raw[0] + raw[1] + raw[1] + raw[2] + raw[2];
                    }
                    if (raw.length === 6) {
                        const hex = "#" + raw.toLowerCase();
                        applyHexToPickerUi(hex, false);
                        this.rgb.updateProperty("color", hex, true);
                    } else {
                        applyHexToPickerUi(this.rgb.getState().color, false);
                    }
                });
            }

            document.querySelectorAll(".color-swatch").forEach((swatch) => {
                swatch.addEventListener("click", () => {
                    const hex = swatch.dataset.color;
                    applyHexToPickerUi(hex, false);
                    this.rgb.updateProperty("color", hex, true);
                });
            });
        }

        syncRgbUiFromState(hwRgb) {
            if (!hwRgb) return;
            this.rgb.state = Object.assign({}, this.rgb.state, hwRgb);
            this.rgb.applyVisualSimulation();

            const selectEffect = document.getElementById("select-rgb-effect");
            const sliderBrightness = document.getElementById("slider-brightness");
            const valBrightness = document.getElementById("val-brightness");
            const sliderSpeed = document.getElementById("slider-speed");
            const valSpeed = document.getElementById("val-speed");

            if (selectEffect && hwRgb.effect !== undefined) selectEffect.value = hwRgb.effect;
            if (sliderBrightness && hwRgb.brightness !== undefined) {
                sliderBrightness.value = hwRgb.brightness;
                if (valBrightness) valBrightness.textContent = hwRgb.brightness;
            }
            if (sliderSpeed && hwRgb.speed !== undefined) {
                sliderSpeed.value = hwRgb.speed;
                if (valSpeed) valSpeed.textContent = hwRgb.speed;
            }
            if (hwRgb.color && this.updatePickerUiFromHex) {
                this.updatePickerUiFromHex(hwRgb.color, false);
            }
        }

        // --- MACROS ---
        setupMacros() {
            const listEl = document.getElementById("macro-list");
            const txtName = document.getElementById("macro-name");
            const txtText = document.getElementById("macro-text");
            const txtDesc = document.getElementById("macro-desc");
            const btnSave = document.getElementById("btn-save-macro");

            const renderMacroList = () => {
                if (!listEl) return;
                listEl.innerHTML = "";
                this.macros.getMacros().forEach((m, idx) => {
                    const item = document.createElement("div");
                    item.className = "macro-item " + (idx === this.macros.selectedMacroIndex ? "active" : "");
                    item.innerHTML =
                        '<div><div class="font-bold">' + m.name + '</div><div class="macro-sub">' + (m.desc || "Sin descripción") + "</div></div>" +
                        '<span class="macro-tag">M' + idx + "</span>";
                    item.addEventListener("click", () => {
                        this.macros.selectMacro(idx);
                        renderMacroList();
                        loadCurrentMacro();
                    });
                    listEl.appendChild(item);
                });
            };

            const loadCurrentMacro = () => {
                const cur = this.macros.getCurrentMacro();
                if (cur && txtName && txtText && txtDesc) {
                    txtName.value = cur.name;
                    txtText.value = cur.text;
                    txtDesc.value = cur.desc || "";
                }
            };

            document.querySelectorAll(".macro-quick-btn").forEach((btn) => {
                btn.addEventListener("click", () => {
                    if (!txtText) return;
                    txtText.value += btn.dataset.insert;
                    txtText.focus();
                });
            });

            if (btnSave) {
                btnSave.addEventListener("click", () => {
                    this.macros.saveCurrentMacro(txtName.value, txtText.value, txtDesc.value);
                    renderMacroList();
                    this.showToast("Macro M" + this.macros.selectedMacroIndex + " guardada", "success");
                });
            }

            renderMacroList();
            loadCurrentMacro();
        }

        // --- REAL-TIME WEBHID & FAST HARDWARE SYNC ---
        setupHidAndSafety() {
            const btnConnect = document.getElementById("btn-connect");
            const statusIndicator = document.getElementById("connection-status");
            const statusText = document.getElementById("connection-status-text");
            const safeToggle = document.getElementById("safe-mode-toggle");
            const safeBadge = document.getElementById("safe-mode-badge");
            const btnReadKb = document.getElementById("btn-read-keymap");

            if (safeToggle) {
                safeToggle.checked = this.hidDriver.writeProtection;
                safeToggle.addEventListener("change", (e) => {
                    const isProtected = e.target.checked;
                    this.hidDriver.writeProtection = isProtected;
                    if (safeBadge) {
                        if (isProtected) {
                            safeBadge.className = "safe-pill protected";
                            safeBadge.innerHTML = '<i class="fa-solid fa-lock"></i> Solo Lectura';
                            this.showToast("Bloqueo de escritura activado", "info");
                        } else {
                            safeBadge.className = "safe-pill writable";
                            safeBadge.innerHTML = '<i class="fa-solid fa-bolt"></i> Sincronización en Tiempo Real';
                            this.showToast("Sincronización en tiempo real activa", "success");
                        }
                    }
                });
            }

            if (btnReadKb) {
                btnReadKb.addEventListener("click", async () => {
                    if (!this.hidDriver.isConnected) {
                        this.showToast("Conecta el teclado por USB primero", "info");
                        return;
                    }
                    await this.syncAllFromHardware();
                });
            }

            this.hidDriver.onLog = (msg) => {
                const logBar = document.getElementById("safety-log-text");
                if (logBar) {
                    logBar.textContent = msg;
                }
            };

            this.hidDriver.onStatusChange = async (connected, name, protoVer) => {
                if (connected) {
                    statusIndicator.classList.add("connected");
                    statusText.textContent = (name || "RK R75") + (protoVer ? " (VIA v" + protoVer + ")" : "") + " • Tiempo Real";
                    btnConnect.innerHTML = '<i class="fa-solid fa-link-slash"></i> Desconectar';
                    btnConnect.classList.replace("btn-primary", "btn-secondary");
                    this.showToast("RK R75 conectado y sincronizando en tiempo real", "success");

                    await this.syncAllFromHardware();
                    this.startLiveHardwareMonitor();
                } else {
                    this.stopLiveHardwareMonitor();
                    statusIndicator.classList.remove("connected");
                    statusText.textContent = "Desconectado (Modo Local)";
                    btnConnect.innerHTML = '<i class="fa-brands fa-usb"></i> Conectar Teclado';
                    btnConnect.classList.replace("btn-secondary", "btn-primary");
                    this.showToast("Teclado desconectado", "info");
                }
            };

            if (btnConnect) {
                btnConnect.addEventListener("click", async () => {
                    if (this.hidDriver.isConnected) {
                        await this.hidDriver.disconnect();
                    } else {
                        try {
                            await this.hidDriver.requestConnection();
                        } catch (err) {
                            this.showToast(err.message, "error");
                        }
                    }
                });
            }
        }

        async syncAllFromHardware() {
            if (!this.hidDriver.isConnected) return;
            const hwRgb = await this.hidDriver.readRgbState();
            if (hwRgb) {
                this.syncRgbUiFromState(hwRgb);
            }
            await this.readCurrentLayerFromHardware(false);
        }

        startLiveHardwareMonitor() {
            this.stopLiveHardwareMonitor();
            this.livePollInterval = setInterval(async () => {
                if (!this.hidDriver.isConnected || this.hidDriver.isBusy) return;
                if (Date.now() - this.rgb.lastUserInteraction < 600) return;

                const hwRgb = await this.hidDriver.readRgbState();
                if (hwRgb && Date.now() - this.rgb.lastUserInteraction >= 600) {
                    const cur = this.rgb.getState();
                    if (
                        hwRgb.effect !== cur.effect ||
                        hwRgb.brightness !== cur.brightness ||
                        hwRgb.speed !== cur.speed ||
                        (hwRgb.color && hwRgb.color.toLowerCase() !== cur.color.toLowerCase())
                    ) {
                        this.syncRgbUiFromState(hwRgb);
                    }
                }
            }, 650);
        }

        stopLiveHardwareMonitor() {
            if (this.livePollInterval) {
                clearInterval(this.livePollInterval);
                this.livePollInterval = null;
            }
        }

        async readCurrentLayerFromHardware(silent) {
            if (!this.hidDriver.isConnected) return;
            if (!silent) {
                this.showToast("Sincronizando teclas desde tu RK R75...", "info");
            }

            const defaultShortcuts = (DEFAULT_LAYER_SHORTCUTS && DEFAULT_LAYER_SHORTCUTS[this.currentLayer]) || {};
            let readCount = 0;

            for (const rowDef of ISO_LAYOUT) {
                for (const item of rowDef) {
                    if (item.spacer || item.ledCluster || item.row === undefined || item.col === undefined) continue;
                    const code16 = await this.hidDriver.readKeycode(this.currentLayer, item.row, item.col);
                    if (code16 !== null) {
                        const coord = item.row + "," + item.col;
                        if (code16 === 0x0000 && (this.currentLayer === 1 || this.currentLayer === 3) && coord === "3,1") {
                            this.layerMaps[this.currentLayer][coord] = "TO_0";
                        } else if (HEX_TO_KEYCODE[code16]) {
                            this.layerMaps[this.currentLayer][coord] = HEX_TO_KEYCODE[code16].id;
                        } else if (defaultShortcuts[coord]) {
                            // Known RK R75 vendor shortcut at this coordinate (e.g., RGB / WinLock / Mac Brightness)
                            this.layerMaps[this.currentLayer][coord] = defaultShortcuts[coord];
                        } else if (this.currentLayer > 0) {
                            // Unassigned or internal vendor key on secondary layers stays completely blank
                            this.layerMaps[this.currentLayer][coord] = "KC_TRNS";
                        }
                        readCount++;
                    }
                }
            }

            if (readCount > 0) {
                this.saveLocalKeymaps();
                this.renderKeyboard();
                if (!silent) {
                    this.showToast("Teclado sincronizado (" + readCount + " teclas)", "success");
                }
            }
        }

        showToast(message, type) {
            type = type || "info";
            const container = document.getElementById("toast-container");
            if (!container) return;

            const toast = document.createElement("div");
            toast.className = "toast " + type;

            let icon = "fa-circle-info";
            if (type === "success") icon = "fa-check-circle";
            if (type === "error") icon = "fa-triangle-exclamation";

            toast.innerHTML = '<i class="fa-solid ' + icon + '"></i><span>' + message + "</span>";
            container.appendChild(toast);

            setTimeout(() => {
                toast.style.opacity = "0";
                toast.style.transform = "translateX(20px)";
                toast.style.transition = "all 0.25s ease";
                setTimeout(() => toast.remove(), 250);
            }, 2800);
        }
    }

    window.addEventListener("DOMContentLoaded", () => {
        window.app = new App();
    });
})();
