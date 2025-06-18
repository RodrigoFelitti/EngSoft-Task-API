import db from '../db.js';

export const addToken = async (token) => {
    if (!token || token === 'undefined') {
        return; // Não adiciona tokens inválidos
    }
    
    await db.read();
    db.data.blacklistedTokens.push(token);
    await db.write();
};

export const getAllTokens = async () => {
  await db.read();
  return db.data.blacklistedTokens;
};