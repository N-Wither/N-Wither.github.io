import { Muse } from '../squash/muse.js';

let targets = document.querySelectorAll('.click-sfx')

targets.forEach(ele => {
    ele.addEventListener('click', () => {
        Muse.playSound('/assets/sounds/sfx/click.mp3')
    })
})