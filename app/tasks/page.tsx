"use client"

import { format, formatDuration, intervalToDuration, isToday, isTomorrow, isYesterday, parseISO, sub } from 'date-fns';
import { BarChart2, Bell, Calendar as CalendarIcon, Check, CheckSquare, ChevronDown, ChevronUp, Clock, Edit, Focus, Hash, Home, LogOut, Menu, Moon, Pause, Play, Plus, Sun, Timer, Trash, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button, CompactButtonLabel } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardDescription, CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TaskType = "time" | "count" | "checklist" | "checkbox"
type Schedule = "daily" | "weekly" | "custom" | "once"
type LogEvent = "taskCreated" | "taskUpdated" | "taskDeleted" | "taskDone" | "taskUndone" | "timerStart" | "timerStop" | "SubTaskDone" | "SubTaskUndone" | "countUp" | "countDown"

interface CustomSchedule {
    fri: boolean,
    sat: boolean,
    sun: boolean,
    mon: boolean,
    tue: boolean,
    wed: boolean,
    thu: boolean,
    [key: string]: boolean
}

interface TaskLog {
    timestamp: string
    event: LogEvent
    taskId: number
    subTaskId?: number | null
}

interface Task {
    id: number
    title: string
    type: TaskType
    progress: number
    goal: number
    dueDate?: string
    startDate?: string
    endDate?: string
    schedule: Schedule
    customSchedule?: CustomSchedule
    description: string
    subtasks?: { id: number; title: string; completed: boolean }[]
    isTimerRunning?: boolean
    isDone: boolean
    logs: TaskLog[]
    unit?: string
}

const initialTasks: Task[] = [
    {
        id: 1,
        title: "Work on project",
        type: "time",
        progress: 0,
        goal: 7200, // 2 hours in seconds
        startDate: "2023-06-25",
        endDate: "2023-06-30",
        schedule: "daily",
        description: "Spend time working on the main project tasks.",
        isTimerRunning: false,
        isDone: false,
        logs: []
    },
    {
        id: 2,
        title: "Do push-ups",
        type: "count",
        progress: 0,
        goal: 50,
        startDate: "2023-06-25",
        endDate: "2023-06-30",
        schedule: "weekly",
        description: "Complete push-ups as part of weekly exercise routine.",
        isDone: false,
        logs: [],
        unit: "reps"
    },
    {
        id: 3,
        title: "Grocery shopping",
        type: "checklist",
        progress: 0,
        goal: 3,
        dueDate: "2023-06-26",
        schedule: "once",
        description: "Buy essential groceries for the week.",
        subtasks: [
            { id: 1, title: "Buy fruits", completed: false },
            { id: 2, title: "Buy vegetables", completed: false },
            { id: 3, title: "Buy milk", completed: false },
        ],
        isDone: false,
        logs: []
    },
    {
        id: 4,
        title: "Read a book",
        type: "checkbox",
        progress: 0,
        goal: 1,
        startDate: "2023-06-25",
        endDate: "2023-06-30",
        schedule: "daily",
        description: "Read a chapter of your current book.",
        isDone: false,
        logs: []
    },
    {
        id: 5,
        title: "Go to friday and monday's meetings",
        type: "checkbox",
        progress: 0,
        goal: 1,
        startDate: "2024-01-27",
        endDate: "2025-01-27",
        schedule: "custom",
        customSchedule: {
            fri: true,
            sat: false,
            sun: false,
            mon: true,
            tue: false,
            wed: false,
            thu: false,
        },
        description: "Attend the weekly meetings.",
        isDone: false,
        logs: []
    }
]

const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const formatDate = (date: Date) => {
    if (isToday(date)) return "Today"
    if (isYesterday(date)) return "Yesterday"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "MMMM d, yyyy")
}
function formatTimeVerbal(seconds: number) {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    return formatDuration(duration);
}


