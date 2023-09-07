// First import Popper.js from here: https://unpkg.com/@popperjs/core@2 and https://unpkg.com/tippy.js@6

let needTooltip = document.querySelectorAll('.need-tooltip')
let tooltipContents = document.querySelectorAll('.tooltip-content')

if(needTooltip.length == 0) console.warn('HoverTooltip: No tooltip is needed!')
if(tooltipContents.length == 0) console.warn('HoverTooltip: No tooltip content found!')

let tippyConfig = {
    placement: 'right',
    allowHTML: true,
    interactive: true,
    theme: 'aquamarine',
    arrow: false
}

needTooltip.forEach((el, i) => {
    if(needTooltip.length == 0 || tooltipContents.length == 0) return;
    let index = el.getAttribute('tooltip-index') || (i + 1)
    let content = document.querySelector(`#tooltip-content-${index}`)
    let tooltip = tippy(el, {content: content.innerHTML, ...tippyConfig})
    tooltip.popper.firstChild.dataset.index = el.textContent
    console.log(tooltip.popper)
})