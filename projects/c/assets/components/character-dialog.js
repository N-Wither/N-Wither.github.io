/// <reference path="../../../../_typings/index.d.ts" />

import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class CharacterDialog extends LitElement {
    static properties = {
        name: { type: String },
        sub: { type: String },
        content: { type: String },
        compact: { type: Boolean },
    }

    static styles = css`
        :host {
            --character-color: var(--text-color);
            --sub-color: var(--text-color-lt);
            --divider-color: var(--character-color);
            display: block;
        }

        :host([compact]) {
            display: flex;
            margin-block: 1em;
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
    `

    render() {
        return html`
        <div class='info'>
            <slot name='name' class='name'>${this.name}${this.compact ? html`:&nbsp;` : ''}</slot>
            <slot name='sub' class='sub'>${this.sub}</slot>
        </div>
        ${this.compact ? '' : html`<hr>`}
        <div class='content'>
            <slot>${this.content}</slot>
        </div>
        `
    }

    updated(changedProperties) {
        if (changedProperties.has('compact') && this.hasAttribute('compact')) {
            if(changedProperties.get('compact') == true) {
                this.removeAttribute('compact');
            }
        }
    }
}

customElements.define('ch-line', CharacterDialog);