import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

//ajuda a decidir qual é o banco de dados a ser usadio
const getDbPath = () => {
    return process.env.TEST_DB_PATH || 'db.json';
};

const adapter = new JSONFile(getDbPath())
const db = new Low(adapter, {
    users: [],
    tasks: [],
    blacklistedTokens: []
});

//evida que o arquivo se corrompa (acontecia de adicionar um } no final do arquivo)
//evita que o arquivo seja salvo com dados erradois (facilita na hora de testar, já que indica direto se é erro de consistencia)
const validateAndFixDb = (data) => {
    const defaultStructure = {
        users: [],
        tasks: [],
        blacklistedTokens: []
    };

    const validatedData = { ...defaultStructure, ...data };
    
    if (!Array.isArray(validatedData.users)) validatedData.users = [];
    if (!Array.isArray(validatedData.tasks)) validatedData.tasks = [];
    if (!Array.isArray(validatedData.blacklistedTokens)) validatedData.blacklistedTokens = [];
    
    validatedData.users = validatedData.users.map(u => ({ ...u, email: u.email || '' }));

    validatedData.blacklistedTokens = validatedData.blacklistedTokens.filter(token => 
        token && token !== 'undefined' && typeof token === 'string'
    );
    
    return validatedData;
};

/* 
    como usamos muito async await, é bom usar validação
    e a sobrescrita do read e write paara evitar erros de consistencia
*/

const originalWrite = db.write.bind(db);
db.write = async () => {
    db.data = validateAndFixDb(db.data);
    return await originalWrite();
};

const originalRead = db.read.bind(db);
db.read = async () => {
    await originalRead();
    db.data = validateAndFixDb(db.data);
    return db.data;
};

export default db;