export const ObjectUtils = {
    get(obj, path) {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    },

    set(obj, path, value) {
        path.split('.').reduce((acc, key, index, arr) => {
            if (index === arr.length - 1) {
                acc[key] = value;
            }
            return acc[key];
        }, obj);
    },

    hasCircularReference(obj) {
        const seen = new WeakSet();
        const stack = [obj];
        while (stack.length) {
            const value = stack.pop();
            if (typeof value === 'object' && value!== null) {
                if (seen.has(value)) {
                    return true;
                }
                seen.add(value);
                stack.push(...Object.values(value));
            }
        }
        return false;
    },

    [Symbol.toStringTag]: 'ObjectUtils',
    toString() {return `[namespace ${this[Symbol.toStringTag]}]`}
}