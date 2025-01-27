'use client';
import Task from '../components/tasks';
import { Box, Button, Drawer, Typography } from '@mui/joy';
import bg from '@/public/bg.jpg';
import { Search } from '../components/search';
// import FormDrawer from '../components/FormDrawer';
import React from 'react';
import { GpsFixed, AddTask } from '@mui/icons-material';
// import { Label } from '@/components/ui/label';

const index = () => {
    const initialTasks = [
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
    const [tasks, setTasks] = React.useState(initialTasks);
    const [formOpen, setFormOpen] = React.useState(false);
    return (
        <>
            <div className='space-y-3'>
                {/* <FormDrawer state={[formOpen, setFormOpen]} /> */}
                <Box sx={{ display: 'flex' }}>
                    <Drawer open={formOpen} anchor="right" onClose={() => setFormOpen(false)} size='md'>
                        <Task.Form />
                    </Drawer>
                </Box>
                <Box className='flex space-x-2 w-full'>
                    <Box className='grow'>
                    <Search />
                    </Box>
                    <Box className='flex space-x-2 grow-0'>
                        <Button className='space-x-2' variant="outlined" color="neutral" onClick={() => setFormOpen(true)}>
                            <AddTask />
                            <Typography sx={{color:'inherit', display: { xs: "none", sm:"block" } }}>Add Task</Typography>
                        </Button>
                        <Button className='space-x-2'>
                            <GpsFixed />
                            <Typography sx={{color:'inherit', display: { xs: "none", sm:"block" } }}>Start Focus Mode</Typography>
                        </Button>
                    </Box>
                </Box>
                <Box className={`w-full rounded-xl h-60 pt-10 pl-6 bg-cover space-y-2`} sx={{
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
        </>
    )
}

export default index


