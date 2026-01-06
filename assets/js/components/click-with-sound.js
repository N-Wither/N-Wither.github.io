import { Muse } from '../squash/muse.js';

let targets = document.querySelectorAll('.click-sfx')

function play() {
    Muse.playSound('/assets/sounds/sfx/click.mp3')
}

targets.forEach(ele => {
    ele.addEventListener('click', () => {
        play()
    })
})

let mutationObserver = new MutationObserver(mutations => {
    mutations.forEach(mut => {
        if(mut.type == 'childList') {
            mut.addedNodes.forEach(node => {
                if(node instanceof HTMLElement && node.classList.contains('click-sfx')) {
                    node.addEventListener('click', () => {play()})
                }
            })
        }
    })
})

mutationObserver.observe(document.body, {childList: true, subtree: true});
