import { v4 as uuid } from 'uuid';
import { log } from '../middlewares/logger.js';
import * as userService from '../services/userService.js'

export const createUser = async (req, res) => {
  try {
    const { username, age, email } = req.body;
    if (!username || !email) {
      log(`User creation failed - Missing required fields: username=${username}, email=${email}`);
      return res.status(400).json({ error: 'Username e email são obrigatórios' });
    }
    const id = uuid();
    await userService.createUser({ username, age, email, id });

    log(`User created successfully: id=${id}, username=${username}, age=${age}, email=${email}`);
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

    log(`User retrieved successfully: id=${user.id}, username=${user.username}, age=${user.age}, email=${user.email}`);
    res.send({
      username: user.username,
      age: user.age,
      email: user.email
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
      log(`Delete failed - User not found: id=${req.params.id}`);
      return res.status(404).send('User not found');
    }

    log(`User deleted successfully: id=${deleted.id}, username=${deleted.username}, age=${deleted.age}, email=${deleted.email}`);
    res.send('done');
  } catch (error) {
    log(`Error deleting user: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

export const updateUser = async (req,res) => {
  try {
    const { username, age, email } = req.body;
    if (!username || !email) {
      log(`User update failed - Missing required fields: username=${username}, email=${email}`);
      return res.status(400).json({ error: 'Username e email são obrigatórios' });
    }
    const updatedUser = await userService.updateUser(req.params.id, { username, age, email });

    if (!updatedUser) {
      log(`Update failed - User not found: id=${req.params.id}`);
      return res.status(404).send('User not found');
    }

    log(`User updated successfully: id=${updatedUser.id}, username=${updatedUser.username}, age=${updatedUser.age}, email=${updatedUser.email}`);
    res.send('done');
  } catch (error) {
    log(`Error updating user: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};