export const itemProperties = {
    flour: {
        tag: ['ingredient'],
        price: 4,
        buyCount: 1,
    },
    sugar: {
        tag: ['ingredient'],
        price: 8,
        buyCount: 3,
    },
    butter: {
        tag: ['ingredient'],
        price: 10,
        buyCount: 3,
    },
    egg: {
        tag: ['ingredient'],
        price: 4,
        buyCount: 1,
    },
    salt: {
        tag: ['ingredient'],
        price: 6,
        buyCount: 2,
    },
    soda: {
        tag: ['ingredient'],
        price: 4,
        buyCount: 2,
    },
    cacao: {
        tag: ['ingredient'],
        price: 12,
        buyCount: 2,
    },
    cinnamon: {
        tag: ['ingredient', 'spice'],
        price: 8,
        buyCount: 2,
    },
    vanilla: {
        tag: ['ingredient', 'spice'],
        price: 18,
        buyCount: 1,
    },
    milk: {
        tag: ['ingredient'],
        price: 5,
        buyCount: 1,
    },
    cream: {
        tag: ['ingredient'],
        price: 7,
        buyCount: 1,
    },
    sesame: {
        tag: ['ingredient'],
        price: 1.2,
        buyCount: 10,
    },
    peanut: {
        tag: ['ingredient', 'nut'],
        price: 2,
        buyCount: 8,
    },
    almond: {
        tag: ['ingredient', 'nut'],
        price: 3,
        buyCount: 8,
    },

    whiteBread: {
        tag: ['bread', 'product'],
        price: 8,
        recipe: {
            flour: 1,
        },
        craftCount: 1,
    },
    bagel: {
        tag: ['bread', 'product'],
        price: 8,
        recipe: {
            flour: 1,
            sugar: 1
        },
        craftCount: 2,
    },
    pretzel: {
        tag: ['bread', 'product'],
        price: 8,
        recipe: {
            flour: 1,
            soda: 1,
            salt: 1,
        },
        craftCount: 2,
    },
    toast: {
        tag: ['bread', 'product'],
        price: 10,
        recipe: {
            flour: 5,
            sugar: 1,
            egg: 1,
            milk: 3
        },
        craftCount: 9
    },
    cupcake: {
        tag: ['cake', 'product'],
        price: 12,
        craftCount: 10,
        recipe: {
            flour: 3,
            sugar: 2,
            milk: 2,
            butter: 1,
            egg: 3
        }
    }
}

export const languageMap = {
    default: {
        'item.flour': 'Flour',
        'item.flour.desc': 'Made from wheat, basic bakery ingredient.',
        'item.sugar': 'Sugar',
        'item.sugar.desc': 'Sweet.',
        'item.butter': 'Butter',
        'item.butter.desc': 'The oil from milk.',
        'item.egg': 'Egg',
        'item.egg.desc': 'A common egg.',
        'item.salt': 'Salt',
        'item.salt.desc': 'Salty salt.',
        'item.soda': 'Soda Powder',
        'item.soda.desc': 'An alkaline powdery substance.',
        'item.cacao': 'cacao Powder',
        'item.cacao.desc': 'Powdered cacao beans.',
        'item.cinnamon': 'Cinnamon Powder',
        'item.cinnamon.desc': 'A slightly spicy powder made from the bark of cinnamon trees.',
        'item.vanilla': 'Vanilla',
        'item.vanilla.desc': 'The seeds of a kind of orchid, have a peculiar aromatic smell.',
        'item.milk': 'Milk',
        'item.milk.desc': 'Nutricious and delicious.',
        'item.cream': 'Cream',
        'item.cream.desc': 'A white liquid seperated from milk, full of fat.',
        'item.sesame': 'Sesame',
        'item.sesame.desc': 'Tiny seeds rich in oil.',
        'item.almond': 'Almond',
        'item.almond.desc': 'A common nut.',
        'item.peanut': 'Peanut',
        'item.peanut.desc': 'A nut grown in the soil.',

        'item.whiteBread': 'White Bread',
        'item.whiteBread.desc': 'A loaf of white bread.',
        'item.bagel': 'Bagel',
        'item.bagel.desc': 'A small round bread with a hole in the middle.',
        'item.pretzel': 'Pretzel',
        'item.pretzel.desc': 'A baked pastry made from dough that is shaped into a knot.',
        'item.toast': 'Toast',
        'item.toast.desc': 'Soft and sweet bread for your breakfast.',
        'item.cupcake': 'Cupcake',
        'item.cupcake.desc': 'A cake in a delicate paper cup, topped with frosting.',
    },
    'zh-cn': {
        'item.flour': '面粉',
        'item.flour.desc': '用小麦磨成的基本烘焙原料。',
        'item.sugar': '糖',
        'item.sugar.desc': '很甜。',
        'item.butter': '黄油',
        'item.butter.desc': '来自牛奶的油脂。',
        'item.egg': '蛋',
        'item.egg.desc': '一个普通的蛋。',
        'item.salt': '盐',
        'item.salt.desc': '咸盐。',
        'item.soda': '苏打粉',
        'item.soda.desc': '一种碱性粉末状物质。',
        'item.cacao': '可可粉',
        'item.cacao.desc': '磨碎的可可豆。',
        'item.cinnamon': '肉桂粉',
        'item.cinnamon.desc': '肉桂树皮磨成的粉，味道略带辛辣。',
        'item.vanilla': '香草',
        'item.vanilla.desc': '一种兰花的种子，有一种独特的香味。',
        'item.milk': '牛奶',
        'item.milk.desc': '营养美味。',
        'item.cream': '奶油',
        'item.cream.desc': '从牛奶中分离的富含脂肪的白色液体。',
        'item.sesame': '芝麻',
        'item.sesame.desc': '富含油脂的微小种子。',
        'item.almond': '杏仁',
        'item.almond.desc': '一种常见的坚果。',
        'item.peanut': '花生',
        'item.peanut.desc': '长在地下的坚果。',

        'item.whiteBread': '白面包',
        'item.whiteBread.desc': '一块白面包。',
        'item.bagel': '贝果',
        'item.bagel.desc': '一个小圆面包，中间有个洞。',
        'item.pretzel': '椒盐卷饼',
        'item.pretzel.desc': '用扭结的面团烤制而成。',
        'item.toast': '吐司',
        'item.toast.desc': '柔软香甜的面包，适合你的早餐。',
        'item.cupcake': '纸杯蛋糕',
        'item.cupcake.desc': '装在精致纸杯中的蛋糕，上面装饰着糖霜。'
    }
}

for (const key in languageMap) {
    let oldMap = window.aqLanguageMap[key]
    if (oldMap) {
        for (const lang in languageMap[key]) {
            oldMap[lang] = languageMap[key][lang]
        }
    }
    else {
        window.aqLanguageMap[key] = languageMap[key]
    }
}