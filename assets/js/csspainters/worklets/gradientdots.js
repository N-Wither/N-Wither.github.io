registerPaint('gradient-dots', class {
    static get inputProperties() {
        return ['--dot-color', '--dot-size', '--dot-spacing', '--dot-direction'];
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {PaintSize} size 
     * @param {CSSProperties} props 
     */
    paint(ctx, size, props) {
        ctx.fillStyle = props.get('--dot-color');

        let dotSize = parseInt(props.get('--dot-size').toString())
        let dotSpacing = parseInt(props.get('--dot-spacing').toString())
        let dotRadius = parseFloat(props.get('--dot-size').toString()) / 2
        let direction = props.get('--dot-direction').toString()

        let rows = Math.ceil((size.height - dotRadius) / (dotSize + dotSpacing))
        let cols = Math.ceil((size.width - dotRadius) / (dotSize + dotSpacing))
        let step = dotSize / rows / 2

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let radius = dotRadius - step * i
                if(direction == 'top'){
                    radius = step * i
                }
                let x = j * (dotSize + dotSpacing) + radius
                let y = i * (dotSize + dotSpacing) + radius
                if(i % 2 == 0) {
                    x += dotSpacing / 2 + radius
                }
                ctx.beginPath()
                ctx.arc(x, y, radius, 0, 2 * Math.PI)
                ctx.fill()
            }
        }
    }
})