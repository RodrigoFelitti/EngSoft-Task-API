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

beforeAll(async () => {
    tempDbPath = createTempDb();
    process.env.TEST_DB_PATH = tempDbPath;
    app = (await import('../index.js')).default;
    userService = await import('../services/userService.js');

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
    const initialData = {
        users: [
            {
                id: '1',
                username: 'admin',
                age: 30
            }
        ],
        tasks: [],
        blacklistedTokens: []
    };
    fs.writeFileSync(tempDbPath, JSON.stringify(initialData, null, 2));
});

describe('User Controller', () => {
    test('POST /users - criar usuário', async () => {
        const res = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'Rodrigo', age: 25, email: 'rodrigo@email.com' });

        expect(res.status).toBe(201);
        expect(res.text).toBe('done');

        const user = await userService.getUserByUsername('Rodrigo');
        expect(user).toBeTruthy();
        expect(user.username).toBe('Rodrigo');
        expect(user.age).toBe(25);
        expect(user.email).toBe('rodrigo@email.com');
    });

    test('GET /users/:id - buscar usuário existente', async () => {
        const createRes = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'Rodrigo', age: 25, email: 'rodrigo@email.com' });

        expect(createRes.status).toBe(201);

        const user = await userService.getUserByUsername('Rodrigo');
        const userId = user.id;

        const res = await request(app)
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ username: 'Rodrigo', age: 25, email: 'rodrigo@email.com' });
    });

    test('DELETE /users/:id - deletar usuário', async () => {

        const createRes = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'Rodrigo', age: 25, email: 'rodrigo@email.com' });

        expect(createRes.status).toBe(201);

        const user = await userService.getUserByUsername('Rodrigo');
        const userId = user.id;

        const res = await request(app)
            .delete(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.text).toBe('done');
    });
});