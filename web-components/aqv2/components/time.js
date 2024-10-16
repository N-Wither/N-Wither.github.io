import {LitElement, html, css} from 'https://esm.sh/lit@3.2.0';

class AqTime extends LitElement {
    #time = new Date()
    #formatString = '{YYYY}/{MM}/{DD} {hh}:{mm}:{ss}'
    #timerId = null

    static properties = {
        time: {type: String},
        format: {type: String},
        updateTime: {type: Number, attribute: 'update-time'}
    }

    connectedCallback() {
        super.connectedCallback()
        this.#formatString = this.format ?? this.#formatString
        if(this.updateTime) {
            if(this.#timerId != null) {
                clearInterval(this.#timerId)
            }
            this.timerId = setInterval(() => {
                this.#time = new Date()
                this.requestUpdate()
            }, this.updateTime)
        }
    }

    render() {
        return html`<span>${this.#format()}</span>`
    }

    #format() {
        let timeObj = {
            YYYY: this.#time.getFullYear(),
            MM: this.#time.getMonth() + 1,
            DD: this.#time.getDate(),
            hh: this.#time.getHours(),
            mm: this.#time.getMinutes(),
            ss: this.#time.getSeconds()
        }
        let result = this.#formatString.replace(/{(\w+)}/g, (match, p1) => {
            if (p1 in timeObj) {
                let value = timeObj[p1]
                if (p1 === 'MM' || p1 === 'DD' || p1 === 'hh' || p1 ==='mm' || p1 === 'ss') {
                    value = `0${value}`.slice(-2)
                }
                return value
            }
            return match
        })
        return result
    }
}

customElements.define('aq-time', AqTime)