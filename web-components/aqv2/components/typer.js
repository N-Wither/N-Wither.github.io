import { html, css, LitElement } from 'https://esm.sh/lit@3.2.0';

/**
 * A web component that types out text like a typewriter.
 * @fires char-typed
 * @fires typing-complete
 */
export class AqTyper extends LitElement {
    static styles = css`
        :host {
            display: block;
        }
    `;

    static properties = {
        html: { type: Boolean },
    };

    sourceText = '';
    #displayedText = '';
    #isTag = false;
    #currentTag = '';
    #charIndex = 0;
    #timer = null
    /**
     * Whether the source text is HTML.
     */
    html = false;
    /**
     * The typing interval in milliseconds.
     */
    interval = 50;

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.sourceText = this.html ? this.innerHTML : this.textContent;
        this.innerHTML = ''; // Clear the inner content to prevent duplication

        this.sourceText = this.sourceText.trim();
    }

    render() {
        return html`
            <div @click=${this.showImmediately}>
                <slot></slot>
            </div>
        `;
    }

    show() {
        this.typeNextCharacter();
    }

    showImmediately() {
        clearTimeout(this.#timer);
        this.#displayedText = this.sourceText;
        this.innerHTML = this.#displayedText;
        this.#charIndex = this.sourceText.length;
        this.dispatchEvent(new CustomEvent('typing-complete', { detail: this.#displayedText }));
    }

    reload() {
        this.#displayedText = '';
        this.innerHTML = ''
        this.#charIndex = 0
    }

    typeNextCharacter() {
        if (this.#charIndex < this.sourceText.length) {
            const char = this.sourceText.charAt(this.#charIndex);

            if (char == '<') {
                this.#isTag = true;
                this.#currentTag = '<';
            } else if (this.#isTag) {
                this.#currentTag += char;
                if (char == '>') {
                    this.#isTag = false;
                    this.#displayedText += this.#currentTag;
                    this.innerHTML = this.#displayedText;
                }
            } else {
                this.#displayedText += char;
                this.innerHTML = this.#displayedText;
            }

            this.#charIndex++;
            this.dispatchEvent(new CustomEvent('char-typed', { detail: char }));

            if(this.#charIndex + 1 >= this.sourceText.length) {
                this.dispatchEvent(new CustomEvent('typing-complete', { detail: this.#displayedText }));
            }
            
            if(this.#isTag) {
                this.typeNextCharacter()
            } else {
                this.#timer = setTimeout(() => this.typeNextCharacter(), this.interval);
            }
        }
    }
}

customElements.define('aq-typer', AqTyper);
