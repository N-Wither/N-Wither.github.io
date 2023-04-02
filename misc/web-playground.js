// MOBA Scoreboard Control Panel
// So many objects...
let editBoard = document.getElementById('edit-board')
let gameTimeMin = document.getElementById('moba-time-min')
let gameTimeSec = document.getElementById('moba-time-sec')
let gameTimeMinB = document.getElementById('moba-time-min-b')
let gameTimeSecB = document.getElementById('moba-time-sec-b')

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
let teamBlueGoldUp = document.getElementById('moba-blue-gold-up')
let teamBlueGoldDn = document.getElementById('moba-blue-gold-down')
let teamBlueKill = document.getElementById('blue-team-kill')
let teamBlueKillInput = document.getElementById('moba-blue-kill')
let teamBlueKillUp = document.getElementById('moba-blue-kill-up')
let teamBlueKillDn = document.getElementById('moba-blue-kill-down')
let teamBlueDragons = document.getElementById('team-blue-dragons')
let teamBlueDragonsInput = document.getElementById('moba-blue-dragons')
let teamBlueLogo = document.getElementById('blue-team-logo-url')
let teamBlueWL = document.getElementById('team-blue-w-l')

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
let teamRedGoldUp = document.getElementById('moba-red-gold-up')
let teamRedGoldDn = document.getElementById('moba-red-gold-down')
let teamRedKill = document.getElementById('red-team-kill')
let teamRedKillInput = document.getElementById('moba-red-kill')
let teamRedKillUp = document.getElementById('moba-red-kill-up')
let teamRedKillDn = document.getElementById('moba-red-kill-down')
let teamRedDragons = document.getElementById('team-red-dragons')
let teamRedDragonsInput = document.getElementById('moba-red-dragons')
let teamRedLogo = document.getElementById('red-team-logo-url')
let teamRedWL = document.getElementById('team-red-w-l')

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
    if(team == 'blue'){
        teamBlueDragonsInput.value = teamBlueDragonsInput.value + dragon + ' '
    }
    if(team == 'red'){
        teamRedDragonsInput.value = teamRedDragonsInput.value + dragon + ' '
    }
}

