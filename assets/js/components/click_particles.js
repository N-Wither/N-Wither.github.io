let clickParticleConfig = {
    // the content of particle elements
    // Array is supported
    content: '★',
    // the color of particles
    // Valid values: 'random' | hex color code
    color: 'random'
}

window.addEventListener('click', e => {
    let newParticle = document.createElement('div')
    newParticle.classList.add('click-particle')
    newParticle.style.top = `calc(${e.clientY}px - 1rem)`
    newParticle.style.left = e.clientX + 'px'
    if(clickParticleConfig.color != 'random'){
        newParticle.style.color = clickParticleConfig.color
    }else {
        newParticle.style.color = getRandomColor()
    }
    // let content = document.createTextNode(clickParticleConfig.content)
    // newParticle.appendChild(content)
    if(typeof clickParticleConfig.content == 'string'){
        newParticle.innerHTML = clickParticleConfig.content
    }
    else{
        newParticle.innerHTML = clickParticleConfig.content.getRandom()
    }
    document.body.appendChild(newParticle)
    newParticle.addEventListener('animationend', () => {
        newParticle.remove()
    })
})

function getRandomColor(){
    return '#' + Math.random().toString(16).split('.')[1].slice(0, 6)
}