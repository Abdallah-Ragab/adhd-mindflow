'use client';
import React from "react"
import { TimerRounded } from "@mui/icons-material"
import { Box, Checkbox, ListItem } from "@mui/joy"
import { formatTime } from "@/app/lib/time"
import { SmallTimer } from "../timer";

export default function TimeTaskItem({ task }: { task: { title: string, totalTime: number, spentTime: number, done:boolean } }) {
    const [open, setOpen] = React.useState(false)
    const [checked, setChecked] = React.useState(task.done)
    return (
        <div>
            <ListItem variant='soft' className='w-full h-12 !rounded-xl flex justify-between items-center' onClick={() => { setOpen(open => !open) }} sx={{
                cursor: 'pointer',
                backgroundColor: open ? 'neutral.softActiveBg' : 'neutral.softBg',
                '&:hover': {
                    backgroundColor: 'neutral.softHoverBg',
                }
            }}>
                <div className='flex items-center'>
                    <Checkbox className='mr-2' />
                    {task.title}
                </div>
                <div className='flex space-x-1'>
                    <span className='opacity-80'>{formatTime(task.spentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(task.totalTime)}</span>
                    <TimerRounded />
                </div>
            </ListItem>
            <Box className='w-full duration-300 transition-all ease-in-out overflow-hidden p-4' sx={{
                height: open ? 'auto' : '0px',
                opacity: open ? 1 : 0,
                padding: open ? '' : '0px',
            }}>
                Details
                <SmallTimer id={task.title} persistent={true} />
            </Box>
        </div>
    )
}