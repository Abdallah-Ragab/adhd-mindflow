import react from 'react'
import Task from '../components/Tasks'
import { ModeSwitcher } from '../components/theme'
import { Box, Button, Checkbox, Drawer, List, ListItem, Input, IconButton, Typography } from '@mui/joy';
import { HeaderTimer } from '../components/timer';
import bg from '@/public/bg.jpg'
import { Checklist, Numbers, SearchRounded, Timer10Rounded, TimerRounded } from '@mui/icons-material'
import { Search } from '../components/search';
import FormDrawer from '../components/FormDrawer';
import { TaskTimer } from '../components/Tasks/Timer';

const index = () => {
    const tasks = [
        {
            criteria: 'time',
            title: 'Work on the portfolio project for 5 hours',
            description: 'Work on the portfolio project for 5 hours and make sure to finish the landing page',
            totalTime: 18000,
            spentTime: 5431,
            done: false
        },
        {
            criteria: 'time',
            title: 'Listen to podcast for 1 hour',
            description: 'Listen to the podcast about the new technologies and how they are changing the world',
            totalTime: 3600,
            spentTime: 3600,
            done: true
        },
        {
            criteria: 'count',
            title: 'Read Five pages',
            description: 'Listen to the podcast about the new technologies and how they are changing the world',
            totalCount: 5,
            doneCount: 2,
            unit: 'pages',
            done: false
        },
        {
            criteria: 'checklist',
            title: 'Buy the groceries',
            description: 'Go to the market and buy the groceries for the week',
            subTasks: [
                { title: 'Buy the vegetables', done: false },
                { title: 'Buy the fruits', done: false },
                { title: 'Buy the meat', done: false },
                { title: 'Buy the snacks', done: false },
            ],
            done: false
        }
    ];

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
                <Box variant='oulined' className={`w-full rounded-xl h-60 pt-10 pl-6 bg-cover space-y-2`} sx={{
                    backgroundImage: `url(${bg.src})`,
                }}>
                    <span className='text-2xl text-neutral-600 font-bold'>Winners Never Quit, Quitters Never Win!</span>
                    <p className='text-4xl text-neutral-800 font-bold'>{new Date().toDateString()}</p>

                </Box>
                <Task.List tasks={tasks} />

            </div>
            <div>
                <Task.Calender />
            </div>
        </Box>
    )
}

export default index


