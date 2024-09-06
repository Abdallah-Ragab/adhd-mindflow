import react from 'react'
import Task from '../components/Tasks'
import { ModeSwitcher } from '../components/theme'
import { Box, Button, Checkbox, Drawer, List, ListItem, Input, IconButton, Typography } from '@mui/joy';
import Timer from '../components/timer';
import bg from '@/public/bg.jpg'
import { Numbers, SearchRounded, Timer10Rounded, TimerRounded } from '@mui/icons-material'
import { Search } from '../components/search';
import FormDrawer from '../components/FormDrawer';


const index = () => {
    // const [tasks, setTasks] = react.useState([] as { id: number, name: string }[])

    // react.useEffect(() => {
    //     setTasks([{ id: 1, name: 'Task 1' }, { id: 2, name: 'Task 2' }])
    // }, [])

    return (

        <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr',
                md: '1fr',
                lg: 'minmax(300px, 1fr) fit-content(320px) ',
            },
        }}  >
            <div className='space-y-3'>
                <Search />
                <FormDrawer />
                <Box variant='oulined' className={`w-full rounded-xl h-60 pt-10 pl-6 bg-cover space-y-3`} sx={{
                    backgroundImage: `url(${bg.src})`,
                }}>
                    <span className='text-3xl text-neutral-700 font-bold'>Winners Never Quit, Quitters Never Win!</span>
                    <Timer id={'focus-session'} persistent={false} />
                </Box>
                <List className='space-y-2'>
                    <Task.Item task={{
                        title: 'Work on the portfolio project for 5 hours',
                        totalTime: 18000,
                        spentTime: 5431
                        }} />
                    <ListItem variant='soft' className='w-full h-12 !rounded-xl flex justify-between items-center'>
                        <div className='flex items-center'><Checkbox className='mr-2' />Listen to podcast for 1 hour</div>
                        <div className='flex space-x-1'>
                            <span className='opacity-80'>00:00:00</span>
                            <span>/</span>
                            <span>01:00:00</span>
                            <TimerRounded />
                        </div>
                    </ListItem>
                    <ListItem variant='soft' className='w-full h-12 !rounded-xl flex justify-between items-center'>
                        <div className='flex items-center'><Checkbox className='mr-2' />Read 3 pages of the science book</div>
                        <div className='flex space-x-1'>
                            <span className='opacity-80'>1</span>
                            <span>/</span>
                            <span>3 pages</span>
                            <Numbers />
                        </div>
                    </ListItem>
                    <ListItem variant='soft' className='w-full h-12 !rounded-xl flex justify-between items-center'>
                        <div className='flex items-center'><Checkbox className='mr-2' />Study today's german A1 lesson</div>
                        {/* <div className='flex space-x-1'>
                                    <span className='opacity-80'>1</span>
                                    <span>/</span>
                                    <span>3 pages</span>
                                    <Numbers />
                                </div> */}
                    </ListItem>
                </List>
            </div>
            <div>
                {/* <TaskForm />
                        {tasks.map((task, idx) => {
                            return (
                                <TaskItem task={task} key={idx} />
                            )
                        })} */}
                <Task.Calender />
            </div>
        </Box>
    )
}

export default index


