// ==========================================================================
// LOW-LATENCY REAL-TIME WEBHID DRIVER FOR ROYAL KLUDGE R75 (QMK / VIA)
//  - Ultra-low latency packet pipeline (<5ms per command)
//  - Granular single-parameter RGB updates (no redundant packets)
//  - Hard Firewall permanently blocks Bootloader Jump (0x0B) & EEPROM Wipe (0x0A)
// ==========================================================================

window.RKR75 = window.RKR75 || {};

var VIA_CMD = {
    GET_PROTOCOL_VERSION: 0x01,
    GET_KEYBOARD_VALUE:   0x02,
    SET_KEYBOARD_VALUE:   0x03,
    KEYMAP_GET_KEYCODE:   0x04,
    KEYMAP_SET_KEYCODE:   0x05,
    CUSTOM_SET_VALUE:     0x07,
    CUSTOM_GET_VALUE:     0x08,
    CUSTOM_SAVE:          0x09,
    GET_LAYER_COUNT:      0x11,
    GET_ENCODER:          0x14,
    SET_ENCODER:          0x15
};

var FORBIDDEN_COMMANDS = {
    0x06: "DYNAMIC_KEYMAP_RESET",
    0x0A: "EEPROM_RESET",
    0x0B: "BOOTLOADER_JUMP",
    0x10: "MACRO_RESET"
};

var READ_ONLY_COMMANDS = {
    0x01: true,
    0x02: true,
    0x04: true,
    0x08: true,
    0x11: true,
    0x14: true
};

class R75HIDDriver {
    constructor() {
        this.device = null;
        this.isConnected = false;
        this.vendorId = 0x342d;
        this.rawUsagePage = 0xFF60;
        this.rawUsage = 0x61;

        this.writeProtection = false;
        this.protocolVersion = null;
        this.isBusy = false;

        this.queue = Promise.resolve();
        this.pendingResolver = null;

        this.onStatusChange = null;
        this.onLog = null;

        if ("hid" in navigator) {
            navigator.hid.addEventListener("disconnect", (e) => {
                if (this.device && e.device === this.device) {
                    this.handleDisconnect();
                }
            });
            navigator.hid.addEventListener("connect", () => {
                if (!this.isConnected) {
                    this.tryAutoConnect();
                }
            });
        }
    }

    log(msg, level) {
        if (this.onLog) {
            this.onLog(msg, level || "info");
        }
    }

    async tryAutoConnect() {
        if (!("hid" in navigator) || this.isConnected) return false;
        try {
            const devices = await navigator.hid.getDevices();
            const rawDevice = devices.find(
                (d) =>
                    d.vendorId === this.vendorId &&
                    d.collections &&
                    d.collections.some((c) => c.usagePage === this.rawUsagePage && c.usage === this.rawUsage)
            );
            if (rawDevice) {
                return await this.openDevice(rawDevice);
            }
        } catch (e) {}
        return false;
    }

    async requestConnection() {
        if (!("hid" in navigator)) {
            throw new Error("Tu navegador no soporta WebHID. Abre la aplicación en Google Chrome o Microsoft Edge.");
        }

        const devices = await navigator.hid.requestDevice({
            filters: [
                {
                    vendorId: this.vendorId,
                    usagePage: this.rawUsagePage,
                    usage: this.rawUsage
                }
            ]
        });

        if (!devices || devices.length === 0) {
            return false;
        }

        const selectedDevice =
            devices.find(
                (d) =>
                    d.collections &&
                    d.collections.some((c) => c.usagePage === this.rawUsagePage && c.usage === this.rawUsage)
            ) || devices[0];

        return await this.openDevice(selectedDevice);
    }

