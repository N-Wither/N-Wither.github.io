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
}

:host {
    --header-background-filter: blur(0.1rem);
}

.base {
    display: grid;
    grid-template-columns: auto 1fr auto;
    transition: var(--transition-time-common);
    position: relative;
    width: 100%;
    backdrop-filter: var(--header-background-filter);
}

nav-menu {
    display: none;
}

.category {
    display: flex;
    height: var(--header-height);
    padding-inline-start: 1em;
}

.button-area {
    height: var(--header-height);
    display: flex;
}

.nav-widescreen {
    padding-inline-start: 1em;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.nav-widescreen .item {
    display: flex;
    color: var(--text-color);
    text-decoration: none;
    height: 100%;
    align-items: center;
    padding-inline: 0.4em;
    transition: var(--transition-time-common);
}

.nav-widescreen .item:is(:hover, :focus){
    color: var(--text-color-contrast);
}

.button-area a {
    background: none;
}

.button-area a::before {
    display: none;
}

/** On Mobile Devices */
@media screen and (max-width: 800px) {
    .nav-widescreen {
        display: none;
    }

    .category {
        padding-inline-start: 0.4em;
    }

    nav-menu {
        display: block;
    }
}
`