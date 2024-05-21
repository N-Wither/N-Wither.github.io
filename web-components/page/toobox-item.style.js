import { css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export let toolboxItemStyle = css`
.activator {
    background: transparent;
    color: inherit;
    font-family: inherit;
    width: var(--toolbox-width);
    height: var(--toolbox-width);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: var(--transition-time-common);
}

.activator:is(:focus, :hover){
    background: var(--accent-color);
    color: var(--text-color-contrast);
}

.activator .icon {
    font-size: 1.6em;
}

::selection {
    color: inherit;
    background-color: color-mix(in srgb, var(--accent-color-dk) 60%, transparent 60%);
}
`