/**
 * Utility class for type manipulation.
 */
export class TypeUtils {
    /**
     * Check if a given value is of a certain type.
     * If the target type is a function, it will check if the value is an instance of target type.
     * @param {any} value
     * @param {'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | Function } targetType
     * @returns
     */
    static check(value, targetType) {
        let type = typeof value;
        if (type === targetType) {
            return true;
        } else if (TypeUtils.isObject(value) && typeof targetType === 'function') {
            return value instanceof targetType;
        } else if (targetType instanceof TypeUtils.TSType) {
            switch (targetType.type) {
                case 'any': return true;
                case 'literal': return targetType.value.includes(value);
                case 'interface': {
                    if(TypeUtils.isObject(value) === false) return false;
                    let properties = targetType.value;
                    for(let prop of properties) {
                        if(prop.name in value === false) return false;
                        if(TypeUtils.check(value[prop.name], prop.type) === false) return false;
                    }
                    return true;
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
    static checkWithError(value, targetType, message = '') {
        let result = TypeUtils.check(value, targetType);
        // If message is empty or the message ends with a period, question mark or exclamation mark, the letter E should be capitalized.
        let e = message == '' ? 'E' : message.match(/.*(\.|\?|!)$/) ? ' E' : ' e'
        if (result === true) {
            return true;
        } else {
            if (TypeUtils.isObject(value) === false && typeof targetType !== 'function') {
                throw new TypeError(`${message}${e}xpected ${targetType}, but got ${typeof value}.`);
            } else if (TypeUtils.isObject(value) === true && typeof targetType === 'function') {
                throw new TypeError(`${message}${e}xpected instance of ${targetType.name}, but got ${value.constructor.name}.`);
            } else if (TypeUtils.isObject(value) === false && typeof targetType === 'function') {
                throw new TypeError(`${message}${e}xpected instance of ${targetType.name}, but got ${typeof value}.`);
            } else if (TypeUtils.isObject(value) === true && typeof targetType !== 'function') {
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
    static isSubclassOf(sub, sup) {
        TypeUtils.checkWithError(sub, 'function', 'The first argument is invalid.');
        TypeUtils.checkWithError(sup, 'function', 'The second argumant is invalid.');
        return sup.isPrototypeOf(sub);
    }

    /**
     * Check if a given object is iterable.
     * @param {any} o
     * @returns
     */
    static isIterable(o) {
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
    static isObject(v) {
        return (typeof v === 'object' && v !== null) || typeof v === 'function';
    }

    static TSType = class TSType {
        type = 'any'
        value = undefined

        constructor(type, value) {
            this.type = type
            this.value = value
        }
    }

    static TSInterfaceProperty = class TSInterfaceProperty {
        constructor(name, type, descriptor) {
            this.name = name
            this.type = type
            this.descriptor = descriptor
        }
    }

    static Literal(...values) {
        return new TypeUtils.TSType('literal', values)
    }

    static Interface(properties){
        return new TypeUtils.TSType('interface', properties)
    }
}
