const style = await fetch('/web-components/aquamarine/audio/audio.css').then(resp => resp.text())
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)

const template = 
`<div class='audio__base'>
<div part='thumbnail' class='audio__thumbnail'></div>
<div class='audio__body'>
    <audio></audio>
    <div part='title' class='audio__title'></div>
    <div part='progress' class='audio__progress'>
        <div part='time' class='audio__time'>0:00/0:00</div>
        <progress part='progress_bar' class='audio__progress-bar' max='100' value='0'></progress>
    </div>
    <div part='control' class='audio__control'>
        <div class='audio__control-play'>
            <button part='button-play' class='audio__button-play' title='Play / Pause'>\ue037</button>
            <button part='button-backward' class='audio__button-backward' title='Backwards'>\ue020</button>
            <button part='button-forward' class='audio__button-forward' title='Forwards'>\ue01f</button>
        </div>
        <div part='volume' class='audio__volume' title='volume'>
            <span class='audio__volume-icon'>\ue050</span>
            <progress min='0' max='1' value='1' class='audio__volume-bar'></progress>
        </div>
        <div class='audio__playback'>
            <span class='audio__playback-icon'>\ue9e4</span>
            <select class='audio__playback-rate' title='Speed'>
                <option value='0.5'>0.5x</option>
                <option value='0.75'>0.75x</option>
                <option value='1' selected>1x</option>
                <option value='1.25'>1.25x</option>
                <option value='1.5'>1.5x</option>
                <option value='1.75'>1.75x</option>
                <option value='2'>2x</option>
            </select>
        </div>
        <button class='audio__button-download' title='Download'>\uf090</button>
    </div>
</div>
</div>`

export class AqAudio extends HTMLElement{
    #mouseDown = false

    constructor() {
        super()
        this.attachShadow({mode: 'open'}).innerHTML = template
        this.shadowRoot.adoptedStyleSheets.push(styleSheet)

        this.doms = {
            title: this.shadowRoot.querySelector('.audio__title'),
            thumbnail: this.shadowRoot.querySelector('.audio__thumbnail'),
            audio: this.shadowRoot.querySelector('audio'),
            playButton: this.shadowRoot.querySelector('.audio__button-play'),
            backwardButton: this.shadowRoot.querySelector('.audio__button-backward'),
            forwardButton: this.shadowRoot.querySelector('.audio__button-forward'),
            time: this.shadowRoot.querySelector('.audio__time'),
            progressBar: this.shadowRoot.querySelector('.audio__progress-bar'),
            volumeIcon: this.shadowRoot.querySelector('.audio__volume-icon'),
            volumeBar: this.shadowRoot.querySelector('.audio__volume-bar'),
            downloadButton: this.shadowRoot.querySelector('.audio__button-download'),
            speedSelect: this.shadowRoot.querySelector('.audio__playback-rate')
        }
        this.attrs = {
            title: this.getAttribute('audio-title'),
            thumbnail: this.getAttribute('thumbnail'),
            src: this.getAttribute('src')
        }

        if(this.attrs.title != null) {
            this.doms.title.innerHTML = this.attrs.title
        }
        if(this.attrs.thumbnail != null) {
            this.doms.thumbnail.innerHTML = `<img src='${this.attrs.thumbnail}'>`
        }
        else {
            this.shadowRoot.querySelector('.audio__base').classList.add('no-thumbnail')
        }
        if(this.attrs.src != null) {
            this.doms.audio.src = this.attrs.src
            this.src = this.attrs.src
        }

    }

