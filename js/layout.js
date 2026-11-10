// ==========================================================================
// LAYOUT & QMK KEYCODES: Royal Kludge R75 Blackberry (ISO Español)
// Exact unit (u) geometry (16.25u x 6 rows) & PCB matrix coordinates matched
// 1:1 with "RKR75 Wired Version ISO_LAYOUT (EU).json"
// Includes factory layer maps for:
//   - Capa 0: Windows Base
//   - Capa 1: Windows Fn Shortcuts
//   - Capa 2: Mac Base
//   - Capa 3: Mac Fn Shortcuts
// ==========================================================================

window.RKR75 = window.RKR75 || {};

// Exact 16-bit QMK Keycodes
// Note: KC_NO and KC_TRNS have empty `label: ""` on the keyboard so unassigned keys stay completely blank,
// while `paletteLabel` is shown in the bottom selection dock.
window.RKR75.QMK_KEYCODES = {
    KC_NO:   { hex: 0x0000, label: "", paletteLabel: "Vacía" },
    KC_TRNS: { hex: 0x0001, label: "", paletteLabel: "Libre (Fn)" },
    KC_A: { hex: 0x0004, label: "A" },
    KC_B: { hex: 0x0005, label: "B" },
    KC_C: { hex: 0x0006, label: "C" },
    KC_D: { hex: 0x0007, label: "D" },
    KC_E: { hex: 0x0008, label: "E", sub: "€" },
    KC_F: { hex: 0x0009, label: "F" },
    KC_G: { hex: 0x000A, label: "G" },
    KC_H: { hex: 0x000B, label: "H" },
    KC_I: { hex: 0x000C, label: "I" },
    KC_J: { hex: 0x000D, label: "J" },
    KC_K: { hex: 0x000E, label: "K" },
    KC_L: { hex: 0x000F, label: "L" },
    KC_M: { hex: 0x0010, label: "M" },
    KC_N: { hex: 0x0011, label: "N" },
    KC_O: { hex: 0x0012, label: "O" },
    KC_P: { hex: 0x0013, label: "P" },
    KC_Q: { hex: 0x0014, label: "Q" },
    KC_R: { hex: 0x0015, label: "R" },
    KC_S: { hex: 0x0016, label: "S" },
    KC_T: { hex: 0x0017, label: "T" },
    KC_U: { hex: 0x0018, label: "U" },
    KC_V: { hex: 0x0019, label: "V" },
    KC_W: { hex: 0x001A, label: "W" },
    KC_X: { hex: 0x001B, label: "X" },
    KC_Y: { hex: 0x001C, label: "Y" },
    KC_Z: { hex: 0x001D, label: "Z" },

    // Numbers (0x001E - 0x0027)
    KC_1: { hex: 0x001E, label: "1", sub: "! |" },
    KC_2: { hex: 0x001F, label: "2", sub: '" @' },
    KC_3: { hex: 0x0020, label: "3", sub: "· #" },
    KC_4: { hex: 0x0021, label: "4", sub: "$ ~" },
    KC_5: { hex: 0x0022, label: "5", sub: "%" },
    KC_6: { hex: 0x0023, label: "6", sub: "& ¬" },
    KC_7: { hex: 0x0024, label: "7", sub: "/" },
    KC_8: { hex: 0x0025, label: "8", sub: "(" },
    KC_9: { hex: 0x0026, label: "9", sub: ")" },
    KC_0: { hex: 0x0027, label: "0", sub: "=" },

    // Punctuation & Spanish ISO Keys
    KC_ENT:  { hex: 0x0028, label: "Enter" },
    KC_ESC:  { hex: 0x0029, label: "Esc" },
    KC_BSPC: { hex: 0x002A, label: "Bksp" },
    KC_TAB:  { hex: 0x002B, label: "Tab" },
    KC_SPC:  { hex: 0x002C, label: "Space" },
    KC_MINS: { hex: 0x002D, label: "'", sub: "?" },
    KC_EQL:  { hex: 0x002E, label: "¡", sub: "¿" },
    KC_LBRC: { hex: 0x002F, label: "`", sub: "^ [" },
    KC_RBRC: { hex: 0x0030, label: "+", sub: "* ]" },
    KC_BSLS: { hex: 0x0031, label: "Ç", sub: "}" },
    KC_NUHS: { hex: 0x0032, label: "Ç", sub: "}" },
    KC_SCLN: { hex: 0x0033, label: "Ñ" },
    KC_QUOT: { hex: 0x0034, label: "´", sub: "¨ {" },
    KC_GRV:  { hex: 0x0035, label: "º", sub: "ª \\" },
    KC_COMM: { hex: 0x0036, label: ",", sub: ";" },
    KC_DOT:  { hex: 0x0037, label: ".", sub: ":" },
    KC_SLSH: { hex: 0x0038, label: "-", sub: "_" },
    KC_CAPS: { hex: 0x0039, label: "Caps" },
    KC_NUBS: { hex: 0x0064, label: "<", sub: ">" },

    // Function Keys (0x003A - 0x0045)
    KC_F1:  { hex: 0x003A, label: "F1" },
    KC_F2:  { hex: 0x003B, label: "F2" },
    KC_F3:  { hex: 0x003C, label: "F3" },
    KC_F4:  { hex: 0x003D, label: "F4" },
    KC_F5:  { hex: 0x003E, label: "F5" },
    KC_F6:  { hex: 0x003F, label: "F6" },
    KC_F7:  { hex: 0x0040, label: "F7" },
    KC_F8:  { hex: 0x0041, label: "F8" },
    KC_F9:  { hex: 0x0042, label: "F9" },
    KC_F10: { hex: 0x0043, label: "F10" },
    KC_F11: { hex: 0x0044, label: "F11" },
    KC_F12: { hex: 0x0045, label: "F12" },

    // Navigation & Editing
    KC_PSCR: { hex: 0x0046, label: "PrtSc" },
    KC_SLCK: { hex: 0x0047, label: "ScrLk" },
    KC_PAUS: { hex: 0x0048, label: "Pause" },
    KC_INS:  { hex: 0x0049, label: "Ins" },
    KC_HOME: { hex: 0x004A, label: "Home" },
    KC_PGUP: { hex: 0x004B, label: "PgUp" },
    KC_DEL:  { hex: 0x004C, label: "Del" },
    KC_END:  { hex: 0x004D, label: "End" },
    KC_PGDN: { hex: 0x004E, label: "PgDn" },
    KC_RGHT: { hex: 0x004F, label: "▶" },
    KC_LEFT: { hex: 0x0050, label: "◀" },
    KC_DOWN: { hex: 0x0051, label: "▼" },
    KC_UP:   { hex: 0x0052, label: "▲" },

    // Modifiers (0x00E0 - 0x00E7)
    KC_LCTL: { hex: 0x00E0, label: "Ctrl" },
    KC_LSFT: { hex: 0x00E1, label: "Shift" },
    KC_LALT: { hex: 0x00E2, label: "Alt" },
    KC_LGUI: { hex: 0x00E3, label: "Win" },
    KC_RCTL: { hex: 0x00E4, label: "Ctrl" },
    KC_RSFT: { hex: 0x00E5, label: "Shift" },
    KC_RALT: { hex: 0x00E6, label: "AltGr" },
    KC_RGUI: { hex: 0x00E7, label: "Win" },

    // Media, System & Brightness Keys
    KC_MUTE: { hex: 0x00A8, label: "Mute", sub: "🔇" },
    KC_VOLU: { hex: 0x00A9, label: "Vol +", sub: "🔊" },
    KC_VOLD: { hex: 0x00AA, label: "Vol -", sub: "🔉" },
    KC_MNXT: { hex: 0x00AB, label: "Next", sub: "⏭" },
    KC_MPRV: { hex: 0x00AC, label: "Prev", sub: "⏮" },
    KC_MSTP: { hex: 0x00AD, label: "Stop", sub: "⏹" },
    KC_MPLY: { hex: 0x00AE, label: "Play", sub: "⏯" },
    KC_MSEL: { hex: 0x00AF, label: "Media", sub: "🎵" },
    KC_MAIL: { hex: 0x00B0, label: "Mail", sub: "✉" },
    KC_CALC: { hex: 0x00B1, label: "Calc", sub: "🖩" },
    KC_MYCM: { hex: 0x00B2, label: "Mi PC", sub: "💻" },
    KC_WFAV: { hex: 0x00B3, label: "Favs", sub: "★" },
    KC_WSCH: { hex: 0x00B4, label: "Buscar", sub: "🔍" },
    KC_WHOM: { hex: 0x00B5, label: "Web", sub: "🌐" },
    KC_WBAK: { hex: 0x00B6, label: "Atrás", sub: "←" },
    KC_WFWD: { hex: 0x00B7, label: "Adel.", sub: "→" },
    KC_WREF: { hex: 0x00B9, label: "Refr.", sub: "↻" },
    KC_BRIU: { hex: 0x00BD, label: "Brillo+", sub: "☀" },
    KC_BRID: { hex: 0x00BE, label: "Brillo-", sub: "🔅" },
    KC_MCTL: { hex: 0x019F, label: "Misión", sub: "Mac" },
    KC_LPAD: { hex: 0x02A0, label: "Apps", sub: "Mac" },

    // QMK RGB Matrix & Hardware Shortcuts (RK R75 Fn Layer)
    RGB_TOG: { hex: 0x5CC2, label: "On/Off", sub: "RGB", paletteLabel: "RGB On/Off" },
    RGB_MOD: { hex: 0x5CC3, label: "Modo", sub: "RGB", paletteLabel: "RGB Modo+" },
    RGB_RMOD:{ hex: 0x5CC4, label: "Modo-", sub: "RGB", paletteLabel: "RGB Modo-" },
    RGB_HUI: { hex: 0x5CC5, label: "Color", sub: "RGB", paletteLabel: "RGB Color" },
    RGB_HUD: { hex: 0x5CC6, label: "Color-", sub: "RGB", paletteLabel: "RGB Color-" },
    RGB_SAI: { hex: 0x5CC7, label: "Sat +", sub: "RGB", paletteLabel: "RGB Sat+" },
    RGB_SAD: { hex: 0x5CC8, label: "Sat -", sub: "RGB", paletteLabel: "RGB Sat-" },
    RGB_VAI: { hex: 0x5CC9, label: "Brillo+", sub: "RGB", paletteLabel: "RGB Brillo+" },
    RGB_VAD: { hex: 0x5CCA, label: "Brillo-", sub: "RGB", paletteLabel: "RGB Brillo-" },
    RGB_SPI: { hex: 0x5CCB, label: "Vel +", sub: "RGB", paletteLabel: "RGB Vel+" },
    RGB_SPD: { hex: 0x5CCC, label: "Vel -", sub: "RGB", paletteLabel: "RGB Vel-" },
    GU_TOGG: { hex: 0x5C12, label: "WinLk", sub: "🔒", paletteLabel: "Win Lock" },

    // QMK Layer & OS Mode Keys
    MO_0: { hex: 0x5220, label: "MO(0)", sub: "Capa" },
    MO_1: { hex: 0x5221, label: "Fn", sub: "MO(1)", paletteLabel: "MO(1) Fn Win" },
    MO_2: { hex: 0x5222, label: "MO(2)", sub: "Capa" },
    MO_3: { hex: 0x5223, label: "Fn", sub: "MO(3)", paletteLabel: "MO(3) Fn Mac" },
    TG_1: { hex: 0x5261, label: "TG(1)", sub: "Capa" },
    TG_2: { hex: 0x5262, label: "TG(2)", sub: "Capa" },
    TG_3: { hex: 0x5263, label: "TG(3)", sub: "Capa" },
    TO_0: { hex: 0x5200, label: "Win", sub: "Modo", paletteLabel: "Modo Win (0)" },
    TO_1: { hex: 0x5201, label: "TO(1)", sub: "Capa" },
    TO_2: { hex: 0x5202, label: "Mac", sub: "Modo", paletteLabel: "Modo Mac (2)" },
    DF_0: { hex: 0x5240, label: "Win", sub: "Modo", paletteLabel: "Base Win (0)" },
    DF_1: { hex: 0x5241, label: "DF(1)", sub: "Capa" },
    DF_2: { hex: 0x5242, label: "Mac", sub: "Modo", paletteLabel: "Base Mac (2)" },

    // Macros (M0 - M5)
    MACRO_0: { hex: 0x7700, label: "M0", sub: "Macro" },
    MACRO_1: { hex: 0x7701, label: "M1", sub: "Macro" },
    MACRO_2: { hex: 0x7702, label: "M2", sub: "Macro" },
    MACRO_3: { hex: 0x7703, label: "M3", sub: "Macro" },
    MACRO_4: { hex: 0x7704, label: "M4", sub: "Macro" },
    MACRO_5: { hex: 0x7705, label: "M5", sub: "Macro" }
};

