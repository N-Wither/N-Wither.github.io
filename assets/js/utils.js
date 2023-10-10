// Auto Dark Mode
function autoDarkMode() {
    let dark = matchMedia('(prefers-color-scheme: dark)')
    let html = document.documentElement
    if(dark.matches && !html.classList.contains('dark-mode')){
        html.classList.add('dark-mode')
    }
}

autoDarkMode()

// Clock component
function startTime() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    document.getElementById('clock').innerHTML = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()} ${h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
    let t = setTimeout(() => startTime() , 500);
}

// A useless func
function hello() { console.log("Wow, you found me!") }

// Show random quotes in the footer
function randomQuote() {
    let quotes = [
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
    ];
    document.getElementById('randomQuote').innerHTML = quotes.getRandom();
}

// Tool functions
/**
 *  Toggle a element's class.
 *  @param {string | HTMLElement} selector 
 *  @param {string} className 
 */
function toggleClass(selector, className){
    if(typeof selector == 'string')
    document.querySelector(selector).classList.toggle(className);
    else
    selector.classList.toggle(className);
}

/**
 *  Returns a random integer between the given numbers.
 *  @param {number} min 
 *  @param {number} max 
 *  @returns {number}
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 *  Fetch something.
 *  @param {HTMLElement} target 
 *  @param {URL | RequestInfo} url 
 *  @param {string | undefined} type 
 *  @param {RequestInit | undefined} init 
 */
let fetchSomething = (target, url, type, init = {method: 'GET'}) => {
    fetch(url, init).then(response => {
        switch(type){
            case 'text':
            default :
                response.text().then(text => target.innerHTML = text); break;
            case 'image': response.blob().then(res => {let objUrl = URL.createObjectURL(res); target.src = objUrl}); break;
        }
    })
}

/**
 *  Fetch something and returns, but may slower idk.
 *  @param {string | URL} url 
 *  @returns {Promise<any>}
 */
let betterFetch = async (url) => {
    let res = await fetch(url)
    return res.text().then(text => text)
} 

Array.prototype.getRandom = function() {
    return this[getRandomInt(0, this.length)]
}