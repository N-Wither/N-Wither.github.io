const MobaScoreboardApp = {
    data() {
        return {
            global: {
                bestOf: 5,
                time: 2523,
                timing: false,
                timer: null,
                leagueLogo: 'https://n-wither.github.io/assets/imgs/lol/worlds.png',
                logoFilter: 'filter-white',
                goldDiff: -1.1,
                theme: 'dark',
                goldDiffOverTime: {
                    x: [0],
                    y: [0]
                }
            },
            teamBlue: {
                name: 'T1',
                logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/7/78/T1logo_profile.png',
                logoFilter: 'filter-white',
                pos: 'LCK#2',
                score: 2,
                winLose: '',
                color: '#48d1cc',
                kills: 10,
                gold: 71.8,
                towers: 8,
                dragons: ['infernal', 'mountain'],
                baron: 2,
                baronTime: 0,
                baronTimer: null,
                elder: 0,
                elderTime: 0,
                elderTimer: null,
                voidGrubs: 0,
                heralds: 0
            },
            teamRed: {
                name: 'DRX',
                logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/d3/DRXlogo_square.png',
                logoFilter: 'filter-white',
                pos: 'LCK#4',
                score: 3,
                winLose: '',
                color: '#dc143c',
                kills: 18,
                gold: 72.9,
                towers: 6,
                dragons: ['ocean', 'mountain', 'mountain', 'mountain'],
                baron: 0,
                baronTime: 0,
                baronTimer: null,
                elder: 1,
                elderTime: 0,
                elderTimer: null,
                voidGrubs: 0,
                heralds: 0
            },
            themes: {
                dark: {},
                light: {},
                lpl: {},
                lck: {},
                lec: {},
                lcs: {teamDefinedScoreColor: true},
                valorant: {},
                worlds: {},
            }
        }
    },

    methods: {
        getGoldDiff() {
            this.global.goldDiff = (this.teamBlue.gold - this.teamRed.gold).toFixed(1)
            return this.global.goldDiff
        },
        addGold(team, amount) {
            let gold = parseFloat(this[team].gold)
            gold += amount
            gold = (gold).toFixed(1)
            this[team].gold = gold
            this.getGoldDiff()
        },
        addDragon(team, type) {
            this.setDragon(team)
            this[team].dragons.push(type)
        },
        setDragon(team) {
            if (typeof this[team].dragons == 'string') {
                this[team].dragons = this[team].dragons.trim().split(',')
            }
        },
        addScore(team, score) {
            let maxScore = Math.ceil(parseInt(this.global.bestOf) / 2)
            if (this[team].score == maxScore && score > 0) return;
            if (this[team].score == 0 && score < 0) return;
            this[team].score = parseInt(this[team].score) + score
            this.setScore(team)
        },
        setScore(team) {
            let score = this[team].score
            let scoreToWin = Math.ceil(this.global.bestOf / 2)
            if (score > scoreToWin) {
                score = scoreToWin
            }
            if (score < 0) {
                score = 0
            }
            let scoreHTML =
                this.stringMultiply(`<div class="score-${team}"></div>`, score) +
                this.stringMultiply(`<div class="score-blank"></div>`, scoreToWin - score)
            let target = `.${team}-score`
            if(this[team].pos == ''){
                target = `.${team}-pos`
                document.querySelectorAll('.teamBlue-score').forEach(el => el.innerHTML = this.teamBlue.winLose)
                document.querySelectorAll('.teamRed-score').forEach(el => el.innerHTML = this.teamRed.winLose)
            }
            document.querySelectorAll(target).forEach(ele => {ele.innerHTML = scoreHTML})
            
            let scoreColor = this.themes[this.global.theme][`${team.slice(4).toLowerCase()}Color`]
            if(this[team].color != scoreColor && this.themes[this.global.theme].teamDefinedScoreColor){
                scoreColor = this[team].color
                document.querySelectorAll(target).forEach(el => {
                    el.querySelectorAll(`.score-${team}`).forEach(child => {
                        child.style.background = scoreColor
                    })
                })
            }
        },
        addTower(team, tower) {
            if (this[team].towers == 0 && tower < 0) return;
            this[team].towers = parseInt(this[team].towers) + tower
        },
        addKill(team, kill) {
            if (this[team].kills == 0 && kill < 0) return;
            this[team].kills = parseInt(this[team].kills) + kill
        },
        setTheme() {
            let theme = document.getElementById('scoreboard-theme').value
            this.global.theme = theme
            document.querySelector('.moba-scoreboard').setAttribute('theme', theme)
            document.querySelector('.moba-scoreboard-mobile').setAttribute('theme', theme)
            if(this.themes[this.global.theme].teamDefinedScoreColor){
                document.querySelectorAll('.teamBlue-logo-bg').forEach(el => {el.style = `background:${this.teamBlue.color}`})
                document.querySelectorAll('.teamRed-logo-bg').forEach(el => {el.style = `background:${this.teamRed.color}`})
            }else {
                document.querySelectorAll('.teamBlue-logo-bg').forEach(el => {el.style = ''})
                document.querySelectorAll('.teamRed-logo-bg').forEach(el => {el.style = ''})
            }
        },
        setBestOf() {
            document.getElementById('moba-blue-score').setAttribute('max', Math.ceil(this.global.bestOf / 2))
            document.getElementById('moba-red-score').setAttribute('max', Math.ceil(this.global.bestOf / 2))
        },
        timeFormat(num, short) {
            let min = Math.floor(num / 60)
            let sec = num % 60
            if (min < 10 && !short) min = '0' + min;
            if (sec < 10) sec = '0' + sec;
            return min + ':' + sec
        },
        stringMultiply(str, num) {
            let result = ''
            for (let i = 1; i <= num; i++) {
                result = result + str
            }
            return result
        },
        toggleGameTimer(){
            if(this.global.timing == false){
                this.global.timer = setInterval(() => {
                    this.global.time ++
                    document.getElementById('moba-time-min').value = Math.floor(this.global.time / 60)
                    document.getElementById('moba-time-sec').value = this.global.time % 60
                }, 1000)
                this.global.timing = true
            }else {
                clearInterval(this.global.timer)
                this.global.timing = false
            }
        },
        clearGameTimer(){
            this.global.time = 0
            document.getElementById('moba-time-min').value = 0
            document.getElementById('moba-time-sec').value = 0
        },
        addBuff(team, type){
            if(this[team][`${type}Time`] != 0) return;
            this[team][type] ++
            let maxTime = 0
            if(type == 'elder') this[team].elderTime = 150, maxTime = 150;
            if(type == 'baron') this[team].baronTime = 180, maxTime = 180;
            document.querySelectorAll(`.${team}-${type}-bar`).forEach(ele => {ele.style.width = '100%'})
            this[team][`${type}Timer`] = setInterval(() => {
                if(this.global.timing == false) return;
                this[team][`${type}Time`] --
                document.querySelectorAll(`.${team}-${type}-bar`).forEach(ele => {ele.style = `width: calc(100% * ${this[team][`${type}Time`]} / ${maxTime})`})
                if(this[team][`${type}Time`] == 0){
                    clearInterval(this[team][`${type}Timer`])
                }
            }, 1000)
        },
        removeBuff(team, type){
            if(this[team][`${type}Time`] == 0 && this[team][type] > 0) this[team][type] --;
            else if(this[team][type] > 0) {
                this[team][`${type}Time`] = 0
                clearInterval(this[team][`${type}Timer`])
                document.querySelectorAll(`.${team}-${type}-bar`).forEach(ele => {ele.style = `width: 0`})
            }
            else return
        },
        setColor(team){
            document.querySelectorAll(`.${team}-logo-bg`).forEach(ele => {
                ele.style.background = this[team].color
            })
        },
        clearAll(){
            this.clearStat()
            this.global.leagueLogo = ''
            let teams = ['teamBlue', 'teamRed']
            teams.forEach(team => {
                this[team].name = ''
                this[team].pos = ''
                this[team].logo = ''
                this[team].score = 0
            })
        },
        clearStat(){
            this.clearGameTimer()
            this.global.goldDiff = 0
            this.global.goldDiffOverTime = {x: [0], y: [0]}
            let teams = ['teamBlue', 'teamRed']
            teams.forEach(team => {
                this[team].kills = 0
                this[team].gold = 2.5
                this[team].towers = 0
                this[team].dragons = []
                this.removeBuff(team, 'baron')
                this.removeBuff(team, 'elder')
                this[team].baron = 0
                this[team].elder = 0
                this[team].voidGrubs = 0
                this[team].heralds = 0
            })
        },
        swapTeam(){
            let temp = this.teamBlue
            this.teamBlue = this.teamRed
            this.teamRed = temp
            this.getGoldDiff()
            if(!this.themes[this.global.theme].teamDefinedScoreColor){
                temp = this.teamBlue.color
                this.teamBlue.color = this.teamRed.color
                this.teamRed.color = temp
            }else{
                this.setColor('teamBlue')
                this.setColor('teamRed')
            }
            this.setScore('teamBlue')
            this.setScore('teamRed')
        },
        plot(){
            this.pushGoldData()

            let trace = {
                x: this.global.goldDiffOverTime.x,
                y: this.global.goldDiffOverTime.y,
                mode: 'lines',
                fill: 'tozeroy',
                name: ''
            }

            let scoreboard = document.querySelector('.moba-scoreboard-mobile')
            let bgColor = this.rgbToHex(getComputedStyle(scoreboard).backgroundColor)

            let layout = {
                title: 'Gold Difference Over Time',
                font: {
                    family: getComputedStyle(scoreboard).fontFamily + ', Metropolis, sans-serif',
                    color: this.rgbToHex(getComputedStyle(scoreboard).color)
                },
                plot_bgcolor: bgColor,
                paper_bgcolor: bgColor,
                margin: {
                    b: 32,
                    l: 32,
                    r: 32,
                    t: 36
                },
                colorway: ['#48d1cc'],
                xaxis: {
                    title: 'Time (min)'
                }
            }

            Plotly.newPlot('ecochart', [trace], layout)
        },
        getCurrentTime(){
            return this.global.time / 60
        },
        pushGoldData(){
            this.global.goldDiffOverTime.y.push(this.getGoldDiff())
            this.global.goldDiffOverTime.x.push(this.getCurrentTime())
        },
        rgbToHex(c){
            let color = '#'
            c.replace('rgb(', '').replace(')', '').split(', ').forEach(num => color += Number(num).toString(16).padStart(2, '0'))
            return color
        },
        addObj(team, thing, count){
            this[team][thing] += count
        }
    },

    mounted() {
        document.getElementById('moba-blue-dragons').addEventListener(('change', 'input'), () => { this.setDragon('teamBlue') })
        document.getElementById('moba-red-dragons').addEventListener(('change', 'input'), () => { this.setDragon('teamRed') })
        let timeMin = document.getElementById('moba-time-min')
        let timeSec = document.getElementById('moba-time-sec')
        timeMin.value = Math.floor(this.global.time / 60)
        timeSec.value = this.global.time % 60
        timeMin.addEventListener(('change', 'input'), () => {
            if (timeMin.value == '') timeMin.value = 0;
            this.global.time = 60 * parseInt(timeMin.value) + parseInt(timeSec.value)
        })
        timeSec.addEventListener(('change', 'input'), () => {
            if (timeSec.value == '') timeSec.value = 0;
            if (timeSec.value > 59) {
                timeSec.value = 0
                timeMin.value++
            }
            if (timeSec.value < 0) {
                timeSec.value = 59
                timeMin.value--
            }
            this.global.time = 60 * parseInt(timeMin.value) + parseInt(timeSec.value)
        })
        let blueWL = document.getElementById('team-blue-w-l')
        let redWL = document.getElementById('team-red-w-l')
        blueWL.addEventListener(('change', 'input'), () => {
            document.querySelectorAll('.teamBlue-score').forEach(ele => {ele.innerHTML = blueWL.value})
        })
        redWL.addEventListener(('change', 'input'), () => {
            document.querySelectorAll('.teamRed-score').forEach(ele => {ele.innerHTML = redWL.value})
        })
    }
}

Vue.createApp(MobaScoreboardApp).mount('#scoreboard')