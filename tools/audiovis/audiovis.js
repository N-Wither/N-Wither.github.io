window.addEventListener('load', () => {
    let file = document.querySelector('input');
    let canvas = document.querySelector('canvas');
    let audio = document.querySelector('aq-audio').audioElement;
    let aqAudio = document.querySelector('aq-audio');
    // console.log(audio)
    // aqAudio.audioElement = audio
    file.onchange = () => {
        let audioFile = file.files[0];
        aqAudio.src = URL.createObjectURL(audioFile);
        aqAudio.audioTitle = audioFile.name;
        aqAudio.audioElement.load();
    };

    canvas.width =
        document.querySelector('.page-content').scrollWidth * devicePixelRatio;
    canvas.height = 256 * devicePixelRatio;

    let canvasCtx = canvas.getContext('2d');
    let audioCtx = new AudioContext();

    let source = audioCtx.createMediaElementSource(audio);
    let analyser = audioCtx.createAnalyser();

    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 128;

    let buffer = new Uint8Array(analyser.frequencyBinCount);

    let draw = () => {
        let width = canvas.width / 64;
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.fillStyle = '#20d6b5';
        let x = 0;
        for (let i = 0; i < buffer.length; i++) {
            let height = buffer[i] * devicePixelRatio;
            canvasCtx.fillRect(x, canvas.height - height, width, height);

            x += width;
        }
    };

    let updateFrame = () => {
        requestAnimationFrame(updateFrame);
        analyser.getByteFrequencyData(buffer);
        draw();
    };

    audio.onplay = updateFrame;
}, {once: true});
