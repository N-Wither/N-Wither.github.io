import { LitElement } from 'https://esm.sh/lit@3.2.0';

export class AqElement extends LitElement {
    /**
     * A set of all connected instances of this element. Useful when you want to do something to all instances without using `querySelectorAll` (especially for some instances that are nested in shadow roots).
     * @type {Set<AqElement>}
     */
    static connectedInstances = new Set()
    connectedCallback() {
        super.connectedCallback();
        this.constructor.connectedInstances.add(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.constructor.connectedInstances.delete(this);
    }

    /**
     * querySelector
     * @param {string} selector 
     * @returns 
     */
    sl(selector) {
        return this.querySelector(selector);
    }

    /**
     * querySelectorAll
     * @param {string} selector 
     * @returns 
     */
    sla(selector) {
        return this.querySelectorAll(selector);
    }

    /**
     * querySelector in shadowRoot
     * @param {string} selector 
     * @returns 
     */
    sls(selector) {
        if(this.renderRoot != null) {
            return this.renderRoot.querySelector(selector);
        }
        return null;
    }

    /**
     * querySelectorAll in shadowRoot
     * @param {string} selector 
     * @returns 
     */
    slas(selector) {
        if(this.renderRoot != null) {
            return this.renderRoot.querySelectorAll(selector);
        }
        return null;
    }

    rmAttr(name) {
        this.removeAttribute(name);
        return this;
    }

    attr(...args) {
        if(args.length == 1) {
            return this.getAttribute(args[0]);
        }
        else {
            this.setAttribute(args[0], args[1]);
            return this
        }
    }
}