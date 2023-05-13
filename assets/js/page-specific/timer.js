// Display Elements
let timerHour = document.getElementById('timer-hr')
let timerMin = document.getElementById('timer-mn')
let timerSec = document.getElementById('timer-sc')

// Control Elements
let timerHourInput = document.getElementById('timer-hr-input')
let timerMinInput = document.getElementById('timer-mn-input')
let timerSecInput = document.getElementById('timer-sc-input')
let countDownCheck = document.getElementById('countdown-check')
let theButton = document.getElementById('button')
let clearButton = document.getElementById('clear')
let dispHourCheck = document.getElementById('show-hour-check')
let isCountDown = false
let displayHour = true

// Functions
function antiNegativeNum(num) {
    if (num <= 0) { return 0 }
    else return num
}

let timerID; // 计时器 ID
let timerCount = 0; // 计时器计数器
let timerRunning = false; // 标记计时器是否正在运行

// 获取按钮和 div 元素
let timerButton = document.getElementById('moba-time-btn');

// 定义按下按钮时的回调函数
theButton.onclick = function () {
    if (timerRunning) {
        // 如果计时器正在运行，则暂停计时器
        clearInterval(timerID);
        timerRunning = false;
        theButton.textContent = 'Start'
    } else {
        // 否则启动计时器
        timerID = setInterval(updateTimer, 1000);
        timerRunning = true;
        theButton.textContent = 'Pause'
    }
}

// 更新计时器计数器并更新 div 中的文本
function updateTimer() {
    timerCount = parseInt(timerHourInput.value) * 3600 + parseInt(timerMinInput.value) * 60 + parseInt(timerSecInput.value)
    if(!isCountDown) timerCount ++;
    else timerCount --;
    if(timerCount <= 0) timerCount = 0;
    let hour = Math.floor(timerCount / 3600)
    let min = Math.floor((timerCount - hour * 3600) / 60)
    let sec = timerCount % 60
    timerHourInput.value = hour
    timerMinInput.value = min
    timerSecInput.value = sec
    timerHour.innerHTML = checkTime(hour)
    timerMin.innerHTML = checkTime(min)
    timerSec.innerHTML = checkTime(sec)
    document.title = checkTime(hour) + ':' + checkTime(min) + ':' + checkTime(sec)
    if(timerCount < 3600 && !displayHour) {
        document.querySelectorAll('.timer-hour').forEach(element => {
            element.innerHTML = ''
            document.title = checkTime(min) + ':' + checkTime(sec)
        })
    }
}

// addEventListeners
timerHourInput.addEventListener(('change', 'input'), () => {
    timerHourInput.value = antiNegativeNum(timerHourInput.value)
    timerHour.innerHTML = checkTime(timerHourInput.value)
})
timerMinInput.addEventListener(('change', 'input'), () => {
    if(timerMinInput.value == '') timerMinInput.value = 0;
    if(timerMinInput.value == 60){
        timerMinInput.value = 0
        timerHourInput.value ++
        timerHour.innerHTML = checkTime(timerHourInput.value)
    }
    if(timerMinInput.value == -1){
        if(timerHourInput.value == 0){
            timerMinInput.value = 0
            return
        }
        timerMinInput.value = 59
        timerHourInput.value --
        timerHour.innerHTML = checkTime(timerHourInput.value)
    }
    timerMin.innerHTML = checkTime(timerMinInput.value)
})
timerSecInput.addEventListener(('change', 'input'), () => {
    if(timerSecInput.value == '') timerSecInput.value = 0;
    if(timerSecInput.value == 60){
        timerSecInput.value = 0
        timerMinInput.value ++
        if(timerMinInput.value == 60){
            timerMinInput.value = 0
            timerHourInput.value ++
            timerHour.innerHTML = checkTime(timerHourInput.value)
        }
        timerMin.innerHTML = checkTime(timerMinInput.value)
    }
    if(timerSecInput.value == -1){
        if(timerHourInput.value != 0){
            if(timerMinInput.value == 0){
                timerHourInput.value --
                timerMinInput.value = 59
                timerSecInput.value = 59
                timerHour.innerHTML = checkTime(timerHourInput.value)
                timerMin.innerHTML = checkTime(timerMinInput.value)
                timerSec.innerHTML = checkTime(timerSecInput.value)
                return
            }
        }
        else {
            if(timerMinInput.value == 0){
                timerSecInput.value = 0
                return
            }
        }
        timerSecInput.value = 59
        timerMinInput.value --
        timerMin.innerHTML = checkTime(timerMinInput.value)
    }
    timerSec.innerHTML = checkTime(timerSecInput.value)
})
clearButton.onclick = () => {
    timerHour.innerHTML = '00'
    timerMin.innerHTML = '00'
    timerSec.innerHTML = '00'
    document.getElementById('timer-separator-hour').innerHTML = ':'
    timerHourInput.value = 0
    timerMinInput.value = 0
    timerSecInput.value = 0
}
countDownCheck.addEventListener(('click', 'change'), () => {
    isCountDown = !isCountDown
})
dispHourCheck.addEventListener(('click', 'change'), () => {
    displayHour = !displayHour
})