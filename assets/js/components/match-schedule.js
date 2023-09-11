let schedules = document.querySelectorAll('.match-schedule')
if(schedules){
    schedules.forEach(schedule => {
        let strMultiply = (str, count) => {
            if(count == 0) return ''
            if(count == 1) return str
            else for(let i = 0; i < count; i ++) str = str + str
            return str
        }
        let row = parseInt(schedule.dataset.row)
        let round = parseInt(schedule.dataset.round)
        schedule.style = `grid-template-rows: repeat(${row}, 2em); grid-template-columns: 12em ${strMultiply('3em 12em ', round - 1)}`
    })
}