import { html, css } from 'https://esm.sh/lit@3.2.0';
import { AqElement } from '../lib/aq-element.js';
import './icon.js';

export class AqSnackbar extends AqElement {
    static get properties(){
        return {
            message: { type: String },
            duration: { type: Number },
            type: { type: String },
            placement: { type: String },
            html: { type: Boolean },
            icon: { type: String },
            closeable: { type: Boolean },
            persistant: {type: Boolean},
            source: {type: String},
            clone: {type: Boolean}
        }
    }

    static connectedInstances = new Set();

    constructor(){
        super();
        this.message = '';
        this.duration = 3000;
        /**@type {'info'|'success'|'warning'|'error'} */
        this.type = 'info';
        /**@type {'top-center'|'top-left'|'top-right'|'bottom-center'|'bottom-left'|'bottom-right'} */
        this.placement = 'top-center'
        this.html = false;
        this.icon = '';
        this.closeable = false;
        this.persistant = false;
        this.source = null;
        this.clone = false;
    }

    #initialShow = true;
    #timerId = null;

    render() {
        if(this.persistant == true && this.#initialShow == true){
            this.close()
            this.#initialShow = false
        }
        else {
            this.#timerId = setTimeout(() => {this.close()}, this.duration);
        }
        let srcEl = this.source ? 
                typeof this.source == 'string' ? document.querySelector(this.source) : 
                this.source instanceof Element ? this.source : null :
                null;

        return html`
        <link rel="stylesheet" href="/assets/css/aquamarinev2/global.css">
        <div class='icon'>
            <slot name='icon'>
                ${this.icon ? html`<aq-icon name="${this.icon}"></aq-icon>` : ''}
            </slot>
        </div>
        <div class='message'>
            <slot>
                ${this.html ? this.htmlMessage(this.message) : this.message}
                ${this.source ? this.clone ? srcEl.cloneNode(true) : srcEl : ''}
            </slot>
        </div>
        <div class='close'>
            <slot name='action' class='action-button'></slot>
            <slot name='close' @click=${this.close} class='close-button'>
                ${this.closeable ? html`<button><aq-icon name='close'></aq-icon></button>` : ''}
            </slot>
        </div>
        `
    }

