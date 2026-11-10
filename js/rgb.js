// ==========================================================================
// ZERO-LAG RGB LIGHTING CONTROLLER (45 QMK Effects + 35ms Real-Time Throttle)
// ==========================================================================

window.RKR75 = window.RKR75 || {};

window.RKR75.RGB_EFFECTS = [
    { id: 0,  name: "All Off (Apagado)" },
    { id: 1,  name: "Solid Color (Color Fijo)" },
    { id: 2,  name: "Alphas Mods (Bicolor Alfas/Mods)" },
    { id: 3,  name: "Gradient Up Down (Degradado Vertical)" },
    { id: 4,  name: "Gradient Left Right (Degradado Horizontal)" },
    { id: 5,  name: "Breathing (Respiración)" },
    { id: 6,  name: "Band Sat" },
    { id: 7,  name: "Band Val" },
    { id: 8,  name: "Band Pinwheel Sat" },
    { id: 9,  name: "Band Pinwheel Val" },
    { id: 10, name: "Band Spiral Sat" },
    { id: 11, name: "Band Spiral Val" },
    { id: 12, name: "Cycle All (Ciclo Completo)" },
    { id: 13, name: "Cycle Left Right (Ola Horizontal)" },
    { id: 14, name: "Cycle Up Down (Ola Vertical)" },
    { id: 15, name: "Rainbow Moving Chevron" },
    { id: 16, name: "Cycle Out In" },
    { id: 17, name: "Cycle Out In Dual" },
    { id: 18, name: "Cycle Pinwheel" },
    { id: 19, name: "Cycle Spiral" },
    { id: 20, name: "Dual Beacon" },
    { id: 21, name: "Rainbow Beacon" },
    { id: 22, name: "Rainbow Pinwheels" },
    { id: 23, name: "Raindrops (Gotas de Lluvia)" },
    { id: 24, name: "Jellybean Raindrops" },
    { id: 25, name: "Hue Breathing" },
    { id: 26, name: "Hue Pendulum" },
    { id: 27, name: "Hue Wave" },
    { id: 28, name: "Pixel Rain (Lluvia Píxel)" },
    { id: 29, name: "Pixel Flow" },
    { id: 30, name: "Pixel Fractal" },
    { id: 31, name: "Typing Heatmap (Mapa de Calor)" },
    { id: 32, name: "Digital Rain (Matrix)" },
    { id: 33, name: "Solid Reactive Simple (Reactivo al Pulsar)" },
    { id: 34, name: "Solid Reactive" },
    { id: 35, name: "Solid Reactive Wide" },
    { id: 36, name: "Solid Reactive Multiwide" },
    { id: 37, name: "Solid Reactive Cross" },
    { id: 38, name: "Solid Reactive Multicross" },
    { id: 39, name: "Solid Reactive Nexus" },
    { id: 40, name: "Solid Reactive Multinexus" },
    { id: 41, name: "Splash (Onda Expansiva)" },
    { id: 42, name: "Multisplash" },
    { id: 43, name: "Solid Splash" },
    { id: 44, name: "Solid Multisplash" },
    { id: 45, name: "Close All" }
];

class RgbController {
    constructor(hidDriver) {
        this.hidDriver = hidDriver;
        this.lastSendTime = 0;
        this.pendingTimer = null;
        this.lastUserInteraction = 0;

        let saved = null;
        try {
            saved = JSON.parse(localStorage.getItem("rk_r75_rgb"));
        } catch (e) {
            saved = null;
        }

        this.state = saved || {
            brightness: 220,
            speed: 128,
            effect: 1,
            color: "#a855f7"
        };
    }

    getState() {
        return this.state;
    }

    updateProperty(prop, val, saveToEeprom) {
        this.lastUserInteraction = Date.now();
        this.state[prop] = val;

        try {
            localStorage.setItem("rk_r75_rgb", JSON.stringify(this.state));
        } catch (e) {}

        // 0ms instant digital preview
        this.applyVisualSimulation();

        // Real-time 35ms throttled hardware update for just this property
        this.sendThrottledProperty(prop, val, Boolean(saveToEeprom));
    }

    applyVisualSimulation() {
        const root = document.documentElement;
        const chassis = document.getElementById("keyboard-chassis");
        const bRatio = Math.max(0, Math.min(1, this.state.brightness / 255));

        root.style.setProperty("--kb-rgb-color", this.state.color);
        root.style.setProperty("--kb-rgb-brightness", bRatio.toFixed(2));

        const durationSec = (6 - (this.state.speed / 255) * 4.8).toFixed(2) + "s";
        root.style.setProperty("--kb-rgb-duration", durationSec);

        if (!chassis) return;
        chassis.classList.remove("rgb-off", "rgb-solid", "rgb-breathing", "rgb-rainbow");

        const eff = Number(this.state.effect);
        if (eff === 0 || eff === 45 || this.state.brightness === 0) {
            chassis.classList.add("rgb-off");
        } else if ([5, 25, 26, 27].includes(eff)) {
            chassis.classList.add("rgb-breathing");
        } else if ([12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 28, 29, 41, 42].includes(eff)) {
            chassis.classList.add("rgb-rainbow");
        } else {
            chassis.classList.add("rgb-solid");
        }
    }

    sendThrottledProperty(prop, val, saveToEeprom) {
        if (!this.hidDriver || !this.hidDriver.isConnected) return;

        const now = Date.now();
        const elapsed = now - this.lastSendTime;
        const throttleMs = 35; // ~28 updates/sec live streaming to USB without lag

        if (this.pendingTimer) {
            clearTimeout(this.pendingTimer);
            this.pendingTimer = null;
        }

        if (elapsed >= throttleMs || saveToEeprom) {
            this.lastSendTime = now;
            this.hidDriver.setRgbProperty(prop, val, saveToEeprom);
        } else {
            this.pendingTimer = setTimeout(() => {
                this.lastSendTime = Date.now();
                this.hidDriver.setRgbProperty(prop, val, saveToEeprom);
            }, throttleMs - elapsed);
        }
    }
}

window.RKR75.RgbController = RgbController;
