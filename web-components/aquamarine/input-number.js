const template = `
<label>
    <span part='label'></span>
    <span part='input-wrapper'>
        <input type='number' part='input'>
        <span></span>
    </span>
    <button part='add button' type='button'> + </button>
    <button part='minus button' type='button'> - </button>
</label>
`
const style = 
`
aq-input-number {
    --height: 2em;
    --bg-color: var(--gray-100);
    --disabled-color: var(--gray-300);
    --disabled-text-color: var(--gray-500);
}
.dark-mode aq-input-number {
    --bg-color: var(--gray-800);
    --disabled-color: var(--gray-900);
    --disabled-text-color: var(--gray-700);
}

aq-input-number {
    font-family: inherit;
    transition: 0.2s;
    font-size: 1em;
    height: var(--height);
    display: inline-block;
}

aq-input-number * {
    transition: 0.2s
}

aq-input-number label {
    display: flex;
    height: 100%;
    align-items: center;
    justify-contents: center;
}

aq-input-number [part=label] {
    display: flex;
    align-items: center;
    justify-contents: center;
    height: var(--height);
    margin-right: 0.2em;
}

aq-input-number [part=input] {
    -moz-appearance: textfield;
    font-family: inherit;
    border-radius: 0px;
    border: none;
    padding: 0px 0.2em;
    background-color: var(--bg-color);
    color: var(--text-color);
    height: var(--height);
    min-width: 6em;
    text-align: center;
    position: relative;
}

aq-input-number [part=input]::-webkit-outer-spin-button,
aq-input-number [part=input]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

aq-input-number [part=input]:focus {
    border-color: var(--theme-color);
    box-shadow: 0 0 5px 1px var(--theme-color);
}

aq-input-number [part=input-wrapper] {
    position: relative;
}

aq-input-number [part=input]+span {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0.2em;
    background-color: var(--theme-color);
    z-index: 10;
}
aq-input-number [part=input]:focus+span {
    width: 100%;
}

aq-input-number button {
    font-family: inherit;
    border-radius: 0px;
    border: none;
    height: var(--height);
    width: var(--height);
    background-color: var(--bg-color);
    color: var(--text-color);
}

aq-input-number :is(button:hover, button:focus) {
    background-color: var(--theme-color);
}

aq-input-number button:disabled {
    cursor: not-allowed;
    background-color: var(--disabled-color);
    color: var(--disabled-text-color);
}
`
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)
document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet]

export class AqInputNumber extends HTMLElement {
    constructor(){
        super()
        // No shadow root for better custom stylesheets.
        this.innerHTML = template
        this.inputField = this.querySelector('input')
    }

    connectedCallback(){
        const attrs = {
            value: Number(this.getAttribute('value')) || 0,
            step: Number(this.getAttribute('step')) || 1,
            min: this.getAttribute('min'),
            max: this.getAttribute('max'),
            label: this.getAttribute('label') || '',
        }
        const input = this.querySelector('input')
        const addButton = this.querySelector('button[part="add button"]')
        const minusButton = this.querySelector('button[part="minus button"]')
        this.querySelector('label span').innerHTML = attrs.label

        input.value = attrs.value
        input.step = attrs.step
        if(attrs.min) input.min = attrs.min
        if(attrs.max) input.max = attrs.max
        input.addEventListener(('change'), () => {
            if(attrs.max){
                if(Number(input.value) >= attrs.max){
                    input.value = attrs.max
                    addButton.disabled = true
                }else {
                    addButton.disabled = false
                }
            }
            if(attrs.min) {
                if(Number(input.value) <= attrs.min){
                    input.value = attrs.min
                    minusButton.disabled = true
                }else {
                    minusButton.disabled = false
                }
            }
            if(Number(input.value % attrs.step != 0)){
                input.value = Number(input.value) - (Number(input.value) % attrs.step)
            }
            input.value = Number(input.value)
        })

        addButton.addEventListener('click', () => {
            minusButton.disabled = false
            input.value = (Number(input.value) + attrs.step).toFixed(attrs.step < 1 ? attrs.step.toString().length - 2 : 0)
            if(attrs.max && Number(input.value) > attrs.max){
                input.value = attrs.max
            }
            if(attrs.max && Number(input.value) == attrs.max){
                addButton.disabled = true
            }
        })
        minusButton.addEventListener('click', () => {
            addButton.disabled = false
            input.value = (Number(input.value) - attrs.step).toFixed(attrs.step < 1 ? attrs.step.toString().length - 2 : 0)
            if(attrs.min && Number(input.value) < attrs.min){
                input.value = attrs.min
            }
            if(attrs.min && Number(input.value) == attrs.min){
                minusButton.disabled = true
            }
        })

        if(attrs.max && Number(input.value) >= attrs.max) addButton.disabled = true
        if(attrs.min && Number(input.value) <= attrs.min) minusButton.disabled = true
    }

    get value() {
        return Number(this.inputField.value)
    }
}

window.customElements.define('aq-input-number', AqInputNumber)