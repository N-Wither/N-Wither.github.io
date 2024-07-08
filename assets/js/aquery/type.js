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
        } else if (type === 'object' && typeof targetType === 'function') {
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
        let result = Aq.Type.check(value, targetType);
        if (result === true) {
            return true;
        } else {
            if (typeof value !== 'object' && typeof targetType !== 'function') {
                throw new TypeError(`${message} Expected ${targetType}, but got ${typeof value}.`);
            } else if (typeof value === 'object' && typeof targetType === 'function') {
                throw new TypeError(`${message} Expected instance of ${targetType.name}, but got ${value.constructor.name}.`);
            } else if (typeof value !== 'object' && typeof targetType === 'function') {
                throw new TypeError(`${message} Expected instance of ${targetType.name}, but got ${typeof value}.`);
            } else if (typeof value === 'object' && typeof targetType !== 'function') {
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
        TypeUtils.checkWithError(sub, Function, 'The first argument is invalid.');
        TypeUtils.checkWithError(sup, Function, 'The second argumant is invalid.');
        return sub.prototype instanceof sup;
    }

    /**
     * Check if a given object is iterable.
     * @param {object} obj
     * @returns
     */
    static isIterable(obj) {
        TypeUtils.checkWithError(obj, 'object');
        return obj != null && typeof obj[Symbol.iterator] === 'function';
    }
}
