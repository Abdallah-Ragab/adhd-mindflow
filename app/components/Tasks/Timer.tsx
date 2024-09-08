'use client';
import { formatTime, useTimer } from "@/app/lib/time"
import { PauseCircle, PlayCircle } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/joy";

export function TaskTimer ({ taskID, initialTime }: {taskID: string | number, initialTime: number}) { 
    const {time, timerOn, setTimerOn} = useTimer(taskID.toString(), false, initialTime)
    
    return (
        <div className='flex justify-between items-baseline w-fi'>
            <div>
                <Typography className='!text-4xl font-bold w-72' >{formatTime(time)}</Typography>
                <div className='flex justify-between w-40 text-xs pl-2 p-1 space-x-2 opacity-80'>
                    <span>Hours</span>
                    <span>Minutes</span>
                    <span>Seconds</span>
                </div>
            </div>
            <div>
                <IconButton onClick={() => setTimerOn(!timerOn)} className='hover:!bg-transparent'>
                    {timerOn ?
                        <PauseCircle className='!text-3xl' sx={{ color: 'var(--joy-palette-primary-softColor)!important' }} /> :
                        <PlayCircle className='!text-3xl' sx={{ color: 'var(--joy-palette-primary-softColor)!important' }} />}
                </IconButton>
        
            </div>
        </div>
    )
}


export function StatelessTaskTimer ({time, timerOn, setTimerOn}) {     
    return (
        <div className='flex justify-between items-baseline w-fi'>
            <div>
                <Typography className='!text-4xl font-bold w-72' >{formatTime(time)}</Typography>
                <div className='flex justify-between w-40 text-xs pl-2 p-1 space-x-2 opacity-80'>
                    <span>Hours</span>
                    <span>Minutes</span>
                    <span>Seconds</span>
                </div>
            </div>
            <div>
                <IconButton onClick={() => setTimerOn(!timerOn)} className='hover:!bg-transparent'>
                    {timerOn ?
                        <PauseCircle className='!text-3xl' sx={{ color: 'var(--joy-palette-primary-softColor)!important' }} /> :
                        <PlayCircle className='!text-3xl' sx={{ color: 'var(--joy-palette-primary-softColor)!important' }} />}
                </IconButton>
        
            </div>
        </div>
    )
}
