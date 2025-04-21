/**
 * Utility class for string manipulation.
 */
export const StringUtils = {
    [Symbol.toStringTag]: 'StringUtils',
    toString() {return '[namespace StringUtils]'},

    /**
     * @param {string} str
     * @returns
     * @example
     * StringUtils.camelToKebab('helloWorld') // "hello-world"
     */
    camelToKebab(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    },

    /**
     * @param {string} str
     * @returns
     * @example
     * StringUtils.kebabToCamel('hello-world') // "helloWorld"
     */
    kebabToCamel(str) {
        return str.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
        });
    },

    /**
     * Turn the first character of a string to uppercase.
     * @param {string} str
     * @returns
     * @example
     * StringUtils.capitalize('hello world') // "Hello world"
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Classic LeetCode problem: find the longest duplicate substring in a string.
     * @param {string} str 
     * @example StringUtils.findLogestDuplicate('banana') // "ana"
     */
    findLogestDuplicate(str) {
        let suffixes = []

        for(let i = 0; i < str.length; i++) {
            let suffix = str.substring(i)
            suffixes.push(suffix)
        }

        suffixes.sort()

        let lcp = (a, b) => {
            let i = 0
            while (i < a.length && i < b.length && a.charAt(i) === b.charAt(i)) {
                i++
            }
            return i
        }

        let maxLen = 0
        let res = ''
        for(let i = 0; i < suffixes.length - 1; i++) {
            let len = lcp(suffixes[i], suffixes[i+1])
            if(len > maxLen) {
                maxLen = len
                res = suffixes[i].substring(0, len)
            }
        }

        return res
    }
}
