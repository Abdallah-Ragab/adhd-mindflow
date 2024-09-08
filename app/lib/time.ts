import { useEffect, useRef, useState } from "react"

export function formatTime(time: number) {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${hours < 10 ? '0' + hours.toString() : hours.toString()}:${minutes < 10 ? '0' + minutes.toString() : minutes.toString()}:${seconds < 10 ? '0' + seconds.toString() : seconds.toString()}`
}

export const useTimer = (id: string, persistent: Boolean = false, initialTime = 0) => {

    const getStoredTimer = (id: string) => {
        const storedTimer = localStorage.getItem(id)
        return storedTimer ? JSON.parse(storedTimer) : null
    }
    const getStoredTimerValue = (id: string, key: string) => {
        const timer = getStoredTimer(id) ?? { time: initialTime, timerOn: false, lastOn: new Date().getTime() }
        return timer[key]
    }

    const uniqeId = `timer-${id}`
    const [time, setTime] = useState(getStoredTimerValue(uniqeId, 'time'))
    const [timerOn, setTimerOn] = useState(getStoredTimerValue(uniqeId, 'timerOn'))
    const lastOn = useRef(getStoredTimerValue(uniqeId, 'lastOn'))

    // on Mount
    // If persistent, check if the timer was on when the page was last closed and update the time
    useEffect(() => {
        if (persistent) {
            const now = new Date().getTime()
            const diff = Math.floor((now - lastOn.current) / 1000)
            if (timerOn && (diff > 1)) {
                setTime(time + diff)
            }
        }
        else {
            setTimerOn(false)
        }
    }, [])

    // on time or timerOn change
    // Save the timer to local storage
    useEffect(() => {
        localStorage.setItem(uniqeId, JSON.stringify({
            time,
            timerOn: timerOn,
            lastOn: lastOn.current
        }))
    }, [time, timerOn])

    // on timerOn change
    // start/remove an interval to update the time
    useEffect(() => {
        if (timerOn) {
            const interval = setInterval(() => {
                setTime((time: number) => time + 1)
                lastOn.current = new Date().getTime()
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [timerOn])

    return { time, timerOn, setTimerOn }
}