import request from 'supertest';
import app from '../index.js';
import * as userService from '../services/userService.js';
import * as taskService from '../services/taskService.js';

let token;
let userId;
let taskId;

beforeAll(async () => {
    const res = await request(app)
        .post('/auth/login')
        .send({ username: 'admin' });

    token = res.body.token;

    // Cria um usuário para atribuição das tarefas
    await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'TaskUser', age: 30 });

    const user = await userService.getUserByUsername('TaskUser');
    userId = await user.id;
});

afterAll(async () => {
    // Limpa as tarefas criadas
    const allTasks = await taskService.getTasksByAssignee(userId);
    for (const task of allTasks) {
        await taskService.deleteTask(task.id);
    }

    // Remove o usuário criado
    await userService.deleteUser(userId);
});

describe('Task Controller', () => {
    test('POST /tasks - criar task', async () => {
        const taskData = {
            title: 'Estudar para a prova',
            status: 'pending',
            assignee: userId
        };

        const res = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(taskData);

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            title: 'Estudar para a prova',
            status: 'pending',
            assignee: userId
        });

        taskId = res.body.id;
    });

    test('GET /tasks/:id - buscar task existente', async () => {
        const res = await request(app)
            .get(`/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            id: taskId,
            title: 'Estudar para a prova',
            status: 'pending',
            assignee: {
                id: userId,
                username: 'TaskUser',
                age: 30
            }
        });
    });

    test('DELETE /tasks/:id - deletar task', async () => {
        const res = await request(app)
            .delete(`/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.text).toBe('done');
    });
});