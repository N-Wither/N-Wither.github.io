import { html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { headerButtonStyle, HeaderButton } from './header-button.js';
import '../aqv2/components/tooltip.js';
import '../aqv2/components/icon.js'
import { createLocalizer } from '../aqv2/lib/localize.js';

/**
 * Use with AqTranslate web component to provide language selection in header.
 */
export class ChooseLanguage extends HeaderButton {
    static get styles() {
        return [
            headerButtonStyle,
        ]
    }

    render() {
        return html`
        <div class='base'>
            <aq-tooltip>
                <button class="button">
                    <aq-icon name='language'></aq-icon>
                </button>
                <div slot='tooltip'>
                    <link rel="stylesheet" href="/assets/css/aquamarinev2/input.css">
                    <label>
                        ${this.#localize('1')}
                        <select onchange='resetLanguage(this.value)'>
                            <option value="zh-cn">简体中文</option>
                            <option value="en-us">English</option>
                        </select>
                    </label>
                </div>
            </aq-tooltip>
        </div>
        `
    }

    static lang = {
        'zh-cn': {
            '1': '选择语言'
        },
        default: {
            '1': 'Choose Language'
        }
    }

    #localize = createLocalizer(ChooseLanguage.lang)
}

customElements.define('choose-language', ChooseLanguage);