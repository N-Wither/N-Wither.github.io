import { LitElement, html, css } from 'https://esm.sh/lit@3.2.0';
import { inventoryItemStyle } from './inventory-item.js';
import { buttonStyle } from '../styles.js';
import { itemProperties } from '../items.js';
import '/web-components/aqv2/components/tooltip.js'
import '/web-components/aqv2/components/translate.js'

export class RecipeItem extends LitElement {
    static properties = {
        item: {},
        recipe: { type: Object, attribute: false },
    }

    render() {
        return html`
        <aq-tooltip>
            <div class='item-name'>
                <div class='icon'></div>
                <div><aq-ts key='item.${this.item}'></aq-ts> × ${itemProperties[this.item]?.craftCount ?? 1}</div>
            </div>
            <div slot='tooltip'>
                <div><aq-ts key='item.${this.item}.desc'></aq-ts></div>
                <hr>
                <div><aq-ts key='ui.recipe'></aq-ts>:</div>
                <div>${Object.keys(this.recipe).map(key => html`<span><aq-ts key='item.${key}'></aq-ts> × ${this.recipe[key]}</span><br>`)}</div>
            </div>
        </aq-tooltip>
        <div class='make-count'>
            <div><aq-ts key='ui.makeCount'></aq-ts>:</div>
            <div>
                <button @click=${() => this.dispatchEvent(this.#makeEvent(1))}>1</button>
                <button @click=${() => this.dispatchEvent(this.#makeEvent(10))}>10</button>
                <button @click=${() => this.dispatchEvent(this.#makeEvent(100))}>100</button>
            </div>
        </div>
        `
    }

    #makeEvent(count) {
        return new CustomEvent('craft', {detail: {count: count}, bubbles: true});
    }

    static styles = [
        inventoryItemStyle,
        buttonStyle,
        css`
        .make-count {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
        }
        `
    ]
}

customElements.define('recipe-item', RecipeItem);