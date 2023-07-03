let darkModeIsOn = false;
function darkModeSwitch() {
    let body = document.body;
    let navigate = document.getElementById('navigate');
    if (darkModeIsOn == false) {
        body.setAttribute('class', 'dark-mode-on');
        navigate.setAttribute('class', 'navigate-dark');
        document.getElementById('content').setAttribute('class', 'content-dark');
        document.getElementById('toolbox').setAttribute('class', 'toolbox-dark');
        darkModeIsOn = true;
    }
    else {
        body.setAttribute('class', '');
        navigate.setAttribute('class', 'navigate');
        document.getElementById('content').setAttribute('class', 'content');
        document.getElementById('toolbox').setAttribute('class', 'toolbox');
        darkModeIsOn = false;
    }
}

let accessibilityModeIsOn = false;
function accModeSwitch() {
    let body = document.body;
    let navigate = document.getElementById('navigate');
    if (accessibilityModeIsOn == false) {
        body.setAttribute('class', 'accessibility-mode-on');
        navigate.setAttribute('class', 'navigate-accessibility');
        document.getElementById('content').setAttribute('class', 'content-a11y');
        document.getElementById('toolbox').setAttribute('class', 'toolbox-a11y');
        accessibilityModeIsOn = true;
    }
    else {
        body.setAttribute('class', '');
        navigate.setAttribute('class', 'navigate');
        document.getElementById('content').setAttribute('class', 'content');
        document.getElementById('toolbox').setAttribute('class', 'toolbox');
        accessibilityModeIsOn = false;
    }
}

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

function hello() { console.log("Wow, you found me!") }

function randomQuote() {
    let quotes = [
        '已有的事后必再有，已行的事后必再行，日光之下并无新事。——《圣经·传道书》1:9',
        '给岁月以文明，而不是给文明以岁月。——刘慈欣《三体·黑暗森林》',
        '可以搞艺术，但是没必要。',
        '如此生活三十年，直到大厦崩塌。——万能青年旅店《杀死那个石家庄人》',
        '……可谁爱我呢？——老舍《茶馆》',
        '还好，一切如愿以偿。——《红雪》',
        '每逢你想要批评任何人的时候，要记住，这个世界上并非所有的人，都有你拥有的那些优势。——菲茨杰拉德《了不起的盖茨比》',
        '权力导致腐败，绝对权力导致绝对腐败——阿克顿勋爵'
    ];
    let pick = getRandomInt(0, quotes.length);
    document.getElementById('randomQuote').innerHTML = quotes[pick];
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function tagNotes() {
    let notesInText = document.querySelectorAll('.note')
    notesInText.forEach((note) => {
        let nth = note.textContent
        if(nth == ''){
            nth = note.getAttribute('nth')
        }
        note.setAttribute('id', `note-${nth}`)
        note.setAttribute('onclick', `showNote(${nth})`)
        note.addEventListener('mouseenter', () => {
            showNote(nth)
        })
        note.addEventListener('mouseleave', () => {
            offNote(nth)
        })
        note.innerHTML = `<a href="javascript:;" onclick="showNote(${nth})">${nth}</a>`
    })
}

function showNote(index) {
    let content = document.querySelector(`#footnote-${index}`).innerHTML
    let box = document.querySelector('.tooltip')
    box.innerHTML = content
    box.style.opacity = 1
    document.addEventListener('mousemove', e => {
        box.style.left = e.clientX + 10 + 'px'
        box.style.top = e.clientY + 10 + 'px'
    })
}

function offNote(index) {
    let box = document.querySelector('.tooltip')
    box.style.opacity = 0
}

document.querySelector('.toolbox-grip').addEventListener('click', () => {
    let toolbox = document.querySelector('#toolbox')
    if(!toolbox.classList.contains('show')){
        toolbox.classList.add('show')
        document.querySelector('.toolbox-grip').textContent = '>>>'
    }else{
        toolbox.classList.remove('show')
        document.querySelector('.toolbox-grip').textContent = '|||'
    }
})