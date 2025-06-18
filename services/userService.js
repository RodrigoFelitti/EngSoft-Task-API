import db from '../db.js';
import { v4 as uuid } from 'uuid';

export const getAllUsers = async () => {
  await db.read();
  return db.data.users;
};

export const getUserById = async (id) => {
  await db.read();
  return db.data.users.find(user => user.id === id);
};

export const createUser = async (userData) => {
  await db.read();

  const newUser = {
    id: uuid(),
    ...userData
  };

  db.data.users.push(newUser);
  await db.write();
  return newUser;
};

export const updateUser = async (id, updatedData) => {
  await db.read();

  const user = db.data.users.find(u => u.id === id);
  if (!user) return null;

  user.username = updatedData.username;
  user.age = updatedData.age;

  await db.write();
  return user;
};

export const deleteUser = async (id) => {
  await db.read();
  const index = db.data.users.findIndex(u => u.id === id);
  if (index === -1) return null;

  const deletedUser = db.data.users.splice(index, 1)[0];
  await db.write();
  return deletedUser;
};

export async function getUserByUsername(username) {
    await db.read();
    return db.data.users.find(u => u.username === username);
}

export const clearAll = async () => {
    await db.read();
    db.data.users = [];
    await db.write();
};