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
        url: 'https://n-wither.github.io/tools/'
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

let menuButton = document.querySelector('button.menu-button')
let menuDiv = document.querySelector('.page-header .menu')

if(menuButton && menuDiv) {
    let pageContent = document.querySelector('.page-content')
    let pageFooter = document.querySelector('.page-footer')
    let targets = [pageContent, pageFooter]

    let open = () => {
        menuButton.classList.add('open')
        menuDiv.classList.add('open')
        targets.forEach(el => {
            el.style.filter = 'brightness(0.8)'
        })
    }
    let close = () => {
        menuButton.classList.remove('open')
        menuDiv.classList.remove('open')
        targets.forEach(el => {
            el.style.removeProperty('filter')
            el.removeAttribute('style')
        })
    }

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