/**
 * @fires step
 * @fires complete
 */
export class GameEvent extends EventTarget {
    /**
     * 
     * @param {string} id 
     */
    constructor(id) {
        super();
        /**@type {string} */
        this.id = id;
        /**
         * A list of steps to be executed in order.
         * @type {Array<import("./event").EventAction>}
         */
        this.sequence = []
        /**@type {import("./event").EventCondition} */
        this.condition = {}
        this.languageMap = {}
        /**@type {Array<import("./event").EventReward>} */
        this.rewards = []
        /**@type {boolean} */
        this.repeatable = false
    }

    #currentStep = 0

    /**
     * @param {string} name 
     * @param {string} text 
     * @param {string} icon 
     */
    dialog(name, text, icon) {
        this.sequence.push({type: 'dialog', data: {name, text, icon}})
    }

    /**
     * @param {string} text 
     */
    text(text) {
        this.sequence.push({type: 'text', data: text})
    }

    wait(condition) {

    }

    play() {
        if (this.#currentStep >= this.sequence.length) {
            return
        }
        else {
            if(this.#currentStep == 0) {
                this.dispatchEvent(new CustomEvent('start', {detail: this.id}))
            }
            const step = this.sequence[this.#currentStep]
            this.dispatchEvent(new CustomEvent('step', {detail: step}))
            this.#currentStep++
            if(this.#currentStep == this.sequence.length) {
                this.dispatchEvent(new CustomEvent('complete', {detail: this.rewards}))
            }
        }
    }

    terminate() {
        this.#currentStep = 0
    }

    lang(map) {
        for (const key in map) {
            let oldMap = window.aqLanguageMap[key]
            if (oldMap) {
                for (const lang in map[key]) {
                    oldMap[lang] = map[key][lang]
                }
            }
            else {
                window.aqLanguageMap[key] = map[key]
            }
        }
    }
}