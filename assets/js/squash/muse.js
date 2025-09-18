/**
 * A lib of musical utilities.
 */
export var Muse;
(function (Muse) {
    Muse.VERSION = '0.2.0';
    function playSound(url) {
        const audio = new Audio(url.toString());
        audio.play();
        return audio;
    }
    Muse.playSound = playSound;
    /**
     * The map of musical notes and their frequencies.
     */
    Muse.Note = {
        C4: 261.63,
        Dm4: 277.18,
        D4: 293.66,
        Em4: 311.13,
        E4: 329.63,
        F4: 349.23,
        Gm4: 369.99,
        G4: 392.0,
        Am4: 415.3,
        A4: 440.0,
        Bm4: 466.16,
        B4: 493.88,
    };
    class Synthesizer {
        context;
        oscillators;
        constructor() {
            this.context = new AudioContext();
            this.oscillators = new Map();
        }
        addOscillator(name, info) {
            if (info.type == 'custom' && !info.wave) {
                throw new TypeError('Custom oscillators must have a PeriodicWave.');
            }
            this.oscillators.set(name, info);
        }
        removeOscillator(name) {
            const oscillator = this.oscillators.get(name);
            if (oscillator) {
                this.oscillators.delete(name);
            }
        }
        playNote(freq, duration) {
            for (const [name, oscillatorInfo] of this.oscillators) {
                const oscillator = this.context.createOscillator();
                oscillator.type = oscillatorInfo.type;
                if (oscillator.type == 'custom') {
                    oscillator.setPeriodicWave(oscillatorInfo.wave);
                }
                oscillator.frequency.setValueAtTime(freq, this.context.currentTime);
                oscillator.connect(this.context.destination);
                oscillator.start();
                oscillator.stop(this.context.currentTime + duration);
            }
        }
    }
    Muse.Synthesizer = Synthesizer;
    async function getMidiInputs() {
        const midiAccess = await navigator?.requestMIDIAccess();
        if (!midiAccess) {
            throw new Error('MIDI access not supported or denied.');
        }
        const devices = [];
        midiAccess.inputs.forEach((input) => {
            devices.push(input);
        });
        return devices;
    }
    Muse.getMidiInputs = getMidiInputs;
})(Muse || (Muse = {}));
console.log('%c Muse %c v%s ', 'background-color: #130C25; color: #FF1A89; font-size: 24px; font-weight: bold;', 'background-color: #311F56; color: #F4D31F; font-size: 24px;', Muse.VERSION);
globalThis.Muse = Muse;
//# sourceMappingURL=muse.js.map