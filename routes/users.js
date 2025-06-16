import express from 'express'
import { createUser, getUser, deleteUser, updateUser } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, createUser);

router.get('/:id', authenticateToken, getUser);

router.delete('/:id', authenticateToken, deleteUser);

router.put('/:id', authenticateToken, updateUser);

export default router