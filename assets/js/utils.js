// Auto dark mode
let matchScheme = window.matchMedia('(prefers-color-scheme: dark)')
if(matchScheme.matches && !document.querySelector('html').classList.contains('dark-mode')){
    document.querySelector('html').classList.add('dark-mode')
}

// Clock component
function startTime() {
    var today = new Date();
    var D = today.getDate();
    var Y = today.getFullYear();
    var Mo = today.getMonth() + 1;
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('clock').innerHTML = Y + "/" + Mo + "/" + D + " " + h + ":" + m + ":" + s;
    t = setTimeout(function () { startTime() }, 500);
}
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
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
 * Toggle a element's class.
 * @param {string | HTMLElement} selector 
 * @param {string} className 
 */
function toggleClass(selector, className){
    if(typeof selector == 'string')
    document.querySelector(selector).classList.toggle(className);
    else
    selector.classList.toggle(className);
}

/**
 * Returns a random integer between the given numbers.
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Ajax someting.
 * @param {HTMLElement} element 
 * @param {boolean} log
 */
let AJAXSomething = (element, log) => {
    let src = element.dataset.src
    let request = new XMLHttpRequest()
    request.onreadystatechange = () => {
        if (request.readyState == 4 && request.status == 200) {
            element.innerHTML = request.responseText; 
            if(log) console.log('AJAX request done: ' + src)
        } else if (request.readyState == 4 && request.status != 200){
            console.error(`AJAX request failed: ${request.status}`)
        }
    }
    request.open('GET', src)
    request.send()
}

Array.prototype.getRandom = function() {
    return this[getRandomInt(0, this.length)]
}