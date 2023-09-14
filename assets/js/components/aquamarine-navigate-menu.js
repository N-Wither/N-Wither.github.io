let navigateItems = [
    {
        text: 'Home',
        icon: '\ue88a',
        url: 'https://n-wither.github.io/'
    },
    {
        text: 'Articles',
        icon: '\uef42',
        url: 'https://n-wither.github.io/writings/'
    },
    {
        text: 'Tools',
        icon: '\uea59',
        url: 'https://n-wither.github.io/tools/tools.html'
    },
    {
        text: 'Games',
        icon: '\uf135',
        url: 'https://n-wither.github.io/games/'
    },
    {
        text: 'Misc',
        icon: '\uf8ee',
        url: 'https://n-wither.github.io/misc/web-playground.html'
    }
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