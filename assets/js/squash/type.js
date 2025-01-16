class TSType {
    static #JSTypes = ['string', 'number', 'bigint', 'boolean', 'symbol', 'undefined', 'object', 'function']
    static #ANY = new TSType('any')

    type = 'any'
    value = []

    constructor(type, value = []) {
        this.type = type
        this.value = value
    }

    toString() {
        switch (this.type) {
            case 'any': {
                return '[TSType<any>]'
            }
            case 'interface': {
                return `{${this.value.map(v => v.toString()).join(', ')}}`
            }
            case 'literal': {
                return `[TSType<literal, ${typeof this.value == 'string' ? `"${this.value}"` : this.value}>]`
            }
            case 'union': {
                return `[TSType<${this.type}, [${this.value.map(v => typeof v == 'string' ? `"${v}"` : v.toString()).join(' | ')}]>]`
            }
            default: {
                return `[TSType<${this.type}, [${this.value.map(v => v.toString()).join(', ')}]>]`
            }
        }
    }

    static literal(value) {
        return new TSType('literal', value)
    }

    static interface(interfaceObject) {
        if(typeof interfaceObject != 'object') {
            throw new TypeError('The argument must be an object.')
        }
        let entries = Object.entries(interfaceObject)
        let properties = []
        entries.forEach(([name, type]) => {
            let prop
            if(TSType.#JSTypes.includes(type) || type instanceof TSType) {
                prop = new TSInterfaceProperty(name, type)
            }
            else if (type instanceof TSInterfaceProperty) {
                prop = type
            }
            else if (typeof type === 'object' && type !== null) {
                prop = new TSInterfaceProperty(name, TSType.interface(type))
            }
            else throw new TypeError(`Invalid type for property ${name}: ${type}.`)

            if(name.endsWith('?')) {
                prop.optional = true
                prop.name = prop.name.slice(0, -1)
            };

            properties.push(prop)
        })
        return new TSType('interface', properties)
    }

    static any() {
        return TSType.#ANY
    }

    static union(...types) {
        return new TSType('union', types)
    }

    static optional(name, type) {
        return new TSInterfaceProperty(name, type, true)
    }

    static JSTypes = new TSType('union', TSType.#JSTypes.map(t => new TSType('literal', t)))
    static TypeCheckTarget = new TSType('union', [...TSType.JSTypes.value, TSType])
}

class TSInterfaceProperty {
    constructor(name, type = TSType.any(), optional = false) {
        this.name = name
        this.type = type
        this.optional = optional
    }

    toString() {
        return `${this.name}${this.optional ? '?' : ''}: ${this.type.toString()}`
    }
}

/**
     * Check if a given value is of a certain type.
     * If the target type is a function, it will check if the value is an instance of target type.
     * @param {any} value
     * @param {'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | Function } targetType
     * @returns
     */
function check(value, targetType) {
    let type = typeof value;
    if (type === targetType) {
        return true;
    } else if (isObject(value) && typeof targetType === 'function') {
        return value instanceof targetType;
    } else if (targetType instanceof TSType) {
        switch (targetType.type) {
            case 'any': return true;
            case 'literal': return targetType.value === value;
            case 'interface': {
                if(isObject(value) === false) return false;
                let properties = targetType.value;
                if(properties.length === 0) return true;
                for(let prop of properties) {
                    if(prop.name in value === false && prop.optional === false) return false;
                    if(check(value[prop.name], prop.type) === false) return false;
                }
                return true;
            }
            case 'union': {
                for(let t of targetType.value) {
                    if(check(value, t)) return true;
                }
                return false
            }
        }
    }
    else {
        return false;
    }
}

/**
     * Same as `check`, but throws an error if the check fails.
     * @param {any} value
     * @param {'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | Function} targetType
     * @param {string} [message = '']
     * @returns
     * @throws {TypeError}
     */
function checkWithError(value, targetType, message = '') {
    let result = check(value, targetType);
    // If message is empty or the message ends with a period, question mark or exclamation mark, the letter E should be capitalized.
    let e = message == '' ? 'E' : message.match(/.*(\.|\?|!)$/) ? ' E' : ' e'
    if (result === true) {
        return true;
    } 
    else if (targetType instanceof TSType) {
        switch (targetType.type) {
            case 'literal': {
                let expected = targetType.value.join(', ');
                throw new TypeError(`${message}${e}xpected one of [${expected}], but got ${value}.`);
            }
            case 'interface': {
                let expected = targetType.value.map(p => p.name + (p.optional ? '?: ' : ': ') + p.type.toString()).join(', ');
                throw new TypeError(`Provided object does not match the interface {${expected}}.`);
            }
            case 'union': {
                throw new TypeError(`${message}${e}xpected ${targetType}, but got ${value}.`);
            }
            case 'any': // this is impossible, but just in case
            default: break;
        }
    }
    else {
        if (isObject(value) === false && typeof targetType !== 'function') {
            throw new TypeError(`${message}${e}xpected ${targetType}, but got ${typeof value}.`);
        } else if (isObject(value) === true && typeof targetType === 'function') {
            throw new TypeError(`${message}${e}xpected instance of ${targetType.name}, but got ${value.constructor.name}.`);
        } else if (isObject(value) === false && typeof targetType === 'function') {
            throw new TypeError(`${message}${e}xpected instance of ${targetType.name}, but got ${typeof value}.`);
        } else if (isObject(value) === true && typeof targetType !== 'function') {
            throw new TypeError(`${message}${e}xpected ${targetType}, but got ${value.constructor.name}.`);
        }
    }
}

/**
     * Check if a subclass extends a superclass.
     * @param {Function} sub
     * @param {Function} sup
     * @returns
     */
function isSubclassOf(sub, sup) {
    checkWithError(sub, 'function', 'The first argument must be a constructor.');
    checkWithError(sup, 'function', 'The second argumant must be a constructor.');
    return sup.isPrototypeOf(sub);
}

/**
     * Check if a given object is iterable.
     * @param {any} o
     * @returns
     */
function isIterable(o) {
    if(o == undefined) {
        return false;
    }
    else {
        return typeof o[Symbol.iterator] === 'function';
    }
}

/**
     * Check if a given value is an object (including functions).
     * @param {*} v 
     * @returns 
     */
function isObject(v) {
    return (typeof v === 'object' && v !== null) || typeof v === 'function';
}

function typeOf(v) {
    if(v === null) {
        return 'null';
    }
    else if(typeof v == 'object') {
        return v.constructor.name == 'Object' ? 'object' : v.constructor;
    }
    else return typeof v;
}

function typedArray(type) {
    if(check(type, TSType.TypeCheckTarget) == false) {
        throw new TypeError('Invalid type!');
    }
    let arr = []
    let _push = arr.push.bind(arr)
    let _concat = arr.concat.bind(arr)
    let error = new TypeError(`This array only accepts ${typeof type == 'function' ? type.name : type}!`)
    arr.push = new Proxy(arr.push, {
        apply: function(target, thisArg, argumentsList) {
            for(let v of argumentsList) {
                if(check(v, type) == false) {
                    throw error;
                }
                else return _push(v)
            }
        }
    })
    arr.concat = new Proxy(arr.concat, {
        apply: function(target, thisArg, argumentsList) {
            if(argumentsList.length == 0) return arr;
            let result = _concat(...argumentsList)
            for(let v of result) {
                if(check(v, type) == false) {
                    throw new TypeError(`Found non ${typeof type == 'function' ? type.name : type} value in concatenation!`);
                }
            }
            return result
        }
    })
    return new Proxy(arr, {
        set: function(target, prop, value) {
            if(isNaN(Number(prop)) == false && Number.isInteger(Number(prop))) {
                if(check(value, type) == false) {
                    throw error;
                }
            }
            arr[prop] = value
        }
    })
}

function isTypedArray(arr) {
    if(check(arr, TSType.union(Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, BigInt64Array, BigUint64Array, Float32Array, Float64Array))) return true;
    if(Array.isArray(arr) == false) return false;
    if(arr.length == 0) return true;
    let type = typeOf(arr[0]);
    for(let v of arr) {
        if(typeOf(v) != type) return false;
    }
    return true;
}

/**
 * A collection of utility functions for type manipulation.
 */
export const TypeUtils = {
    check,
    checkWithError,
    isSubclassOf,
    isIterable,
    isObject,
    typeOf,
    typedArray,
    isTypedArray,

    ITSInterfaceProperty: new TSType('interface', [
        new TSInterfaceProperty('name', TSType.union('string', 'number', 'symbol')),
        new TSInterfaceProperty('type', TSType.any(), true),
        new TSInterfaceProperty('optional', 'boolean', true)
    ]),

    TSType: TSType,
    TSInterfaceProperty: TSInterfaceProperty,

    any: TSType.any,
    literal: TSType.literal,
    interface: TSType.interface,
    union: TSType.union,
    optional: TSType.optional,

    [Symbol.toStringTag]: 'TypeUtils',
    toString() { return '[namespace TypeUtils]' }
}
