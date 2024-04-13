import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PageFooter extends LitElement {
    constructor(){
        super()
    }

    render() {
        return html`
        <link rel="stylesheet" href="/assets/css/aquamarinev2/global.css">
        <hr>
        <p>${PageFooter.quotes[Math.floor(Math.random() * PageFooter.quotes.length)]}</p>
        <P>Powered by <a href='https://pages.github.com' target='_blank' rel="noopener noreferrer">Github Pages</a>.</P>
        `
    }

    static get styles(){
        return css`
        :host {
            display: block;
            margin: 4rem min(10rem, 10%) 2rem min(10rem, 10%);
            text-align: center;
        }
        `
    }

    static quotes = [
        '已有的事后必再有，已行的事后必再行，日光之下并无新事。——《圣经·传道书》1:9',
        '给岁月以文明，而不是给文明以岁月。——刘慈欣《三体·黑暗森林》',
        '可以搞艺术，但是没必要。',
        '如此生活三十年，直到大厦崩塌。——万能青年旅店《杀死那个石家庄人》',
        '……可谁爱我呢？——老舍《茶馆》',
        '还好，一切如愿以偿。——《红雪》',
        '每逢你想要批评任何人的时候，要记住，这个世界上并非所有的人，都有你拥有的那些优势。——菲茨杰拉德《了不起的盖茨比》',
        '权力导致腐败，绝对权力导致绝对腐败。——阿克顿勋爵',
        '任何苦难，都能把我打倒。——卡夫卡',
        '我第一天来文化馆上班时故意迟到了两小时，结果发现自己居然是第一个来的，我心想这地方来对了。——余华',
        '不要因为睡懒觉而感到自责，因为就算你起来也创造不了任何价值，能从浪费时间中获得乐趣，就不是浪费时间。——罗素'
    ]
}

customElements.define('page-footer', PageFooter)