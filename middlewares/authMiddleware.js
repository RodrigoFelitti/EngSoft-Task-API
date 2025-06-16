import jwt from 'jsonwebtoken';
import { log } from '../middlewares/logger.js';
import * as authService from '../services/authService.js'

const JWT_SECRET = 'senha';

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const blacklistedTokens = await authService.getAllTokens();

    log(`Authentication attempt - Header: ${authHeader}`);

    if (!token) {
        log('Authentication failed - No token provided');
        return res.sendStatus(401);
    }

    if (blacklistedTokens.includes(token)) {
        log(`Authentication failed - Token blacklisted: ${token}`);
        return res.status(403).json({ error: 'Token has been revoked' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {

        if (err) {
            log(`Authentication failed - Invalid token: ${token}`);
            return res.sendStatus(403);
        };

        log(`Authentication successful - User: ${JSON.stringify(user)}`);
        req.user = user;
        next();
    });
};