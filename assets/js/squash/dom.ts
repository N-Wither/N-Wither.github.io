/** Cache map for queried elements */
const queriedElements = new Map<string, Element>()

/**
 * A set of DOM-related utility functions.
 */
export namespace DomUtils {
    class DomWrapper<T extends Element = Element> {
        private readonly element: T
        constructor(e: T) {
            this.element = e
        }

        static #clearElement = typeof Element.prototype.replaceChildren == 'function' ? 
            function(e: Element) {
                e.replaceChildren()
            } :
            function(e: Element) {
                while (e.firstChild) {
                    e.removeChild(e.firstChild)
                }
            }

        /** Unwrap the element. */
        get() { return this.element }

        /** Get or set a property. */
        prop<P extends keyof T>(name: P): T[P]
        prop<P extends keyof T>(name: P, value: T[P]): this
        prop<P extends keyof T>(name: P, value?: T[P]) {
            if(arguments.length == 1) {
                return this.element[name]
            } else {
                this.element[name] = value!
                return this
            }
        }

        /** Get or set an attribute. */
        attr(name: string): string | null
        attr(name: string, value: string): this
        attr(name: string, value?: string) {
            if (value === undefined) {
                return this.element.getAttribute(name)
            } else {
                this.element.setAttribute(name, value)
                return this
            }
        }

        /** Append another child to self. */
        append(element: Node | DomWrapper<Element>) {
            let e = element instanceof DomWrapper ? element.get() : element
            this.element.appendChild(e)
            return this
        }

        /**
         * Append the element to other element.
         * @param target default: `document.body`
         * @returns 
         */
        appendTo(target: sQuashDomTarget = document.body) {
            return parseDomTarget(target)?.appendChild(this.element)
        }

        /** Short-hand for `addEventLitsener` */
        on<E extends keyof HTMLElementEventMap>(event: E, handler: (ev: HTMLElementEventMap[E]) => void) {
            this.element.addEventListener(event, handler as EventListenerOrEventListenerObject)
            return this
        }

        /** Get or set the `textContent` of the element. */
        text(): string
        text(text: string): this
        text(text?: string) {
            if(text === undefined) {
                return this.element.textContent
            } else {
                this.element.textContent = text
                return this
            }
        }

        /** Get or set the `innerHTML` of the element. */
        html(): string
        html(html: string): this
        html(html?: string) {
            if(html === undefined) {
                return this.element.innerHTML
            }
            else {
                this.element.innerHTML = html
                return this
            }
        }

        clear() {
            DomWrapper.#clearElement(this.element)
        }

        insertBefore(element: sQuashDomTarget) {
            const e = parseDomTarget(element)
            if (e) {
                if (e.parentNode) {
                    e.parentNode.insertBefore(this.element, e)
                }
            }
        }

        insertAfter(element: sQuashDomTarget) {
            const e = parseDomTarget(element)
            if (e && e.parentNode) {
                if (e.nextSibling) {
                    e.parentNode.insertBefore(this.element, e.nextSibling)
                }
            }
        }

        select<T extends keyof HTMLElementTagNameMap>(selector: T): DomWrapper<HTMLElementTagNameMap[T]>
        select<T extends keyof SVGElementTagNameMap>(selector: T): DomWrapper<SVGElementTagNameMap[T]>
        select(selector: string): DomWrapper<Element>
        select(selector: string): DomWrapper<Element> {
            return DomUtils.select(selector, this.element)
        }

        $ = this.select

        selectAll<T extends keyof HTMLElementTagNameMap>(selector: T): DomWrapper<HTMLElementTagNameMap[T]>[]
        selectAll<T extends keyof SVGElementTagNameMap>(selector: T): DomWrapper<SVGElementTagNameMap[T]>[]
        selectAll(selector: string): DomWrapper<Element>[]
        selectAll(selector: string): DomWrapper<Element>[] {
            return DomUtils.selectAll(selector, this.element)
        }

        $$ = this.selectAll

        style(css: {[property: string]: string}) {
            if (this.element instanceof HTMLElement) {
                Object.entries(css).forEach(([k, v]) => {
                    //@ts-ignore
                    const style: CSSStyleDeclaration = this.element.style
                    style.setProperty(k, v)
                })
            }
            return this
        }

        remove() {
            this.element.remove()
        }

        get classList() { return this.element.classList }
        get className() { return this.element.className }
        set className(c) { this.element.className = c }
        get id() { return this.element.id }
        set id(id) { this.element.id = id }
    }

    type sQuashDomTarget = Element | DomWrapper<Element> | string | DocumentFragment
    type sQuashDomContent = sQuashDomTarget | sQuashDomTarget[]

    function parseDomTarget(t: sQuashDomTarget) {
        if(typeof t == 'string') {
            return document.querySelector(t)
        } else if (t instanceof Element) {
            return t
        } else if (t instanceof DomWrapper) {
            return t.get()
        } else if (t instanceof DocumentFragment) {
            return t
        } else {
            throw new TypeError('Invalid target: ' + t)
        }
    }

