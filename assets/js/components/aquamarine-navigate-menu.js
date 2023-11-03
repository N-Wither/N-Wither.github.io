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

    let cover = document.createElement('div')
    cover.classList.add('menu-backdrop')
    cover.style = 'min-height:100vh;min-width:100vw;z-index:98;position:fixed;background:#00000044;left:0;top:0;backdrop-filter:blur(5px);pointer-events:none;opacity:0;'
    document.body.appendChild(cover)

    let targets = [pageContent, pageFooter]

    let open = () => {
        menuButton.classList.add('open')
        menuDiv.classList.add('open')
        cover.animate([{ opacity: 0 }, { opacity: 1 }], {
            fill: 'forwards',
            duration: 200,
        });
    }
    let close = () => {
        if (
            menuButton.classList.contains('open') ||
            menuDiv.classList.contains('open')
        ) {
            menuButton.classList.remove('open');
            menuDiv.classList.remove('open');
            cover.animate([{ opacity: 1 }, { opacity: 0 }], {
                fill: 'forwards',
                duration: 200,
            });
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