function refreshBoard(){
    let bestOf = 5
    document.getElementById('moba-bo').addEventListener('input', () =>{
        bestOf = document.getElementById('moba-bo').value
    })
    if(!editBoard.checked){return}

    gameTimeMin.addEventListener('input', () => {
        if(gameTimeMin.value < 10){
            gameTimeMinB.innerHTML = '0' + gameTimeMin.value
        }else{
            gameTimeMinB.innerHTML = gameTimeMin.value
        }
    })
    gameTimeSec.addEventListener('input', () => {
        if(parseInt(gameTimeSec.value) < 10){
            gameTimeSecB.innerHTML = '0' + gameTimeSec.value
        }else{
            gameTimeSecB.innerHTML = gameTimeSec.value
        }
    })

    // All about blue team
    teamBlueName.addEventListener('input', () => {
        teamBlueNameText.innerHTML = teamBlueName.value
    })
    teamBluePos.addEventListener('input', () => {
        teamBluePosText.innerHTML = teamBluePos.value
    })
    teamBlueScore.addEventListener('change', () => {
        let score = teamBlueScore.value
        setScore(score, 'blue')
    })
    teamBlueScoreBtnAdd.addEventListener('click', () => {
        teamBlueScore.value++
        setScore(teamBlueScore.value, 'blue')
    })
    teamBlueScoreBtnMin.addEventListener('click', () => {
        teamBlueScore.value--
        setScore(teamBlueScore.value, 'blue')
    })
    teamBlueTurretInput.addEventListener('change', () => {
        teamBlueTurret.innerHTML = teamBlueTurretInput.value
    })
    teamBlueTurretBtnAdd.addEventListener('click', () => {
        teamBlueTurretInput.value ++
        teamBlueTurret.innerHTML = teamBlueTurretInput.value
    })
    teamBlueTurretBtnMin.addEventListener('click', () => {
        teamBlueTurretInput.value --
        teamBlueTurret.innerHTML = teamBlueTurretInput.value
    })
    teamBlueGoldInput.addEventListener('change', () => {
        teamBlueGold.innerHTML = parseFloat(teamBlueGoldInput.value).toFixed(1) + 'K'
    })
    teamBlueGoldUp.addEventListener('click', () => {
        teamBlueGoldInput.value = (parseFloat(teamBlueGoldInput.value) + 0.1).toFixed(1)
        teamBlueGold.innerHTML = teamBlueGoldInput.value + 'K'
    })
    teamBlueGoldDn.addEventListener('click', () => {
        teamBlueGoldInput.value = (parseFloat(teamBlueGoldInput.value) - 0.1).toFixed(1)
        teamBlueGold.innerHTML = teamBlueGoldInput.value + 'K'
    })
    teamBlueKillInput.addEventListener('change', () => {
        teamBlueKill.innerHTML = teamBlueKillInput.value
    })
    teamBlueKillUp.addEventListener('click', () => {
        teamBlueKillInput.value ++
        teamBlueKill.innerHTML = teamBlueKillInput.value
    })
    teamBlueKillDn.addEventListener('click', () => {
        teamBlueKillInput.value --
        teamBlueKill.innerHTML = teamBlueKillInput.value
    })
    teamBlueDragonsInput.addEventListener('change', () => {
        let dragons = teamBlueDragonsInput.value
        setDragon(dragons, 'blue')
    })
    teamBlueLogo.addEventListener('change', () => {
        let url = teamBlueLogo.value
        document.getElementById('blue-team-logo').src = url
        document.getElementById('blue-team-logo').alt = teamBlueName.value
    })
    teamBlueWL.addEventListener('input', () => {
        document.getElementById(`team-blue-score`).innerHTML = teamBlueWL.value
    })

    //All about red team
    teamRedName.addEventListener('input', () => {
        teamRedNameText.innerHTML = teamRedName.value
    })
    teamRedPos.addEventListener('input', () => {
        teamRedPosText.innerHTML = teamRedPos.value
    })
    teamRedScore.addEventListener('change', () => {
        let score = teamRedScore.value
        setScore(score, 'red')
    })
    teamRedScoreBtnAdd.addEventListener('click', () => {
        teamRedScore.value++
        setScore(teamRedScore.value, 'red')
    })
    teamRedScoreBtnMin.addEventListener('click', () => {
        teamRedScore.value--
        setScore(teamRedScore.value, 'red')
    })
    teamRedTurretInput.addEventListener('change', () => {
        teamRedTurret.innerHTML = teamRedTurretInput.value
    })
    teamRedTurretBtnAdd.addEventListener('click', () => {
        teamRedTurretInput.value ++
        teamRedTurret.innerHTML = teamRedTurretInput.value
    })
    teamRedTurretBtnMin.addEventListener('click', () => {
        teamRedTurretInput.value --
        teamRedTurret.innerHTML = teamRedTurretInput.value
    })
    teamRedGoldInput.addEventListener('change', () => {
        teamRedGold.innerHTML = parseFloat(teamRedGoldInput.value).toFixed(1) + 'K'
    })
    teamRedGoldUp.addEventListener('click', () => {
        teamRedGoldInput.value = (parseFloat(teamRedGoldInput.value) + 0.1).toFixed(1)
        teamRedGold.innerHTML = teamRedGoldInput.value + 'K'
    })
    teamRedGoldDn.addEventListener('click', () => {
        teamRedGoldInput.value = (parseFloat(teamRedGoldInput.value) - 0.1).toFixed(1)
        teamRedGold.innerHTML = teamRedGoldInput.value + 'K'
    })
    teamRedKillInput.addEventListener('change', () => {
        teamRedKill.innerHTML = teamRedKillInput.value
    })
    teamRedKillUp.addEventListener('click', () => {
        teamRedKillInput.value ++
        teamRedKill.innerHTML = teamRedKillInput.value
    })
    teamRedKillDn.addEventListener('click', () => {
        teamRedKillInput.value --
        teamRedKill.innerHTML = teamRedKillInput.value
    })
    teamRedDragonsInput.addEventListener('change', () => {
        let dragons = teamRedDragonsInput.value
        setDragon(dragons, 'red')
    })
    teamRedLogo.addEventListener('change', () => {
        let url = teamRedLogo.value
        document.getElementById('red-team-logo').src = url
        document.getElementById('red-team-logo').alt = teamRedName.value
    })
    teamRedWL.addEventListener('input', () => {
        document.getElementById(`team-red-score`).innerHTML = teamRedWL.value
    })
}