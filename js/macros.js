// ==========================================================================
// MACROS MANAGER FOR ROYAL KLUDGE R75
// ==========================================================================

window.RKR75 = window.RKR75 || {};

class MacroManager {
    constructor() {
        let saved = null;
        try {
            saved = JSON.parse(localStorage.getItem("rk_r75_macros"));
        } catch (e) {
            saved = null;
        }

        this.macros = saved || [
            { id: 0, name: "M0 - Copiar", text: "{KC_LCTL,KC_C}", desc: "Atajo rápido Ctrl + C" },
            { id: 1, name: "M1 - Pegar", text: "{KC_LCTL,KC_V}", desc: "Atajo rápido Ctrl + V" },
            { id: 2, name: "M2 - Deshacer", text: "{KC_LCTL,KC_Z}", desc: "Atajo rápido Ctrl + Z" },
            { id: 3, name: "M3 - Captura", text: "{KC_LGUI,KC_LSFT,KC_S}", desc: "Recorte de pantalla en Windows" },
            { id: 4, name: "M4 - Saludo", text: "¡Hola desde mi RK R75 Blackberry!", desc: "Texto automático" },
            { id: 5, name: "M5 - Libre", text: "", desc: "Macro vacía disponible" }
        ];
        this.selectedMacroIndex = 0;
    }

    getMacros() {
        return this.macros;
    }

    getCurrentMacro() {
        return this.macros[this.selectedMacroIndex];
    }

    saveCurrentMacro(name, text, desc) {
        const cleanName = (name || ("M" + this.selectedMacroIndex)).trim().slice(0, 32);
        const cleanText = (text || "").slice(0, 256); // Safe QMK EEPROM macro buffer limit
        const cleanDesc = (desc || "").trim().slice(0, 80);

        this.macros[this.selectedMacroIndex] = {
            id: this.selectedMacroIndex,
            name: cleanName,
            text: cleanText,
            desc: cleanDesc
        };

        try {
            localStorage.setItem("rk_r75_macros", JSON.stringify(this.macros));
        } catch (e) {}
    }

    selectMacro(index) {
        if (index >= 0 && index < this.macros.length) {
            this.selectedMacroIndex = index;
        }
    }
}

window.RKR75.MacroManager = MacroManager;
