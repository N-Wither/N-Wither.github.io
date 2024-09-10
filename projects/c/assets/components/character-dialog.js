/// <reference path="../../../../_typings/index.d.ts" />

import { LitElement, html, css } from 'https://esm.sh/lit@3.2.0';

export class CharacterDialog extends LitElement {
    static properties = {
        name: { type: String },
        sub: { type: String },
        content: { type: String },
        compact: { type: Boolean },
        avatar: { type: String }
    }

    static styles = css`
        :host {
            --character-color: var(--text-color);
            --sub-color: var(--text-color-lt);
            --divider-color: var(--character-color);
            display: flex;
        }

        :host([compact]) {
            margin-block: 1em;
            display: block;
        }

        :host([compact]) .avatar-container {
            display: none;
        }

        .avatar-container img{
            max-height: 3em;
        }

        .main {
            width: 100%;
            margin: 0 0.4em;
        }

        .info {
            display: flex;
        }

        .name {
            color: var(--character-color);
            font-weight: bold;
        }

        .sub {
            font-size: small;
            color: var(--sub-color);
        }

        hr {
            border: none;
            border-top: solid var(--divider-color) 1px;
            margin: 0.2em 0;
        }

        :host([compact]) .info {
            display: inline;
        }

        :host([compact]) .name {
            display: inline;
        }

        :host([compact]) .sub {
            display: inline;
        }

        :host([compact]) .content {
            display: inline;
        }

        :host([compact]) .main {
            margin: 0;
        }
    `

    render() {
        return html`
        <div class='avatar-container'>
            <slot name='avatar'>
                ${this.avatar ? html`<img src='${this.avatar}' alt='avatar'>` : ''}
            </slot>
        </div>
        <div class='main'>
            <div class='info'>
                <slot name='name' class='name'>${this.name}${this.compact ? html`:&nbsp;` : ''}</slot>
                <slot name='sub' class='sub'>${this.sub}</slot>
            </div>
            ${this.compact ? '' : html`<hr>`}
            <div class='content'>
                <slot>${this.content}</slot>
            </div>
        </div>
        `
    }

    updated(changedProperties) {
        if (changedProperties.has('compact') && this.hasAttribute('compact')) {
            if(changedProperties.get('compact') == true && this.compact == false) {
                this.removeAttribute('compact');
            }
        }
    }
}

customElements.define('ch-dl', CharacterDialog);