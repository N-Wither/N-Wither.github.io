import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export let headerButtonStyle = css`
.button {
    border: none;
    background: none;
    font-family: inherit;
    font-size: 1.4em;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    width: 100%;
    height: 100%;
}

.base {
    width: var(--header-height);
    height: var(--header-height);
    background-image: linear-gradient(180deg, var(--accent-color), var(--accent-color));
    background-repeat: no-repeat;
    background-position: top;
    background-size: 100% 0%;
    transition: var(--transition-time-common);
    position: relative;
    display: flex;
}

.base::after {
    position: absolute;
    content: "";
    display: block;
    inset: 0;
    background-image: linear-gradient(180deg, var(--accent-color-dk), var(--accent-color-dk));
    background-repeat: no-repeat;
    background-position: top;
    background-size: 100% 0%;
    transition: var(--transition-time-fast);
    z-index: -1;
}

.base:hover, .base:hover::after {
    background-size: 100% 100%;
}
`

export class HeaderButton extends LitElement{
    constructor(){
        super()
    }

    render() {
        return html`
        <div class='base'>
            <button class='button'>
                <slot></slot>
            </button>
        </div>
        `
    }

    get button(){
        return this.shadowRoot?.querySelector('.button') ?? null
    }

    get base(){
        return this.shadowRoot?.querySelector('.base') ?? null
    }


    static get styles(){
        return [headerButtonStyle]
    }
}

customElements.define('header-button', HeaderButton)