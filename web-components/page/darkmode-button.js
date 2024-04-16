import { html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { headerButtonStyle, HeaderButton } from './header-button.js';
import '../aqv2/components/tooltip.js';
import { localize } from '../aqv2/lib/localize.js';

export class DarkModeButton extends HeaderButton {
    static THEME_MODE_KEY = 'theme-mode';
    static THEME_MODES = {
        light: 'light',
        dark: 'dark',
    };

    static lang = {
        'zh-cn': {
            '1': '切换亮色/暗色模式'
        }
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
    
    applyThemeMode(mode) {
        let html = document.documentElement;
        if (mode === DarkModeButton.THEME_MODES.dark) {
            html.classList.add('theme-dark');
            this.shadowRoot?.querySelector('.base')?.classList.add('theme-dark')
        } else {
            html.classList.remove('theme-dark');
            this.shadowRoot?.querySelector('.base')?.classList.remove('theme-dark')
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
            <aq-tooltip>
                <button class="button" @click=${this.toggleThemeMode}>
                    <slot></slot>
                </button>
                <div slot='tooltip'>${localize(DarkModeButton.lang, '1', 'Toggle dark mode.')}</div>
            </aq-tooltip>
        </div>
        `
    }

    connectedCallback() {
        super.connectedCallback();
        this.autoDarkmode();
    }

    static styles = [
        headerButtonStyle,
        css`
            .button {
                width: var(--header-height);
                height: var(--header-height);
            }
            .button::before {
                color: var(--text-color);
                content: '\ue518';
                position: absolute;
            }
            .theme-dark .button::before {
                content: '\ue51c';
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