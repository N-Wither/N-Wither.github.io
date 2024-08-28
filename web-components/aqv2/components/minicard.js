import { LitElement, html, css } from 'https://esm.sh/lit@3.2.0';

/**@extends {HTMLElement} */
export class AqMiniCard extends LitElement {
    constructor(){
        super()
        /**@type {string} */
        this.icon = null
        this.sub = null
        this.header = null
        this.content = null
    }

    static get properties(){
        return {
            icon: {},
            sub: {},
            header: {},
            content: {},
        }
    }

    render(){
        let haveIcon = this.icon != null || this.querySelector('[slot=icon]') != null
        let haveHeader = this.sub != null || this.querySelector('[slot=sub]') != null || this.header != null || this.querySelector('[slot=header]') != null

        return html`
        <link rel="stylesheet" href="/assets/css/aquamarinev2/global.css">
        <div class='base'>
            <div class='icon-wrapper ${haveIcon ? '' : 'hidden'}'>
                ${
                    this.icon != null && this.icon.includes('.') == false ? html`<aq-icon name=${this.icon}></aq-icon>` : 
                    this.icon != null && this.icon.includes('.') == true ? html`<img src=${this.icon} class='icon-image'>`: ''
                }
                <slot name='icon'></slot>
            </div>
            <div class='main'>
                <div class='header-wrapper ${haveHeader ? '' : 'hidden'}'>
                    <div class='sub-header'>
                        ${this.sub != null ? html`<div>${this.sub}</div>` : ''}
                        <slot name='sub'></slot>
                    </div>
                    <div class='header'>
                        ${this.header != null ? html`<div>${this.header}</div>` : ''}
                        <slot name='header'></slot>
                    </div>
                </div>
                <div class='content'>
                    <slot>${this.content}</slot>
                </div>
            </div>
        </div>
        `
    }

    static get styles(){
        return css`
        :host{
            display: block;
            --aq-minicard_height: 4.8em;
            --aq-minicard_width: 17em;
            --aq-minicard_max-width: 17em;
            background-color: var(--background-color-lt);
            box-shadow: 0px 4px 8px var(--shadow-color);
            margin: 0.2em;
            min-height: var(--aq-minicard_height);
            min-width: var(--aq-minicard_width);
            max-width: var(--aq-minicard_max-width);
        }
        .base{
            display: flex;
            width: 100%;
        }
        .icon-wrapper{
            min-width: var(--aq-minicard_height);
            height: var(--aq-minicard_height);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .icon-image{
            max-width: var(--aq-minicard_height);
            max-height: var(--aq-minicard_height);
        }
        .hidden{
            display: none;
        }
        .main {
            width: 100%;
        }
        .header-wrapper{
            padding: 0.2em 0.2em 0.1em 0.2em;
            border-bottom: 2px solid var(--border-color);
        }
        .header{
            font-weight: bold;
            font-size: 0.9em;
        }
        .content {
            padding: 0.1em 0.2em 0.2em 0.2em;
            width: 100%;
            font-size: 0.9em;
        }
        .sub-header{
            color: var(--text-color-lt);
            font-size: 0.7em;
        }
        `
    }
}

customElements.define('aq-minicard', AqMiniCard)