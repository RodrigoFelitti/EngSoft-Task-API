import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import request from 'supertest';
import { createTempDb, cleanupTempDb } from './testUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let token;
let tempDbPath;
let app;
let userService;
let taskService;

beforeAll(async () => {
    tempDbPath = createTempDb();
    process.env.TEST_DB_PATH = tempDbPath;
    app = (await import('../index.js')).default;
    userService = await import('../services/userService.js');
    taskService = await import('../services/taskService.js');

    const res = await request(app)
        .post('/auth/login')
        .send({ username: 'admin' });

    token = res.body.token;
});

afterAll(async () => {
    cleanupTempDb(tempDbPath);
    delete process.env.TEST_DB_PATH;
});

beforeEach(async () => {
    // Reset do banco antes de cada teste
    const initialData = {
        users: [
            {
                id: '1',
                username: 'admin',
                age: 30,
                email: 'admin@email.com'
            }
        ],
        tasks: [],
        blacklistedTokens: []
    };
    fs.writeFileSync(tempDbPath, JSON.stringify(initialData, null, 2));
});

describe('Task Controller', () => {
    test('POST /tasks - criar task', async () => {
        // Cria um usuário para este teste específico
        const userRes = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'TaskUser', age: 30, email: 'taskuser@email.com' });

        expect(userRes.status).toBe(201);

        const user = await userService.getUserByUsername('TaskUser');
        const userId = user.id;

        const taskData = {
            title: 'Estudar para a prova',
            status: 'pending',
            assignee: userId,
            descricao: 'Preciso estudar matemática para a prova final'
        };

        const res = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(taskData);

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            title: 'Estudar para a prova',
            status: 'pending',
            assignee: userId,
            descricao: 'Preciso estudar matemática para a prova final'
        });
        expect(res.body.id).toBeDefined();

        // Testa buscar a task criada
        const getRes = await request(app)
            .get(`/tasks/${res.body.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getRes.status).toBe(200);
        expect(getRes.body).toMatchObject({
            id: res.body.id,
            title: 'Estudar para a prova',
            status: 'pending',
            descricao: 'Preciso estudar matemática para a prova final',
            assignee: {
                id: userId,
                username: 'TaskUser',
                age: 30
            }
        });

        // Testa deletar a task criada
        const deleteRes = await request(app)
            .delete(`/tasks/${res.body.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(deleteRes.status).toBe(200);
        expect(deleteRes.text).toBe('done');
    });

    test('POST /tasks - criar task sem descricao', async () => {
        // Cria um usuário para este teste específico
        const userRes = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'TaskUser2', age: 25, email: 'taskuser2@email.com' });

        expect(userRes.status).toBe(201);

        const user = await userService.getUserByUsername('TaskUser2');
        const userId = user.id;

        const taskData = {
            title: 'Fazer exercícios',
            status: 'doing',
            assignee: userId
        };

        const res = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(taskData);

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            title: 'Fazer exercícios',
            status: 'doing',
            assignee: userId,
            descricao: ''
        });
    });

    test('GET /tasks/:id - buscar task inexistente', async () => {
        const res = await request(app)
            .get('/tasks/non-existent-id')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(res.text).toBe('Task not found');
    });

    test('DELETE /tasks/:id - deletar task inexistente', async () => {
        const res = await request(app)
            .delete('/tasks/non-existent-id')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(res.text).toBe('Task not found');
    });
});