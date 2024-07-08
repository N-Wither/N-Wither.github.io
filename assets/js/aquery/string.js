/**
 * Utility class for string manipulation.
 */
export class StringUtils {
    /**
     * @param {string} str
     * @returns
     * @example
     * Aq.Str.camelToKebab('helloWorld') // "hello-world"
     */
    static camelToKebab(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    /**
     * @param {string} str
     * @returns
     * @example
     * Aq.Str.kebabToCamel('hello-world') // "helloWorld"
     */
    static kebabToCamel(str) {
        return str.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
        });
    }

    /**
     * Turn the first character of a string to uppercase.
     * @param {string} str
     * @returns
     * @example
     * Aq.Str.capitalize('hello world') // "Hello world"
     */
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
