import { Class } from ".";

export namespace TypeUtils {
    type TypeCheckTarget = 'string' | 'number' | 'boolean' | 'null' | 'undefined' | 'bigint' | 'symbol' | Class
    type TSTypes = 'any' | 'literal' | 'interface'
    interface TSTypeValueMap {
        any: any,
        literal: (string | number)[],
        interface: TSInterfaceProperty[]
    }

    class TSInterfaceProperty {
        constructor(name: PropertyKey, type: TypeCheckTarget, descriptor?: 'optional' |'required')
        name: PropertyKey
        type: TypeCheckTarget
        descriptor: 'optional' |'required'
    }

    class TSType<T extends TSTypes> {
        constructor(type: T, value: TSTypeValueMap[T])
        type: T
        value: TSTypeValueMap[T]
    }

    function check(value: any, type: TypeCheckTarget): boolean
    function checkWithError(value: any, type: TypeCheckTarget, message?: string): boolean
    function isSubclassOf(value: Class, parent: Class): boolean
    function isIterable(value: any): boolean
    function isObject(value: any): boolean
    function Literal(...values: (string | number)[]): TSType<'literal'>
    function Interface(...properties: TSInterfaceProperty[]): TSType<'interface'>
}
