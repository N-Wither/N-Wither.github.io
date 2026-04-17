import { css } from 'https://esm.sh/lit@3.2.0';

export default css`
:host {
    display: flex;
    background-color: var(--background-color);
    max-height: min-content;
    box-shadow: var(--general-shadow);
    margin: 0.5rem;
    align-items: stretch;
}

:host([layout="horizontal"]) {
    flex-direction: row;
}
:host([layout="vertical"]) {
    flex-direction: column;
    width: max-content;
}

:host {
    --cover-size: 6rem;
    --button-size: 2rem;
    --progress-height: 1rem;
}

::selection {
    background-color: var(--selection-background);
    color: inherit;
}

.image-container {
    flex-shrink: 0;
    /* height: var(--cover-size); */
    height: 100%;
    aspect-ratio: 1 / 1;
    max-height: 30rem;
    width: var(--cover-size);
}
:host([layout="vertical"]) .image-container {
    display: flex;
    justify-content: center;
    height: unset;
    width: 100%;
}

.image-container img {
    width: 100%;
    height: 100%;
}
:host([layout="vertical"]) .image-container img {
    width: unset;
}

.controls {
    display: flex;
    flex-direction: column;
    /* grid-template-rows: auto var(--progress-height) auto; */
    width: 100%;
}

.sub {
    font-size: small;
}

.title {
    padding: 0.2em;
    display: flex;
    gap: 1em;
    justify-content: space-between;
}
:host([layout="vertical"]) .title {
    flex-direction: column;
    justify-content: start;
    gap: 0.2rem;
}

.info {
    padding-inline: 0.2rem;
}

.progress-container {
    height: var(--progress-height);
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
:host([layout="vertical"]) .time {
    display: block;
}

.buttons {
    display: flex;
    flex-wrap: wrap;
}

button {
    height: var(--button-size);
    width: var(--button-size);
}

aq-slider {
    padding-inline: 0.4em;
    width: 6em;
}

aq-icon {
    --icon-font-size: 1rem;
}

select {
    padding-block: 0;
    width: 5rem;
}

label.playback-rate {
    display: flex;
    align-items: center;
    margin-inline-end: 0.2rem;
    gap: 0.2rem;
}
`