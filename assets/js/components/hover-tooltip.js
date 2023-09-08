// First import Popper.js from here: https://unpkg.com/@popperjs/core@2
// Then import Tippy.js from here https://unpkg.com/tippy.js@6

let needTooltip = document.querySelectorAll('.need-tooltip')
let tooltipContents = document.querySelectorAll('.tooltip-content')

if(needTooltip.length == 0) console.warn('HoverTooltip: No tooltip is needed!')
if(tooltipContents.length == 0) console.warn('HoverTooltip: No tooltip content found!')

let tippyConfig = {
    placement: 'auto',
    allowHTML: true,
    interactive: true,
    theme: 'aquamarine',
    arrow: false,
    maxWidth: '70vw',
    // hideOnClick: false,
    // trigger: 'click'
}

needTooltip.forEach((el, i) => {
    if(needTooltip.length == 0 || tooltipContents.length == 0) return;
    let error = document.createElement('div')
    error.innerHTML = 'Error: content not found.'
    let index = el.getAttribute('tooltip-index') || (i + 1)
    let content = document.querySelector(`#tooltip-content-${index}`) || error
    let tooltip = tippy(el, {content: content.innerHTML, ...tippyConfig})
    tooltip.popper.firstChild.dataset.index = el.textContent
    // console.log(tooltip.popper)
})