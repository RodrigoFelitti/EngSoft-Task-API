import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// Permite especificar um caminho de arquivo para testes
const getDbPath = () => {
    return process.env.TEST_DB_PATH || 'db.json';
};

const adapter = new JSONFile(getDbPath())
const db = new Low(adapter, {
    users: [],
    tasks: [],
    blacklistedTokens: []
});

// Função para validar e corrigir a estrutura do banco
const validateAndFixDb = (data) => {
    const defaultStructure = {
        users: [],
        tasks: [],
        blacklistedTokens: []
    };

    // Garante que todas as propriedades existam
    const validatedData = { ...defaultStructure, ...data };
    
    // Garante que as propriedades sejam arrays
    if (!Array.isArray(validatedData.users)) validatedData.users = [];
    if (!Array.isArray(validatedData.tasks)) validatedData.tasks = [];
    if (!Array.isArray(validatedData.blacklistedTokens)) validatedData.blacklistedTokens = [];
    
    // Garante que todos os usuários tenham campo email
    validatedData.users = validatedData.users.map(u => ({ ...u, email: u.email || '' }));

    // Remove tokens inválidos
    validatedData.blacklistedTokens = validatedData.blacklistedTokens.filter(token => 
        token && token !== 'undefined' && typeof token === 'string'
    );
    
    return validatedData;
};

// Sobrescreve o método write para incluir validação
const originalWrite = db.write.bind(db);
db.write = async () => {
    db.data = validateAndFixDb(db.data);
    return await originalWrite();
};

// Sobrescreve o método read para incluir validação
const originalRead = db.read.bind(db);
db.read = async () => {
    await originalRead();
    db.data = validateAndFixDb(db.data);
    return db.data;
};

export default db;