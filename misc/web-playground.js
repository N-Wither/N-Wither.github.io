// MOBA Scoreboard Control Panel
// So many objects...
let editBoard = document.getElementById('edit-board')
let gameTimeMin = document.getElementById('moba-time-min')
let gameTimeSec = document.getElementById('moba-time-sec')
let gameTimeMinB = document.getElementById('moba-time-min-b')
let gameTimeSecB = document.getElementById('moba-time-sec-b')
let leagueLogoUrl = document.getElementById('league-logo-url')
let leagueLogoImg = document.getElementById('league-logo-img')
let leagueLogoFilter = true

let teamBlueName = document.getElementById('moba-blue-team-name')
let teamBlueNameText = document.getElementById('blue-team-name-text')
let teamBluePos = document.getElementById('moba-blue-team-position')
let teamBluePosText = document.getElementById('blue-team-pos-text')
let teamBlueScore = document.getElementById('moba-blue-score')
let teamBlueScoreBtnAdd = document.getElementById('moba-blue-score-up')
let teamBlueScoreBtnMin = document.getElementById('moba-blue-score-down')
let teamBlueTurretInput = document.getElementById('moba-blue-tower')
let teamBlueTurret = document.getElementById('blue-team-turret')
let teamBlueTurretBtnAdd = document.getElementById('moba-blue-tower-up')
let teamBlueTurretBtnMin = document.getElementById('moba-blue-tower-down')
let teamBlueGold = document.getElementById('blue-team-gold')
let teamBlueGoldInput = document.getElementById('moba-blue-gold')
let teamBlueKill = document.getElementById('blue-team-kill')
let teamBlueKillInput = document.getElementById('moba-blue-kill')
let teamBlueKillUp = document.getElementById('moba-blue-kill-up')
let teamBlueKillDn = document.getElementById('moba-blue-kill-down')
let teamBlueDragons = document.getElementById('team-blue-dragons')
let teamBlueDragonsInput = document.getElementById('moba-blue-dragons')
let teamBlueLogo = document.getElementById('blue-team-logo-url')
let teamBlueWL = document.getElementById('team-blue-w-l')
let teamBlueFilter = document.getElementById('blue-team-logo-filter')
let teamBlueFilterOn = true
let teamBlueColor = document.getElementById('team-blue-color')

let teamRedName = document.getElementById('moba-red-team-name')
let teamRedNameText = document.getElementById('red-team-name-text')
let teamRedPos = document.getElementById('moba-red-team-position')
let teamRedPosText = document.getElementById('red-team-pos-text')
let teamRedScore = document.getElementById('moba-red-score')
let teamRedScoreBtnAdd = document.getElementById('moba-red-score-up')
let teamRedScoreBtnMin = document.getElementById('moba-red-score-down')
let teamRedTurretInput = document.getElementById('moba-red-tower')
let teamRedTurret = document.getElementById('red-team-turret')
let teamRedTurretBtnAdd = document.getElementById('moba-red-tower-up')
let teamRedTurretBtnMin = document.getElementById('moba-red-tower-down')
let teamRedGold = document.getElementById('red-team-gold')
let teamRedGoldInput = document.getElementById('moba-red-gold')
let teamRedKill = document.getElementById('red-team-kill')
let teamRedKillInput = document.getElementById('moba-red-kill')
let teamRedKillUp = document.getElementById('moba-red-kill-up')
let teamRedKillDn = document.getElementById('moba-red-kill-down')
let teamRedDragons = document.getElementById('team-red-dragons')
let teamRedDragonsInput = document.getElementById('moba-red-dragons')
let teamRedLogo = document.getElementById('red-team-logo-url')
let teamRedWL = document.getElementById('team-red-w-l')
let teamRedFilter = document.getElementById('red-team-logo-filter')
let teamRedFilterOn = true
let teamRedColor = document.getElementById('team-red-color')

let timerID; // 计时器 ID
let timerCount = 0; // 计时器计数器
let timerRunning = false; // 标记计时器是否正在运行

// 获取按钮和 div 元素
let timerButton = document.getElementById('moba-time-btn');

// 定义按下按钮时的回调函数
timerButton.onclick = function() {
    if(!editBoard.checked) return;
    if (timerRunning) {
        // 如果计时器正在运行，则暂停计时器
        clearInterval(timerID);
        timerRunning = false;
    } else {
        // 否则启动计时器
        timerID = setInterval(updateTimer, 1000);
        timerRunning = true;
    }
}

