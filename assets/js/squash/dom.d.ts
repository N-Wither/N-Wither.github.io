import { AquamarineComponentTagNameMap } from '../../../web-components/aqv2/components/components.d.ts'

declare interface CompleteElementTagNameMap extends HTMLElementTagNameMap, AquamarineComponentTagNameMap, SVGElementTagNameMap, MathMLElementTagNameMap {}

declare function createElement<K extends keyof CompleteElementTagNameMap>(tagName: K, content?: any): ElementWrapper<CompleteElementTagNameMap[K]>;
declare function createElement<T extends Element>(element: T): ElementWrapper<T>;

declare function select(selector: string, unwrap?: true): Element | null
declare function select(selector: string, unwrap?: false): ElementWrapper<Element> | null
declare function select(selector: Element, unwrap?: true): Element
declare function select(selector: Element, unwrap?: false): ElementWrapper<Element>

declare function selectAll(selector: string, unwrap?: true): NodeListOf<Element>
declare function selectAll(selector: string, unwrap?: false): ElementWrapper<Element>[]

declare function getAllElements(from: Node, options: {allowShadowRoot?: boolean, unwrap?: true}): Element[]
declare function getAllElements(from: Node, options: {allowShadowRoot?: boolean, unwrap?: false}): ElementWrapper<Element>[]

declare function deepSelect(selector: string, from?: Node, options?: {all?: true, unwrap?: false}): ElementWrapper<Element>[]
declare function deepSelect(selector: string, from?: Node, options?: {all?: false, unwrap?: false}): ElementWrapper<Element> | null
declare function deepSelect(selector: string, from?: Node, options?: {all?: true, unwrap?: true}): Element[]
declare function deepSelect(selector: string, from?: Node, options?: {all?: false, unwrap?: true}): Element | null

declare function deepSelectAll(selector: string, from?: Node, unwrap?: false): ElementWrapper<Element>[]
declare function deepSelectAll(selector: string, from?: Node, unwrap?: true): Element[]

declare class DomUtils {
    static _ElementWrapper: typeof ElementWrapper;

    static createElement: typeof createElement
    static select: typeof select
    static selectAll: typeof selectAll
    static getAllElements: typeof getAllElements
    static deepSelect: typeof deepSelect
    static deepSelectAll: typeof deepSelectAll

    static FX: {
        shake: (element: ElementWrapperValidTarget) => Animation
    }
}

declare type ElementWrapperValidTarget = ElementWrapper<Element> | Element | string;

declare export class ElementWrapper<T> {
    element: T;
    constructor(tagName: keyof CompleteElementTagNameMap, content?: any);
    constructor(element: Element)

    get(): T
    attr(name: string, value: string): this
    prop(name: string, value: any): this
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
    on<E extends keyof HTMLElementEventMap>(event: E, handler: (ev: HTMLElementEventMap[E]) => any, options?: boolean | AddEventListenerOptions): this
    remove(): void
    isChildOf(parent: ElementWrapperValidTarget): boolean
    isFollowedBy(sibling: ElementWrapperValidTarget): boolean
    select(selector: string, unwrap?: true): Element | null
    select(selector: string, unwrap?: false): ElementWrapper<Element> | null
    selectAll(selector: string, unwrap?: true): NodeListOf<Element>
    selectAll(selector: string, unwrap?: false): ElementWrapper<Element>[]
    get previous(): ElementWrapper<Element> | null
    get next(): ElementWrapper<Element> | null
    get parent(): ElementWrapper<Element> | null
}
