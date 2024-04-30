import { DarkModeButton } from "../../web-components/page/darkmode-button.js"
DarkModeButton.autoDarkmode()

let channel = new BroadcastChannel('aquamarine-page-theme')

channel.addEventListener('message', e => {
    let mode = e.data?.theme
    DarkModeButton.applyThemeMode(mode, false)
})