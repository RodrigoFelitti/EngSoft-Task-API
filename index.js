import express from 'express';
import bodyParser from 'body-parser';
import db from './db.js';

import users from './routes/users.js';
import tasks from './routes/tasks.js';
import authRoutes from './routes/auth.js';

const app = express();

await db.read();

if (!db.data.users || db.data.users.length === 0) {
  const adminUser = { id: '1', username: 'admin', age: 30 };
  db.data.users = [adminUser];
  console.log('Usuário admin criado.');
  await db.write();
}

//userService.clearAll()

app.use(bodyParser.json());

app.use('/users', users);
app.use('/tasks', tasks);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('HelloFromHome');
});

export default app;
