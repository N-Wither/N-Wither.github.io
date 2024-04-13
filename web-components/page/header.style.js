import {css} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export const style = css`
:host {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: var(--header-height);
    box-shadow: 0px 4px 8px var(--shadow-color);
    display: flex;
    z-index: 99;
    background: var(--header-bg);
    backdrop-filter: blur(5px);
}

slot[name=category] {
    display: flex;
    /* align-items: center;
    justify-content: center; */
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