// Build reverse lookup table (plus QMK V12 alternate RGB/Magic hex aliases used by RK R75 VIA v12 firmware)
window.RKR75.HEX_TO_KEYCODE = {};
Object.keys(window.RKR75.QMK_KEYCODES).forEach(function (k) {
    var entry = window.RKR75.QMK_KEYCODES[k];
    window.RKR75.HEX_TO_KEYCODE[entry.hex] = { id: k, label: entry.label, sub: entry.sub || "" };
});

// Additional QMK v12 / RK R75 firmware hex aliases so hardware reads map to the right shortcut
var EXTRA_HEX_ALIASES = {
    0x7820: "RGB_TOG",
    0x7821: "RGB_MOD",
    0x7822: "RGB_RMOD",
    0x7823: "RGB_HUI",
    0x7824: "RGB_HUD",
    0x7825: "RGB_SAI",
    0x7826: "RGB_SAD",
    0x7827: "RGB_VAI",
    0x7828: "RGB_VAD",
    0x7829: "RGB_SPI",
    0x782A: "RGB_SPD",
    0x700B: "GU_TOGG",
    0x5C15: "GU_TOGG"
};
Object.keys(EXTRA_HEX_ALIASES).forEach(function (hexKey) {
    var id = EXTRA_HEX_ALIASES[hexKey];
    var entry = window.RKR75.QMK_KEYCODES[id];
    if (entry) {
        window.RKR75.HEX_TO_KEYCODE[Number(hexKey)] = { id: id, label: entry.label, sub: entry.sub || "" };
    }
});

