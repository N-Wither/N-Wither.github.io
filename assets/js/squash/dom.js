/** Cache map for queried elements */
const queriedElements = new Map();
/**
 * A set of DOM-related utility functions.
 */
export var DomUtils;
(function (DomUtils) {
    class DomWrapper {
        element;
        constructor(e) {
            this.element = e;
        }
        static #clearElement = typeof Element.prototype.replaceChildren == 'function' ?
            function (e) {
                e.replaceChildren();
            } :
            function (e) {
                while (e.firstChild) {
                    e.removeChild(e.firstChild);
                }
            };
        /** Unwrap the element. */
        get() { return this.element; }
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
            else {
                this.element.setAttribute(name, value);
                return this;
            }
        }
        /** Append another child to self. */
        append(element) {
            let e = element instanceof DomWrapper ? element.get() : element;
            this.element.appendChild(e);
            return this;
        }
        /**
         * Append the element to other element.
         * @param target default: `document.body`
         * @returns
         */
        appendTo(target = document.body) {
            return parseDomTarget(target)?.appendChild(this.element);
        }
        /** Short-hand for `addEventLitsener` */
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
        select(selector) {
            return DomUtils.select(selector, this.element);
        }
        $ = this.select;
        selectAll(selector) {
            return DomUtils.selectAll(selector, this.element);
        }
        $$ = this.selectAll;
        style(css) {
            if (this.element instanceof HTMLElement) {
                Object.entries(css).forEach(([k, v]) => {
                    //@ts-ignore
                    const style = this.element.style;
                    style.setProperty(k, v);
                });
            }
            return this;
        }
        remove() {
            this.element.remove();
        }
        get classList() { return this.element.classList; }
        get className() { return this.element.className; }
        set className(c) { this.element.className = c; }
        get id() { return this.element.id; }
        set id(id) { this.element.id = id; }
    }
    function parseDomTarget(t) {
        if (typeof t == 'string') {
            return document.querySelector(t);
        }
        else if (t instanceof Element) {
            return t;
        }
        else if (t instanceof DomWrapper) {
            return t.get();
        }
        else if (t instanceof DocumentFragment) {
            return t;
        }
        else {
            throw new TypeError('Invalid target: ' + t);
        }
    }
    function parseDomContent(c) {
        const content = Array.isArray(c) ? c : [c];
        return content.map(el => typeof el == 'string' ? new Text(el) :
            el instanceof DomWrapper ? el.get() :
                el instanceof Element ? el : null).filter(e => e != null);
    }
    function select(selector, from) {
        const source = from == undefined ? document : (parseDomTarget(from) ?? document);
        const e = source.querySelector(selector);
        if (e) {
            return new DomWrapper(e);
        }
        else {
            return null;
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
        return Array.from(source.querySelectorAll(selector)).map(e => new DomWrapper(e));
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
})(DomUtils || (DomUtils = {}));
DomUtils.toString = () => '[namespace sQuash.DomUtils]';
Object.defineProperty(DomUtils, Symbol.toStringTag, { value: 'sQuash.DomUtils' });
Object.defineProperty(window, 'DomUtils', { value: DomUtils });
Object.defineProperty(DomUtils, 'new', { value: DomUtils.create });
// If new elements are added or exsiting elements are removed, clear the cache
const mutob = new MutationObserver((muts) => {
    muts.some(mut => mut.addedNodes.length > 0 || mut.removedNodes.length > 0) && queriedElements.clear();
});
mutob.observe(document.body, { childList: true, subtree: true });
//# sourceMappingURL=dom.js.map