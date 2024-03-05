let langs = {
    'en-us': {
        home: 'Home',
        proj: 'Projects',
        artc: 'Articles',
        tool: 'Tools',
        game: 'Games'
    },
    'zh-cn': {
        home: '首页',
        proj: '项目',
        artc: '文章',
        tool: '工具',
        game: '游戏'
    }
}

let userLang = document.documentElement.lang.toLowerCase()
let chosenLang = langs['en-us']
switch(userLang) {
    case 'zh-cn': chosenLang = langs['zh-cn'];
    default: ;
}
console.log(userLang);

let navigateItems = [
    {
        text: chosenLang.home,
        icon: '\ue88a',
        url: '/'
    },
    {
        text: chosenLang.proj,
        icon: '\uf8ee',
        url: '/projects/'
    },
    {
        text: chosenLang.artc,
        icon: '\uef42',
        url: '/writings/'
    },
    {
        text: chosenLang.tool,
        icon: '\uea59',
        url: '/tools/'
    },
    {
        text: chosenLang.game,
        icon: '\uf135',
        url: '/games/'
    },
]

function createNavigateItem(text, icon = '🏠', url = '#'){
    let template = 
        `<a class = "item flex-center left" href = "${url}">
            <div class = "container"><div class = "icon flex-center">${icon}</div> <div class = "flex-center left">${text}</div></div>
        </a>`

    return template
}

let menu = document.querySelector('.page-header .menu')

if(menu != null){
    navigateItems.forEach(item => {
        menu.innerHTML += createNavigateItem(item.text, item.icon, item.url)
    })
}

let menuButton = document.querySelector('button.menu-button')
let menuDiv = document.querySelector('.page-header .menu')

if(menuButton && menuDiv) {
    let pageContent = document.querySelector('.page-content')
    let pageFooter = document.querySelector('.page-footer')

    let targets = [pageContent, pageFooter]

    let open = () => {
        menuButton.classList.add('open')
        menuDiv.classList.add('open')
    }
    let close = () => {
        if (
            menuButton.classList.contains('open') ||
            menuDiv.classList.contains('open')
        ) {
            menuButton.classList.remove('open');
            menuDiv.classList.remove('open');
        }
    };

    menuButton.removeAttribute('onclick')
    menuButton.onclick = function () {
        if(this.classList.contains('open')) {
            close()
            targets.forEach(el => {
                el.removeEventListener('click', close, false)
            })
        }
        else {
            open()
            targets.forEach(el => {
                el.addEventListener('click', close, false)
            })
        }
    }
}