import { createLogger, format, transports } from 'winston';
import fs from 'fs';
import path from 'path';

// Cria a pasta logs se não existir
const logDir = './logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Nome do arquivo por execução
const executionTimestamp = new Date().toISOString().replace(/:/g, '-');
const logFilePath = path.join(logDir, `log-${executionTimestamp}.txt`);

// Formato
const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `[${info.timestamp}] ${info.message}`)
    ),
    transports: [
        new transports.File({ filename: logFilePath }),
        new transports.Console()
    ]
});

// Exporta uma função simples
export const log = (message) => {
    logger.log({ level: 'info', message });
};