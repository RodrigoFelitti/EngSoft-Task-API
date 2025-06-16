import db from '../db.js';

export const addToken = async (token) => {
    await db.read();
    db.data.blacklistedTokens.push(token);
    await db.write();
};

export const getAllTokens = async () => {
  await db.read();
  return db.data.blacklistedTokens;
};