# RK R75 WebHID Studio — Blackberry Edition (ISO-ES)

Configurador web local WebHID (estilo VIA/QMK) para el teclado mecánico **Royal Kludge R75 Blackberry Edition (ISO-ES)**, con sincronización RGB y mapeo de capas en tiempo real.

---

## ✨ Características Principales

1. **Diseño Fiel Blackberry Mousse (ISO Español 81 Teclas + Knob CNC)**:
   - Marco exterior morado Blackberry con **placa interior blanca** para resaltar el brillo RGB real.
   - Tecla **ISO Enter de una sola pieza en SVG** sin costuras y tecla `Ç }` en su posición exacta de matriz (`[3,13]`).
   - **3 indicadores LED blancos** entre `PgDn` y `▶`:
     - `A`: Bloqueo de Mayúsculas (*Caps Lock*).
     - `🔒W`: Bloqueo de tecla Windows (*Win Lock*).
     - `MAC`: Indicador de modo macOS activo.

2. **Capas Windows (0 y 1) y Mac (2 y 3) con Guía de Acceso y Atajos Reales**:
   - **Capa 0 (`Base Windows`)**: Activa por defecto o con `Fn + A`.
   - **Capa 1 (`Fn Windows`)**: Manteniendo pulsada `Fn` (multimedia `F1`–`F12`, `PrtSc`, `Pause`, `End`, `Ins`, `ScrLk`, `Modo Win/Mac`, `Win Lock` y controles RGB).
   - **Capa 2 (`Base MAC`)**: Se activa con `Fn + S` (incluye modificadores `Opt ⌥`, `Cmd ⌘` y `Fn MO(3)`).
   - **Capa 3 (`Fn MAC`)**: Manteniendo pulsada `Fn` en modo Mac (brillo de pantalla Mac, *Mission Control*, *Launchpad*, multimedia y RGB).

3. **Iluminación RGB en Tiempo Real (Baja Latencia)**:
   - Los **45 efectos QMK RGB Matrix** oficiales del RK R75.
   - **Recuadro de espectro 2D (Tono × Saturación)** + **entrada directa de código Hexadecimal (`#RRGGBB`)** y presets rápidos.
   - Sincronización bidireccional rápida por WebHID.

4. **Probador de Teclas en Tiempo Real (Key Tester)**:
   - Iluminación instantánea en verde al pulsar cualquier tecla física en cualquier pestaña y registro de teclas probadas en morado, con sonido opcional de switch *Lo-Fi*.

5. **Protección de Firmware Activa (Hardware Firewall)**:
   - Bloqueo permanente por código de los comandos `0x0B` (`BOOTLOADER_JUMP`) y `0x0A` (`EEPROM_RESET`) y validación estricta de coordenadas de matriz PCB.

---

## 📁 Estructura del Proyecto

```text
rk-r75-webhid-studio/
├── index.html                               # Aplicación principal
├── rk_r75_configurator.html                 # Copia sincronizada de entrada
├── css/
│   └── style.css                            # Tema Blackberry Mousse, SVG ISO Enter, LEDs y RGB
├── js/
│   ├── layout.js                            # Matriz ISO-ES 1:1, códigos QMK y atajos de Capas 0-3
│   ├── hid.js                               # Driver WebHID (VID 0x342D / PID 0xE483) + Firewall
│   ├── rgb.js                               # Controlador de los 45 efectos RGB QMK
│   ├── tester.js                            # Probador de teclas en vivo y estado de LEDs
│   ├── macros.js                            # Editor y gestor de macros M0-M5
│   └── app.js                               # Controlador general de interfaz y sincronización
└── RKR75 Wired Version ISO_LAYOUT (EU).json # Definición oficial VIA del RK R75 ISO
```

---

## 🚀 Cómo Usarlo

1. Abre `index.html` directamente en **Google Chrome**, **Microsoft Edge** u otro navegador basado en Chromium (funciona directamente con doble clic sobre `file://` sin necesidad de servidor local).
2. Haz clic en **Conectar Teclado** arriba a la derecha y selecciona tu **R75 QMK** en la ventana del navegador.