    close(ignoreDuration = false){
        let animation
        let animationOptions = {duration: 200, easing: 'ease-in-out', fill: 'forwards'}

        switch(this.placement){
            case 'top-center':
            default: {
                animation = this.animate([
                    {opacity: 1, translate: '0 0'},
                    {opacity: 0, translate: '0 -100%'}
                ], animationOptions)
                break;
            }
            case 'bottom-left':
            case 'top-left': {
                animation = this.animate([
                    {opacity: 1, translate: '0'},
                    {opacity: 0, translate: '-100%'}
                ], animationOptions)
                break;
            }
            case 'bottom-right':
            case 'top-right': {
                animation = this.animate([
                    {opacity: 1, translate: '0'},
                    {opacity: 0, translate: '100%'}
                ], animationOptions)
                break;
            }
            case 'bottom-center': {
                animation = this.animate([
                    {opacity: 1, translate: '0 0'},
                    {opacity: 0, translate: '0 100%'}
                ], animationOptions)
                break;
            }
        }

        if((this.duration > 0 || ignoreDuration == true) && this.persistant == false){
            animation.onfinish = () => {
                this.remove();
            }
        }

        if(this.#timerId != null) {
            clearTimeout(this.#timerId);
            this.#timerId = null;
        }
    }

    show(){
        let animationOptions = {duration: 200, easing: 'ease-in-out', fill: 'forwards'}
        let animation
        switch(this.placement){
            case 'top-center':
            default: {
                animation = this.animate([
                    {opacity: 0, translate: '0 -100%'},
                    {opacity: 1, translate: '0 0'}
                ], animationOptions)
                break;
            }
            case 'bottom-left':
            case 'top-left': {
                animation = this.animate([
                    {opacity: 0, translate: '-100%'},
                    {opacity: 1, translate: '0'}
                ], animationOptions)
                break;
            }
            case 'bottom-right':
            case 'top-right': {
                animation = this.animate([
                    {opacity: 0, translate: '100%'},
                    {opacity: 1, translate: '0'}
                ], animationOptions)
                break;
            }
            case 'bottom-center': {
                animation = this.animate([
                    {opacity: 0, translate: '0 100%'},
                    {opacity: 1, translate: '0 0'}
                ], animationOptions)
                break;
            }
        }

        if(this.duration > 0) {
            animation.onfinish = () => { this.#timerId = setTimeout(() => {this.close()}, this.duration) }
        }
    }

    htmlMessage(message){
        let div = document.createElement('div');
        div.innerHTML = message;
        return div;
    }

    static get styles() {
        return css`
        :host {
            --snackbar-background-color: var(--background-color);
            --snackbar-text-color: var(--text-color);
            --snackbar-text-color-contrast: var(--text-color-contrast);
            --snackbar-success-color: var(--color-safe);
            --snackbar-warning-color: var(--color-warn);
            --snackbar-error-color: var(--color-danger);
        }

        :host {
            display: grid;
            grid-template-columns: 2.4em 1fr auto;
            grid-template-rows: auto;
            position: fixed;
            z-index: 9999;
            background-color: var(--snackbar-background-color);
            color: var(--snackbar-text-color);
            padding: 1em 0.4em;
            min-width: 20em;
            flex-wrap: wrap;
            word-wrap: break-word;
            opacity: 0;
            box-shadow: var(--general-shadow);
            max-width: min(90%, 50em);
        }

        :host([placement='top-center']) {
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
        }
        :host([placement='top-left']) {
            top: 10px;
            left: 10px;
        }
        :host([placement='top-right']) {
            top: 10px;
            right: 10px;
        }
        :host([placement='bottom-center']) {
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
        }
        :host([placement='bottom-left']) {
            bottom: 10px;
            left: 10px;
        }
        :host([placement='bottom-right']) {
            bottom: 10px;
            right: 10px;
        }

        :host([type='success']) {
            background-color: var(--snackbar-success-color);
            color: var(--snackbar-text-color-contrast);
        }
        :host([type='warning']) {
            background-color: var(--snackbar-warning-color);
            color: var(--snackbar-text-color-contrast);
        }
        :host([type='error']) {
            background-color: var(--snackbar-error-color);
            color: var(--snackbar-text-color-contrast);
        }

        .message {
            display: flex;
            align-items: center;
            justify-content: block-start;
            max-width: 100%;
            white-space: wrap;
            overflow: auto;
        }

        .close button, .close-button, .action-button {
            background: none;
            border: none;
            color: inherit;
            transition: var(--transition-time-common);
            padding: 0;
            cursor: pointer;
        }

        :is(.close button, .close-button, .action-button):is(:hover, :focus) {
            color: var(--accent-color);
        }

        .icon slot {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
        }
        `
    }
}

customElements.define('aq-snackbar', AqSnackbar);

function snackbar(options = {}) {
    if(typeof options == 'string'){
        options = {message: options}
    }
    let finalOptions = {
        message: '',
        duration: 3000,
        type: 'info',
        placement: 'top-center',
        icon: '',
        html: false,
        closeable: false,
        source: null,
        clone: false,
        ...options
    }
    let snackbar = document.createElement('aq-snackbar');
    snackbar.message = finalOptions.message;
    snackbar.duration = finalOptions.duration;
    snackbar.setAttribute('type', finalOptions.type)
    snackbar.setAttribute('placement', finalOptions.placement);
    snackbar.icon = finalOptions.icon;
    snackbar.html = finalOptions.html;
    snackbar.closeable = finalOptions.closeable;
    snackbar.source = finalOptions.source;
    snackbar.clone = finalOptions.clone;
    document.body.appendChild(snackbar);

    snackbar.show();
}

snackbar.warn = function(message, options) {
    snackbar({message, type: 'warning', ...options});
}

snackbar.error = function(message, options) {
    snackbar({message, type: 'error', ...options});
}

window.aqSnackbar = snackbar;

export let aqSnackbar = snackbar