/// <reference path="../../../../../_typings/index.d.ts" />

import { LitElement, html } from 'https://esm.sh/lit@3.2.0';

class SettingsPanel extends LitElement {
    render() {
        return html`
        <link rel="stylesheet" href="/assets/css/aquamarinev2/input.css">
        <label>
            Language
            <select>
                <option value="en-us">English</option>
                <option value="zh-cn">简体中文</option>
            </select>
        </label>
        <p>Refresh the page to apply changes.</p>
        `
    }

    #handleLanguageChange(event) {
        const language = event.target.value;
        let data = localStorage.getItem('reminiscence_game_data');
        if(data != null) {
            data = JSON.parse(data);
            data.settings.language = language;
            localStorage.setItem('reminiscence_game_data', JSON.stringify(data));
        }
    }
}

customElements.define('settings-panel', SettingsPanel);