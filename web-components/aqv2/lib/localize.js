/**
 * 
 * @param {any} languageTable 
 * @param {string} key 
 * @param {string} fallback 
 * @returns {string}
 */
export function localize(languageTable, key, fallback){
    let lang = document.documentElement.lang.toLowerCase()
    if(fallback == undefined) fallback = key;
    let table = languageTable[lang]
    if(table == undefined) return fallback;
    return table[key] || fallback
}