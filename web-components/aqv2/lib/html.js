export default function html(text){
    let p = new DOMParser()
    let h = p.parseFromString(text, 'text/html')
    return h.documentElement.querySelector('body').firstChild
}