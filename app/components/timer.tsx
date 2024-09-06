import { PauseCircle, PlayCircle } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/joy'
import React, { useEffect, useRef, useState } from 'react'
import { formatTime } from '../lib/time'

const getStoredTimer = (id:string) => {
    const storedTimer = localStorage.getItem(id)
    return storedTimer ? JSON.parse(storedTimer) : null
}
const Timer = ({ id = '', persistent = false }: { id: string, persistent: Boolean }) => {
    id = id ? id : Math.random().toString(36).substr(2, 9)
    const uniqeId = `timer-${id}`
    const [time, setTime] = useState(getStoredTimer(uniqeId) ? getStoredTimer(uniqeId).time : 0)
    const [timerOn, setTimerOn] = useState(getStoredTimer(uniqeId) ? getStoredTimer(uniqeId).timerOn : false)
    const lastOnRef = useRef(getStoredTimer(uniqeId) ? getStoredTimer(uniqeId).lastOn : new Date().getTime())

    useEffect(() => {
        if (persistent) {
            const now = new Date().getTime()
            const diff = Math.floor((now - lastOnRef.current) / 1000)
            if (timerOn && (diff > 1)) {
                setTime(time + diff)
            }
        }
        else {
            setTimerOn(false)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem(uniqeId, JSON.stringify({
            time,
            timerOn,
            lastOn: lastOnRef.current
        }))
    }, [time, timerOn])

    useEffect(() => {
        if (timerOn) {
            const interval = setInterval(() => {
                setTime(time => time + 1)
                lastOnRef.current = new Date().getTime()
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [timerOn])

    return (
        <div className='flex justify-between items-baseline w-fit !text-neutral-700'>
            <div>
                <Typography className='!text-6xl font-bold !text-neutral-700 w-72' >{formatTime(time)}</Typography>
                <div className='flex justify-between w-64 text-sm pl-6 pt-1 opacity-80'>
                    <span>Hours</span>
                    <span>Minutes</span>
                    <span>Seconds</span>
                </div>
            </div>
            <IconButton onClick={() => setTimerOn(!timerOn)} className='hover:!bg-transparent hover:!text-neutral-500' sx={{'&>svg': {fill: 'var(--joy-palette-neutral-500)'}}}>
                {timerOn ? <PauseCircle className='!text-4xl !text-neutral-700' /> : <PlayCircle className='!text-4xl !text-neutral-700'/>}
            </IconButton>
        </div>
    )
}

export default Timer
