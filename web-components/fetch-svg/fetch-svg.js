export class FetchSvg extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        let url = this.getAttribute('src')
        let content = await (await fetch(url)).text()
        this.innerHTML = content
    }
}

window.customElements.define('fetch-svg', FetchSvg)