    async openDevice(selectedDevice) {
        const hasRawCollection =
            selectedDevice.collections &&
            selectedDevice.collections.some((c) => c.usagePage === this.rawUsagePage && c.usage === this.rawUsage);

        if (!hasRawCollection) {
            throw new Error("La interfaz seleccionada no es el canal VIA Raw HID (0xFF60).");
        }

        if (!selectedDevice.opened) {
            await selectedDevice.open();
        }

        this.device = selectedDevice;
        this.isConnected = true;

        this.boundInputHandler = (event) => this.handleInputReport(event);
        this.device.addEventListener("inputreport", this.boundInputHandler);

        const resp = await this.sendViaCommand(VIA_CMD.GET_PROTOCOL_VERSION, []);
        if (resp && resp[0] === VIA_CMD.GET_PROTOCOL_VERSION) {
            this.protocolVersion = (resp[1] << 8) | resp[2];
            this.log("Sincronizado en tiempo real • VIA v" + this.protocolVersion, "success");
        } else {
            this.log("Conectado en tiempo real al canal Raw HID (0xFF60).", "success");
        }

        if (this.onStatusChange) {
            this.onStatusChange(true, this.device.productName || "RK R75 QMK", this.protocolVersion);
        }

        return true;
    }

    async disconnect() {
        if (this.device) {
            if (this.boundInputHandler) {
                this.device.removeEventListener("inputreport", this.boundInputHandler);
            }
            if (this.device.opened) {
                await this.device.close();
            }
        }
        this.handleDisconnect();
    }

    handleDisconnect() {
        this.device = null;
        this.isConnected = false;
        this.protocolVersion = null;
        if (this.onStatusChange) {
            this.onStatusChange(false, null, null);
        }
    }

    handleInputReport(event) {
        const bytes = new Uint8Array(event.data.buffer, event.data.byteOffset, event.data.byteLength);
        if (this.pendingResolver) {
            const resolve = this.pendingResolver;
            this.pendingResolver = null;
            resolve(bytes);
        }
    }

    // Ultra-fast sequential packet sender (no artificial sleep delay)
    sendViaCommand(commandId, params) {
        params = params || [];

        if (FORBIDDEN_COMMANDS[commandId]) {
            const msg = "BLOQUEADO POR FIREWALL: " + FORBIDDEN_COMMANDS[commandId];
            this.log(msg, "error");
            return Promise.reject(new Error(msg));
        }

        if (!READ_ONLY_COMMANDS[commandId] && this.writeProtection) {
            return Promise.resolve(null);
        }

        if (!this.isConnected || !this.device || !this.device.opened) {
            return Promise.resolve(null);
        }

        this.queue = this.queue.then(() => {
            return new Promise(async (resolve) => {
                this.isBusy = true;
                try {
                    const packet = new Uint8Array(32);
                    packet[0] = commandId & 0xFF;
                    for (let i = 0; i < params.length && i < 31; i++) {
                        packet[i + 1] = params[i] & 0xFF;
                    }

                    const timeoutId = setTimeout(() => {
                        if (this.pendingResolver) {
                            this.pendingResolver = null;
                            this.isBusy = false;
                            resolve(null);
                        }
                    }, 180);

                    this.pendingResolver = (responseBytes) => {
                        clearTimeout(timeoutId);
                        this.isBusy = false;
                        resolve(responseBytes);
                    };

                    await this.device.sendReport(0x00, packet);
                } catch (err) {
                    this.pendingResolver = null;
                    this.isBusy = false;
                    resolve(null);
                }
            });
        });

        return this.queue;
    }

    async readKeycode(layer, row, col) {
        if (layer < 0 || layer > 3 || row < 0 || row >= 6 || col < 0 || col >= 15) {
            return null;
        }
        const resp = await this.sendViaCommand(VIA_CMD.KEYMAP_GET_KEYCODE, [layer, row, col]);
        if (resp && resp[0] === VIA_CMD.KEYMAP_GET_KEYCODE) {
            return (resp[4] << 8) | resp[5];
        }
        return null;
    }

