/// <reference path="../../../_typings/index.d.ts" />

import { LitElement, html } from 'https://esm.sh/lit@3.2.0'
import { Task } from 'https://esm.sh/@lit/task'
import { parseBlob } from 'https://esm.sh/music-metadata@latest'
import style from '../styles/audio.style.js'
import { createLocalizer } from '../lib/localize.js'
import './slider.js';
import './icon.js';
import './tooltip.js'

/**
 * @type {WeakMap<File, ParseMetaDataResult>}
 */
const cachedFiles = new WeakMap()

export class AqAudio extends LitElement {
    static get properties() {
        return {
            src: { type: String },
            thumbnail: { type: String },
            loop: { type: Boolean },
            name: { type: String },
            sub: { type: String },
            layout: { type: String },
            downloadable: { type: Boolean },
            playlist: { state: true },
            _currentTime: { state: true },
            _duration: { state: true },
            _playing: { state: true },
            _volume: { state: true },
        }
    }

    static get styles() {
        return style
    }

    static lang = {
        default: {
            play: 'Play',
            pause: 'Pause',
            stop: 'Stop',
            volume: 'Volume',
            mute: 'Mute',
            unmute: 'Unmute',
            playback: 'Playback Speed',
            download: 'Download',
            rewind: 'Rewind',
            forward: 'Forward',
        },
        'zh-cn': {
            play: '播放',
            pause: '暂停',
            stop: '停止',
            volume: '音量',
            mute: '静音',
            unmute: '取消静音',
            playback: '播放速度',
            download: '下载',
            rewind: '快退',
            forward: '快进',
        }
    }

    /** 
     * @typedef {{ title: string; author: string }} ParseMetaDataResult
     * @param {File} file
     * @returns {Promise<ParseMetaDataResult>}
     */
    static async parseMetaData(file) {
        if (cachedFiles.has(file)) {
            return cachedFiles.get(file)
        }
        const metadata = await parseBlob(file)
        const result = {
            title: metadata.common?.title ?? file.name,
            author: metadata.common?.artists?.join(', ') ?? ''
        }
        cachedFiles.set(file, result)
        return result
    }

    #localize = createLocalizer(AqAudio.lang)

    constructor() {
        super()
        this.downloadable = true
        this.name = ''
        this.src = ''
        this.loop = false
        this.metadata = null
        /** @type {'horizontal' | 'vertical'} */
        this.layout = 'horizontal'
        /** @type {File[]} */
        this.playlist = []
    }

    connectedCallback() {
        super.connectedCallback()
        this.setAttribute('layout', 'horizontal')
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        URL.revokeObjectURL(this.#currentBlobUrl)
        URL.revokeObjectURL(this.#coverArtBlobUrl)
    }

    #renderPlaylist = new Task(this, {
        /**
         * 
         * @param {[File[]]} param0 
         * @returns 
         */
        task: async ([files]) => {
            const promises = files.map(file => AqAudio.parseMetaData(file))
            return Promise.allSettled(promises).then(results => results.map((result, i) => result.status === 'fulfilled' ? {file: files[i], ...result.value} : { file: files[i], title: '[Error loading file]', author: '' }))
        },
        args: () => [this.playlist]
    })

