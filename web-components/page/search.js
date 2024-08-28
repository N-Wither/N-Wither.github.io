import { html, css } from 'https://esm.sh/lit@3.2.0';
import { createLocalizer } from '../aqv2/lib/localize.js';
import { HeaderButton, headerButtonStyle } from './header-button.js';
import '../aqv2/components/tooltip.js';
import '../aqv2/components/icon.js';
import { dialogStyles } from './styles/dialog.js';

class SearchBox extends HeaderButton {
    render() {
        return html`
        <div class='base'>
            <aq-tooltip>
                <button class='button' style='background-color: transparent !important;' @click=${this.showDialog}>
                    <aq-icon name='search'></aq-icon>
                </button>
                <div slot='tooltip'>${this.#loaclize(1)}</div>
            </aq-tooltip>
            <dialog>
                <button class='close' title=${this.#loaclize(3)}>
                    <aq-icon name='close' @click=${this.closeDialog}></aq-icon>
                </button>
                <form>
                    <link rel="stylesheet" href="/assets/css/aquamarinev2/input.css">
                    <link rel="stylesheet" href="/assets/css/aquamarinev2/button.css">
                    <input type="text" placeholder=${this.#loaclize(1)}>
                    <select title=${this.#loaclize(2)}>
                        <option value='bing'>Bing</option>
                        <option value='google' selected>Google</option>
                    </select>
                    <button type='button' @click=${this.search} title=${this.#loaclize(4)}>
                        <aq-icon name='search' style='--icon-font-size: 1rem;'></aq-icon>
                    </button>
                </form>
            </dialog>
        </div>
        `
    }

    static lang = {
        'zh-cn': {
            1: '搜索本站',
            2: '搜索引擎',
            3: '关闭',
            4: '搜索'
        },
        default: {
            1: 'Search this site...',
            2: 'Search engine',
            3: 'Close',
            4: 'Search'
        }
    }

    static get styles() {
        return [
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
            form {
                height: 1.4em;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.2em;
            }
            form :is(input, select, button) {
                height: 100%
            }
            `,
            dialogStyles
        ]
    }

    #loaclize = createLocalizer(SearchBox.lang);

    get input(){
        return this.shadowRoot.querySelector('input');
    }
    get dialog(){
        return this.shadowRoot.querySelector('dialog');
    }
    get select(){
        return this.shadowRoot.querySelector('select');
    }

    search(){
        let a = document.createElement('a');
        switch(this.select.value){
            case 'bing':
                a.href = `https://bing.com/search?q=${this.input.value}+site:n-wither.github.io`;
                break;
            case 'google':
                a.href = `https://google.com/search?q=${this.input.value}+site:n-wither.github.io`;
                break;
        }
        a.target = '_blank';
        a.click();
    }

    showDialog(){
        this.dialog.showModal();
    }

    closeDialog(){
        this.dialog.close();
    }
}

customElements.define('search-box', SearchBox);