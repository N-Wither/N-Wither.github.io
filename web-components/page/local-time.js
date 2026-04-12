import { html, css, LitElement } from 'https://esm.sh/lit@3.2.0';

class LocalTime extends LitElement {
    static get styles() {
        return [
            css`
            :host {
                display: flex;
                align-items: center;
                justify-content: center;
                padding-inline: 0.4rem;
            }
            `
        ]
    }

    static get properties() {
        return {
            format: { type: String }
        }
    }

    static #defaultFormat = 'Y-M-D h:m:s'
    static #warned = false

    /**
     * @param {Date} date 
     * @param {string} format 
     */
    static formatDate(date, format) {
        const options = {}
        if (format.includes('Y')) options.year = 'numeric'
        if (format.includes('M')) options.month = '2-digit'
        if (format.includes('D')) options.day = '2-digit'
        if (format.includes('h')) options.hour = '2-digit'
        if (format.includes('m')) options.minute = '2-digit'
        if (format.includes('s')) options.second = '2-digit'
        try {
            return new Intl.DateTimeFormat(navigator.language, options).format(date)
        } catch (e) {
            if (!LocalTime.#warned) {
                console.warn('Failed to format date with Intl.DateTimeFormat, falling back to toLocaleString', e)
                LocalTime.#warned = true
            }
            return date.toLocaleString()
        }
    }

    constructor() {
        super()
        this.format = LocalTime.#defaultFormat
    }

    render() {
        return html`
        ${LocalTime.formatDate(new Date(), this.format)}
        `
    }

    connectedCallback() {
        super.connectedCallback()
        setInterval(() => {
            this.requestUpdate()
        }, 1000)
    }
}

customElements.define('local-time', LocalTime)
