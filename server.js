import app from './index.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
