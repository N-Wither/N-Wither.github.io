import {css} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export const style = css`
:host {
    position: sticky;
    left: 0;
    top: 0;
    width: 100%;
    height: var(--header-height);
    box-shadow: var(--general-shadow);
    display: flex;
    z-index: 99;
    background-color: var(--header-bg);
    /* backdrop-filter: blur(0.1rem); */
}

slot[name=category] {
    display: flex;
    height: var(--header-height);
}

.base {
    display: flex;
    transition: var(--transition-time-common);
    position: relative;
    width: 100%;
}

.button-area {
    position: absolute;
    right: 0;
    top: 0;
    height: var(--header-height);
    display: flex;
}

.button-area a {
    background: none;
}

.button-area a::before {
    display: none;
}
`