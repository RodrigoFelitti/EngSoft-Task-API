import express from 'express'
import { createTask, getTask, deleteTask, updateTask, getTasksByAssignee, getTasksWithFilters } from '../controllers/taskController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, createTask);

router.get('/filter', authenticateToken, getTasksWithFilters);

router.get('/by-assignee', authenticateToken, getTasksByAssignee);

router.get('/:id', authenticateToken, getTask);

router.delete('/:id', authenticateToken, deleteTask);

router.put('/:id', authenticateToken,  updateTask);

export default router