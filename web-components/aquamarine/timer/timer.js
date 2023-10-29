const style = await (await fetch('/web-components/aquamarine/timer/timer.css')).text()
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)
document.adoptedStyleSheets = document.adoptedStyleSheets.concat(styleSheet)

const template = 
`
<div class='display'></div>
<div class='control'>
    <button class='startpause'></button>
    <button class='reset'></button>
</div>
`

export class AqTimer extends HTMLElement {
    constructor() {
        super()
        this.innerHTML = template
        this.format = this.getAttribute('format') || 'mm:ss'
        this.time = Number(this.getAttribute('time')) || 0
        this.countDown = this.getAttribute('countdown') != null ? true : false
    }

    #start() {
        this.startTime = this.startTime || Date.now()
        if(this.countDown) {
            this.timerID = setInterval(() => {
                this.currentTime = Date.now()
            })
        }
    }

    connectedCallback() {
        
    }
}