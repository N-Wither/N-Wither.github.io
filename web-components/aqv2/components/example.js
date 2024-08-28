import {LitElement, html, css} from 'https://esm.sh/lit@3.2.0';

class AqExample extends LitElement {
    constructor(){
        super()
        this.count = 0
    }

    static get properties(){
        return {
            count: {type: Number}
        }
    }

    static get styles(){
        return css`:host {color: red}`
    }

    render(){
        return html`
            <link rel="stylesheet" href="/assets/css/aquamarinev2/button.css">
            <button @click=${this.#handleClick} class='btn-regular'>Count is ${this.count}</button>
        `
    }

    #handleClick(){
        this.count ++
        this.dispatchEvent(new CustomEvent('countchange'))
    }
}

customElements.define('aq-example', AqExample)