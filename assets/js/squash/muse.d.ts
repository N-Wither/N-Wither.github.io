/**
 * A lib of musical utilities.
 */
export declare namespace Muse {
    export const VERSION = "0.2.0";
    export function playSound(url: URL | string): HTMLAudioElement;
    /**
     * The map of musical notes and their frequencies.
     */
    export const Note: {
        readonly C4: 261.63;
        readonly Dm4: 277.18;
        readonly D4: 293.66;
        readonly Em4: 311.13;
        readonly E4: 329.63;
        readonly F4: 349.23;
        readonly Gm4: 369.99;
        readonly G4: 392;
        readonly Am4: 415.3;
        readonly A4: 440;
        readonly Bm4: 466.16;
        readonly B4: 493.88;
    };
    interface OscillatorInfo {
        type: OscillatorType;
        wave?: PeriodicWave;
    }
    export class Synthesizer {
        private context;
        oscillators: Map<string, OscillatorInfo>;
        constructor();
        addOscillator(name: string, info: OscillatorInfo): void;
        removeOscillator(name: string): void;
        playNote(freq: number, duration: number): void;
    }
    export function getMidiInputs(): Promise<MIDIInput[]>;
    export {};
}
