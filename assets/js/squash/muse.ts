/**
 * A lib of musical utilities.
 */
export namespace Muse {
    export const VERSION = '0.2.0';

    export function playSound(url: URL | string) {
        const audio = new Audio(url.toString());
        audio.play();
        return audio;
    }

    /**
     * The map of musical notes and their frequencies.
     */
    export const Note = {
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
    } as const;

    interface OscillatorInfo {
        type: OscillatorType;
        wave?: PeriodicWave;
    }

    export class Synthesizer {
        private context: AudioContext;
        public oscillators: Map<string, OscillatorInfo>;

        constructor() {
            this.context = new AudioContext();
            this.oscillators = new Map();
        }

        public addOscillator(name: string, info: OscillatorInfo) {
            if (info.type == 'custom' && !info.wave) {
                throw new TypeError('Custom oscillators must have a PeriodicWave.');
            }
            this.oscillators.set(name, info);
        }

        public removeOscillator(name: string) {
            const oscillator = this.oscillators.get(name);
            if (oscillator) {
                this.oscillators.delete(name);
            }
        }

        public playNote(freq: number, duration: number) {
            for (const [name, oscillatorInfo] of this.oscillators) {
                const oscillator = this.context.createOscillator();
                oscillator.type = oscillatorInfo.type;
                if (oscillator.type == 'custom') {
                    oscillator.setPeriodicWave(oscillatorInfo.wave as PeriodicWave);
                }
                oscillator.frequency.setValueAtTime(freq, this.context.currentTime);
                oscillator.connect(this.context.destination);
                oscillator.start();
                oscillator.stop(this.context.currentTime + duration);
                oscillator.onended = () => {
                    oscillator.disconnect(); // frees memory
                }
            }
        }
    }

    export async function getMidiInputs() {
        const midiAccess = await navigator?.requestMIDIAccess();
        if(!midiAccess) {
            throw new Error('MIDI access not supported or denied.');
        }
        const devices: MIDIInput[] = [];
        midiAccess.inputs.forEach((input) => {
            devices.push(input);
        });
        return devices;
    }

    export const MidiStatus = {
        NOTE_OFF: 128,
        NOTE_ON: 144,
        POLYPHONIC_KEY_PRESSURE: 160,
        CONTROL_CHANGE: 176,
        PROGRAM_CHANGE: 192,
        CHANNEL_PRESSURE: 208,
        PITCH_BEND_CHANGE: 224,
    } as const;
}

console.log('%c Muse %c v%s ', 'background-color: #130C25; color: #FF1A89; font-size: 24px; font-weight: bold;', 'background-color: #311F56; color: #F4D31F; font-size: 24px;', Muse.VERSION);

globalThis.Muse = Muse;
