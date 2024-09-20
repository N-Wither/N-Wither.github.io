import { DomUtils } from './dom.js'

let $ = DomUtils.select
let $$ = DomUtils.selectAll
$.new = DomUtils.createElement

window.$ = $
window.$$ = $$
