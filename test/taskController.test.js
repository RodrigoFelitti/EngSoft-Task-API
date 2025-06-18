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
        /*
        oss testes envolvem a criação, deleção e busca de tasks a partir da task criada,
        para garantir que a task foi criada corretamente e que operações de busca e deleção
        estão funcionando corretamente para aquela task
        */

        //cria user pra teste
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
            descricao: 'Preciso estudar matemática para a prova final',
            prioridade: 'alta',
            deadline: '2024-12-31'
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
            descricao: 'Preciso estudar matemática para a prova final',
            prioridade: 'alta',
            deadline: '2024-12-31'
        });
        expect(res.body.id).toBeDefined();

        const getRes = await request(app)
            .get(`/tasks/${res.body.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getRes.status).toBe(200);
        expect(getRes.body).toMatchObject({
            id: res.body.id,
            title: 'Estudar para a prova',
            status: 'pending',
            descricao: 'Preciso estudar matemática para a prova final',
            prioridade: 'alta',
            deadline: '2024-12-31',
            assignee: {
                id: userId,
                username: 'TaskUser',
                age: 30,
                email: 'taskuser@email.com'
            }
        });

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
            descricao: '',
            prioridade: 'normal',
            deadline: null
        });
    });

    //testes de algumas exceções
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

    test('GET /tasks - filtro avançado de tarefas', async () => {
        // Cria usuários para o teste
        const user1Res = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'User1', age: 25, email: 'user1@email.com' });

        const user2Res = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'User2', age: 30, email: 'user2@email.com' });

        expect(user1Res.status).toBe(201);
        expect(user2Res.status).toBe(201);

        const user1 = await userService.getUserByUsername('User1');
        const user2 = await userService.getUserByUsername('User2');

        const tasks = [
            {
                title: 'Tarefa Alta Prioridade',
                status: 'done',
                assignee: user1.id,
                descricao: 'Tarefa concluída alta prioridade',
                prioridade: 'alta',
                deadline: '2025-06-15'
            },
            {
                title: 'Tarefa Normal',
                status: 'pending',
                assignee: user2.id,
                descricao: 'Tarefa pendente normal',
                prioridade: 'normal',
                deadline: '2025-05-15'
            },
            {
                title: 'Tarefa Alta Prioridade Pendente',
                status: 'pending',
                assignee: user1.id,
                descricao: 'Tarefa pendente alta prioridade',
                prioridade: 'alta',
                deadline: '2025-07-01'
            }
        ];

        for (const taskData of tasks) {
            const res = await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send(taskData);
            expect(res.status).toBe(201);
        }

        const statusFilterRes = await request(app)
            .get('/tasks/filter?status=done')
            .set('Authorization', `Bearer ${token}`);

        expect(statusFilterRes.status).toBe(200);
        expect(statusFilterRes.body).toHaveLength(1);
        expect(statusFilterRes.body[0].status).toBe('done');

        const priorityFilterRes = await request(app)
            .get('/tasks/filter?prioridade=alta')
            .set('Authorization', `Bearer ${token}`);

        expect(priorityFilterRes.status).toBe(200);
        expect(priorityFilterRes.body).toHaveLength(2);
        expect(priorityFilterRes.body.every(task => task.prioridade === 'alta')).toBe(true);

        const deadlineFilterRes = await request(app)
            .get('/tasks/filter?deadlineAfter=2025-06-01')
            .set('Authorization', `Bearer ${token}`);

        expect(deadlineFilterRes.status).toBe(200);
        expect(deadlineFilterRes.body).toHaveLength(2);
        expect(deadlineFilterRes.body.every(task => new Date(task.deadline) >= new Date('2025-06-01'))).toBe(true);

        const combinedFilterRes = await request(app)
            .get('/tasks/filter?status=pending&prioridade=alta')
            .set('Authorization', `Bearer ${token}`);

        expect(combinedFilterRes.status).toBe(200);
        expect(combinedFilterRes.body).toHaveLength(1);
        expect(combinedFilterRes.body[0].status).toBe('pending');
        expect(combinedFilterRes.body[0].prioridade).toBe('alta');

        const assigneeFilterRes = await request(app)
            .get('/tasks/by-assignee?assignedTo=' + user1.id)
            .set('Authorization', `Bearer ${token}`);

        expect(assigneeFilterRes.status).toBe(200);
        expect(assigneeFilterRes.body).toHaveLength(2);
        expect(assigneeFilterRes.body.every(task => task.assignee.id === user1.id)).toBe(true);
    });
});