import db from '../db.js';

export const createTask = async (task) => {
    await db.read();
    db.data.tasks.push(task);
    await db.write();
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