'use client';
import React, { useState } from 'react';
import { TimeTaskItem, CountTaskItem, CheckListTaskItem } from './Item';
import { List } from '@mui/joy';

const TaskList = ({ tasks }) => {
    const [taskList, setTaskList] = useState(tasks);

    const updateTask = (index, updatedTask, sync) => {
        const newTaskList = [...taskList];
        newTaskList[index] = updatedTask;
        setTaskList(newTaskList);
        if (sync) {
            // sync with the server
        }
    };

    return (
        <List className='space-y-2'>
            {taskList.map((task, index) => {
                switch (task.criteria) {
                    case 'time':
                        return <TimeTaskItem key={index} task={task} updateTask={(updatedTask, sync=false) => updateTask(index, updatedTask, sync)} />;
                    case 'count':
                        return <CountTaskItem key={index} task={task} updateTask={(updatedTask, sync=false) => updateTask(index, updatedTask, sync)} />;
                    case 'checklist':
                        return <CheckListTaskItem key={index} task={task} updateTask={(updatedTask, sync=false) => updateTask(index, updatedTask, sync)} />;
                    default:
                        return null;
                }
            })}
        </List>
    );
};

export default TaskList;