import { LitElement, html, css } from 'https://esm.sh/lit@3.2.0';

/**@extends {HTMLElement} */
export class AqSlider extends LitElement {
    constructor(){
        super()
        this.value = 0
        this.min = 0
        this.max = 100
        this.step = 1
        this.fullWidth = false
        this.formatter = value => value
    }

    #holding = false

    static get properties(){
        return {
            value: {type: Number},
            min: {type: Number},
            max: {type: Number},
            step: {type: Number},
            fullWidth: {type: Boolean, attribute: 'full-width'},
            formatter: {attribute: false}
        }
    }

    static get styles(){
        return css`
        :host {
            display: block;
            margin: 0.2em 0;
        }
        :host([full-width]) {
            width: 100%;
        }
        .base {
            display: flex;
            position: relative;
            height: 100%;
        }
        .slider-container {
            position: relative;
            width: 160px;
            height: 8px;
            background-color: var(--border-color);
        }
        :host([full-width]) .slider-container {
            width: 100%;
        }
        .track {
            background-color: var(--accent-color);
            position: absolute;
            inset: 0px;
        }
        .tooltip {
            position: absolute;
            background-color: var(--background-color);
            z-index: 1;
            pointer-events: none;
            left: 12px;
            box-shadow: 0px 4px 8px var(--shadow-color);
            padding: 0.2rem;
            opacity: 0;
            transform: translateY(-50%);
            user-select: none;
        }
        label {
            display: flex;
            align-items: center;
            width: 100%;
        }
        slot {
            width: 100%;
        }
        input[type=range] {
            accent-color: var(--accent-color);
            appearance: none;
            background-color: transparent;
            width: 100%;
            height: 100%;
            margin: 0;
            position: absolute;
            z-index: 1;
        }
        input[type=range]::-webkit-slider-thumb {
            appearance: none;
            height: 12px;
            width: 12px;
            background: var(--accent-color);
            cursor: pointer;
        }
        `
    }

    render(){
        return html`
        <div class='base' part='base'>
            <label>
                <slot></slot>
                <div class='slider-container'>
                    <input
                        type='range'
                        @change=${this.#handleChange}
                        @input=${this.#handleInput}
                        @mousedown=${this.#handleMousedown}
                        @mouseup=${this.#handleMouseup}
                        @mouseenter=${this.#showTooltip}
                        @mouseleave=${this.#hideTooltip}
                        @focus=${this.#showTooltip}
                        @blur=${this.#hideTooltip}
                        value=${this.value}
                        min=${this.min}
                        max=${this.max}
                        step=${this.step}
                    >
                    <div class='track' part='track' style='width: ${this.value / this.max * 100}%'></div>
                    <div class='tooltip' part='tooltip'></div>
                </div>
            </label>
        </div>
        `
    }

    #showTooltip(){
        let tooltip = this.shadowRoot.querySelector('.tooltip')
        tooltip.innerHTML = this.formatter(this.value)
        tooltip.classList.remove('hide')
        if(tooltip.classList.contains('show') == false){
            tooltip.classList.add('show')
            tooltip.animate([
                {transfrom: 'translateX(-30%)', opacity: 0},
                {transfrom: 'translateX(0)', opacity: 1}
            ], {fill: 'forwards', duration: 100})
        }
        // tooltip.style.left = `${4 + this.offsetWidth * this.value / this.max + 12 * (1 - this.value / this.max)}px`
        tooltip.style.left = `calc(${this.value / this.max * 100}% + ${12 * (1 - this.value / this.max)}px)`
    }
    #hideTooltip(){
        let tooltip = this.shadowRoot.querySelector('.tooltip')
        tooltip.classList.remove('show')
        tooltip.classList.add('hide')
        tooltip.animate([
            {transfrom: 'translateX(-30%)', opacity: 0},
            {transfrom: 'translateX(0)', opacity: 1}
        ], {fill: 'forwards', duration: 100, direction: 'reverse'})
    }

    #baseHandler(){
        let slider = this.shadowRoot.querySelector('input')
        let track = this.shadowRoot.querySelector('.track')
        this.value = Number(slider.value)
        track.style.width = `${this.value / this.max * 100}%`
        this.#showTooltip()
    }

    #handleChange(){
        this.#baseHandler()
        this.dispatchEvent(new Event('change'))
    }
    #handleInput(){
        this.#baseHandler()
        this.dispatchEvent(new Event('input'))
    }
    #handleMousedown(){ this.#holding = true }
    #handleMouseup(){ this.#holding = false }
}

customElements.define('aq-slider', AqSlider)