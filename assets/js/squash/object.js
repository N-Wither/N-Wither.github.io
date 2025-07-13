export const ObjectUtils = {
    /**
     *
     * @param {object} obj
     * @param {string} path
     * @returns
     */
    get(obj, path) {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    },

    /**
     * 
     * @param {{[key: string]: any}} obj 
     * @param {string} path 
     * @param {any} value 
     */
    set(obj, path, value) {
        path.split('.').reduce((acc, key, index, arr) => {
            if(index != arr.length - 1 && typeof acc[key] !== 'object' || acc[key] === null) {
                acc[key] = {};
            }
            if (index === arr.length - 1) {
                acc[key] = value;
            }
            return acc[key];
        }, obj);
    },

    findCircularReference(obj) {
        const seen = new WeakSet();
        const stack = [obj];
        while (stack.length) {
            const value = stack.pop();
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return value;
                }
                seen.add(value);
                stack.push(...Object.values(value));
            }
        }
        return false;
    },

    hasCircularReference(obj) {
        return this.findCircularReference(obj) ? true : false;
    },

    hasSelfReference(obj) {
        return this.findCircularReference(obj) == obj ? true : false;
    },

    [Symbol.toStringTag]: 'ObjectUtils',
    toString() {
        return `[namespace ${this[Symbol.toStringTag]}]`;
    },
};
