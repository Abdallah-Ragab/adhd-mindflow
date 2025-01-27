import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Home, CheckSquare, Clock, BarChart2, Settings } from 'lucide-react';

const TaskType = {
  TIME     : 'time',
  COUNT    : 'count',
  CHECKLIST: 'checklist',
  SINGLE   : 'single'
};

const ScheduleType = {
  DAILY : 'daily',
  WEEKLY: 'weekly',
  NONE  : 'none'
};

const initialTasks = [
  { 
    id         : 1,
    title      : 'Meditate',
    type       : TaskType.TIME,
    goal       : 15,
    schedule   : ScheduleType.DAILY,
    novelty    : 3,
    interest   : 4,
    urgency    : 3,
    challenge  : 2,
    description: 'Daily meditation practice',
    startDate  : new Date(),
    dueDate    : new Date(new Date().setDate(new Date().getDate() + 30)),
    progress   : 0
  },
  { 
    id         : 2,
    title      : 'Read pages',
    type       : TaskType.COUNT,
    goal       : 20,
    schedule   : ScheduleType.DAILY,
    novelty    : 4,
    interest   : 5,
    urgency    : 3,
    challenge  : 3,
    description: 'Read 20 pages of the current book',
    startDate  : new Date(),
    dueDate    : new Date(new Date().setDate(new Date().getDate() + 7)),
    progress   : 0
  },
  { 
    id   : 3,
    title: 'Clean room',
    type : TaskType.CHECKLIST,
    items: [
      { id: 1, text: 'Make bed', completed: false },
      { id: 2, text: 'Vacuum floor', completed: false },
      { id: 3, text: 'Organize desk', completed: false }
    ], 
    schedule   : ScheduleType.WEEKLY,
    novelty    : 2,
    interest   : 2,
    urgency    : 4,
    challenge  : 3,
    description: 'Weekly room cleaning routine',
    startDate  : new Date(),
    dueDate    : new Date(new Date().setDate(new Date().getDate() + 7)),
    progress   : 0
  },
  { 
    id         : 4,
    title      : 'Take medication',
    type       : TaskType.SINGLE,
    schedule   : ScheduleType.DAILY,
    novelty    : 1,
    interest   : 1,
    urgency    : 5,
    challenge  : 1,
    description: 'Take daily medication',
    startDate  : new Date(),
    dueDate    : null,
    completed  : false
  },
];

