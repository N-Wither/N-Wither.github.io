/**
 * @typedef {{[lang: string]: any, default?: any}} LanguageMap
 * @param {LanguageMap} languageMap
 * @param {'navigator'|'document'} subjectTo Determines which one should prevail when the language of the document and the language of the browser are different.
 * @returns 
 */
export function createLocalizer(languageMap, subjectTo = 'navigator') {
    let lang = 'default'

    if(subjectTo == 'navigator'){ lang = navigator?.language.toLowerCase() ?? document.documentElement?.lang.toLowerCase(); }
    else if (subjectTo == 'document'){ lang = document.documentElement?.lang.toLowerCase() ?? navigator?.language.toLowerCase(); }
    else { throw new TypeError('"subjectTo" must be "navigator" or "document"!') }
    
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
