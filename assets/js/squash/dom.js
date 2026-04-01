/* eslint-disable @typescript-eslint/no-namespace */
/** Cache map for queried elements */
const queriedElements = new Map();
function parseDomTarget(t) {
    if (typeof t == 'string') {
        return document.querySelector(t);
    }
    else if (t instanceof Element || t instanceof DocumentFragment) {
        return t;
    }
    else if (t instanceof DomWrapper) {
        return t.get();
    }
    else {
        throw new TypeError('Invalid target: ' + t);
    }
}
/**
 * Invalid targets will be ignored.
 * @param c
 */
function parseDomContent(c) {
    const content = Array.isArray(c) ? c : [c];
    return content
        .map((el) => (typeof el == 'string' ? new Text(el) : el instanceof DomWrapper ? el.get() : el instanceof Element ? el : null))
        .filter((e) => e != null);
}
export class DomWrapper {
    element;
    constructor(e) {
        this.element = e;
    }
    static #clearElement = typeof Element.prototype.replaceChildren == 'function'
        ? function (e) {
            e.replaceChildren();
        }
        : function (e) {
            while (e.firstChild) {
                e.removeChild(e.firstChild);
            }
        };
    /** Unwrap the element. */
    get() {
        return this.element;
    }
    prop(name, value) {
        if (arguments.length == 1) {
            return this.element[name];
        }
        else {
            this.element[name] = value;
            return this;
        }
    }
    attr(name, value) {
        if (value === undefined) {
            return this.element.getAttribute(name);
        }
        else if (value === null) {
            this.element.removeAttribute(name);
            return this;
        }
        else {
            this.element.setAttribute(name, value);
            return this;
        }
    }
    removeAttr(name) {
        this.element.removeAttribute(name);
        return this;
    }
    class(className) {
        if (className == undefined) {
            return this.element.className;
        }
        else {
            this.element.className = className;
            return this;
        }
    }
    addClass(className) {
        this.classList.add(className);
        return this;
    }
    removeClass(className) {
        this.classList.remove(className);
        return this;
    }
    toggleClass(className) {
        this.classList.toggle(className);
        return this;
    }
    replaceClass(className, newClassName) {
        this.classList.replace(className, newClassName);
        return this;
    }
    /** Append another child to self. */
    append(element) {
        const e = element instanceof DomWrapper ? element.get() : element;
        this.element.appendChild(e);
        return this;
    }
    /**
     * Append the element to other element.
     * @param target default: `document.body`
     * @returns
     */
    appendTo(target = document.body) {
        parseDomTarget(target)?.appendChild(this.element);
        return this;
    }
    on(event, handler) {
        this.element.addEventListener(event, handler);
        return this;
    }
    text(text) {
        if (text === undefined) {
            return this.element.textContent;
        }
        else {
            this.element.textContent = text;
            return this;
        }
    }
    html(html) {
        if (html === undefined) {
            return this.element.innerHTML;
        }
        else {
            this.element.innerHTML = html;
            return this;
        }
    }
    clear() {
        DomWrapper.#clearElement(this.element);
        return this;
    }
    insertBefore(element) {
        const e = parseDomTarget(element);
        if (e) {
            if (e.parentNode) {
                e.parentNode.insertBefore(this.element, e);
            }
        }
    }
    insertAfter(element) {
        const e = parseDomTarget(element);
        if (e && e.parentNode) {
            if (e.nextSibling) {
                e.parentNode.insertBefore(this.element, e.nextSibling);
            }
        }
    }
    replaceWith(element) {
        this.element.replaceWith(element instanceof DomWrapper ? element.get() : element);
        return this;
    }
    select(selector) {
        return DomUtils.select(selector, this.element);
    }
    $ = this.select;
    selectAll(selector) {
        return DomUtils.selectAll(selector, this.element);
    }
    $$ = this.selectAll;
    style(css) {
        if (css === undefined) {
            if ('style' in this.element) {
                return this.element.style;
            }
            else {
                throw new TypeError('The wrapped element is not a HTMLElement!');
            }
        }
        else {
            if (this.element instanceof HTMLElement) {
                Object.entries(css).forEach(([k, v]) => {
                    //@ts-ignore in this case the element is a HTMLElement, so style exists.
                    const style = this.element.style;
                    style.setProperty(k, v);
                });
            }
            return this;
        }
    }
    remove() {
        this.element.remove();
        return this;
    }
    clone(deep = true) {
        return new DomWrapper(this.element.cloneNode(deep));
    }
    get classList() {
        return this.element.classList;
    }
    get className() {
        return this.element.className;
    }
    set className(c) {
        this.element.className = c;
    }
    get id() {
        return this.element.id;
    }
    set id(id) {
        this.element.id = id;
    }
    /**
     * @throws {TypeError} if the wrapped element is not an `<input>` element.
     */
    get validValue() {
        if (this.element instanceof HTMLInputElement) {
            switch (this.element.type) {
                case 'number': {
                    const max = Number(this.element.max);
                    const min = Number(this.element.min);
                    const step = Number(this.element.step) || 1;
                    let value = this.element.valueAsNumber;
                    value = Number.parseInt((value / step).toString());
                    value = value > max ? max : value < min ? min : value;
                    return Number.isNaN(value) ? min : value;
                }
                case 'text': {
                    const max = this.element.maxLength;
                    return this.element.value.slice(max);
                }
                default: {
                    return this.element.value;
                }
            }
        }
        else
            throw new TypeError('The wrapped element is not an <input> element!');
    }
}
/**
 * An extended array of DomWrappers for bulk operation.
 */
