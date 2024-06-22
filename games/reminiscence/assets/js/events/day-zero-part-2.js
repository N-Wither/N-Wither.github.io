import { GameEvent } from "../event.js";
import { characters } from "../characters.js";

const dayZero2 = new GameEvent('day-zero-part-2')

dayZero2.condition = {
    day: 0,
    eventCompleted: ['day-zero-part-1'],
    hasItem: [{item: 'whiteBread', count: 10}]
}

dayZero2.rewards = [
    {
        type: 'flag',
        data: {
            flag: 'firstDayCompleted',
            value: true
        }
    },
    {
        type: 'recipe',
        data: {
            recipe: 'bagel'
        }
    }
]

dayZero2.lang({
    default: {
        'event.dayZero2.1': 'Everything is ready, go to sleep now!',
        'event.dayZero2.2': 'Because this is night now, clicking "Rest" will proceed to the next day.',
        'event.dayZero2.3': 'Click "Next Day" will proceed to the morning of the next day.',
        'event.dayZero2.4': 'Click "Rest" will proceed to the next time period.'
    },
    'zh-cn': {
        'event.dayZero2.1': '万事俱备，现在就睡觉吧！',
        'event.dayZero2.2': '因为现在是夜晚，点击“休息”将进入下一天。',
        'event.dayZero2.3': '点击“下一天”进入下一天的早晨。',
        'event.dayZero2.4': '点击“休息”进入下个时间段。'
    }
})

dayZero2.dialog('character.ramii.name', 'event.dayZero2.1', characters.ramii.icon)
dayZero2.text('event.dayZero2.3')
dayZero2.text('event.dayZero2.4')
dayZero2.text('event.dayZero2.2')
dayZero2.text('reward.recipe')

export default dayZero2