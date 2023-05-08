const MilkApp = {
    data() {
        return {
            milk: 0,
            manualMilkAmount: 1,
            autoMilkAmount: 0,
            properties: {
                milkMan: {
                    desc: "从路边招聘的无业人士。",
                    count: 0,
                    price: 10,
                    increment: 1.1,
                    productivity: [1, 1]
                },
                autoMilker: {
                    desc: "最新技术的自动挤奶器，榨干你的奶牛！",
                    count: 0,
                    price: 100,
                    increment: 1.1,
                    productivity: [5, 3]
                },
                pump: {
                    desc: "从地下牛奶河抽取牛奶。",
                    count: 0,
                    price: 2000,
                    increment: 1.15,
                    productivity: [50, 20]
                }
            },
            timer: null
        }
    },

    methods: {
        manualMilk(){
            this.milk += this.manualMilkAmount
        },

        buyProperty(type){
            if(this.milk < this.properties[type].price) return;
            this.milk -= this.properties[type].price
            this.properties[type].count ++
            this.properties[type].price = (this.properties[type].price * this.properties[type].increment).toFixed(0)
            this.autoMilkAmount += this.properties[type].productivity[0]
            this.manualMilkAmount += this.properties[type].productivity[1]
        },

        autoMilk(){
            this.timer = setInterval(() => {
                this.milk += this.autoMilkAmount
            }, 1000)
        },

        saveGame(){
            let data = {
                milk: this.milk,
                manualMilkAmount: this.manualMilkAmount,
                autoMilkAmount: this.autoMilkAmount
            }
            document.cookie = data
        },

        loadGame(){
            // TODO
        }
    },

    mounted() {
        this.autoMilk()
    }
}

Vue.createApp(MilkApp).mount('#milksim')