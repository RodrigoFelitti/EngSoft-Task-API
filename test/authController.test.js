import request from 'supertest';
import app from '../index.js';
import * as userService from '../services/userService.js'

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