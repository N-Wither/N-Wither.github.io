const MilkApp = {
    data() {
        return {
            milk: 0,
            tweenedMilk: {milk: 0},
            manualMilkAmount: 1,
            manualMilkModifier: 1,
            autoMilkAmount: 0,
            autoMilkModifier: 1,
            properties: {
                milkMan: {
                    id: 'milkMan',
                    name: '挤奶工',
                    desc: "从路边招聘的无业人士。",
                    count: 0,
                    base: 10,
                    price: 10,
                    increment: 1.2,
                    productivity: [1, 1]
                },
                autoMilker: {
                    id: 'autoMilker',
                    name: '自动挤奶器',
                    desc: "最新技术的自动挤奶器，榨干你的奶牛。",
                    count: 0,
                    base: 100,
                    price: 100,
                    increment: 1.18,
                    productivity: [5, 3]
                },
                pump: {
                    id: 'pump',
                    name: '泵',
                    desc: "从地下牛奶河抽取牛奶。",
                    count: 0,
                    base: 2000,
                    price: 2000,
                    increment: 1.15,
                    productivity: [50, 20]
                },
                pumpjack: {
                    id: 'pumpjack',
                    name: '牛奶钻井',
                    desc: "从远古地层开采牛奶（以及奶气体）。",
                    count: 0,
                    base: 50000,
                    price: 50000,
                    increment: 1.13,
                    productivity: [300, 150]
                },
                factory: {
                    name: '化工厂',
                    id: 'factory',
                    desc: "使用化工技术合成牛奶。",
                    count: 0,
                    base: 600000,
                    price: 600000,
                    increment: 1.08,
                    productivity: [2000, 1200]
                },
                exchange: {
                    name: '交易所',
                    id: 'exchange',
                    desc: "通过商业资本活动获取牛奶。",
                    count: 0,
                    base: 3000000,
                    price: 3000000,
                    increment: 1.07,
                    productivity: [15000, 8000]
                },
                magic: {
                    name: '魔法师',
                    id: 'magic',
                    desc: "将各种液体变成牛奶。",
                    count: 0,
                    base: 15000000,
                    price: 15000000,
                    increment: 1.06,
                    productivity: [100000, 70000]
                },
                starship: {
                    name: '星舰',
                    id: 'starship',
                    desc: "从银河（Milky Way）运回牛奶。",
                    count: 0,
                    base: 100000000,
                    price: 100000000,
                    increment: 1.06,
                    productivity: [800000, 600000]
                },
                whiteHole: {
                    name: '白洞',
                    id: 'whiteHole',
                    desc: '白洞，白色的明天在等着我们！',
                    count: 0,
                    base: 1600000000,
                    price: 1600000000,
                    increment: 1.05,
                    productivity: [24000000, 18000000]
                }
            },
            upgrades: {
                freshGrass: {
                    id: 'freshGrass',
                    name: '新鲜牧草',
                    desc: '奶牛喜欢的新鲜牧草。\n总产量 + 1%。',
                    price: 1000,
                    type: 'all',
                    modifier: 0.01,
                    sold: ''
                },
                cowCat: {
                    id: 'cowCat',
                    name: '奶牛猫',
                    desc: '黑白相间的猫，似乎和你的奶牛产生了共鸣。\n总产量 + 1%。',
                    price: 10000,
                    type: 'all',
                    modifier: 0.01,
                    sold: ''
                },
                exoskeleton: {
                    id: 'exoskeleton',
                    name: '机械外骨骼',
                    desc: '强劲磁场动力。\n 手动产量 + 100%。',
                    price: 100000,
                    type: 'manual',
                    modifier: 1,
                    sold: ''
                },
                gene: {
                    id: 'gene',
                    name: '转基因',
                    desc: '对你的奶牛进行基因改造。\n总产量 + 2%。',
                    price: 100000,
                    type: 'all',
                    modifier: 0.02,
                    sold: ''
                },
                school: {
                    id: 'school',
                    name: '奶牛学校',
                    desc: '从异世界聘请魅魔教师对你的奶牛进行高等教育。\n总产量 + 2%。',
                    price: 500000,
                    type: 'all',
                    modifier: 0.02,
                    sold: ''
                },
                overclock: {
                    id: 'overclock',
                    name: '超频工具',
                    desc: '超频你的奶牛，注意散热。\n总产量 + 3%。',
                    price: 2500000,
                    type: 'all',
                    modifier: 0.03,
                    sold: ''
                },
            },
            timer: null,
            stage: 1,
            news: {
                1: [
                    '你在挤奶的时候不小心把桶打翻了。',
                    '你挤奶的手法让牛觉得不舒服于是踢了你一脚。',
                    '你尝试骑牛，但是被甩下来了。',
                    '你喝了生的牛奶，拉肚子了。'
                ],
                2: [
                    '挤奶工们要求你停止使用牛奶支付工资。',
                    '牧场出生了一头纯白的奶牛。',
                    '当地的乳制品厂试图压低收购价。',
                    '牧场举办奶牛赛跑，最后一只名为“白银船”的牛取得优胜。'
                ],
                3: [
                    '镇长给你颁发了“年度贡献”奖。',
                    '其他的牧场试图从你这里获取商业机密。',
                    '时不时有游客到你的牧场参观。',
                    '你给你父母寄去了你家牧场生产的奶酪。',
                    '牧场举办奶牛障碍赛，最后一只名为“面浴”的牛取得优胜。'
                ],
                4: [
                    '你尝试把牛奶卖给外地的乳制品厂。',
                    '现在你喝生的牛奶也不会拉肚子了。',
                    '环境监测局警告你控制你牧场的牛奶排放。',
                    '挤奶工要求在工位加装手机支架和插座。',
                    '农业局的科学家到你的牧场研究你的牛。',
                    '专家表示过度抽取地下奶可能导致地面沉降。'
                ],
                5: [
                    '镇上的酒吧现在只出售牛奶。',
                    '你收购了当地的其他奶牛牧场。',
                    '每天都有大量的游客到牧场观光游览。',
                    '你买下了炼油厂的储罐用来装牛奶。',
                    '一些环境保护者聚集在牛奶钻井下抗议化石牛奶的开采对环境的破坏。'
                ]
            },
            pickedNews: '',
            newsTimer: null
        }
    },

    methods: {
        manualMilk(){
            this.milk += this.manualMilkAmount * this.manualMilkModifier
        },

        buyProperty(type){
            if(this.milk < this.properties[type].price) return;
            this.milk -= this.properties[type].price
            this.properties[type].count ++
            //this.properties[type].price = (this.properties[type].price * this.properties[type].increment).toFixed(0)
            //this.autoMilkAmount += this.properties[type].productivity[0]
            //this.manualMilkAmount += this.properties[type].productivity[1]
            this.refreshData()
        },

        buyUpgrade(type){
            if(this.milk < this.upgrades[type].price) return;
            if(this.upgrades[type].sold) return;
            this.upgrades[type].sold = 'sold';
            this.milk -= this.upgrades[type].price
            // if(this.upgrades[type].type == 'all'){
            //     this.manualMilkModifier += this.upgrades[type].modifier
            //     this.autoMilkModifier += this.upgrades[type].modifier
            // }
        },

        refreshData(){
            this.autoMilkAmount = 0
            this.manualMilkAmount = 1
            for(let prop in this.properties){
                let price = this.properties[prop].base
                this.autoMilkAmount += this.properties[prop].productivity[0] * this.properties[prop].count
                //console.log(this.autoMilkAmount, this.properties[prop].productivity[0], this.properties[prop].count)
                this.manualMilkAmount += this.properties[prop].productivity[1] * this.properties[prop].count
                for(let i = 0; i < this.properties[prop].count; i++){
                    price *= this.properties[prop].increment
                }
                this.properties[prop].price = price.toFixed(0)
            }
            this.manualMilkModifier = 1
            this.autoMilkModifier = 1
            for(let upgr in this.upgrades){
                if(this.upgrades[upgr].sold == '') return;
                if(this.upgrades[upgr].type == 'all'){
                    this.manualMilkModifier += this.upgrades[upgr].modifier
                    this.autoMilkModifier += this.upgrades[upgr].modifier
                }
                else if(this.upgrades[upgr].type == 'manual'){
                    this.manualMilkModifier += this.upgrades[upgr].modifier
                }
            }
        },

        autoMilk(){
            this.timer = setInterval(() => {
                this.refreshData()
                this.milk += this.autoMilkAmount * this.autoMilkModifier
                this.checkStage()
                document.title = `Milk: ${this.milk.toFixed(0)}`
            }, 1000)
        },

        saveGame(){
            let data = {
                milk: this.milk,
                manualMilkAmount: this.manualMilkAmount,
                manualMilkModifier: this.manualMilkModifier,
                autoMilkAmount: this.autoMilkAmount,
                autoMilkModifier: this.autoMilkModifier,
                properties: {
                    milkMan: this.properties.milkMan.count,
                    autoMilker: this.properties.autoMilker.count,
                    pump: this.properties.pump.count,
                    pumpjack: this.properties.pumpjack.count,
                    factory: this.properties.factory.count,
                    exchange: this.properties.exchange.count,
                    magic: this.properties.magic.count,
                    starship: this.properties.starship.count,
                    whiteHole: this.properties.whiteHole.count
                },
                upgrades: {
                    freshGrass: this.upgrades.freshGrass.sold,
                    cowCat: this.upgrades.cowCat.sold,
                    exoskeleton: this.upgrades.exoskeleton.sold,
                    gene: this.upgrades.gene.sold,
                    school: this.upgrades.school.sold,
                    overclock: this.upgrades.overclock.sold
                }
            }
            navigator.clipboard.writeText(btoa(JSON.stringify(data)))
            localStorage.setItem('milk-game-data', btoa(JSON.stringify(data)))
            document.querySelector('.data').innerHTML = btoa(JSON.stringify(data))
            document.querySelector('.data').setAttribute('class', 'data visible')
            document.querySelector('.data-tip').setAttribute('class', 'data-tip visible')
            alert('游戏存档数据已保存到剪贴板！')
        },

        loadGame(local){
            let rawData = ''
            if(local == true){
                if(localStorage.getItem('milk-game-data') != undefined){
                    rawData = localStorage.getItem('milk-game-data')
                }
                else {
                    rawData = window.prompt('没有找到本地存档，请输入存档数据或从头开始！')
                    if(rawData == null) return
                }
            } else rawData = window.prompt('输入存档数据：');
            if(rawData == null) return;
            let data = JSON.parse(atob(rawData.trim()))
            this.milk = data.milk
            this.manualMilkAmount = data.manualMilkAmount
            this.manualMilkModifier = data.manualMilkModifier
            this.autoMilkAmount = data.autoMilkAmount
            this.autoMilkModifier = data.autoMilkModifier
            for(let prop in data.properties){
                if(data.properties[prop] == undefined){
                    this.properties[prop].count = 0
                }
                else this.properties[prop].count = data.properties[prop]
            }
            for(let upgr in data.upgrades){
                if(data.upgrades[upgr] == undefined){
                    this.upgrades[upgr].sold = ''
                }
                else this.upgrades[upgr].sold = data.upgrades[upgr]
            }
        },

        showNews(){
            let randomInt = (min, max) => {
                return Math.floor(Math.random() * (max - min)) + min;
            }
            this.newsTimer = setInterval(() => {
                if(this.stage == 1){
                    let pick = randomInt(0, this.news[1].length)
                    this.pickedNews = this.news[1][pick]
                }
                else {
                    let pick = randomInt(0, this.news[this.stage].length + this.news[this.stage - 1].length)
                    this.pickedNews = this.news[this.stage].concat(this.news[this.stage - 1])[pick]
                }
            }, 5000)
        },

        checkStage(){
            if(this.milk > 1000) this.stage = 2;
            else if(this.milk > 10000) this.stage = 3;
            else if(this.milk > 100000) this.stage = 4;
            else if(this.milk > 1000000) this.stage = 5;
        },

        updateMilk(){
            gsap.to(this.tweenedMilk, {duration: 0.5, milk: this.milk})
            requestAnimationFrame(this.updateMilk)
        }
    },

    mounted() {
        this.showNews()
        this.autoMilk()
        this.loadGame(true)
        requestAnimationFrame(this.updateMilk)
    }
}

Vue.createApp(MilkApp).mount('#milksim')