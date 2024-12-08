import { css } from 'https://esm.sh/lit@3.2.0';

export default css`
:host {
    display: flex;
    background-color: var(--background-color);
    max-height: min-content;
    box-shadow: var(--general-shadow);
    margin: 0.5rem;
}

::selection {
    background-color: var(--selection-background);
    color: inherit;
}

.image-container {
    min-width: 4em;
    height: 4em;
}

.image-container img {
    width: 100%;
    height: 100%;
}

.controls {
    display: grid;
    grid-template-rows: auto 1em 1.6em;
    width: 100%;
}

.title {
    padding: 0.2em;
    display: flex;
    gap: 1em;
}

.progress-container {
    height: 100%;
    background-color: var(--background-color-dk);
    cursor: pointer;
    position: relative;
}

.progress-container:is(:hover, :focus) .progress{
    filter: brightness(110%);
}

.progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background-color: var(--accent-color);
    transition: filter 0.2s, width 0.2s;
}

.progress[holding] {
    transition: filter 0.2s;
}

.time {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-inline: 0.2em;
}

.buttons {
    display: flex;
}

button {
    height: 100%;
}

aq-slider {
    padding-inline: 0.4em;
    width: 6em;
}

aq-icon {
    --icon-font-size: 1rem;
}
`