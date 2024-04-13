import { html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { headerButtonStyle, HeaderButton } from './header-button.js';

export class DarkModeButton extends HeaderButton {
    static THEME_MODE_KEY = 'theme-mode';
    static THEME_MODES = {
        light: 'light',
        dark: 'dark',
    };

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
            <button class="button" @click=${this.toggleThemeMode} title='Toggle Dark Mode'>
                <slot></slot>
            </button>
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
            .button::before {
                color: var(--text-color);
                content: '\ue518';
                position: absolute;
            }

            .theme-dark .button::before {
                content: '\ue51c';
            }
        `,
    ];
}

customElements.define('darkmode-button', DarkModeButton)