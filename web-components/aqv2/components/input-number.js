import { LitElement, html, css } from 'https://esm.sh/lit@3.2.0';

/**@extends {HTMLElement} */
export class AqInputNumber extends LitElement {
    constructor(){
        super()
        this.value = 0
        this.min = ''
        this.max = ''
        this.step = 1
    }

    static get properties(){
        return {
            value: {type: Number},
            min: {type: Number},
            max: {type: Number},
            step: {type: Number}
        }
    }

    static get styles(){
        return css`
        .base {
            display: flex;
            flex-direction: row;
        }
        label {
            display: flex;
            align-items: center;
        }
        input {
            display: block;
            min-width: 8em;
        }
        input::-webkit-inner-spin-button {
            appearance: none;
        }
        .button-container {
            display: flex;
        }
        button {
            height: 100%;
            width: 1.4em;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        `
    }

    render(){
        return html`
            <link rel="stylesheet" href="/assets/css/aquamarinev2/input.css">
            <link rel="stylesheet" href="/assets/css/aquamarinev2/button.css">
            <link rel="stylesheet" href="/assets/css/aquamarinev2/selection.css">
            <div class='base'>
                <label>
                    <slot></slot>
                    <input type='number' value=${this.value} @input=${this.#handleInput} @change=${this.#handleChange} min=${this.min} max=${this.max} step=${this.step}>
                </label>
                <div class='button-container'>
                    <button @click=${this.#add} class='add'>+</button>
                    <button @click=${this.#minus} class='minus'>-</button>
                </div>
            </div>
        `
    }

    #add(){
        let result = this.value + this.step
        this.value = this.#checkNumber(result)
        this.shadowRoot.querySelector('input').value = this.#checkNumber(result)
        this.#checkButtonStatus()
        this.dispatchEvent(new Event('change'))
    }
    #minus(){
        let result = this.value - this.step
        this.value = this.#checkNumber(result)
        this.shadowRoot.querySelector('input').value = this.#checkNumber(result)
        this.#checkButtonStatus()
        this.dispatchEvent(new Event('change'))
    }
    #handlerBase(){
        let input = Number(this.shadowRoot.querySelector('input').value)
        this.value = this.#checkNumber(input)
        this.#checkButtonStatus()
    }
    #handleInput(){
        this.#handlerBase()
        this.#checkButtonStatus()
        this.dispatchEvent(new Event('input'))
    }
    #handleChange(){
        this.#handlerBase()
        this.shadowRoot.querySelector('input').value = this.value
        this.#checkButtonStatus()
        this.dispatchEvent(new Event('change'))
    }
    #checkNumber(number){
        let max = this.max === '' ? Infinity : this.max
        let min = this.min === '' ? -Infinity : this.min
        number = Math.max(min, number)
        number = Math.min(max, number)
        let rest = number % this.step
        if(rest > 0) number = number - rest
        return number
    }
    #checkButtonStatus(){
        let add = this.shadowRoot.querySelector('.add')
        let minus = this.shadowRoot.querySelector('.minus')
        if(this.value === this.max){
            add.disabled = true
            minus.disabled = false
        }
        else if(this.value === this.min){
            add.disabled = false
            minus.disabled = true
        }
        else {
            add.disabled = false
            minus.disabled = false
        }
    }
}

customElements.define('aq-input-number', AqInputNumber)