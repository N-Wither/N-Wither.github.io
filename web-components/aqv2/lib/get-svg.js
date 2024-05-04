/**
 * @param {URL} url 
 * @param {HTMLElement} target 
 */
export async function getSvg(url, target){
    let raw = await fetch(url).then(r => r.text())
    target.innerHTML = raw
}