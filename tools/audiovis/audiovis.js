let bezier = (points, precision) => {
    let getPascalTriangleRow = row => {
        let triangle = [];
        if (row == 0) return [1];
        triangle[0] = triangle[1] = 1;
        for (let i = 3; i <= row; i++) {
            let r = [];
            for (let j = 0; j < i - 1; j++) {
                r[j] = triangle[j];
            }
            triangle[0] = triangle[i - 1] = 1;
            for (let j = 0; j < i - 2; j++) {
                triangle[j + 1] = r[j] + r[j + 1];
            }
        }
        return triangle;
    };

    let result = [];
    let pointsNumber = points.length;
    let pascalRow = getPascalTriangleRow(pointsNumber);
    for (let i = 0; i < precision; i++) {
        let t = i / precision;
        let tmpX = 0;
        let tmpY = 0;
        for (let j = 0; j < pointsNumber; j++) {
            tmpX +=
                Math.pow(1 - t, pointsNumber - j - 1) *
                points[j][0] *
                Math.pow(t, j) *
                pascalRow[j];
            tmpY +=
                Math.pow(1 - t, pointsNumber - j - 1) *
                points[j][1] *
                Math.pow(t, j) *
                pascalRow[j];
        }
        result.push([tmpX, tmpY]);
    }
    return result;
};

window.addEventListener(
    'load',
    () => {
        let file = document.querySelector('input');
        let canvas = document.querySelector('canvas');
        let audio = document.querySelector('audio');
        let aqAudio = document.querySelector('aq-audio');

        let audioCtx
        let source
        let analyser
        let buffer

        let inited = false

        file.onchange = () => {
            let audioFile = file.files[0];
            aqAudio.src = URL.createObjectURL(audioFile);
            aqAudio.audioTitle = audioFile.name;
            aqAudio.audioElement.load();

            if(inited == false) {
                audioCtx = new AudioContext();
                source = audioCtx.createMediaElementSource(audio);
                analyser = audioCtx.createAnalyser();

                source.connect(analyser);
                analyser.connect(audioCtx.destination);
                analyser.fftSize = 128;
                buffer = new Uint8Array(analyser.frequencyBinCount);

                inited == true
            }
        };

        canvas.width =
            document.querySelector('.page-content').scrollWidth *
            devicePixelRatio;
        canvas.height = 256 * devicePixelRatio;

        let canvasCtx = canvas.getContext('2d');

        let gainArr = bezier(
            [
                [0, 0],
                [0.8, 0.2],
                [1, 0.05],
                [1, 1],
            ],
            256
        ).map(i => i[1]);
        let segment = 1 / 256;
        let gainFunc = n => {
            let index = Math.floor(n / 255 / segment);
            if (index < 0 || index > 255) return n;
            else return (gainArr[index] / (n / 255)) * n;
        };

        let draw = () => {
            let width = canvas.width / 64;
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            canvasCtx.fillStyle = '#20d6b5';
            let x = 0;
            for (let i = 0; i < buffer.length; i++) {
                let height = gainFunc(buffer[i]) * devicePixelRatio;
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
    },
    { once: true }
);
