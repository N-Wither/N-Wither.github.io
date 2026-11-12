/// <reference path="../../_typings/index.d.ts" />

import { css, html, LitElement, type TemplateResult } from 'https://esm.sh/lit@3.2.0'
import { createLocalizer, LanguageMap } from '../../web-components/aqv2/lib/localize.js'

type Difficulty = 'easy' | 'normal' | 'hard' | 'evil'
interface AroundTiles {
  upleft: Tile | null
  up: Tile | null
  upright: Tile | null
  left: Tile | null
  right: Tile | null
  downleft: Tile | null
  down: Tile | null
  downright: Tile | null
  toArray(): Tile[]
  mines: number
}

const selectStyle = css`
select {
  background-color: var(--input-bg);
  font-family: inherit;
  border: none;
  color: inherit;
  padding: 0.2rem;
  border-radius: 0;
}
select, select::picker(select) {
  appearance: base-select;
  transition: var(--transition-time-common) allow-discrete;
}
select::picker-icon {
  transition: var(--transition-time-common) rotate;
  margin-inline-end: 0.2rem;
}
select::picker(select) {
  opacity: 0;
  border: none;
  box-shadow: var(--general-shadow);
}
select::picker(select):popover-open {
  opacity: 1;
}
@starting-style {
  select::picker(select):popover-open {
    opacity: 0;
  }
}
select:open::picker-icon {
  rotate: 180deg;
}
select option {
  transition: var(--transition-time-common);
  background-color: var(--background-color-dk);
  color: var(--option-color);
}
select option:hover, select option:focus {
  background-color: var(--accent-color);
}
`
const buttonStyle = css`
button {
  font-family: inherit;
  background-color: var(--button-bg);
  border: none;
  transition: var(--transition-time-common);
  color: var(--text-color);
}
button:is(:hover, :focus) {
  background-color: var(--button-bg-focus);
}
button:active {
  box-shadow: inset 0 0 8px var(--shadow-color-dk);
}`

class Tile {
  x = 0
  y = 0
  hasMine = false
  revealed = false
  tagged = false
  content: string | number = ''

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  distanceTo(another: Tile): number {
    return Math.sqrt((this.x - another.x) ** 2 + (this.y - another.y) ** 2)
  }
}

export class MinesweeperElement extends LitElement {
  static lang: LanguageMap = {
    default: {
      difficulty: 'Difficulty',
      easy: 'Easy',
      normal: 'Normal',
      hard: 'Hard',
      evil: 'Evil',
      easy_start: 'Easy Start',
      no_last_choice: 'Skip the final guess',
      hint_active: 'Choose a tile',
      hint: 'Hint',
      lose: 'YOU LOSE!',
      win: 'YOU WIN!',
      restart: 'Click button or press Space to restart'
    },
    'zh-cn': {
      difficulty: '难度',
      easy: '简单',
      normal: '普通',
      hard: '困难',
      evil: '魔鬼',
      easy_start: '简单起步',
      no_last_choice: '跳过最后二选一',
      hint_active: '请选择一个格子',
      hint: '提示',
      lose: '你输了！',
      win: '你赢了！',
      restart: '点击上方按钮或空格重新开始'
    }
  }

  static colors = {
    border: 'gray',
    unknown: '#fafafa',
    revealed: 'lightgray',
    boom: 'crimson',
    cursor: 'turquoise',
    1: '#157a1aff',
    2: '#0c7060ff',
    3: '#083f64ff',
    4: '#21106eff',
    5: '#43094bff',
    6: '#5e091bff',
    7: '#640606ff',
    8: '#888888'
  }
  static darkColors = Object.assign(structuredClone(this.colors), {
    border: '#202020',
    unknown: '#333333',
    revealed: '#121212'
  })

  static properties = {
    difficulty: { type: String }
  }

  static difficulties = {
    easy: { col: 9, row: 9, mine: 10, hint: 45000 },
    normal: { col: 16, row: 16, mine: 40, hint: 30000 },
    hard: { col: 30, row: 16, mine: 99, hint: 25000 },
    evil: { col: 30, row: 20, mine: 130, hint: 20000 }
  }

  static tileWidth = 24