    function parseDomContent(c: sQuashDomContent) {
        const content = Array.isArray(c) ? c : [c]
        return content.map(el => 
            typeof el == 'string' ? new Text(el) :
            el instanceof DomWrapper ? el.get() :
            el instanceof Element ? el : null
        ).filter(e => e != null)
    }

    export function select<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>
    export function select<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<SVGElementTagNameMap[T]>
    export function select(selector: string, from?: sQuashDomTarget): DomWrapper<Element>
    export function select(selector: string, from?: sQuashDomTarget) {
        const source = from == undefined ? document : (parseDomTarget(from) ?? document)
        const e = source.querySelector(selector)
        if (e) {
            return new DomWrapper(e)
        } else {
            return null
        }
    }
    
    export const $ = select
    
    export function create<T extends keyof HTMLElementTagNameMap>(element: T, content?: sQuashDomContent): DomWrapper<HTMLElementTagNameMap[T]>
    export function create<T extends keyof SVGElementTagNameMap>(element: T, content?: sQuashDomContent): DomWrapper<SVGElementTagNameMap[T]>
    export function create(element: string, content?: sQuashDomContent): DomWrapper<Element>
    export function create(element: string, content?: sQuashDomContent) {
        const e = document.createElement(element) as Element
        if(content) {
            const c = parseDomContent(content)
            e.append(...c)
        }
        return new DomWrapper(e)
    }

    export const make = create

    export function selectAll<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>[]
    export function selectAll<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<SVGElementTagNameMap[T]>[]
    export function selectAll(selector: string, from?: sQuashDomTarget): DomWrapper<Element>[]
    export function selectAll(selector: string, from?: sQuashDomTarget) {
        const source = from == undefined ? document : (parseDomTarget(from) ?? document)
        return Array.from(source.querySelectorAll(selector)).map(e => new DomWrapper(e))
    }

    export const $$ = selectAll

    /**
     * Select an element with class/id and still remains type hinting.
     * @param element 
     * @param extra id and/or class name
     * @param from 
     */
    export function selectWith<T extends keyof HTMLElementTagNameMap>(element: T, extra: string, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>
    export function selectWith(element: string, extra: string, from?: sQuashDomTarget): DomWrapper<Element>
    export function selectWith(element: string, extra: string, from?: sQuashDomTarget) {
        if (queriedElements.has(element + extra)) {
            return new DomWrapper(queriedElements.get(element + extra) as Element)
        } else {
            const result = select(element + extra, from)
            queriedElements.set(element + extra, result.get())
            return result
        }
    }

    export const $w = selectWith

    /** Like `select` but also search in shadow DOMs */
    export function deepSelect<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>
    export function deepSelect<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<SVGElementTagNameMap[T]>
    export function deepSelect(selector: string, from?: sQuashDomTarget): DomWrapper<Element>
    export function deepSelect(selector: string, from?: sQuashDomTarget) {
        const source = from == undefined ? document : (parseDomTarget(from) ?? document)
        const treeWalker = document.createTreeWalker(source, NodeFilter.SHOW_ELEMENT)
        while (treeWalker.nextNode()) {
            const current = treeWalker.currentNode as Element
            if (current.matches(selector)) {
                return new DomWrapper(current)
            }
            if (current.shadowRoot != null) {
                const shadowResult = deepSelect(selector, current.shadowRoot)
                if (shadowResult) {
                    return shadowResult
                }
            }
        }
        return null
    }

    export const $d = deepSelect

    export function deepSelectAll<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>[]
    export function deepSelectAll<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<SVGElementTagNameMap[T]>[]
    export function deepSelectAll(selector: string, from?: sQuashDomTarget): DomWrapper<Element>[]
    export function deepSelectAll(selector: string, from?: sQuashDomTarget) {
        const source = from == undefined ? document : (parseDomTarget(from) ?? document)
        const result: DomWrapper<Element>[] = []
        const treeWalker = document.createTreeWalker(source, NodeFilter.SHOW_ELEMENT)
        while (treeWalker.nextNode()) {
            const current = treeWalker.currentNode as Element
            if (current.matches(selector)) {
                result.push(new DomWrapper(current))
            }
            if (current.shadowRoot != null) {
                const shadowResult = deepSelectAll(selector, current.shadowRoot)
                result.push(...shadowResult)
            }
        }
        return result
    }

    export const $$d = deepSelectAll
}

DomUtils.toString = () => '[namespace sQuash.DomUtils]'

Object.defineProperty(DomUtils, Symbol.toStringTag, {value: 'sQuash.DomUtils'})
Object.defineProperty(window, 'DomUtils', {value: DomUtils})
Object.defineProperty(DomUtils, 'new', {value: DomUtils.create})

// If new elements are added or exsiting elements are removed, clear the cache
const mutob = new MutationObserver((muts) => {
    muts.some(mut => mut.addedNodes.length > 0 || mut.removedNodes.length > 0) && queriedElements.clear()
})

mutob.observe(document.body, {childList: true, subtree: true})
