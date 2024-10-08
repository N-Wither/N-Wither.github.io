import { LitElement, html, css } from 'https://esm.sh/lit@3.2.0';

export class ConsoleDialog extends LitElement {
    static get properties() {
        return {
            avatar: { type: String },
            name: { type: String },
            message: { type: String }
        }
    }

    static get styles() {
        return css`
        :host {
            display: block;
        }
        `
    }

    render() {
        return html`
        <div class='avatar'>
            <slot name='avatar'>
                ${html`<img src='${this.avatar}'>`}
            </slot>
        </div>
        <div class='name'>
            <slot name='name'>${this.name}</slot>
        </div>
        <div class='message'>
            <slot>${this.message}</slot>
        </div>
        `
    }
}

customElements.define('console-dialog', ConsoleDialog);