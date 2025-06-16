import request from 'supertest';
import app from '../index.js';
import * as userService from '../services/userService.js'

let token;
let createdUserId;

beforeAll(async () => {
    const res = await request(app)
        .post('/auth/login')
        .send({ username: 'admin' });

    token = res.body.token;
});

afterAll(async () => {
    // Limpa todos os usuários (exceto o admin)
    const allUsers = await userService.getAllUsers();
    for (const user of allUsers) {
        if (user.username !== 'admin') {
            await userService.deleteUser(user.id);
        }
    }
});

describe('User Controller', () => {
    test('POST /users - criar usuário', async () => {
        const res = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'Rodrigo', age: 25 });

        expect(res.status).toBe(201);
        expect(res.text).toBe('done');

        const user = await userService.getUserByUsername('Rodrigo');
        createdUserId = user?.id;
    });

    test('GET /users/:id - buscar usuário existente', async () => {
        const res = await request(app)
            .get(`/users/${createdUserId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ username: 'Rodrigo', age: 25 });
    });

    test('DELETE /users/:id - deletar usuário', async () => {
        const res = await request(app)
            .delete(`/users/${createdUserId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.text).toBe('done');
    });
});