function Sidebar(props: { isNavOpen: boolean, setIsNavOpen: (open: boolean) => void }) {
    return (<aside className={`${props.isNavOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-secondary-background p-6  transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-4">MindFlow</h2>
            <Button className="lg:hidden" variant="ghost" onClick={() => props.setIsNavOpen(false)}>
                <X className="h-4 w-4" />
            </Button>
        </div>
        <nav className="space-y-2">
            <Button variant="nav" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Home
            </Button>
            <Button variant="nav" className="w-full justify-start">
                <CheckSquare className="mr-2 h-4 w-4" />
                Tasks
            </Button>
            <Button variant="nav" className="w-full justify-start">
                <Timer className="mr-2 h-4 w-4" />
                Timers
            </Button>
            <Button variant="nav" className="w-full justify-start">
                <BarChart2 className="mr-2 h-4 w-4" />
                Reports
            </Button>
        </nav>
    </aside>);
}


export default function Page() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [isNavOpen, setIsNavOpen] = useState(false)
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isFocusSessionActive, setIsFocusSessionActive] = useState(false)
    // const [focusSessionLogs, setFocusSessionLogs] = useState<string[]>([])
    const [currentFocusTask, setCurrentFocusTask] = useState<Task | null>(null)
    // const [isPlayingMusic, setIsPlayingMusic] = useState(false)
    const [focusSessionTime, setFocusSessionTime] = useState(0)
    const [isFocusSessionTimerOn, setIsFocusSessionTimerOn] = useState(false)
    // const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const interval = setInterval(() => {
            setTasks(prevTasks =>
                prevTasks.map(task => {
                    if (task.type === "time" && task.isTimerRunning) {
                        const newProgress = task.progress + 1
                        return {
                            ...task,
                            progress: newProgress,
                            isDone: newProgress >= task.goal,
                            // logs: [...task.logs, { timestamp: new Date().toISOString(), event: `Timer update: ${formatTime(newProgress)}`, taskId: task.id }]
                        }
                    }
                    return task
                })
            )
            if (isFocusSessionActive && isFocusSessionTimerOn) {
                setFocusSessionTime(prevTime => prevTime + 1)
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [isFocusSessionActive])

    useEffect(() => {
        document.body.classList.toggle("dark", isDarkMode)
    }, [isDarkMode])

    const updateTaskProgress = (taskId: number, newProgress: number) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? {
                ...task,
                progress: newProgress,
                isDone: newProgress >= task.goal,
                // logs: [...task.logs, { timestamp: new Date().toISOString(), event: `Progress updated: ${newProgress}`, taskId }]
            } : task
        ))
    }

    const toggleTimer = (taskId: number) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? {
                ...task,
                isTimerRunning: !task.isTimerRunning,
                logs: [...task.logs, { timestamp: new Date().toISOString(), event: task.isTimerRunning ? 'timerStop' : 'timerStart', taskId }]
            } : task
        ))
    }

    const updateSubtask = (taskId: number, subtaskId: number, completed: boolean) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? {
                ...task,
                subtasks: task.subtasks?.map(subtask =>
                    subtask.id === subtaskId ? { ...subtask, completed } : subtask
                ),
                progress: task.subtasks?.filter(subtask => subtask.completed).length || 0,
                isDone: task.subtasks?.every(subtask => subtask.completed) || false,
                logs: [...task.logs, { timestamp: new Date().toISOString(), event: completed ? 'SubTaskDone' : 'SubTaskUndone', taskId, subtaskId }]
            } : task
        ))
    }

    const addOrUpdateTask = (task: Omit<Task, 'id' | 'isDone' | 'logs'>) => {
        if (editingTask) {
            setTasks(tasks.map(t => t.id === editingTask.id ? { ...editingTask, ...task, logs: [...editingTask.logs, { timestamp: new Date().toISOString(), event: 'taskUpdated', taskId: editingTask.id }] } : t))
        } else {
            const newTask = { ...task, id: tasks.length + 1, isDone: false, logs: [] }
            setTasks([...tasks, newTask])
        }
        setIsAddTaskOpen(false)
        setEditingTask(null)
    }

    const deleteTask = (taskId: number) => {
        setTasks(tasks.filter(task => task.id !== taskId))
    }

    const toggleTaskCompletion = (taskId: number) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? {
                ...task,
                isDone: !task.isDone,
                logs: [...task.logs, { timestamp: new Date().toISOString(), event: task.isDone ? 'taskUndone' : 'taskDone', taskId }]
            } : task
        ))
        if (isFocusSessionActive) {
            const task = tasks.find(t => t.id === taskId)
            if (task) {
                // logFocusSessionEvent(`Task ${taskId} marked as ${task.isDone ? 'incomplete' : 'complete'}`)
                moveToNextFocusTask()
            }
        }
    }

    const startFocusSession = () => {
        setIsFocusSessionActive(true)
        // logFocusSessionEvent("Focus session started")
        const incompleteTasks = tasks.filter(task => !task.isDone)
        if (incompleteTasks.length > 0) {
            setCurrentFocusTask(incompleteTasks[0])
        }
    }

    const endFocusSession = () => {
        setIsFocusSessionActive(false)
        setCurrentFocusTask(null)
        // logFocusSessionEvent("Focus session ended")
        // setIsPlayingMusic(false)
        // if (audioRef.current) {
        //     audioRef.current.pause()
        //     audioRef.current.currentTime = 0
        // }
    }

    // const logFocusSessionEvent = (event: string) => {
    //     setFocusSessionLogs(prev => [...prev, `${new Date().toISOString()} - ${event}`])
    // }

    const moveToNextFocusTask = () => {
        const incompleteTasks = tasks.filter(task => !task.isDone)
        const currentIndex = incompleteTasks.findIndex(task => task.id === currentFocusTask?.id)
        if (currentIndex < incompleteTasks.length - 1) {
            setCurrentFocusTask(incompleteTasks[currentIndex + 1])
            // logFocusSessionEvent(`Moved to next task: ${incompleteTasks[currentIndex + 1].title}`)
        } else {
            endFocusSession()
        }
    }

    // const toggleMusic = () => {
    //     setIsPlayingMusic(!isPlayingMusic)
    //     if (audioRef.current) {
    //         if (isPlayingMusic) {
    //             audioRef.current.pause()
    //         } else {
    //             audioRef.current.play()
    //         }
    //     }
    // }

    return (
        <div className={cn("flex h-screen bg-secondary-background text-foreground", isDarkMode ? "dark" : "")}>
            {/* Sidebar */}
            <Sidebar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen}></Sidebar>
            <div className="flex-1 flex flex-col overflow-hidden m-3 bg-background rounded shadow-md">
                {/* Top Navbar */}
                <header className="bg-background shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={() => setIsNavOpen(!isNavOpen)}>
                                <Menu className="h-5 w-5" />
                            </Button>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-semibold">Today's Tasks</h1>
                                <p className="text-sm text-muted-foreground">Stay organized and productive</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Bell className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className='opacity-75'>Nothing to see here.</DropdownMenuItem>
                                    {/* <DropdownMenuItem>You have 3 new tasks</DropdownMenuItem>
                                    <DropdownMenuItem>Task "Work on project" is due today</DropdownMenuItem>
                                    <DropdownMenuItem>You completed 5 tasks this week</DropdownMenuItem> */}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {/* <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Settings</DropdownMenuItem> */}
                                    <DropdownMenuItem>Log out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
                                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                    <ScrollArea className="flex-1 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="bg-secondary-background">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formatDate(selectedDate)}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        // @ts-ignore
                                        onSelect={setSelectedDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Task
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
                                        <DialogDescription>
                                            {editingTask ? 'Edit the details of your task here.' : 'Add the details of your new task here.'}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <TaskForm onSubmit={addOrUpdateTask} initialData={editingTask} />
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Focus Session Card */}
                        {isFocusSessionActive && (
                            <Card className="mb-6 overflow-hidden relative min-h-96 bg-[url(https://wallpapercave.com/wp/wp9339939.png)] bg-cover bg-center p-6 flex flex-col justify-between">
                                <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent -z-0 opacity-60 from-20%"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black from-10% via-transparent z-0"></div>
                                <div className="relative z-10 flex justify-between items-start">
                                    {/* <Button variant="secondary" onClick={toggleMusic}>
                                            // <Music className={cn("h-4 w-4 mr-2", isPlayingMusic && "text-green-500")} />
                                            // {isPlayingMusic ? 'Pause Music' : 'Play Music'}
                                        </Button> */}
                                    <div className="relative z-10">
                                        <h2 className="text-3xl font-bold mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,1)]">Good Productive Day!</h2>
                                        <p className="text-lg mb-4 -mt-2">{format(new Date(), "MMMM d, yyyy")}</p>
                                        {/* <p className="text-lg mb-4 -mt-2">Stay focused and complete your tasks one by one.</p> */}
                                    </div>
                                    <Button compact variant='navy' onClick={endFocusSession} >
                                        <CompactButtonLabel>End Session</CompactButtonLabel>
                                        <LogOut className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="z-10 text-neutral-50 w-full flex justify-between items-end">
                                    {/* Session Task Details    */}
                                    <div>
                                        {
                                            currentFocusTask?.type === "time" && (
                                                <div>
                                                    <p className="flex space-x-1 text-lg font-semibold overflow-ellipsis w-max"> <Clock className="inline" />{currentFocusTask?.title}</p>
                                                    <p className="text-sm">
                                                        {formatTimeVerbal(currentFocusTask?.goal - currentFocusTask?.progress) + " remaining"}
                                                    </p>
                                                </div>
                                            )

                                        }
                                        {
                                            currentFocusTask?.type === "count" && (
                                                <p className="text-lg font-semibold max-w-max overflow-ellipsis w-max">{currentFocusTask?.progress} {currentFocusTask?.unit}</p>
                                            )
                                        }
                                        {
                                            currentFocusTask?.type === "checklist" && (
                                                <p className="text-lg font-semibold max-w-max overflow-ellipsis w-max">{currentFocusTask?.progress} / {currentFocusTask?.goal} tasks</p>
                                            )
                                        }
                                        <div className="flex items-end">
                                            <Button variant='dark' compact={true}>
                                                <CompactButtonLabel>Complete Task</CompactButtonLabel>
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-end">
                                        <Button compact={true} className="p-3 mb-2" onClick={() => setIsFocusSessionTimerOn(on => !on)}>
                                            {isFocusSessionTimerOn ?
                                                <>
                                                    {/* <span className="w-0 collapse group-hover:w-10 group-hover:visible transition-all ease-in-out duration-500">Take a break</span> */}
                                                    <CompactButtonLabel>Take a break</CompactButtonLabel>
                                                    <Pause className="w-4" />
                                                </> : <>
                                                    <CompactButtonLabel>Resume Session</CompactButtonLabel>
                                                    <Play className="w-4" />
                                                </>}
                                        </Button>
                                        <div className="flex flex-col w-72 text-right">
                                            <p className="">You have been productive for</p>
                                            <p className="text-6xl font-bold">
                                                {formatTime(focusSessionTime)}
                                            </p>
                                        </div>
                                        {/* <div className="flex items-center mb-3 "> */}
                                        {/* <Button compact={true} variant='light' className="rounded py-1 mb-2 group hover:w-auto transition-width delay-500 ease-in-out" onClick={() => setIsFocusSessionTimerOn(on => !on)}> */}
                                        {/* </div> */}
                                    </div>
                                </div>
                            </Card>
                        )}
                        <div className="space-y-4">

                            {tasks.map(task => (
                                <Card key={task.id} className="cursor-pointer px-8 py-3 space-y-2" onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}>
                                    <CardHeader className="!p-0 flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                className="rounded-md border-primary/60"
                                                checked={task.isDone}
                                                onCheckedChange={() => toggleTaskCompletion(task.id)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <CardTitle className={cn("text-sm font-medium", task.isDone && "line-through text-muted-foreground")}>
                                                {task.title}
                                            </CardTitle>
                                        </div>
                                        <CardDescription className="flex items-center">
                                            {task.type === "time" && <Clock className="inline-block mr-2 h-4 w-4" />}
                                            {task.type === "count" && <Hash className="inline-block mr-2 h-4 w-4" />}
                                            {task.type === "checklist" && <CheckSquare className="inline-block mr-2 h-4 w-4" />}
                                            {/* {task.type === "checkbox" && <Check className="inline-block mr-2 h-4 w-4" />} */}
                                            {task.type === "time"
                                                ? formatTime(task.progress)
                                                // : task.type === "checkbox"
                                                //   ? (task.isDone ? "Done" : "Pending")
                                                : task.type === "checklist" || task.type === "count"
                                                    ? `${task.progress} / ${task.goal} ${task.unit || 'tasks'}` : ''
                                            }
                                            <Button variant="ghost" size="sm" className="ml-2 pr-0" onClick={(e) => {
                                                e.stopPropagation()
                                                setExpandedTaskId(expandedTaskId === task.id ? null : task.id)
                                            }}>
                                                {expandedTaskId === task.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </Button>
                                        </CardDescription>
                                    </CardHeader>
                                    {task.type !== "checkbox" && (
                                        <CardContent className="p-0 flex space-x-1 items-center">
                                            <Progress value={(task.progress / task.goal) * 100} className="w-full bg-primary/10" />
                                            <span className="text-xs text-muted-foreground text-nowrap">{Math.floor((task.progress / task.goal) * 100)}% Complete</span>
                                        </CardContent>
                                    )}
                                    {expandedTaskId === task.id && (
                                        <CardContent className="pt-4 flex flex-col space-y-6">
                                            <div className="task-control flex justify-between items-start">
                                                {task.type === "checklist" && task.subtasks && (
                                                    <div className="mb-4">
                                                        <p className="text-sm text-muted-foreground mb-2 font-medium">Subtasks:</p>
                                                        <ul className="space-y-2">
                                                            {task.subtasks.map(subtask => (
                                                                <li key={subtask.id} className="flex items-center">
                                                                    <Checkbox
                                                                        id={`subtask-${subtask.id}`}
                                                                        checked={subtask.completed}
                                                                        onCheckedChange={(checked) => updateSubtask(task.id, subtask.id, checked as boolean)}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                    <label htmlFor={`subtask-${subtask.id}`} className="ml-2 text-sm">{subtask.title}</label>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {task.type === "time" && (
                                                    <div className="flex space-x-2 mt-4">
                                                        <Button onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleTimer(task.id)
                                                        }}>
                                                            {task.isTimerRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                                                            {task.isTimerRunning ? 'Pause' : 'Start'}
                                                        </Button>
                                                        <div className="flex items-center space-x-2">
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                value={Math.floor(task.progress / 3600)}
                                                                onChange={(e) => {
                                                                    const hours = parseInt(e.target.value)
                                                                    const minutes = Math.floor((task.progress % 3600) / 60)
                                                                    const seconds = task.progress % 60
                                                                    updateTaskProgress(task.id, hours * 3600 + minutes * 60 + seconds)
                                                                }}
                                                                className="w-16"
                                                                onClick={(e) => e.stopPropagation()}
                                                                placeholder="HH"
                                                            />
                                                            <span>:</span>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                max="59"
                                                                value={Math.floor((task.progress % 3600) / 60)}
                                                                onChange={(e) => {
                                                                    const hours = Math.floor(task.progress / 3600)
                                                                    const minutes = parseInt(e.target.value)
                                                                    const seconds = task.progress % 60
                                                                    updateTaskProgress(task.id, hours * 3600 + minutes * 60 + seconds)
                                                                }}
                                                                className="w-16"
                                                                onClick={(e) => e.stopPropagation()}
                                                                placeholder="MM"
                                                            />
                                                            <span>:</span>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                max="59"
                                                                value={task.progress % 60}
                                                                onChange={(e) => {
                                                                    const hours = Math.floor(task.progress / 3600)
                                                                    const minutes = Math.floor((task.progress % 3600) / 60)
                                                                    const seconds = parseInt(e.target.value)
                                                                    updateTaskProgress(task.id, hours * 3600 + minutes * 60 + seconds)
                                                                }}
                                                                className="w-16"
                                                                onClick={(e) => e.stopPropagation()}
                                                                placeholder="SS"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {task.type === "count" && (
                                                    <div className="flex items-center space-x-2 mt-4">
                                                        <Button onClick={(e) => {
                                                            e.stopPropagation()
                                                            updateTaskProgress(task.id, task.progress + 1)
                                                        }}>
                                                            Increment
                                                        </Button>
                                                        <Input
                                                            type="number"
                                                            value={Math.floor(task.progress)}
                                                            onChange={(e) => updateTaskProgress(task.id, parseInt(e.target.value))}
                                                            className="w-16"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <span>{task.unit || 'times'}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-end items-center mt-4 space-x-2">
                                                    <Button variant="ghost" size="icon" onClick={(e) => {
                                                        e.stopPropagation()
                                                        setEditingTask(task)
                                                        setIsAddTaskOpen(true)
                                                    }}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={(e) => {
                                                        e.stopPropagation()
                                                        deleteTask(task.id)
                                                    }}>
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="task-details grid grid-cols-2 gap-x-3">
                                                <div className="col-span-2">
                                                    <p className="text-sm text-muted-foreground mb-2 font-medium">Description:</p>
                                                    <p className="text-sm mb-4">{task.description}</p>
                                                </div>
                                                {task.schedule === "once" ? (
                                                    <>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground mb-2 font-medium">Due Date:</p>
                                                            <p className="text-sm mb-4">{format(parseISO(task.dueDate!), "MMMM d, yyyy")}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground mb-2 font-medium">Start Date:</p>
                                                            <p className="text-sm mb-4">{format(parseISO(task.startDate!), "MMMM d, yyyy")}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground mb-2 font-medium">End Date:</p>
                                                            <p className="text-sm mb-4">{format(parseISO(task.endDate!), "MMMM d, yyyy")}</p>
                                                        </div>
                                                    </>
                                                )}
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-2 font-medium">Schedule:</p>
                                                    <p className="text-sm mb-4">{task.schedule != "custom" ? task.schedule : Object.entries(task.customSchedule || {}).filter(([k, v]) => v).map(([key]) => key).join(", ")}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                    {/* Right Sidebar Calendar */}
                    <aside className="hidden xl:block w-80 p-6 border-l">
                        <h3 className="text-lg font-semibold mb-4">Calendar</h3>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            // @ts-ignore
                            onSelect={setSelectedDate}
                            className="rounded-md border"
                        />
                    </aside>
                </div>
            </div>

            {/* Focus Session Trigger */}
            {!isFocusSessionActive && (
                <Button
                    className="fixed bottom-4 right-4"
                    onClick={startFocusSession}
                >
                    <Focus className="mr-2 h-4 w-4" />
                    Start Focus Session
                </Button>
            )}

            {/* Background Music */}
            {/* <audio ref={audioRef} loop>
                <source src="/path-to-your-relaxing-music.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio> */}
        </div>
    )
}

function TaskForm({ onSubmit, initialData }: { onSubmit: (task: Omit<Task, 'id' | 'isDone' | 'logs'>) => void, initialData: Task | null }) {
    const [title, setTitle] = useState(initialData?.title || '')
    const [type, setType] = useState<TaskType>(initialData?.type || 'checkbox')
    const [goal, setGoal] = useState(initialData?.goal || 0)
    const [dueDate, setDueDate] = useState(initialData?.dueDate || '')
    const [startDate, setStartDate] = useState(initialData?.startDate || '')
    const [endDate, setEndDate] = useState(initialData?.endDate || '')
    const [schedule, setSchedule] = useState<Schedule>(initialData?.schedule || 'daily')
    const [customSchedule, setCustomSchedule] = useState<CustomSchedule>(initialData?.customSchedule || { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false })
    const [description, setDescription] = useState(initialData?.description || '')
    const [subtasks, setSubtasks] = useState<string[]>(initialData?.subtasks?.map(st => st.title) || [''])
    const [unit, setUnit] = useState(initialData?.unit || '')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            title,
            type,
            progress: initialData?.progress || 0,
            goal: type === 'checkbox' ? 1 : goal,
            dueDate: schedule === 'once' ? dueDate : undefined,
            startDate: schedule !== 'once' ? startDate : undefined,
            endDate: schedule !== 'once' ? endDate : undefined,
            schedule,
            customSchedule: schedule === 'custom' ? customSchedule : undefined,
            description,
            subtasks: type === 'checklist' ? subtasks.map((title, id) => ({ id, title, completed: false })) : undefined,
            unit: type === 'count' ? unit : undefined,
        })
    }

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <p className="text-sm text-muted-foreground mt-1">Enter a clear and concise title for your task.</p>
            </div>
            <Tabs value={type} onValueChange={(value: string) => setType(value as TaskType)} className="w-full">
                <Label htmlFor="criteria">Completion Criteria</Label>
                <TabsList id='criteria' className="grid w-full grid-cols-4">
                    <TabsTrigger value="checkbox" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Checkbox</TabsTrigger>
                    <TabsTrigger value="time" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Time</TabsTrigger>
                    <TabsTrigger value="count" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Count</TabsTrigger>
                    <TabsTrigger value="checklist" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Checklist</TabsTrigger>
                </TabsList>
                <TabsContent value="time">
                    <div className="space-y-2">
                        <Label htmlFor="timeGoal">Goal Duration</Label>
                        <div className="flex space-x-2">
                            <Input
                                id="timeGoalHours"
                                type="number"
                                min="0"
                                max="23"
                                value={Math.floor(goal / 3600)}
                                onChange={(e) => {
                                    const hours = parseInt(e.target.value)
                                    const minutes = Math.floor((goal % 3600) / 60)
                                    const seconds = goal % 60
                                    setGoal(hours * 3600 + minutes * 60 + seconds)
                                }}
                                className="w-20"
                                placeholder="HH"
                                required
                            />
                            <span className="flex items-center">:</span>
                            <Input
                                id="timeGoalMinutes"
                                type="number"
                                min="0"
                                max="59"
                                value={Math.floor((goal % 3600) / 60)}
                                onChange={(e) => {
                                    const hours = Math.floor(goal / 3600)
                                    const minutes = parseInt(e.target.value)
                                    const seconds = goal % 60
                                    setGoal(hours * 3600 + minutes * 60 + seconds)
                                }}
                                className="w-20"
                                placeholder="MM"
                                required
                            />
                            <span className="flex items-center">:</span>
                            <Input
                                id="timeGoalSeconds"
                                type="number"
                                min="0"
                                max="59"
                                value={goal % 60}
                                onChange={(e) => {
                                    const hours = Math.floor(goal / 3600)
                                    const minutes = Math.floor((goal % 3600) / 60)
                                    const seconds = parseInt(e.target.value)
                                    setGoal(hours * 3600 + minutes * 60 + seconds)
                                }}
                                className="w-20"
                                placeholder="SS"
                                required
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">Set the total time you want to spend on this task.</p>
                    </div>
                </TabsContent>
                <TabsContent value="count">
                    <div className="space-y-2">
                        <Label htmlFor="countGoal">Goal</Label>
                        <div className="flex space-x-2">
                            <Input
                                id="countGoal"
                                type="number"
                                value={goal}
                                onChange={(e) => setGoal(parseInt(e.target.value))}
                                className="w-20"
                                required
                            />
                            <Input
                                id="countUnit"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="flex-1"
                                placeholder="Unit (e.g., times, reps)"
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">Set the number of times you want to complete this task and specify the unit.</p>
                    </div>
                </TabsContent>
                <TabsContent value="checklist">
                    <div>
                        <Label>Subtasks</Label>
                        {subtasks.map((subtask, index) => (
                            <div key={index} className="flex items-center space-x-2 mt-2">
                                <Input
                                    value={subtask}
                                    onChange={(e) => {
                                        const newSubtasks = [...subtasks]
                                        newSubtasks[index] = e.target.value
                                        setSubtasks(newSubtasks)
                                    }}
                                    placeholder={`Subtask ${index + 1}`}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setSubtasks([...subtasks, ''])}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                                {subtasks.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setSubtasks(subtasks.filter((_, i) => i !== index))}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <p className="text-sm text-muted-foreground mt-2">Add subtasks to break down your main task into smaller, manageable steps.</p>
                    </div>
                </TabsContent>
            </Tabs>
            <div>
                <Label htmlFor="schedule">Schedule</Label>
                <Select value={schedule} onValueChange={(value: Schedule) => setSchedule(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="once">One-Time</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">Choose how often you want to repeat this task.</p>
            </div>
            {schedule === 'custom' && (
                <div>
                    <Label>Custom Schedule</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {weekDays.map((day) => (
                            <Badge
                                key={day}
                                variant={customSchedule[day.toLowerCase()] ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => {
                                    setCustomSchedule((prev) => ({ ...prev, [day.toLowerCase()]: !prev[day.toLowerCase()] }))
                                }}
                            >
                                {day}
                            </Badge>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Select the days of the week when you want this task to recur.</p>
                </div>
            )}
            {schedule === 'once' ? (
                <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                    <p className="text-sm text-muted-foreground mt-1">Set the date when this one-time task needs to be completed.</p>
                </div>
            ) : (
                <>
                    <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                        <p className="text-sm text-muted-foreground mt-1">Set the date when you want to start this recurring task.</p>
                    </div>
                    <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                        <p className="text-sm text-muted-foreground mt-1">Set the date when you want this recurring task to end.</p>
                    </div>
                </>
            )}

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <p className="text-sm text-muted-foreground mt-1">Provide additional details or context for your task.</p>
            </div>
            <DialogFooter>
                <Button type="submit">{initialData ? 'Update Task' : 'Add Task'}</Button>
            </DialogFooter>
        </form>
    )
}