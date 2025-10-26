let clickParticleConfig = {
    /**
     * @type {string | string[]}
     * the content of particle elements, Array is supported
     */
    content: '★',
    /**
     * @type {string}
     * the color of particles, Valid values: 'random' | hex color code
     */
    color: 'random',
    /**
     * @type {'ascent' | 'parabola'}
     */
    animation: 'ascent'
}

window.addEventListener('click', e => {
    let newParticle = document.createElement('div')
    newParticle.classList.add('click-particle', clickParticleConfig.animation)
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
        newParticle.innerHTML = clickParticleConfig.content[Math.floor(Math.random() * clickParticleConfig.content.length)]
    }
    document.body.appendChild(newParticle)
    if(clickParticleConfig.animation == 'parabola'){
        let speedX = Math.random() * 2 - 1
        let speedY = -Math.random() * 2 - 1
        let particleInterval = setInterval(() => {
            newParticle.style.left = parseFloat(newParticle.style.left) + speedX + 'px'
            newParticle.style.top = parseFloat(newParticle.style.top) + speedY + 'px'
            speedY += 0.1
            if(parseFloat(newParticle.style.top) > window.innerHeight){
                clearInterval(particleInterval)
                newParticle.remove()
            }
        }, 1000 / 60)
    }
    newParticle.addEventListener('animationend', () => {
        newParticle.remove()
    })
})

function getRandomColor(){
    return '#' + Math.random().toString(16).split('.')[1].slice(0, 6)
}