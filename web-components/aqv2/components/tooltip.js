import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import tippy from 'https://cdn.jsdelivr.net/npm/tippy.js@6.3.7/+esm'
import aqCss from '../lib/css.js'

let tooltipStyle = aqCss`
    .tippy-box[data-theme~='aquamarine']{
        background: var(--background-color);
        color: var(--text-color);
        border-radius: 0;
        box-shadow: 0px 4px 8px var(--shadow-color);
    }
    .tippy-box[data-theme~='aquamarine'] .tippy-arrow{
        color: var(--background-color);
    }
    .tippy-box[data-theme~='aquamarine'] .tippy-arrow::before {
        filter: drop-shadow(0px 4px 8px var(--shadow-color));
    }
    .tippy-box[data-animation=fade][data-state=hidden]{
        opacity:0
    }
    [data-tippy-root]{
        max-width:calc(100vw - 10px)
    }
    .tippy-box{
        position:relative;
        background-color:#333;
        color:#fff;
        border-radius:4px;font-size:14px;
        line-height:1.4;
        white-space:normal;
        outline:0;
        transition-property:transform,visibility,opacity
    }
    .tippy-box[data-placement^=top]>.tippy-arrow{bottom:0}
    .tippy-box[data-placement^=top]>.tippy-arrow:before{bottom:-7px;left:0;border-width:8px 8px 0;border-top-color:initial;transform-origin:center top}
    .tippy-box[data-placement^=bottom]>.tippy-arrow{top:0}
    .tippy-box[data-placement^=bottom]>.tippy-arrow:before{top:-7px;left:0;border-width:0 8px 8px;border-bottom-color:initial;transform-origin:center bottom}
    .tippy-box[data-placement^=left]>.tippy-arrow{right:0}
    .tippy-box[data-placement^=left]>.tippy-arrow:before{border-width:8px 0 8px 8px;border-left-color:initial;right:-7px;transform-origin:center left}
    .tippy-box[data-placement^=right]>.tippy-arrow{left:0}
    .tippy-box[data-placement^=right]>.tippy-arrow:before{left:-7px;border-width:8px 8px 8px 0;border-right-color:initial;transform-origin:center right}
    .tippy-box[data-inertia][data-state=visible]{transition-timing-function:cubic-bezier(.54,1.5,.38,1.11)}
    .tippy-arrow{width:16px;height:16px;color:#333}
    .tippy-arrow:before{content:"";position:absolute;border-color:transparent;border-style:solid}
    .tippy-content{position:relative;padding:5px 9px;z-index:1}
`

document.adoptedStyleSheets.push(tooltipStyle)

/**
 * @extends {HTMLElement}
 */
export class AqTooltip extends LitElement {
    constructor(){
        super()
        /**@type {'auto'|'left'|'top'|'right'|'bottom'} */
        this.placement = 'auto'
        /**@type {string} */
        this.trigger = 'mouseenter focus'
    }

    static get properties(){
        return {
            placement: {type: String},
            trigger: {type: String},
        }
    }

    static get styles(){
        return css`
        :host {
            display: contents;
        }
        .base {
            position: relative;
        }
        .tooltip-wrapper{
            display: none;
        }
        `
    }

    get tooltip(){
        return this.shadowRoot?.querySelector('.tooltip')
    }

    get content(){
        return this.shadowRoot?.querySelector('.content')
    }

    render(){
        return html`
        <div class='base'>
            <slot class='content'></slot>
            <div class='tooltip-wrapper'>
                <div class='tooltip' role='tooltip' aria-hidden='true'>
                    <slot name='tooltip'></slot>
                </div>
            </div>
        </div>
        `
    }

    connectedCallback(){
        super.connectedCallback()

        let children = []
        for(let el of this.children){
            if(el.slot != 'tooltip') children.push(el)
        }

        let tooltip = this.querySelector('[slot=tooltip]')

        tippy(children, {
            content: tooltip,
            placement: this.placement,
            trigger: this.trigger,
            appendTo: () => document.body,
            interactive: true,
            theme: 'aquamarine',
        })
    }
}

customElements.define('aq-tooltip', AqTooltip)