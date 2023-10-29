const style = await (await fetch('/web-components/aquamarine/timer/timer.css')).text()
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)
document.adoptedStyleSheets = document.adoptedStyleSheets.concat(styleSheet)

const template = 
`
<div class='display'></div>
<div class='control'>
    <button class='startpause' title='start/pause'></button>
    <button class='reset' title='reset'></button>
</div>
`

export class AqTimer extends HTMLElement {
    constructor() {
        super()
        this.innerHTML = template
        this.formatStr = this.getAttribute('format') || 'mm:ss' // hh:mm:ss.ms
        this.time = Number(this.getAttribute('time')) || 0 // in milliseconds
        this.countDown = this.getAttribute('countdown') != null ? true : false
        this.step = Number(this.getAttribute('step')) || 10

        this.formatObj = {
            hr: this.formatStr.match('hh') == null ? false : true,
            min: this.formatStr.match('mm') == null ? false : true,
            sec: this.formatStr.match('ss') == null ? false : true,
            ms: this.formatStr.match('ms') == null ? false : true,
        }
    }

    #start() {
        if(this.running) return;
        this.running = true
        let displayArea = this.querySelector('.display')
        this.startTime = Date.now()
        this.targetTime = this.targetTime ? this.targetTime : Number(this.getAttribute('time')) // for countdown
        this.timerID = setInterval(() => {
            if(this.countDown) {
                this.currentTime = Date.now()
                if(this.currentTime - this.startTime >= this.targetTime || this.time <= 0) {
                    this.time = 0
                    this.#stop()
                    return
                }
                else this.time = this.targetTime - (this.currentTime - this.startTime)
            }
            else {
                this.time = this.targetTime + (Date.now() - this.startTime)
            }
            displayArea.innerHTML = this.#format()
        }, this.step)
        this.setAttribute('running', '')
    }

    #stop() {
        this.running = false
        this.removeAttribute('running')
        this.querySelector('.display').innerHTML = this.#format()
        if(this.countDown) {
            this.targetTime = this.targetTime - (this.currentTime - this.startTime)
        }
        else {
            this.targetTime = this.time
        }
        clearInterval(this.timerID)
    }

    #format() {
        this.timeObj = {
            hr: this.formatObj.hr ? Math.floor(( this.time / 1000 ) / 3600) : 0,
            min: this.formatObj.min ? Math.floor(( this.time / 1000 ) / 60) : 0,
            sec: this.formatObj.sec ? (this.formatObj.min ? Math.floor(this.time / 1000 - Math.floor(( this.time / 1000 ) / 60) * 60) : Math.floor( this.time / 1000)) : 0,
            ms: this.formatObj.ms ? Math.floor(this.time % 1000) : this.time
        }

        return (
            this.formatStr
                .replace('hh', this.timeObj.hr.toString().padStart(2, '0'))
                .replace('mm', this.timeObj.min.toString().padStart(2, '0'))
                .replace('ss', this.timeObj.sec.toString().padStart(2, '0'))
                .replace('ms', this.timeObj.ms.toString().padStart(3, '0'))
            )
    }

    #reset() {
        if(this.running) this.#stop();
        this.time = Number(this.getAttribute('time')) || 0
        this.querySelector('.display').innerHTML = this.#format()
    }

    connectedCallback() {
        let startButton = this.querySelector('.startpause')
        let resetButton = this.querySelector('.reset')
        let displayArea = this.querySelector('.display')

        startButton.addEventListener('click', () => {
            if(this.running) {
                this.#stop()
            }
            else {
                this.#start()
            }
        })
        resetButton.addEventListener('click', () => {
            this.#reset()
        })
        displayArea.innerHTML = this.#format()
    }
}

customElements.define('aq-timer', AqTimer)