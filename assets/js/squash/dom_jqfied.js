import { DomUtils } from './dom.js'

let $ = DomUtils.select
let $$ = DomUtils.selectAll
$.make = DomUtils.createElement

window.$ = $
window.$$ = $$
