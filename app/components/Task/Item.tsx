import { TimerRounded } from "@mui/icons-material"
import { Checkbox, ListItem } from "@mui/joy"
import { formatTime } from "@/app/lib/time"

export default function TimeTaskItem({ task } : { task: { title: string, totalTime: number, spentTime:number} }) {
    return (
        <div>
            <ListItem variant='soft' className='w-full h-12 !rounded-xl flex justify-between items-center'>
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
        </div>
    )
}