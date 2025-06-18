import express from 'express'
import { createTask, getTask, deleteTask, updateTask, getTasksByAssignee, getTasksWithFilters } from '../controllers/taskController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Criar nova tarefa
 *     description: Cria uma nova tarefa no sistema
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *           example:
 *             title: "Implementar API"
 *             status: "pending"
 *             assignee: "123e4567-e89b-12d3-a456-426614174000"
 *             descricao: "Criar endpoints para gerenciamento de tarefas"
 *             prioridade: "alta"
 *             deadline: "2025-01-15"
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *             example:
 *               id: "456e7890-e89b-12d3-a456-426614174000"
 *               title: "Implementar API"
 *               status: "pending"
 *               assignee: "123e4567-e89b-12d3-a456-426614174000"
 *               descricao: "Criar endpoints para gerenciamento de tarefas"
 *               prioridade: "alta"
 *               deadline: "2025-01-15"
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Title, status e assignee são obrigatórios"
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuário responsável não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Usuário responsável não encontrado"
 */
router.post('/', authenticateToken, createTask);

/**
 * @swagger
 * /tasks/filter:
 *   get:
 *     summary: Filtrar tarefas
 *     description: Retorna tarefas filtradas por status, prioridade ou deadline
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, done]
 *         description: Filtrar por status da tarefa
 *         example: "pending"
 *       - in: query
 *         name: prioridade
 *         schema:
 *           type: string
 *           enum: [baixa, normal, alta]
 *         description: Filtrar por prioridade da tarefa
 *         example: "alta"
 *       - in: query
 *         name: deadlineAfter
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar tarefas com deadline após esta data
 *         example: "2025-01-01"
 *       - in: query
 *         name: deadlineBefore
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar tarefas com deadline antes desta data
 *         example: "2025-12-31"
 *     responses:
 *       200:
 *         description: Lista de tarefas filtradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *             example:
 *               - id: "456e7890-e89b-12d3-a456-426614174000"
 *                 title: "Implementar API"
 *                 status: "pending"
 *                 assignee: "123e4567-e89b-12d3-a456-426614174000"
 *                 descricao: "Criar endpoints para gerenciamento de tarefas"
 *                 prioridade: "alta"
 *                 deadline: "2025-01-15"
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/filter', authenticateToken, getTasksWithFilters);

/**
 * @swagger
 * /tasks/by-assignee:
 *   get:
 *     summary: Buscar tarefas por responsável
 *     description: Retorna todas as tarefas atribuídas a um usuário específico
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: assignedTo
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário responsável
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Lista de tarefas do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *             example:
 *               - id: "456e7890-e89b-12d3-a456-426614174000"
 *                 title: "Implementar API"
 *                 status: "pending"
 *                 assignee: "123e4567-e89b-12d3-a456-426614174000"
 *                 descricao: "Criar endpoints para gerenciamento de tarefas"
 *                 prioridade: "alta"
 *                 deadline: "2025-01-15"
 *       400:
 *         description: ID do usuário não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "ID do usuário é obrigatório"
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Usuário não encontrado"
 */
router.get('/by-assignee', authenticateToken, getTasksByAssignee);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Buscar tarefa por ID
 *     description: Retorna os dados de uma tarefa específica
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único da tarefa
 *         example: "456e7890-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Tarefa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *             example:
 *               id: "456e7890-e89b-12d3-a456-426614174000"
 *               title: "Implementar API"
 *               status: "pending"
 *               assignee: "123e4567-e89b-12d3-a456-426614174000"
 *               descricao: "Criar endpoints para gerenciamento de tarefas"
 *               prioridade: "alta"
 *               deadline: "2025-01-15"
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Tarefa não encontrada"
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', authenticateToken, getTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Deletar tarefa
 *     description: Remove uma tarefa do sistema
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único da tarefa
 *         example: "456e7890-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Tarefa deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example: "done"
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Tarefa não encontrada"
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticateToken, deleteTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Atualizar tarefa
 *     description: Atualiza os dados de uma tarefa existente
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único da tarefa
 *         example: "456e7890-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *           example:
 *             title: "API Atualizada"
 *             status: "done"
 *             assignee: "123e4567-e89b-12d3-a456-426614174000"
 *             descricao: "Implementação concluída"
 *             prioridade: "baixa"
 *             deadline: "2025-01-20"
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example: "done"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Dados inválidos"
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Tarefa não encontrada"
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authenticateToken,  updateTask);

export default router