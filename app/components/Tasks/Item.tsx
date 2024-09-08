'use client';
import React from "react"
import { ArrowDropDown, ArrowDropUp, Checklist, Numbers, TimerRounded } from "@mui/icons-material"
import { Box, Button, Checkbox, List, ListItem, Typography } from "@mui/joy"
import { formatTime, useTimer } from "@/app/lib/time"
import { StatelessTaskTimer } from "./Timer";

function TimeTaskItem({ task, updateTask }: {
    task: { title: string, description: string, totalTime: number, spentTime: number, done: boolean },
    updateTask: Function
}) {
    const [open, setOpen] = React.useState(false)
    const [checked, setChecked] = React.useState(task.done)
    const { time, timerOn, setTimerOn } = useTimer(task.title, false, task.spentTime)

    const handleCheckboxChange = () => {
        const updatedTask = { ...task, done: !checked };
        setChecked(!checked);
        updateTask(updatedTask, true);
    };

    const handleTimeChange = (time: number) => {
        const updatedTask = { ...task, spentTime: time };
        updateTask(updatedTask);
    }

    React.useEffect(() => {
        handleTimeChange(time)
    }, [time])

    return (
        <div>
            <ListItem variant='soft' className='w-full h-12 !rounded-xl flex justify-between items-center'
                onClick={() => { setOpen(open => !open) }}
                sx={{
                    cursor: 'pointer',
                    backgroundColor: open ? 'neutral.softActiveBg' : 'neutral.softBg',
                    '&:hover': {
                        backgroundColor: 'neutral.softHoverBg',
                    }
                }}>
                <div className='flex items-center'>
                    <Checkbox
                        className='mr-2' checked={checked}
                        onChange={handleCheckboxChange} onClick={(e) => e.stopPropagation()}
                    />
                    {task.title}
                </div>
                <div className='flex space-x-1'>
                    <span className='opacity-80'>{formatTime(time)}</span>
                    <span>/</span>
                    <span>{formatTime(task.totalTime)}</span>
                    <TimerRounded />
                </div>
            </ListItem>
            <Box className='w-full duration-300 transition-all ease-in-out overflow-hidden p-4 space-y-2 !rounded-xl' sx={{
                height: open ? 'auto' : '0px',
                opacity: open ? 1 : 0,
                padding: open ? '' : '0px',
                color: 'neutral.plainColor',
                backgroundColor: 'neutral.softBg'
            }}>
                <Typography sx={{ color: "var(--joy-palette-neutral-solidBg)" }}> {task.description}</Typography>
                <StatelessTaskTimer time={time} timerOn={timerOn} setTimerOn={setTimerOn} />
            </Box>
        </div>
    )
}

function CountTaskItem({ task, updateTask }: {
    task: { title: string, description: string, totalCount: number, doneCount: number, unit: string, done: boolean },
    updateTask: Function
}) {
    const [open, setOpen] = React.useState(false)
    const [checked, setChecked] = React.useState(task.done)

    const handleCheckboxChange = () => {
        const updatedTask = { ...task, done: !checked };
        setChecked(!checked);
        updateTask(updatedTask, true);
    };

    const handleIncrement = () => {
        if (task.doneCount < task.totalCount) {
            const updatedTask = { ...task, doneCount: task.doneCount + 1 };
            updateTask(updatedTask, true);
        }
    };

    const handleDecrement = () => {
        if (task.doneCount > 0) {
            const updatedTask = { ...task, doneCount: task.doneCount - 1 };
            updateTask(updatedTask, true);
        }
    };

    return (
        <div>
            <ListItem
                variant='soft' className='w-full h-12 !rounded-xl flex justify-between items-center'
                onClick={() => { setOpen(open => !open) }}
                sx={{
                    cursor: 'pointer',
                    backgroundColor: open ? 'neutral.softActiveBg' : 'neutral.softBg',
                    '&:hover': {
                        backgroundColor: 'neutral.softHoverBg',
                    }
                }}
            >
                <div className='flex items-center'>
                    <Checkbox className='mr-2' checked={checked} onChange={handleCheckboxChange} onClick={(e) => e.stopPropagation()} />
                    {task.title}
                </div>
                <div className='flex space-x-1'>
                    <span className='opacity-80'>{task.doneCount}</span>
                    <span>/</span>
                    <span>{task.totalCount}</span>
                    <span>{task.unit}</span>
                    <Numbers />
                </div>
            </ListItem>
            <Box className='w-full duration-300 transition-all ease-in-out overflow-hidden p-4 space-y-2 !rounded-xl' sx={{
                height: open ? 'auto' : '0px',
                opacity: open ? 1 : 0,
                padding: open ? '' : '0px',
                color: 'neutral.plainColor',
                backgroundColor: 'neutral.softBg'
            }}>
                <Typography sx={{ color: "var(--joy-palette-neutral-solidBg)" }}>{task.description}</Typography>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Typography level="h1" >{task.doneCount}</Typography>
                        <Typography level="h3" sx={{ color: "var(--joy-palette-neutral-solidBg)" }}>/</Typography>
                        <Typography level="h1" >{task.totalCount}</Typography>
                        <Typography level="h2" sx={{ color: "var(--joy-palette-neutral-solidBg)" }}>{task.unit}</Typography>
                    </div>
                    <div className="flex items-center space-x-1 ">
                        <Button size="xs" variant="plain" color="neutral" onClick={handleDecrement}><ArrowDropDown /></Button>
                        <Button size="xs" variant="solid" color="primary" onClick={handleIncrement}><ArrowDropUp /></Button>
                    </div>
                </div>
            </Box>
        </div>
    )
}
function CheckListTaskItem({ task, updateTask }: {
    task: { title: string, description: string, subTasks: [{ title: string, done: boolean }], done: boolean },
    updateTask: Function
}) {
    const [open, setOpen] = React.useState(false)
    const [checked, setChecked] = React.useState(task.done)

    const handleCheckboxChange = () => {
        const updatedTask = { ...task, done: !checked };
        setChecked(!checked);
        updateTask(updatedTask, true);
    };

    const handleSubTaskChange = (index) => {
        const updatedSubTasks = [...task.subTasks];
        updatedSubTasks[index].done = !updatedSubTasks[index].done;
        const updatedTask = { ...task, subTasks: updatedSubTasks };
        updateTask(updatedTask, true);
    };

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
                    <Checkbox className='mr-2' checked={checked} onChange={handleCheckboxChange} onClick={(e) => e.stopPropagation()} />
                    {task.title}
                </div>
                <div className='flex space-x-1'>
                    <Checklist />
                </div>
            </ListItem>
            <Box className='w-full duration-300 transition-all ease-in-out overflow-hidden p-4 space-y-2 !rounded-xl' sx={{
                height: open ? 'auto' : '0px',
                opacity: open ? 1 : 0,
                padding: open ? '' : '0px',
                color: 'neutral.plainColor',
                backgroundColor: 'neutral.softBg'
            }}>
                <Typography sx={{ color: "var(--joy-palette-neutral-solidBg)" }}>{task.description}</Typography>
                <div className="flex justify-between items-center">
                    <List>
                        {task.subTasks.map((subTask, idx) => {
                            return (
                                <ListItem key={idx} className='w-full flex items-center'>
                                    <Checkbox checked={subTask.done} onChange={() => handleSubTaskChange(idx)} />
                                    <span>{subTask.title}</span>
                                </ListItem>
                            )
                        })}
                    </List>
                </div>
            </Box>
        </div>
    )
}
export { CountTaskItem, TimeTaskItem, CheckListTaskItem }