import { css } from 'https://esm.sh/lit@3.2.0';

export const dialogStyles = css`
dialog {
    background: var(--background-color);
    color: inherit;
    border: none;
    box-shadow: 0px 4px 8px var(--shadow-color);
    min-width: 24em;
    min-height: 12em;
    padding: 2em 1em;
    max-width: 80vw;
    overflow: auto;
    transition-duration: var(--transition-time-common);
    transition-behavior: allow-discrete;
    display: none;
    opacity: 0;
    translate: 0 30%;
}

dialog:open {
    opacity: 1;
    translate: 0 0;
    display: block;

    @starting-style {
        opacity: 0;
        translate: 0 30%;
    }
}

dialog::backdrop {
    animation: backdrop-animation forwards var(--transition-time-common);
}

.close {
    background: var(--button-bg);
    color: inherit;
    font-family: inherit;
    transition: var(--transition-time-common);
    position: absolute;
    right: 0;
    top: 0;
    width: 1.4em;
    height: 1.4em;
    font-size: 1.2em;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close:is(:hover, :focus){
    background: var(--color-danger);
}

@keyframes backdrop-animation {
    0% {backdrop-filter: brightness(1) blur(0);}
    100% {backdrop-filter: brightness(80%) blur(4px);}
}
@keyframes backdrop-animation-closing {
    0% {backdrop-filter: brightness(80%) blur(4px);}
    100% {backdrop-filter: brightness(1) blur(0);}
}

dialog.closing::backdrop {
    animation: backdrop-animation-closing forwards var(--transition-time-common);
}
`