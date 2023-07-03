let clickParticleConfig = {
    content: '★',
    // the color of particles
    // Valid values: 'random' | hex color code
    color: 'random'
}

window.addEventListener('click', e => {
    let newParticle = document.createElement('div')
    newParticle.classList.add('click-particle')
    newParticle.style.top = `calc(${e.pageY}px - 2rem)`
    newParticle.style.left = e.pageX + 'px'
    if(clickParticleConfig.color != 'random'){
        newParticle.style.color = clickParticleConfig.color
    }else {
        newParticle.style.color = getRandomColor()
    }
    let content = document.createTextNode(clickParticleConfig.content)
    newParticle.appendChild(content)
    document.body.appendChild(newParticle)
    setTimeout(() => {document.body.removeChild(newParticle)}, 500)
})

function getRandomColor(){
    return '#' + Math.random().toString(16).split('.')[1].slice(0, 6)
}