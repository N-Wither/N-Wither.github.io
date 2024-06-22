import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { inventoryItemStyle } from './inventory-item.js';
import { buttonStyle } from '../styles.js';
import { itemProperties } from '../items.js'
import '/web-components/aqv2/components/tooltip.js'
import '/web-components/aqv2/components/translate.js'

export class PurchaseItem extends LitElement {
    static properties = {
        item: {},
        price: { type: Number },
    }

    render() {
        return html`
        <aq-tooltip>
            <div class='item-name'>
                <div class='icon'></div>
                <div><aq-ts key='item.${this.item}'></aq-ts> × ${itemProperties[this.item].buyCount}</div>
            </div>
            <div slot='tooltip'>
                <div><aq-ts key='item.${this.item}.desc'></aq-ts></div>
                <div><aq-ts key='ui.price'></aq-ts>: <span class='price'>${this.price}</span> × ${itemProperties[this.item].buyCount} = ${this.price * itemProperties[this.item].buyCount}</div>
            </div>
        </aq-tooltip>
        <div class='purchase-count'>
            <div><aq-ts key='ui.purchaseCount'></aq-ts>:</div>
            <div>
                <button @click=${() => this.dispatchEvent(this.#makeEvent(1))}>1</button>
                <button @click=${() => this.dispatchEvent(this.#makeEvent(10))}>10</button>
                <button @click=${() => this.dispatchEvent(this.#makeEvent(100))}>100</button>
            </div>
        </div>
        `
    }

    #makeEvent(count) {
        return new CustomEvent('purchase', {detail: {count: count}, bubbles: true});
    }

    static styles = [
        inventoryItemStyle,
        buttonStyle,
        css`
        .purchase-count {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
        }
        `
    ]
}

customElements.define('purchase-item', PurchaseItem);