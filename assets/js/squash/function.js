export class FunctionUtils {
    /**
     * Create a debounced function that delays invoking the provided function until given time (milliseconds) has passed.
     * @param {Function} fn
     * @param {number} time
     */
    static debounce(fn, time = 300) {
        if (typeof fn !== 'function') {
            throw new TypeError('First argument must be a function.');
        }
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                fn.apply(this, args);
            }, time);
        };
    }

    /**
     * Create a function that will execute only once.
     * @param {Function} fn 
     * @returns 
     */
    static once(fn) {
        let called = false;
        let result;
        return function (...args) {
            if (called == false) {
                called = true;
                result = fn.apply(this, args);
            }
            else {
                return result;
            }
        }
    }
};