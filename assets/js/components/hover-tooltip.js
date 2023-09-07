// First import Popper.js from here: https://unpkg.com/@popperjs/core@2

let needTooltip = document.querySelectorAll('.need-tooltip')
let tooltipContents = document.querySelectorAll('.tooltip-content')

let popperConfig = {
    placement: 'right',
    modifiers: [
        {
            name: 'offset',
            options: {offset: [0, 12]}
        }
    ]
}

if(needTooltip.length == 0) console.warn('HoverTooltip: No tooltip is needed!')
if(tooltipContents.length == 0) console.warn('HoverTooltip: No tooltip content found!')

needTooltip.forEach((el, i) => {
    if(needTooltip.length == 0 || tooltipContents.length == 0) return;
    let tooltip = document.createElement('div')
    let index = el.getAttribute('tooltip-index') || (i + 1)
    let content = document.querySelector(`#tooltip-content-${index}`)
    
    tooltip.classList.add('tooltip')
    tooltip.id = `tooltip-${index}`
    tooltip.innerHTML = content.innerHTML
    tooltip.dataset.index = el.textContent

    el.appendChild(tooltip)

    let popperInstance = Popper.createPopper(el, document.getElementById(tooltip.id), popperConfig)

    function show() {
        // Make the tooltip visible
        tooltip.setAttribute('data-show', '');

        // Enable the event listeners
        popperInstance.setOptions((options) => ({
            ...options,
            modifiers: [
                ...options.modifiers,
                { name: 'eventListeners', enabled: true },
            ],
        }));

        // Update its position
        popperInstance.update();
    }

    function hide() {
        // Hide the tooltip
        tooltip.removeAttribute('data-show');

        // Disable the event listeners
        popperInstance.setOptions((options) => ({
            ...options,
            modifiers: [
                ...options.modifiers,
                { name: 'eventListeners', enabled: false },
            ],
        }));
    }

    const showEvents = ['mouseenter', 'focus'];
    const hideEvents = ['mouseleave', 'blur'];

    showEvents.forEach((event) => {
        el.addEventListener(event, show);
    });

    hideEvents.forEach((event) => {
        el.addEventListener(event, hide);
    });

})