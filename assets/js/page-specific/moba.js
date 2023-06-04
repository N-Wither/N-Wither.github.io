const MobaScoreboardApp = {
    data() {
        return {
            global: {
                bestOf: 5,
                time: 2523,
                timing: false,
                timer: null,
                leagueLogo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/e/e9/Worlds.png',
                logoFilter: true,
                goldDiff: -1.1,
                theme: 'dark'
            },
            teamBlue: {
                name: 'T1',
                logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/7/78/T1logo_profile.png',
                logoFilter: true,
                pos: 'LCK#2',
                score: '2',
                winLose: '',
                color: '#48d1cc',
                kills: '10',
                gold: 71.8,
                towers: 8,
                dragons: ['infernal', 'mountain'],
                baron: 0,
                baronTime: 0,
                baronTimer: null,
                elder: 0,
                elderTime: 0,
                elderTimer: null
            },
            teamRed: {
                name: 'DRX',
                logo: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/d3/DRXlogo_square.png',
                logoFilter: true,
                pos: 'LCK#4',
                score: '2',
                winLose: '',
                color: '#dc143c',
                kills: '18',
                gold: 72.9,
                towers: 6,
                dragons: ['ocean', 'mountain', 'mountain', 'mountain'],
                baron: 0,
                baronTime: 0,
                baronTimer: null,
                elder: 0,
                elderTime: 0,
                elderTimer: null
            },
            themes: {
                dark: {
                    backgroundColor: '#333333',
                    blueColor: '#48d1cc',
                    redColor: 'crimson',
                    blueLogo: '#48d1cc',
                    redLogo: 'crimson',
                    textColor: 'white'
                },
                light: {
                    backgroundColor: '#FFFFFF',
                    blueColor: '#48d1cc',
                    redColor: 'crimson',
                    blueLogo: '#48d1cc',
                    redLogo: 'crimson',
                    textColor: '#333333'
                },
                lpl: {
                    backgroundColor: '#1a1e1e',
                    blueColor: '#78d0cf',
                    redColor: '#eb1846',
                    blueLogo: '#1a1e1e',
                    redLogo: '#1a1e1e',
                    textColor: '#f6f6f6'
                },
                lck: {
                    backgroundColor: '#171622',
                    blueColor: '#4b6bf9',
                    redColor: '#f11c0b',
                    blueLogo: 'linear-gradient(to bottom, #4b6bf9, #171622)',
                    redLogo: 'linear-gradient(to bottom, #f11c0b, #171622)',
                    textColor: 'white'
                },
                lec: {
                    backgroundColor: '#020219',
                    blueColor: '#00cbb9',
                    redColor: '#ff5c15',
                    blueLogo: '#00cbb9',
                    redLogo: '#ff5c15',
                    textColor: 'white'
                },
                lcs: {
                    backgroundColor: '#070707',
                    blueColor: '#3395b8',
                    redColor: '#b60f33',
                    blueLogo: '#070707',
                    redLogo: '#070707',
                    textColor: 'white'
                },
                msi23: {
                    backgroundColor: '#020001',
                    blueColor: '#aaaa77',
                    redColor: '#fe0000',
                    blueLogo: '#aaaa77',
                    redLogo: '#fe0000',
                    textColor: '#fff1e6'
                },
            }
        }
    },

    methods: {
        setLeagueLogo() {
            document.querySelector('#league-logo-img').setAttribute('src', this.global.leagueLogo)
        },
        getGoldDiff() {
            this.global.goldDiff = (this.teamBlue.gold - this.teamRed.gold).toFixed(1)
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
                this.stringMultiply(`<div class="score-${team}" style="background:${this.themes[this.global.theme][`${team.slice(4).toLowerCase()}Color`]}"></div>`, score) +
                this.stringMultiply(`<div class="score-blank"></div>`, scoreToWin - score)
            document.getElementById(`${team}-score`).innerHTML = scoreHTML
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
            let blues = document.querySelectorAll('.team-blue-stat')
            let reds = document.querySelectorAll('.team-red-stat')
            let bg = document.querySelectorAll('.row-1')
            let blueLogoBg = document.querySelector('#teamBlue-logo-bg')
            let redLogoBg = document.querySelector('#teamRed-logo-bg')
            let blueScores = document.querySelectorAll('.score-blue')
            let redScores = document.querySelectorAll('.score-red')

            blues.forEach(ele => {
                ele.style.color = this.themes[theme].blueColor
            })
            reds.forEach(ele => {
                ele.style.color = this.themes[theme].redColor
            })
            bg.forEach(ele => {
                ele.style['background-color'] = this.themes[theme].backgroundColor
                ele.style.color = this.themes[theme].textColor
            })
            blueLogoBg.style.background = this.themes[theme].blueLogo
            redLogoBg.style.background = this.themes[theme].redLogo
            blueScores.forEach(ele => {
                ele.style['background-color'] = this.themes[theme].blueColor
            })
            redScores.forEach(ele => {
                ele.style['background-color'] = this.themes[theme].redColor
            })
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
            document.getElementById(`${team}-${type}-bar`).style.width = '100%'
            this[team][`${type}Timer`] = setInterval(() => {
                if(this.global.timing == false) return;
                this[team][`${type}Time`] --
                document.getElementById(`${team}-${type}-bar`).style = `width: calc(100% * ${this[team][`${type}Time`]} / ${maxTime})`
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
                document.getElementById(`${team}-${type}-bar`).style = `width: 0`
            }
            else return
        },
        setColor(team){
            document.getElementById(`${team}-logo-bg`).style.background = this[team].color
        },
        clearAll(){
            this.clearGameTimer()
            this.global.leagueLogo = ''
            this.global.goldDiff = 0
            let teams = ['teamBlue', 'teamRed']
            teams.forEach(team => {
                this[team].name = ''
                this[team].pos = ''
                this[team].logo = ''
                this[team].score = 0
                this[team].kills = 0
                this[team].gold = 2.5
                this[team].towers = 0
                this[team].dragons = []
                this.removeBuff(team, 'baron')
                this.removeBuff(team, 'elder')
                this[team].baron = 0
                this[team].elder = 0
            })
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
            document.getElementById('teamBlue-score').innerHTML = blueWL.value
        })
        redWL.addEventListener(('change', 'input'), () => {
            document.getElementById('teamRed-score').innerHTML = redWL.value
        })
    }
}

Vue.createApp(MobaScoreboardApp).mount('#scoreboard')