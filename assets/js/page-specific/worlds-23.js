let refreshTime = (timeZone, offset) => {
    let times = document.querySelectorAll('.info.time')
    times.forEach(time => {
        if (time.textContent.length <= 10) return;
        let raw = time.textContent + ' ' + offset
        // console.log(raw)
        time.textContent = localeDateTime(raw, timeZone).slice(0, -3)
    })
}

let getCurrentOffset = () => {
    let offset = new Date().getTimezoneOffset() / 60 * (-1)
    return offset >= 0 ? 'GMT+' + offset : 'GMT' + offset
}

let setTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
let setOffset = getCurrentOffset()
refreshTime(setTimeZone, setOffset)

document.getElementById('time-zone-option:you').onclick = () => {
    if(setOffset == getCurrentOffset()) return
    refreshTime(setTimeZone, 'UTC')
    setOffset = getCurrentOffset()
}
document.getElementById('time-zone-option:utc').onclick = () => {
    refreshTime('UTC', setOffset)
    setOffset = 'GMT+0'
}