let matchScheme = window.matchMedia('(prefers-color-scheme: dark)')
if(matchScheme.matches && !document.querySelector('html').classList.contains('dark-mode')){
    document.querySelector('html').classList.add('dark-mode')
}