    render() {
        return html`
        <link rel="stylesheet" href="/assets/css/aquamarinev2/button.css">
        <link rel="stylesheet" href="/assets/css/aquamarinev2/input.css">
        <audio
            src="${this.src}"
            ?loop="${this.loop}"
            @timeupdate=${() =>{ this.#trackProgress(); this.dispatchEvent(new CustomEvent('timeupdate')) }}
            @durationchange=${() => { this.#trackProgress(); this.dispatchEvent(new CustomEvent('durationchange')) }}
            @ended=${() => { this.#audioEnded(); this.dispatchEvent(new CustomEvent('ended')) }}
        ></audio>
        <div class="player">
            ${this.thumbnail ? html`<div class='image-container'><img src="${this.thumbnail}" alt="thumbnail"></div>` : ''}
            <div class='controls'>
                <div class='title'>
                    <div class='info'>
                        <div class="name">${this.name}</div>
                        <div class="sub">${this.sub}</div>
                    </div>
                    <div class='time'>${this.#formatTime(this._currentTime)}/${this.#formatTime(this._duration)}</div>
                </div>
                <div
                    class='progress-container'
                    role='progressbar'
                    aria-valuenow='0'
                    aria-valuemin='0'
                    aria-valuemax='100'
                    tabindex='0'
                    @keydown=${this.#progressKeyDown}
                    @click=${this.#progressClick}
                    @mousedown=${this.#progressMousedown}
                    @mousemove=${this.#progressMousemove}
                    @mouseup=${this.#progressMouseup}
                    @mouseleave=${this.#progressMouseup}
                >
                    <div class='progress'></div>
                </div>
                <div class='buttons'>
                    <aq-tooltip placement='bottom' class='play-container'>
                        <button @click=${this.togglePlay}><aq-icon name=${this._playing ? 'pause' : 'play_arrow'}></aq-icon></button>
                        <div slot='tooltip'>${this.#localize('play')}</div>
                    </aq-tooltip>
                    <aq-tooltip placement='bottom' class='play-container'>
                        <button @click=${this.stop}><aq-icon name='stop_circle'></aq-icon></button>
                        <div slot='tooltip'>${this.#localize('stop')}</div>
                    </aq-tooltip>
                    <aq-tooltip placement='bottom'>
                        <button @click=${() => this.timelapse(-5)}><aq-icon name='fast_rewind'></aq-icon></button>
                        <div slot='tooltip'>${this.#localize('rewind')}</div>
                    </aq-tooltip>
                    <aq-tooltip placement='bottom'>
                        <button @click=${() => this.timelapse(5)}><aq-icon name='fast_forward'></aq-icon></button>
                        <div slot='tooltip'>${this.#localize('forward')}</div>
                    </aq-tooltip>
                    <aq-tooltip placement='bottom' class='volume-container'>
                        <button class='volume' @click=${this.toggleMute}><aq-icon name=${this._volume == 0 ? 'volume_off' : 'volume_up'}></aq-icon></button>
                        <div slot='tooltip'>${this.#localize('mute')}</div>
                    </aq-tooltip>
                    <aq-slider value='100' @input=${(e) => this.setVolume(e.target.value / 100)}></aq-slider>
                    <label class="playback-rate">
                        <aq-icon name='speed'></aq-icon>${this.#localize('playback')}
                        <select @change=${(e) => this.playbackRate = Number(e.target.value)}>
                            <option value='0.5'>0.5x</option>
                            <option value='0.75'>0.75x</option>
                            <option value='1' selected>1x</option>
                            <option value='1.25'>1.25x</option>
                            <option value='1.5'>1.5x</option>
                            <option value='2'>2x</option>
                        </select>
                    </label>
                    <aq-tooltip placement='bottom'>
                        <button @click=${this.downloadAudio}><aq-icon name='download'></aq-icon></button>
                        <div slot='tooltip'>${this.#localize('download')}</div>
                    </aq-tooltip>
                </div>
            </div>
        </div>
        <div class="playlist">
            <slot name="playlist">
                ${this.#renderPlaylist.render({
                    pending: () => html`<div>Loading...</div>`,
                    complete: (datas) => {
                        return datas.map((data) => html`
                            <button class="playlist-item" @click=${async () => { await this.loadFile(data.file); this.play()}}>
                                <div class="playlist-item-name">${data.title}</div>
                                <div class="playlist-item-author">${data.author}</div>
                            </button>
                        `)
                    },
                    error: (e) => html`<div>Error loading playlist: ${e.message}</div>`
                })}
            </slot>
        </div>
        `
    }

