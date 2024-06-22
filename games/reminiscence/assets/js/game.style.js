import { css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js'

export default css`
:host {
    display: block;

    --console-input-height: 10em;
    --header-height: 0;
}

.base {
    display: grid;
    grid-template-areas: 'scene console';
    grid-template-columns: 70% 30%;
    width: 100vw;
    height: 100vh;
}

.scene {
    grid-area: scene;
    position: relative;
    user-select: none;
}

.scene dialog[open] {
    border: none;
    background-color: transparent;
    width: 100%;
    position: relative;
    overflow: auto;
    max-height: 100%;
    scrollbar-width: thin;
    flex-direction: column;
}

.title-screen[open] {
    display: flex;
}

.title-screen .title-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
}

.game-data-display {
    display: flex;
    align-items: block-start;
    justify-content: space-between;
}

.game-data-display .btn-regular {
    min-width: unset;
}

.game-screen summary {
    cursor: pointer;
    transition: 0.2s;
}

.game-screen summary:is(:hover, :focus) {
    color: var(--accent-color);
}

.game-screen details :is(h2, h3) {
    display: inline;
}

.inventory, .recipes, .shelf, .purchase {
    gap: 0.2em;
    display: flex;
    flex-wrap: wrap;
}

.console-wrapper {
    background-color: var(--background-color-dk);
    padding: 0.2em;
    display: grid;
    grid-template-rows: 1fr auto;
    overflow: hidden;
}

.console {
    max-width: 100%;
    overflow-y: auto;
    user-select: none;
    scrollbar-width: thin;
}

.console hr {
    border-color: var(--text-color);
}

.console aq-minicard {
    margin: 0.2em 0;
    background-color: var(--background-color);
    --aq-minicard_width: 100%;
}

.input-wrapper {
    display: grid;
    position: sticky;
    bottom: 0;
    left: 0;
    grid-template-columns: 1fr auto;
}

.input-wrapper textarea {
    resize: none;
    height: var(--console-input-height);
}

.input-wrapper aq-tooltip button {
    display: block;
    height: var(--console-input-height);
}

/**mobile device */
@media only screen and (max-width: 768px) {
    :host {
        --console-input-height: 5em;
    }

    .base {
        grid-template-areas: 'scene' 'console';
        grid-template-columns: 100%;
        grid-template-rows: 70% 30%;
    }
}
`