    connectedCallback() {
        this.doms.playButton.onclick = () => {
            if(this.doms.audio.paused) this.play()
            else this.pause()
        }

        this.doms.audio.ontimeupdate = () => {
            let duration = this.doms.audio.duration
            let time = this.doms.audio.currentTime
            this.doms.time.innerHTML = `${this.#formatTime(time)}/${this.#formatTime(duration)}`
            this.doms.progressBar.value = Math.round((time / duration) * 100)
        }
        this.doms.audio.ondurationchange = () => {
            this.duration = this.doms.audio.duration
            this.doms.time.innerHTML = `0:00/${this.#formatTime(this.duration)}`
        }
        this.doms.audio.onended = () => {
            this.pause()
        }
        this.doms.audio.onvolumechange = () => {
            if(this.doms.audio.volume > 0) this.doms.volumeIcon.textContent = '\ue050'
            else this.doms.volumeIcon.textContent = '\ue04f'
            this.doms.volumeBar.value = this.volume
        }

        this.doms.progressBar.onmousedown = e => {
            let target = this.#getProgress(this.doms.progressBar, e.clientX)
            this.setCurrentTimeRatio(target)
            this.#mouseDown = true
        }
        this.doms.progressBar.onmouseup = () => this.#mouseDown = false
        this.doms.progressBar.onmousemove = e => {
            if(this.#mouseDown == true) {
                let target = this.#getProgress(this.doms.progressBar, e.clientX)
                this.setCurrentTimeRatio(target)
            }
        }
        this.doms.progressBar.onmouseleave = () => this.#mouseDown = false

        this.doms.volumeIcon.onclick = () => {
            let volume = this.doms.audio.volume
            if(this.preservedVolume == undefined) this.preservedVolume = volume
            else {}
            if(volume > 0) {
                this.volume = 0
                this.doms.audio.volume = 0
            }
            else {
                if(this.preservedVolume == 0) this.preservedVolume = 1
                this.volume = this.preservedVolume
                this.doms.audio.volume = this.preservedVolume
            }
        }

        this.doms.volumeBar.onmousedown = e => {
            this.setVolume(this.#getProgress(this.doms.volumeBar, e.clientX))
            this.#mouseDown = true
        }
        this.doms.volumeBar.onmouseup = () => this.#mouseDown = false
        this.doms.volumeBar.onmousemove = e => {
            if(this.#mouseDown == true) {
                let target = this.#getProgress(this.doms.volumeBar, e.clientX)
                this.setVolume(target)
            }
        }
        this.doms.volumeBar.onmouseleave = () => this.#mouseDown = false

        this.doms.downloadButton.onclick = () => {
            if(this.doms.audio.currentSrc == '') return
            let link = document.createElement('a')
            link.href = this.doms.audio.currentSrc
            link.download = this.audioTitle || 'audio'
            link.click()
        }

        this.doms.backwardButton.onclick = () => this.setCurrentTimeOffset(-5)
        this.doms.forwardButton.onclick = () => this.setCurrentTimeOffset(5)

        this.doms.speedSelect.onchange = () => {
            this.doms.audio.playbackRate = Number(this.doms.speedSelect.value)
        }
    }

    setSrc(src) {
        this.src = src
        this.doms.audio.src = src
    }
    setTitle(title) {
        this.audioTitle = title
        this.doms.title.innerHTML = title
    }
    setVolume(volume) {
        this.doms.audio.volume = volume
        this.volume = volume
        this.preservedVolume = volume
    }
    setCurrentTimeOffset(time) {
        this.doms.audio.currentTime += time
    }
    setCurrentTimeRatio(time) {
        if(isNaN(this.doms.audio.duration) == false)
        this.doms.audio.currentTime = time * this.doms.audio.duration
    }

    play = () => {
        if(isNaN(this.doms.audio.duration)) return;
        this.doms.audio.play()
        this.doms.playButton.innerText = '\ue034'
    }

    pause = () => {
        this.doms.audio.pause()
        this.doms.playButton.innerText = '\ue037'
    }

    #formatTime(time) {
        time = Math.round(time)
        return `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`
    }
    #getProgress(element, x) {
        let rect = element.getBoundingClientRect()
        let startX = rect.left
        let endX = rect.right
        let length = endX - startX
        let cursorX = x - startX
        let target = Math.max(cursorX / length, 0)
        return target
    }
}

customElements.define('aq-audio', AqAudio)