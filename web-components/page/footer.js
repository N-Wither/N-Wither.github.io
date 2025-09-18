import { LitElement, html, css } from 'https://esm.sh/lit@3.2.0';
import { createLocalizer } from '../aqv2/lib/localize.js'

export class PageFooter extends LitElement {

    render() {
        return html`
        <link rel="stylesheet" href="/assets/css/aquamarinev2/global.css">
        <slot name='hr'>
            <hr part="divider">
        </slot>
        <slot name='quote'>
            <p>${this.#localize(1 + Math.floor(Math.random() * PageFooter.quotes))}</p>
        </slot>
        <div role='contentinfo'>
            <slot></slot>
            <slot name='credit'>
                <p>Powered by <a href='https://pages.github.com' target='_blank' rel="noopener noreferrer">Github Pages</a>.</p>
            </slot>
        </div>
        `
    }

    static get styles(){
        return css`
        :host {
            display: block;
            padding: 4rem min(10rem, 10%) 2rem min(10rem, 10%);
            text-align: center;
        }
        `
    }

    #localize = createLocalizer(PageFooter.lang, 'document')

    static quotes = 14

    static lang = {
        'zh-cn': {
            1: '已有的事后必再有，已行的事后必再行，日光之下并无新事。——《圣经·传道书》1:9',
            2: '给岁月以文明，而不是给文明以岁月。——刘慈欣《三体·黑暗森林》',
            3: '可以搞艺术，但是没必要。',
            4: '如此生活三十年，直到大厦崩塌。——万能青年旅店《杀死那个石家庄人》',
            5: '……可谁爱我呢？——老舍《茶馆》',
            6: '还好，一切如愿以偿。——《红雪》',
            7: '每逢你想要批评任何人的时候，要记住，这个世界上并非所有的人，都有你拥有的那些优势。——菲茨杰拉德《了不起的盖茨比》',
            8: '权力导致腐败，绝对权力导致绝对腐败。——阿克顿勋爵',
            9: '任何苦难，都能把我打倒。——卡夫卡',
            10: '我第一天来文化馆上班时故意迟到了两小时，结果发现自己居然是第一个来的，我心想这地方来对了。——余华',
            11: '不要因为睡懒觉而感到自责，因为就算你起来也创造不了任何价值，能从浪费时间中获得乐趣，就不是浪费时间。——罗素',
            12: '去旅行吧！',
            13: '为了部落，为了文化！',
            14: '我们必须知道，我们必将知道。—— 大卫·希尔伯特',
        },
        default: {
            1: html`That which has been, is that which is to be, and that which has been done, is that which will be done, and there is no new thing under the sun. —— <i>Ecclesiastes</i> 1:9`,
            2: html`Endue time with civilization, not to endue civilization with time. —— Cixin Liu <i>Three Body: The Dark Forest</i>`,
            3: 'We can do arts, but not have to.',
            4: html`Living like this for thirty years, until the building collapses. —— 万能青年旅店 <i>杀死那个石家庄人</i>`,
            5: html`……but who loves me? —— Lao She <i>Teahouse</i>`,
            6: html`Luckily, everything works as I wanted. —— <i>Red Snow</i>`,
            7: html`Whenever you feel like criticizing any one, just remember that all the people in this world haven't had the advantages that you've had. —— F. Scott Fitzgerald <i>The Great Gatsby</i>`,
            8: 'Power tends to corrupt, and absolute power corrupts absolutely. —— Baron Acton',
            9: 'Mich brechen alle Hindernisse. —— Franz Kafka',
            10: 'I was two hours late on purpose the first day I work at Cultural Center, but found I was the first to come, I thought it was the right place for me. —— Yu Hua',
            11: 'The time you enjoy wasting is not wasted time. —— Bertrand Russell',
            12: 'Go take a trip!',
            13: 'For the horde, for the culture!',
            14: 'We must know, we will know. —— David Hilbert',
        }
    }
}

customElements.define('page-footer', PageFooter)