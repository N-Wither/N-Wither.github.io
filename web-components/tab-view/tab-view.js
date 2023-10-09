const stylesheetUrl = '/web-components/tab-view/style.css'
const template = 
//<>
`
<link rel='stylesheet' href='${stylesheetUrl}'></link>
<div class='tab-container'></div>
<div class='tab-pages-container'></div>
`
//</>

export class TabView extends HTMLElement {
    constructor() {
        super()
        const sRoot = this.attachShadow({mode: 'open'})
        sRoot.innerHTML = template
    }

    connectedCallback() {
        let sRoot = this.shadowRoot
        let tabContainer = sRoot.querySelector('.tab-container')
        let pagesContainer = sRoot.querySelector('.tab-pages-container')
        let tabs = this.querySelectorAll('.tab')
        let pages = this.querySelectorAll('.page')
        let defaultTab = parseInt(this.getAttribute('data-default-tab')) || 1

        if(tabs == null || pages == null) {
            console.warn('Invalid tab view content!')
            return
        }

        tabs.forEach((tab, index) => {
            let btn = document.createElement('button')
            btn.appendChild(tab)
            btn.dataset.tabIndex = index + 1

            btn.addEventListener('click', () => {
                if(!btn.classList.contains('open')) {
                    let index = btn.dataset.tabIndex
                    let currntPage = pagesContainer.querySelector('.open')
                    tabContainer.childNodes.forEach(node => node.classList.remove('open'))
                    currntPage.style.maxHeight = '0'
                    currntPage.classList.remove('open')
                    btn.classList.add('open')

                    let pageToOpen = pagesContainer.querySelector(`.page-container[data-tab-index="${index}"]`)
                    pageToOpen.classList.add('open')
                    let calculatedHeight = pageToOpen.scrollHeight
                    pageToOpen.style.maxHeight = 0
                    pageToOpen.style.maxHeight = calculatedHeight + 'px'
                }
            })

            tabContainer.appendChild(btn)
        })

        pages.forEach((page, index) => {
            let container = document.createElement('div')
            container.classList.add('page-container')
            container.dataset.tabIndex = index + 1
            container.appendChild(page)
            pagesContainer.appendChild(container)
            let computedHeight = container.scrollHeight
            container.style.maxHeight = 0
            container.style.maxHeight = computedHeight
        })

        sRoot.querySelector(`button[data-tab-index="${defaultTab}"]`).classList.add('open')
        let defaultPage = sRoot.querySelector(`.page-container[data-tab-index="${defaultTab}"]`)
        defaultPage.classList.add('open')
        defaultPage.style.maxHeight = 'auto'
        let computedHeight = defaultPage.scrollHeight
        defaultPage.style.maxHeight = computedHeight*2 + 'px'
    }
}

window.customElements.define('tab-view', TabView)