    get #audioElement(){ return this.shadowRoot?.querySelector('audio') }
    get #volumeButton(){ return this.shadowRoot?.querySelector('button.volume')}
    get #volumeSlider(){ return this.shadowRoot?.querySelector('aq-slider') }
    get #volumeButtonTooltip() { return this.shadowRoot?.querySelector('.volume-container').tooltipContent }
    get #playButtonTooltip() { return this.shadowRoot?.querySelector('.play-container').tooltipContent }
    get #progressContainer() { return this.shadowRoot?.querySelector('.progress-container') }
    get #progressBar() { return this.shadowRoot?.querySelector('.progress') }
    get audio() { return this.#audioElement }

    get volume(){ return this.#audioElement?.volume }
    set volume(value){ this.#audioElement.volume = value }

    get duration(){ return isNaN(this.#audioElement?.duration ?? 0) ? 0 : this.#audioElement.duration }

    get currentTime(){ return isNaN(this.#audioElement?.currentTime ?? 0) ? 0 : this.#audioElement.currentTime }
    set currentTime(value){ this.#audioElement.currentTime = value }

    get paused(){ return this.#audioElement?.paused }

    get ended(){ return this.#audioElement?.ended }

    get playbackRate(){ return this.#audioElement?.playbackRate }
    set playbackRate(value){ this.#audioElement.playbackRate = value }

    #mouseDown = false
    /** @type {URL} */
    #currentBlobUrl = undefined
    /** @type {URL} */
    #coverArtBlobUrl = undefined

    #formatTime(time){
        time = time ?? 0
        const hours = Math.floor(time / 3600)
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        if(time >= 3600){
            return `${hours.toString()}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }
        else {
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }
    }

    #trackProgress(){
        const progress = this.currentTime / this.duration * 100
        this.shadowRoot.querySelector('.progress').style.width = `${progress}%`
        this._currentTime = this.currentTime
        this._duration = this.duration
        this.#progressContainer.ariaValueNow = progress.toFixed(1)
    }

    play(){
        if(this.src)
        this.#audioElement.play()
        if(this.paused == false){
            this._playing = true
            this.#playButtonTooltip.innerText = this.#localize('pause')
        }
        this.dispatchEvent(new CustomEvent('play'))
    }

    pause(){
        this.#audioElement.pause()
        if(this.paused == true){
            this._playing = false
            this.#playButtonTooltip.innerText = this.#localize('play')
        }
    }

    stop(){
        this.#audioElement.pause()
        this.#audioElement.currentTime = 0
        this._playing = false
        this.#playButtonTooltip.innerText = this.#localize('play')
    }

    togglePlay(){
        if(this.paused){
            this.play()
        } else {
            this.pause()
        }
    }

    toggleMute(){
        if(this.volume === 0){
            this.setVolume(1)
            this.#volumeButtonTooltip.innerText = this.#localize('mute')
        } else {
            this.setVolume(0)
            this.#volumeButtonTooltip.innerText = this.#localize('unmute')
        }
    }

    /**@param {number} seconds*/
    timelapse(seconds){
        this.#audioElement.currentTime += seconds
    }

    setVolume(volume){
        this.#volumeSlider.value = volume * 100
        this.#audioElement.volume = volume
        this._volume = volume
    }

    #audioEnded(){
        if(this.loop){
            this.currentTime = 0
            this.play()
        } else {
            this.pause()
        }
    }

    /**@param {KeyboardEvent} e */
    #progressKeyDown(e){
        if(e.key === 'ArrowRight'){
            this.timelapse(5)
        }
        if(e.key === 'ArrowLeft'){
            this.timelapse(-5)
        }
        if(e.key === 'ArrowUp'){
            this.volume = this.volume + 0.1
        }
        if(e.key === 'ArrowDown'){
            this.volume = this.volume - 0.1
        }
    }

    #getProgressPercentage(e){
        let rect = this.#progressContainer.getBoundingClientRect()
        let startX = rect.left
        let endX = rect.right
        let length = endX - startX
        let cursorX = e.clientX - startX
        let percentage = cursorX / length
        return percentage
    }

    /**@param {MouseEvent} e */
    #progressClick(e){
        // if not left click, ignore
        if(e.button != 0) return;
        let percentage = this.#getProgressPercentage(e)
        this.currentTime = this.duration * percentage
        this.#progressContainer.ariaValueNow = (percentage * 100).toFixed(1)
    }

    #progressMousedown(e){
        this.#mouseDown = true
        this.#progressClick(e)
        this.#progressBar.setAttribute('holding', '')
    }

    #progressMousemove(e){
        if(this.#mouseDown){
            this.#progressClick(e)
        }
    }

    #progressMouseup(e){
        this.#mouseDown = false
        this.#progressBar.removeAttribute('holding')
    }

    downloadAudio(){
        if(this.src == undefined) return;
        let link = document.createElement('a')
        link.href = this.src
        link.download = this.name
        link.click()
    }

    /**
     * @param {File} file 
     */
    addToPlaylist(file) {
        this.playlist = [...this.playlist, file]
    }

    /**
     * @param {File} file 
     */
    removeFromPlaylist(file) {
        this.playlist = this.playlist.filter(f => f !== file)
    }

    /**
     * Directly set audio source from a File object and parse metadata from it.
     * @param {File} file 
     */
    async loadFile(file) {
        if (file instanceof Blob == false) return;
        URL.revokeObjectURL(this.#currentBlobUrl)
        URL.revokeObjectURL(this.#coverArtBlobUrl)
        let url = URL.createObjectURL(file)
        let coverUrl = undefined
        this.src = url
        this.#currentBlobUrl = url
        
        const metadata = await parseBlob(file)
        const artisits = metadata.common?.artists?.join(', ') ?? ''
        const title = metadata.common?.title ?? file.name
        const album = metadata.common?.album ?? ''
        const picture = metadata.common?.picture?.[0]
        this.metadata = metadata

        this.name = title
        this.sub = (artisits + album).length > 0 ? `\n${artisits} | ${album}` : ''
        if (picture) {
            const blob = new Blob([picture.data], { type: picture.format })
            coverUrl = URL.createObjectURL(blob)
            this.thumbnail = coverUrl
            this.#coverArtBlobUrl = coverUrl
        }

        if (this._playing) {
            this.stop()
        }
    }
}

customElements.define('aq-audio', AqAudio);