// ==========================================================================
// DEFAULT FACTORY SHORTCUTS PER LAYER (RK R75 ISO-ES)
//   - Layers 0 & 1 = WINDOWS (Capa 0 Base, Capa 1 Fn)
//   - Layers 2 & 3 = MAC     (Capa 2 Base, Capa 3 Fn)
// ==========================================================================
window.RKR75.DEFAULT_LAYER_SHORTCUTS = {
    // Capa 1: Atajos Fn en modo WINDOWS (Manteniendo pulsada Fn)
    1: {
        "0,1":  "KC_MYCM", // Fn + F1  -> Mi PC / Explorador
        "0,2":  "KC_WHOM", // Fn + F2  -> Navegador Web
        "0,3":  "KC_MAIL", // Fn + F3  -> Correo
        "0,4":  "KC_CALC", // Fn + F4  -> Calculadora
        "0,5":  "KC_MSEL", // Fn + F5  -> Reproductor Multimedia
        "0,6":  "KC_MSTP", // Fn + F6  -> Stop
        "0,7":  "KC_MPRV", // Fn + F7  -> Anterior
        "0,8":  "KC_MPLY", // Fn + F8  -> Play / Pausa
        "0,9":  "KC_MNXT", // Fn + F9  -> Siguiente
        "0,10": "KC_MUTE", // Fn + F10 -> Silenciar
        "0,11": "KC_VOLD", // Fn + F11 -> Bajar Volumen
        "0,12": "KC_VOLU", // Fn + F12 -> Subir Volumen
        "0,13": "KC_SLCK", // Fn + Del -> Bloq Despl (Scroll Lock)
        "1,13": "RGB_TOG", // Fn + Bksp -> Encender / Apagar RGB
        "1,14": "KC_PSCR", // Fn + Home -> Captura de Pantalla (PrtSc)
        "2,12": "KC_INS",  // Fn + +*]  -> Insert
        "2,14": "KC_PAUS", // Fn + PgUp -> Pause
        "3,1":  "TO_0",    // Fn + A    -> Cambiar a Modo Windows (Capa 0)
        "3,2":  "TO_2",    // Fn + S    -> Cambiar a Modo Mac (Capa 2)
        "3,11": "RGB_HUI", // Fn + ´¨{  -> Cambiar Color RGB
        "3,13": "RGB_MOD", // Fn + Ç}   -> Cambiar Modo/Efecto RGB
        "3,14": "KC_END",  // Fn + PgDn -> Fin (End)
        "4,12": "RGB_SAI", // Fn + RShift -> Saturación RGB
        "4,13": "RGB_VAI", // Fn + ▲    -> Subir Brillo RGB
        "5,1":  "GU_TOGG", // Fn + Win  -> Bloquear / Desbloquear Tecla Windows
        "5,12": "RGB_SPD", // Fn + ◀    -> Bajar Velocidad RGB
        "5,13": "RGB_VAD", // Fn + ▼    -> Bajar Brillo RGB
        "5,14": "RGB_SPI"  // Fn + ▶    -> Subir Velocidad RGB
    },

    // Capa 2: Base MAC (Se activa con Fn + S)
    // Misma base ISO Español pero con Option (⌥), Command (⌘) y Fn -> MO(3)
    2: {
        "5,1":  "KC_LALT", // En Mac: tecla junto a Ctrl es Option (⌥)
        "5,2":  "KC_LGUI", // En Mac: tecla junto a Space es Command (⌘)
        "5,9":  "KC_RGUI", // En Mac: Command derecho (⌘)
        "5,10": "MO_3"     // En Mac: tecla Fn abre Capa 3 (Atajos Fn Mac)
    },

    // Capa 3: Atajos Fn en modo MAC (Manteniendo pulsada Fn en modo Mac)
    3: {
        "0,1":  "KC_BRID", // Fn + F1  -> Bajar Brillo Pantalla Mac
        "0,2":  "KC_BRIU", // Fn + F2  -> Subir Brillo Pantalla Mac
        "0,3":  "KC_MCTL", // Fn + F3  -> Mission Control Mac
        "0,4":  "KC_LPAD", // Fn + F4  -> Launchpad Apps Mac
        "0,7":  "KC_MPRV", // Fn + F7  -> Anterior
        "0,8":  "KC_MPLY", // Fn + F8  -> Play / Pausa
        "0,9":  "KC_MNXT", // Fn + F9  -> Siguiente
        "0,10": "KC_MUTE", // Fn + F10 -> Silenciar
        "0,11": "KC_VOLD", // Fn + F11 -> Bajar Volumen
        "0,12": "KC_VOLU", // Fn + F12 -> Subir Volumen
        "0,13": "KC_SLCK", // Fn + Del -> Scroll Lock
        "1,13": "RGB_TOG", // Fn + Bksp -> Encender / Apagar RGB
        "1,14": "KC_PSCR", // Fn + Home -> Captura
        "2,12": "KC_INS",  // Fn + +*]  -> Insert
        "2,14": "KC_PAUS", // Fn + PgUp -> Pause
        "3,1":  "TO_0",    // Fn + A    -> Cambiar a Modo Windows (Capa 0)
        "3,2":  "TO_2",    // Fn + S    -> Cambiar a Modo Mac (Capa 2)
        "3,11": "RGB_HUI", // Fn + ´¨{  -> Cambiar Color RGB
        "3,13": "RGB_MOD", // Fn + Ç}   -> Cambiar Efecto RGB
        "3,14": "KC_END",  // Fn + PgDn -> End
        "4,12": "RGB_SAI", // Fn + RShift -> Saturación RGB
        "4,13": "RGB_VAI", // Fn + ▲    -> Subir Brillo RGB
        "5,12": "RGB_SPD", // Fn + ◀    -> Bajar Velocidad RGB
        "5,13": "RGB_VAD", // Fn + ▼    -> Bajar Brillo RGB
        "5,14": "RGB_SPI"  // Fn + ▶    -> Subir Velocidad RGB
    }
};

