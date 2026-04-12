/// <reference path="../../../_typings/index.d.ts" />

import { html, css, LitElement } from 'https://esm.sh/lit@3.2.0';

class AqCarousel extends LitElement {
    static get properties() {
        return {
            interval: { type: Number }
        }
    }

    static get styles() {
        return css`
:host {
    --carousel-button-size: 2rem;
    --carousel-button-background: #00000066;
    --carousel-button-hover: #00000088;
    --carousel-button-text-color: var(--text-color-on-dark, #ffffff);
    --carousel-index-background: #00000066;
    --carousel-index-text-color: var(--text-color-on-dark, #ffffff);
}

:host {
    display: block;
}

.base {
    position: relative;
    max-width: 100%;
    overflow: hidden;
}

button.control {
    font-family: 'Material Symbols Outlined';
    position: absolute;
    display: none;
    translate: 0 -50%;
    background-color: var(--carousel-button-background);
    border: none;
    width: var(--carousel-button-size);
    aspect-ratio: 1;
    color: var(--carousel-button-text-color);
    transition: var(--transition-time-common, 0.2s);
    transition-behavior: allow-discrete;
    cursor: pointer;
}

.base:is(:hover, :focus-within) button.control, button.control:is(:hover, :focus) {
    display: block;
    opacity: 1;

    @starting-style {
        opacity: 0;
    }
}

.base:not(:hover, :focus-within) button.control, button.control:not(:hover, :focus) {
    opacity: 0;
}

button.control:is(:hover, :focus) {
    background-color: var(--carousel-button-hover);
}

.control.prev {
    inset-inline-start: 1rem;
    inset-block-start: 50%;
}

.control.next {
    inset-inline-end: 1rem;
    inset-block-start: 50%;
}

.main {
    display: flex;
    transition: var(--transition-time-common, 0.2s);
}

.index {
    position: absolute;
    inset-block-start: 1rem;
    inset-inline-start: 50%;
    translate: -50% 0;
    padding: 0.2rem;
    background-color: var(--carousel-index-background);
    color: var(--carousel-index-text-color);
}
        `
    }

    currentIndex = 0
    #itemCount = 0
    #intervalIndex = -1
    get #mainSlot() {
        return this.shadowRoot.querySelector('slot')
    }
    /**@type {HTMLElement[]} */
    get #slottedElements() {
        return Array.from(this.children).filter((e) => e.assignedSlot == this.#mainSlot)
    }
    #getElement(index) {
        return this.#slottedElements[index]
    }

    render() {
        return html`
<div class='base' part='base'>
    <slot class='main' part='main'></slot>
    <div class='controls' part='controls'>
        <button class='control prev' title='Previous' @click=${() => {this.prev()}}>arrow_back</button>
        <button class='control next' title='Next' @click=${() => {this.next()}}>arrow_forward</button>
        <div class='index' part='index'>
            ${this.currentIndex + 1}/${this.#itemCount}
        </div>
    </div>
</div>
        `
    }

    connectedCallback() {
        super.connectedCallback()
        this.#itemCount = this.#slottedElements.length
        this.#tagIndex()

        if (this.interval > 0) {
            this.#intervalIndex = setInterval(() => {
                this.next()
            }, this.interval)
        }
    }

    #tagIndex() {
        this.#slottedElements.forEach((e, i) => {
            e.dataset.carouselIndex = i
            e.style.width = '100%'
        })
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.#itemCount
        this.#update()
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.#itemCount) % this.#itemCount
        this.#update()
    }

    #update() {
        const current = this.#getElement(this.currentIndex)
        const main = this.shadowRoot.querySelector('.main')
        if (current && main) {
            main.style.translate = `-${this.currentIndex * 100}%`
        }
        this.requestUpdate()
    }
}

customElements.define('aq-carousel', AqCarousel)