const ADHDTaskManager = () => {
  const [tasks, setTasks]                               = useState(initialTasks);
  const [activeTask, setActiveTask]                     = useState(null);
  const [focusTimer, setFocusTimer]                     = useState(0);
  const [isFocusSessionActive, setIsFocusSessionActive] = useState(false);
  const [newTask, setNewTask]                           = useState({
    title      : '',
    type       : '',
    description: '',
    startDate  : new Date(),
    dueDate    : null,
    schedule   : ScheduleType.NONE,
    novelty    : 3,
    interest   : 3,
    urgency    : 3,
    challenge  : 3,
    goal       : 0,
    items      : []
  });

  useEffect(() => {
    let interval;
    if (isFocusSessionActive) {
      interval = setInterval(() => {
        setFocusTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFocusSessionActive]);

  const calculateTaskScore = (task) => {
    return (task.novelty + task.interest + task.urgency + task.challenge) / 4;
  };

  const getRecommendedTask = () => {
    return tasks.reduce((prev, current) => 
      (calculateTaskScore(current) > calculateTaskScore(prev)) ? current: prev
    );
  };

  const startFocusSession = () => {
    setIsFocusSessionActive(true);
    setActiveTask(getRecommendedTask());
  };

  const endFocusSession = () => {
    setIsFocusSessionActive(false);
    setFocusTimer(0);
    setActiveTask(null);
  };

  const formatTime = (seconds) => {
    const minutes          = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleNewTaskChange = (field, value) => {
    setNewTask(prev => ({ ...prev, [field]: value }));
  };

  const addNewTask = () => {
    setTasks(prev => [...prev, { ...newTask, id: prev.length + 1 }]);
    setNewTask({
      title      : '',
      type       : '',
      description: '',
      startDate  : new Date(),
      dueDate    : null,
      schedule   : ScheduleType.NONE,
      novelty    : 3,
      interest   : 3,
      urgency    : 3,
      challenge  : 3,
      goal       : 0,
      items      : []
    });
  };

  const updateTaskProgress = (taskId, newProgress) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, progress: newProgress } : task
    ));
  };

  const toggleChecklistItem = (taskId, itemId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? {
        ...task,
        items: task.items.map(item => 
          item.id === itemId ? { ...item, completed: !item.completed } : item
        )
      } : task
    ));
  };

  const toggleSingleTask = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const generateReports = () => {
      // This is a placeholder for generating reports
      // In a real application, you'd process the tasks data to create meaningful reports
    return [
      { date: '2023-09-10', timeSpent: 120, tasksCompleted: 5 },
      { date: '2023-09-11', timeSpent: 90, tasksCompleted: 4 },
      { date: '2023-09-12', timeSpent: 150, tasksCompleted: 6 },
      { date: '2023-09-13', timeSpent: 80, tasksCompleted: 3 },
      { date: '2023-09-14', timeSpent: 100, tasksCompleted: 5 },
    ];
  };

  return (
    <div className = "flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div    className = "w-16 bg-indigo-600 text-white flex flex-col items-center py-4">
      <Button variant   = "ghost" className = "mb-4"><Home className        = "w-6 h-6" /></Button>
      <Button variant   = "ghost" className = "mb-4"><CheckSquare className = "w-6 h-6" /></Button>
      <Button variant   = "ghost" className = "mb-4"><Clock className       = "w-6 h-6" /></Button>
      <Button variant   = "ghost" className = "mb-4"><BarChart2 className   = "w-6 h-6" /></Button>
      <Button variant   = "ghost" className = "mt-auto"><Settings className = "w-6 h-6" /></Button>
      </div>

      {/* Main content */}
      <div className = "flex-1 overflow-y-auto">
      <div className = "p-8">
      <h1  className = "text-3xl font-bold mb-8">ADHD Task Manager</h1>
          
          <Tabs defaultValue = "tasks">
            <TabsList>
              <TabsTrigger value = "tasks">Tasks</TabsTrigger>
              <TabsTrigger value = "focus">Focus Session</TabsTrigger>
              <TabsTrigger value = "reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value     = "tasks">
            <div         className = "grid grid-cols-3 gap-6">
                {/* Task List */}
                <Card className = "col-span-2">
                  <CardHeader>
                    <CardTitle>Task List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tasks.map((task) => (
                      <div key = {task.id} className = "flex items-center justify-between mb-4 p-2 bg-white rounded shadow">
                        <div>
                          <h3 className = "font-semibold">{task.title}</h3>
                          <p  className = "text-sm text-gray-500">{task.description}</p>
                        </div>
                        {task.type === TaskType.TIME && (
                          <div    className = "flex items-center">
                          <Button onClick   = {() => updateTaskProgress(task.id, Math.max(0, task.progress - 1))}>-</Button>
                          <span   className = "mx-2">{task.progress} / {task.goal} min</span>
                          <Button onClick   = {() => updateTaskProgress(task.id, Math.min(task.goal, task.progress + 1))}>+</Button>
                          </div>
                        )}
                        {task.type === TaskType.COUNT && (
                          <div    className = "flex items-center">
                          <Button onClick   = {() => updateTaskProgress(task.id, Math.max(0, task.progress - 1))}>-</Button>
                          <span   className = "mx-2">{task.progress} / {task.goal}</span>
                          <Button onClick   = {() => updateTaskProgress(task.id, Math.min(task.goal, task.progress + 1))}>+</Button>
                          </div>
                        )}
                        {task.type === TaskType.CHECKLIST && (
                          <div>
                            {task.items.map(item => (
                              <div key = {item.id} className = "flex items-center">
                                <Checkbox
                                  checked         = {item.completed}
                                  onCheckedChange = {() => toggleChecklistItem(task.id, item.id)}
                                />
                                <span className = "ml-2">{item.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {task.type === TaskType.SINGLE && (
                          <Checkbox
                            checked         = {task.completed}
                            onCheckedChange = {() => toggleSingleTask(task.id)}
                          />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* New Task Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Task</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      className   = "mb-2"
                      placeholder = "Task Title"
                      value       = {newTask.title}
                      onChange    = {(e) => handleNewTaskChange('title', e.target.value)}
                    />
                    <Select
                      value         = {newTask.type}
                      onValueChange = {(value) => handleNewTaskChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder = "Task Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value = {TaskType.TIME}>Time Goal</SelectItem>
                        <SelectItem value = {TaskType.COUNT}>Count Goal</SelectItem>
                        <SelectItem value = {TaskType.CHECKLIST}>Checklist</SelectItem>
                        <SelectItem value = {TaskType.SINGLE}>Single Checkbox</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      className   = "my-2"
                      placeholder = "Description"
                      value       = {newTask.description}
                      onChange    = {(e) => handleNewTaskChange('description', e.target.value)}
                    />
                    <DatePicker
                      className       = "mb-2"
                      selected        = {newTask.startDate}
                      onChange        = {(date) => handleNewTaskChange('startDate', date)}
                      placeholderText = "Start Date"
                    />
                    <DatePicker
                      className       = "mb-2"
                      selected        = {newTask.dueDate}
                      onChange        = {(date) => handleNewTaskChange('dueDate', date)}
                      placeholderText = "Due Date"
                    />
                    <Select
                      value         = {newTask.schedule}
                      onValueChange = {(value) => handleNewTaskChange('schedule', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder = "Schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value = {ScheduleType.NONE}>None</SelectItem>
                        <SelectItem value = {ScheduleType.DAILY}>Daily</SelectItem>
                        <SelectItem value = {ScheduleType.WEEKLY}>Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    {newTask.type === TaskType.TIME && (
                      <Input
                        className   = "mt-2"
                        type        = "number"
                        placeholder = "Time Goal (minutes)"
                        value       = {newTask.goal}
                        onChange    = {(e) => handleNewTaskChange('goal', parseInt(e.target.value))}
                      />
                    )}
                    {newTask.type === TaskType.COUNT && (
                      <Input
                        className   = "mt-2"
                        type        = "number"
                        placeholder = "Count Goal"
                        value       = {newTask.goal}
                        onChange    = {(e) => handleNewTaskChange('goal', parseInt(e.target.value))}
                      />
                    )}
                    {newTask.type === TaskType.CHECKLIST && (
                      <div className = "mt-2">
                        {/* Add UI for managing checklist items */}
                      </div>
                    )}
                    <div className = "mt-4">
                    <p   className = "mb-1">Novelty: {newTask.novelty}</p>
                      <Slider
                        value         = {[newTask.novelty]}
                        onValueChange = {(value) => handleNewTaskChange('novelty', value[0])}
                        max           = {5}
                        step          = {1}
                      />
                      <p className = "mb-1 mt-2">Interest: {newTask.interest}</p>
                      <Slider
                        value         = {[newTask.interest]}
                        onValueChange = {(value) => handleNewTaskChange('interest', value[0])}
                        max           = {5}
                        step          = {1}
                      />
                      <p className = "mb-1 mt-2">Urgency: {newTask.urgency}</p>
                      <Slider
                        value         = {[newTask.urgency]}
                        onValueChange = {(value) => handleNewTaskChange('urgency', value[0])}
                        max           = {5}
                        step          = {1}
                      />
                      <p className = "mb-1 mt-2">Challenge: {newTask.challenge}</p>
                      <Slider
                        value         = {[newTask.challenge]}
                        onValueChange = {(value) => handleNewTaskChange('challenge', value[0])}
                        max           = {5}
                        step          = {1}
                      />
                    </div>
                    <Button className = "mt-4" onClick = {addNewTask}>Add Task</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value = "focus">
              <Card>
                <CardHeader>
                  <CardTitle>Focus Session</CardTitle>
                </CardHeader>
                <CardContent>
                  {isFocusSessionActive ? (
                    <div className = "text-center">
                    <p   className = "text-xl mb-2">Current Task: {activeTask?.title}</p>
                    <p   className = "text-4xl font-bold mb-4">{formatTime(focusTimer)}</p>
                    <div className = "mb-4">
                        {activeTask?.type === TaskType.TIME && (
                          <p>Time Goal: {activeTask.goal} minutes</p>
                        )}
                        {activeTask?.type === TaskType.COUNT && (
                          <div    className = "flex items-center justify-center">
                          <Button onClick   = {() => updateTaskProgress(activeTask.id, Math.max(0, activeTask.progress - 1))}>-</Button>
                          <span   className = "mx-2">{activeTask.progress} / {activeTask.goal}</span>
                          <Button onClick   = {() => updateTaskProgress(activeTask.id, Math.min(activeTask.goal, activeTask.progress + 1))}>+</Button>
                          </div>
                        )}
                        {activeTask?.type === TaskType.CHECKLIST && (
                          <div>
                            {activeTask.items.map(item => (
                              <div key = {item.id} className = "flex items-center justify-center mb-2">
                                <Checkbox
                                  checked         = {item.completed}
                                  onCheckedChange = {() => toggleChecklistItem(activeTask.id, item.id)}
                                />
                                <span className = "ml-2">{item.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {activeTask?.type === TaskType.SINGLE && (
                          <Checkbox
                            checked         = {activeTask.completed}
                            onCheckedChange = {() => toggleSingleTask(activeTask.id)}
                          />
                        )}
                      </div>
                      <Button onClick = {endFocusSession}>End Session</Button>
                    </div>
                  ) : (
                    <div    className = "text-center">
                    <p      className = "mb-4">Start a focus session to work on your tasks with fewer distractions.</p>
                    <Button onClick   = {startFocusSession}>Start Focus Session</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value = "reports">
              <Card>
                <CardHeader>
                  <CardTitle>Task Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width           = "100%" height       = {300}>
                  <BarChart            data            = {generateReports()}>
                  <CartesianGrid       strokeDasharray = "3 3" />
                  <XAxis               dataKey         = "date" />
                  <YAxis               yAxisId         = "left" orientation  = "left" stroke  = "#8884d8" />
                  <YAxis               yAxisId         = "right" orientation = "right" stroke = "#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId = "left" dataKey  = "timeSpent" fill      = "#8884d8" name = "Time Spent (minutes)" />
                      <Bar yAxisId = "right" dataKey = "tasksCompleted" fill = "#82ca9d" name = "Tasks Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Task Details Sidebar */}
      <div className = "w-1/4 bg-gray-200 p-4 overflow-y-auto">
      <h2  className = "text-xl font-bold mb-4">Task Details</h2>
        {activeTask ? (
          <div>
            <h3 className = "font-semibold mb-2">{activeTask.title}</h3>
            <p  className = "mb-2">{activeTask.description}</p>
            <p  className = "mb-1">Type: {activeTask.type}</p>
            <p  className = "mb-1">Schedule: {activeTask.schedule}</p>
            <p  className = "mb-1">Start Date: {activeTask.startDate.toDateString()}</p>
            {activeTask.dueDate && <p className="mb-1">Due Date: {activeTask.dueDate.toDateString()}</p>}
            <div className = "mt-4">
            <p   className = "mb-1">Novelty: {activeTask.novelty}</p>
            <p   className = "mb-1">Interest: {activeTask.interest}</p>
            <p   className = "mb-1">Urgency: {activeTask.urgency}</p>
            <p   className = "mb-1">Challenge: {activeTask.challenge}</p>
            </div>
          </div>
        ) : (
          <p>Select a task to view details</p>
        )}
      </div>
    </div>
  );
};

export default ADHDTaskManager;