// 更新计时器计数器并更新 div 中的文本
function updateTimer() {
    timerCount = parseInt(gameTimeMin.value) * 60 + parseInt(gameTimeSec.value)
    timerCount++;
    let sec = timerCount % 60
    let min = Math.floor(timerCount / 60)
    gameTimeMin.value = min
    gameTimeSec.value = sec
    gameTimeMinB.innerHTML = formatNum(min)
    gameTimeSecB.innerHTML = formatNum(sec)
}

editBoard.addEventListener('change', () => {
    refreshBoard()
})

function stringMultiply(str, num){
    let result = ''
    for(i = 1; i <= num; i++){
        result = result + str
    }
    return result
}

function getBestOf(){
    let bo = document.getElementById('moba-bo').value
    return bo
}

function getScoreToWin(){
    return Math.ceil(parseInt(getBestOf())/2)
}

function antiNegativeNum(num){
    if(num <= 0){return 0}
    else return num
}

function formatNum(num){
    num = num || 0
    if(num < 10){
        return '0' + num
    }
    else return num
}

function setScore(num, team){
    let bestOf = getBestOf()
    let score = num
    let scoreToWin = Math.ceil(bestOf/2)
    if(score > scoreToWin){
        score = scoreToWin
    }
    if(score < 0){
        score = 0
    }
    let scoreHTML = stringMultiply(`<div class="score-${team}"></div>`, score) + stringMultiply(`<div class="score-blank"></div>`, scoreToWin - score)
    document.getElementById(`team-${team}-score`).innerHTML = scoreHTML
}

function setDragon(dragons, team){
    if(!editBoard.checked) return;
    let HTML = ''
    let dragonList = dragons.trim().split(' ')
    if(dragons === ''){
        dragonList = []
    }
    // console.log(dragonList)
    dragonList.forEach(dragon => {
        HTML = HTML + `<span class="drake-${dragon}">&#xf6d5;</span>`
    })
    document.getElementById(`team-${team}-dragons`).innerHTML = HTML
}

function addDragon(team, dragon){
    if(!editBoard.checked) return
    if(team == 'blue'){
        teamBlueDragonsInput.value = teamBlueDragonsInput.value + dragon + ' '
    }
    if(team == 'red'){
        teamRedDragonsInput.value = teamRedDragonsInput.value + dragon + ' '
    }
}

function setNumCap(target, min, max){
    target.min = min
    target.max = max
}

function clearGameTime(){
    gameTimeMin.value = 0
    gameTimeMinB.innerHTML = '00'
    gameTimeSec.value = 0
    gameTimeSecB.innerHTML = '00'
    timerCount = 0
}

function addGold(team, gold){
    if(!editBoard.checked) return;
    if(team == 'blue'){
        teamBlueGoldInput.value = parseFloat((parseFloat(teamBlueGoldInput.value) + gold).toFixed(1))
        if(teamBlueGoldInput.value <= 0){
            teamBlueGoldInput.value = '0.0'
        }
        teamBlueGold.innerHTML = parseFloat(teamBlueGoldInput.value).toFixed(1) + 'K'
    }
    if(team == 'red'){
        teamRedGoldInput.value = parseFloat((parseFloat(teamRedGoldInput.value) + gold).toFixed(1))
        if(teamRedGoldInput.value <= 0){
            teamRedGoldInput.value = '0.0'
        }
        teamRedGold.innerHTML = parseFloat(teamRedGoldInput.value).toFixed(1) + 'K'
    }
}

document.getElementById('league-logo-filter-btn').onclick = () => {
    if(leagueLogoFilter){
        document.getElementById('league-logo-img').style.filter = 'none'
        leagueLogoFilter = false
    }else{
        document.getElementById('league-logo-img').style.filter = 'brightness(0) invert()'
        leagueLogoFilter = true
    }
}

