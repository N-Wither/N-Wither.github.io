import { html, css } from 'https://esm.sh/lit@3.2.0';
import { headerButtonStyle, HeaderButton } from './header-button.js';
import '../aqv2/components/tooltip.js';
import '../aqv2/components/icon.js'
import { createLocalizer } from '../aqv2/lib/localize.js';

export class DarkModeButton extends HeaderButton {
    static THEME_MODE_KEY = 'theme-mode';
    static THEME_MODES = {
        light: 'light',
        dark: 'dark',
        auto: 'auto'
    };
    static #THEME_NAME_MAP = {
        light: 'light_mode',
        dark: 'dark_mode',
        auto: 'brightness_medium'
    }

    static get lang() {
        return {
            'zh-cn': {
                1: '切换亮色/暗色模式'
            },
            default: {
                1: 'Toggle dark mode.'
            }
        }
    }

    #localize = createLocalizer(DarkModeButton.lang)

    // static #channel = new BroadcastChannel('aquamarine-page-theme')

    static autoTheme() {
        if ((matchMedia('(prefers-color-scheme: dark)') && localStorage.getItem(DarkModeButton.THEME_MODE_KEY) != 'light') || localStorage.getItem(DarkModeButton.THEME_MODE_KEY) == 'dark') {
            document.documentElement.classList.add('theme-dark')
        } else if ((matchMedia('(prefers-color-scheme: light)') || localStorage.getItem(DarkModeButton.THEME_MODE_KEY) == 'light')) {
            document.documentElement.classList.remove('theme-dark')
        }
    }

    get #icon(){
        if(this.shadowRoot){
            return this.shadowRoot.querySelector('aq-icon')
        }
        else return null
    }

    constructor(){
        super()
        DarkModeButton.autoTheme()
    }

    applyThemeMode(mode, broadcast = true) {
        let html = document.documentElement;
        if (mode == DarkModeButton.THEME_MODES.dark) {
            html.classList.add('theme-dark')
            if (this.#icon){
                this.#icon.name = DarkModeButton.#THEME_NAME_MAP.dark
            }
        } else if (mode == DarkModeButton.THEME_MODES.light) {
            html.classList.remove('theme-dark')
            if (this.#icon){
                this.#icon.name = DarkModeButton.#THEME_NAME_MAP.light
            }
        } else {
            html.classList.remove('theme-dark')
            if (this.#icon) {
                this.#icon.name = DarkModeButton.#THEME_NAME_MAP.auto
            }
            DarkModeButton.autoTheme()
        }
        if (broadcast == true){
            // DarkModeButton.#channel.postMessage({theme: mode})
            document.dispatchEvent(new CustomEvent('theme-change', {detail: {theme: mode}}))
        }
    }

    toggleThemeMode() {
        let themeMode = localStorage.getItem(DarkModeButton.THEME_MODE_KEY);
        if (themeMode == DarkModeButton.THEME_MODES.dark) {
            localStorage.setItem(DarkModeButton.THEME_MODE_KEY, themeMode = DarkModeButton.THEME_MODES.light);
        } else if (themeMode == DarkModeButton.THEME_MODES.light) {
            localStorage.setItem(DarkModeButton.THEME_MODE_KEY, themeMode = DarkModeButton.THEME_MODES.auto);
        } else {
            localStorage.setItem(DarkModeButton.THEME_MODE_KEY, themeMode = DarkModeButton.THEME_MODES.dark);
        }
        this.applyThemeMode(themeMode);
    }

    render() {
        let isAlreadyDark = document.documentElement.classList.contains('theme-dark') || localStorage.getItem('theme-mode') == 'dark'
        return html`
        <div class="base ${isAlreadyDark ? 'theme-dark' : ''}">
            <aq-tooltip placement='bottom'>
                <button class="button" @click=${this.toggleThemeMode} name=${this.#localize('1')}>
                    <aq-icon name=${DarkModeButton.#THEME_NAME_MAP[localStorage.getItem(DarkModeButton.THEME_MODE_KEY)] ?? DarkModeButton.#THEME_NAME_MAP.auto}></aq-icon>
                </button>
                <div slot='tooltip'>${this.#localize('1')}</div>
            </aq-tooltip>
        </div>
        `
    }

    static styles = [
        headerButtonStyle,
        css`
            .button {
                width: var(--header-height);
                height: var(--header-height);
            }
            aq-tooltip {
                display: flex;
                width: 100%;
                height: 100%;
                align-items: center;
                justify-content: center;
            }
        `,
    ];
}

customElements.define('darkmode-button', DarkModeButton)