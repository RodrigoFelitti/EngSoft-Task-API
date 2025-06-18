import { v4 as uuid } from 'uuid';
import * as taskService from '../services/taskService.js';
import * as userService from '../services/userService.js';
import { log } from '../middlewares/logger.js';
import { notifyDiscord } from '../middlewares/discordNotifier.js';


export const createTask = async (req, res) => {
    const task = req.body;
    const { title, status, assignee, descricao, prioridade, deadline } = task;

    log(`Attempt to create task: title=${title}, status=${status}, assignee=${assignee}, descricao=${descricao || 'N/A'}, prioridade=${prioridade || 'N/A'}, deadline=${deadline || 'N/A'}`);

    if (!title || !status || !assignee) {
        log(`Task creation failed - Missing required fields: title=${title}, status=${status}, assignee=${assignee}`);
        return res.status(400).json({ error: 'Title, status and assignee are required' });
    }

    const user = await userService.getUserById(assignee);
    if (!user) {
        log(`Task creation failed - Assignee not found: assignee=${assignee}`);
        return res.status(404).json({ error: 'Assignee (User) not found' });
    }

    const id = uuid();
    const newTask = { 
        id, 
        title, 
        status, 
        assignee, 
        descricao: descricao || '', 
        prioridade: prioridade || 'normal',
        deadline: deadline || null
    };
    await taskService.createTask(newTask);

    const username = await userService.getUserById(assignee);
    const message = `🆕 Nova tarefa criada: **${title}** (Status: ${status}) atribuída a <@${username.username}>`;
    await notifyDiscord(message);

    log(`Task created successfully: id=${id}, title=${title}, status=${status}, assignee=${assignee} (${username.username}), descricao=${descricao || 'N/A'}, prioridade=${prioridade || 'normal'}, deadline=${deadline || 'N/A'}`);
    res.status(201).json(newTask);
};

export const getTask = async (req, res) => {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
        log(`Task not found: id=${req.params.id}`);
        return res.status(404).send('Task not found');
    }

    const user = await userService.getUserById(task.assignee);
    const taskWithUser = {
        id: task.id,
        title: task.title,
        status: task.status,
        descricao: task.descricao || '',
        prioridade: task.prioridade || 'normal',
        deadline: task.deadline || null,
        assignee: user ? {
            id: user.id,
            username: user.username,
            age: user.age,
            email: user.email
        } : null
    };

    log(`Task retrieved successfully: id=${task.id}, title=${task.title}, status=${task.status}, assignee=${user ? user.username : 'N/A'}, descricao=${task.descricao || 'N/A'}, prioridade=${task.prioridade || 'normal'}, deadline=${task.deadline || 'N/A'}`);
    res.json(taskWithUser);
};


export const deleteTask = async (req, res) => {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
        log(`Delete failed - Task not found: id=${req.params.id}`);
        return res.status(404).send('Task not found');
    }

    const user = await userService.getUserById(task.assignee);
    await taskService.deleteTask(req.params.id);
    log(`Task deleted successfully: id=${task.id}, title=${task.title}, status=${task.status}, assignee=${user ? user.username : 'N/A'}, descricao=${task.descricao || 'N/A'}, prioridade=${task.prioridade || 'normal'}, deadline=${task.deadline || 'N/A'}`);
    res.send('done');
};

export const updateTask = async (req, res) => {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
        log(`Update failed - Task not found: id=${req.params.id}`);
        return res.status(404).send('Task not found');
    }

    const updatedTask = {
        ...task,
        title: req.body.title,
        status: req.body.status,
        assignee: req.body.assignee,
        descricao: req.body.descricao || task.descricao || '',
        prioridade: req.body.prioridade || task.prioridade || 'normal',
        deadline: req.body.deadline || task.deadline || null
    };

    await taskService.updateTask(req.params.id, updatedTask);

    const username = await userService.getUserById(updatedTask.assignee);
    const message = `:up: Tarefa **${updatedTask.title}** modificada: (Status: ${updatedTask.status}) atribuída a <@${username.username}>`;
    await notifyDiscord(message);

    log(`Task updated successfully: id=${task.id}, title=${updatedTask.title}, status=${updatedTask.status}, assignee=${username.username}, descricao=${updatedTask.descricao || 'N/A'}, prioridade=${updatedTask.prioridade || 'normal'}, deadline=${updatedTask.deadline || 'N/A'}`);
    res.send('done');
};

// GET /tasks?assignedTo=someUserId

export const getTasksByAssignee = async (req, res) => {
    const { assignedTo } = req.query;

    if (!assignedTo) {
        log('Get tasks by assignee failed - Missing required parameter: assignedTo');
        return res.status(400).json({ error: 'Parâmetro assignedTo é obrigatório.' });
    }

    const user = await userService.getUserById(assignedTo);
    if (!user) {
        log(`Get tasks by assignee failed - User not found: assignedTo=${assignedTo}`);
        return res.status(404).json({ error: 'Assignee (User) not found' });
    }

    const filteredTasks = await taskService.getTasksByAssignee(assignedTo);

    const tasksWithUser = filteredTasks.map(task => ({
        id: task.id,
        title: task.title,
        status: task.status,
        descricao: task.descricao || '',
        prioridade: task.prioridade || 'normal',
        deadline: task.deadline || null,
        assignee: {
            id: user.id,
            username: user.username,
            age: user.age,
            email: user.email
        }
    }));

    log(`Tasks retrieved by assignee successfully: assignee=${user.username} (${assignedTo}), total=${filteredTasks.length}`);
    res.json(tasksWithUser);
};