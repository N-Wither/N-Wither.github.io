export namespace sQuash.DomUtils {
    class DomWrapper<T extends Element> {
        private readonly element: T
        constructor(e: T) {
            this.element = e
        }

        get() { return this.element }
        prop<P extends keyof T>(name: P): T[P]
        prop<P extends keyof T>(name: P, value: T[P]): this
        prop(...args: any[]) {
            if(args.length == 1) {
                return this.element[args[0]]
            } else {
                this.element[args[0]] = args[1]
                return this
            }
        }
        attr(name: string): string | null
        attr(name: string, value: string): this
        attr(...args: any[]) {
            if(args.length == 1) {
                return this.element.getAttribute(args[0])
            } else if(args.length == 2) {
                this.element.setAttribute(args[0], args[1])
                return this
            } else {
                throw new TypeError('Invalid number of arguments for attr()')
            }
        }
        text(): string
        text(value: string): this
        text(value?: string) {
            if(value === undefined) {
                return this.element.textContent || ''
            } else {
                this.element.textContent = value
                return this
            }
        }

        appendTo(target: sQuashDomTarget = document.body) {
            return parseDomTarget(target)?.appendChild(this.element)
        }

        intersectsWith(other: sQuashDomTarget) {
            let r1 = this.boundingRect
            let r2 = parseDomTarget(other)?.getBoundingClientRect()
            if(!r2) return false
            return !(r2.left > r1.right || 
                     r2.right < r1.left || 
                     r2.top > r1.bottom ||
                     r2.bottom < r1.top)
        }

        get classList() { return this.element.classList }
        get className() { return this.element.className }
        set className(c) { this.element.className = c }
        get id() { return this.element.id }
        set id(id) { this.element.id = id }
        get boundingRect() { return this.element.getBoundingClientRect() }
    }

    type sQuashDomTarget = Element | DomWrapper<Element> | string
    type sQuashDomContent = sQuashDomTarget | sQuashDomTarget[]

    function parseDomTarget(t: sQuashDomTarget) {
        if(typeof t == 'string') {
            return document.querySelector(t)
        } else if (t instanceof Element) {
            return t
        } else if (t instanceof DomWrapper) {
            return t.get()
        } else {
            throw new TypeError('Invalid target: ' + t)
        }
    }

    function parseDomContent(c: sQuashDomContent) {
        let content = Array.isArray(c) ? c : [c]
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
        let source = from == undefined ? document : (parseDomTarget(from) ?? document)
        let e = source.querySelector(selector)
        return e ? new DomWrapper(e) : null
    }
    
    export function create<T extends keyof HTMLElementTagNameMap>(element: T, content?: sQuashDomContent): DomWrapper<HTMLElementTagNameMap[T]>
    export function create<T extends keyof SVGElementTagNameMap>(element: T, content?: sQuashDomContent): DomWrapper<SVGElementTagNameMap[T]>
    export function create(element: string, content?: sQuashDomContent): DomWrapper<Element>
    export function create(element: string, content?: sQuashDomContent) {
        let e = document.createElement(element) as Element
        if(content) {
            let c = parseDomContent(content)
            e.append(...c)
        }
        return new DomWrapper(e)
    }

    export function selectAll<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>[]
    export function selectAll<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<SVGElementTagNameMap[T]>[]
    export function selectAll(selector: string, from?: sQuashDomTarget): DomWrapper<Element>[]
    export function selectAll(selector: string, from?: sQuashDomTarget) {
        let source = from == undefined ? document : (parseDomTarget(from) ?? document)
        return Array.from(source.querySelectorAll(selector)).map(e => new DomWrapper(e))
    }
}

sQuash[Symbol.toStringTag] = 'sQuash'
sQuash.toString = () => '[namespace sQuash]'
sQuash.DomUtils[Symbol.toStringTag] = 'sQuash.DomUtils'
sQuash.DomUtils.toString = () => '[namespace sQuash.DomUtils]'
