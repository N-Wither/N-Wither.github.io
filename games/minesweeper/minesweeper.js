import { aqSnackbar } from '../../web-components/aqv2/components/snackbar.js'

const cvs = document.querySelector('canvas')
const ctx = cvs.getContext('2d')
const difficultySelect = document.querySelector('#difficulty')
const reset = document.querySelector('#reset')
const mobileModeCheckbox = document.querySelector('#mobile')
const simulateModeCheckboxes = document.querySelectorAll('[name=mode]')
const infoBox = document.querySelector('#info')
const tileWidth = 32
const tileBorder = 2
const state = {
    isMobile: false,
    currentSimulate: 'left',
    isRunning: false,
    isFirstClick: true,
    /**@type {Tile[][]} */
    grid: []
}
const difficultyMap = {
    easy: {
        rows: 9,
        cols: 9,
        mines: 10
    },
    normal: {
        rows: 16,
        cols: 16,
        mines: 40
    },
    hard: {
        rows: 16,
        cols: 30,
        mines: 99
    }
}

cvs.addEventListener('mousedown', e => {
    if(state.isRunning == false) return
    if(state.isMobile == true) {
        if(state.currentSimulate == 'left') {
            handleLeftClick(e)
        }
        else if(state.currentSimulate == 'right') {
            handleRightClick(e)
        }
        else if(state.currentSimulate == 'double') {
            handleDblClick(e)
        }
    }
    else {
        if(e.button == 0) {
            handleLeftClick(e)
        }
        else if(e.button == 2) {
            handleRightClick(e)
        }
    }
    checkState()
})

cvs.addEventListener('dblclick', e => {
    if (state.isRunning == true) {
        handleDblClick(e)
        checkState()
    }
})

cvs.addEventListener('contextmenu', e => {
    e.preventDefault()
})

difficultySelect.addEventListener('change', () => {
    init()
})

reset.addEventListener('click', () => {
    init()
})

mobileModeCheckbox.addEventListener('change', () => {
    state.isMobile = mobileModeCheckbox.checked
})

simulateModeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        state.currentSimulate = checkbox.id
    })
})


class Tile {
    /**@type {TileType} */
    type = 'unknown'
    content = ''
    hasLandmine = false
    row = 0
    col = 0


    /**
     * @typedef {'unknown' | 'landmine' | 'flag' | 'question' | 'number'} TileType
     * @param {TileType} type 
     */
    constructor(type, row = 0, col = 0){
        this.type = type
        this.content = type == 'flag' ? '🚩' : type == 'question'? '❓' : type == 'number'? 0 : type == 'landmine'? '💣' : ''
        this.hasLandmine = type == 'landmine' ? true : false
        this.row = row
        this.col = col
    }

    static colorMap = {
        unreavealedBackground: '#F0F0F0',
        revealedBackground: '#D3D3D3',
        border: '#808080',
        landmine: '#f36969',
        0: '#f0f0f0',
        1: '#2563eb',
        2: '#1aab91',
        3: '#16a34a',
        4: '#eab308',
        5: '#ea580c',
        6: '#d04848',
        7: '#a21caf',
        8: '#333333'
    }

    getAroundTiles(){
        let grid = state.grid
        let maxRow = grid.length - 1
        let maxCol = grid[0].length - 1
        let row = this.row
        let col = this.col
        const around = {
            upLeft: row > 0 && col > 0 ? grid[row - 1][col - 1] : null,
            up: row > 0 ? grid[row - 1][col] : null,
            upRight: row > 0 && col <= maxCol - 1 ? grid[row - 1][col + 1] : null,
            left: col > 0 ? grid[row][col - 1] : null,
            right: col <= maxCol - 1 ? grid[row][col + 1] : null,
            downLeft: row <= maxRow - 1 && col > 0 ? grid[row + 1][col - 1] : null,
            down: row <= maxRow - 1 ? grid[row + 1][col] : null,
            downRight: row <= maxRow - 1 && col <= maxCol - 1 ? grid[row + 1][col + 1] : null
        }
        return around
    }

    analyzeAroundTiles(){
        const around = this.getAroundTiles(this.row, this.col)
        const result = {
            mines: 0,
            flags: 0
        }
        Object.values(around).forEach(tile => {
            if (tile == null) return
            if (tile.hasLandmine == true) result.mines++
            if (tile.type == 'flag') result.flags++
        })
        return result
    }

    leftClick(/**@type {MouseEvent}*/ e) {
        // To prevent the first click from revealing the mines
        if(this.type == 'unknown' && this.hasLandmine == true && state.isFirstClick == true){
            init()
            return
        }
        state.isFirstClick = false
        if(this.type == 'unknown' && this.hasLandmine == false){
            this.type = 'number'
            this.content = this.analyzeAroundTiles().mines
            if(this.content == 0) {
                let around = this.getAroundTiles()
                Object.values(around).forEach(tile => {if(tile != null && tile.type == 'unknown' && tile.hasLandmine == false) tile.leftClick()})
            }
        }
        if(this.type == 'unknown' && this.hasLandmine == true){
            this.type = 'landmine'
            this.content = '💣'
            gameLose()
        }
        render()
    }

    rightClick() {
        if(this.type == 'unknown') {
            this.type = 'flag'
            this.content = '🚩'
        }
        else if(this.type == 'flag') {
            this.type = 'question'
            this.content = '❓'
        }
        else if(this.type == 'question') {
            this.type = 'unknown'
            this.content = ''
        }
        render()
    }

