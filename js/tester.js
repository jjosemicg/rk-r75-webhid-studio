// ==========================================================================
// REAL-TIME KEY DETECTOR & STATUS LED CONTROLLER (Caps Lock, Win Lock, Mac)
// ==========================================================================

window.RKR75 = window.RKR75 || {};

class KeyTester {
    constructor() {
        this.activeKeys = new Set();
        this.historyKeys = new Set();
        this.totalPressCount = 0;
        this.lastKeyName = "—";
        this.soundEnabled = true;
        this.audioCtx = null;

        // 3 Hardware Indicator LEDs State
        this.leds = {
            caps: false,
            winLock: false,
            macMode: false
        };

        this.onStatsUpdate = null;
        this.onLedsUpdate = null;
        this.bindEvents();
    }

    initAudio() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        }
    }

    playClickSound(isRelease) {
        if (!this.soundEnabled) return;
        try {
            this.initAudio();
            if (this.audioCtx && this.audioCtx.state === "suspended") {
                this.audioCtx.resume();
            }
            if (!this.audioCtx) return;

            const now = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = "triangle";
            const startFreq = isRelease ? 120 : 155;
            const endFreq = isRelease ? 40 : 48;

            osc.frequency.setValueAtTime(startFreq, now);
            osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.045);

            gain.gain.setValueAtTime(isRelease ? 0.08 : 0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.06);
        } catch (e) {}
    }

    updateCapsLockFromEvent(e) {
        if (e && typeof e.getModifierState === "function") {
            const capsState = e.getModifierState("CapsLock");
            if (this.leds.caps !== capsState) {
                this.leds.caps = capsState;
                this.renderLedStates();
            }
        }
    }

    toggleLed(ledKey) {
        if (ledKey in this.leds) {
            this.leds[ledKey] = !this.leds[ledKey];
            this.renderLedStates();
            if (this.onLedsUpdate) {
                this.onLedsUpdate(this.leds, ledKey);
            }
        }
    }

    renderLedStates() {
        const ledCaps = document.getElementById("led-caps");
        const ledWin = document.getElementById("led-win");
        const ledMac = document.getElementById("led-mac");

        if (ledCaps) ledCaps.classList.toggle("on", Boolean(this.leds.caps));
        if (ledWin)  ledWin.classList.toggle("on", Boolean(this.leds.winLock));
        if (ledMac)  ledMac.classList.toggle("on", Boolean(this.leds.macMode));
    }

    bindEvents() {
        window.addEventListener("keydown", (e) => {
            this.updateCapsLockFromEvent(e);

            const tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : "";
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
                return;
            }

            if (document.body.classList.contains("tester-active")) {
                if (["Tab", "AltLeft", "AltRight", "F1", "F3", "F5", "F6", "F7", "F11", "Space", "ArrowUp", "ArrowDown"].includes(e.code)) {
                    e.preventDefault();
                }
            }

            if (!this.activeKeys.has(e.code)) {
                this.activeKeys.add(e.code);
                this.historyKeys.add(e.code);
                this.totalPressCount++;
                this.lastKeyName = e.code + (e.key && e.key.length === 1 ? " (" + e.key.toUpperCase() + ")" : "");
                this.playClickSound(false);

                this.renderKeyStates();
                this.triggerStats();
            }
        });

        window.addEventListener("keyup", (e) => {
            this.updateCapsLockFromEvent(e);

            const tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : "";
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
                return;
            }

            if (this.activeKeys.has(e.code)) {
                this.activeKeys.delete(e.code);
                this.renderKeyStates();
                this.triggerStats();
            }
        });

        window.addEventListener("blur", () => {
            this.activeKeys.clear();
            this.renderKeyStates();
            this.triggerStats();
        });
    }

    renderKeyStates() {
        const isTesterTab = document.body.classList.contains("tester-active");

        document.querySelectorAll(".key[data-code]").forEach((el) => {
            const code = el.getAttribute("data-code");
            const isPressedNow = this.activeKeys.has(code);

            // Real-time press visual across all tabs
            el.classList.toggle("tested-active", isPressedNow);

            // History highlight shown when in Tester tab
            if (isTesterTab && this.historyKeys.has(code)) {
                el.classList.add("tested-history");
            } else {
                el.classList.remove("tested-history");
            }
        });

        this.renderLedStates();
    }

    reset() {
        this.activeKeys.clear();
        this.historyKeys.clear();
        this.totalPressCount = 0;
        this.lastKeyName = "—";
        document.querySelectorAll(".key").forEach((el) => {
            el.classList.remove("tested-active", "tested-history");
        });
        this.triggerStats();
    }

    triggerStats() {
        if (this.onStatsUpdate) {
            this.onStatsUpdate({
                activeCount: this.activeKeys.size,
                testedCount: this.historyKeys.size,
                totalPresses: this.totalPressCount,
                lastKey: this.lastKeyName
            });
        }
    }
}

window.RKR75.KeyTester = KeyTester;