// Exact ISO-ES Layout (16.25u x 6 rows) with 3 LEDs between PgDn and Right Arrow
window.RKR75.ISO_LAYOUT = [
    // Row 0
    [
        { code: "Escape", qmk: "KC_ESC", label: "Esc", type: "accent", u: 1, row: 0, col: 0 },
        { spacer: true, u: 0.25 },
        { code: "F1", qmk: "KC_F1", label: "F1", type: "alpha", u: 1, row: 0, col: 1 },
        { code: "F2", qmk: "KC_F2", label: "F2", type: "alpha", u: 1, row: 0, col: 2 },
        { code: "F3", qmk: "KC_F3", label: "F3", type: "alpha", u: 1, row: 0, col: 3 },
        { code: "F4", qmk: "KC_F4", label: "F4", type: "alpha", u: 1, row: 0, col: 4 },
        { spacer: true, u: 0.25 },
        { code: "F5", qmk: "KC_F5", label: "F5", type: "mod", u: 1, row: 0, col: 5 },
        { code: "F6", qmk: "KC_F6", label: "F6", type: "mod", u: 1, row: 0, col: 6 },
        { code: "F7", qmk: "KC_F7", label: "F7", type: "mod", u: 1, row: 0, col: 7 },
        { code: "F8", qmk: "KC_F8", label: "F8", type: "mod", u: 1, row: 0, col: 8 },
        { spacer: true, u: 0.25 },
        { code: "F9", qmk: "KC_F9", label: "F9", type: "alpha", u: 1, row: 0, col: 9 },
        { code: "F10", qmk: "KC_F10", label: "F10", type: "alpha", u: 1, row: 0, col: 10 },
        { code: "F11", qmk: "KC_F11", label: "F11", type: "alpha", u: 1, row: 0, col: 11 },
        { code: "F12", qmk: "KC_F12", label: "F12", type: "alpha", u: 1, row: 0, col: 12 },
        { spacer: true, u: 0.25 },
        { code: "Delete", qmk: "KC_DEL", label: "Del", type: "mod", u: 1, row: 0, col: 13 },
        { spacer: true, u: 0.25 },
        { knob: true, code: "AudioVolumeMute", qmk: "KC_MUTE", label: "Mute", u: 1, row: 0, col: 14 }
    ],
    // Row 1
    [
        { code: "Backquote", qmk: "KC_GRV", label: "º", sub: "ª \\", type: "mod", u: 1, row: 1, col: 0 },
        { code: "Digit1", qmk: "KC_1", label: "1", sub: "! |", type: "alpha", u: 1, row: 1, col: 1 },
        { code: "Digit2", qmk: "KC_2", label: "2", sub: '" @', type: "alpha", u: 1, row: 1, col: 2 },
        { code: "Digit3", qmk: "KC_3", label: "3", sub: "· #", type: "alpha", u: 1, row: 1, col: 3 },
        { code: "Digit4", qmk: "KC_4", label: "4", sub: "$ ~", type: "alpha", u: 1, row: 1, col: 4 },
        { code: "Digit5", qmk: "KC_5", label: "5", sub: "%", type: "alpha", u: 1, row: 1, col: 5 },
        { code: "Digit6", qmk: "KC_6", label: "6", sub: "& ¬", type: "alpha", u: 1, row: 1, col: 6 },
        { code: "Digit7", qmk: "KC_7", label: "7", sub: "/", type: "alpha", u: 1, row: 1, col: 7 },
        { code: "Digit8", qmk: "KC_8", label: "8", sub: "(", type: "alpha", u: 1, row: 1, col: 8 },
        { code: "Digit9", qmk: "KC_9", label: "9", sub: ")", type: "alpha", u: 1, row: 1, col: 9 },
        { code: "Digit0", qmk: "KC_0", label: "0", sub: "=", type: "alpha", u: 1, row: 1, col: 10 },
        { code: "Minus", qmk: "KC_MINS", label: "'", sub: "?", type: "alpha", u: 1, row: 1, col: 11 },
        { code: "Equal", qmk: "KC_EQL", label: "¡", sub: "¿", type: "alpha", u: 1, row: 1, col: 12 },
        { code: "Backspace", qmk: "KC_BSPC", label: "Bksp", type: "mod", u: 2, row: 1, col: 13 },
        { spacer: true, u: 0.25 },
        { code: "Home", qmk: "KC_HOME", label: "Home", type: "mod", u: 1, row: 1, col: 14 }
    ],
    // Row 2
    [
        { code: "Tab", qmk: "KC_TAB", label: "Tab", type: "mod", u: 1.5, row: 2, col: 0 },
        { code: "KeyQ", qmk: "KC_Q", label: "Q", type: "alpha", u: 1, row: 2, col: 1 },
        { code: "KeyW", qmk: "KC_W", label: "W", type: "alpha", u: 1, row: 2, col: 2 },
        { code: "KeyE", qmk: "KC_E", label: "E", sub: "€", type: "alpha", u: 1, row: 2, col: 3 },
        { code: "KeyR", qmk: "KC_R", label: "R", type: "alpha", u: 1, row: 2, col: 4 },
        { code: "KeyT", qmk: "KC_T", label: "T", type: "alpha", u: 1, row: 2, col: 5 },
        { code: "KeyY", qmk: "KC_Y", label: "Y", type: "alpha", u: 1, row: 2, col: 6 },
        { code: "KeyU", qmk: "KC_U", label: "U", type: "alpha", u: 1, row: 2, col: 7 },
        { code: "KeyI", qmk: "KC_I", label: "I", type: "alpha", u: 1, row: 2, col: 8 },
        { code: "KeyO", qmk: "KC_O", label: "O", type: "alpha", u: 1, row: 2, col: 9 },
        { code: "KeyP", qmk: "KC_P", label: "P", type: "alpha", u: 1, row: 2, col: 10 },
        { code: "BracketLeft", qmk: "KC_LBRC", label: "`", sub: "^ [", type: "alpha", u: 1, row: 2, col: 11 },
        { code: "BracketRight", qmk: "KC_RBRC", label: "+", sub: "* ]", type: "alpha", u: 1, row: 2, col: 12 },
        { code: "Enter", qmk: "KC_ENT", isoEnter: true, label: "Enter", type: "accent", u: 1.5, row: 2, col: 13 },
        { spacer: true, u: 0.25 },
        { code: "PageUp", qmk: "KC_PGUP", label: "PgUp", type: "mod", u: 1, row: 2, col: 14 }
    ],
    // Row 3
    [
        { code: "CapsLock", qmk: "KC_CAPS", label: "Caps", type: "mod", u: 1.75, row: 3, col: 0 },
        { code: "KeyA", qmk: "KC_A", label: "A", type: "alpha", u: 1, row: 3, col: 1 },
        { code: "KeyS", qmk: "KC_S", label: "S", type: "alpha", u: 1, row: 3, col: 2 },
        { code: "KeyD", qmk: "KC_D", label: "D", type: "alpha", u: 1, row: 3, col: 3 },
        { code: "KeyF", qmk: "KC_F", label: "F", type: "alpha", u: 1, row: 3, col: 4 },
        { code: "KeyG", qmk: "KC_G", label: "G", type: "alpha", u: 1, row: 3, col: 5 },
        { code: "KeyH", qmk: "KC_H", label: "H", type: "alpha", u: 1, row: 3, col: 6 },
        { code: "KeyJ", qmk: "KC_J", label: "J", type: "alpha", u: 1, row: 3, col: 7 },
        { code: "KeyK", qmk: "KC_K", label: "K", type: "alpha", u: 1, row: 3, col: 8 },
        { code: "KeyL", qmk: "KC_L", label: "L", type: "alpha", u: 1, row: 3, col: 9 },
        { code: "Semicolon", qmk: "KC_SCLN", label: "Ñ", type: "alpha", u: 1, row: 3, col: 10 },
        { code: "Quote", qmk: "KC_QUOT", label: "´", sub: "¨ {", type: "alpha", u: 1, row: 3, col: 11 },
        { code: "Backslash", qmk: "KC_NUHS", label: "Ç", sub: "}", type: "alpha", u: 1, row: 3, col: 13 },
        { spacer: true, u: 1.25 },
        { spacer: true, u: 0.25 },
        { code: "PageDown", qmk: "KC_PGDN", label: "PgDn", type: "mod", u: 1, row: 3, col: 14 }
    ],
    // Row 4
    [
        { code: "ShiftLeft", qmk: "KC_LSFT", label: "Shift", type: "mod", u: 1.25, row: 4, col: 0 },
        { code: "IntlBackslash", qmk: "KC_NUBS", label: "<", sub: ">", type: "alpha", u: 1, row: 4, col: 1 },
        { code: "KeyZ", qmk: "KC_Z", label: "Z", type: "alpha", u: 1, row: 4, col: 2 },
        { code: "KeyX", qmk: "KC_X", label: "X", type: "alpha", u: 1, row: 4, col: 3 },
        { code: "KeyC", qmk: "KC_C", label: "C", type: "alpha", u: 1, row: 4, col: 4 },
        { code: "KeyV", qmk: "KC_V", label: "V", type: "alpha", u: 1, row: 4, col: 5 },
        { code: "KeyB", qmk: "KC_B", label: "B", type: "alpha", u: 1, row: 4, col: 6 },
        { code: "KeyN", qmk: "KC_N", label: "N", type: "alpha", u: 1, row: 4, col: 7 },
        { code: "KeyM", qmk: "KC_M", label: "M", type: "alpha", u: 1, row: 4, col: 8 },
        { code: "Comma", qmk: "KC_COMM", label: ",", sub: ";", type: "alpha", u: 1, row: 4, col: 9 },
        { code: "Period", qmk: "KC_DOT", label: ".", sub: ":", type: "alpha", u: 1, row: 4, col: 10 },
        { code: "Slash", qmk: "KC_SLSH", label: "-", sub: "_", type: "alpha", u: 1, row: 4, col: 11 },
        { code: "ShiftRight", qmk: "KC_RSFT", label: "Shift", type: "mod", u: 1.75, row: 4, col: 12 },
        { code: "ArrowUp", qmk: "KC_UP", label: "▲", type: "accent", u: 1, row: 4, col: 13 },
        { spacer: true, u: 0.25 },
        { ledCluster: true, u: 1 }
    ],
    // Row 5
    [
        { code: "ControlLeft", qmk: "KC_LCTL", label: "Ctrl", type: "mod", u: 1.25, row: 5, col: 0 },
        { code: "MetaLeft", qmk: "KC_LGUI", label: "Win", type: "mod", u: 1.25, row: 5, col: 1 },
        { code: "AltLeft", qmk: "KC_LALT", label: "Alt", type: "mod", u: 1.25, row: 5, col: 2 },
        { code: "Space", qmk: "KC_SPC", label: "", type: "accent", u: 6.25, row: 5, col: 5 },
        { code: "AltRight", qmk: "KC_RALT", label: "AltGr", type: "mod", u: 1.25, row: 5, col: 9 },
        { code: "Fn", qmk: "MO_1", label: "Fn", type: "mod", u: 1.25, row: 5, col: 10 },
        { spacer: true, u: 0.5 },
        { code: "ArrowLeft", qmk: "KC_LEFT", label: "◀", type: "accent", u: 1, row: 5, col: 12 },
        { code: "ArrowDown", qmk: "KC_DOWN", label: "▼", type: "accent", u: 1, row: 5, col: 13 },
        { code: "ArrowRight", qmk: "KC_RGHT", label: "▶", type: "accent", u: 1, row: 5, col: 14 },
        { spacer: true, u: 0.25 }
    ]
];

