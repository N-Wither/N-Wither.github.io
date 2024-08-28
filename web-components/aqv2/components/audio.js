/// <reference path="../../../_typings/index.d.ts" />

import { LitElement, html } from 'https://esm.sh/lit@3.2.0';
import style from '../styles/audio.style.js'
import { createLocalizer } from '../lib/localize.js'
import './slider.js';
import './icon.js';
import './tooltip.js'

export class AqAudio extends LitElement {
    static get properties() {
        return {
            src: { type: String },
            thumbnail: { type: String },
            loop: { type: Boolean },
            name: { type: String },
            downloadable: { type: Boolean },
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
            volume: '音量',
            mute: '静音',
            unmute: '取消静音',
            playback: '播放速度',
            download: '下载',
            rewind: '快退',
            forward: '快进',
        }
    }

    #localize = createLocalizer(AqAudio.lang)

    constructor() {
        super()
        this.downloadable = true
    }

    render() {
        return html`
        <link rel="stylesheet" href="/assets/css/aquamarinev2/button.css">
        <audio
            src="${this.src}"
            ?loop="${this.loop}"
            @timeupdate=${this.#trackProgress}
            @durationchange=${this.#trackProgress}
            @ended=${this.#audioEnded}
        ></audio>
        ${this.thumbnail ? html`<div class='image-container'><img src="${this.thumbnail}" alt="thumbnail"></div>` : ''}
        <div class='controls'>
            <div class='title'>
                <div class='time'>${this.#formatTime(this._currentTime)}/${this.#formatTime(this._duration)}</div>
                <div>${this.name}</div>
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
                <aq-tooltip placement='bottom' class='playback-container' interactive>
                    <button class='playback'><aq-icon name='speed'></aq-icon></button>
                    <div slot='tooltip'>
                    <link rel="stylesheet" href="/assets/css/aquamarinev2/input.css">
                    <label>
                        ${this.#localize('playback')}
                        <select @change=${(e) => this.playbackRate = Number(e.target.value)}>
                            <option value='0.5'>0.5x</option>
                            <option value='0.75'>0.75x</option>
                            <option value='1' selected>1x</option>
                            <option value='1.25'>1.25x</option>
                            <option value='1.5'>1.5x</option>
                            <option value='2'>2x</option>
                        </select>
                    </label>
                    </div>
                </aq-tooltip>
                <aq-tooltip placement='bottom'>
                    <button @click=${this.downloadAudio}><aq-icon name='download'></aq-icon></button>
                    <div slot='tooltip'>${this.#localize('download')}</div>
                </aq-tooltip>
            </div>
        </div>
        `
    }

    get #audioElement(){ return this.shadowRoot?.querySelector('audio') }
    get #volumeButton(){ return this.shadowRoot?.querySelector('button.volume')}
    get #volumeSlider(){ return this.shadowRoot?.querySelector('aq-slider') }
    get #volumeButtonTooltip() { return this.shadowRoot?.querySelector('.volume-container').tooltipContent }
    get #playButtonTooltip() { return this.shadowRoot?.querySelector('.play-container').tooltipContent }
    get #progressContainer(){ return this.shadowRoot?.querySelector('.progress-container') }

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
    }

    pause(){
        this.#audioElement.pause()
        if(this.paused == true){
            this._playing = false
            this.#playButtonTooltip.innerText = this.#localize('play')
        }
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
        // if right click, ignore
        if(e.button === 2) return;
        let percentage = this.#getProgressPercentage(e)
        this.currentTime = this.duration * percentage
        this.#progressContainer.ariaValueNow = (percentage * 100).toFixed(1)
    }

    #progressMousedown(e){
        this.#mouseDown = true
        this.#progressClick(e)
    }

    #progressMousemove(e){
        if(this.#mouseDown){
            this.#progressClick(e)
        }
    }

    #progressMouseup(e){
        this.#mouseDown = false
    }

    downloadAudio(){
        if(this.src == undefined) return;
        let link = document.createElement('a')
        link.href = this.src
        link.download = this.name
        link.click()
    }
}

customElements.define('aq-audio', AqAudio);