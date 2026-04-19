import { DomUtils } from '../../../assets/js/squash/dom.js'

let input = document.querySelector('#audio-file')
input.onchange = function () {
    let file = this.files[0]
    const audio = document.querySelector('aq-audio')
    audio.loadFile(file)
    audio.addToPlaylist(file)
}

DomUtils.$('button[name]').on('click', () => {
    const audio = document.querySelector('aq-audio')
    if (audio.getAttribute('layout') == 'horizontal') {
        audio.setAttribute('layout', 'vertical')
    } else audio.setAttribute('layout', 'horizontal')
})

DomUtils.$w('button', '#choose-directory').on('click', async () => {
    if (!window.showDirectoryPicker) {
        alert('Your browser does not support the File System Access API.')
        return
    }
    window.showDirectoryPicker().then(async (dirHandle) => {
        const audio = document.querySelector('aq-audio')
        for await (const entry of dirHandle.values()) {
            if (entry.kind === 'file' && entry.name.match(/\.(mp3|flac|wav|ogg|m4a|aac|opus|webm)$/i)) {
                const file = await entry.getFile()
                audio.addToPlaylist(file)
            }
        }
    })
})