function refreshBoard(){
    let bestOf = 5
    document.getElementById('moba-bo').addEventListener('input', () =>{
        bestOf = document.getElementById('moba-bo').value
    })
    if(!editBoard.checked){return}

    gameTimeMin.addEventListener(('change', 'input'), () => {
        if(gameTimeMin.value == ''){
            gameTimeMin.value = 0
        }
        gameTimeMinB.innerHTML = '' + formatNum(parseInt(gameTimeMin.value))
    })
    gameTimeSec.addEventListener(('change', 'input'), () => {
        if(gameTimeSec.value == ''){
            gameTimeSec.value = 0
        }
        if(gameTimeSec.value == 60){
            gameTimeSec.value = 0
            gameTimeMin.value++
            gameTimeMinB.innerHTML = formatNum(gameTimeMin.value)
        }
        if(gameTimeSec.value == -1){
            if(gameTimeMin.value == 0){
                gameTimeSec.value = 0
                return
            };
            gameTimeSec.value = 59
            gameTimeMin.value--
            gameTimeMinB.innerHTML = formatNum(gameTimeMin.value)
        }
        if(parseInt(gameTimeSec.value) < 10){
            gameTimeSecB.innerHTML = '0' + parseInt(gameTimeSec.value)
        }else{
            gameTimeSecB.innerHTML = gameTimeSec.value
        }
    })

    leagueLogoUrl.addEventListener(('change', 'input'), () => {
        leagueLogoImg.src = leagueLogoUrl.value
    })

    // All about blue team
    teamBlueName.addEventListener('input', () => {
        teamBlueNameText.innerHTML = teamBlueName.value
    })
    teamBluePos.addEventListener('input', () => {
        teamBluePosText.innerHTML = teamBluePos.value
    })
    teamBlueScore.addEventListener(('change', 'input'), () => {
        let score = teamBlueScore.value
        setNumCap(teamBlueScore, 0, getScoreToWin())
        setScore(score, 'blue')
    })
    teamBlueScoreBtnAdd.addEventListener('click', () => {
        if(teamBlueScore.value >= getScoreToWin()){return}
        setNumCap(teamBlueScore, 0, getScoreToWin())
        teamBlueScore.value++
        setScore(teamBlueScore.value, 'blue')
    })
    teamBlueScoreBtnMin.addEventListener('click', () => {
        if(teamBlueScore.value <= 0){return}
        setNumCap(teamBlueScore, 0, getScoreToWin())
        teamBlueScore.value--
        setScore(teamBlueScore.value, 'blue')
    })
    teamBlueTurretInput.addEventListener(('change', 'input'), () => {
        teamBlueTurretInput.value = antiNegativeNum(teamBlueTurretInput.value)
        teamBlueTurret.innerHTML = antiNegativeNum(teamBlueTurretInput.value)
    })
    teamBlueTurretBtnAdd.addEventListener('click', () => {
        teamBlueTurretInput.value ++
        teamBlueTurretInput.value = antiNegativeNum(teamBlueTurretInput.value)
        teamBlueTurret.innerHTML = teamBlueTurretInput.value
    })
    teamBlueTurretBtnMin.addEventListener('click', () => {
        teamBlueTurretInput.value --
        teamBlueTurretInput.value = antiNegativeNum(teamBlueTurretInput.value)
        teamBlueTurret.innerHTML = antiNegativeNum(teamBlueTurretInput.value)
    })
    teamBlueGoldInput.addEventListener(('change', 'input'), () => {
        teamBlueGold.innerHTML = parseFloat(teamBlueGoldInput.value).toFixed(1) + 'K'
    })
    teamBlueKillInput.addEventListener(('change', 'input'), () => {
        teamBlueKillInput.value = antiNegativeNum(teamBlueKillInput.value)
        teamBlueKill.innerHTML = teamBlueKillInput.value
    })
    teamBlueKillUp.addEventListener('click', () => {
        teamBlueKillInput.value ++
        teamBlueKillInput.value = antiNegativeNum(teamBlueKillInput.value)
        teamBlueKill.innerHTML = teamBlueKillInput.value
    })
    teamBlueKillDn.addEventListener('click', () => {
        teamBlueKillInput.value --
        teamBlueKillInput.value = antiNegativeNum(teamBlueKillInput.value)
        teamBlueKill.innerHTML = teamBlueKillInput.value
    })
    teamBlueDragonsInput.addEventListener(('change', 'input'), () => {
        let dragons = teamBlueDragonsInput.value
        setDragon(dragons, 'blue')
    })
    teamBlueFilter.addEventListener('change', () => {
        if(teamBlueFilterOn){
            teamBlueFilterOn = false
        }
        else teamBlueFilterOn = true
        if(!teamBlueFilterOn){
            document.getElementById('blue-team-logo').style.filter = 'none'
        }
        else{
            document.getElementById('blue-team-logo').style.filter = 'brightness(0) invert()'
        }
    })
    teamBlueLogo.addEventListener(('change', 'input'), () => {
        let url = teamBlueLogo.value
        let logo = document.getElementById('blue-team-logo')
        logo.src = url
        logo.alt = teamBlueName.value
    })
    teamBlueWL.addEventListener(('change', 'input'), () => {
        document.getElementById(`team-blue-score`).innerHTML = teamBlueWL.value
    })
    teamBlueColor.addEventListener(('input', 'change'), () => {
        let color = teamBlueColor.value
        document.getElementById('team-blue-logo-bg').style.backgroundColor = color
    })

    //All about red team
    teamRedName.addEventListener('input', () => {
        teamRedNameText.innerHTML = teamRedName.value
    })
    teamRedPos.addEventListener('input', () => {
        teamRedPosText.innerHTML = teamRedPos.value
    })
    teamRedScore.addEventListener(('change', 'input'), () => {
        setNumCap(teamRedScore, 0, getScoreToWin())
        let score = teamRedScore.value
        setScore(score, 'red')
    })
    teamRedScoreBtnAdd.addEventListener('click', () => {
        if(teamRedScore.value >= getScoreToWin()){return}
        // setNumCap(teamRedScore, 0, getScoreToWin())
        teamRedScore.value++
        setScore(teamRedScore.value, 'red')
    })
    teamRedScoreBtnMin.addEventListener('click', () => {
        if(teamRedScore.value <= 0){return}
        // (teamRedScore, 0, getScoreToWin())
        teamRedScore.value--
        setScore(teamRedScore.value, 'red')
    })
    teamRedTurretInput.addEventListener(('change', 'input'), () => {
        teamRedTurretInput.value = antiNegativeNum(teamRedTurretInput.value)
        teamRedTurret.innerHTML = teamRedTurretInput.value
    })
    teamRedTurretBtnAdd.addEventListener('click', () => {
        teamRedTurretInput.value ++
        teamRedTurretInput.value = antiNegativeNum(teamRedTurretInput.value)
        teamRedTurret.innerHTML = teamRedTurretInput.value
    })
    teamRedTurretBtnMin.addEventListener('click', () => {
        teamRedTurretInput.value --
        teamRedTurretInput.value = antiNegativeNum(teamRedTurretInput.value)
        teamRedTurret.innerHTML = teamRedTurretInput.value
    })
    teamRedGoldInput.addEventListener(('change', 'input'), () => {
        teamRedGold.innerHTML = parseFloat(teamRedGoldInput.value).toFixed(1) + 'K'
    })
    teamRedKillInput.addEventListener(('change', 'input'), () => {
        teamRedKill.innerHTML = antiNegativeNum(teamRedKillInput.value)
    })
    teamRedKillUp.addEventListener('click', () => {
        teamRedKillInput.value ++
        teamRedKillInput.value = antiNegativeNum(teamRedKillInput.value)
        teamRedKill.innerHTML = teamRedKillInput.value
    })
    teamRedKillDn.addEventListener('click', () => {
        teamRedKillInput.value --
        teamRedKillInput.value = antiNegativeNum(teamRedKillInput.value)
        teamRedKill.innerHTML = teamRedKillInput.value
    })
    teamRedDragonsInput.addEventListener(('change', 'input'), () => {
        let dragons = teamRedDragonsInput.value
        setDragon(dragons, 'red')
    })
    teamRedFilter.addEventListener('change', () => {
        if(teamRedFilterOn){
            teamRedFilterOn = false
        }
        else teamRedFilterOn = true
        if(!teamRedFilterOn){
            document.getElementById('red-team-logo').style.filter = 'none'
        }
        else{
            document.getElementById('red-team-logo').style.filter = 'brightness(0) invert()'
        }
    })
    teamRedLogo.addEventListener(('change', 'input'), () => {
        let url = teamRedLogo.value
        document.getElementById('red-team-logo').src = url
        document.getElementById('red-team-logo').alt = teamRedName.value
    })
    teamRedWL.addEventListener('input', () => {
        document.getElementById(`team-red-score`).innerHTML = teamRedWL.value
    })
    teamRedColor.addEventListener(('input', 'change'), () => {
        let color = teamRedColor.value
        document.getElementById('team-red-logo-bg').style.backgroundColor = color
    })
}