const $ = (id) => document.getElementById(id)
const settings = Array.from({ length: 3 }, (_, i) => ({
  type: ['triangle','sine','sine'][i],
  level: [0.6, 0.25, 0.2][i],
  octave: i === 2 ? -1 : 0,
  detune: i === 1 ? 7 : 0
}))
const env = { attack: 0.02, decay: 0.2, sustain: 0.65, release: 0.35 }
const tone = { cutoff: 7000, resonance: 1 }
// Lazy-load the parser only when a file is selected; manual playing works offline.
const MIDI_PARSER_URL = 'https://esm.sh/midi-file@1.2.4'
let loadedMidi = null, fileLoading = false, loadVersion = 0
const playback = { active: false, version: 0, timer: null, index: 0, startedAt: 0, endAt: 0 }
let ctx,
  master,
  compressor,
  octave = 4,
  midiAccess
const voices = new Map(),
  tails = new Set(),
  heldKeys = new Set(),
  pointers = new Map(),
  pedals = new Map(),
  bends = new Map()
function slider(parent, label, obj, key, min, max, step, format = (x) => String(x)) {
  const el = document.createElement('label')
  el.append(document.createTextNode(label))
  const input = document.createElement('input')
  input.type = 'range'
  Object.assign(input, { min, max, step, value: obj[key] })
  const out = document.createElement('output')
  out.textContent = format(obj[key])
  input.addEventListener('input', () => {
    obj[key] = Number(input.value)
    out.textContent = format(obj[key])
    updateSound()
  })
  el.append(input, out)
  parent.append(el)
}
settings.forEach((s, i) => {
  const panel = document.createElement('section')
  panel.className = 'panel'
  panel.innerHTML = `<h2>振荡器 ${i + 1}</h2><div class="controls"><label>波形<select aria-label="振荡器 ${i + 1} 波形"><option value="sine">正弦波</option><option value="triangle">三角波</option><option value="sawtooth">锯齿波</option><option value="square">方波</option></select></label></div>`
  const select = panel.querySelector('select')
  select.value = s.type
  select.onchange = () => {
    s.type = select.value
    updateSound()
  }
  const controls = panel.querySelector('.controls')
  slider(controls, '音量', s, 'level', 0, 1, 0.01, (x) => Math.round(x * 100) + '%')
  slider(controls, '八度', s, 'octave', -2, 2, 1)
  slider(controls, '微调', s, 'detune', -50, 50, 1, (x) => x + ' cents')
  $('oscillators').append(panel)
})
for (const [key, label, min, max, step] of [
  ['attack', '起音', 0.005, 2, 0.005],
  ['decay', '衰减', 0.01, 2, 0.01],
  ['sustain', '持续', 0, 1, 0.01],
  ['release', '释音', 0.02, 4, 0.01]
])
  slider($('envelope'), label, env, key, min, max, step, (x) => (key === 'sustain' ? Math.round(x * 100) + '%' : x.toFixed(2) + ' s'))
