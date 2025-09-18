/**
 * A collection of mathematical utilities.
 * Methamphetamine not included.
 */
export declare namespace Meth {
    export class Clamper {
        private min;
        private max;
        constructor(min: number, max: number);
        clamp(value: number): number;
    }
    export function clamp(min: number, max: number, value: number): number;
    export class CircularIncreaser {
        private min;
        private max;
        private step;
        value: number;
        constructor(min: number, max: number, step?: number);
        increase(stepCount?: number): void;
    }
    type MathFunction = (x: number) => {
        x: number;
        y: number;
    };
    type ParametricEquation = (t: number) => {
        x: number;
        y: number;
    };
    /**
     * A class for graphing mathematical functions.
     * @example
     * const grapher = new Meth.Grapher();
     * grapher.mount(document.body);
     * grapher.draw((x) => ({x, y: x * x}), 'blue');
     */
    export class Grapher {
        #private;
        canvas: HTMLCanvasElement;
        /**
         * The length of one unit on the graph, in pixels.
         */
        unitLength: number;
        constructor();
        mount(parent: HTMLElement): void;
        draw(func: MathFunction | ParametricEquation, style: string | CanvasGradient | CanvasPattern): void;
        clear(): void;
    }
    export function sigmoid(x: number): number;
    export function cubicBezier(x1: number, y1: number, x2: number, y2: number): ParametricEquation;
    export {};
}
