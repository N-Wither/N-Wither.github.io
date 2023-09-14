function localeDateTime(dateString, timeZone) {
    let date = new Date(dateString)
    return date.toLocaleString(undefined, {timeZone: timeZone})
}