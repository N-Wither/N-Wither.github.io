import { html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { headerButtonStyle, HeaderButton } from './header-button.js';
import '../aqv2/components/tooltip.js';
import '../aqv2/components/icon.js'
import { createLocalizer } from '../aqv2/lib/localize.js';

export class DarkModeButton extends HeaderButton {
    static THEME_MODE_KEY = 'theme-mode';
    static THEME_MODES = {
        light: 'light',
        dark: 'dark',
    };

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

    get #icon(){
        if(this.shadowRoot){
            return this.shadowRoot.querySelector('aq-icon')
        }
        else return null
    }

    constructor(){
        super()
        this.autoDarkmode()
    }

    autoDarkmode() {
        let themeMode = localStorage.getItem(DarkModeButton.THEME_MODE_KEY);
        if (themeMode && themeMode in DarkModeButton.THEME_MODES) {
            this.applyThemeMode(themeMode);
            return;
        }
        let dark = matchMedia('(prefers-color-scheme: dark)');
        if (dark.matches) {
            localStorage.setItem(DarkModeButton.THEME_MODE_KEY, (themeMode = DarkModeButton.THEME_MODES.dark));
        } else {
            localStorage.setItem(DarkModeButton.THEME_MODE_KEY, (themeMode = DarkModeButton.THEME_MODES.light));
        }
        this.applyThemeMode(themeMode);
    }
    
    applyThemeMode(mode, broadCast = true) {
        let html = document.documentElement;
        if (mode === DarkModeButton.THEME_MODES.dark) {
            html.classList.add('theme-dark');
            if(this.#icon){
                this.#icon.name = 'dark_mode'
            }
        } else {
            html.classList.remove('theme-dark');
            if(this.#icon){
                this.#icon.name = 'light_mode'
            }
        }
        if(broadCast === true){
            // DarkModeButton.#channel.postMessage({theme: mode})
        }
    }

    toggleThemeMode() {
        let themeMode = localStorage.getItem(DarkModeButton.THEME_MODE_KEY);
        if (themeMode === DarkModeButton.THEME_MODES.dark) {
            localStorage.setItem(DarkModeButton.THEME_MODE_KEY, themeMode = DarkModeButton.THEME_MODES.light);
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
                    <aq-icon name=${isAlreadyDark ? 'dark_mode' : 'light_mode'}></aq-icon>
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