    async writeKeycode(layer, row, col, keycode16) {
        if (
            !Number.isInteger(layer) || layer < 0 || layer > 3 ||
            !Number.isInteger(row)   || row < 0   || row >= 6  ||
            !Number.isInteger(col)   || col < 0   || col >= 15 ||
            !Number.isInteger(keycode16) || keycode16 < 0 || keycode16 > 0xFFFF
        ) {
            throw new Error("Coordenadas o código QMK fuera de rango.");
        }

        if (this.writeProtection) {
            throw new Error("SAFE_LOCK_ACTIVE");
        }

        const msb = (keycode16 >> 8) & 0xFF;
        const lsb = keycode16 & 0xFF;

        const resp = await this.sendViaCommand(VIA_CMD.KEYMAP_SET_KEYCODE, [layer, row, col, msb, lsb]);
        this.log(
            "Actualizado: Capa " + layer + " [" + row + "," + col + "] → 0x" +
            keycode16.toString(16).toUpperCase().padStart(4, "0"),
            "success"
        );
        return resp;
    }

    static hexToQmkHsv(hex) {
        hex = (hex || "#a855f7").replace("#", "");
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        const r = (parseInt(hex.substring(0, 2), 16) || 0) / 255;
        const g = (parseInt(hex.substring(2, 4), 16) || 0) / 255;
        const b = (parseInt(hex.substring(4, 6), 16) || 0) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;

        let h = 0;
        const s = max === 0 ? 0 : d / max;

        if (max !== min) {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 255) & 0xFF,
            s: Math.round(s * 255) & 0xFF
        };
    }

    static qmkHsvToHex(hByte, sByte) {
        const h = (hByte & 0xFF) / 255;
        const s = (sByte & 0xFF) / 255;
        const v = 1;

        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        let r = 0, g = 0, b = 0;
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }

        const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, "0");
        return "#" + toHex(r) + toHex(g) + toHex(b);
    }

    async readRgbState() {
        if (!this.isConnected || this.isBusy) return null;
        const bResp = await this.sendViaCommand(VIA_CMD.CUSTOM_GET_VALUE, [3, 1]);
        const eResp = await this.sendViaCommand(VIA_CMD.CUSTOM_GET_VALUE, [3, 2]);
        const sResp = await this.sendViaCommand(VIA_CMD.CUSTOM_GET_VALUE, [3, 3]);
        const cResp = await this.sendViaCommand(VIA_CMD.CUSTOM_GET_VALUE, [3, 4]);
        if (!bResp || !eResp || !sResp) return null;

        const result = {
            brightness: bResp[3],
            effect: eResp[3],
            speed: sResp[3]
        };

        if (cResp && (cResp[3] !== 0 || cResp[4] !== 0)) {
            result.color = R75HIDDriver.qmkHsvToHex(cResp[3], cResp[4]);
        }
        return result;
    }

    // Fast single-property RGB updates (avoids sending 4 packets when only 1 parameter changed!)
    async setRgbProperty(prop, val, saveToEeprom) {
        if (!this.isConnected || this.writeProtection) return false;

        if (prop === "brightness") {
            const b = Math.max(0, Math.min(255, Math.round(val)));
            await this.sendViaCommand(VIA_CMD.CUSTOM_SET_VALUE, [3, 1, b]);
        } else if (prop === "effect") {
            const e = Math.max(0, Math.min(45, Math.round(val)));
            await this.sendViaCommand(VIA_CMD.CUSTOM_SET_VALUE, [3, 2, e]);
        } else if (prop === "speed") {
            const s = Math.max(0, Math.min(255, Math.round(val)));
            await this.sendViaCommand(VIA_CMD.CUSTOM_SET_VALUE, [3, 3, s]);
        } else if (prop === "color") {
            const hsv = R75HIDDriver.hexToQmkHsv(val);
            await this.sendViaCommand(VIA_CMD.CUSTOM_SET_VALUE, [3, 4, hsv.h, hsv.s]);
        }

        if (saveToEeprom) {
            await this.sendViaCommand(VIA_CMD.CUSTOM_SAVE, [3]);
        }
        return true;
    }
}

window.RKR75.R75HIDDriver = R75HIDDriver;
