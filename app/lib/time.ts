export function formatTime(time: number) {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${hours < 10 ? '0' + hours.toString() : hours.toString()}:${minutes < 10 ? '0' + minutes.toString() : minutes.toString()}:${seconds < 10 ? '0' + seconds.toString() : seconds.toString()}`
}