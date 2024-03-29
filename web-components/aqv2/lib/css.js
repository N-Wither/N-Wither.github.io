export default function css(s){
    let sheet = new CSSStyleSheet()
    sheet.replaceSync(s)
    return sheet
}