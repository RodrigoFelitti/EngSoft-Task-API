import jwt from 'jsonwebtoken';
import * as userService from '../services/userService.js'
import * as authService from '../services/authService.js'

const JWT_SECRET = 'senha';

// POST /auth/login
export const loginUser = async (req, res) => {
    const { username } = req.body;

    const user = await userService.getUserByUsername(username);

    if (!user) {
        return res.status(401).json({ error: 'User not found' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: '1h',
    });

    res.json({ token });
};

// POST /auth/logout
export const logoutUser = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    await authService.addToken(token);

    res.json({ message: 'Logged out successfully' });
};