  static styles = [css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    [part='tiles-wrap'] {
      display: flex;
      height: fit-content;
    }
    canvas {
      margin: auto;
      border: 1px solid var(--border-color);
      transition: 0.2s;
    }
    canvas:focus-within {
      outline-color: var(--accent-color);
    }
    [part='header'], [part='stats'] {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      align-items: center;
    }
    [part='counter'], [part='options'] {
      grid-column: 3;
      grid-row: 1;
      text-align: end;
    }
    [part='hint'] {
      grid-column: 2;
      grid-row: 1;
    }
    [part='hint'][hidden] {
      display: none;
    }
    button {
      padding-block: 0.2rem;
    }
    input {
      accent-color: var(--accent-color);
    }
  `, selectStyle, buttonStyle]

  declare difficulty: Difficulty
  #canvas = document.createElement('canvas')
  #ctx = this.#canvas.getContext('2d')
  #translate = createLocalizer(MinesweeperElement.lang)
  #tiles: Tile[] = []
  #cursorX = -2
  #cursorY = -2
  #started = false
  #ended = false
  #easyStart = false
  #noLastChoice = false
  #hintAvailable = false
  #hintActive = false
  #hintTimer: ReturnType<typeof setTimeout> | null = null

  #clearHint(): void {
    if (this.#hintTimer !== null) clearTimeout(this.#hintTimer)
    this.#hintTimer = null
    this.#hintAvailable = false
    this.#hintActive = false
    this.#canvas.style.cursor = ''
    this.requestUpdate()
  }

  #recordActivity(): void {
    if (this.#hintTimer !== null) clearTimeout(this.#hintTimer)
    this.#hintTimer = null
    if (!this.#started || this.#ended || this.#hintAvailable || this.#hintActive) return
    this.#hintTimer = setTimeout(() => {
      this.#hintTimer = null
      if (!this.#started || this.#ended) return
      this.#hintAvailable = true
      this.requestUpdate()
    }, MinesweeperElement.difficulties[this.difficulty].hint)
  }

  #activateHint(): void {
    if (!this.#hintAvailable || this.#ended) return
    this.#hintActive = true
    this.#lastSpace = null
    this.#canvas.style.cursor = 'help'
    this.#canvas.focus()
    this.requestUpdate()
  }

  #useHint(tile: Tile): void {
    if (!this.#hintActive || this.#ended || tile.revealed || tile.tagged) return
    this.#clearHint()
    if (tile.hasMine) this.#toggleFlag(tile)
    else this.#openTile(tile)
    this.#recordActivity()
  }
  #elapsed = 0
  #timerStartedAt: number | null = null
  #timer: ReturnType<typeof setInterval> | null = null
  #lastSpace: { tile: Tile; time: number } | null = null

  #startTimer(): void {
    if (this.#timer !== null) return
    this.#timerStartedAt = performance.now() - this.#elapsed
    this.#timer = setInterval(() => {
      this.#elapsed = performance.now() - this.#timerStartedAt!
      this.requestUpdate()
    }, 30)
  }

  #stopTimer(): void {
    if (this.#timerStartedAt !== null) this.#elapsed = performance.now() - this.#timerStartedAt
    if (this.#timer !== null) clearInterval(this.#timer)
    this.#timer = null
    this.#timerStartedAt = null
    this.requestUpdate()
  }

  #formatTime(): string {
    const centiseconds = Math.floor(this.#elapsed / 10)
    const minutes = Math.floor(centiseconds / 6000).toString().padStart(2, '0')
    const seconds = (Math.floor(centiseconds / 100) % 60).toString().padStart(2, '0')
    return minutes + ':' + seconds + '.' + (centiseconds % 100).toString().padStart(2, '0')
  }
  get #selector(): HTMLSelectElement {
    return this.renderRoot.querySelector('select') as HTMLSelectElement
  }
  get #startButton(): HTMLButtonElement {
    return this.renderRoot.querySelector<HTMLButtonElement>('[part=restart]')!
  }

  constructor() {
    super()
    this.difficulty = 'easy'
    this.#canvas.tabIndex = 0
    this.#bindCanvasEvents()
  }

  #init(difficulty: Difficulty): void {
    this.#stopTimer()
    this.#clearHint()
    this.#elapsed = 0
    this.#lastSpace = null
    const { row, col } = MinesweeperElement.difficulties[difficulty]
    console.log(`Initiating with difficulty ${difficulty}`)
    this.#tiles = this.#gennerateTiles(row, col)
    console.log(`Generated ${this.#tiles.length} tiles`)
    this.#resetCursor()
    this.#renderCanvas()
    this.#started = false
    this.#ended = false
    this.#startButton && (this.#startButton.textContent = '🙂')
  }

  #gennerateTiles(row: number, col: number): Tile[] {
    const tiles: Tile[] = []
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        tiles.push(new Tile(j, i))
      }
    }
    return tiles
  }

  #getAround(tile: Tile): AroundTiles {
    const candidates = this.#tiles.filter((t) => t.distanceTo(tile) <= Math.SQRT2)
    const { x, y } = tile
    return {
      upleft: candidates.find((t) => t.x == x - 1 && t.y == y - 1) ?? null,
      up: candidates.find((t) => t.x == x && t.y == y - 1) ?? null,
      upright: candidates.find((t) => t.x == x + 1 && t.y == y - 1) ?? null,
      left: candidates.find((t) => t.x == x - 1 && t.y == y) ?? null,
      right: candidates.find((t) => t.x == x + 1 && t.y == y) ?? null,
      downleft: candidates.find((t) => t.x == x - 1 && t.y == y + 1) ?? null,
      down: candidates.find((t) => t.x == x && t.y == y + 1) ?? null,
      downright: candidates.find((t) => t.x == x + 1 && t.y == y + 1) ?? null,
      toArray() {
        return [this.upleft, this.up, this.upright, this.left, this.right, this.downleft, this.down, this.downright].filter((t) => t != null)
      },
      get mines() {
        return this.toArray().filter((t) => t.hasMine).length
      }
    }
  }

  #putMines(count: number, clickX: number, clickY: number, nimby: boolean): void {
    if (this.#started == true) return
    const clicked = this.#getTile(clickX, clickY)
    const around: Tile[] = this.#getAround(clicked).toArray().filter((t) => t != null)
    let candidates = this.#tiles.filter((t) => (t.x != clickX || t.y != clickY) && (nimby ? around.includes(t) == false : true))
    for (let i = 0; i < count; i++) {
      const picked = candidates[Math.floor(candidates.length * Math.random())]
      picked.hasMine = true
      picked.content = '💣'
      candidates = candidates.filter((t) => t != picked)
    }
  }

  #getTile(x: number, y: number): Tile {
    const tile = this.#tiles.find((t) => t.x == x && t.y == y)
    if (tile == undefined) throw new Error(`Cannot find tile at (${x}, ${y})`)
    else return tile
  }

  #handleDifficultyChange(): void {
    const dif = this.#selector.value as Difficulty
    console.log(`Difficulty changed, new difficulty: ${dif}`)
    this.difficulty = dif
    this.#init(dif)
  }

  #resetCursor(): void {
    this.#cursorX = -2
    this.#cursorY = -2
  }

  #handleCanvasKeydown(e: KeyboardEvent): void {
    const { col, row } = MinesweeperElement.difficulties[this.difficulty]
    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter', 'NumpadEnter']
    if (!keys.includes(e.key)) return
    e.preventDefault()
    if (e.repeat && [' ', 'Enter', 'NumpadEnter'].includes(e.key)) return
    if (e.key.startsWith('Arrow')) {
      this.#lastSpace = null
      this.#cursorX = Math.max(0, this.#cursorX)
      this.#cursorY = Math.max(0, this.#cursorY)
      if (e.key == 'ArrowUp') this.#cursorY = Math.max(0, this.#cursorY - 1)
      if (e.key == 'ArrowDown') this.#cursorY = Math.min(row - 1, this.#cursorY + 1)
      if (e.key == 'ArrowLeft') this.#cursorX = Math.max(0, this.#cursorX - 1)
      if (e.key == 'ArrowRight') this.#cursorX = Math.min(col - 1, this.#cursorX + 1)
      if (!this.#ended) this.#renderCanvas()
      return
    }
    if (this.#ended) {
      if (e.key == ' ') this.#init(this.difficulty)
      return
    }
    this.#cursorX = Math.max(0, this.#cursorX)
    this.#cursorY = Math.max(0, this.#cursorY)
    const tile = this.#getTile(this.#cursorX, this.#cursorY)
    if (e.key != ' ') {
      this.#lastSpace = null
      this.#toggleFlag(tile)
      return
    }
    if (this.#hintActive) {
      this.#useHint(tile)
      return
    }
    const now = performance.now()
    if (tile.revealed) {
      if (this.#lastSpace?.tile === tile && now - this.#lastSpace.time <= 300) {
        this.#lastSpace = null
        this.#chord(tile)
      } else {
        this.#lastSpace = { tile, time: now }
      }
    } else {
      this.#lastSpace = null
      this.#openTile(tile)
    }
  }

  #toggleFlag(tile: Tile): void {
    if (this.#ended || tile.revealed) return
    tile.tagged = !tile.tagged
    this.#recordActivity()
    this.#calcTiles()
    if (this.#ended) return
    this.#renderCanvas()
    this.requestUpdate()
  }

  #openTile(tile: Tile): void {
    if (this.#ended || tile.tagged || tile.revealed) return
    if (!this.#started) {
      this.#putMines(MinesweeperElement.difficulties[this.difficulty].mine, tile.x, tile.y, this.#easyStart)
      this.#started = true
      this.#startTimer()
    }
    this.#revealTile(tile)
    this.#recordActivity()
  }

  #chord(tile: Tile): void {
    if (this.#hintActive) return
    this.#recordActivity()
    if (this.#ended || !tile.revealed || typeof tile.content != 'number' || tile.content <= 0) return
    const around = this.#getAround(tile).toArray()
    if (around.filter((t) => t.tagged).length != tile.content) return
    for (const neighbor of around) {
      if (this.#ended) break
      if (!neighbor.tagged && !neighbor.revealed) this.#revealTile(neighbor)
    }
  }

  #getTileByMouse(e: MouseEvent): [number, number] {
    const box = this.#canvas.getBoundingClientRect()
    const tileWidth = MinesweeperElement.tileWidth
    const dif = MinesweeperElement.difficulties[this.difficulty]
    const canvasX = (e.clientX - box.left - this.#canvas.clientLeft) * (dif.col * tileWidth / this.#canvas.clientWidth)
    const canvasY = (e.clientY - box.top - this.#canvas.clientTop) * (dif.row * tileWidth / this.#canvas.clientHeight)
    const tileX = Math.floor(canvasX / tileWidth)
    const tileY = Math.floor(canvasY / tileWidth)
    return [tileX, tileY]
  }

  #mouseTile(e: MouseEvent): Tile | undefined {
    const [x, y] = this.#getTileByMouse(e)
    return this.#tiles.find((tile) => tile.x == x && tile.y == y)
  }

  #handleCanvasClick(e: MouseEvent): void {
    this.#lastSpace = null
    this.#recordActivity()
    const tile = this.#mouseTile(e)
    if (tile) {
      this.#cursorX = tile.x
      this.#cursorY = tile.y
      if (this.#hintActive) this.#useHint(tile)
      else this.#openTile(tile)
    }
  }

  #handleCanvasRightClick(e: PointerEvent): void {
    if (e.button != 2) return
    this.#recordActivity()
    this.#lastSpace = null
    const tile = this.#mouseTile(e)
    if (tile) {
      this.#cursorX = tile.x
      this.#cursorY = tile.y
      this.#toggleFlag(tile)
    }
  }

  #revealTile(tile: Tile): void
  #revealTile(x: number, y: number): void
  #revealTile(x: number | Tile, y?: number): void {
    const t = x instanceof Tile ? x : this.#getTile(x, y!)
    if (this.#ended || t.tagged || t.revealed) return
    if (t.hasMine) return this.#lose()
    const around = this.#getAround(t)
    t.revealed = true
    t.content = around.mines
    if (around.mines == 0) {
      around
        .toArray()
        .filter((tile) => tile.revealed == false)
        .forEach((tile) => this.#revealTile(tile))
    }
    this.#renderCanvas()
    this.#calcTiles()
  }

  #lose(): void {
    this.#ended = true
    this.#clearHint()
    this.#lastSpace = null
    this.#stopTimer()
    this.#startButton.textContent = '😭'
    this.#tiles.filter((t) => t.hasMine).forEach((t) => t.revealed = true)
    this.#renderCanvas()
    this.#drawBanner(false)
  }

  #win(): void {
    this.#ended = true
    this.#clearHint()
    this.#lastSpace = null
    this.#stopTimer()
    this.#startButton.textContent = '😎'
    this.#tiles.filter((t) => t.hasMine).forEach((t) => t.tagged = true)
    this.#renderCanvas()
    this.#drawBanner(true)
  }

  #drawBanner(win: boolean): void {
    const text = win ? this.#translate('win') : this.#translate('lose')
    const tip = this.#translate('restart')
    const bannerHeight = 48 * devicePixelRatio
    const cvs = this.#canvas
    const ctx = this.#ctx!
    const textMetric = ctx.measureText(text)
    const tipMetric = ctx.measureText(tip)
    ctx.fillStyle = win ? '#1ca032aa' : '#ed143daa'
    ctx.fillRect(0, cvs.height / 2 - bannerHeight / 2, cvs.width, bannerHeight)
    ctx.save()
    ctx.textAlign = 'center'
    ctx.fillStyle = 'white'
    ctx.fillText(text, cvs.width / 2, cvs.height / 2 + textMetric.actualBoundingBoxAscent / 2)
    ctx.font = '16px sans-serif'
    ctx.fillText(tip, cvs.width / 2, cvs.height / 2 + tipMetric.actualBoundingBoxAscent + 12)
    ctx.restore()
  }

  #calcTiles(): void {
    if (!this.#started || this.#ended) return
    if (this.#tiles.every((t) => t.hasMine || t.revealed)) {
      this.#win()
      return
    }
    if (!this.#noLastChoice) return
    const remaining = this.#tiles.filter((t) => !t.revealed && !t.tagged)
    if (remaining.length != 2) return
    const [a, b] = remaining
    // Existing flags must be correct: only one safe tile may remain.
    if (a.distanceTo(b) <= Math.SQRT2 && a.hasMine != b.hasMine &&
        this.#tiles.every((t) => !t.tagged || t.hasMine)) {
      const safe = a.hasMine ? b : a
      safe.revealed = true
      safe.content = this.#getAround(safe).mines
      this.#win()
    }
  }

  #renderCanvas(): void {
    const cvs = this.#canvas
    const ctx = this.#ctx!
    const dpr = devicePixelRatio
    const dif = MinesweeperElement.difficulties[this.difficulty]
    const wid = MinesweeperElement.tileWidth * dpr
    const colormap = getComputedStyle(this).colorScheme == 'dark' ? MinesweeperElement.darkColors : MinesweeperElement.colors
    // console.log(`Rendering canvas with difficulty ${this.difficulty}, col ${dif.col}, row ${dif.row}`)
    cvs.style.width = `${dif.col * MinesweeperElement.tileWidth}px`
    cvs.style.height = `${dif.row * MinesweeperElement.tileWidth}px`
    cvs.width = dif.col * wid
    cvs.height = dif.row * wid
    ctx.strokeStyle = colormap.border
    ctx.lineWidth = 2
    ctx.font = `${MinesweeperElement.tileWidth}px "Cascadia Code"`
    this.#tiles.forEach((t) => {
      const { x, y } = t
      ctx.fillStyle = t.revealed ? colormap.revealed : colormap.unknown
      ctx.fillRect(x * wid, y * wid, wid, wid)
      if (t.revealed) {
        if (t.hasMine) {
          ctx.fillStyle = colormap.boom
          ctx.fillRect(x * wid, y * wid, wid, wid)
        }
        //@ts-ignore
        ctx.fillStyle = colormap[t.content] ?? colormap.revealed
        const content = t.content.toString()
        const metric = ctx.measureText(content)
        ctx.fillText(content, x * wid + wid / 2 - metric.width / 2, y * wid + wid / 2 + metric.actualBoundingBoxAscent / 2)
      }
      if (t.tagged) {
        const flag = '🚩'
        const metric = ctx.measureText(flag)
        ctx.fillText(flag, x * wid + wid / 2 - metric.width / 2, y * wid + wid / 2 + metric.actualBoundingBoxAscent / 2)
      }
    })
    for (let i = 0; i < dif.col + 1; i++) {
      // console.log(`Drawing line from (${i * wid}, 0)`)
      ctx.moveTo(i * wid, 0)
      ctx.lineTo(i * wid, cvs.height)
      ctx.stroke()
    }
    for (let i = 0; i < dif.row + 1; i++) {
      // console.log(`Drawing line from (0, ${i * wid})`)
      ctx.moveTo(0, i * wid)
      ctx.lineTo(cvs.width, i * wid)
      ctx.stroke()
    }
    ctx.strokeStyle = colormap.cursor
    ctx.strokeRect(this.#cursorX * wid, this.#cursorY * wid, wid, wid)
  }

  render(): TemplateResult<1> {
    return html`
      <div part="header">
        <div>
          <span>${this.#translate('difficulty')}</span>
          <select @change=${this.#handleDifficultyChange}>
            <option value="easy">${this.#translate('easy')}</option>
            <option value="normal">${this.#translate('normal')}</option>
            <option value="hard">${this.#translate('hard')}</option>
            <option value="evil">${this.#translate('evil')}</option>
          </select>
        </div>
        <button part="restart" @click=${() => this.#init(this.difficulty)}>🙂</button>
        <div part="options">
          <label>
            <span>${this.#translate('no_last_choice')}</span>
            <input type="checkbox" ?checked=${this.#noLastChoice}
              @change=${(e: Event) => {
                this.#noLastChoice = (e.target as HTMLInputElement).checked
                this.#calcTiles()
              }} />
          </label>
          <label>
            <span>${this.#translate('easy_start')}</span>
            <input
              type="checkbox"
              ?checked=${this.#easyStart}
              @change=${(e: Event) => {
                this.#easyStart = (e.target as HTMLInputElement).checked
              }}
            />
          </label>
        </div>
      </div>
      <div part="tiles-wrap">${this.#canvas}</div>
      <div part="stats">
        <div part="time">⏱${this.#formatTime()}</div>
        <button part="hint" ?hidden=${!this.#hintAvailable} aria-pressed=${this.#hintActive}
          @click=${this.#activateHint}>${this.#translate(this.#hintActive ? 'hint_active' : 'hint')}</button>
        <div part="counter">🚩${this.#tiles.filter((t) => t.tagged).length}/${MinesweeperElement.difficulties[this.difficulty].mine}</div>
      </div>
    `
  }

  #bindCanvasEvents(): void {
    const cvs = this.#canvas
    cvs.addEventListener('focus', () => {
      if (this.#cursorX < 0 || this.#cursorY < 0) {
        this.#cursorX = 0
        this.#cursorY = 0
      }
    })
    cvs.addEventListener('keydown', (e) => {
      this.#handleCanvasKeydown(e)
    })
    cvs.addEventListener('click', (e) => {
      this.#handleCanvasClick(e)
    })
    cvs.addEventListener('dblclick', (e) => {
      const tile = this.#mouseTile(e)
      if (tile) {
        this.#chord(tile)
        this.#cursorX = tile.x
        this.#cursorY = tile.y
      }
    })
    cvs.addEventListener('pointerdown', (e) => {
      this.#handleCanvasRightClick(e)
    })
    cvs.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  connectedCallback(): void {
    super.connectedCallback()
    if (this.#tiles.length == 0) this.#init(this.difficulty)
    else if (this.#started && !this.#ended) {
      this.#startTimer()
      this.#recordActivity()
    }
  }

  disconnectedCallback(): void {
    this.#clearHint()
    this.#stopTimer()
    this.#lastSpace = null
    super.disconnectedCallback()
  }
}

customElements.define('minesweeper-game', MinesweeperElement)

declare global {
  interface HTMLElementTagNameMap {
    'minesweeper-game': MinesweeperElement
  }
}
