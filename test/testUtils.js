import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
    cada teste tem um banco de dados temporário
    para garantir que os testes não afetem o banco de dados principal
    usamos mocks para o banco de dados dos testes e depois limpamos o banco de dados
*/
export const createTempDb = () => {
    const tempDbPath = path.join(__dirname, `../temp-db-${Date.now()}-${Math.random()}.json`);
    
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
    return tempDbPath;
};

export const cleanupTempDb = (dbPath) => {
    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }
};

export const createMockDb = () => {
    return {
        data: {
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
        }
    };
}; 