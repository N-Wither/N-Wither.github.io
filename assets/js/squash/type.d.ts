import { Class } from ".";

export namespace TypeUtils {
    type TypeCheckTarget = 'string' | 'number' | 'boolean' | 'null' | 'undefined' | 'bigint' | 'symbol' | Class
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
         * @throws TypeError
         */
    function checkWithError(value: any, type: TypeCheckTarget, message?: string): boolean
    /**
     * @deprecated use `Object.prototype.isPrototypeOf()` instead.
     * @param value 
     * @param parent 
     */
    function isSubclassOf(value: Class, parent: Class): boolean
    function isIterable(value: any): boolean
    /**
     * Functions are also considered objects.
     * @param value 
     */
    function isObject(value: any): boolean
    /**
     * Like `typeof`, but returns the constructor name when the value is an instance of a class.
     * @param value 
     */
    function typeOf(value: any): string
    function literal(value: string | number): TSType<'literal'>
    function interface(interfaceObj: InterfaceObject): TSType<'interface'>
    function union(...types: TypeCheckTarget[]): TSType<'union'>
    function any(): TSType<'any'>
}
