
import React from 'react';
import Typography from '@mui/joy/Typography';
import { Button, Checkbox, FormControl, FormHelperText, FormLabel, Input, Textarea, ToggleButtonGroup } from '@mui/joy';
import TimerIcon from '@mui/icons-material/Timer';
import NumbersIcon from '@mui/icons-material/Numbers';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { RadioGroupSelection, RangeRatingSlider, ToggleButtonGroupSelection, ValidatedInput, ValidatedTextarea } from '../form';
import dayjs from 'dayjs';
import {  DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function TaskForm () {
    const ratings = {
        novelty: {
            title: 'Novelty',
            marks: [
                {
                    value: 1,
                    label: 'Routine',
                },
                {
                    value: 5,
                    label: 'Innovative',
                }
            ],
            state: React.useState(3)
        },
        urgency: {
            title: 'Urgency',
            marks: [
                {
                    value: 1,
                    label: 'Relaxed',
                },
                {
                    value: 5,
                    label: 'Immediate',
                }
            ],
            state: React.useState(3)
        },
        interest: {
            title: 'Interest',
            marks: [
                {
                    value: 1,
                    label: 'Boring',
                },
                {
                    value: 5,
                    label: 'Exciting',
                }
            ],
            state: React.useState(3)
        },
        challenge: {
            title: 'Challenge',
            marks: [
                {
                    value: 1,
                    label: 'Simple',
                },
                {
                    value: 5,
                    label: 'Tough',
                }
            ],
            state: React.useState(3)
        }
    }

    const [criteria, setCriteria] = React.useState('todo')
    const [description, setDescription] = React.useState("")
    const [title, setTitle] = React.useState('')
    const [date, setDate] = React.useState(dayjs())
    const [scheduledDays, setScheduledDays] = React.useState({
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false
    })
    const [errors, setErrors] = React.useState({ description: [], title: [], date: [] })

    return (
        <div className='w-full space-y-12 p-7' sx={(theme) => { backgroundColor: "text.primary.800" }}>

            <div>
                <Typography className="text-lg font-bold">New Task</Typography>
                <Typography className="text-md" color='neutral'>
                    create a new task with different ways to track completion and rate it based on different criteria so we can get a better understanding of your task and help you prioritize your daily tasks
                </Typography>
            </div>

            <div className='space-y-3'>

                <ValidatedInput
                    name='title'
                    placeholder='Title'
                    state={[title, setTitle]}
                    formErrorsState={[errors, setErrors]}
                    validationRules={[
                        { rule: (value: string) => value.length > 0, message: 'This field is required' },
                    ]}
                />
                <ValidatedTextarea
                    name='description'
                    placeholder='Description'
                    state={[description, setDescription]}
                    formErrorsState={[errors, setErrors]}
                    validationRules={[
                        // { rule: (value: string) => value.length > 0, message: 'This field is required' },
                        { rule: (value: string) => value.length > 10, message: 'Description should be at least 10 characters long' },
                    ]}
                />

            </div>

            <ToggleButtonGroupSelection
                label='How would you track the task completion ?'
                selections={[
                    { name: "Time", value: "time", description: "by Time spent", icon: TimerIcon },
                    { name: "Check", value: "todo", description: "Mark as done", icon: CheckBoxIcon },
                    { name: "Count", value: "count", description: "Number of times", icon: NumbersIcon }
                ]}
                fullWidth={true}
                state={[criteria, setCriteria]}

            />

            <RadioGroupSelection
                label='How would you track the task completion ?'
                selections={[
                    { name: "Time", value: "time", description: "by Time spent", icon: TimerIcon },
                    { name: "Check", value: "todo", description: "Mark as done", icon: CheckBoxIcon },
                    { name: "Count", value: "count", description: "Number of times", icon: NumbersIcon }
                ]}
                fullWidth={true}
                state={[criteria, setCriteria]}

            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Deadline" value={date} onChange={(newValue) => { setDate(newValue) }}
                    className='w-full'
                    disablePast
                    format='DD/MM/YYYY'
                />
            </LocalizationProvider>
            <div className='flex flex-row space-x-2 items-center'>
                <span className='whitespace-nowrap'>I will</span> <Input placeholder='run' className='w-28' /> <Input placeholder='5 miles' className='w-' /> <Input placeholder='everyday' className='w-28' />
            </div>
            <FormControl>
                <Checkbox label="Timed Task" defaultChecked />
                <FormHelperText>Do you spend time working on this task, or is it more like a reminder? Timing tasks can help you monitor progress and stay focused on completing your goals.</FormHelperText>
            </FormControl>
            <div className="flex flex-row m-0 space-x-2 justify-center">
                {Object.keys(scheduledDays).map((day, idx) => {
                    return (
                        <Button key={idx} className='w-12 h-12 rounded-md min-w-0 text-sm'
                            color={scheduledDays[day] ? 'primary' : 'neutral'}
                            variant={scheduledDays[day] ? 'solid' : 'soft'}
                            onClick={() => { setScheduledDays({ ...scheduledDays, [day]: !scheduledDays[day] }) }} size='sm'>{day}
                        </Button>
                    )
                })}
                {/* <Button className='w-10 h-10 rounded-xl min-w-0 text-xs' color='primary' variant='soft' onClick={ } size='sm'>Sat</Button>
                <Button className='w-10 h-10 rounded-xl min-w-0 text-xs' color='primary' variant='soft' onClick={ } size='sm'>Sun</Button>
                <Button className='w-10 h-10 rounded-xl min-w-0 text-xs' color='primary' variant='soft' onClick={ } size='sm'>Mon</Button>
                <Button className='w-10 h-10 rounded-xl min-w-0 text-xs' color='primary' variant='soft' onClick={ } size='sm'>Tue</Button>
                <Button className='w-10 h-10 rounded-xl min-w-0 text-xs' color='primary' variant='soft' onClick={ } size='sm'>Wed</Button>
                <Button className='w-10 h-10 rounded-xl min-w-0 text-xs' color='primary' variant='soft' onClick={ } size='sm'>Thu</Button>
                <Button className='w-10 h-10 rounded-xl min-w-0 text-xs' color='primary' variant='soft' onClick={ } size='sm'>Fri</Button> */}
            </div>
            <RangeRatingSlider
                label={`How would you rate this task's ${ratings.interest.title}?`}
                marks={ratings.interest.marks}
                state={ratings.interest.state}
            />
            <RangeRatingSlider
                label={`How would you rate this task's ${ratings.urgency.title}?`}
                marks={ratings.urgency.marks}
                state={ratings.urgency.state}
            />
            <RangeRatingSlider
                label={`How would you rate this task's ${ratings.novelty.title}?`}
                marks={ratings.novelty.marks}
                state={ratings.novelty.state}
            />
            <RangeRatingSlider
                label={`How would you rate this task's ${ratings.challenge.title}?`}
                marks={ratings.challenge.marks}
                state={ratings.challenge.state}
            />
        </div >
    )
}