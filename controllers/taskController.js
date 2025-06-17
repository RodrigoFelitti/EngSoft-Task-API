import { v4 as uuid } from 'uuid';
import * as taskService from '../services/taskService.js';
import * as userService from '../services/userService.js';
import { log } from '../middlewares/logger.js';
import { notifyDiscord } from '../middlewares/discordNotifier.js';


export const createTask = async (req, res) => {
    const task = req.body;
    const { title, status, assignee } = task;

    log(`Attempt to create task: ${JSON.stringify(task)}`);

    if (!title || !status || !assignee) {
        log('Task creation failed - Missing title, status or assignee');
        return res.status(400).json({ error: 'Title, status and assignee are required' });
    }

    const user = await userService.getUserById(assignee);
    if (!user) {
        log(`Task creation failed - Assignee not found: ${assignee}`);
        return res.status(404).json({ error: 'Assignee (User) not found' });
    }

    const id = uuid();
    const newTask = { id, title, status, assignee };
    await taskService.createTask(newTask);

    const username = await userService.getUserById(assignee);
    const message = `🆕 Nova tarefa criada: **${title}** (Status: ${status}) atribuída a <@${username.username}>`;
    await notifyDiscord(message);

    log(`Task [${title}] created with ID [${id}] assigned to user [${assignee}]`);
    res.status(201).json(newTask);
};

export const getTask = async (req, res) => {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
        log(`Task not found with id=${req.params.id}`);
        return res.status(404).send('Task not found');
    }

    const user = await userService.getUserById(task.assignee);
    const taskWithUser = {
        id: task.id,
        title: task.title,
        status: task.status,
        assignee: user ? {
            id: user.id,
            username: user.username,
            age: user.age
        } : null
    };

    log(`Task retrieved: id=${req.params.id}`);
    res.json(taskWithUser);
};


export const deleteTask = async (req, res) => {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
        log(`Delete failed: Task not found with id=${req.params.id}`);
        return res.status(404).send('Task not found');
    }

    await taskService.deleteTask(req.params.id);
    log(`Task deleted: id=${req.params.id}`);
    res.send('done');
};

export const updateTask = async (req, res) => {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
        log(`Update failed: Task not found with id=${req.params.id}`);
        return res.status(404).send('Task not found');
    }

    const updatedTask = {
        ...task,
        title: req.body.title,
        status: req.body.status,
        assignee: req.body.assignee
    };

    await taskService.updateTask(req.params.id, updatedTask);

    log(`Task updated: id=${req.params.id}, from=${JSON.stringify(task)} to=${JSON.stringify(updatedTask)}`);
    res.send('done');
};

// GET /tasks?assignedTo=someUserId

export const getTasksByAssignee = async (req, res) => {
    const { assignedTo } = req.query;

    if (!assignedTo) {
        log('Get tasks by assignee failed: missing assignedTo param');
        return res.status(400).json({ error: 'Parâmetro assignedTo é obrigatório.' });
    }

    const user = await userService.getUserById(assignedTo);
    if (!user) {
        log(`User not found with id=${assignedTo}`);
        return res.status(404).json({ error: 'Assignee (User) not found' });
    }

    const filteredTasks = await taskService.getTasksByAssignee(assignedTo);

    const tasksWithUser = filteredTasks.map(task => ({
        id: task.id,
        title: task.title,
        status: task.status,
        assignee: {
            id: user.id,
            username: user.username,
            age: user.age
        }
    }));

    log(`Tasks retrieved for assignee=${assignedTo}: total=${filteredTasks.length}`);
    res.json(tasksWithUser);
};