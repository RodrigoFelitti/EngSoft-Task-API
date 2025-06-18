import express from 'express'
import { createUser, getUser, deleteUser, updateUser } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar novo usuário
 *     description: Cria um novo usuário no sistema
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             username: "joao"
 *             age: 25
 *             email: "joao@email.com"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example: "done"
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             example:
 *               error: "Username e email são obrigatórios"
 *       401:
 *         description: Token inválido ou não fornecido
 */
router.post('/', authenticateToken, createUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     description: Retorna os dados de um usuário específico
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único do usuário
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: "123e4567-e89b-12d3-a456-426614174000"
 *               username: "joao"
 *               age: 25
 *               email: "joao@email.com"
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: "Usuário não encontrado"
 *       401:
 *         description: Token inválido ou não fornecido
 */
router.get('/:id', authenticateToken, getUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deletar usuário
 *     description: Remove um usuário do sistema
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único do usuário
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example: "done"
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: "Usuário não encontrado"
 *       401:
 *         description: Token inválido ou não fornecido
 */
router.delete('/:id', authenticateToken, deleteUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     description: Atualiza os dados de um usuário existente
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único do usuário
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             username: "joao_silva"
 *             age: 26
 *             email: "joao.silva@email.com"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example: "done"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: "Dados inválidos"
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: "Usuário não encontrado"
 *       401:
 *         description: Token inválido ou não fornecido
 */
router.put('/:id', authenticateToken, updateUser);

export default router