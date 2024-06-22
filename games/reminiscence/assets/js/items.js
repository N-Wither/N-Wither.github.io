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
        price: 2,
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

    whiteBread: {
        tag: ['bread', 'product'],
        price: 12,
        recipe: {
            flour: 1,
        },
        craftCount: 1,
    },
    bagel: {
        tag: ['bread', 'product'],
        price: 15,
        recipe: {
            flour: 1,
            sugar: 1
        },
        craftCount: 1,
    },
    pretzel: {
        tag: ['bread', 'product'],
        price: 10,
        recipe: {
            flour: 1,
            soda: 1,
            salt: 1,
        },
        craftCount: 2,
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

        'item.whiteBread': 'White Bread',
        'item.whiteBread.desc': 'A loaf of white bread.',
        'item.bagel': 'Bagel',
        'item.bagel.desc': 'A small round bread with a hole in the middle.',
        'item.pretzel': 'Pretzel',
        'item.pretzel.desc': 'A baked pastry made from dough that is shaped into a knot.'
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

        'item.whiteBread': '白面包',
        'item.whiteBread.desc': '一块白面包。',
        'item.bagel': '贝果',
        'item.bagel.desc': '一个小圆面包，中间有个洞。',
        'item.pretzel': '椒盐卷饼',
        'item.pretzel.desc': '用扭结的面团烤制而成。'
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