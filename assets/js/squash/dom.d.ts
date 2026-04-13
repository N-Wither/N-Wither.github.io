export type sQuashDomTarget = Element | DomWrapper<Element> | string | DocumentFragment;
export type sQuashDomContent = sQuashDomTarget | sQuashDomTarget[];
export declare class DomWrapper<T extends Element = Element> {
    #private;
    private readonly element;
    constructor(e: T);
    /** Unwrap the element. */
    get(): T;
    /** Get or set a property. */
    prop<P extends keyof T>(name: P): T[P];
    prop<P extends keyof T>(name: P, value: T[P]): this;
    prop(name: string, value: unknown): this;
    /** Get an attribute. */
    attr(name: string): string | null;
    /** Set an attribute. */
    attr(name: string, value: string): this;
    /** Remove an attribute. */
    attr(name: string, value: null): this;
    removeAttr(name: string): this;
    class(): string;
    class(className: string): this;
    addClass(className: string): this;
    removeClass(className: string): this;
    toggleClass(className: string): this;
    replaceClass(className: string, newClassName: string): this;
    /** Append another child to self. */
    append(element: Node | DomWrapper<Element>): this;
    /**
     * Append the element to other element.
     * @param target default: `document.body`
     * @returns
     */
    appendTo(target?: sQuashDomTarget): this;
    /** Short-hand for `addEventLitsener` */
    on<E extends keyof HTMLElementEventMap>(event: E, handler: (this: T, ev: HTMLElementEventMap[E]) => void, options?: boolean | AddEventListenerOptions): this;
    on(event: string, handler: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): this;
    /** Get or set the `textContent` of the element. */
    text(): string;
    text(text: string): this;
    /** Get or set the `innerHTML` of the element. */
    html(): string;
    html(html: string): this;
    clear(): this;
    insertBefore(element: sQuashDomTarget): void;
    insertAfter(element: sQuashDomTarget): void;
    replaceWith(element: Element | DomWrapper<Element>): this;
    select<T extends keyof HTMLElementTagNameMap>(selector: T): DomWrapper<HTMLElementTagNameMap[T]>;
    select<T extends keyof SVGElementTagNameMap>(selector: T): DomWrapper<SVGElementTagNameMap[T]>;
    select(selector: string): DomWrapper<Element>;
    $: {
        <T_1 extends keyof HTMLElementTagNameMap>(selector: T_1): DomWrapper<HTMLElementTagNameMap[T_1]>;
        <T_1 extends keyof SVGElementTagNameMap>(selector: T_1): DomWrapper<SVGElementTagNameMap[T_1]>;
        (selector: string): DomWrapper<Element>;
    };
    selectAll<T extends keyof HTMLElementTagNameMap>(selector: T): DomWrapper<HTMLElementTagNameMap[T]>[];
    selectAll<T extends keyof SVGElementTagNameMap>(selector: T): DomWrapper<SVGElementTagNameMap[T]>[];
    selectAll(selector: string): DomWrapper<Element>[];
    $$: {
        <T_1 extends keyof HTMLElementTagNameMap>(selector: T_1): DomWrapper<HTMLElementTagNameMap[T_1]>[];
        <T_1 extends keyof SVGElementTagNameMap>(selector: T_1): DomWrapper<SVGElementTagNameMap[T_1]>[];
        (selector: string): DomWrapper<Element>[];
    };
    style(): CSSStyleDeclaration;
    style(css: {
        [property: string]: string;
    }): this;
    remove(): this;
    clone(deep?: boolean): DomWrapper;
    isChildOf(parent: sQuashDomTarget): boolean;
    get classList(): DOMTokenList;
    get className(): string;
    set className(c: string);
    get id(): string;
    set id(id: string);
    /**
     * @throws {TypeError} if the wrapped element is not an `<input>` element.
     */
    get validValue(): string | number;
}
/**
 * An extended array of DomWrappers for bulk operation.
 */