export class DomWrapperArray extends Array {
    constructor() {
        super();
    }
    /**
     * Converts a regular array (or any other iterable set) of `DomWrappers` or `Element` to `DomWrapperArray`.
     */
    static from(arr) {
        const result = new DomWrapperArray();
        for (const w of Array.from(arr).map((e) => (e instanceof DomWrapper ? e.get() : e))) {
            result.push(new DomWrapper(w));
        }
        return result;
    }
    /**
     * Like `filter` but returns a `DomWrapperArray` instead of a regular array.
     */
    pick(predicate) {
        return DomWrapperArray.from(this.filter(predicate));
    }
    on(ev, listener) {
        this.forEach((e) => {
            e.on(ev, listener);
        });
        return this;
    }
    remove() {
        this.forEach((wrapper) => {
            wrapper.remove();
        });
        return this;
    }
    class(className) {
        for (const w of this) {
            w.class(className);
        }
        return this;
    }
    addClass(className) {
        for (const w of this) {
            w.classList.add(className);
        }
        return this;
    }
    toggleClass(className) {
        for (const w of this) {
            w.classList.toggle(className);
        }
        return this;
    }
    removeClass(className) {
        for (const w of this) {
            w.classList.remove(className);
        }
        return this;
    }
    attr(name, value) {
        for (const w of this) {
            w.attr(name, value);
        }
        return this;
    }
    removeAttr(name) {
        for (const w of this) {
            w.attr(name, null);
        }
        return this;
    }
}
/**
 * A set of DOM-related utility functions.
 */
export var DomUtils;
(function (DomUtils) {
    DomUtils.DOMWrapper = DomWrapper;
    DomUtils.DOMWrapperArray = DomWrapperArray;
    function select(selector, from) {
        const source = from == undefined ? document : (parseDomTarget(from) ?? document);
        const e = source.querySelector(selector);
        if (e) {
            return new DomWrapper(e);
        }
        else {
            throw new Error(`Failed to select element with selector "${selector}`);
        }
    }
    DomUtils.select = select;
    DomUtils.$ = select;
    function create(element, content) {
        const e = document.createElement(element);
        if (content) {
            const c = parseDomContent(content);
            e.append(...c);
        }
        return new DomWrapper(e);
    }
    DomUtils.create = create;
    DomUtils.make = create;
    function selectAll(selector, from) {
        const source = from == undefined ? document : (parseDomTarget(from) ?? document);
        const result = new DomWrapperArray();
        Array.from(source.querySelectorAll(selector)).forEach((e) => result.push(new DomWrapper(e)));
        return result;
    }
    DomUtils.selectAll = selectAll;
    DomUtils.$$ = selectAll;
    function selectWith(element, extra, from) {
        if (queriedElements.has(element + extra)) {
            return new DomWrapper(queriedElements.get(element + extra));
        }
        else {
            const result = select(element + extra, from);
            queriedElements.set(element + extra, result.get());
            return result;
        }
    }
    DomUtils.selectWith = selectWith;
    DomUtils.$w = selectWith;
    function deepSelect(selector, from) {
        const source = from == undefined ? document : (parseDomTarget(from) ?? document);
        const treeWalker = document.createTreeWalker(source, NodeFilter.SHOW_ELEMENT);
        while (treeWalker.nextNode()) {
            const current = treeWalker.currentNode;
            if (current.matches(selector)) {
                return new DomWrapper(current);
            }
            if (current.shadowRoot != null) {
                const shadowResult = deepSelect(selector, current.shadowRoot);
                if (shadowResult) {
                    return shadowResult;
                }
            }
        }
        return null;
    }
    DomUtils.deepSelect = deepSelect;
    DomUtils.$d = deepSelect;
    function deepSelectAll(selector, from) {
        const source = from == undefined ? document : (parseDomTarget(from) ?? document);
        const result = [];
        const treeWalker = document.createTreeWalker(source, NodeFilter.SHOW_ELEMENT);
        while (treeWalker.nextNode()) {
            const current = treeWalker.currentNode;
            if (current.matches(selector)) {
                result.push(new DomWrapper(current));
            }
            if (current.shadowRoot != null) {
                const shadowResult = deepSelectAll(selector, current.shadowRoot);
                result.push(...shadowResult);
            }
        }
        return result;
    }
    DomUtils.deepSelectAll = deepSelectAll;
    DomUtils.$$d = deepSelectAll;
    function wrap(input) {
        if (input instanceof Element) {
            return new DomWrapper(input);
        }
        else {
            return DomWrapperArray.from(input);
        }
    }
    DomUtils.wrap = wrap;
    function forAll(selector, callback) {
        const elements = DomUtils.$$(selector);
        for (let i = 0; i < elements.length; i++) {
            callback(elements[i], i, elements);
        }
    }
    DomUtils.forAll = forAll;
})(DomUtils || (DomUtils = {}));
DomUtils.toString = () => '[namespace sQuash.DomUtils]';
Object.defineProperty(DomUtils, Symbol.toStringTag, { value: 'sQuash.DomUtils' });
Object.defineProperty(window, 'DomUtils', { value: DomUtils });
Object.defineProperty(DomUtils, 'new', { value: DomUtils.create });
// If new elements are added or exsiting elements are removed, clear the cache
const mutob = new MutationObserver((muts) => {
    muts.some((mut) => mut.addedNodes.length > 0 || mut.removedNodes.length > 0) && queriedElements.clear();
});
mutob.observe(document.body, { childList: true, subtree: true });
//# sourceMappingURL=dom.js.map