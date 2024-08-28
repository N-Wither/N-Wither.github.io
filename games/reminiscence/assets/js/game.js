/// <reference path="../../../../_typings/index.d.ts" />
/// <reference path="./game.d.ts" />

import { LitElement, html } from 'https://esm.sh/lit@3.2.0';
import style from './game.style.js'
import { createLocalizer } from '/web-components/aqv2/lib/localize.js';
import { GameData, defaultData } from './game-data.js'
import { gameEvents } from './events/events.js'
import { createElement, compareObjects, includes } from './utils.js';
import { itemProperties } from './items.js';
import { createElement as el } from '../../../../assets/js/aquery/dom.js'

import './components/inventory-item.js'
import './components/recipe-item.js'
import './components/purchase-item.js'
import '/web-components/aqv2/components/minicard.js'
import '/web-components/aqv2/components/translate.js'
import '/web-components/aqv2/components/icon.js'
import '/web-components/aqv2/components/tooltip.js'
import '/web-components/aqv2/components/tab.js'
import '/web-components/aqv2/components/snackbar.js'

class ReminiscenceGame extends LitElement {
    static get styles() {
        return [style];
    }

    static properties = {
        currentData: { state: true },
    };

    constructor() {
        super();
        this.currentData = {};
    }

    render() {
        return html`
            <link rel="stylesheet" href="/assets/css/aquamarinev2/global.css" />
            <link rel="stylesheet" href="/assets/css/aquamarinev2/input.css" />
            <link rel="stylesheet" href="/assets/css/aquamarinev2/button.css" />
            <link rel="stylesheet" href="/assets/css/themes/violite/global.css" />
            <div class="base">
                <div class="scene">
                    <dialog class="title-screen" open>
                        <div class="title-wrapper">
                            <h1>Reminiscence</h1>
                            <button class="btn-regular" @click=${this.#startNewGame}><aq-ts key="ui.newGame"></aq-ts></button>
                            <button class="btn-regular" @click=${() => {aqSnackbar(this.#localize('message.system.guiNotAvailable'));}}><aq-ts key="ui.loadGame"></aq-ts></button>
                            <button
                                class="btn-regular"
                                @click=${() => {
                                    aqSnackbar(this.#localize('message.system.notImplemented'));
                                }}
                            >
                                <aq-ts key="ui.settings">Settings</aq-ts>
                            </button>
                        </div>
                        <div style="text-align: center;">
                            <aq-ts key='message.system.alphaVersion'></aq-ts>
                        </div>
                    </dialog>
                    <dialog class="saves-screen"></dialog>
                    <dialog class="game-screen">
                        <div class="game-data-display">
                            <div>
                                <aq-ts key="ui.day"></aq-ts><span>:${this.currentData?.day ?? 0}</span>
                                ${this.currentData?.flags?.firstDayCompleted
                                    ? html`<button
                                          class="btn-regular"
                                          @click=${() => {
                                              this.#dayLapse();
                                          }}
                                          ?disabled=${this.currentData?.ongoingEvent != null}
                                      >
                                          <aq-ts key="ui.nextDay"></aq-ts>
                                      </button>`
                                    : ''}
                            </div>
                            <div>
                                <aq-ts key="ui.time"></aq-ts>:<aq-ts key=${`ui.time.${this.currentData?.time ?? ''}`}></aq-ts>
                                ${this.currentData?.flags?.firstDayCompleted
                                    ? html`<button
                                          class="btn-regular"
                                          @click=${() => {
                                              this.#timeLapse();
                                          }}
                                          ?disabled=${this.currentData?.ongoingEvent != null}
                                      >
                                          <aq-ts key="ui.nextTime"></aq-ts>
                                      </button>`
                                    : ''}
                            </div>
                            <div><aq-ts key="ui.money"></aq-ts><span>:${this.currentData?.money ?? 0}</span></div>
                            <div><aq-ts key="ui.fame"></aq-ts><span>:${this.currentData?.fame?.toFixed(1) ?? 0}</span></div>
                        </div>
                        <hr />
                        <details open>
                            <summary>
                                <h2><aq-ts key="ui.inventory"></aq-ts></h2>
                            </summary>
                            <details open>
                                <summary>
                                    <h3><aq-ts key="ui.ingredients"></aq-ts></h3>
                                </summary>
                                <div class="inventory">${this.#renderInventory('ingredient')}</div>
                            </details>
                            <details open>
                                <summary>
                                    <h3><aq-ts key="ui.products"></aq-ts></h3>
                                </summary>
                                <div class="inventory">${this.#renderInventory('product')}</div>
                            </details>
                        </details>
                        <hr />
                        <details open>
                            <summary>
                                <h2><aq-ts key="ui.recipes"></aq-ts></h2>
                            </summary>
                            <div class="recipes" @craft=${this.#handleCrafting}>${this.#renderRecipes()}</div>
                        </details>
                        <hr />
                        <details>
                            <summary>
                                <h2><aq-ts key="ui.purchase"></aq-ts></h2>
                            </summary>
                            <div class="purchase" @purchase=${this.#handlePurchase}>${this.#renderPurchase()}</div>
                        </details>
                    </dialog>
                </div>
                <div class="console-wrapper">
                    <div class="console"></div>
                    ${this.currentData?.ongoingEvent
                        ? html`<div class="click-to-continue"><aq-ts key="message.system.clickToContinue"></aq-ts></div>`
                        : ''}
                    <div class="input-wrapper">
                        <textarea class="input" @keydown=${this.console.handleKeyDown}></textarea>
                        <aq-tooltip>
                            <button class="submit" @click=${this.#handleConsoleSubmit}><aq-icon name="check"></aq-icon></button>
                            <div slot="tooltip">
                                <aq-ts key="console.submit">Submit</aq-ts>
                            </div>
                        </aq-tooltip>
                    </div>
                </div>
            </div>
        `;
    }