window.RKR75.KEYCODES_PALETTE = {
    basic: [
        "KC_A", "KC_B", "KC_C", "KC_D", "KC_E", "KC_F", "KC_G", "KC_H", "KC_I", "KC_J",
        "KC_K", "KC_L", "KC_M", "KC_N", "KC_SCLN", "KC_O", "KC_P", "KC_Q", "KC_R", "KC_S",
        "KC_T", "KC_U", "KC_V", "KC_W", "KC_X", "KC_Y", "KC_Z",
        "KC_1", "KC_2", "KC_3", "KC_4", "KC_5", "KC_6", "KC_7", "KC_8", "KC_9", "KC_0",
        "KC_ENT", "KC_ESC", "KC_BSPC", "KC_TAB", "KC_SPC", "KC_CAPS",
        "KC_GRV", "KC_MINS", "KC_EQL", "KC_LBRC", "KC_RBRC", "KC_NUHS", "KC_QUOT", "KC_NUBS",
        "KC_COMM", "KC_DOT", "KC_SLSH"
    ],
    fkeys: [
        "KC_F1", "KC_F2", "KC_F3", "KC_F4", "KC_F5", "KC_F6",
        "KC_F7", "KC_F8", "KC_F9", "KC_F10", "KC_F11", "KC_F12",
        "KC_LCTL", "KC_LSFT", "KC_LALT", "KC_LGUI",
        "KC_RCTL", "KC_RSFT", "KC_RALT", "KC_RGUI",
        "KC_PSCR", "KC_SLCK", "KC_PAUS", "KC_INS", "KC_DEL", "KC_HOME", "KC_END", "KC_PGUP", "KC_PGDN",
        "KC_UP", "KC_DOWN", "KC_LEFT", "KC_RGHT"
    ],
    media: [
        "KC_VOLU", "KC_VOLD", "KC_MUTE", "KC_MPLY", "KC_MSTP", "KC_MPRV", "KC_MNXT",
        "KC_MSEL", "KC_CALC", "KC_MYCM", "KC_MAIL", "KC_WSCH", "KC_WHOM", "KC_BRIU", "KC_BRID",
        "RGB_TOG", "RGB_MOD", "RGB_HUI", "RGB_VAI", "RGB_VAD", "RGB_SPI", "RGB_SPD", "GU_TOGG"
    ],
    layers: [
        "KC_TRNS", "KC_NO",
        "TO_0", "TO_2",
        "MO_1", "MO_3", "MO_2",
        "TG_1", "TG_2", "TG_3",
        "MACRO_0", "MACRO_1", "MACRO_2", "MACRO_3", "MACRO_4", "MACRO_5"
    ]
};
