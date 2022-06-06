function convert(date) {
    return date[3] + date[4] + "/" + date[0] + date[1] + date.substring(5, date.length)
}

function removeTime(date) {
    return date.substring(0, 10)
}

function setTimers(list) {
    list.forEach(item => setTimeout(() => {
        alert(item.plannedStart)
    }, Date.parse(convert(item.plannedStart)) - Date.now()))
}

export default {
    convert,
    setTimers,
    removeTime
}