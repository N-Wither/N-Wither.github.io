/**
 * @typedef {{[key: string]: string}} LanguageElement
 * @typedef {{[lang: string]: LanguageElement}} LanguageMap
 * @param {LanguageMap} languageMap 
 * @returns 
 */
export function createLocalizer(languageMap) {
    let lang = navigator?.language.toLowerCase() ?? document.documentElement?.lang.toLowerCase();
    let table = languageMap[lang];

    /** @param {string} key @param {string} fallback @returns {string} */
    return function (key, fallback) {
        if (fallback == undefined) {
            if ('default' in languageMap) {
                fallback = languageMap?.default[key];
            } else fallback = key;
        }
        if (table == undefined) return fallback;
        return table[key] || fallback;
    };
}
