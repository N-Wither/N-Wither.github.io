/// <reference path="../../../_typings/index.d.ts" />
import { LitElement, html, css } from 'https://esm.sh/lit@3.2.0';
import { getSvg } from '../lib/get-svg.js';

class AqIcon extends LitElement {
    constructor(){
        super()
    }

    static get properties(){
        return {
            name: {type: String},
            src: {type: String},
            size: {type: String}
        }
    }

    static get styles(){
        return css`
        ::selection {
            color: inherit;
            background-color: color-mix(in srgb, var(--accent-color-dk) 60%, transparent 60%);
        }
        @font-face {
            font-family: 'Material Symbols Outlined';
            font-style: normal;
            font-weight: 400;
            src: url(https://fonts.gstatic.com/s/materialsymbolsoutlined/v179/kJF1BvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzaxHMPdY43zj-jCxv3fzvRNU22ZXGJpEpjC_1v-p_4MrImHCIJIZrDCvHOej.woff2) format('woff2');
        }
        :host {
            font-family: inherit;
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-smoothing: antialiased;
            --icon-font-size: 24px;
        }
        :host([size="small"]) {
            --icon-font-size: 16px;
        }
        .icon {
            font-family: 'Material Symbols Outlined';
            font-size: var(--icon-font-size);
            user-select: none;
        }
        `
    }

    render(){
        this.translate = false
        if(this.name != undefined){
            return html`<div class='icon' translate='no'>${this.name}</div>`
        }
        else if (this.src != null && this.src.endsWith('.svg')){
            getSvg(this.src, this.shadowRoot)
            return html``
        }
        else if (this.src != null){
            return html`<img src=${this.src}>`
        }
        else return html`<slot></slot>`
    }
}

customElements.define('aq-icon', AqIcon)