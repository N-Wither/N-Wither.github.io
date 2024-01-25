/**
 * Parse a CSS string and returns a CSSStyleSheet
 * @param {string} css 
 * @returns {CSSStyleSheet}
 */
export default function css(css){
    let s = new CSSStyleSheet()
    s.replaceSync(css)
    return s
}