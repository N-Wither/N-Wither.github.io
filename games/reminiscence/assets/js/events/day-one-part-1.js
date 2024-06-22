import { GameEvent } from "../event.js";
import { characters } from "../characters.js";

const dayOnePt1 = new GameEvent('day-one-part-1')

dayOnePt1.condition = {
    day: 1,
    eventCompleted: ['day-zero-part-1', 'day-zero-part-2'],
    hasItem: [{item: 'whiteBread', count: 10}]
}

dayOnePt1.rewards = [
    {
        type: 'fame',
        data: {
            fame: 0.1
        }
    }
]

dayOnePt1.lang({
    default: {
        'event.dayOnePt1.1': '(Ah, here comes a customer!)',
        'event.dayOnePt1.2': 'Welcome to Reminiscence!',
        'event.dayOnePt1.3': '(Hmm, I haven\'t noticed here is a new bakery.)',
        'event.dayOnePt1.4': 'Hi, what do you have?',
        'event.dayOnePt1.5': `Well I'm sorry, but it's my first day to run a bakery, so there's only white bread for now.`,
        'event.dayOnePt1.6': `That's OK, I'll buy some.`,
        'event.dayOnePt1.tip': 'More fame means more sales, and more sales brings you more fame.',
    },
    'zh-cn': {
        'event.dayOnePt1.1': '（有客人来了！）',
        'event.dayOnePt1.2': '欢迎来到 Reminiscence！',
        'event.dayOnePt1.3': '（诶，我都没注意这里什么时候开了家新面包店了。）',
        'event.dayOnePt1.4': '问下，你们这里有什么卖的？',
        'event.dayOnePt1.5': `呃，抱歉，这是开店的第一天，所以只有白面包。`,
        'event.dayOnePt1.6': `没关系，给我来点尝尝味道。`,
        'event.dayOnePt1.tip': '知名度越高，销量越多，销量越多，知名度也越高。',
    }
})

dayOnePt1.dialog('character.ramii.name', 'event.dayOnePt1.1', characters.ramii.icon)
dayOnePt1.dialog('character.ramii.name', 'event.dayOnePt1.2', characters.ramii.icon)
dayOnePt1.dialog('character.ella.name', 'event.dayOnePt1.3', characters.ella.icon)
dayOnePt1.dialog('character.ella.name', 'event.dayOnePt1.4', characters.ella.icon)
dayOnePt1.dialog('character.ramii.name', 'event.dayOnePt1.5', characters.ramii.icon)
dayOnePt1.dialog('character.ella.name', 'event.dayOnePt1.6', characters.ella.icon)
dayOnePt1.text('reward.fame')
dayOnePt1.text('event.dayOnePt1.tip')

export default dayOnePt1