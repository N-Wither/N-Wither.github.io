function randomQuote(){
    let quotes = [
        '已有的事后必再有，已行的事后必再行，日光之下并无新事。——《圣经·传道书》1:9',
        '给岁月以文明，而不是给文明以岁月。——刘慈欣《三体·黑暗森林》',
        '可以搞艺术，但是没必要。',
        '如此生活三十年，直到大厦崩塌。——万能青年旅店《杀死那个石家庄人》',
        '……可谁爱我呢？——老舍《茶馆》',
        '还好，一切如愿以偿。——《红雪》',
        '每逢你想要批评任何人的时候，要记住，这个世界上并非所有的人，都有你拥有的那些优势。——菲茨杰拉德《了不起的盖茨比》'
    ];
    let pick = getRandomInt(0, quotes.length);
    document.getElementById('randomQuote').innerHTML = quotes[pick];
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}