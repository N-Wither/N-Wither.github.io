declare function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, content?: any): ElementWrapper<HTMLElementTagNameMap[K]>;
declare function createElement<T extends Element>(element: T): ElementWrapper<T>;

declare function select(selector: string, unwrap?: true): HTMLElement | null
declare function select(selector: string, unwrap?: false): ElementWrapper<HTMLElement> | null
declare function select(selector: Element, unwrap?: true): HTMLElement
declare function select(selector: Element, unwrap?: false): ElementWrapper<HTMLElement>

declare function selectAll(selector: string, unwrap?: true): NodeListOf<HTMLElement>
declare function selectAll(selector: string, unwrap?: false): ElementWrapper<HTMLElement>[]

declare function getAllElements(from: Node, options: {allowShadowRoot?: boolean, unwrap?: true}): Element[]
declare function getAllElements(from: Node, options: {allowShadowRoot?: boolean, unwrap?: false}): ElementWrapper<HTMLElement>[]

declare function deepSelect(selector: string, from?: Node, options?: {all?: true, unwrap?: false}): ElementWrapper<HTMLElement>[]
declare function deepSelect(selector: string, from?: Node, options?: {all?: false, unwrap?: false}): ElementWrapper<HTMLElement> | null
declare function deepSelect(selector: string, from?: Node, options?: {all?: true, unwrap?: true}): HTMLElement[]
declare function deepSelect(selector: string, from?: Node, options?: {all?: false, unwrap?: true}): HTMLElement | null

declare function deepSelectAll(selector: string, from?: Node, unwrap?: false): ElementWrapper<HTMLElement>[]
declare function deepSelectAll(selector: string, from?: Node, unwrap?: true): HTMLElement[]

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

declare type ElementWrapperValidTarget = ElementWrapper<HTMLElement> | HTMLElement | string;

declare export class ElementWrapper<T> {
    element: T;
    constructor(tagName: keyof HTMLElementTagNameMap, content?: any);
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
    select(selector: string, unwrap?: true): HTMLElement | null
    select(selector: string, unwrap?: false): ElementWrapper<HTMLElement> | null
    selectAll(selector: string, unwrap?: true): NodeListOf<HTMLElement>
    selectAll(selector: string, unwrap?: false): ElementWrapper<HTMLElement>[]
    get previous(): ElementWrapper<HTMLElement> | null
    get next(): ElementWrapper<HTMLElement> | null
    get parent(): ElementWrapper<HTMLElement> | null
}
