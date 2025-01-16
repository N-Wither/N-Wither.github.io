import { LitElement, html, css } from 'https://esm.sh/lit@3.2.0';

export class ToolBox extends LitElement {
    constructor() {
        super();
    }

    render() {
        this.role = 'toolbar';
        return html`
            <div class="base">
                <slot></slot>
            </div>
        `;
    }

    static get styles() {
        return css`
            :host {
                display: block;
                position: fixed;
                top: calc(var(--header-height) + 1em);
                right: 0.8rem;
                z-index: 999;
                transition: all var(--transition-time-common);
                background: var(--background-color);
                box-shadow: var(--general-shadow);
                width: var(--toolbox-width);
            }

            @media (max-width: 768px) {
                :host {
                    top: unset;
                    bottom: 0.8rem;
                }

                slot {
                    display: flex;
                    flex-direction: column-reverse
                }
            }
        `;
    }
}

customElements.define('tool-box', ToolBox);
