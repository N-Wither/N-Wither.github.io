// First import Popper.js from here: https://unpkg.com/@popperjs/core@2
// Then import Tippy.js from here https://unpkg.com/tippy.js@6

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

function setTooltip() {
    let needTooltip = document.querySelectorAll('.need-tooltip')
    let tooltipContents = document.querySelectorAll('.tooltip-content')

    if (needTooltip.length == 0) console.warn('HoverTooltip: No tooltip is needed!')
    if (tooltipContents.length == 0) console.warn('HoverTooltip: No tooltip content found!')

    needTooltip.forEach((el, i) => {
        if (needTooltip.length == 0 || tooltipContents.length == 0) return;
        let error = document.createElement('div')
        let index = el.dataset.tooltipIndex || (i + 1)
        let replacePopperIndex = false
        if (typeof index == 'string') {
            index = index.replace(' ', '_')
            replacePopperIndex = true
        }
        error.innerHTML = `Error: content (${index}) not found.`
        let content = document.querySelector(`#tooltip-content-${index}`) || error
        let tooltip = tippy(el, { content: content.innerHTML, ...tippyConfig })
        if (!replacePopperIndex) tooltip.popper.firstChild.dataset.index = el.textContent;
        else tooltip.popper.firstChild.dataset.index = index.replace('_', ' ')
        // console.log(tooltip.popper)
    })
}

setTooltip()