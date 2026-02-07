/**
 * A set of DOM-related utility functions.
 */
export declare namespace DomUtils {
    class DomWrapper<T extends Element = Element> {
        #private;
        private readonly element;
        constructor(e: T);
        /** Unwrap the element. */
        get(): T;
        /** Get or set a property. */
        prop<P extends keyof T>(name: P): T[P];
        prop<P extends keyof T>(name: P, value: T[P]): this;
        /** Get or set an attribute. */
        attr(name: string): string | null;
        attr(name: string, value: string): this;
        /** Append another child to self. */
        append(element: Node | DomWrapper<Element>): this;
        /**
         * Append the element to other element.
         * @param target default: `document.body`
         * @returns
         */
        appendTo(target?: sQuashDomTarget): T;
        /** Short-hand for `addEventLitsener` */
        on<E extends keyof HTMLElementEventMap>(event: E, handler: (ev: HTMLElementEventMap[E]) => void): this;
        /** Get or set the `textContent` of the element. */
        text(): string;
        text(text: string): this;
        /** Get or set the `innerHTML` of the element. */
        html(): string;
        html(html: string): this;
        clear(): void;
        insertBefore(element: sQuashDomTarget): void;
        insertAfter(element: sQuashDomTarget): void;
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
        style(css: {
            [property: string]: string;
        }): this;
        remove(): void;
        get classList(): DOMTokenList;
        get className(): string;
        set className(c: string);
        get id(): string;
        set id(id: string);
    }
    type sQuashDomTarget = Element | DomWrapper<Element> | string | DocumentFragment;
    type sQuashDomContent = sQuashDomTarget | sQuashDomTarget[];
    export function select<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>;
    export function select<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<SVGElementTagNameMap[T]>;
    export function select(selector: string, from?: sQuashDomTarget): DomWrapper<Element>;
    export const $: typeof select;
    export function create<T extends keyof HTMLElementTagNameMap>(element: T, content?: sQuashDomContent): DomWrapper<HTMLElementTagNameMap[T]>;
    export function create<T extends keyof SVGElementTagNameMap>(element: T, content?: sQuashDomContent): DomWrapper<SVGElementTagNameMap[T]>;
    export function create(element: string, content?: sQuashDomContent): DomWrapper<Element>;
    export const make: typeof create;
    export function selectAll<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>[];
    export function selectAll<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<SVGElementTagNameMap[T]>[];
    export function selectAll(selector: string, from?: sQuashDomTarget): DomWrapper<Element>[];
    export const $$: typeof selectAll;
    /**
     * Select an element with class/id and still remains type hinting.
     * @param element
     * @param extra id and/or class name
     * @param from
     */
    export function selectWith<T extends keyof HTMLElementTagNameMap>(element: T, extra: string, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>;
    export function selectWith(element: string, extra: string, from?: sQuashDomTarget): DomWrapper<Element>;
    export const $w: typeof selectWith;
    /** Like `select` but also search in shadow DOMs */
    export function deepSelect<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>;
    export function deepSelect<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<SVGElementTagNameMap[T]>;
    export function deepSelect(selector: string, from?: sQuashDomTarget): DomWrapper<Element>;
    export const $d: typeof deepSelect;
    export function deepSelectAll<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>[];
    export function deepSelectAll<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<SVGElementTagNameMap[T]>[];
    export function deepSelectAll(selector: string, from?: sQuashDomTarget): DomWrapper<Element>[];
    export const $$d: typeof deepSelectAll;
    export {};
}
