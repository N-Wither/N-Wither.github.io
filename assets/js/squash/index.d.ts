import { ElementWrapperValidTarget, CompleteElementTagNameMap, ElementWrapper } from "./dom"

interface Class {
    new (...args: any[]): any
}

/** A collection of useful functions, just like j**Qu**ery and Lod**ash**. */
export namespace sQuash {
    /** A collection of DOM-related functions. */
    namespace Dom {
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
        const make: typeof createElement
    
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

    namespace Color {
        function hexToRgba(hex: string, as?: 'css'): string
        function hexToRgba(hex: string, as?: 'object'): {r: number, g: number, b: number, a: number}

        class Color {
            constructor(color: string | number)
            readonly rgba: {r: number, g: number, b: number, a: number}
        }

        function create(color: string | number): Color
        function random(): Color
    }

    namespace Func {
        function debounce<T extends (...args: any[]) => any>(fn: T, time?: number): T
        function once<T extends (...args: any[]) => any>(fn: T): T
    }

    namespace Rand {
        /**
         * Get a random integer between min and max (inclusive). If only one argument is provided, it will be used as the minimum value. If no arguments are provided, it will return a random integer between 1 and 100.
         * @param min 
         * @param max 
         */
        function randomInt(min?: number, max?: number): number
        /**
         * Same as `Math.random()`.
         * @param min 
         * @param max 
         */
        function randomNumber(min?: number, max?: number): number

        function randomPick<T extends Iterable<any>>(arr: T): T[number]
    }

    /** A collection of utility functions for working with type checking. */
    namespace Type {
        type TypeCheckTarget = 'string' | 'number' | 'boolean' | 'null' | 'undefined' | 'bigint' | 'symbol' | Class | TSType<any>;
        type TSTypes = 'any' | 'literal' | 'interface' | 'union';
        interface TSTypeValueMap {
            any: undefined;
            literal: string | number;
            interface: TSInterfaceProperty[];
            union: TypeCheckTarget[];
        }
        interface InterfaceObject {
            [key: PropertyKey]: TypeCheckTarget;
        }

        class TSInterfaceProperty {
            constructor(name: PropertyKey, type: TypeCheckTarget, optional?: boolean);
            name: PropertyKey;
            type: TypeCheckTarget;
            optional: boolean;
        }

        class TSType<T extends TSTypes> {
            constructor(type: T, value: TSTypeValueMap[T]);
            type: T;
            value: TSTypeValueMap[T];
        }

        /**
         * Check if a value is of a certain type, or if it is an instance of a class.
         * @param value
         * @param type
         */
        function check(value: any, type: TypeCheckTarget): boolean;
        /**
         * same as `check()` but throws an error if the value is not of the specified type.
         * @param value
         * @param type
         * @param message
         * @throws {TypeError}
         */
        function checkWithError(value: any, type: TypeCheckTarget, message?: string): boolean;
        function isIterable(value: any): boolean;
        /**
         * Functions are also considered as objects.
         * @param value
         */
        function isObject(value: any): boolean;
        /**
         * Like `typeof`, but returns the constructor name when the value is an instance of a class.
         * @param value
         */
        function typeOf(value: any): string;
        /**
         * Creates a TypeScript type for a specific value.
         * @param value
         */
        function literal(value: string | number): TSType<'literal'>;
        /**
         * Creates a TypeScript type for an interface. Function types are not supported.
         * @param interfaceObj
         */
        function interface(interfaceObj: InterfaceObject): TSType<'interface'>;
        /**
         * Creates a TypeScript type for a union of types.
         * @param types
         */
        function union(...types: TypeCheckTarget[]): TSType<'union'>;
        function any(): TSType<'any'>;
    }

    namespace Str {
        /**@example sQuash.Str.capitalize('hello world') // "Hello World" */
        function capitalize<T extends string>(str: T): Capitalize<T>
        /**@example sQuash.Str.camelToKebab('helloWorld') // "hello-world" */
        function camelToKebab(str: string): string
        /**@example sQuash.Str.kebabToCamel('hello-world') // "helloWorld" */
        function kebabToCamel(str: string): string
    }
}