    /**@type {HTMLDivElement} */
    get #console() {
        return this.shadowRoot.querySelector('.console');
    }
    /**@type {HTMLTextAreaElement} */
    get #consoleInput() {
        return this.shadowRoot.querySelector('.console-wrapper .input');
    }
    /**@type {HTMLDialogElement} */
    get #titleScreen() {
        return this.shadowRoot.querySelector('.title-screen');
    }
    /**@type {HTMLDialogElement} */
    get #savesScreen() {
        return this.shadowRoot.querySelector('.saves-screen');
    }
    /**@type {HTMLDialogElement} */
    get #gameScreen() {
        return this.shadowRoot.querySelector('.game-screen');
    }
    /**@type {HTMLDivElement} */
    get #recipeSection() {
        return this.shadowRoot.querySelector('.recipes');
    }

    #defaultData = {
        day: 0,
        time: 2,
        money: 2000,
        fame: 0,
        ongoingEvent: null,
        completedEvents: [],
        inventory: {
            flour: 20,
            sugar: 10,
            egg: 10,
            butter: 10,
        },
        shelf: {},
        recipes: {
            whiteBread: true,
        },
        flags: {},
    };

    #currentSlot = 0;

    firstUpdated() {
        super.firstUpdated();
        this.console.put(this.#localize('message.system.inited'));

        let data = GameData.getData();
        this.currentData = data;
        if (data == null) GameData.saveData(defaultData);

        this.#autoLoad()
    }

    console = {
        put: (...data) => {
            let div = document.createElement('div');
            data.forEach(item => {
                if (item instanceof Node == false) {
                    div.innerHTML = item;
                } else {
                    div.appendChild(item);
                }
                this.#console.appendChild(div);
            });
            while (this.#console.childElementCount > 255) {
                this.#console.removeChild(this.#console.firstChild);
            }
            this.#console.scrollTo({ top: this.#console.scrollHeight, behavior: 'smooth' });
        },
        clear: () => {
            this.#console.innerHTML = '';
        },
        handleKeyDown: e => {
            if (e.key == 'Enter') {
                this.#handleConsoleInput(this.#consoleInput.value);
                e.preventDefault();
            }
        },
    };

    /**
     * @param {string} data
     */
    #handleConsoleInput(data) {
        if (data.startsWith('help')) {
            this.console.put(this.#localize('help.title'));
            this.console.put(this.#localize('help.command.help'));
            this.console.put(this.#localize('help.command.clear'));
            this.console.put(this.#localize('help.command.settings'));
            this.console.put(this.#localize('help.command.save'));
            this.console.put(this.#localize('help.command.load'));
            this.console.put(this.#localize('help.command.delete'));
        } else if (data.trim() == 'clear') {
            this.console.clear();
        } else if (data.trim() == 'settings') {
            this.console.put(this.#localize('message.system.notImplemented'));
        } else if (data.trim().startsWith('save')) {
            let slot = Number(data.split(' ')[1]);
            if (slot >= 0 && slot <= 4 && Number.isInteger(slot)) {
                this.#saveGame(slot);
                this.console.put(this.#localize('message.system.saved') + `${slot}`);
            } else {
                this.console.put(this.#localize('message.system.invalidSlot'));
            }
        } else if (data.trim().startsWith('load')) {
            let slot = Number(data.split(' ')[1]);
            // console.log(`try load game in slot ${slot}`);
            if (slot >= 0 && slot <= 4 && Number.isInteger(slot)) {
                let isNewGame = this.#loadGame(slot);
                if (isNewGame == false) {
                    this.console.put(this.#localize('message.system.loaded'));
                }
            } else {
                this.console.put(this.#localize('message.system.invalidSlot'));
            }
        } else if (data.trim().startsWith('delete')) {
            let slot = Number(data.split(' ')[1]);
            if (slot >= 0 && slot <= 4 && Number.isInteger(slot)) {
                GameData.setItem(`saves.${slot}`, {});
                this.console.put(this.#localize('message.system.deletedSave') + `${slot}`);
            } else {
                this.console.put(this.#localize('message.system.invalidSlot'));
            }
        } else {
            this.console.put(this.#localize('message.system.invalidCommand'));
        }
        this.#consoleInput.value = '';
    }

    #handleConsoleSubmit() {
        let input = this.#consoleInput.value.trim();
        this.#handleConsoleInput(input);
    }

    #startNewGame() {
        this.#titleScreen.close();
        this.currentData = structuredClone(this.#defaultData);
        this.#saveGame(0);
        this.#gameScreen.show();
        this.console.clear();

        this.#listenToEvents();
        this.#checkEventConditions();
    }

    /**
     * @param {0 | 1 | 2 | 3 | 4} slot
     */
    #saveGame(slot) {
        GameData.setItem(`saves.${slot}`, this.currentData);
    }

    #loadGame(slot) {
        GameData.setItem('autoLoad', slot);
        location.reload();
        // let data = GameData.getItem(`saves.${slot}`);
        // if(Object.keys(data).length > 0) {
        //     if(this.#currentSlot == slot){
        //         this.console.put(this.#localize('message.system.slotAlreadyLoaded'))
        //         return
        //     }
        //     if(this.currentData?.ongoingEvent != null) {
        //         this.console.put(this.#localize('message.system.eventRunning'))
        //         return
        //     }
        //     this.currentData = compareObjects(this.#defaultData, data)
        //     if(this.#gameScreen.open == false) {
        //         this.#gameScreen.show()
        //     }
        //     this.#titleScreen.close()
        //     this.console.clear()
        //     gameEvents.forEach(event => event.terminate())
        //     this.#currentSlot = slot
        //     return false
        // }
        // else {
        //     if(this.#currentSlot == slot){
        //         this.console.put(this.#localize('message.system.slotAlreadyLoaded'))
        //         return
        //     }
        //     this.#startNewGame()
        //     this.console.put(this.#localize('message.system.noSaveFound'))
        //     this.#currentSlot = slot
        //     return true
        // }
    }

    #autoLoad() {
        let autoLoad = GameData.getItem('autoLoad');
        if (autoLoad != null) {
            let data = GameData.getItem(`saves.${autoLoad}`);
            if (Object.keys(data).length > 0) {
                this.currentData = compareObjects(this.#defaultData, data);
                if (this.#gameScreen.open == false) {
                    this.#gameScreen.show();
                }
                this.#titleScreen.close();
                this.console.clear();
                this.#currentSlot = autoLoad;
                GameData.setItem('autoLoad', null);
                return false;
            } else {
                this.#startNewGame();
                this.console.put(this.#localize('message.system.noSaveFound'));
                this.#currentSlot = autoLoad;
                GameData.setItem('autoLoad', null);
                return true;
            }
        }
    }

    /**
     *
     * @param {string} path
     * @param {'string' | 'number' | 'boolean'} as
     */
    #getCurrentDataItem(path, as = 'string') {
        let data = this.currentData;
        let keys = path.split('.');
        let result = data;
        for (let i = 0; i < keys.length; i++) {
            if (result == null) return null;
            if (result[keys[i]] == null) return null;
            result = result[keys[i]];
        }
        switch (as) {
            case 'string':
                result = String(result) || '';
                break;
            case 'number':
                result = isNaN(Number(result)) ? 0 : Number(result);
                break;
            case 'boolean':
                result = Boolean(result) || false;
                break;
            default:
                result = result || null;
                break;
        }
        return result;
    }

    #setCurrentDataItem(path, value) {
        let data = this.currentData;
        let keys = path.split('.');
        let result = data;
        for (let i = 0; i < keys.length - 1; i++) {
            if (result[keys[i]] == null) result[keys[i]] = {};
            result = result[keys[i]];
        }
        result[keys[keys.length - 1]] = value;
        this.requestUpdate();
    }

    #createDialogItem(name, text, icon) {
        let item = el('aq-minicard').get();
        let header = el('aq-ts').attr('key', name).attr('slot', 'header').get();
        let content = el('aq-ts').attr('key', text).get();

        item.appendChild(header);
        item.appendChild(content);
        if (icon) {
            item.icon = icon;
        }
        return item;
    }

    #listenToEvents() {
        gameEvents.forEach(event => {
            event.addEventListener('start', e => {
                this.console.put(createElement('hr'));
                this.requestUpdate();
            });
            event.addEventListener('step', e => {
                /**@type {import('./event.js').EventAction} */
                let step = e.detail;
                // console.log(step);
                switch (step.type) {
                    case 'dialog': {
                        this.console.put(this.#createDialogItem(step.data.name, step.data.text, step.data.icon));
                        break;
                    }
                    case 'text': {
                        this.console.put(createElement('aq-ts').attribute('key', step.data));
                        break;
                    }
                    default: {
                        throw new Error(`Invalid event step type: ${step.type}`);
                    }
                }
                this.#console.addEventListener(
                    'click',
                    () => {
                        event.play();
                    },
                    { once: true }
                );
                this.requestUpdate();
            });
            event.addEventListener('complete', e => {
                /**@type {import('./event.js').EventReward[]} */
                let rewards = e.detail;
                rewards.forEach(reward => {
                    switch (reward.type) {
                        case 'item': {
                            let count = this.#getCurrentDataItem(`inventory.${reward.data.item}`, 'number');
                            this.#setCurrentDataItem(`inventory.${reward.data.item}`, count + reward.data.count);
                            break;
                        }
                        case 'flag': {
                            this.#setCurrentDataItem(`flags.${reward.data.flag}`, reward.data.value);
                            break;
                        }
                        case 'money': {
                            let money = this.#getCurrentDataItem('money', 'number');
                            this.#setCurrentDataItem('money', money + reward.data.amount);
                            break;
                        }
                        case 'recipe': {
                            this.#setCurrentDataItem(`recipes.${reward.data.recipe}`, true);
                            break;
                        }
                        case 'fame': {
                            let fame = this.#getCurrentDataItem('fame', 'number');
                            this.#setCurrentDataItem('fame', fame + reward.data.fame);
                            break;
                        }
                        default: {
                            throw new TypeError(`Invalid event reward type: ${reward.type}`);
                        }
                    }
                });
                if (this.currentData.completedEvents.includes(event.id) == false) {
                    this.currentData.completedEvents.push(event.id);
                }
                this.console.put(createElement('hr'));
                this.currentData.ongoingEvent = null;
                this.#checkEventConditions();
                this.requestUpdate();
            });
        });
    }

    #checkEventConditions() {
        gameEvents.forEach(event => {
            console.debug(`Checking event condition: ${event.id}`);
            if (this.currentData.completedEvents.includes(event.id) && event.repeatable == false) {
                console.debug(`Event condition not met: ${event.id}, because it's already completed and not repeatable.`);
                return;
            }

            let data = this.currentData;
            let condition = event.condition;
            let isEventStartable = false;
            let flags = [];

            if (Object.keys(condition).length == 0) isEventStartable = true;

            if ('day' in condition) {
                console.debug(`Checking event condition: ${event.id}, day requied ${condition.day}, current day ${data?.day}`);
                if (data?.day >= condition.day) {
                    flags.push(true);
                } else flags.push(false);
            }
            if ('time' in condition) {
                if (data?.time == condition.time) {
                    flags.push(true);
                } else flags.push(false);
            }
            if ('hasItem' in condition) {
                let items = condition.hasItem;
                let allExists = items.every(item => data?.inventory?.[item.item] && data?.inventory?.[item.item] >= item.count);
                if (allExists) {
                    flags.push(true);
                } else flags.push(false);
            }
            if ('eventCompleted' in condition) {
                let targets = condition.eventCompleted;
                let allCompleted = targets.every(target => data.completedEvents.includes(target));
                if (allCompleted) {
                    flags.push(true);
                } else flags.push(false);
            }

            if (flags.every(f => f == true) || flags.length == 0) isEventStartable = true;
            if (data.completedEvents.includes(event.id) && event.repeatable == false) isEventStartable = false;

            if (isEventStartable && this.currentData.ongoingEvent == null && this.currentData.completedEvents.includes(event.id) == false) {
                event.play();
                this.currentData.ongoingEvent = event.id;
            }
        });
    }

    #dayLapse(count = 1) {
        this.currentData.day += count;
        this.#sellByTime(3 - this.currentData.time);
        this.currentData.time = 0;
        this.#checkEventConditions();
        this.requestUpdate();
    }

    #timeLapse(count = 1) {
        let time = this.currentData.time;
        if (time == 2) {
            this.#dayLapse();
        } else {
            this.currentData.time += count;
        }
        this.#sellByTime();
        this.#checkEventConditions();
        this.requestUpdate();
    }

    #renderInventory(filter) {
        let itemList = Object.keys(this.currentData.inventory ?? {}).sort();
        if (itemList.length == 0) {
            return html`<aq-ts key="ui.emptyInventory"></aq-ts>`;
        } else {
            if (filter == undefined) {
                return html`${itemList.map(
                    item => html`<inventory-item item=${item} count=${this.currentData.inventory[item]}></inventory-item>`
                )}`;
            } else {
                let filteredItems = itemList.filter(item => itemProperties[item].tag.includes(filter));
                if (filteredItems.length == 0) {
                    return html`<aq-ts key="ui.emptyInventory"></aq-ts>`;
                }
                return html`
                    ${filteredItems.map(
                        item => html`<inventory-item item=${item} count=${this.currentData.inventory[item]}></inventory-item>`
                    )}
                `;
            }
        }
    }

    #renderRecipes() {
        let recipeList = Object.keys(this.currentData?.recipes ?? {});
        if (recipeList.length == 0) {
            return html`<aq-ts key="ui.emptyRecipes"></aq-ts>`;
        } else {
            return html`${recipeList.map(item =>
                el('recipe-item').prop('recipe', itemProperties[item].recipe).prop('item', item).get()
            )}`;
        }
    }

    #renderPurchase() {
        let itemList = Object.keys(itemProperties).filter(item => itemProperties[item].tag.includes('ingredient')).sort();
        return html`${itemList.map(item => html`<purchase-item item=${item} price=${itemProperties[item].price}></purchase-item>`)}`;
    }

    #sellByTime(time = 1) {
        if (this.currentData.day == 0) return;
        for (let i = 0; i < time; i++) {
            let fame = this.currentData.fame;
            let itemList = Object.keys(this.currentData?.inventory ?? {});
            let sellableItems = itemList.filter(item => itemProperties[item].tag.includes('product'));
            sellableItems.forEach(item => {
                let stockedCount = this.currentData.inventory[item];
                let sellCount = Math.min(stockedCount, Math.ceil(fame * stockedCount));
                if (sellCount == 0) return;
                this.console.put(
                    `${this.#localize('message.game.sold_')} ${this.#localize(`item.${item}`)} × ${sellCount}，${this.#localize(
                        'message.game.earned_'
                    )} ${sellCount * itemProperties[item].price}`
                );
                this.#setCurrentDataItem(`inventory.${item}`, stockedCount - sellCount);
                this.currentData.fame += sellCount * 0.003;
                this.currentData.money += sellCount * itemProperties[item].price;
            });
        }
    }

    /**@param {CustomEvent} e */
    #handleCrafting(e) {
        let recipe = e.target.recipe;
        let item = e.target.item;
        let count = e.detail.count;
        let craftCount = itemProperties[item]?.craftCount ?? 1;
        let inventory = this.currentData.inventory;
        let ingredientList = Object.keys(recipe);
        let canCraft = ingredientList.every(ingr => inventory?.[ingr] >= recipe[ingr] * count);
        if (canCraft) {
            this.#setCurrentDataItem(`inventory.${e.target.item}`, (inventory?.[e.target.item] ?? 0) + count * craftCount);
            ingredientList.forEach(ingr => {
                this.#setCurrentDataItem(`inventory.${ingr}`, (inventory?.[ingr] ?? 0) - recipe[ingr] * count);
            });
            this.#checkEventConditions();
            this.requestUpdate();
        } else {
            aqSnackbar(this.#localize('message.game.notEnoughIngredient'));
        }
    }

    /**@param {CustomEvent} e */
    #handlePurchase(e) {
        let item = e.target.item;
        let price = itemProperties[item].price;
        let count = e.detail.count * itemProperties[item].buyCount;
        let sum = price * count;
        if (this.currentData.money >= sum) {
            this.currentData.money -= sum;
            this.#setCurrentDataItem(`inventory.${item}`, (this.currentData.inventory?.[item] ?? 0) + count);
            this.#checkEventConditions();
            this.requestUpdate();
        }
    }
    /**@type {(key: string, fallback: string) => string} */
    #localize = createLocalizer(window.aqLanguageMap);
}

customElements.define('reminiscence-game', ReminiscenceGame);