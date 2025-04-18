import { AquamarineComponentTagNameMap } from '../../../web-components/aqv2/components/components.d.ts'

interface CompleteElementTagNameMap extends HTMLElementTagNameMap, AquamarineComponentTagNameMap, SVGElementTagNameMap, MathMLElementTagNameMap {}

export namespace DomUtils {
    export const _ElementWrapper: typeof ElementWrapper;

    export const FX: {
        shake: (element: ElementWrapperValidTarget) => Animation
    }

    /**
     * Web components use shadow roots to encapsulate their styles and DOM. Sometimes this makes it hard to change the look of a component. This method allows you to inject CSS into a web component's shadow root.
     * @param element CSS selector or a element (if so, the third parameter is ignored).
     * @param css Your CSS text or a CSSStyleSheet object.
     * @param all Default true. If you want all elements that match the selector to be injected, do nothing. If not, set this to false and only the first element that matches the selector will be affected.
     */
    function injectCssToShadowRoot(element: ElementWrapperValidTarget, css: string | CSSStyleSheet, all?: boolean): CSSStyleSheet

    function createElement<K extends keyof CompleteElementTagNameMap>(tagName: K, content?: any): ElementWrapper<CompleteElementTagNameMap[K]>;
    function createElement<T extends Element>(element: T): ElementWrapper<T>;
    const make: typeof createElement;

    function select(selector: string, unwrap?: true): Element | null
    function select(selector: string, unwrap?: false): ElementWrapper<Element> | null
    function select(selector: Element, unwrap?: true): Element
    function select(selector: Element, unwrap?: false): ElementWrapper<Element>

    function selectAll(selector: string, unwrap?: true): NodeListOf<Element>
    function selectAll(selector: string, unwrap?: false): ElementWrapper<Element>[]

    function getAllElements(from: ElementWrapperValidTarget, options: {allowShadowRoot?: boolean, unwrap?: true}): Element[]
    function getAllElements(from: ElementWrapperValidTarget, options: {allowShadowRoot?: boolean, unwrap?: false}): ElementWrapper<Element>[]

    function deepSelect(selector: string, from?: Node, options?: {all?: true, unwrap?: false}): ElementWrapper<Element>[]
    function deepSelect(selector: string, from?: Node, options?: {all?: false, unwrap?: false}): ElementWrapper<Element> | null
    function deepSelect(selector: string, from?: Node, options?: {all?: true, unwrap?: true}): Element[]
    function deepSelect(selector: string, from?: Node, options?: {all?: false, unwrap?: true}): Element | null

    function deepSelectAll(selector: string, from?: Node, unwrap?: false): ElementWrapper<Element>[]
    function deepSelectAll(selector: string, from?: Node, unwrap?: true): Element[]

    function forAllElements(elements: ElementWrapperValidTarget[], callback: (element: Element) => any, options?: {allowShadowRoot?: boolean, from?: Node}): void
}

type ElementWrapperValidTarget = ElementWrapper<Element> | Element | string;

class ElementWrapper<T> {
    element: T;
    constructor(tagName: keyof CompleteElementTagNameMap, content?: any);
    constructor(element: Element)

    get(): T
    attr<K extends keyof T>(name: K, value: string): this
    prop(name: string, value: any): this
    prop<K extends keyof T>(name: K): T[K]
    prop(name: string): any
    css(name: string, value: string): this
    css(map: { [key: string]: string }): this
    class(...className: string[]): this
    appendTo(selector: string): this
    appendTo(node: Node): this
    append(selector: string): this
    append(node: Node): this
    insertBefore(sibling: ElementWrapperValidTarget): this
    insertAfter(sibling: ElementWrapperValidTarget): this
    html(html: string): this
    text(text: string): this
    on<E extends keyof HTMLElementEventMap>(event: E, handler: (ev: HTMLElementEventMap[E]) => any, options?: boolean | AddEventListenerOptions): this
    remove(): void
    isChildOf(parent: ElementWrapperValidTarget): boolean
    isFollowedBy(sibling: ElementWrapperValidTarget): boolean
    select(selector: string, unwrap?: true): Element | null
    select(selector: string, unwrap?: false): ElementWrapper<Element> | null
    $: typeof this.select
    selectAll(selector: string, unwrap?: true): NodeListOf<Element>
    selectAll(selector: string, unwrap?: false): ElementWrapper<Element>[]
    $$: typeof this.selectAll
    hasClass(className: string): boolean
    get previous(): ElementWrapper<Element> | null
    get next(): ElementWrapper<Element> | null
    get parent(): ElementWrapper<Element> | null
    readonly classList: DOMTokenList
    get className(): string
    set className(className: string)
    get id(): string
    set id(id: string)
    get innerHTML(): string
    set innerHTML(html: string)
    get outerHTML(): string
    set outerHTML(html: string)
    get innerText(): string
    set innerText(text: string)
    get textContent(): string
    set textContent(text: string)
}
