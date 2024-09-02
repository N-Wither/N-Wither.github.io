import { css } from 'https://esm.sh/lit@3.2.0';

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
    line-height: unset;
    transition: var(--transition-time-common);
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
    transition-behavior: allow-discrete;
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
    line-height: 1em;
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

::selection {
    color: inherit;
    background-color: var(--selection-background);
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

/** Varaint: Compact */
:host([variant="compact"]) {
    min-width: var(--header-height);
    width: fit-content;
}

:host([variant="compact"]) .base {
    width: var(--header-height);
}

:host([variant="compact"]) .base:has(.compact:is(:has(.uncompactor:is(:hover, :focus-within)), :hover, :focus-within)) {
    width: 100%
}

:host([variant="compact"]) .nav-widescreen {
    padding-inline-start: 0;
}

:host([variant="compact"]) .nav-widescreen header-button {
    min-width: calc(var(--header-height) + 0.4em);
}

:host([variant="compact"]) :is(.compact, .compacted) {
    display: flex;
}

:host([variant="compact"]) .compact {
    translate: calc(-100% + var(--header-height));
    transition: translate var(--transition-time-common);
}

:host([variant="compact"]) .compact:is(:has(.uncompactor:is(:hover, :focus-within)), :hover, :focus-within) {
    translate: 0;
}

:host([variant="compact"]):hover, :host([variant="compact"]):focus-within {
    translate: 0;
}

:host([variant="compact"]) .uncompactor button {
    background: none;
    border: none;
    color: var(--text-color);
    width: 100%;
    height: 100%;
}

:host([variant="compact"]) .base:has(nav-menu:is(:hover, :focus-within)) .compact {
    translate: 0;
}

@media screen and (max-width: 800px) {
    :host([variant="compact"]) :is(.nav-widescreen, .uncompactor) {
        display: none;
    }

    :host([variant="compact"]) nav-menu {
        z-index: 1;
    }

    :host([variant="compact"]) .compact {
        z-index: 0;
        translate: calc(-100% - var(--header-height));
    }

    :host([variant="compact"]) .base:has(nav-menu:is(:hover, :focus-within)) {
        width: auto;
    }

    @starting-style {
        :host([variant="compact"]) .base {
            width: var(--header-height);
        }
    }
}
`