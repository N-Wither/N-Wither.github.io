import {css} from 'https://esm.sh/lit@3.2.0';

export default css`
button {
    font-family: inherit;
    background-color: var(--button-bg);
    border: none;
    transition: var(--transition-time-common);
    color: var(--text-color);
}
button:hover, button:focus {
    background-color: var(--button-bg-focus);
}
.btn-primary {
    min-width: 8rem;
    min-height: 2rem;
    transition: var(--transition-time-common);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.2rem;
    background-color: var(--theme-color-500);
}

.btn-primary:hover, .btn-primary:focus {
    background-color: var(--theme-color-400);
}

.btn-regular {
    min-width: 8rem;
    min-height: 2rem;
    transition: var(--transition-time-common);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.2rem;
}
`