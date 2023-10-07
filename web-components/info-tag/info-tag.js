const stylesheetUrl = '/web-components/info-tag/style.css'
const template = 
`
    <link rel='stylesheet' href='${stylesheetUrl}'></link>
    <div class='icon'>
    </div>
    <div class='info'>
        <div class='name'></div>
        <div class='desc'></div>
    </div>
`


class InfoTag extends HTMLElement {
    constructor() {
        super()

        const sRoot = this.attachShadow({mode: 'open'})
        sRoot.innerHTML = template
        // console.log(this.getAttribute('tag'))
        
    }

    connectedCallback() {
        const sRoot = this.shadowRoot
        let iconType = this.getAttribute('icon-type') || 'img'
        let name = this.getAttribute('tag') || 'Tag'
        let desc = this.getAttribute('desc') || 'Description'
        let icon = this.getAttribute('icon') || ''
        let iconContainer = sRoot.querySelector('.icon')

        if(iconType == 'img'){
            let img = document.createElement('img')
            img.alt = 'icon'
            img.src = icon
            iconContainer.appendChild(img)
        }
        else if (iconType == 'text') {
            let span = document.createElement('span')
            span.innerHTML = icon
            iconContainer.appendChild(span)
        }

        sRoot.querySelector('.name').innerHTML = name
        sRoot.querySelector('.desc').innerHTML = desc
    }
}
window.customElements.define('info-tag', InfoTag)