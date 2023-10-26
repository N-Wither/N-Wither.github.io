const template =
`
<button type='button' class='collapsible-control'></button>
<div class='aq-collapsible-wrapper'></div>
`

const style = await (await fetch('/web-components/aquamarine/collapsible/collapsible.css')).text()

const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)
document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet]

export class AqCollapsible extends HTMLElement {
    isOpen = false;
    
    /**
     * @type {HTMLElement}
     */
    $button ;
    /**
     * @type {HTMLElement}
     */
    $wrapper ;
    $attrs ;
    $currentHeight ;

    constructor() {
        super()
        const formerContent = this.innerHTML
        this.innerHTML = template
        this.querySelector('.aq-collapsible-wrapper').innerHTML = formerContent
        this.$wrapper = this.querySelector('.aq-collapsible-wrapper')
        this.$button = this.querySelector('.collapsible-control')
        this.$attrs = {
            openText: this.getAttribute('open-text') || 'Open',
            closeText: this.getAttribute('close-text') || 'Close',
            open: this.getAttribute('open') != null ? true : false,
        }
        
        this.isOpen = this.$attrs.open
    }

    connectedCallback() {
        let open = () => {
            this.$button.innerHTML = this.$attrs.closeText
            this.isOpen = true
            this.setAttribute('open', '')
            this.$button.classList.add('open')
            this.$wrapper.style.maxHeight = this.$wrapper.scrollHeight + 'px'
            this.$currentHeight = this.$wrapper.scrollHeight
        }
        let close = () => {
            this.$button.innerHTML = this.$attrs.openText
            this.isOpen = false
            this.$button.classList.remove('open')
            this.removeAttribute('open')
            this.$wrapper.style.maxHeight = '0px'
        }

        if (this.$attrs.open) {
            open()
        }
        else {
            close()
        }
        this.$button.addEventListener('click', () => {
            if (this.isOpen) {
                close()
            }
            else {
                open()
            }
        })

        /**
         * @param {HTMLElement} el 
         */
        let setAutoOpen = el => {
            let focusables = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT']
            if(focusables.includes(el.tagName)) {
                el.addEventListener('focus', open)
            }
            if(el.children.length > 0){
                Array.from(el.children).forEach(subEl => setAutoOpen(subEl))
            }
        }
        Array.from(this.$wrapper.children).forEach(el => {
            setAutoOpen(el)
        })

        let updateHeight = () => {
            if(this.$wrapper.scrollHeight != this.$currentHeight && this.isOpen){
                this.$wrapper.style.transitionDuration = '0s'
                this.$wrapper.style.maxHeight = this.$wrapper.scrollHeight + 'px'
                this.$currentHeight = this.$wrapper.scrollHeight
            }
            if(this.$wrapper.scrollHeight == this.$currentHeight && this.isOpen) {
                if(this.$wrapper.style.transitionDuration == '0s') {
                    this.$wrapper.style.removeProperty('transition-duration')
                }
            }
            requestAnimationFrame(updateHeight)
        }
        requestAnimationFrame(updateHeight)
    }
}

window.customElements.define('aq-collapsible', AqCollapsible)