slider($('filter'), '截止频率', tone, 'cutoff', 40, 18000, 1, (x) => x + ' Hz')
slider($('filter'), '共振', tone, 'resonance', 0, 15, 0.1, (x) => x.toFixed(1))
async function start() {
  try {
    if (!ctx) {
      const Audio = window.AudioContext || window.webkitAudioContext
      if (!Audio) throw Error('浏览器不支持 Web Audio')
      ctx = new Audio()
      master = ctx.createGain()
      master.gain.value = Number($('volume').value)
      compressor = ctx.createDynamicsCompressor()
      master.connect(compressor).connect(ctx.destination)
    }
    await ctx.resume()
    $('status').textContent = ctx.state === 'running' ? '音频已就绪' : '请再次点击启动音频'
    $('power').textContent = '音频已启动'
    return ctx.state === 'running'
  } catch (e) {
    $('status').textContent = '无法启动音频：' + e.message
    return false
  }
}
$('power').onclick = start
$('volume').oninput = () => {
  if (ctx) master.gain.setTargetAtTime(Number($('volume').value), ctx.currentTime, 0.02)
}
function updateSound() {
  if (!ctx) return
  for (const v of voices.values()) {
    v.filter.frequency.setTargetAtTime(Math.min(tone.cutoff, ctx.sampleRate * 0.45), ctx.currentTime, 0.02)
    v.filter.Q.setTargetAtTime(tone.resonance, ctx.currentTime, 0.02)
    v.oscs.forEach((o, i) => {
      o.type = settings[i].type
      o.frequency.setTargetAtTime(440 * 2 ** ((v.note - 69) / 12 + settings[i].octave), ctx.currentTime, 0.02)
      o.detune.setTargetAtTime(settings[i].detune + (bends.get(v.channel) || 0), ctx.currentTime, 0.02)
      v.gains[i].gain.setTargetAtTime(settings[i].level / 3, ctx.currentTime, 0.02)
    })
  }
}
function noteOn(id, note, velocity = 1, channel = 'local') {
  if (!ctx || ctx.state !== 'running' || voices.has(id)) return
  if (voices.size >= 24) release(voices.keys().next().value, true)
  const t = ctx.currentTime,
    amp = ctx.createGain(),
    filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = Math.min(tone.cutoff, ctx.sampleRate * 0.45)
  filter.Q.value = tone.resonance
  filter.connect(amp).connect(master)
  amp.gain.setValueAtTime(0, t)
  amp.gain.linearRampToValueAtTime(velocity, t + env.attack)
  amp.gain.linearRampToValueAtTime(velocity * env.sustain, t + env.attack + env.decay)
  const v = { note, channel, amp, filter, oscs: [], gains: [], down: true }
  settings.forEach((s) => {
    const o = ctx.createOscillator(),
      g = ctx.createGain()
    o.type = s.type
    o.frequency.value = 440 * 2 ** ((note - 69) / 12 + s.octave)
    o.detune.value = s.detune + (bends.get(channel) || 0)
    g.gain.value = s.level / 3
    o.connect(g).connect(filter)
    o.start(t)
    v.oscs.push(o)
    v.gains.push(g)
  })
  voices.set(id, v)
  paint()
}
function release(id, force = false) {
  const v = voices.get(id)
  if (!v) return
  v.down = false
  if (!force && pedals.get(v.channel)) return
  voices.delete(id)
  const t = ctx.currentTime,
    duration = force ? 0.015 : env.release
  v.amp.gain.cancelAndHoldAtTime(t)
  v.amp.gain.linearRampToValueAtTime(0, t + duration)
  tails.add(v)
  v.oscs.forEach((o) => o.stop(t + duration + 0.02))
  v.oscs[0].onended = () => {
    v.oscs.forEach((o) => o.disconnect())
    v.gains.forEach((g) => g.disconnect())
    v.filter.disconnect()
    v.amp.disconnect()
    tails.delete(v)
  }
  paint()
}
function panic() {
  if (playback.active) {
    stopPlayback('已停止，手动演奏已恢复。')
    return
  }
  for (const id of [...voices.keys()]) release(id, true)
  for (const v of tails) {
    v.amp.gain.cancelScheduledValues(ctx.currentTime)
    v.amp.gain.setValueAtTime(0, ctx.currentTime)
  }
  heldKeys.clear()
  pointers.clear()
  pedals.clear()
  bends.clear()
  paint()
}
$('panic').onclick = panic
function releaseManualOnBlur() {
  if (!playback.active) panic()
}
window.addEventListener('blur', releaseManualOnBlur)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) releaseManualOnBlur()
})
const mapping = {
  KeyQ: 0,
  Digit2: 1,
  KeyW: 2,
  KeyE: 3,
  Digit4: 4,
  KeyR: 5,
  Digit5: 6,
  KeyT: 7,
  KeyY: 8,
  Digit7: 9,
  KeyU: 10,
  Digit8: 11,
  KeyI: 12,
  Digit9: 13,
  KeyO: 14,
  KeyP: 15,
  Minus: 16,
  BracketLeft: 17,
  Equal: 18,
  BracketRight: 19
}
const names = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
const keyboardBase = () => (octave + 1) * 12 - 3
const isPianoNote = note => note >= 21 && note <= 108
const noteName = note => names[note % 12] + (Math.floor(note / 12) - 1)
function keyLabel(code) {
  return { Minus: '-', Equal: '=', BracketLeft: '[', BracketRight: ']' }[code] || code.replace(/^(Key|Digit)/, '')
}
function paint() {
  document.querySelectorAll('.key').forEach((k) =>
    k.classList.toggle(
      'active',
      [...voices.values()].some((v) => v.note === Number(k.dataset.note))
    )
  )
  drawOverview()
}
// Standard piano: MIDI 21 (A0) through 108 (C8), 52 white and 36 black keys.
function overviewKeys(width) {
  const whiteWidth = width / 52, blackWidth = whiteWidth * 0.62
  const keys = []
  let white = 0
  for (let note = 21; note <= 108; note++) {
    const black = [1, 3, 6, 8, 10].includes(note % 12)
    keys.push({ note, black, x: black ? white * whiteWidth - blackWidth / 2 : white * whiteWidth, width: black ? blackWidth : whiteWidth })
    if (!black) white++
  }
  return keys
}
function drawOverview() {
  const canvas = $('keyboard-overview')
  if (!canvas) return
  const context = canvas.getContext('2d')
  if (!context) return
  const width = canvas.getBoundingClientRect().width
  if (!width) return
  const height = 112, keyHeight = 76
  const ratio = window.devicePixelRatio || 1
  const pixelWidth = Math.round(width * ratio), pixelHeight = Math.round(height * ratio)
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth
    canvas.height = pixelHeight
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  context.clearRect(0, 0, width, height)
  const active = new Set([...voices.values()].map(v => v.note))
  const start = keyboardBase(), end = start + 19
  const keys = overviewKeys(width)
  // Paint white keys first so accidentals overlap them just like the full keyboard.
  for (const black of [false, true]) {
    for (const key of keys.filter(key => key.black === black)) {
      const selected = key.note >= start && key.note <= end
      context.fillStyle = active.has(key.note) ? '#3cb69a' : black ? (selected ? '#39748a' : '#25493f') : (selected ? '#d7edf3' : '#f8fcfa')
      const h = black ? keyHeight * 0.62 : keyHeight
      context.fillRect(key.x, 0, key.width, h)
      context.strokeStyle = black ? '#193b34' : '#9db7ae'
      context.lineWidth = 0.7
      context.strokeRect(key.x + 0.35, 0.35, key.width - 0.7, h - 0.7)
    }
  }
  const selected = keys.filter(key => key.note >= start && key.note <= end)
  if (selected.length) {
    const left = Math.min(...selected.map(key => key.x))
    const right = Math.max(...selected.map(key => key.x + key.width))
    context.fillStyle = '#428ba3'
    context.fillRect(left, keyHeight + 4, right - left, 4)
  }
  context.fillStyle = getComputedStyle($('synth')).getPropertyValue('--text-color').trim() || '#55786f'
  context.font = '10px sans-serif'
  for (const key of keys.filter(key => key.note === 21 || key.note % 12 === 0)) {
    context.textAlign = key.note === 21 ? 'left' : key.note === 108 ? 'right' : 'center'
    const x = key.note === 21 ? 0 : key.note === 108 ? width : key.x + key.width / 2
    context.fillText((key.note === 21 ? 'A' : 'C') + (Math.floor(key.note / 12) - 1), x, 103)
  }
  canvas.setAttribute('aria-label', `88 键全览，A0 至 C8。当前可用键盘音域 ${noteName(Math.max(21, start))} 至 ${noteName(Math.min(108, end))}。正在演奏的音符：${[...active].sort((a, b) => a - b).map(noteName).join('、') || '无'}。`)
}
function draw() {
  const base = keyboardBase()
  let white = 0
  const total = 12
  $('keyboard').replaceChildren()
  for (let i = 0; i <= 19; i++) {
    const note = base + i
    const black = [1, 3, 6, 8, 10].includes(note % 12),
      key = document.createElement('button')
    key.className = 'key ' + (black ? 'black' : 'white')
    key.dataset.note = note
    key.disabled = playback.active || !isPianoNote(note)
    key.type = 'button'
    key.tabIndex = -1
    const whiteWidth = 100 / total, blackWidth = whiteWidth * 0.62
    key.style.width = (black ? blackWidth : whiteWidth) + '%'
    key.style.left = (white * whiteWidth - (black ? blackWidth / 2 : 0)) + '%'
    const letter = keyLabel(Object.entries(mapping).find(([, v]) => v === i)[0])
    key.innerHTML = `${letter}<small>${noteName(note)}</small>`
    key.setAttribute('aria-label', `${noteName(note)}（${letter}）${isPianoNote(note) ? '' : '，超出 88 键范围'}`)
    $('keyboard').append(key)
    if (!black) white++
  }
  $('octave').textContent = '八度 ' + octave
  $('down').disabled = octave <= 0
  $('up').disabled = octave >= 8
  paint()
}
function changeOctave(delta) {
  if (playback.active) return
  panic()
  octave = Math.max(0, Math.min(8, octave + delta))
  draw()
}
$('down').onclick = () => changeOctave(-1)
$('up').onclick = () => changeOctave(1)
draw()
const editing = (target) => target instanceof Element && Boolean(target.closest('input,select,textarea,button,[contenteditable="true"]'))
document.addEventListener('keydown', async (e) => {
  if (playback.active) return
  if (editing(e.target) || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return
  if (['KeyZ', 'KeyX'].includes(e.code)) {
    e.preventDefault()
    changeOctave(e.code === 'KeyZ' ? -1 : 1)
    return
  }
  if (!(e.code in mapping)) return
  e.preventDefault()
  const note = keyboardBase() + mapping[e.code]
  if (!isPianoNote(note)) return
  heldKeys.add(e.code)
  if ((await start()) && !playback.active && heldKeys.has(e.code)) noteOn('key:' + e.code, note)
})
document.addEventListener('keyup', (e) => {
  heldKeys.delete(e.code)
  release('key:' + e.code)
})
$('keyboard').addEventListener('pointerdown', async (e) => {
  if (playback.active) return
  const key = e.target.closest('.key')
  if (!key || key.disabled) return
  e.preventDefault()
  const id = 'pointer:' + e.pointerId
  pointers.set(e.pointerId, Number(key.dataset.note))
  $('keyboard').setPointerCapture(e.pointerId)
  if ((await start()) && !playback.active && isPianoNote(pointers.get(e.pointerId))) noteOn(id, pointers.get(e.pointerId))
})
$('keyboard').addEventListener('pointermove', (e) => {
  if (!pointers.has(e.pointerId)) return
  const key = document.elementFromPoint(e.clientX, e.clientY)?.closest('.key')
  if (key?.disabled) {
    release('pointer:' + e.pointerId)
    pointers.set(e.pointerId, null)
    return
  }
  if (!key || !$('keyboard').contains(key)) return
  const note = Number(key.dataset.note)
  if (pointers.get(e.pointerId) !== note) {
    release('pointer:' + e.pointerId)
    pointers.set(e.pointerId, note)
    noteOn('pointer:' + e.pointerId, note)
  }
})
for (const event of ['pointerup', 'pointercancel', 'lostpointercapture'])
  $('keyboard').addEventListener(event, (e) => {
    pointers.delete(e.pointerId)
    release('pointer:' + e.pointerId)
  })
function midiMessage(input, e) {
  const fromFile = input.id === 'file-playback'
  if (playback.active && !fromFile) return
  if (!fromFile && $('devices').value !== 'all' && $('devices').value !== input.id) return
  const [status, note, value] = e.data,
    command = status & 240,
    channel = input.id + ':' + (status & 15),
    id = 'midi:' + channel + ':' + note
  if (command === 144 && value > 0) noteOn(id, note, value / 127, channel)
  else if (command === 128 || (command === 144 && value === 0)) release(id)
  else if (command === 224) {
    bends.set(channel, ((note + value * 128 - 8192) / 8192) * 200)
    updateSound()
  } else if (command === 176 && note === 64) {
    pedals.set(channel, value >= 64)
    if (value < 64) for (const [key, v] of voices) if (v.channel === channel && !v.down) release(key)
  } else if (command === 176 && (note === 123 || note === 120)) {
    for (const [key, v] of voices) if (v.channel === channel) release(key, true)
  }
}
function refreshMidi() {
  if (!playback.active) panic()
  const selected = $('devices').value
  $('devices').replaceChildren(new Option('所有设备', 'all'))
  let count = 0
  for (const input of midiAccess.inputs.values()) {
    input.onmidimessage = (e) => midiMessage(input, e)
    if (input.state === 'connected') {
      $('devices').add(new Option(input.name || 'MIDI 键盘', input.id))
      count++
    }
  }
  if ([...$('devices').options].some((o) => o.value === selected)) $('devices').value = selected
  $('midi-status').textContent = count ? '已连接 ' + count + ' 个 MIDI 输入设备' : 'MIDI 已启用，等待连接设备'
}
$('devices').onchange = panic
$('midi').onclick = async () => {
  if (playback.active) return
  if (!navigator.requestMIDIAccess) {
    $('midi-status').textContent = '此浏览器不支持 Web MIDI，请使用支持的浏览器。'
    return
  }
  if (!window.isSecureContext) {
    $('midi-status').textContent = '请通过 HTTPS 或 localhost 启用 MIDI。'
    return
  }
  if (!(await start())) return
  try {
    midiAccess = await navigator.requestMIDIAccess({ sysex: false })
    midiAccess.onstatechange = refreshMidi
    refreshMidi()
    $('midi').textContent = '重新连接 MIDI'
  } catch (e) {
    $('midi-status').textContent = 'MIDI 连接失败，请检查浏览器权限：' + e.message
  }
}

// Merge tracks in tick order before applying the shared tempo map.
function buildMidiTimeline(midi) {
  if (![0, 1].includes(midi.header.format)) throw Error('暂不支持 MIDI 格式 2，请转换为格式 0 或 1。')
  const { ticksPerBeat, framesPerSecond, ticksPerFrame } = midi.header
  const smpte = framesPerSecond && ticksPerFrame
  if (!smpte && !(ticksPerBeat > 0)) throw Error('MIDI 时间分辨率无效。')
  const merged = []
  for (const track of midi.tracks) {
    let tick = 0
    for (const event of track) {
      if (!Number.isFinite(event.deltaTime) || event.deltaTime < 0) throw Error('MIDI 事件时间无效。')
      tick += event.deltaTime
      merged.push({ tick, event })
    }
  }
  merged.sort((a, b) => a.tick - b.tick)
  let tick = 0, time = 0, tempo = 500000, notes = 0
  const events = []
  for (const item of merged) {
    const fps = framesPerSecond === 29 ? 29.97 : framesPerSecond
    time += (item.tick - tick) * (smpte ? 1 / (fps * ticksPerFrame) : tempo / 1000000 / ticksPerBeat)
    tick = item.tick
    const e = item.event
    if (e.type === 'setTempo') {
      if (!(e.microsecondsPerBeat > 0)) throw Error('MIDI 速度无效。')
      tempo = e.microsecondsPerBeat
    }
    let data
    if (e.type === 'noteOn' || e.type === 'noteOff') {
      data = [(e.type === 'noteOn' ? 0x90 : 0x80) | e.channel, e.noteNumber, e.velocity]
      if (e.type === 'noteOn' && e.velocity > 0) notes++
    } else if (e.type === 'controller') data = [0xb0 | e.channel, e.controllerType, e.value]
    else if (e.type === 'pitchBend') {
      const bend = e.value + 8192
      data = [0xe0 | e.channel, bend & 127, (bend >> 7) & 127]
    }
    if (data) events.push({ time, data })
  }
  if (!notes) throw Error('文件中没有可播放的音符。')
  return { events, duration: time, notes }
}

function formatTime(seconds) {
  const value = Math.max(0, Math.floor(seconds))
  return String(Math.floor(value / 60)).padStart(2, '0') + ':' + String(value % 60).padStart(2, '0')
}
function showFileTime(time) {
  const duration = loadedMidi?.duration || 0
  $('file-time').textContent = formatTime(time) + ' / ' + formatTime(duration)
  $('file-progress').max = duration || 1
  $('file-progress').value = Math.min(time, duration)
}
function updatePlaybackControls() {
  $('file-play').disabled = !loadedMidi || fileLoading || playback.active
  $('file-stop').disabled = !playback.active
  $('midi-file').disabled = playback.active
  $('midi').disabled = playback.active
  $('devices').disabled = playback.active
  $('down').disabled = playback.active || octave <= 0
  $('up').disabled = playback.active || octave >= 8
  $('keyboard').setAttribute('aria-disabled', String(playback.active))
  document.querySelectorAll('#keyboard .key').forEach(key => { key.disabled = playback.active || !isPianoNote(Number(key.dataset.note)) })
}
function stopPlayback(message = '已停止，手动演奏已恢复。') {
  playback.version++
  playback.active = false
  clearInterval(playback.timer)
  playback.timer = null
  playback.endAt = 0
  panic()
  updatePlaybackControls()
  $('file-status').textContent = message
}
$('file-stop').onclick = () => stopPlayback()
$('midi-file').onchange = async () => {
  const version = ++loadVersion
  const file = $('midi-file').files[0]
  loadedMidi = null
  fileLoading = Boolean(file)
  showFileTime(0)
  updatePlaybackControls()
  if (!file) {
    $('file-status').textContent = '请选择 MIDI 文件。'
    return
  }
  $('file-status').textContent = '正在读取 MIDI 文件…'
  try {
    if (file.size > 10 * 1024 * 1024) throw Error('请选择小于 10 MB 的 MIDI 文件。')
    const [module, buffer] = await Promise.all([import(MIDI_PARSER_URL), file.arrayBuffer()])
    if (version !== loadVersion) return
    const bytes = new Uint8Array(buffer)
    if (String.fromCharCode(...bytes.slice(0, 4)) !== 'MThd') throw Error('这不是有效的标准 MIDI 文件。')
    const parseMidi = module.parseMidi || module.default?.parseMidi
    if (!parseMidi) throw Error('MIDI 解析库加载失败，请重试。')
    loadedMidi = { ...buildMidiTimeline(parseMidi(bytes)), name: file.name }
    $('file-status').textContent = file.name + ' · ' + loadedMidi.notes + ' 个音符，准备播放。'
    showFileTime(0)
  } catch (error) {
    if (version !== loadVersion) return
    $('file-status').textContent = '读取失败：' + (error.message || String(error)) + '（若网络加载失败，请检查 CDN 连接后重选文件。）'
  } finally {
    if (version === loadVersion) {
      fileLoading = false
      updatePlaybackControls()
    }
  }
}
$('file-play').onclick = async () => {
  if (!loadedMidi || fileLoading || playback.active) return
  panic()
  playback.active = true
  const version = ++playback.version
  updatePlaybackControls()
  const ready = await start()
  if (!playback.active || version !== playback.version) return
  if (!ready) {
    stopPlayback('音频启动失败，请重试。')
    return
  }
  // Stop/blur may have cancelled playback while AudioContext.resume was pending.
  playback.index = 0
  playback.startedAt = ctx.currentTime
  playback.endAt = 0
  showFileTime(0)
  $('file-status').textContent = '正在播放 ' + loadedMidi.name + '；手动演奏已禁用。'
  const tick = () => {
    if (!playback.active) return
    if (ctx.state !== 'running') {
      stopPlayback('音频已中断，手动演奏已恢复。')
      return
    }
    const elapsed = ctx.currentTime - playback.startedAt
    const events = loadedMidi.events
    while (playback.index < events.length && events[playback.index].time <= elapsed) {
      midiMessage({ id: 'file-playback' }, { data: events[playback.index++].data })
    }
    showFileTime(elapsed)
    if (elapsed >= loadedMidi.duration && !playback.endAt) {
      // Release even malformed files that omit note-off or pedal-up at the end.
      pedals.clear()
      for (const id of [...voices.keys()]) release(id)
      playback.endAt = elapsed + env.release + 0.05
    }
    if (playback.endAt && elapsed >= playback.endAt) stopPlayback('播放完成，手动演奏已恢复。')
  }
  playback.timer = setInterval(tick, 10)
  tick()
}

// Redraw at the rendered size, including after responsive layout or theme changes.
window.addEventListener('resize', drawOverview)
if (window.ResizeObserver) new ResizeObserver(drawOverview).observe($('keyboard-overview'))
const overviewThemeObserver = new MutationObserver(drawOverview)
for (const element of [document.documentElement, document.body]) {
  overviewThemeObserver.observe(element, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
}
