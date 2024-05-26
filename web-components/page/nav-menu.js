import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../aqv2/components/tooltip.js'
import { createLocalizer } from '../aqv2/lib/localize.js';
import '../aqv2/components/icon.js'

const langs = {
    'en-us': {
        home: 'Home',
        proj: 'Projects',
        artc: 'Articles',
        tool: 'Tools',
        game: 'Games',
        theme: 'Themes'
    },
    'zh-cn': {
        home: '首页',
        proj: '项目',
        artc: '文章',
        tool: '工具',
        game: '游戏',
        theme: '主题'
    }
}

const userLang = navigator?.language.toLowerCase() || document.documentElement.lang.toLowerCase()
let chosenLang = langs['en-us']
switch(userLang) {
    case 'zh-cn': chosenLang = langs['zh-cn']; break;
    default: ;
}

const navigateItems = [
    {
        text: chosenLang.home,
        icon: '\ue88a',
        url: '/'
    },
    {
        text: chosenLang.proj,
        icon: '\uf8ee',
        url: '/projects/'
    },
    {
        text: chosenLang.artc,
        icon: '\uef42',
        url: '/writings/'
    },
    {
        text: chosenLang.tool,
        icon: '\uea59',
        url: '/tools/'
    },
    {
        text: chosenLang.game,
        icon: '\uf135',
        url: '/games/'
    },
    {
        text: chosenLang.theme,
        icon: '\ue40a',
        url: '/themes/'
    }
]

export class NavMenu extends LitElement {
    constructor(){
        super()
    }

    static get styles(){
        return css`
        .nav-menu-switch {
            display: block;
            font-family: 'Material Symbols Outlined';
            font-size: 1.6rem;
            border: none;
            background: none;
            color: inherit;
            width: var(--header-height);
            height: var(--header-height);
            user-select: none;
        }
    
        .nav-menu {
            position: fixed;
            left: 0;
            top: var(--header-height);
            transform: translateX(-100%);
            transition: var(--transition-time-common);
            width: var(--nav-menu-width);
            height: calc(100vh - var(--header-height));
            background: var(--background-color);
            box-shadow: 0px 4px 8px var(--shadow-color);
        }
    
        .nav-menu.open, .nav-menu:has(:focus) {
            transform: translateX(0)
        }

        a.item {
            display: flex;
            justify-content: left;
            align-items: center;
            text-decoration: none;
            color: inherit;
            min-height: var(--header-height);
            border-bottom: var(--border-color) solid 2px;
            font-size: 1.4rem;
            transition: var(--transition-time-common);
            background: linear-gradient(var(--accent-color), var(--accent-color));
            background-position: left;
            background-size: 0% 100%;
            background-repeat: no-repeat;
            position: relative;
        }

        a.item:is(:hover, :focus){
            background-size: 100% 100%;
            color: var(--text-color-contrast);
        }

        .container {
            display: flex;
        }

        .icon {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 3rem;
            width: 3rem;
        }

        .text {
            display: flex;
            align-items: center;
            justify-content: left;
        }
        `
    }

    static get lang(){
        return {
            'zh-cn': {
                1: '打开/关闭导航菜单'
            },
            default: {
                1: 'Toggle navigation menu.'
            }
        }
    }

    #localize = createLocalizer(NavMenu.lang)

    render(){
        return html`
        <header-button>
            <aq-tooltip>
                <button class='nav-menu-switch' @click=${this.toggleMenu} name=${this.#localize('1')} translate='no'>menu</button>
                <div slot='tooltip'>${this.#localize('1')}</div>
            </aq-tooltip>
        </header-button>
        <div class='nav-menu' part="menu">
            ${navigateItems.map(item => html`
            <a class = "item" href = "${item.url}">
                <div class = "container">
                    <div class = "icon">${item.icon}</div>
                    <div class = "text">${item.text}</div>
                </div>
            </a>
            `)}
        </div>
        `
    }

    get switch(){
        return this.shadowRoot?.querySelector('.nav-menu-switch') ?? null
    }
    get menu(){
        return this.shadowRoot?.querySelector('.nav-menu') ?? null
    }

    toggleMenu(){
        if(this.menu.classList.contains('open')){
            this.#close()
        }
        else {
            this.#open()
            let body = document.querySelector('page-body')
            let footer = document.querySelector('page-footer')
            if(body) body.addEventListener('click', () => {
                // this.shadowRoot?.querySelector('.nav-menu')?.classList.remove('open')
                // this.shadowRoot?.querySelector('.nav-menu-switch')?.classList.remove('open')
                this.#close()
            }, {once: true});
            if(footer) footer.addEventListener('click', () => {
                // this.shadowRoot?.querySelector('.nav-menu')?.classList.remove('open')
                // this.shadowRoot?.querySelector('.nav-menu-switch')?.classList.remove('open')
                this.#close()
            }, {once: true});
        }
    }

    #open(){
        if(this.menu.classList.contains('open') == false) {
            this.menu.classList.add('open')
            this.switch.classList.add('open')
            this.switch.innerHTML = 'close'
        }
    }

    #close(){
        this.menu.classList.remove('open')
        this.switch.classList.remove('open')
        this.switch.innerHTML = 'menu'
    }
}

customElements.define('nav-menu', NavMenu)