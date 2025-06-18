import db from '../db.js';
import { v4 as uuid } from 'uuid';

export const createTask = async (task) => {
    await db.read();
    const newTask = {
        id: uuid(),
        ...task
    };
    db.data.tasks.push(newTask);
    await db.write();
    return newTask;
};

export const getTaskById = async (id) => {
    await db.read();
    return db.data.tasks.find(task => task.id === id);
};

export const deleteTask = async (id) => {
    await db.read();
    db.data.tasks = db.data.tasks.filter(task => task.id !== id);
    await db.write();
};

export const updateTask = async (id, updatedTask) => {
    await db.read();
    const index = db.data.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
        db.data.tasks[index] = updatedTask;
        await db.write();
    }
};

export const getTasksByAssignee = async (assigneeId) => {
    await db.read();
    return db.data.tasks.filter(task => task.assignee === assigneeId);
};

export const getTasksWithFilters = async (filters) => {
    await db.read();
    let filteredTasks = db.data.tasks;

    if (filters.status) {
        filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }

    if (filters.prioridade) {
        filteredTasks = filteredTasks.filter(task => (task.prioridade || 'normal') === filters.prioridade);
    }

    if (filters.deadlineAfter) {
        const deadlineDate = new Date(filters.deadlineAfter);
        filteredTasks = filteredTasks.filter(task => {
            if (!task.deadline) return false;
            const taskDeadline = new Date(task.deadline);
            return taskDeadline >= deadlineDate;
        });
    }

    return filteredTasks;
};