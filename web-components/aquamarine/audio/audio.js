import { AqProgress } from "/web-components/aquamarine/progress/progress.js"

const style = await fetch('/web-components/aquamarine/audio/audio.css').then(resp => resp.text())
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)

const template = 
`<div class='audio__base'>
<div part='thumbnail' class='audio__thumbnail'></div>
<div class='audio__body'>
    <div part='title' class='audio__title'></div>
    <div part='progress' class='audio__progress'>
        <div part='time' class='audio__time' style='z-index:1;'>0:00/0:00</div>
        <aq-progress part='progress_bar' class='audio__progress-bar' max='100' value='0'></aq-progress>
    </div>
    <div part='control' class='audio__control'>
        <div class='audio__control-play'>
            <button part='button-play' class='audio__button-play' title='Play / Pause'>\ue037</button>
            <button part='button-backward' class='audio__button-backward' title='Backwards'>\ue020</button>
            <button part='button-forward' class='audio__button-forward' title='Forwards'>\ue01f</button>
        </div>
        <div part='volume' class='audio__volume' title='volume'>
            <span class='audio__volume-icon'>\ue050</span>
            <aq-progress max='1' value='1' class='audio__volume-bar'></aq-progress>
        </div>
        <label class='audio__playback' title='Speed'>
            <span class='audio__playback-icon'>\ue9e4</span>
            <select class='audio__playback-rate'>
                <option value='0.25'>0.25x</option>
                <option value='0.5'>0.5x</option>
                <option value='0.75'>0.75x</option>
                <option value='1' selected>1x</option>
                <option value='1.25'>1.25x</option>
                <option value='1.5'>1.5x</option>
                <option value='1.75'>1.75x</option>
                <option value='2'>2x</option>
            </select>
        </label>
        <button class='audio__button-download' title='Download'>\uf090</button>
    </div>
</div>
</div>`

export class AqAudio extends HTMLElement{
    #mouseDown = false

    constructor() {
        super()
        this.attachShadow({mode: 'open'}).innerHTML = template
        if(this.innerHTML.includes('<audio></audio>') == false) this.innerHTML = '<audio></audio>';
        this.shadowRoot.adoptedStyleSheets.push(styleSheet)

        this.doms = {
            base: this.shadowRoot.querySelector('.audio__base'),
            title: this.shadowRoot.querySelector('.audio__title'),
            thumbnail: this.shadowRoot.querySelector('.audio__thumbnail'),
            audio: this.querySelector('audio'),
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
            src: this.getAttribute('src'),
            loop: this.getAttribute('loop') != null ? true : false,
        }

        if(this.attrs.title != null) {
            this.doms.title.innerHTML = this.attrs.title
        }
        if(this.attrs.thumbnail != null) {
            this.doms.thumbnail.innerHTML = `<img src='${this.attrs.thumbnail}'>`
        }
        else {
            this.doms.base.classList.add('no-thumbnail')
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
            this.doms.progressBar.value = (time / duration) * 100 || 0
        }
        this.doms.audio.ondurationchange = () => {
            this.doms.time.innerHTML = `0:00/${this.#formatTime(this.duration)}`
        }
        this.doms.audio.onended = () => {
            this.pause()
            if(this.attrs.loop)
            this.play()
        }
        this.doms.audio.onvolumechange = () => {
            if(this.doms.audio.volume > 0) this.doms.volumeIcon.textContent = '\ue050'
            else this.doms.volumeIcon.textContent = '\ue04f'
            this.doms.volumeBar.value = this.volume
        }

        this.doms.progressBar.onmousedown = e => {
            let target = this.#getProgress(this.doms.progressBar, e.clientX)
            this.setCurrentTimeRatio(target)
            this.doms.progressBar.style.transition = '0s'
            this.#mouseDown = true
        }
        this.doms.progressBar.onmouseup = () => {
            this.#mouseDown = false
            this.doms.progressBar.style.removeProperty('transition')
        }
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
            this.volume = this.#getProgress(this.doms.volumeBar, e.clientX)
            this.#mouseDown = true
        }
        this.doms.volumeBar.onmouseup = () => this.#mouseDown = false
        this.doms.volumeBar.onmousemove = e => {
            if(this.#mouseDown == true) {
                let target = this.#getProgress(this.doms.volumeBar, e.clientX)
                this.volume = target
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
            this.playbackRate = Number(this.doms.speedSelect.value)
        }
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

    get currentTime() {return this.doms.audio.currentTime}
    set currentTime(t) {this.doms.audio.currentTime = t}
    get volume() {return this.doms.audio.volume}
    set volume(v) {this.doms.audio.volume = v}
    get src() {return this.doms.audio.src}
    set src(src) {this.doms.audio.src = src}
    get audioTitle() {return this.doms.title.innerHTML}
    set audioTitle(t) {this.doms.title.innerHTML = t}
    get duration() {return this.doms.audio.duration}
    get playbackRate() {return this.doms.audio.playbackRate}
    set playbackRate(r) {this.doms.audio.playbackRate = r}
    get audioElement() {return this.doms.audio}
    set audioElement(e) {
        if(e instanceof HTMLMediaElement == false) {
            throw new TypeError('the parameter should be a HTMLMediaElemnt')
        }
        // this.doms.audio = e
        this.doms.audio.remove()
        this.shadowRoot.querySelector('.audio__body').insertBefore(e, this.doms.title)
    }
    get loop() {return this.attrs.loop}
    set loop(l) {
        this.attrs.loop = Boolean(l)
        if(this.loop == true) this.setAttribute('loop', '')
        else this.removeAttribute('loop')
    }
    get thumbnail() {
        return this.attrs.thumbnail
    }
    set thumbnail(s) {
        if(s){
            this.attrs.thumbnail = s
            if(this.doms.base.classList.contains('no-thumbnail')){
                this.doms.base.classList.remove('no-thumbnail')
            }
            this.doms.thumbnail.innerHTML = `<img src='${this.attrs.thumbnail}'>`
        }
        else {
            this.doms.base.classList.add('no-thumbnail')
        }
    }
}

customElements.define('aq-audio', AqAudio)
if(customElements.get('aq-progress') == undefined){
    customElements.define('aq-progress', AqProgress)
}