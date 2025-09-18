/**
 * A collection of mathematical utilities.
 * Methamphetamine not included.
 */
export namespace Meth {
    export class Clamper {
        constructor(private min: number, private max: number) {}

        clamp(value: number): number {
            return Math.max(this.min, Math.min(this.max, value));
        }
    }

    export function clamp(min: number, max: number, value: number) {
        return Math.max(min, Math.min(max, value));
    }

    export class CircularIncreaser {
        value: number
        constructor(private min: number, private max: number, private step: number = 1) {
            this.value = min
        }

        increase(stepCount = 1) {
            this.value += stepCount * this.step;
            if (this.value > this.max) {
                this.value = this.min + ((this.value - this.max - 1) % (this.max - this.min + 1));
            } else if (this.value < this.min) {
                this.value = this.max - ((this.min - this.value - 1) % (this.max - this.min + 1));
            }
        }
    }

    type MathFunction = (x: number) => {x: number, y: number}
    type ParametricEquation = (t: number) => {x: number, y: number}

    /**
     * A class for graphing mathematical functions.
     * @example
     * const grapher = new Meth.Grapher();
     * grapher.mount(document.body);
     * grapher.draw((x) => ({x, y: x * x}), 'blue');
     */
    export class Grapher {
        canvas = document.createElement('canvas');
        #ctx = this.canvas.getContext('2d')!
        /**
         * The length of one unit on the graph, in pixels.
         */
        unitLength = 40
        constructor() {
            this.canvas.width = 640
            this.canvas.height = 480
            Object.defineProperty(this.canvas, 'grapher', {
                value: this,
                writable: false,
                configurable: false
            });
        }

        mount(parent: HTMLElement) {
            parent.appendChild(this.canvas)
            this.canvas.style.transformOrigin = '0 0'
            this.canvas.style.scale = (1 / devicePixelRatio).toString()
            this.#drawAxis()
        }

        #drawAxis() {
            const ctx = this.#ctx
            const width = this.canvas.width
            const height = this.canvas.height
            ctx.strokeStyle = 'lightgray'
            ctx.lineWidth = 1
            ctx.beginPath()
            // x axis
            ctx.moveTo(0, height / 2)
            ctx.lineTo(width, height / 2)
            // y axis
            ctx.moveTo(width / 2, 0)
            ctx.lineTo(width / 2, height)
            ctx.stroke()

            // draw ticks
            const unit = this.unitLength
            ctx.fillStyle = 'lightgray'
            for (let x = width / 2; x < width; x += unit) {
                ctx.fillRect(x - 1, height / 2 - 5, 2, 10)
            }
            for (let x = width / 2; x > 0; x -= unit) {
                ctx.fillRect(x - 1, height / 2 - 5, 2, 10)
            }
            for (let y = height / 2; y < height; y += unit) {
                ctx.fillRect(width / 2 - 5, y - 1, 10, 2)
            }
            for (let y = height / 2; y > 0; y -= unit) {
                ctx.fillRect(width / 2 - 5, y - 1, 10, 2)
            }
        }

        draw(func: MathFunction | ParametricEquation, style: string | CanvasGradient | CanvasPattern) {
            const ctx = this.#ctx
            const width = this.canvas.width
            const height = this.canvas.height
            const unit = this.unitLength
            ctx.strokeStyle = style
            ctx.fillStyle = style
            ctx.lineWidth = 2
            ctx.beginPath()
            let first = true
            for (let i = 0; i < width; i++) {
                const inputValue = (i - width / 2) / unit
                const {x, y} = func(inputValue)
                const px = width / 2 + x * unit
                const py = height / 2 - y * unit
                if (first) {
                    ctx.moveTo(px, py)
                    first = false
                } else {
                    ctx.lineTo(px, py)
                }
            }
            ctx.stroke()
        }

        clear() {
            this.#ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.#drawAxis()
        }
    }

    export function sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
        return function(t: number) {
            const x = Math.pow(1 - t, 3) * 0 + 3 * Math.pow(1 - t, 2) * t * x1 + 3 * (1 - t) * Math.pow(t, 2) * x2 + Math.pow(t, 3) * 1;
            const y = Math.pow(1 - t, 3) * 0 + 3 * Math.pow(1 - t, 2) * t * y1 + 3 * (1 - t) * Math.pow(t, 2) * y2 + Math.pow(t, 3) * 1;
            return {x, y};
        }
    }
}
