import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './icon.js';

export class AqSnackbar extends LitElement {
    static get properties(){
        return {
            message: { type: String },
            duration: { type: Number },
            type: { type: String },
            placement: { type: String },
            html: { type: Boolean },
            icon: { type: String },
            closeable: { type: Boolean }
        }
    }

    message = '';
    duration = 3000;
    /**@type {'info'|'success'|'warning'|'error'} */
    type = 'info';
    /**@type {'top-center'|'top-left'|'top-right'|'bottom-center'|'bottom-left'|'bottom-right'} */
    placement = 'top-center'
    html = false;
    icon = '';
    closeable = false;

    render() {
        setTimeout(() => {this.close()}, this.duration);

        return html`
        <link rel="stylesheet" href="/assets/css/aquamarinev2/global.css">
        <div class='icon'>
            <slot name='icon'></slot>
            ${this.icon ? html`<aq-icon name="${this.icon}"></aq-icon>` : ''}
        </div>
        <div class='message'>
            <slot></slot>
            ${this.html ? this.htmlMessage(this.message) : this.message}
        </div>
        <div class='close'>
            <slot name='action'></slot>
            <slot name='close'></slot>
            ${this.closeable ? html`<button class='close-button' @click=${this.close}><aq-icon name='close'></aq-icon></button>` : ''}
        </div>
        `
    }

    close(ignoreDuration = false){
        let animation
        let animationOptions = {duration: 200, easing: 'ease-in-out'}

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

        if(this.duration > 0 || ignoreDuration == true){
            animation.onfinish = () => {
                this.remove();
            }
        }
    }

    show(){
        let animationOptions = {duration: 200, easing: 'ease-in-out', fill: 'forwards'}
        switch(this.placement){
            case 'top-center':
            default: {
                this.animate([
                    {opacity: 0, translate: '0 -100%'},
                    {opacity: 1, translate: '0 0'}
                ], animationOptions)
                break;
            }
            case 'bottom-left':
            case 'top-left': {
                this.animate([
                    {opacity: 0, translate: '-100%'},
                    {opacity: 1, translate: '0'}
                ], animationOptions)
                break;
            }
            case 'bottom-right':
            case 'top-right': {
                this.animate([
                    {opacity: 0, translate: '100%'},
                    {opacity: 1, translate: '0'}
                ], animationOptions)
                break;
            }
            case 'bottom-center': {
                this.animate([
                    {opacity: 0, translate: '0 100%'},
                    {opacity: 1, translate: '0 0'}
                ], animationOptions)
                break;
            }
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
            grid-template-columns: 2em 1fr 2em;
            grid-template-rows: auto;
            position: fixed;
            z-index: 9999;
            background-color: var(--snackbar-background-color);
            color: var(--snackbar-text-color);
            padding: 1em;
            min-width: 20em;
            flex-wrap: wrap;
            word-wrap: break-word;
            opacity: 0;
            box-shadow: 0px 4px 8px var(--shadow-color);
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

        .close button, .close-button {
            background: none;
            border: none;
            color: inherit;
            transition: var(--transition-time-common);
        }

        :is(.close button, .close-button):is(:hover, :focus) {
            color: var(--accent-color);
        }
        `
    }
}

customElements.define('aq-snackbar', AqSnackbar);

export function aqSnackbar(options = {}) {
    if(typeof options == 'string'){
        options = {message: options}
    }
    let defaultOptions = {
        message: 'Message',
        duration: 3000,
        type: 'info',
        placement: 'top-center',
        icon: '',
        html: false,
        closeable: false,
        ...options
    }
    let snackbar = document.createElement('aq-snackbar');
    snackbar.message = defaultOptions.message;
    snackbar.duration = defaultOptions.duration;
    snackbar.setAttribute('type', defaultOptions.type)
    snackbar.setAttribute('placement', defaultOptions.placement);
    snackbar.icon = defaultOptions.icon;
    snackbar.html = defaultOptions.html;
    snackbar.closeable = defaultOptions.closeable;
    document.body.appendChild(snackbar);

    snackbar.show();
}

window.aqSnackbar = aqSnackbar;