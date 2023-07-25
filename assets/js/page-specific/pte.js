let elements = document.querySelectorAll('.element')

elements.forEach(el => {
    if(el.getAttribute('no-gen-content')) return;
    let number = el.getAttribute('n')
    let symbol = el.getAttribute('s')
    let weight = el.getAttribute('w')
    let template = `<span class="number">${number}</span> <span class="symbol">${symbol}</span> <span class="weight">${weight}</span>`

    el.innerHTML = template
})