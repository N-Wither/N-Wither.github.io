/**
 * Utility class for type manipulation.
 */
export class TypeUtils {
    /**
     * Check if a given value is of a certain type.
     * If the target type is a function, it will check if the value is an instance of target type.
     * @param {any} value
     * @param {'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | Function} targetType
     * @returns
     */
    static check(value, targetType) {
        let type = typeof value;
        if (type === targetType) {
            return true;
        } else if (TypeUtils.isObject(value) && typeof targetType === 'function') {
            return value instanceof targetType;
        } else {
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
        if (result === true) {
            return true;
        } else {
            if (TypeUtils.isObject(value) === false && typeof targetType !== 'function') {
                throw new TypeError(`${message} Expected ${targetType}, but got ${typeof value}.`);
            } else if (TypeUtils.isObject(value) === true && typeof targetType === 'function') {
                throw new TypeError(`${message} Expected instance of ${targetType.name}, but got ${value.constructor.name}.`);
            } else if (TypeUtils.isObject(value) === false && typeof targetType === 'function') {
                throw new TypeError(`${message} Expected instance of ${targetType.name}, but got ${typeof value}.`);
            } else if (TypeUtils.isObject(value) === true && typeof targetType !== 'function') {
                throw new TypeError(`${message} Expected ${targetType}, but got ${value.constructor.name}.`);
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
}
