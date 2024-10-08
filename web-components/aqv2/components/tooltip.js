import { LitElement, html, css } from 'https://esm.sh/lit@3.2.0';
import tippy from 'https://esm.sh/tippy.js@6.3.7'

let tooltipStyle = css`
    .tippy-box[data-theme~='aquamarine']{
        background: var(--background-color);
        color: var(--text-color);
        border-radius: 0;
        box-shadow: var(--general-shadow);
    }
    .tippy-box[data-theme~='aquamarine'] .tippy-arrow{
        color: var(--background-color);
    }
    .tippy-box[data-theme~='aquamarine'] .tippy-arrow::before {
        filter: drop-shadow(var(--general-shadow));
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

document.adoptedStyleSheets.push(tooltipStyle.styleSheet)

/**
 * @extends {HTMLElement}
 */
export class AqTooltip extends LitElement {
    constructor(){
        super()
        /**@type {'auto'|'left'|'left-start'|'left-end'|'right'|'right-start'|'right-end'|'top'|'top-start'|'top-end'|'bottom'|'bottom-start'|'bottom-end'} */
        this.placement = 'auto'
        /**@type {string} */
        this.trigger = 'mouseenter focus'
        this.target = undefined
        this.interactive = false
        this.source = undefined
        this.clone = false
    }

    static get properties(){
        return {
            placement: {type: String},
            trigger: {type: String},
            target: {type: String},
            interactive: {type: Boolean},
            source: {type: String},
            clone: {type: Boolean},
        }
    }

    static get styles(){
        return css`
        :host {
            display: contents;
        }
        :host([target]){
            display: none;
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

        let tippyProperties = {
            placement: this.placement,
            trigger: this.trigger,
            appendTo: () => document.body,
            interactive: this.interactive,
            theme: 'aquamarine',
        }

        let sourceElement
        if(this.source != undefined) {
            sourceElement = document.querySelector(this.source)
            if(sourceElement == null) throw new Error(`Source element not found: ${this.source}`)
        }

        if(this.target != undefined) {
            this.tippyInstance = tippy(this.target, {
                ...tippyProperties,
                content: this.source ? (this.clone ? sourceElement.cloneNode(true) : sourceElement) : this.innerHTML,
                allowHTML: true
            })
        }
        else {
            let children = Array.from(this.children).filter(child => child.slot != 'tooltip')
            let tooltip = this.querySelector('[slot=tooltip]')

            this.tippyInstance = tippy(children, {
                ...tippyProperties,
                content: this.source ? (this.clone ? sourceElement.cloneNode(true) : sourceElement) : tooltip,
            })
        }
    }

    get tooltipContent(){
        return this?.tippyInstance[0].popper.querySelector('[slot=tooltip]')
    }
}

customElements.define('aq-tooltip', AqTooltip)