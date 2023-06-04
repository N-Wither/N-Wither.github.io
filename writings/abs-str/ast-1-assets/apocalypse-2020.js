let scoreBoards = document.querySelectorAll('.story-time')
scoreBoards.forEach(board => {
    let time = board.getAttribute('time') || 'UNKNOWN'
    let kill = board.getAttribute('kill') || 0
    let alive = board.getAttribute('alive') || 0
    let calcWidth = 1 - alive/6800000000
    board.innerHTML = `
            <div class='row-1'>TIME</div>
            <div class='row-1'>KILLS</div>
            <div class='row-1'>ALIVE</div>
            <div>${time}</div>
            <div>${kill}</div>
            <div class="alive-counter">
                <div class="alive-percentage"></div>
                <div class="death-percentage" style='width: calc(${calcWidth} * 100%);'></div>
                <div class="alive-count">${alive}</div>
            </div>
        `
})