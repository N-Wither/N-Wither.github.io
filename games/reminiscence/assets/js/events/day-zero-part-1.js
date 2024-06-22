import { GameEvent } from "../event.js";
import { characters } from "../characters.js";

const dayZero = new GameEvent('day-zero-part-1')

dayZero.condition = {
    day: 0
}

dayZero.lang({
    default: {
        'event.dayZero.1': 'Finally I have a bakery of my own, I\'m kind of nervous to run a business on my own.',
        'event.dayZero.2': 'Tomorrow is the opening day, I should make some bread now.',
        'event.dayZero.3': 'Just make some white bread for now, tomorrow I will see what my customers want.',
        'event.dayZero.4': 'Click the bread in "Recipes" and make some bread!',
        'event.dayZero.5': 'You need at least 10 White Bread for proceeding to next day.'
    },
    'zh-cn': {
        'event.dayZero.1': '终于有了自己的面包房，自己做生意果然还是有点紧张啊！',
        'event.dayZero.2': '明天就开业了，我得做点面包了。',
        'event.dayZero.3': '先做点白面包吧，明天再看看大家想吃什么。',
        'event.dayZero.4': '点击“配方”里面的面包，做点面包吧！',
        'event.dayZero.5': '你至少要制作10个白面包才能进入下一天。'
    }
})

dayZero.dialog('character.ramii.name', 'event.dayZero.1', characters.ramii.icon)
dayZero.dialog('character.ramii.name', 'event.dayZero.2', characters.ramii.icon)
dayZero.dialog('character.ramii.name', 'event.dayZero.3', characters.ramii.icon)
dayZero.text('event.dayZero.4')
dayZero.text('event.dayZero.5')

export default dayZero