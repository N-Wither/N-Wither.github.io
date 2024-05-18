declare class Painter {
    static get contextOptions(): CanvasRenderingContext2DSettings
    static get inputProperties(): string[]
    paint(context: CanvasRenderingContext2D, size: PaintSize, properties: CSSProperties, args?: any[]): void
}

interface CSSProperties {
    get(property: string): CSSUnparsedValue
}

interface PaintSize { width: number, height: number }

declare function registerPaint(name: string, painter: Painter): void

declare namespace CSS {
    var paintWorklet: Worklet
}