    dblClick() {
        let around = this.getAroundTiles()
        if(this.type == 'number' && this.analyzeAroundTiles().flags == this.content) {
            Object.values(around).forEach(tile => {if(tile != null) tile.leftClick()})
        }
    }
}

const generateGrid = () => {
    const rows = difficultyMap[difficultySelect.value].rows
    const cols = difficultyMap[difficultySelect.value].cols
    const mines = difficultyMap[difficultySelect.value].mines
    /**@type {Tile[][]} */
    const grid = []
    for (let i = 0; i < rows; i++) {
        grid.push([])
        for (let j = 0; j < cols; j++) {
            grid[i].push(new Tile('unknown', i, j))
        }
    }
    for (let i = 0; i < mines; i++) {
        const row = Math.floor(Math.random() * rows)
        const col = Math.floor(Math.random() * cols)
        if (grid[row][col].hasLandmine == false) {
            grid[row][col].hasLandmine = true
        } else {
            i--
        }
    }
    return grid
}

const render = () => {
    const rows = difficultyMap[difficultySelect.value].rows
    const cols = difficultyMap[difficultySelect.value].cols
    const width = tileWidth * cols
    const height = tileWidth * rows
    cvs.style.scale = 1 / devicePixelRatio
    cvs.width = width
    cvs.height = height
    ctx.clearRect(0, 0, width, height)
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const x = j * tileWidth
            const y = i * tileWidth
            const tile = state.grid[i][j]
            switch(tile.type) {
                case 'unknown':
                case 'flag':
                case 'question': {
                    ctx.fillStyle = Tile.colorMap.unreavealedBackground
                    break
                }
                case 'landmine': {
                    ctx.fillStyle = Tile.colorMap.landmine
                    break
                }
                case 'number': {
                    ctx.fillStyle = Tile.colorMap.revealedBackground
                    break
                }
            }
            ctx.fillRect(x, y, tileWidth, tileWidth)
            ctx.font = `${tileWidth / 2 + 2}px monospace`
            ctx.fillStyle = Tile.colorMap.border
            ctx.strokeStyle = Tile.colorMap.border
            ctx.lineWidth = tileBorder
            ctx.strokeRect(x, y, tileWidth, tileWidth)
            if (tile.content != '') {
                ctx.fillStyle = Tile.colorMap[tile.content] ?? '#000000'
                ctx.fillText(tile.content, x + 10, y + 20)
            }
        }
    }
    infoBox.textContent = `共有 ${difficultyMap[difficultySelect.value].mines} 个地雷，已标记 ${arrayFlat(state.grid).filter(tile => tile.type == 'flag').length} 个。`
}

const init = () => {
    state.grid = generateGrid()
    state.isRunning = true
    state.isFirstClick = true
    render()
}

const handleLeftClick = (/** @type {MouseEvent}*/ event) => {
    const pos = getTileIndex(event)
    const tile = state.grid[pos.row][pos.col]
    tile.leftClick()
    // console.log(pos)
    render()
}

const handleRightClick = (/** @type {MouseEvent}*/ event) => {
    const pos = getTileIndex(event)
    const tile = state.grid[pos.row][pos.col]
    tile.rightClick()
    render()
}

const handleDblClick = (/** @type {MouseEvent}*/ event) => {
    const pos = getTileIndex(event)
    const tile = state.grid[pos.row][pos.col]
    tile.dblClick()
    render()
}

const getTileIndex = (/** @type {MouseEvent}*/ event) => {
    const rect = cvs.getBoundingClientRect()
    // console.log(rect)
    // console.log(event)
    const x = event.x - rect.left
    const y = event.y - rect.top
    // console.log(x, y)
    const rows = difficultyMap[difficultySelect.value].rows
    const cols = difficultyMap[difficultySelect.value].cols
    const tileWidth = rect.width / cols
    const tileHeight = rect.height / rows
    const col = Math.floor(x / (tileWidth ))
    const row = Math.floor(y / (tileHeight ))
    // console.log(row, col)
    return { row, col }
}

const gameLose = () => {
    arrayFlat(state.grid).filter(tile => tile.hasLandmine == true).forEach(tile => {
        tile.type = 'landmine'
        tile.content = '💣'
    })
    render()
    aqSnackbar({message: '你输了！', type: 'error', duration: 3000})
    infoBox.textContent = `游戏结束！`
    state.isRunning = false
}

const gameWin = () => {
    arrayFlat(state.grid).filter(tile => tile.hasLandmine == true).forEach(tile => {
        tile.type = 'flag'
        tile.content = '🚩'
    })
    render()
    aqSnackbar({message: '你赢了！', type: 'success', duration: 3000})
    infoBox.textContent = `你找到了所有 ${difficultyMap[difficultySelect.value].mines} 个地雷！`
    state.isRunning = false
}

/**
 * 
 * @param {any[]} arr 
 * @returns {any[]}
 */
const arrayFlat = (arr) => {
    return arr.reduce((acc, val) => acc.concat(val), [])
}

const checkState = () => {
    const tiles = arrayFlat(state.grid)
    const unknownTiles = tiles.filter(tile => tile.type == 'unknown').length
    const flaggedTiles = tiles.filter(tile => tile.type == 'flag').length
    const questionTiles = tiles.filter(tile => tile.type == 'question').length
    if(unknownTiles + flaggedTiles + questionTiles == difficultyMap[difficultySelect.value].mines) {
        gameWin()
    }
}

init()
window.state = state
window.generateGrid = generateGrid
window.render = render