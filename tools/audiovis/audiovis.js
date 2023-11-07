let file = document.querySelector('input')
let canvas = document.querySelector('canvas')
let audio = document.querySelector('audio')

canvas.width = document.querySelector('.page-content').scrollWidth

let canvasCtx = canvas.getContext('2d')
let audioCtx = new AudioContext()

let source = audioCtx.createMediaElementSource(audio)
let analyser = audioCtx.createAnalyser()

source.connect(analyser)
analyser.connect(audioCtx.destination)
analyser.fftSize = 256

let buffer = new Uint8Array(analyser.frequencyBinCount)

let draw = () => {
    let width = canvas.scrollWidth / 128
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
    canvasCtx.fillStyle = '#20d6b5'
    let x = 0
    for(let i = 0 ; i < buffer.length; i ++) {
        let height = buffer[i]
        canvasCtx.fillRect(x, canvas.height - height, width, height)

        x += width
    }
}

let updateFrame = () => {
    requestAnimationFrame(updateFrame)
    analyser.getByteFrequencyData(buffer)
    draw()
}

file.onchange = () => {
    let audioFile = file.files[0]
    audio.src = URL.createObjectURL(audioFile)
    audio.load()
}

audio.onplay = updateFrame