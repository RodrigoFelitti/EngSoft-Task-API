import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cria um arquivo de banco de dados temporário para cada teste
export const createTempDb = () => {
    const tempDbPath = path.join(__dirname, `../temp-db-${Date.now()}-${Math.random()}.json`);
    
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
    return tempDbPath;
};

// Remove o arquivo temporário
export const cleanupTempDb = (dbPath) => {
    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }
};

// Mock do banco de dados em memória
export const createMockDb = () => {
    return {
        data: {
            users: [
                {
                    id: '1',
                    username: 'admin',
                    age: 30
                }
            ],
            tasks: [],
            blacklistedTokens: []
        }
    };
}; 