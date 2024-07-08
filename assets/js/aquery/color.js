/**
 * Utility class for colors.
 */
export class ColorUtils {
    /**
     * Turn hex color codes to RGBA format.
     * @param {string} hex
     * @param {'css' | 'object'} [as = 'object']
     * @returns
     * @example
     * hexToRGBA('#fff') // 'rgba(255, 255, 255, 1)'
     * hexToRGBA('#66ccff', 'object') // {r: 102, g: 204, b: 255, a: 1}
     */
    static hexToRGBA(hex, as = 'object') {
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        let a = 1;
        if (hex.length === 8) {
            a = parseInt(hex.substring(6, 8), 16) / 255;
        }
        if (as === 'css') {
            return `rgba(${r}, ${g}, ${b}, ${a})`;
        } else {
            return { r, g, b, a };
        }
    }

    /**
     * 
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     * @param {number} a 
     * @param {'css' | 'object'} [as = 'object']
     * @returns 
     */
    static rgbToHSLA(r, g, b, a, as = 'object') {
        r /= 255;
        g /= 255;
        b /= 255;
        let cMax = Math.max(r, g, b);
        let cMin = Math.min(r, g, b);
        let delta = cMax - cMin;
        let h = 0;
        let s = 0;
        let l = (cMax + cMin) / 2;
        if (delta === 0) {
            h = 0;
        } else if (cMax === r) {
            h = ((g - b) / delta) % 6;
        } else if (cMax === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }
        h = Math.round(h * 60);
        if (h < 0) {
            h += 360;
        }
        s = delta === 0? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);
        if(as == 'object') {
            return { h, s, l, a };
        }
        else {
            return `hsla(${h}, ${s}, ${l} / ${a})`
        }
    }

    static Color = class Color {
        constructor(color){
            if(typeof color === 'string') {
                let colorCodePattern = /^#([0-9A-Fa-f]{3}){1,2}$|^#([0-9A-Fa-f]{4}){1,2}$|^#([0-9A-Fa-f]{6}){1,2}$|^#([0-9A-Fa-f]{8}){1,2}$/;
                if(color.startsWith('#') == false) {
                    color = '#' + color
                }
                if(colorCodePattern.test(color) == false) {
                    throw new TypeError('Invalid color code format.')
                }
                else {
                    this.#rgba = ColorUtils.hexToRGBA(color);
                }
            }
            else if (typeof color == 'number') {
                let hex = color.toString(16)
                this.#rgba = ColorUtils.hexToRGBA(hex);
            }
        }

        #rgba

        get rgba() {
            return this.#rgba
        }

        get r() { return this.#rgba.r }
        get g() { return this.#rgba.g }
        get b() { return this.#rgba.b }
        get a() { return this.#rgba.a }
        get hex() {return `#${this.#rgba.r.toString(16).padStart(2, '0') + this.#rgba.g.toString(16).padStart(2, '0') + this.#rgba.b.toString(16).padStart(2, '0') + (this.#rgba.a < 1 ? (this.#rgba.a * 255).toString(16).padStart(2, '0') : '')}`}
        get hsla() {return ColorUtils.rgbToHSLA(this.#rgba.r, this.#rgba.g, this.#rgba.b, this.#rgba.a)}
        get h() {return this.hsla.h}
        get s() {return this.hsla.s}
        get l() {return this.hsla.l}
    }

    /**
     * 
     * @param {string | number} color 
     * @returns 
     */
    static create(color) {
        return new ColorUtils.Color(color)
    }
}
