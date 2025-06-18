import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import request from 'supertest';
import { createTempDb, cleanupTempDb } from './testUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tempDbPath;
let app;
let userService;

beforeAll(async () => {
    tempDbPath = createTempDb();
    process.env.TEST_DB_PATH = tempDbPath;
    app = (await import('../index.js')).default;
    userService = await import('../services/userService.js');
});

afterAll(async () => {
    cleanupTempDb(tempDbPath);
    delete process.env.TEST_DB_PATH;
});

beforeEach(async () => {
    //reseta o banco de dados
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

describe('Auth Controller', () => {
    test('POST /auth/login - deve retornar um token válido', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'admin' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(typeof response.body.token).toBe('string');
    });

    test('POST /auth/login - erro se usuário não existir', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'naoexiste' });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    });
});