export declare class DomWrapperArray<T extends Element> extends Array<DomWrapper<T>> {
    constructor();
    /**
     * Converts a regular array (or any other iterable set) of `DomWrappers` or `Element` to `DomWrapperArray`.
     */
    static from<E extends Element>(arr: ArrayLike<DomWrapper<E> | E> | Iterable<DomWrapper<E> | E>): DomWrapperArray<E>;
    filter(predicate: (value: DomWrapper<T>, index: number, array: DomWrapper<T>[]) => unknown, thisArg?: unknown): DomWrapperArray<T>;
    on<E extends keyof HTMLElementEventMap>(ev: E, listener: (this: T, ev: HTMLElementEventMap[E]) => void, options?: boolean | AddEventListenerOptions): this;
    on(ev: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): this;
    remove(): this;
    class(className: string): this;
    addClass(className: string): this;
    toggleClass(className: string): this;
    removeClass(className: string): this;
    attr(name: string, value: string): this;
    removeAttr(name: string): this;
    appendTo(target: sQuashDomTarget): this;
}
/**
 * A set of DOM-related utility functions.
 */
export declare namespace DomUtils {
    const DOMWrapper: typeof DomWrapper;
    const DOMWrapperArray: typeof DomWrapperArray;
    function select<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>;
    function select<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<SVGElementTagNameMap[T]>;
    function select(selector: string, from?: sQuashDomTarget): DomWrapper<Element>;
    const $: typeof select;
    function create<T extends keyof HTMLElementTagNameMap>(element: T, content?: sQuashDomContent): DomWrapper<HTMLElementTagNameMap[T]>;
    function create<T extends keyof SVGElementTagNameMap>(element: T, content?: sQuashDomContent): DomWrapper<SVGElementTagNameMap[T]>;
    function create(element: string, content?: sQuashDomContent): DomWrapper<Element>;
    const make: typeof create;
    function selectAll<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapperArray<HTMLElementTagNameMap[T]>;
    function selectAll<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapperArray<SVGElementTagNameMap[T]>;
    function selectAll(selector: string, from?: sQuashDomTarget): DomWrapperArray<Element>;
    const $$: typeof selectAll;
    /**
     * Select an element with class/id and still keeps type hinting.
     * @param element
     * @param extra id and/or class name
     * @param from
     */
    function selectWith<T extends keyof HTMLElementTagNameMap>(element: T, extra: string, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>;
    function selectWith(element: string, extra: string, from?: sQuashDomTarget): DomWrapper<Element>;
    const $w: typeof selectWith;
    /** Like `select` but also search in shadow DOMs */
    function deepSelect<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>;
    function deepSelect<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<SVGElementTagNameMap[T]>;
    function deepSelect(selector: string, from?: sQuashDomTarget): DomWrapper<Element>;
    const $d: typeof deepSelect;
    function deepSelectAll<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>[];
    function deepSelectAll<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<SVGElementTagNameMap[T]>[];
    function deepSelectAll(selector: string, from?: sQuashDomTarget): DomWrapper<Element>[];
    const $$d: typeof deepSelectAll;
    function wrap<T extends Element>(e: T): DomWrapper<T>;
    function wrap<T extends Element>(arr: ArrayLike<T> | Iterable<T>): DomWrapperArray<T>;
    function forAll<T extends keyof HTMLElementTagNameMap>(selector: T, callback: (el: DomWrapper<HTMLElementTagNameMap[T]>, index: number, arr: DomWrapperArray<HTMLElementTagNameMap[T]>) => void): void;
    function forAll(selector: string, callback: (el: DomWrapper<Element>, index: number, arr: DomWrapperArray<Element>) => void): void;
    /**
     * @example
     * countWordsLatin('Hello World!', 'en-US') // 2
     */
    function countWordsLatin(text: string, locale: string): number;
    /**
     * @example
     * countWordsCJK('你好，世界！Hello World', 'zh-CN') // 6
     */
    function countWordsCJK(text: string, locale: string): number;
}
