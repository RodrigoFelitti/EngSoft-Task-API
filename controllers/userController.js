 import { v4 as uuid } from 'uuid';
import { users, setUsers } from '../data/users.js';
import { log } from '../middlewares/logger.js';
import * as userService from '../services/userService.js'

export const createUser = async (req, res) => {
  try {
    const user = req.body;
    const id = uuid();
    await userService.createUser({ ...user, id });

    log(`User created: username=${user.username}, id=${id}, age=${user.age}`);
    res.status(201).send('done');
  } catch (error) {
    log(`Error creating user: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      log(`User not found: id=${req.params.id}`);
      return res.status(404).send('User not found');
    }

    log(`User retrieved: id=${req.params.id}, username=${user.username}`);
    res.send({
      username: user.username,
      age: user.age
    });
  } catch (error) {
    log(`Error retrieving user: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

export const deleteUser = async (req, res) => { 
  try {
    const deleted = await userService.deleteUser(req.params.id);

    if (!deleted) {
      log(`Delete failed: User not found with id=${req.params.id}`);
      return res.status(404).send('User not found');
    }

    log(`User deleted: id=${req.params.id}, username=${deleted.username}`);
    res.send('done');
  } catch (error) {
    log(`Error deleting user: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

export const updateUser = async (req,res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);

    if (!updatedUser) {
      log(`Update failed: User not found with id=${req.params.id}`);
      return res.status(404).send('User not found');
    }

    log(`User updated: id=${req.params.id}, to username=${updatedUser.username}, age=${updatedUser.age}`);
    res.send('done');
  } catch (error) {
    log(`Error updating user: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};