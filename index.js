import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger.js';
import db from './db.js';

import users from './routes/users.js';
import tasks from './routes/tasks.js';
import authRoutes from './routes/auth.js';

const app = express();

const initializeDb = async () => {
    await db.read();
    
    if (!db.data.users || db.data.users.length === 0) {
        const adminUser = { id: '1', username: 'admin', age: 30 };
        db.data.users = [adminUser];
        console.log('Usuário admin criado.');
        await db.write();
    }
};

app.use(async (req, res, next) => {
    if (!db.data.users) {
        await initializeDb();
    }
    next();
});

app.use(bodyParser.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API de Gerenciamento de Tarefas - Documentação'
}));

app.use('/users', users);
app.use('/tasks', tasks);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('HelloFromHome');
});

export default app;
