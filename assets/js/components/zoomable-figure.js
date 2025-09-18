let styleSheet = new CSSStyleSheet
styleSheet.replaceSync(`
    figure.zoomable img {
        cursor: zoom-in;
    }

    dialog button.close {
        background-color: #33333322; color: white; padding: 0.4rem; position: absolute; top: 0; right: 0; border: none; font-size: large; transition: background-color 0.2s ease; cursor: pointer;
    }
    dialog button.close:is(:hover, :focus) {
        background-color: #33333344;
    }
`)

document.adoptedStyleSheets.push(styleSheet)

const dialogTemplate = `
<div style="position: relative;">
    <button class="close" aria-label="Close dialog" title="Close" autofocus>&times;</button>
    <figure>
        <img src="" alt="" style="max-height: 90vh;">
        <figcaption></figcaption>
    </figure>
</div>
`

let figures = document.querySelectorAll('figure.zoomable:has(img)')
figures.forEach(figure => {
    let img = figure.querySelector('img')
    let caption = figure.querySelector('figcaption')?.textContent ?? ''
    img.addEventListener('click', e => {
        let dialog = document.createElement('dialog')
        dialog.innerHTML = dialogTemplate
        dialog.querySelector('img').src = img.src
        dialog.querySelector('img').alt = img.alt || ''
        dialog.querySelector('figcaption').textContent = caption

        function removeDialog() {
            dialog.animate([
                {opacity: 1, transform: 'translateY(0)'},
                {opacity: 0, transform: 'translateY(10px)'}
            ], {duration: 200}).addEventListener('finish', () => {dialog.remove()})
        }
        dialog.querySelector('.close').addEventListener('click', () => { removeDialog() })
        dialog.addEventListener('keydown', e => {
            if(e.key == 'Escape') {
                e.preventDefault()
                removeDialog()
            }
        }, {once: true})
        document.body.appendChild(dialog)
        dialog.showModal()
    })
})