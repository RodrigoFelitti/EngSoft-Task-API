import express from 'express'
import { createTask, getTask, deleteTask, updateTask, getTasksByAssignee } from '../controllers/taskController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/', authenticateToken, createTask);

router.get('/:id', authenticateToken, getTask);

router.get('/', authenticateToken, getTasksByAssignee);

router.delete('/:id', authenticateToken, deleteTask);

router.put('/:id', authenticateToken,  updateTask);

export default router