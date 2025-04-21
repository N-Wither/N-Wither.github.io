import { Class } from ".";

interface JSTypeToTSTypeMap {
    'string': string,
    'number': number,
    'boolean': boolean,
    'undefined': undefined,
    'null': null,
    'bigint': bigint,
    'symbol': symbol,
}

type JSPrimitiveType = string | number | boolean | undefined | bigint | symbol

/**
 * A collection of utility functions for working with type checking.
 */
export namespace TypeUtils {
    type TypeCheckTarget = 'string' | 'number' | 'boolean' | 'null' | 'undefined' | 'bigint' | 'symbol' | Class | TSType<any>
    type TSTypes = 'any' | 'literal' | 'interface' | 'union'
    interface TSTypeValueMap {
        'any': undefined,
        'literal': string | number,
        'interface': TSInterfaceProperty[],
        'union': TypeCheckTarget[]
    }
    interface InterfaceObject {
        [key: PropertyKey]: TypeCheckTarget
    }

    class TSInterfaceProperty {
        constructor(name: PropertyKey, type: TypeCheckTarget, optional?: boolean)
        name: PropertyKey
        type: TypeCheckTarget
        optional: boolean
    }

    class TSType<T extends TSTypes> {
        constructor(type: T, value: TSTypeValueMap[T])
        type: T
        value: TSTypeValueMap[T]
    }

    /**
     * Check if a value is of a certain type, or if it is an instance of a class.
     * @param value 
     * @param type 
     */
    function check(value: any, type: TypeCheckTarget): boolean
    /**
     * same as `check()` but throws an error if the value is not of the specified type.
     * @param value 
     * @param type 
     * @param message 
     * @throws {TypeError}
     */
    function checkWithError(value: any, type: TypeCheckTarget, message?: string): boolean
    function isIterable(value: any): boolean
    /**
     * Functions are also considered as objects.
     * @param value 
     */
    function isObject(value: any): boolean
    /**
     * Like `typeof`, but returns the constructor when the value is an instance of a class.
     * @param value 
     * @param {boolean} [asString=false] If true, returns the constructor's name instead of the constructor. Default false.
     */
    function typeOf<T>(value: T, asString?: boolean): T extends JSPrimitiveType ? string : T extends (...args: any[]) => any ? 'function' : Class
    /**
     * Creates a TypeScript type for a specific value.
     * @param value 
     */
    function literal(value: string | number): TSType<'literal'>
    /**
     * Creates a TypeScript type for an interface. Function types are not supported.
     * @param interfaceObj 
     * @param extend 
     * @example
     * ```
     * const IPerson = TypeUtils.interface({name: 'string', age: 'number'})
     * const IUser = TypeUtils.interface({isAdmin: 'boolean'}, IPerson)
     * ```
     */
    function interface(interfaceObj: InterfaceObject, ...extend?: TSType<'interface'>[]): TSType<'interface'>
    /**
     * Creates a TypeScript type for a union of types.
     * @param types 
     */
    function union(...types: TypeCheckTarget[]): TSType<'union'>
    function any(): TSType<'any'>
    function typedArray<T extends TypeCheckTarget>(type: T): 
        T extends keyof JSTypeToTSTypeMap ? JSTypeToTSTypeMap[T][] : 
        T extends Class ? InstanceType<T>[] : 
        T extends TSType<any>? T[] : never
    function isTypedArray(value: any): boolean
}
